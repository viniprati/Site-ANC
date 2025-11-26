const express = require('express');
const router = express.Router();
const db = require('../database');

// ==================================================================
// MIDDLEWARE DE AUTENTICAÇÃO
// ==================================================================
// Garante que o usuário está logado antes de fazer ações na guilda
const ensureAuth = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    // Se usar sessão manual (ex: req.session.user ou req.user)
    if (req.user) {
        return next();
    }
    res.status(401).json({ error: 'Você precisa estar logado para realizar esta ação.' });
};

// ==================================================================
// ROTAS PÚBLICAS (Não precisa de login)
// ==================================================================

// 1. Ranking de Guildas
router.get('/ranking', (req, res) => {
    db.all(`SELECT id, name, points FROM guilds ORDER BY points DESC LIMIT 10`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ==================================================================
// ROTAS PRIVADAS (Precisa de login)
// ==================================================================

// 2. Criar uma nova Guilda
router.post('/', ensureAuth, (req, res) => {
    const { name } = req.body;
    const ownerId = req.user.id;

    if (!name || name.length < 3 || name.length > 20) {
        return res.status(400).json({ error: 'Nome da guilda deve ter entre 3 e 20 caracteres.' });
    }

    // Verifica se o usuário já tem guilda
    db.get(`SELECT * FROM members WHERE user_id = ?`, [ownerId], (err, row) => {
        if (row) return res.status(400).json({ error: 'Você já está em uma guilda.' });

        // Cria a guilda
        db.run(`INSERT INTO guilds (name, owner_id) VALUES (?, ?)`, [name, ownerId], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE')) return res.status(400).json({ error: 'Nome de guilda já existe.' });
                return res.status(500).json({ error: err.message });
            }
            
            const guildId = this.lastID;

            // Adiciona o dono como membro (Líder)
            db.run(`INSERT INTO members (user_id, guild_id, role) VALUES (?, ?, ?)`, [ownerId, guildId, 'leader'], (err) => {
                if (err) return res.status(500).json({ error: 'Erro ao adicionar líder.' });
                res.json({ message: 'Guilda criada com sucesso!', guildId });
            });
        });
    });
});

// 3. Obter minha Guilda
router.get('/my-guild', ensureAuth, (req, res) => {
    const userId = req.user.id;

    // Busca a guilda que o usuário faz parte
    const sql = `
        SELECT g.* 
        FROM guilds g
        JOIN members m ON g.id = m.guild_id
        WHERE m.user_id = ?
    `;

    db.get(sql, [userId], (err, guild) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!guild) return res.status(404).json({ error: 'Você não tem guilda.' });

        // Busca os membros dessa guilda
        db.all(`SELECT user_id, role FROM members WHERE guild_id = ?`, [guild.id], (err, members) => {
            if (err) return res.status(500).json({ error: 'Erro ao buscar membros.' });
            guild.members = members;
            res.json(guild);
        });
    });
});

// ==================================================================
// ROTAS DE CONVITES (SISTEMA NOVO)
// ==================================================================

// 4. Enviar Convite (Apenas Líder)
// Rota: POST /api/guilds/:guildId/invite
router.post('/:guildId/invite', ensureAuth, (req, res) => {
    const { guildId } = req.params;
    const { receiverId } = req.body; // ID do usuário convidado
    const senderId = req.user.id;    // ID de quem enviou (Líder)

    if (!receiverId) return res.status(400).json({ error: 'ID do usuário inválido.' });
    if (senderId === receiverId) return res.status(400).json({ error: 'Você não pode convidar a si mesmo.' });

    // 1. Verifica se quem enviou é dono da guilda
    db.get(`SELECT owner_id FROM guilds WHERE id = ?`, [guildId], (err, guild) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!guild || guild.owner_id !== senderId) {
            return res.status(403).json({ error: 'Apenas o líder pode enviar convites.' });
        }

        // 2. Verifica se o usuário já está em alguma guilda
        db.get(`SELECT guild_id FROM members WHERE user_id = ?`, [receiverId], (err, member) => {
            if (member) return res.status(400).json({ error: 'Este usuário já está em uma guilda.' });

            // 3. Verifica se já existe convite pendente
            db.get(`SELECT id FROM invites WHERE guild_id = ? AND receiver_id = ?`, [guildId, receiverId], (err, invite) => {
                if (invite) return res.status(400).json({ error: 'Já existe um convite pendente para este usuário.' });

                // 4. Cria o convite
                db.run(`INSERT INTO invites (guild_id, sender_id, receiver_id) VALUES (?, ?, ?)`, 
                    [guildId, senderId, receiverId], 
                    function(err) {
                        if (err) return res.status(500).json({ error: err.message });
                        res.json({ message: 'Convite enviado com sucesso!' });
                    }
                );
            });
        });
    });
});

// 5. Listar Meus Convites Pendentes
// Rota: GET /api/guilds/my-invites
router.get('/my-invites', ensureAuth, (req, res) => {
    const userId = req.user.id;

    const sql = `
        SELECT invites.id, guilds.name as guild_name, invites.created_at
        FROM invites
        JOIN guilds ON invites.guild_id = guilds.id
        WHERE invites.receiver_id = ? AND invites.status = 'pending'
        ORDER BY invites.created_at DESC
    `;

    db.all(sql, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 6. Aceitar ou Recusar Convite
// Rota: POST /api/guilds/invites/:inviteId/:action (action = accept ou reject)
router.post('/invites/:inviteId/:action', ensureAuth, (req, res) => {
    const { inviteId, action } = req.params;
    const userId = req.user.id;

    if (!['accept', 'reject'].includes(action)) {
        return res.status(400).json({ error: 'Ação inválida.' });
    }

    // Busca o convite para garantir que pertence ao usuário logado
    db.get(`SELECT * FROM invites WHERE id = ? AND receiver_id = ?`, [inviteId, userId], (err, invite) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!invite) return res.status(404).json({ error: 'Convite não encontrado.' });

        if (action === 'reject') {
            // Se recusar, apenas deleta o convite
            db.run(`DELETE FROM invites WHERE id = ?`, [inviteId], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Convite recusado.' });
            });
        } 
        else if (action === 'accept') {
            // Se aceitar:
            // 1. Verifica novamente se o usuário já não entrou em outra guilda nesse meio tempo
            db.get(`SELECT user_id FROM members WHERE user_id = ?`, [userId], (err, existingMember) => {
                if (existingMember) {
                    // Se já tem guilda, deleta o convite e avisa
                    db.run(`DELETE FROM invites WHERE id = ?`, [inviteId]);
                    return res.status(400).json({ error: 'Você já está em uma guilda.' });
                }

                // 2. Adiciona na tabela de membros
                db.run(`INSERT INTO members (user_id, guild_id, role) VALUES (?, ?, ?)`, 
                    [userId, invite.guild_id, 'member'], 
                    (err) => {
                        if (err) return res.status(500).json({ error: 'Erro ao entrar na guilda.' });

                        // 3. Deleta o convite aceito (e opcionalmente outros convites pendentes do usuário)
                        db.run(`DELETE FROM invites WHERE receiver_id = ?`, [userId], (err) => {
                            res.json({ message: 'Parabéns! Você entrou na guilda.' });
                        });
                    }
                );
            });
        }
    });
});

module.exports = router;
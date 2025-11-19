const express = require('express');
const router = express.Router();
const db = require('../database');

// ROTA NOVA: Buscar os detalhes da guilda do usuário logado
router.get('/api/my-guild', (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Não autenticado' });

    const userId = req.session.user.id;

    // 1. Acha a guilda do usuário
    db.get('SELECT guild_id FROM members WHERE user_id = ?', [userId], (err, memberRow) => {
        if (err) return res.status(500).json({ error: 'Erro no servidor' });
        if (!memberRow) return res.status(404).json({ error: 'Você não está em uma guilda' }); // Usuário não tem guilda

        const guildId = memberRow.guild_id;

        // 2. Acha os detalhes da guilda
        db.get('SELECT * FROM guilds WHERE id = ?', [guildId], (err, guildRow) => {
            if (err) return res.status(500).json({ error: 'Erro no servidor' });
            if (!guildRow) return res.status(404).json({ error: 'Guilda não encontrada' });

            // 3. Acha todos os membros da guilda
            db.all('SELECT user_id FROM members WHERE guild_id = ?', [guildId], (err, memberRows) => {
                if (err) return res.status(500).json({ error: 'Erro no servidor' });
                
                guildRow.members = memberRows; // Adiciona a lista de membros ao objeto da guilda
                res.json(guildRow);
            });
        });
    });
});


// Rota para CRIAR uma guilda
router.post('/api/guilds', (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Não autenticado' });

    const { name } = req.body;
    const ownerId = req.session.user.id;

    if (!name || name.length < 3 || name.length > 20) {
        return res.status(400).json({ error: 'O nome da guilda deve ter entre 3 e 20 caracteres.' });
    }

    db.run('INSERT INTO guilds (name, owner_id) VALUES (?, ?)', [name, ownerId], function(err) {
        if (err) return res.status(500).json({ error: 'Nome de guilda já existe ou erro no servidor.' });
        
        const guildId = this.lastID;
        db.run('INSERT INTO members (user_id, guild_id) VALUES (?, ?)', [ownerId, guildId], (err) => {
            if (err) return res.status(500).json({ error: 'Erro ao adicionar membro.' });
            res.status(201).json({ id: guildId, name, owner_id: ownerId, points: 0 });
        });
    });
});

// Rota para ADICIONAR um membro (com validação de dono e limite)
router.post('/api/guilds/:id/members', (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Não autenticado' });

    const { newMemberId } = req.body;
    const guildId = req.params.id;
    const requesterId = req.session.user.id;

    // 1. Verifica se quem está convidando é o dono da guilda
    db.get('SELECT owner_id FROM guilds WHERE id = ?', [guildId], (err, guild) => {
        if (err || !guild) return res.status(404).json({ error: 'Guilda não encontrada.' });
        if (guild.owner_id !== requesterId) return res.status(403).json({ error: 'Apenas o dono pode convidar membros.' });

        // 2. Verifica se a guilda não está cheia
        db.get('SELECT COUNT(*) as count FROM members WHERE guild_id = ?', [guildId], (err, row) => {
            if (err) return res.status(500).json({ error: 'Erro no servidor.' });
            if (row.count >= 10) return res.status(400).json({ error: 'A guilda está cheia (limite de 10 membros).' });

            // 3. Adiciona o novo membro
            db.run('INSERT INTO members (user_id, guild_id) VALUES (?, ?)', [newMemberId, guildId], function(err) {
                if (err) return res.status(500).json({ error: 'Este membro já está em uma guilda ou ID inválido.' });
                res.status(200).json({ success: true, message: 'Membro adicionado!' });
            });
        });
    });
});

// Rota para pegar o RANKING de guildas
router.get('/api/guilds/ranking', (req, res) => {
    db.all('SELECT * FROM guilds ORDER BY points DESC LIMIT 10', [], (err, rows) => { // Mostra o Top 10
        if (err) return res.status(500).json({ error: 'Erro ao buscar ranking.' });
        res.json(rows);
    });
});

module.exports = router;
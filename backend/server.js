require('dotenv').config({ path: '../.env' }); 
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport'); // ADICIONADO: Necessário para gerenciar o usuário logado

// Importação das rotas
const authRoutes = require('./routes/authRoutes');
const guildRoutes = require('./routes/guildRoutes'); // ADICIONADO: Rotas do sistema de guildas

const app = express();
const port = process.env.PORT || 4000; // Adaptado para pegar a porta do ambiente se disponível

// ADICIONADO: Essencial para ler os dados enviados pelos formulários (JSON)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CÓDIGO CORRIGIDO AQUI (Sessão)
app.use(session({
    secret: process.env.SESSION_SECRET || 'segredo_local', // Fallback para não quebrar
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

// ADICIONADO: Inicializa o Passport (Sem isso o login não persiste e a guilda não sabe quem é o dono)
app.use(passport.initialize());
app.use(passport.session());

// Servindo os arquivos do front-end
app.use(express.static(path.join(__dirname, '..')));

// Usando as rotas
app.use('/auth', authRoutes); // Mudei para '/auth' para bater com o link do HTML (/auth/discord)
app.use('/api/guilds', guildRoutes); // Adicionado para as guildas funcionarem

// Adicionado: Rota simples para o script.js saber quem está logado
app.get('/api/me', (req, res) => {
    if (req.isAuthenticated()) res.json(req.user);
    else res.status(401).json({ error: 'Não logado' });
});

// ADAPTAÇÃO PARA VERCEL:
// O 'app.listen' trava a Vercel se não estiver condicional.
if (require.main === module) {
    app.listen(port, () => {
        console.log(`🚀 Servidor rodando lindamente em http://localhost:${port}`);
    });
}

// Exporta para a Vercel conseguir executar
module.exports = app;
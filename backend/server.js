require('dotenv').config({ path: '../.env' }); 
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport'); // <--- Faltava importar o Passport

// Importação das rotas
const authRoutes = require('./routes/authRoutes');
const guildRoutes = require('./routes/guildRoutes'); // <--- Faltava a rota das guildas

const app = express();
const port = 4000;

// ===================================================
// 1. MIDDLEWARES ESSENCIAIS (Adicionados)
// ===================================================
// Permite que o servidor entenda JSON (obrigatório para criar guildas e enviar convites)
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// ===================================================
// 2. CONFIGURAÇÃO DE SESSÃO
// ===================================================
app.use(session({
    secret: process.env.SESSION_SECRET || 'segredo_de_desenvolvimento', // Fallback caso o .env falhe
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // 'false' é correto para localhost (http)
}));

// ===================================================
// 3. INICIALIZAÇÃO DO PASSPORT (Login Discord)
// ===================================================
// Isso precisa vir DEPOIS da session e ANTES das rotas
app.use(passport.initialize());
app.use(passport.session());

// ===================================================
// 4. ARQUIVOS ESTÁTICOS (Frontend)
// ===================================================
// Serve o index.html, style.css e scripts da pasta raiz
app.use(express.static(path.join(__dirname, '..')));

// ===================================================
// 5. ROTAS DA API
// ===================================================

// Rotas de Autenticação (ex: /auth/discord)
app.use('/auth', authRoutes); 

// Rotas de Guilda (ex: /api/guilds/ranking)
app.use('/api/guilds', guildRoutes); 

// Rota para o Frontend saber quem está logado (IMPORTANTE para o script.js)
app.get('/api/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user); // Retorna dados do usuário logado
    } else {
        res.status(401).json({ error: 'Não logado' });
    }
});

// ===================================================
// 6. INICIALIZAÇÃO
// ===================================================
app.listen(port, () => {
    console.log(`🚀 Servidor rodando lindamente em http://localhost:${port}`);
});
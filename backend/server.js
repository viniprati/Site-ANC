// Tenta carregar o .env localmente. Se não achar (na Vercel), segue a vida.
require('dotenv').config({ path: '../.env' }); 

const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');

// Importação das rotas
const authRoutes = require('./routes/authRoutes');
const guildRoutes = require('./routes/guildRoutes');

const app = express();
const port = process.env.PORT || 4000;

// ===================================================
// 1. MIDDLEWARES ESSENCIAIS
// ===================================================
// Permite ler JSON e dados de formulário
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// ===================================================
// 2. CONFIGURAÇÃO DE SESSÃO
// ===================================================
app.use(session({
    // Usa a secret do .env (Local) ou do Painel Vercel. Se falhar tudo, usa o segredo padrão.
    secret: process.env.SESSION_SECRET || 'segredo_de_desenvolvimento', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Mude para 'true' se estiver usando HTTPS na Vercel, mas 'false' geralmente evita bugs de cookie
}));

// ===================================================
// 3. INICIALIZAÇÃO DO PASSPORT
// ===================================================
app.use(passport.initialize());
app.use(passport.session());

// ===================================================
// 4. ARQUIVOS ESTÁTICOS
// ===================================================
// Serve a pasta raiz (onde está o index.html)
app.use(express.static(path.join(__dirname, '..')));

// ===================================================
// 5. ROTAS DA API
// ===================================================
app.use('/auth', authRoutes); 
app.use('/api/guilds', guildRoutes);

// Rota de verificação de login
app.get('/api/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.status(401).json({ error: 'Não logado' });
    }
});

// ===================================================
// 6. INICIALIZAÇÃO (ADAPTADA PARA VERCEL)
// ===================================================
// Apenas inicia a porta se estiver rodando no seu PC
if (require.main === module) {
    app.listen(port, () => {
        console.log(`🚀 Servidor rodando lindamente em http://localhost:${port}`);
    });
}

// Exporta para a Vercel
module.exports = app;
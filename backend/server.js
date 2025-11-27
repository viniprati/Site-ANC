require('dotenv').config({ path: '../.env' }); 
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');

// Importação das rotas
const authRoutes = require('./routes/authRoutes');
const guildRoutes = require('./routes/guildRoutes');

const app = express();
const port = process.env.PORT || 4000; // Usa a porta do ambiente ou 4000

// ===================================================
// 1. MIDDLEWARES ESSENCIAIS
// ===================================================
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// ===================================================
// 2. CONFIGURAÇÃO DE SESSÃO
// ===================================================
app.use(session({
    secret: process.env.SESSION_SECRET || 'segredo_de_desenvolvimento',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Mude para true se estiver usando HTTPS na produção
}));

// ===================================================
// 3. INICIALIZAÇÃO DO PASSPORT
// ===================================================
app.use(passport.initialize());
app.use(passport.session());

// ===================================================
// 4. ARQUIVOS ESTÁTICOS
// ===================================================
app.use(express.static(path.join(__dirname, '..')));

// ===================================================
// 5. ROTAS DA API
// ===================================================
app.use('/auth', authRoutes); 
app.use('/api/guilds', guildRoutes); 

app.get('/api/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.status(401).json({ error: 'Não logado' });
    }
});

// ===================================================
// 6. INICIALIZAÇÃO (A MUDANÇA IMPORTANTE ESTÁ AQUI)
// ===================================================

// Verifica se o arquivo está sendo executado diretamente (no seu PC)
// Se for importado pela Vercel, ele pula o app.listen e vai para o exports
if (require.main === module) {
    app.listen(port, () => {
        console.log(`🚀 Servidor rodando lindamente em http://localhost:${port}`);
    });
}

// Exporta o app para a Vercel conseguir rodar
module.exports = app;
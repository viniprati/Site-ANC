require('dotenv').config({ path: '../.env' }); 
const express = require('express');
const path = require('path');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = 4000;

// CÓDIGO CORRIGIDO AQUI
app.use(session({
    secret: process.env.SESSION_SECRET, // A 'secret' agora é uma opção obrigatória aqui dentro
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

// Servindo os arquivos do front-end
app.use(express.static(path.join(__dirname, '..')));

// Usando as rotas de autenticação
app.use('/', authRoutes);

app.listen(port, () => {
    console.log(`🚀 Servidor rodando lindamente em http://localhost:${port}`);
});
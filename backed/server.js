// Carrega as variáveis do arquivo .env que está na pasta raiz
require('dotenv').config({ path: '../.env' }); 

const express = require('express');
const path = require('path');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes'); // Importa nossas rotas

const app = express();
const port = 4000;

// Configura a sessão para manter o usuário logado
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

// Usa as rotas que criamos no outro arquivo
app.use('/', authRoutes);

// Serve os arquivos do front-end (index.html, script.js, etc.) que estão na pasta raiz
app.use(express.static(path.join(__dirname, '..')));

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
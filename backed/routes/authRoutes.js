const express = require('express');
const axios = require('axios');
const router = express.Router();

// Rota inicial do login, que redireciona para o Discord
router.get('/auth/discord', (req, res) => {
    const discordOAuthURL = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.APP_URL + '/auth/discord/callback')}&response_type=code&scope=identify`;
    res.redirect(discordOAuthURL);
});

// Rota que o Discord chama de volta
router.get('/auth/discord/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(400).send('Código de autorização não fornecido.');
    }

    try {
        // Troca o código pelo token de acesso
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.APP_URL + '/auth/discord/callback',
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const accessToken = tokenResponse.data.access_token;

        // Busca os dados do usuário com o token
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        // Salva os dados do usuário na sessão
        req.session.user = {
            id: userResponse.data.id,
            username: userResponse.data.username,
            avatar: userResponse.data.avatar,
        };

        // Redireciona de volta para a página inicial
        res.redirect('/');

    } catch (error) {
        console.error("Erro na autenticação com Discord:", error.response ? error.response.data : error.message);
        res.status(500).send("Erro ao tentar fazer login.");
    }
});

// Rota para o front-end verificar se o usuário está logado
router.get('/api/me', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).json({ error: 'Não autenticado' });
    }
});

// Rota para logout
router.get('/auth/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;
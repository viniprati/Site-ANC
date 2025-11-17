const express = require('express');
const axios = require('axios');
const router = express.Router();

// Rota para iniciar o login
router.get('/auth/discord', (req, res) => {
    const discordOAuthURL = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.APP_URL + '/auth/discord/callback')}&response_type=code&scope=identify`;
    res.redirect(discordOAuthURL);
});

// Rota que o Discord chama de volta
router.get('/auth/discord/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).send('Código de autorização não fornecido.');

    try {
        // --- DEDO-DURO ADICIONADO AQUI ---
        // Vamos ver exatamente o que o servidor está tentando usar
        console.log("--- DEBUG INFO ---");
        console.log("Client ID que o servidor está usando:", process.env.DISCORD_CLIENT_ID);
        console.log("Client Secret que o servidor está usando:", process.env.DISCORD_CLIENT_SECRET);
        console.log("------------------");
        
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.APP_URL + '/auth/discord/callback',
        }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

        const { access_token } = tokenResponse.data;
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: { 'Authorization': `Bearer ${access_token}` }
        });

        req.session.user = {
            id: userResponse.data.id,
            username: userResponse.data.username,
            avatar: userResponse.data.avatar,
        };

        res.redirect('/');
    } catch (error) {
        // A gente já está vendo o erro, então podemos simplificar a mensagem
        console.error("Erro na autenticação com Discord:", error.response ? error.response.data : error.message);
        res.status(500).send("Erro ao tentar fazer login. Verifique o console do servidor para detalhes.");
    }
});

// Rota para verificar o status do login
router.get('/api/me', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).json({ error: 'Não autenticado' });
    }
});

// Rota de logout
router.get('/auth/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

module.exports = router;
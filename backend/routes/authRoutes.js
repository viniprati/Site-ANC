const express = require('express');
const axios = require('axios');
const router = express.Router();

// ==========================================================
// ROTA 1: INICIAR O LOGIN
// Caminho final: /auth/discord
// ==========================================================
router.get('/discord', (req, res) => {
    // Monta a URL do Discord usando as variáveis de ambiente
    // IMPORTANTE: O redirect_uri deve bater EXATAMENTE com o que está no Discord Developer Portal
    const redirectUri = `${process.env.APP_URL}/auth/discord/callback`;
    const discordOAuthURL = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify`;
    
    console.log(">>> Redirecionando usuário para:", discordOAuthURL);
    res.redirect(discordOAuthURL);
});

// ==========================================================
// ROTA 2: O DISCORD DEVOLVE O USUÁRIO AQUI
// Caminho final: /auth/discord/callback
// ==========================================================
router.get('/discord/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).send('Código de autorização não fornecido.');

    // URL de Callback completa
    const redirectUri = `${process.env.APP_URL}/auth/discord/callback`;

    try {
        console.log(">>> Recebido código do Discord. Trocando por Token...");
        
        // 1. Troca o 'code' pelo 'token' de acesso
        const tokenResponse = await axios.post(
            'https://discord.com/api/oauth2/token',
            new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const { access_token } = tokenResponse.data;

        // 2. Usa o token para pegar os dados do usuário (ID, Avatar, Username)
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: { 'Authorization': `Bearer ${access_token}` }
        });

        // 3. Salva na sessão manual (SUBSTITUI O PASSPORT)
        req.session.user = {
            id: userResponse.data.id,
            username: userResponse.data.username,
            avatar: userResponse.data.avatar,
        };

        // Salva a sessão antes de redirecionar para garantir
        req.session.save(() => {
            console.log(">>> Login Sucesso! Usuário:", req.session.user.username);
            res.redirect('/');
        });

    } catch (error) {
        console.error("ERRO NO LOGIN:");
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send(`Erro no login: ${error.response?.data?.error_description || error.message}`);
    }
});

// ==========================================================
// ROTA 3: LOGOUT
// Caminho final: /auth/logout
// ==========================================================
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;
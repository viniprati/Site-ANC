require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const connectDB = require('./config/db');
const Event = require('./models/Event');
const Chat = require('./models/Chat');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Em produção, restrinja para o domínio do seu front-end
        methods: ["GET", "POST"]
    }
});

// Conectar ao Banco de Dados
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Para servir o painel admin

// Rotas da API
app.use('/api/events', require('./routes/eventRoutes'));

// Rota para iniciar um chat de suporte
app.post('/api/support', async (req, res) => {
    const { userName } = req.body;
    if (!userName) {
        return res.status(400).json({ message: 'O nome do usuário é obrigatório.' });
    }

    try {
        const chatId = uuidv4();
        const newChat = new Chat({
            chatId,
            userName,
            messages: [{
                sender: 'admin',
                content: 'Olá! Bem-vindo ao suporte do Animes Café. Como podemos ajudar?'
            }]
        });

        await newChat.save();
        
        // Notificar admins sobre o novo chat
        io.to('admin_room').emit('new-chat', newChat);

        res.status(201).json({ chatId, messages: newChat.messages });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar o chat.' });
    }
});

// Rota para admin buscar todos os chats
app.get('/api/chats', async (req, res) => {
    // Adicionar autenticação aqui em um projeto real
    try {
        const chats = await Chat.find().sort({ 'messages.timestamp': -1 });
        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar chats.' });
    }
});

// Lógica do Socket.IO
io.on('connection', (socket) => {
    console.log(`Usuário conectado: ${socket.id}`);

    // Usuário entra em uma sala de chat específica
    socket.on('join-chat', async (chatId) => {
        socket.join(chatId);
        console.log(`Usuário ${socket.id} entrou na sala ${chatId}`);
    });

    // Admin entra na sala global de admins
    socket.on('admin-join', () => {
        socket.join('admin_room');
        console.log(`Admin ${socket.id} entrou na sala de admins`);
    });

    // Receber mensagem (do usuário ou do admin)
    socket.on('send-message', async ({ chatId, sender, content }) => {
        const newMessage = { sender, content, timestamp: new Date() };
        
        try {
            // Salva a mensagem no banco de dados
            await Chat.updateOne(
                { chatId },
                { $push: { messages: newMessage } }
            );

            // Envia a mensagem para todos na sala (usuário e admin)
            io.to(chatId).emit('new-message', { chatId, ...newMessage });

        } catch (error) {
            console.error('Erro ao salvar mensagem:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log(`Usuário desconectado: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
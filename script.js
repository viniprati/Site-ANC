document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DE AUTENTICAÇÃO ---
    // Esta função verifica se o usuário está logado e atualiza o header
    async function checkAuthStatus() {
        const authSection = document.getElementById('auth-section');
        const mobileLoginLink = document.getElementById('mobile-login-link'); // ID para o link no menu mobile

        if (!authSection) {
            console.error("Elemento 'auth-section' não encontrado no HTML.");
            return;
        }

        try {
            const response = await fetch('/api/me');
            if (response.ok) {
                const user = await response.json();
                const avatarURL = user.avatar 
                    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                    : 'https://cdn.discordapp.com/embed/avatars/0.png'; // Avatar padrão do Discord

                // Atualiza o header principal (desktop)
                authSection.innerHTML = `
                    <div class="flex items-center gap-3">
                        <img src="${avatarURL}" alt="Avatar" class="w-10 h-10 rounded-full border-2 border-purple-400"/>
                        <span class="font-semibold">${user.username}</span>
                        <a href="/auth/logout" class="text-sm text-gray-400 hover:text-white" title="Sair">(Sair)</a>
                    </div>
                `;

                // Atualiza o link no menu mobile para mostrar "Logout"
                if (mobileLoginLink) {
                    mobileLoginLink.innerHTML = 'Logout';
                    mobileLoginLink.href = '/auth/logout';
                    mobileLoginLink.classList.remove('bg-purple-600'); 
                    mobileLoginLink.classList.add('hover:bg-red-700'); // Estilo opcional para logout
                }

            }
        } catch (error) {
            console.error("Não foi possível verificar o status de autenticação:", error);
        }
    }
    // Chama a função de autenticação assim que a página carrega
    checkAuthStatus();

    // --- O RESTO DO SEU CÓDIGO ---

    const API_URL = 'http://localhost:4000'; 

    // --- LÓGICA DO SLIDESHOW DE BACKGROUND ---
    const backgroundGifs = [
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGd1OHVpcTN4cTJydWR4b3BwaXBmYnkydnRnMjFsd2E1NTVpbm00ZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/iqkCNZIzSSXSM/giphy.gif',
        'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3enlseDl5ZHI2bXB4M2phNDNwZmxycWY3bG01cXd5d2FteDU5djRrcCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/tyttpHjP5GSOvJm903e/giphy.gif',
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmFranluMWJ1bHU4M25oZ3p2NHJ6ZHdlYm8wcXJwODB2MjYwdWZreSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/IRwEAOdfiCkHjw1DWB/giphy.gif',
        'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3o5NGxvbms2NmEzNWRyZTl3YmhsdTQ1Y3d5Y291aGU4N2xjZHcwciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/37IzUsLdfChayL5uyA/giphy.gif',
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdXB4aHpxM3V2OHZ1MzhvMGVhOHlwOHZnZThleGNpa3Y2ZGgwaWdiYSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/dyjrpqaUVqCELGuQVr/giphy.gif'
    ];

    const heroSection = document.getElementById('inicio');
    let currentGifIndex = 0;

    function changeBackground() {
        if (!heroSection) return;
        const nextIndex = (currentGifIndex + 1) % backgroundGifs.length;
        const img = new Image();
        img.src = backgroundGifs[nextIndex];

        heroSection.style.backgroundImage = `url('${backgroundGifs[currentGifIndex]}')`;
        currentGifIndex = (currentGifIndex + 1) % backgroundGifs.length;
    }

    changeBackground();
    setInterval(changeBackground, 5000);

    // --- LÓGICA DO MENU MOBILE ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        for (const link of mobileMenu.querySelectorAll('a')) {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        }
    }

    // --- CARREGAMENTO DE EVENTOS ---
    function loadEvents() {
        const events = [
            {"name": "Noite de Karaokê Anime", "date": "Toda Sexta, 20:00", "description": "Solte a voz com as melhores aberturas e encerramentos de animes. Venha cantar conosco!", "icon": "mic"},
            {"name": "Campeonato de LoL", "date": "15 de Março, 14:00", "description": "Mostre suas habilidades no Rift! Inscrições abertas com prêmios para os vencedores.", "icon": "swords"},
            {"name": "Maratona Ghibli", "date": "22 de Março, 18:00", "description": "Uma noite mágica assistindo aos clássicos do Studio Ghibli em nosso canal de cinema.", "icon": "film"}
        ];

        const eventsGrid = document.getElementById('events-grid');
        if (!eventsGrid) return;

        eventsGrid.innerHTML = '';
        for (const event of events) {
            const card = document.createElement('div');
            card.className = 'bg-gray-800/50 border border-gray-700 p-6 rounded-lg text-left transform hover:-translate-y-2 transition-transform duration-300 shadow-lg';
            card.innerHTML = `
                <div class="flex items-center mb-4">
                    <div class="bg-purple-600/20 p-3 rounded-full mr-4">
                        <i data-lucide="${event.icon || 'calendar'}" class="text-purple-400 w-6 h-6"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold">${event.name}</h3>
                        <p class="text-purple-400 text-sm">${event.date}</p>
                    </div>
                </div>
                <p class="text-gray-400">${event.description}</p>
            `;
            eventsGrid.appendChild(card);
        }
        
        lucide.createIcons();
    }
    loadEvents();

    // --- LÓGICA DO CHAT DE SUPORTE ---
    const openChatBtn = document.getElementById('open-chat-btn');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatWidget = document.getElementById('chat-widget');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    
    let socket;
    let chatId;

    if (openChatBtn) {
        openChatBtn.addEventListener('click', async () => {
            chatWidget.classList.remove('hidden');
            
            if (socket) return;
    
            const userName = prompt("Por favor, digite seu nome ou nick do Discord:");
            if (!userName) {
                chatWidget.classList.add('hidden');
                return;
            }
    
            try {
                const response = await fetch(`${API_URL}/api/support`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userName })
                });
                if (!response.ok) {
                    throw new Error('Falha ao criar sessão de chat.');
                }
                const data = await response.json();
                chatId = data.chatId;
    
                socket = io(API_URL);
    
                socket.on('connect', () => {
                    console.log('Conectado ao servidor de chat!');
                    socket.emit('join-chat', chatId);
                });
    
                chatMessages.innerHTML = '';
                
                for (const msg of data.messages) {
                    addMessage(msg.content, msg.sender);
                }
    
                socket.on('new-message', (msg) => {
                    if (msg.sender !== 'user') {
                        addMessage(msg.content, msg.sender);
                    }
                });
    
                socket.on('disconnect', () => {
                    console.log('Desconectado do servidor de chat.');
                });
    
            } catch (error) {
                console.error("Erro ao iniciar chat:", error);
                alert("Não foi possível conectar ao suporte. Tente mais tarde.");
                chatWidget.classList.add('hidden');
            }
        });
    }

    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', () => {
            chatWidget.classList.add('hidden');
        });
    }

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = chatInput.value.trim();
            if (content === '' || !socket) return;
    
            addMessage(content, 'user');
            socket.emit('send-message', { chatId, sender: 'user', content });
            chatInput.value = '';
        });
    }

    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.textContent = text;
        
        if (sender === 'user') {
            messageElement.className = 'p-2 rounded-lg bg-purple-600 self-end text-right max-w-xs break-words';
        } else {
            messageElement.className = 'p-2 rounded-lg bg-gray-700 self-start max-w-xs break-words';
        }
        
        if(chatMessages) {
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
});
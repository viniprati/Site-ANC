document.addEventListener('DOMContentLoaded', () => {
    // A API_URL ainda é necessária para a funcionalidade de chat
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
        const nextIndex = (currentGifIndex + 1) % backgroundGifs.length;
        const img = new Image();
        img.src = backgroundGifs[nextIndex];

        if (heroSection) {
            heroSection.style.backgroundImage = `url('${backgroundGifs[currentGifIndex]}')`;
        }
        
        currentGifIndex = (currentGifIndex + 1) % backgroundGifs.length;
    }

    changeBackground();
    setInterval(changeBackground, 5000);

    // ---------------------------------------------

    // Inicializa os ícones do Lucide
    lucide.createIcons();

    // Lógica do Menu Mobile
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // --- Carregamento Dinâmico de Eventos do Arquivo Local ---
    async function loadEvents() {
        console.log("1. Iniciando a função loadEvents().");

        const eventsGrid = document.getElementById('events-grid');
        
        if (!eventsGrid) {
            console.error("ERRO CRÍTICO: Não foi encontrada a div com id='events-grid' no HTML.");
            return;
        }
        console.log("2. Elemento #events-grid encontrado com sucesso.");

        try {
            const filePath = 'frontend/events.json';
            console.log(`3. Tentando buscar o arquivo em: ${filePath}`);
            
            const response = await fetch(filePath);
            console.log("4. Resposta do fetch recebida:", response);

            if (!response.ok) {
                // Se a resposta não for OK, lança um erro com o status.
                throw new Error(`Falha ao buscar o arquivo. Status: ${response.status} - ${response.statusText}`);
            }
            
            const events = await response.json();
            console.log("5. Arquivo JSON convertido com sucesso:", events);

            eventsGrid.innerHTML = ''; // Limpa a área
            events.forEach(event => {
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
            });
            
            console.log("6. Cards de eventos adicionados ao HTML.");
            lucide.createIcons();
            console.log("7. Ícones do Lucide renderizados. Processo concluído com SUCESSO!");
            
        } catch (error) {
            console.error("ERRO NO PROCESSO DE CARREGAR EVENTOS:", error);
            eventsGrid.innerHTML = `<p class="text-red-400 col-span-full text-center">Falha ao carregar eventos. Verifique o console (F12) para mais detalhes.</p>`;
        }
    }
    loadEvents();

    // --- Lógica do Chat de Suporte com Back-end ---
    // (O resto do seu código permanece igual)
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
                data.messages.forEach(msg => addMessage(msg.content, msg.sender));
    
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
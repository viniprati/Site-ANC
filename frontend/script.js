document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:4000'; // URL do seu back-end

    // Inicializa os ícones do Lucide
    lucide.createIcons();

    // Lógica do Menu Mobile (sem alterações)
    // ... (copie a parte do menu mobile do script anterior) ...
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // --- Carregamento Dinâmico de Eventos via API ---
    async function loadEvents() {
        const eventsGrid = document.getElementById('events-grid');
        if (!eventsGrid) return;

        try {
            const response = await fetch(`${API_URL}/api/events`);
            const events = await response.json();

            eventsGrid.innerHTML = '';
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
            lucide.createIcons();
            
        } catch (error) {
            console.error('Erro ao carregar os eventos:', error);
            eventsGrid.innerHTML = '<p class="text-red-400 col-span-full">Não foi possível carregar os eventos.</p>';
        }
    }
    loadEvents();

    // --- Lógica do Chat de Suporte com Back-end ---
    const openChatBtn = document.getElementById('open-chat-btn');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatWidget = document.getElementById('chat-widget');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    
    let socket;
    let chatId;

    openChatBtn.addEventListener('click', async () => {
        if (!chatId) {
            const userName = prompt("Por favor, digite seu nome ou nick do Discord:");
            if (!userName) return;

            try {
                const response = await fetch(`${API_URL}/api/support`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userName })
                });
                const data = await response.json();
                chatId = data.chatId;

                // Conectar ao Socket.IO
                socket = io(API_URL);
                socket.emit('join-chat', chatId);

                // Limpar mensagens e adicionar as iniciais
                chatMessages.innerHTML = '';
                data.messages.forEach(msg => addMessage(msg.content, msg.sender));

                socket.on('new-message', (msg) => {
                    if (msg.sender !== 'user') {
                        addMessage(msg.content, msg.sender);
                    }
                });

            } catch (error) {
                console.error("Erro ao iniciar chat:", error);
                alert("Não foi possível conectar ao suporte. Tente mais tarde.");
                return;
            }
        }
        chatWidget.classList.remove('hidden');
    });

    closeChatBtn.addEventListener('click', () => {
        chatWidget.classList.add('hidden');
    });

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const content = chatInput.value.trim();
        if (content === '' || !socket) return;

        addMessage(content, 'user');
        socket.emit('send-message', { chatId, sender: 'user', content });
        chatInput.value = '';
    });

    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.textContent = text;
        
        if (sender === 'user') {
            messageElement.className = 'p-2 rounded-lg bg-purple-600 self-end text-right max-w-xs break-words';
        } else { // admin
            messageElement.className = 'p-2 rounded-lg bg-gray-700 self-start max-w-xs break-words';
        }
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
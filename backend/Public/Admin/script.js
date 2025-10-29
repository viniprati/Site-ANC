document.addEventListener('DOMContentLoaded', () => {
    // Verificação simples de "autenticação"
    if (localStorage.getItem('admin-auth') !== 'true') {
        window.location.href = '/admin/index.html';
        return;
    }

    const socket = io();
    const chatList = document.getElementById('chat-list');
    const chatWindow = document.getElementById('chat-window');
    const chatHeader = document.getElementById('chat-header');
    const messagesArea = document.getElementById('messages-area');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const placeholder = document.getElementById('placeholder');

    let currentChatId = null;

    // Conectar como admin
    socket.emit('admin-join');

    // Carregar chats existentes
    async function loadChats() {
        const res = await fetch('/api/chats');
        const chats = await res.json();
        chatList.innerHTML = '';
        chats.forEach(renderChatInList);
    }

    function renderChatInList(chat) {
        const chatItem = document.createElement('div');
        chatItem.className = 'p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700';
        chatItem.dataset.chatId = chat.chatId;
        chatItem.innerHTML = `<p class="font-bold">${chat.userName}</p><p class="text-sm text-gray-400 truncate">${chat.messages.slice(-1)[0]?.content || 'Novo chat'}</p>`;
        
        chatItem.addEventListener('click', () => {
            currentChatId = chat.chatId;
            openChat(chat);
        });
        chatList.prepend(chatItem);
    }

    function openChat(chat) {
        placeholder.classList.add('hidden');
        chatWindow.classList.remove('hidden');

        chatHeader.textContent = `Chat com ${chat.userName}`;
        messagesArea.innerHTML = '';
        chat.messages.forEach(renderMessage);
        
        // Entrar na sala específica do chat para receber updates
        socket.emit('join-chat', chat.chatId);
    }

    function renderMessage(msg) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `p-2 rounded-lg max-w-xs break-words ${
            msg.sender === 'admin' ? 'bg-purple-600 self-end' : 'bg-gray-600 self-start'
        }`;
        msgDiv.textContent = msg.content;
        messagesArea.appendChild(msgDiv);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    // Enviar mensagem como admin
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const content = messageInput.value.trim();
        if (content && currentChatId) {
            socket.emit('send-message', {
                chatId: currentChatId,
                sender: 'admin',
                content,
            });
            messageInput.value = '';
        }
    });

    // Ouvir por novas mensagens
    socket.on('new-message', (msg) => {
        // Se a mensagem for do chat atualmente aberto, renderiza
        if (msg.chatId === currentChatId) {
            renderMessage(msg);
        }
        // Atualizar a preview na lista de chats
        const chatInList = chatList.querySelector(`[data-chat-id="${msg.chatId}"]`);
        if (chatInList) {
            chatInList.querySelector('.text-sm').textContent = msg.content;
            // Move para o topo
            chatList.prepend(chatInList);
        }
    });

    // Ouvir por novos chats
    socket.on('new-chat', (newChat) => {
        renderChatInList(newChat);
    });

    loadChats();
});
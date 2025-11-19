document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DE AUTENTICAÇÃO ---
    async function checkAuthStatus() {
        const authSection = document.getElementById('auth-section');
        const mobileLoginLink = document.getElementById('mobile-login-link');

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
                    : 'https://cdn.discordapp.com/embed/avatars/0.png';

                authSection.innerHTML = `
                    <div class="flex items-center gap-3">
                        <img src="${avatarURL}" alt="Avatar" class="w-10 h-10 rounded-full border-2 border-purple-400"/>
                        <span class="font-semibold">${user.username}</span>
                        <a href="/auth/logout" class="text-sm text-gray-400 hover:text-white" title="Sair">(Sair)</a>
                    </div>
                `;

                if (mobileLoginLink) {
                    mobileLoginLink.innerHTML = 'Logout';
                    mobileLoginLink.href = '/auth/logout';
                    mobileLoginLink.classList.remove('bg-purple-600');
                    mobileLoginLink.classList.add('hover:bg-red-700');
                }
            }
        } catch (error) {
            console.error("Não foi possível verificar o status de autenticação:", error);
        }
    }
    checkAuthStatus();

    // --- CÓDIGO ORIGINAL ---

    const API_URL = 'http://localhost:4000'; 

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

    const openChatBtn = document.getElementById('open-chat-btn');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatWidget = document.getElementById('chat-widget');
    // ... (resto da inicialização do chat)

    // --- NOVA LÓGICA DO SISTEMA DE GUILDAS ---
    const myGuildSection = document.getElementById('my-guild-section');
    const guildRankingList = document.getElementById('guild-ranking-list');

    function renderCreateGuildForm() {
        myGuildSection.innerHTML = `
            <h3 class="text-xl font-bold mb-4 text-center">Crie sua Guilda</h3>
            <p class="text-gray-400 text-sm mb-4 text-center">Você ainda não faz parte de uma guilda. Crie a sua para começar a competir!</p>
            <form id="create-guild-form" class="flex flex-col gap-4">
                <input id="guild-name-input" type="text" placeholder="Nome da Guilda (3-20 caracteres)" 
                       class="bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
                <button type="submit" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    Fundar Guilda
                </button>
            </form>
        `;
    }

    function renderMyGuildDetails(guild, currentUser) {
        const isOwner = guild.owner_id === currentUser.id;
        const isFull = guild.members.length >= 10;

        let addMemberForm = '';
        if (isOwner && !isFull) {
            addMemberForm = `
                <form id="add-member-form" data-guild-id="${guild.id}" class="mt-4 flex gap-2">
                    <input id="new-member-id-input" type="text" placeholder="ID do Discord do membro" 
                           class="flex-grow bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 rounded-md transition-colors">Convidar</button>
                </form>
                <p class="text-xs text-gray-500 mt-1">Ex: 983870132063453235</p>
            `;
        } else if (isOwner && isFull) {
            addMemberForm = '<p class="text-sm text-yellow-500 mt-4">Sua guilda atingiu o limite de 10 membros.</p>';
        }

        myGuildSection.innerHTML = `
            <h3 class="text-xl font-bold mb-2">${guild.name}</h3>
            <p class="text-yellow-400 font-semibold mb-4">Pontos: ${guild.points}</p>
            <h4 class="font-bold border-b border-gray-700 pb-1 mb-2">Membros (${guild.members.length}/10)</h4>
            <ul class="space-y-1 text-gray-300">
                ${guild.members.map(member => `
                    <li class="flex items-center gap-2">
                        <i data-lucide="user" class="w-4 h-4 text-gray-500"></i> 
                        <span>${member.user_id} ${member.user_id === guild.owner_id ? '(Líder)' : ''}</span>
                    </li>
                `).join('')}
            </ul>
            ${addMemberForm}
        `;
        lucide.createIcons();
    }

    async function loadMyGuildStatus() {
        if (!myGuildSection) return;
        try {
            const meResponse = await fetch('/api/me');
            if (!meResponse.ok) {
                myGuildSection.innerHTML = '<p class="text-center text-gray-400">Faça login para criar ou ver sua guilda.</p>';
                return;
            }
            const currentUser = await meResponse.json();

            const guildResponse = await fetch('/api/my-guild');
            if (guildResponse.status === 404) {
                renderCreateGuildForm();
            } else if (guildResponse.ok) {
                const guildData = await guildResponse.json();
                renderMyGuildDetails(guildData, currentUser);
            } else {
                 throw new Error('Falha ao buscar dados da guilda.');
            }
        } catch (error) {
            console.error("Erro ao carregar status da guilda:", error);
            myGuildSection.innerHTML = '<p class="text-red-500">Erro ao carregar informações.</p>';
        }
    }

    async function loadGuildRanking() {
        if (!guildRankingList) return;
        try {
            const response = await fetch('/api/guilds/ranking');
            const ranking = await response.json();

            if (ranking.length === 0) {
                guildRankingList.innerHTML = '<p class="text-center text-gray-500">Nenhuma guilda no ranking ainda.</p>';
                return;
            }

            guildRankingList.innerHTML = ranking.map((guild, index) => `
                <div class="flex items-center bg-gray-800 p-3 rounded-md border border-gray-700">
                    <span class="text-2xl font-bold text-gray-500 w-10">${index + 1}º</span>
                    <div class="flex-grow text-left">
                        <h4 class="text-lg font-bold">${guild.name}</h4>
                        <p class="text-yellow-400">${guild.points} pontos</p>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error("Erro ao carregar ranking de guildas:", error);
            guildRankingList.innerHTML = '<p class="text-red-500">Erro ao carregar ranking.</p>';
        }
    }

    myGuildSection.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (e.target.id === 'create-guild-form') {
            const guildNameInput = document.getElementById('guild-name-input');
            const guildName = guildNameInput.value;
            const response = await fetch('/api/guilds', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: guildName }),
            });
            if (response.ok) {
                loadMyGuildStatus();
                loadGuildRanking();
            } else {
                const data = await response.json();
                alert(`Erro: ${data.error}`);
            }
        }

        if (e.target.id === 'add-member-form') {
            const newMemberIdInput = document.getElementById('new-member-id-input');
            const newMemberId = newMemberIdInput.value;
            const guildId = e.target.dataset.guildId;
            const response = await fetch(`/api/guilds/${guildId}/members`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newMemberId }),
            });
            if (response.ok) {
                loadMyGuildStatus();
            } else {
                const data = await response.json();
                alert(`Erro: ${data.error}`);
            }
        }
    });

    loadMyGuildStatus();
    loadGuildRanking();
});
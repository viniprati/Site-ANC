document.addEventListener('DOMContentLoaded', () => {
    console.log(">>> SITE INICIADO: Carregando módulos...");

    // Inicializa ícones do Lucide se estiverem disponíveis
    if (window.lucide) {
        lucide.createIcons();
    }

    // ==========================================
    // 1. LÓGICA DE AUTENTICAÇÃO
    // ==========================================
    async function checkAuthStatus() {
        const authSection = document.getElementById('auth-section');
        const mobileLoginLink = document.getElementById('mobile-login-link');

        if (!authSection) return;

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
            // Silencia erro de backend offline
        }
    }
    checkAuthStatus();

    // ==========================================
    // 2. BACKGROUND SLIDESHOW & HERO
    // ==========================================
    const heroSection = document.getElementById('inicio');
    const backgroundGifs = [
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGd1OHVpcTN4cTJydWR4b3BwaXBmYnkydnRnMjFsd2E1NTVpbm00ZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/iqkCNZIzSSXSM/giphy.gif',
        'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3enlseDl5ZHI2bXB4M2phNDNwZmxycWY3bG01cXd5d2FteDU5djRrcCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/tyttpHjP5GSOvJm903e/giphy.gif',
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmFranluMWJ1bHU4M25oZ3p2NHJ6ZHdlYm8wcXJwODB2MjYwdWZreSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/IRwEAOdfiCkHjw1DWB/giphy.gif',
        'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3o5NGxvbms2NmEzNWRyZTl3YmhsdTQ1Y3d5Y291aGU4N2xjZHcwciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/37IzUsLdfChayL5uyA/giphy.gif',
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdXB4aHpxM3V2OHZ1MzhvMGVhOHlwOHZnZThleGNpa3Y2ZGgwaWdiYSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/dyjrpqaUVqCELGuQVr/giphy.gif'
    ];
    let currentGifIndex = 0;

    function changeBackground() {
        if (!heroSection) return;
        const nextIndex = (currentGifIndex + 1) % backgroundGifs.length;
        
        const img = new Image();
        img.src = backgroundGifs[nextIndex];

        heroSection.style.backgroundImage = `url('${backgroundGifs[currentGifIndex]}')`;
        currentGifIndex = nextIndex;
    }

    if (heroSection) {
        changeBackground();
        setInterval(changeBackground, 5000);
    }

    // ==========================================
    // 3. MENU MOBILE
    // ==========================================
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

    // ==========================================
    // 4. CARREGAMENTO DE EVENTOS
    // ==========================================
    function loadEvents() {
        const events = [
            {"name": "Noite de Karaokê Anime", "date": "Toda Sexta, 20:00", "description": "Solte a voz com as melhores aberturas e encerramentos de animes.", "icon": "mic"},
            {"name": "Campeonato de LoL", "date": "15 de Março, 14:00", "description": "Mostre suas habilidades no Rift! Inscrições abertas.", "icon": "swords"},
            {"name": "Maratona Ghibli", "date": "22 de Março, 18:00", "description": "Uma noite mágica assistindo aos clássicos do Studio Ghibli.", "icon": "film"}
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
        
        if (window.lucide) lucide.createIcons();
    }
    loadEvents();

    // ==========================================
    // 5. SISTEMA DE FAQ (VISUAL NO SITE)
    // ==========================================
    function loadFAQ() {
        const faqContainer = document.getElementById('faq-list');
        if (!faqContainer) return;

        const faqData = [
            {
                "question": "Como faço para entrar no servidor do Discord?",
                "answer": "É super simples! Basta clicar no botão de convite aqui no site ou usar nosso link direto. Assim que entrar, lembre-se de ler e aceitar as normas no canal <b>#regras</b> para liberar seu acesso aos chats."
            },
            {
                "question": "Como posso criar minha própria Guilda?",
                "answer": "Para fundar uma Guilda, você deve entrar em contato com um membro da nossa Staff. Lembre-se que você poderá adicionar até <b>9 outros membros</b> para fazer parte da sua equipe."
            },
            {
                "question": "Quais são os horários dos eventos?",
                "answer": "Nossos eventos geralmente acontecem aos finais de semana e no período noturno durante a semana. Fique sempre de olho no canal <b>#anúncios</b> e na aba de Eventos do Discord para não perder nada!"
            },
            {
                "question": "Quero fazer parte da Staff, como me inscrevo?",
                "answer": "Adoramos seu interesse! Escolha a área que mais combina com você e preencha o formulário: <br>• <b><a href='#' class='text-pink-400 hover:underline'>Equipe de Moderação</a></b><br>• <b><a href='#' class='text-pink-400 hover:underline'>Equipe de Movimentação</a></b><br>• <b><a href='#' class='text-pink-400 hover:underline'>Equipe de Parcerias</a></b>"
            },
            {
                "question": "Fui banido, como posso pedir revisão?",
                "answer": "Não se preocupe em procurar o link. Se o banimento ocorrer, nosso sistema envia <b>automaticamente o formulário de revisão no seu privado (PV)</b>. Basta verificar suas mensagens diretas, preencher e aguardar."
            },
            {
                "question": "Como funcionam as parcerias com o Animes Café?",
                "answer": "Adoramos conectar comunidades! Verifique se seu servidor ou projeto cumpre os requisitos listados no canal <b>#parcerias</b> e abra um ticket para apresentarmos nossas propostas."
            },
            {
                "question": "Quais as vantagens de dar Boost no servidor?",
                "answer": "Temos dois níveis incríveis! Com <b>1 Boost</b>, você ganha VIP, troca de apelido, mídias liberadas, 5x XP (Loritta), GarticMOD e mais. Com <b>2+ Boosts (Premium)</b>, você leva tudo isso mais um <b>cargo customizado para 20 amigos</b>, 10x XP, cores exclusivas e áudio no lobby!"
            },
            {
                "question": "Quais bots de música estão disponíveis?",
                "answer": "Para garantir a trilha sonora perfeita, contamos com o <b>Jockie Music</b> e o <b>Samzinho</b>. Basta entrar em um canal de voz de música e usar os comandos para soltar o som!"
            },
            {
                "question": "Vi alguém quebrando as regras, como denuncio?",
                "answer": "A segurança é prioridade. Se presenciar algo errado, abra imediatamente um <b>Ticket de Suporte</b> ou contate um moderador online. Prints e provas ajudam muito na agilidade da resolução."
            },
            {
                "question": "Sou Artista ou Influenciador, tenho algum destaque?",
                "answer": "Com certeza! Temos apoio para verificados como <b>Streamer, Cantor, Produtor, Influenciador, Editor e Designer</b>. Para conseguir seu cargo, basta abrir um ticket. Confira os requisitos no canal: <a href='#' class='text-pink-400 hover:underline'><b>Cargos Especiais</b></a>."
            }
        ];

        faqContainer.innerHTML = faqData.map((item, index) => `
            <div class="group border border-gray-800 rounded-xl bg-gray-900/50 overflow-hidden transition-all duration-300 hover:border-pink-500/50 hover:bg-gray-900">
                <button class="faq-btn w-full flex justify-between items-center p-5 text-left focus:outline-none" onclick="toggleFAQ(${index})">
                    <span class="text-lg font-semibold text-gray-200 group-hover:text-pink-400 transition-colors pr-4">${item.question}</span>
                    <i data-lucide="chevron-down" id="icon-${index}" class="w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0"></i>
                </button>
                <div id="content-${index}" class="hidden px-5 pb-5 text-gray-400 text-sm leading-relaxed border-t border-gray-800/50 mt-2 pt-4">
                    ${item.answer}
                </div>
            </div>
        `).join('');

        window.toggleFAQ = function(index) {
            const content = document.getElementById(`content-${index}`);
            const icon = document.getElementById(`icon-${index}`);
            
            // Fecha os outros (opcional)
            faqData.forEach((_, i) => {
                if (i !== index) {
                    document.getElementById(`content-${i}`).classList.add('hidden');
                    document.getElementById(`icon-${i}`).classList.remove('rotate-180', 'text-pink-400');
                }
            });

            const isHidden = content.classList.contains('hidden');
            if (isHidden) {
                content.classList.remove('hidden');
                content.classList.add('animate-fade-in-up');
                icon.classList.add('rotate-180', 'text-pink-400');
            } else {
                content.classList.add('hidden');
                icon.classList.remove('rotate-180', 'text-pink-400');
            }
        };

        if (window.lucide) lucide.createIcons();
    }
    loadFAQ();

    // ==========================================
    // 6. CHAT WIDGET (CHATBOT HÍBRIDO)
    // ==========================================
    class AnimesCafeChat {
        constructor() {
            this.widget = document.getElementById('chat-widget');
            this.messagesArea = document.getElementById('chat-messages');
            this.form = document.getElementById('chat-form');
            this.input = document.getElementById('chat-input');
            this.openBtn = document.getElementById('open-chat-btn');
            this.closeBtn = document.getElementById('close-chat-btn');
            this.staffBtn = document.getElementById('human-fallback-btn');

            this.isOpen = false;
            this.botName = "Maid Aiko";
            this.botAvatar = "coffee";

            if (this.widget && this.openBtn) {
                this.init();
            }
        }

        init() {
            // Eventos de Abrir/Fechar
            this.openBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleChat();
            });

            if(this.closeBtn) {
                this.closeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeChat();
                });
            }

            // Fechar ao clicar fora
            document.addEventListener('click', (e) => {
                if (this.isOpen && !this.widget.contains(e.target) && !this.openBtn.contains(e.target)) {
                    this.closeChat();
                }
            });

            // Fechar com ESC
            document.addEventListener('keydown', (e) => {
                if (this.isOpen && e.key === 'Escape') {
                    this.closeChat();
                }
            });

            // Envio de mensagem
            if(this.form) {
                this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            }
            
            // Botão Falar com Staff
            if(this.staffBtn) {
                this.staffBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.triggerStaffHandoff();
                });
            }

            // Mensagem Inicial
            if (this.messagesArea && this.messagesArea.children.length === 0) {
                this.addMessage("Olá, Mestre! ☕ Bem-vindo ao Animes Café. Sou a Aiko. Como posso servir você hoje?", 'bot');
            }
        }

        toggleChat() {
            if (this.isOpen) this.closeChat();
            else this.openChat();
        }

        openChat() {
            this.isOpen = true;
            this.widget.classList.remove('hidden');
            
            // Força a renderização dos ícones (importante para o botão X aparecer)
            if(window.lucide) window.lucide.createIcons();

            setTimeout(() => {
                this.widget.classList.remove('opacity-0', 'translate-y-10');
                if(this.input) this.input.focus();
            }, 10);
        }

        closeChat() {
            this.isOpen = false;
            this.widget.classList.add('opacity-0', 'translate-y-10');
            setTimeout(() => {
                this.widget.classList.add('hidden');
            }, 300);
        }

        async handleSubmit(e) {
            e.preventDefault();
            if(!this.input) return;
            
            const text = this.input.value.trim();
            if (!text) return;

            // 1. Mensagem Usuário
            this.addMessage(text, 'user');
            this.input.value = '';

            // 2. Typing Indicator
            this.showTypingIndicator();

            // --- LÓGICA HÍBRIDA ---
            // Tenta responder com as FAQs primeiro (Custo Zero)
            const localResponse = this.checkLocalFAQ(text);

            if (localResponse) {
                setTimeout(() => {
                    this.removeTypingIndicator();
                    this.addMessage(localResponse, 'bot');
                }, 600);
            } else {
                // Se não sabe, chama a API (Simulada)
                try {
                    const responseText = await this.fetchAIResponse(text);
                    this.removeTypingIndicator();
                    this.addMessage(responseText, 'bot');
                    if(this.staffBtn) this.staffBtn.classList.remove('hidden');
                } catch (error) {
                    this.removeTypingIndicator();
                    this.addMessage("Desculpe, tive um problema técnico.", 'bot');
                }
            }
        }

        // "Cérebro Local" da IA (Baseado nas FAQs)
        checkLocalFAQ(text) {
            const lower = text.toLowerCase();
            
            if (lower.includes('entrar') || lower.includes('convite') || lower.includes('link')) 
                return "Para entrar, clique no botão 'Entrar no Servidor' no topo da página ou use este link: discord.gg/animescafe ☕";
            
            if (lower.includes('guilda') || lower.includes('clã') || lower.includes('time')) 
                return "As Guildas são o coração do Café! Você pode criar a sua falando com a Staff ou entrar em uma existente. Elas competem por pontos!";
            
            if (lower.includes('regras') || lower.includes('pode fazer')) 
                return "Respeito acima de tudo! Sem spam, sem flood e conteúdo NSFW apenas nos canais permitidos. Leia tudo em #regras.";
            
            if (lower.includes('staff') || lower.includes('moderador') || lower.includes('adm')) 
                return "Quer fazer parte da equipe? Fique de olho no canal #anúncios para quando abrirmos os formulários de recrutamento!";
            
            if (lower.includes('banido') || lower.includes('ban')) 
                return "Se você foi banido, nosso bot envia automaticamente o formulário de revisão no seu privado (PV).";
            
            if (lower.includes('boost') || lower.includes('nitro')) 
                return "Boosters ganham vantagens incríveis como XP extra, cargos personalizados, cores exclusivas e prioridade em eventos! 💎";
            
            if (lower.includes('parceria')) 
                return "Para parcerias, verifique os requisitos no canal #parcerias e abra um ticket!";
            
            if (lower.includes('oi') || lower.includes('olá') || lower.includes('bom dia') || lower.includes('boa noite')) 
                return "Olá! 🌸 Tudo bem com você? Aceita um chá ou café?";

            return null; // Não encontrou resposta local, passa para a IA
        }

        async fetchAIResponse(userText) {
            await new Promise(r => setTimeout(r, 1500)); // Delay simulado
            return "Hmm... essa dúvida é bem específica. 🤔 Gostaria de falar com um membro humano da Staff para te ajudar melhor?";
        }

        addMessage(text, sender) {
            const div = document.createElement('div');
            const isBot = sender === 'bot';
            
            div.className = `flex w-full ${isBot ? 'justify-start' : 'justify-end'} mb-4 animate-fade-in-up`;

            div.innerHTML = `
                <div class="flex max-w-[85%] ${isBot ? 'flex-row' : 'flex-row-reverse'} items-end gap-2">
                    ${isBot ? `
                        <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                            <i data-lucide="${this.botAvatar}" class="w-4 h-4 text-white"></i>
                        </div>
                    ` : ''}
                    
                    <div class="px-4 py-2 rounded-2xl text-sm shadow-sm 
                        ${isBot ? 'bg-gray-700 text-gray-100 rounded-bl-none' : 'bg-blue-600 text-white rounded-br-none'}">
                        ${text.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `;

            this.messagesArea.appendChild(div);
            this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
            if(window.lucide) window.lucide.createIcons();
        }

        showTypingIndicator() {
            if (document.getElementById('typing-indicator')) return;
            const div = document.createElement('div');
            div.id = 'typing-indicator';
            div.className = `flex w-full justify-start mb-4`;
            div.innerHTML = `
                <div class="flex items-end gap-2">
                    <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <i data-lucide="loader-2" class="w-4 h-4 text-white animate-spin"></i>
                    </div>
                    <div class="bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-none flex gap-1">
                        <div class="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                        <div class="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                        <div class="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                    </div>
                </div>
            `;
            this.messagesArea.appendChild(div);
            this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
            if(window.lucide) window.lucide.createIcons();
        }

        removeTypingIndicator() {
            const el = document.getElementById('typing-indicator');
            if (el) el.remove();
        }

        triggerStaffHandoff() {
            this.addMessage("Gostaria de falar com um membro humano da Staff.", 'user');
            this.showTypingIndicator();
            
            setTimeout(() => {
                this.removeTypingIndicator();
                this.addMessage(`Entendido! <a href="https://discord.gg/animescafe" target="_blank" class="text-blue-400 underline font-bold">Clique aqui para abrir um Ticket no Discord</a>.`, 'bot');
            }, 1000);
        }
    }

    // Instancia o Chat
    const chatApp = new AnimesCafeChat();

    // ==========================================
    // 7. SISTEMA DE GUILDAS (BACKEND)
    // ==========================================
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
        if (window.lucide) lucide.createIcons();
    }

    async function loadMyGuildStatus() {
        if (!myGuildSection) return;
        try {
            const meResponse = await fetch('/api/me');
            if (!meResponse.ok) {
                myGuildSection.innerHTML = '<p class="text-center text-gray-400 mt-4">Faça login para criar ou ver sua guilda.</p>';
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
            myGuildSection.innerHTML = '<p class="text-red-500">Erro de conexão.</p>';
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
            guildRankingList.innerHTML = '<p class="text-gray-500">Ranking indisponível.</p>';
        }
    }

    if(myGuildSection) {
        myGuildSection.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (e.target.id === 'create-guild-form') {
                const guildNameInput = document.getElementById('guild-name-input');
                const guildName = guildNameInput.value;
                try {
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
                } catch(e) { console.error(e); }
            }

            if (e.target.id === 'add-member-form') {
                const newMemberIdInput = document.getElementById('new-member-id-input');
                const newMemberId = newMemberIdInput.value;
                const guildId = e.target.dataset.guildId;
                try {
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
                } catch(e) { console.error(e); }
            }
        });
    }

    loadMyGuildStatus();
    loadGuildRanking();
});
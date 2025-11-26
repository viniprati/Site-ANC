document.addEventListener('DOMContentLoaded', () => {
    console.log(">>> MÓDULO DE CONVITES INICIADO");
    
    const invitesSection = document.getElementById('invites-section');
    const invitesList = document.getElementById('invites-list');

    // Função para carregar convites do servidor
    async function loadInvites() {
        if (!invitesList) return;

        try {
            // Chama a rota do backend (precisaremos criar ela no passo 3)
            const response = await fetch('/api/guilds/my-invites');
            
            if (response.ok) {
                const invites = await response.json();

                if (invites.length > 0) {
                    invitesSection.classList.remove('hidden'); // Mostra a caixa de convites
                    renderInvites(invites);
                } else {
                    invitesSection.classList.add('hidden'); // Esconde se não tiver nada
                }
            }
        } catch (error) {
            console.error("Erro ao buscar convites:", error);
        }
    }

    // Função para desenhar os convites na tela
    function renderInvites(invites) {
        invitesList.innerHTML = invites.map(invite => `
            <div class="bg-gray-700/50 p-3 rounded-lg border border-gray-600 flex justify-between items-center animate-fade-in-up">
                <div>
                    <p class="text-xs text-gray-400">Convite para entrar em:</p>
                    <p class="font-bold text-yellow-400 text-sm">${invite.guild_name}</p>
                </div>
                <div class="flex gap-2">
                    <!-- Botão Aceitar -->
                    <button onclick="processInvite(${invite.id}, 'accept')" 
                            class="bg-green-600 hover:bg-green-500 text-white p-2 rounded-md transition-colors shadow-lg" 
                            title="Aceitar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </button>
                    
                    <!-- Botão Recusar -->
                    <button onclick="processInvite(${invite.id}, 'reject')" 
                            class="bg-red-600 hover:bg-red-500 text-white p-2 rounded-md transition-colors shadow-lg" 
                            title="Recusar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Torna a função global para o HTML conseguir chamar no onclick=""
    window.processInvite = async (inviteId, action) => {
        try {
            const response = await fetch(`/api/guilds/invites/${inviteId}/${action}`, {
                method: 'POST'
            });

            if (response.ok) {
                // Remove o elemento visualmente ou recarrega a lista
                loadInvites();
                
                // Se aceitou, tenta atualizar a área da guilda principal (se a função existir)
                if (action === 'accept' && typeof loadMyGuildStatus === 'function') {
                    loadMyGuildStatus();
                }
                
                // Opcional: Feedback visual
                alert(action === 'accept' ? "Bem-vindo à guilda!" : "Convite recusado.");
            } else {
                const data = await response.json();
                alert(`Erro: ${data.error}`);
            }
        } catch (error) {
            console.error("Erro ao processar convite:", error);
        }
    };

    // Carrega inicialmente
    loadInvites();
    
    // Verifica novos convites a cada 15 segundos (Polling)
    setInterval(loadInvites, 15000);
});
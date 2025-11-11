"use client"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border py-12 px-4 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-border">
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Animes Café</h3>
            <p className="text-muted-foreground">Seu refúgio otaku no Discord</p>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">Links Rápidos</h4>
            <div className="space-y-2 text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors block">
                Início
              </a>
              <a href="#eventos" className="hover:text-primary transition-colors block">
                Eventos
              </a>
              <a href="#suporte" className="hover:text-primary transition-colors block">
                Suporte
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">Redes Sociais</h4>
            <div className="space-y-2 text-muted-foreground">
              <a
                href="https://discord.gg/animes-cafe"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors block"
              >
                Discord
              </a>
              <a href="#" className="hover:text-primary transition-colors block">
                Regras
              </a>
              <a href="#" className="hover:text-primary transition-colors block">
                Contato
              </a>
            </div>
          </div>
        </div>

        <div className="text-center text-muted-foreground text-sm">
          <p>© {currentYear} Animes Café — Desenvolvido com ❤️ para a comunidade otaku</p>
        </div>
      </div>
    </footer>
  )
}

"use client"

export default function Support() {
  return (
    <section id="suporte" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-8 md:p-12 space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="text-foreground">Precisa de </span>
              <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">Ajuda?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Nossa equipe está pronta para te atender. Clique abaixo para abrir o chat de suporte.
            </p>
          </div>

          <div className="flex justify-center">
            <a
              href="https://discord.gg/animes-cafe"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full font-bold text-lg transition-all duration-200 hover:shadow-lg glow-secondary"
            >
              Abrir Suporte
            </a>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-8 border-t border-border">
            <div className="space-y-3">
              <h3 className="font-bold text-primary text-lg">💡 Dúvidas</h3>
              <p className="text-muted-foreground">
                Tem dúvidas sobre regras, canais ou como usar o servidor? Nossos moderadores estão aqui para ajudar.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-accent text-lg">🚨 Problemas</h3>
              <p className="text-muted-foreground">
                Encontrou um bug ou tem um problema? Reporte para que possamos melhorar sua experiência.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

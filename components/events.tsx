"use client"

export default function Events() {
  const events = [
    {
      id: 1,
      title: "Maratona Anime",
      description: "Assista aos melhores animes com a comunidade",
      date: "Toda semana",
      icon: "📺",
      color: "from-primary to-accent",
    },
    {
      id: 2,
      title: "Torneio Gamer",
      description: "Compete em seus jogos favoritos",
      date: "Fins de semana",
      icon: "🎮",
      color: "from-secondary to-accent",
    },
    {
      id: 3,
      title: "Debate de Anime",
      description: "Discuta suas obras e personagens favoritos",
      date: "Quartas-feiras",
      icon: "💬",
      color: "from-accent to-primary",
    },
  ]

  return (
    <section id="eventos" className="py-20 px-4 bg-gradient-to-b from-background to-card/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="text-foreground">Nossos </span>
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Eventos</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Fique por dentro de tudo que acontece no servidor!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="group bg-card border border-border rounded-xl p-6 hover:border-primary transition-all duration-300 hover:shadow-lg glow-primary"
            >
              <div className={`text-5xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {event.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                {event.title}
              </h3>
              <p className="text-muted-foreground mb-4">{event.description}</p>
              <div className="flex items-center gap-2 text-secondary font-semibold">
                <span>📅</span>
                <span>{event.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

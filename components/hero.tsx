"use client"

import { useState, useEffect } from "react"

const GIF_URLS = [
  "https://media.tenor.com/videos/10621668428078749705/video.mp4",
  "https://media.tenor.com/videos/16340763784012771786/video.mp4",
  "https://media.tenor.com/videos/2672812657916117746/video.mp4",
]

export default function Hero() {
  const [currentGifIndex, setCurrentGifIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentGifIndex((prev) => (prev + 1) % GIF_URLS.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {GIF_URLS.map((url, index) => (
          <video
            key={index}
            src={url}
            autoPlay
            loop
            muted
            playsInline
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentGifIndex ? "opacity-100" : "opacity-0"
            }`}
            crossOrigin="anonymous"
          />
        ))}

        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight">
            <span className="block text-foreground">BEM-VINDO AO</span>
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              ANIMES CAFÉ
            </span>
          </h1>
        </div>

        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          O seu refúgio otaku no Discord!
        </p>

        <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
          Junte-se à nossa comunidade incrível de fãs de anime. Assista, discuta e faça amigos que compartilham sua
          paixão.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <a
            href="https://discord.gg/animes-cafe"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-bold text-lg transition-all duration-200 hover:shadow-lg glow-primary"
          >
            Entrar no Servidor
          </a>
          <a
            href="#eventos"
            className="px-8 py-4 bg-card hover:bg-card/80 text-foreground border-2 border-border rounded-full font-bold text-lg transition-all duration-200"
          >
            Ver Eventos
          </a>
        </div>

        <div className="absolute top-1/3 right-10 text-4xl animate-bounce opacity-30">🎌</div>
      </div>
    </section>
  )
}

"use client"

import Link from "next/link"
import { useState } from "react"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Animes Café
          </span>
          <span className="text-2xl">🍵</span>
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg hover:bg-card transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#" className="hover:text-primary transition-colors font-medium">
            Início
          </Link>
          <Link href="#eventos" className="hover:text-primary transition-colors font-medium">
            Eventos
          </Link>
          <Link href="#suporte" className="hover:text-primary transition-colors font-medium">
            Suporte
          </Link>
          <a
            href="https://discord.gg/animes-cafe"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full font-semibold transition-all duration-200 hover:shadow-lg glow-primary"
          >
            Discord
          </a>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-card border-b border-border md:hidden">
            <div className="flex flex-col p-4 gap-4">
              <Link href="#" className="hover:text-primary transition-colors font-medium">
                Início
              </Link>
              <Link href="#eventos" className="hover:text-primary transition-colors font-medium">
                Eventos
              </Link>
              <Link href="#suporte" className="hover:text-primary transition-colors font-medium">
                Suporte
              </Link>
              <a
                href="https://discord.gg/animes-cafe"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full font-semibold transition-all duration-200 text-center"
              >
                Discord
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

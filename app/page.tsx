import Header from "@/components/header"
import Hero from "@/components/hero"
import Events from "@/components/events"
import Support from "@/components/support"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-background">
      <Header />
      <Hero />
      <Events />
      <Support />
      <Footer />
    </main>
  )
}

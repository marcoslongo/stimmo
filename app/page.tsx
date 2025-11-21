import dynamic from "next/dynamic"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"

const Lojas = dynamic(
  () => import("@/components/lojas").then((mod) => ({ default: mod.Lojas })),
  {
    loading: () => <div className="py-20 text-center">Carregando...</div>,
  },
)

const Features = dynamic(() => import("@/components/features").then((mod) => ({ default: mod.Features })), {
  loading: () => <div className="py-20 text-center">Carregando...</div>,
})

const Celebridades = dynamic(() => import("@/components/celebridades").then((mod) => ({ default: mod.Celebridades })), {
  loading: () => <div className="py-20 text-center">Carregando...</div>,
})

const Portfolio = dynamic(() => import("@/components/portfolio").then((mod) => ({ default: mod.Portfolio })), {
  loading: () => <div className="py-20 text-center">Carregando...</div>,
})

const Depoimentos = dynamic(() => import("@/components/depoimentos").then((mod) => ({ default: mod.Depoimentos })), {
  loading: () => <div className="py-20 text-center">Carregando...</div>,
})

const Footer = dynamic(() => import("@/components/footer").then((mod) => ({ default: mod.Footer })), {
  loading: () => <div className="py-20 text-center">Carregando...</div>,
})

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Lojas />
      <Portfolio />
      <Features />
      <Depoimentos />
      <Celebridades />
      <Footer />
    </main>
  )
}

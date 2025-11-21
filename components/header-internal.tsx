"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

export function HeaderInternal() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    if (pathname === "/") {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
      setIsMobileMenuOpen(false)
    } else {
      router.push(`/#${id}`)
    }
  }

  const menuItems = [
    { label: "Início", id: "hero" },
    { label: "Unidades", id: "lojas" },
    { label: "Nosso portfólio", id: "portfolio" },
    { label: "Ateliê", id: "atelier" },
    { label: "Depoimentos", id: "social-proof" },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black/75 backdrop-blur-md shadow-md py-6",
        isMobileMenuOpen && "!bg-black/75"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => scrollToSection("hero")}
            className="text-2xl font-light text-foreground hover:text-primary transition-colors cursor-pointer"
          >
            <Image
              width={225}
              height={51}
              alt="Simonetto Móveis planejados"
              src={"/assets/images/simonetto-white.webp"}
            />
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-md text-white hover:text-[#f21e1d] transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            <Button
              onClick={() => scrollToSection("hero")}
              className="bg-[#f21e1d] text-white hover:bg-[#f21e1d] cursor-pointer"
            >
              Solicitar Orçamento
            </Button>
          </nav>

          <button
            className="md:hidden text-foreground cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left text-white hover:text-[#f21e1d] transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <Button
                size="sm"
                onClick={() => scrollToSection("hero")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full cursor-pointer"
              >
                Solicitar Orçamento
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
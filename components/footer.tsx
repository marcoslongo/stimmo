import { Mail, Phone } from "lucide-react"
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import Image from "next/image"

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#3A3156] backdrop-blur-md text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="flex flex-col gap-4">
              <Image
                width={160}
                height={54}
                alt="Simonetto Móveis planejados"
                src={'/assets/images/stimmo.webp'}
              />
              <p className="text-sm text-primary-foreground/80 leading-relaxed">
                Transformando ambientes com design exclusivo, qualidade e muita personalização desde 1987.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Navegação</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#lojas"
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                    aria-label="Acessar seção de lojas"
                  >
                    Nossas Unidades
                  </a>
                </li>
                <li>
                  <a
                    href="#atelier"
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                    aria-label="Acessar seção de Ateliê"
                  >
                    Ateliê
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                    aria-label="Acessar formulário de interesse"
                  >
                    Orçamento
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-primary-foreground/80">
                  <Phone className="h-4 w-4" />
                  <span>(46) 3547-2833</span>
                </li>
                <li className="flex items-center gap-2 text-primary-foreground/80">
                  <Mail className="h-4 w-4" />
                  <span>contato@simonetto.com.br</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Redes Sociais</h4>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/simonetto.ampere" aria-label="Acessar página facebook" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  <FaFacebook className="h-6 w-6" />
                </a>
                <a href="https://www.instagram.com/simonetto.oficial/" aria-label="Acessar página instagram" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  <FaInstagram className="h-6 w-6" />
                </a>
                <a href="https://www.youtube.com/@simonettomoveis" aria-label="Acessar página Youtube" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  <FaYoutube className="h-6 w-6" />
                </a>
                <a href="https://www.tiktok.com/@simonetto.oficial" aria-label="Acessar página Tiktok" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  <FaTiktok className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/60">
            <p>© {year} Stimmo. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

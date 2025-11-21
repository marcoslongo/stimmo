"use client"

import { useState } from "react"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PortfolioItem } from "@/types/portfolio"

interface PortfolioDetailsModalProps {
  item: PortfolioItem
  onOpenQuoteForm: () => void
}

export function PortfolioDetailsModal({ item, onOpenQuoteForm }: PortfolioDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const allImages = item.images && item.images.length > 0 
    ? item.images 
    : [item.image]

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-3xl font-light text-charcoal">{item.title}</DialogTitle>
        {item.category && (
          <span className="text-sm text-charcoal/50">{item.category}</span>
        )}
      </DialogHeader>

      <div className="mt-6 space-y-6">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-sand">
          {allImages.length > 0 && (
            <>
              <Image
                src={allImages[currentImageIndex] || "/placeholder.svg"}
                alt={`${item.title} - Imagem ${currentImageIndex + 1}`}
                fill
                className="object-cover"
              />
              
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white hover:scale-110"
                    aria-label="Imagem anterior"
                  >
                    <ChevronLeft className="h-6 w-6 text-charcoal" />
                  </button>
                  
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white hover:scale-110"
                    aria-label="Próxima imagem"
                  >
                    <ChevronRight className="h-6 w-6 text-charcoal" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {allImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === currentImageIndex 
                            ? "w-8 bg-white" 
                            : "w-2 bg-white/50 hover:bg-white/75"
                        }`}
                        aria-label={`Ir para imagem ${index + 1}`}
                      />
                    ))}
                  </div>

                  <div className="absolute top-4 right-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-sm">
                    {currentImageIndex + 1} / {allImages.length}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {allImages.length > 1 && (
          <div className="flex flex-wrap gap-2 overflow-x-auto p-2">
            {allImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg transition-all ${
                  index === currentImageIndex 
                    ? "ring-2 ring-[#f21e1d] ring-offset-2" 
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`Miniatura ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {item.description && (
          <div className="space-y-4 border-t border-charcoal/10 pt-6">
            <h3 className="text-xl font-medium text-charcoal">Sobre este projeto</h3>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-line leading-relaxed text-charcoal/70">
                {item.description}
              </p>
            </div>
          </div>
        )}

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-charcoal/10 pt-6">
            {item.tags.map((tag) => (
              <span 
                key={tag} 
                className="rounded-full bg-[#f21e1d]/10 px-4 py-2 text-sm font-medium text-[#f21e1d]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="grid gap-4 border-t border-charcoal/10 pt-6 sm:grid-cols-2">
          <div className="rounded-lg bg-sand p-4">
            <h4 className="mb-2 font-medium text-charcoal">Materiais</h4>
            <p className="text-sm text-charcoal/70">
              Madeira nobre, ferragens importadas, acabamentos premium
            </p>
          </div>
          <div className="rounded-lg bg-sand p-4">
            <h4 className="mb-2 font-medium text-charcoal">Tecnologia</h4>
            <p className="text-sm text-charcoal/70">
              Maquinário europeu de alta precisão, design 3D
            </p>
          </div>
        </div>

        <div className="flex justify-center border-t border-charcoal/10 pt-6">
          <button
            onClick={onOpenQuoteForm}
            className="group relative overflow-hidden rounded-full bg-[#f21e1d] px-8 py-3 font-medium text-white shadow-lg shadow-[#f21e1d]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#f21e1d]/40 hover:scale-105 cursor-pointer"
          >
            <span className="relative z-10">Quero usar como referência em meu projeto</span>
          </button>
        </div>
      </div>
    </>
  )
}
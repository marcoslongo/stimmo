"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, Clock, Mail, Globe } from "lucide-react"
import Image from "next/image"

interface Store {
  id: string
  name: string
  address: string
  city: string
  state: string
  phone: string
  hours: string
  lat: number
  lng: number
  email?: string
  website?: string
  description?: string
  images?: string[]
}

interface StoreDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  store: Store | null
}

export function StoreDetailsModal({ isOpen, onClose, store }: StoreDetailsModalProps) {
  if (!store) return null

  const storeImages = store.images?.filter(Boolean) ?? []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{store.name}</DialogTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>
              {store.city}, {store.state}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {storeImages.length > 0 && (
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {storeImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <Card className="border-0 shadow-none">
                        <CardContent className="p-0">
                          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`${store.name} - Imagem ${index + 1}`}
                              fill
                              className="object-cover"
                              priority={index === 0}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </div>
          )}

          {store.description && (
            <div>
              <h3 className="font-semibold mb-2">Sobre a Loja</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{store.description}</p>
            </div>
          )}

          <Separator />

          <div>
            <h3 className="font-semibold mb-4">Informações de Contato</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Endereço</p>
                  <p className="text-sm text-muted-foreground">
                    {store.address}, {store.city} - {store.state}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Telefone</p>
                  <a
                    href={`tel:${store.phone.replace(/\D/g, "")}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Telefone loja"
                  >
                    {store.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Horário de Funcionamento</p>
                  <p className="text-sm text-muted-foreground">{store.hours}</p>
                </div>
              </div>

              {store.email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">E-mail</p>
                    <a
                      href={`mailto:${store.email}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Email loja"
                    >
                      {store.email}
                    </a>
                  </div>
                </div>
              )}

              {store.website && (
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Website</p>
                    <a
                      href={store.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Site loja"
                    >
                      Visitar site
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
"use client"

import { useState, useMemo, useRef } from "react"
import { motion, type Variants } from "framer-motion"
import { useInView } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Clock, LocateFixed } from "lucide-react"
import { AppointmentModal } from "./appointment-modal"
import { StoreDetailsModal } from "./store-details-modal"
import { GetLojasHomeQuery } from "@/generated/graphql"
import Image from "next/image"

interface StoreSelectorProps {
  data: GetLojasHomeQuery;
}

const MAX_DISTANCE_KM = 300

const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function StoreSelector({ data }: StoreSelectorProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedStore, setSelectedStore] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStoreDetails, setSelectedStoreDetails] = useState<any | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)

  const lojas = data?.lojas?.edges ?? []

  const stores = lojas
    .map((edge, index) => {
      const loja = edge?.node?.acfLojas
      const nodeId = edge?.node?.databaseId
      if (!loja) return null
      return {
        id: nodeId?.toString() || index.toString(),
        name: loja.nomeLoja ?? "Loja sem nome",
        city: loja.cidade ?? "",
        state: loja.estado ?? "",
        address: loja.endereco ?? "",
        phone: loja.telefone ?? "",
        email: loja.emails?.[0]?.email ?? "",
        hours: loja.horarioFuncionamento ?? null,
        lat: loja.latitude ? Number(loja.latitude) : 0,
        lng: loja.longitude ? Number(loja.longitude) : 0,
        images: loja.galeriaFotos?.nodes?.map((img: any) => img?.mediaItemUrl) ?? [],
        region: loja.nomeLoja ?? "",
      }
    })
    .filter(Boolean)

  const getUserLocation = () => {
    setLocationError(null)
    setIsLoadingLocation(true)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setIsLoadingLocation(false)
        },
        (error) => {
          let errorMessage = "Não foi possível acessar sua localização."
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Permissão de localização negada. Por favor, permita o acesso à localização."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Localização indisponível. Verifique se o GPS está ativado."
              break
            case error.TIMEOUT:
              errorMessage = "Tempo de espera para obter localização esgotado."
              break
          }
          setLocationError(errorMessage)
          setIsLoadingLocation(false)
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
      )
    } else {
      setLocationError("Geolocalização não é suportada pelo seu navegador.")
      setIsLoadingLocation(false)
    }
  }

  const nearbyStores = useMemo(() => {
    if (!userLocation) return []
    const storesWithDistance = stores.map((store) => ({
      ...store,
      distance: calculateDistance(userLocation.lat, userLocation.lng, store?.lat!, store?.lng!),
    }))
    const filtered = storesWithDistance.filter((store) => store.distance <= MAX_DISTANCE_KM)
    return filtered.sort((a, b) => a.distance - b.distance)
  }, [userLocation, stores])

  const handleScheduleVisit = (store: any) => {
    setSelectedStore(store)
    setIsModalOpen(true)
  }

  const handleShowDetails = (store: any) => {
    setSelectedStoreDetails(store)
    setIsDetailsModalOpen(true)
  }

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.17, 0.67, 0.83, 0.67] },
    },
  }

  return (
    <section id="lojas" className="py-32 bg-muted relative overflow-hidden" ref={ref}>
      <Image
        src={'/assets/images/detail-01.webp'}
        width={350}
        height={174}
        alt=""
        className="absolute top-[-80px] lg:top-[180px] left-0 z-10"
      />
      <Image
        src={'/assets/images/detail-02.webp'}
        width={350}
        height={174}
        alt=""
        className="absolute bottom-[-80px] lg:top-[180px] right-0"
      />
      <div className="container mx-auto px-4 py-4 relative z-20 bg-muted 2xl:bg-transparent">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-balance">
              Encontre a Stimmo mais próxima
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Mais de 80 revendas no Brasil, nos EUA e no Chile, com uma indústria que soma quase 40 anos de credibilidade
            </p>
          </motion.div>

          <motion.div
            className="mb-8 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Button
              onClick={getUserLocation}
              className="h-12 px-6 cursor-pointer"
              disabled={!!userLocation || isLoadingLocation}
            >
              <LocateFixed className="mr-2 h-5 w-5" />
              {isLoadingLocation ? "Buscando..." : userLocation ? "Localização Ativa" : "Usar Minha Localização"}
            </Button>
          </motion.div>

          {locationError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg text-center"
            >
              {locationError}
            </motion.div>
          )}

          {userLocation && !isLoadingLocation && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
              {nearbyStores.length > 0 ? (
                <div className="grid gap-4">
                  {nearbyStores.map((store, index) => (
                    <motion.div key={store.id} variants={cardVariants} transition={{ delay: index * 0.05 }}>
                      <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          <div className="flex-1">
                            <div className="mb-2">
                              <h4 className="font-semibold text-sm sm:text-base">{store.name}</h4>
                            </div>
                            <div className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                                <span className="break-words">
                                  {store.address}, {store.city} - {store.state}
                                </span>
                              </div>

                              {store.distance !== undefined && (
                                <div className="flex items-start gap-2">
                                  <LocateFixed className="h-4 w-4 shrink-0 mt-0.5" />
                                  <span>{store.distance.toFixed(1)} km de distância</span>
                                </div>
                              )}
                              {store.hours &&
                                <div className="flex items-start gap-2">
                                  <Clock className="h-4 w-4 shrink-0 mt-0.5" />
                                  <span className="break-words">{store.hours}</span>
                                </div>
                              }
                              <div className="flex items-start gap-2">
                                <Phone className="h-4 w-4 shrink-0 mt-0.5" />
                                <span className="break-words">{store.phone}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col lg:flex-row gap-2">
                            {store.lat !== 0 && store.lng !== 0 && (
                              <Button
                                variant="outline"
                                size="icon"
                                className="cursor-pointer shrink-0"
                                onClick={() =>
                                  window.open(
                                    `https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`,
                                    "_blank"
                                  )
                                }
                              >
                                <MapPin className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              className="cursor-pointer text-xs sm:text-sm whitespace-nowrap"
                              variant="outline"
                              onClick={() => handleShowDetails(store)}
                            >
                              Mais informações
                            </Button>
                            <Button
                              className="bg-[#f21e1d] hover:bg-[#f21e1d]/90 cursor-pointer text-xs sm:text-sm whitespace-nowrap"
                              onClick={() => handleScheduleVisit(store)}
                            >
                              Solicitar atendimento
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <div className="max-w-md mx-auto space-y-4">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
                    <h3 className="text-xl font-semibold">Nenhuma loja próxima encontrada</h3>
                    <p className="text-muted-foreground">
                      Não encontramos lojas Simonetto próximas à sua localização no momento. <br />
                      Mas não se preocupe — nossa equipe pode te ajudar a encontrar a unidade mais conveniente.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        onClick={() =>
                          document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })
                        }
                      >
                        Entrar em contato
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {selectedStore && (
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          storeName={selectedStore.name}
          storeCity={selectedStore.city}
          storeStateId={selectedStore.state}
          storeId={selectedStore.id}
          storeRegion={selectedStore.region}
        />
      )}

      <StoreDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        store={selectedStoreDetails}
      />
    </section>
  )
}
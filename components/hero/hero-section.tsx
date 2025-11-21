"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useFavorites } from "@/contexts/favorites-context"
import { getDistance } from "@/utils/getDistance"
import { HeroContent } from "./hero-content"
import { HeroForm } from "./hero-form"
import { GetLojasHomeQuery } from "@/generated/graphql"

interface HeroSectionProps {
  lojas: GetLojasHomeQuery
}

export function HeroSection({ lojas }: HeroSectionProps) {
  const { favoriteStore, setFavoriteStore } = useFavorites()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    interests: [] as string[],
    message: "",
    storeId: "",
    state: "",
    investment: "",
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [sortedStores, setSortedStores] = useState<any[]>([])
  const [locationRequested, setLocationRequested] = useState(false)

  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, 250])

  const formattedStores = useMemo(() => {
    if (!lojas?.lojas?.edges?.length) return []

    return lojas.lojas.edges
      .filter(({ node }) => !!node?.acfLojas)
      .map(({ node }) => {
        const loja = node.acfLojas

        return {
          id: node.databaseId?.toString() || node.id,
          name: loja?.nomeLoja || "Loja sem nome",
          city: loja?.cidade || "",
          state: loja?.estado || "",
          address: loja?.endereco || "",
          phone: loja?.telefone || "",
          whatsapp: loja?.whatsapp || "",
          lat: loja?.latitude ? Number(loja.latitude) : null,
          lng: loja?.longitude ? Number(loja.longitude) : null,
        }
      })
  }, [lojas])

  useEffect(() => {
    setSortedStores(formattedStores)
  }, [formattedStores])

  useEffect(() => {
    if (favoriteStore && !formData.storeId) {
      setFormData((prev) => ({ ...prev, storeId: favoriteStore.id }))
    }
  }, [favoriteStore])

  const handleOpenStoresSelect = () => {
    if (locationRequested) return
    setLocationRequested(true)

    if (!navigator.geolocation) {
      setSortedStores([...formattedStores].sort((a, b) => a.name.localeCompare(b.name)))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const ordered = [...formattedStores].sort((a, b) => {
          const distA = getDistance(latitude, longitude, a.lat!, a.lng!)
          const distB = getDistance(latitude, longitude, b.lat!, b.lng!)
          return distA - distB
        })
        setSortedStores(ordered)
      },
      () => {
        const ordered = [...formattedStores].sort((a, b) => a.name.localeCompare(b.name))
        setSortedStores(ordered)
      }
    )
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-10"
    >
      <motion.div
        className="absolute inset-0"
        style={{ y }}
        animate={{ scale: [1, 1.04, 1] }}
        transition={{
          duration: 12,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <Image
          src="/assets/images/hero.webp"
          fill
          alt="Cozinha planejada de luxo"
          className="w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 pt-20 md:pt-20 pb-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <HeroContent />
          <HeroForm
            formData={formData}
            setFormData={setFormData}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            sortedStores={sortedStores}
            handleOpenStoresSelect={handleOpenStoresSelect}
            favoriteStore={favoriteStore}
            setFavoriteStore={setFavoriteStore}
          />
        </div>
      </div>
    </section>
  )
}
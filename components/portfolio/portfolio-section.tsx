"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useFavorites } from "@/contexts/favorites-context"
import { ModalView, FormData, PortfolioDetailsResponse } from "@/types/portfolio"
import { QuoteForm } from "./portfolio-quote-form"
import { CategoryFilter } from "./portfolio-category-filter"
import { PortfolioItem } from "./portfolio-content"
import { PortfolioDetailsModal } from "./portfolio-details-modal"
import { GetCategoriasPortfolioHomeQuery, GetLojasHomeQuery, GetPortfolioHomeQuery } from "@/generated/graphql"
import { getPortfolioBySlug } from "@/services/getPortfolioBySlug"
import { PortfolioDetailsSkeleton } from "./portfolio-details-skeleton"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface PortfolioSectionProps {
  data: GetPortfolioHomeQuery
  categories: GetCategoriasPortfolioHomeQuery
  lojas: GetLojasHomeQuery
}

export default function PortfolioSection({ data, categories, lojas }: PortfolioSectionProps) {
  const firstCategoryId = categories.categoriasPortfolio?.edges[0]?.node.id || ""
  const [activeCategory, setActiveCategory] = useState(firstCategoryId)
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const [selectedItemSlug, setSelectedItemSlug] = useState<string | null>(null)
  const [modalView, setModalView] = useState<ModalView>("details")
  const { toast } = useToast()

  const { favoriteStore } = useFavorites()

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    state: "",
    city: "",
    interests: [],
    investment: "",
    storeId: "",
    message: "",
  })

  const [selectedItemDetails, setSelectedItemDetails] = useState<PortfolioDetailsResponse | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  useEffect(() => {
    if (firstCategoryId && !activeCategory) setActiveCategory(firstCategoryId)
  }, [firstCategoryId, activeCategory])

  useEffect(() => {
    if (favoriteStore && formData.storeId !== favoriteStore.id) {
      setFormData((prev) => ({ ...prev, storeId: favoriteStore.id }))
    }
  }, [favoriteStore, formData.storeId])

  const currentItems = useMemo(() => {
    if (!data.projetos?.edges || !activeCategory) return []
    return data.projetos.edges
      .filter((edge) =>
        edge.node.categoriasPortfolio?.edges.some((cat) => cat.node.id === activeCategory)
      )
      .map((edge) => {
        const rawId = edge.node.id
        const numericId = parseInt(rawId.replace(/\D/g, "")) || parseInt(rawId)
        return {
          id: numericId,
          slug: edge.node.slug || "",
          title: edge.node.title || "",
          category: edge.node.categoriasPortfolio?.edges[0]?.node.name || "",
          image: edge.node.acfPortfolio?.image?.node?.mediaItemUrl || "",
          description: edge.node.acfPortfolio?.description || "",
          images:
            edge.node.acfPortfolio?.gallery?.nodes
              ?.map((img) => img.mediaItemUrl)
              .filter((url): url is string => !!url) || [],
          tags:
            edge.node.tags?.edges
              ?.map((tag) => tag.node.name)
              .filter((name): name is string => !!name) || [],
        }
      })
  }, [data.projetos, activeCategory])

  useEffect(() => {
    async function fetchDetails() {
      if (!selectedItemSlug) {
        setSelectedItemDetails(null)
        return
      }

      setSelectedItemDetails(null)
      setLoadingDetails(true)

      try {
        const result = await getPortfolioBySlug(selectedItemSlug)
        setSelectedItemDetails(result)
      } catch {
        setSelectedItemDetails(null)
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os detalhes do projeto.",
        })
      } finally {
        setLoadingDetails(false)
      }
    }

    fetchDetails()
  }, [selectedItemSlug, toast])

  const handleSelectItem = (slug: string) => {
    const item = currentItems.find((item) => item.slug === slug)
    if (item) {
      setSelectedItem(item.id)
      setSelectedItemSlug(item.slug)
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível identificar o projeto selecionado.",
      })
    }
  }

  const handleOpenQuoteForm = () => {
    setModalView("quote")
    if (selectedItemDetails) {
      const activeCategoryName =
        categories.categoriasPortfolio?.edges.find((cat) => cat.node.id === activeCategory)
          ?.node.name ?? ""
      setFormData((prev) => ({
        ...prev,
        interests: [activeCategoryName.toLowerCase()],
        message: `Gostaria de usar "${selectedItemDetails.title ?? "este projeto"}" como referência para meu projeto.`,
        storeId: favoriteStore?.id || prev.storeId,
      }))
    }
  }

  const handleBackToDetails = () => setModalView("details")

  const handleCloseModal = () => {
    setSelectedItem(null)
    setSelectedItemSlug(null)
    setSelectedItemDetails(null)
    setModalView("details")
  }

  const handleSubmitSuccess = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      state: "",
      city: "",
      interests: [],
      investment: "",
      storeId: "",
      message: "",
    })
    handleCloseModal()
  }

  const renderModalContent = () => {
    if (loadingDetails) return <PortfolioDetailsSkeleton />
    if (!selectedItemDetails)
      return <div className="py-12 text-center text-charcoal/70">Erro ao carregar detalhes do projeto.</div>

    const item = {
      id: selectedItem || 0,
      title: selectedItemDetails.title ?? "",
      category: selectedItemDetails.categoriasPortfolio?.edges?.[0]?.node?.name ?? "",
      image: selectedItemDetails.acfPortfolio?.image?.node?.mediaItemUrl ?? "",
      description: selectedItemDetails.acfPortfolio?.description ?? "",
      images:
        selectedItemDetails.acfPortfolio?.gallery?.nodes
          ?.map((img) => img.mediaItemUrl ?? "")
          .filter((url): url is string => url !== "") || [],
      tags:
        selectedItemDetails.tags?.edges
          ?.map((tag) => tag.node.name ?? "")
          .filter((name): name is string => name !== "") || [],
    }

    if (modalView === "details")
      return <PortfolioDetailsModal item={item} onOpenQuoteForm={handleOpenQuoteForm} />

    if (modalView === "quote")
      return (
        <QuoteForm
          item={item}
          formData={formData}
          onFormDataChange={setFormData}
          onBackToDetails={handleBackToDetails}
          onSubmitSuccess={handleSubmitSuccess}
          sortedStores={lojas}
        />
      )
  }

  return (
    <section className="bg-white py-24 lg:pt-32 lg:pb-24 relative" id="portfolio">
      <Image
        alt=""
        src={"/assets/images/img-azul.webp"}
        width={800}
        height={100}
        className="absolute top-0 right-0"
      />
      <Image
        alt=""
        src={"/assets/images/img-azul.webp"}
        width={800}
        height={100}
        className="absolute bottom-0 left-0"
      />
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl font-semibold tracking-tight text-charcoal lg:text-6xl"
          >
            Nosso portfólio
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-charcoal/70"
          >
            Cada projeto é uma obra única, criada com atenção aos mínimos detalhes e tecnologia
            europeia de ponta
          </motion.p>
        </div>

        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            {currentItems.length > 0 ? (
              <Carousel
                opts={{
                  align: "start",
                  loop: false,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4 select-none pb-6">
                  {currentItems.map((item, index) => (
                    <CarouselItem key={`${item.id}-${item.slug || index}`} className="pl-4 md:basis-1/2 lg:basis-1/3">
                      <PortfolioItem
                        item={item}
                        index={index}
                        onSelectItem={() => handleSelectItem(item.slug)}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center gap-2 mt-6">
                  <CarouselPrevious className="relative -translate-y-0" />
                  <CarouselNext className="relative -translate-y-0" />
                </div>
              </Carousel>
            ) : (
              <div className="col-span-full text-center py-12 text-charcoal/50">
                Nenhum projeto encontrado nesta categoria.
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && handleCloseModal()}>
        <DialogContent
          className="max-h-[90vh] overflow-y-auto w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] max-w-full md:max-w-4xl p-4 sm:p-6"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Detalhes do projeto</DialogTitle>
          </DialogHeader>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${modalView}-${selectedItemSlug || ""}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderModalContent()}
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>

    </section>
  )
}
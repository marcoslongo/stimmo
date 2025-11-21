"use client"

import { useState } from "react"
import { motion, Variants } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { FormFields } from "./form-fields"

const formVariants: Variants = {
  hidden: { opacity: 0, x: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.17, 0.55, 0.55, 1], delay: 0.5 },
  },
}

interface HeroFormProps {
  formData: {
    name: string
    email: string
    phone: string
    state: string
    city: string
    interests: string[]
    message: string
    storeId: string
    investment: string
  }
  setFormData: React.Dispatch<React.SetStateAction<any>>
  formErrors: Record<string, string>
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
  sortedStores: any[]
  handleOpenStoresSelect: () => void
  favoriteStore: any
  setFavoriteStore: (store: any) => void
}

export function HeroForm({
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  sortedStores,
  handleOpenStoresSelect,
  favoriteStore,
  setFavoriteStore,
}: HeroFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) {
      errors.name = "Nome completo é obrigatório"
    }

    if (!formData.email.trim()) {
      errors.email = "E-mail é obrigatório"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "E-mail inválido"
    }

    if (!formData.phone.trim()) {
      errors.phone = "Telefone/WhatsApp é obrigatório"
    } else if (!/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = "Telefone inválido"
    }

    if (!formData.state) {
      errors.state = "Estado é obrigatório"
    }

    if (!formData.city.trim()) {
      errors.city = "Cidade é obrigatória"
    }

    if (formData.interests.length === 0) {
      errors.interests = "Selecione pelo menos um ambiente de interesse"
    }

    if (!formData.investment) {
      errors.investment = "Informe o valor aproximado de investimento"
    }

    if (!formData.storeId) {
      errors.storeId = "Selecione uma unidade de preferência"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Por favor, preencha todos os campos obrigatórios corretamente.", {
        duration: 5000,
      })
      return
    }

    let selectedStore = favoriteStore
    if (!selectedStore && formData.storeId) {
      const store = sortedStores.find((s) => s.id.toString() === formData.storeId)
      if (store) {
        selectedStore = {
          id: store.id.toString(),
          name: store.name,
          city: store.city,
          state: store.state,
          address: store.address,
          phone: store.phone,
          whatsapp: store.whatsapp,
          hours: store.hours,
          lat: store.lat,
          lng: store.lng,
        }
        setFavoriteStore(selectedStore)
      }
    }

    const estadoNome = await getEstadoNome(formData.state)

    const payload = {
      nome: formData.name,
      email: formData.email,
      telefone: formData.phone,
      cidade: formData.city,
      estado: estadoNome,
      interesse: formData.interests.join(", "),
      expectativaInvestimento: formData.investment,
      lojaRegiao: selectedStore?.name || "",
      lojaId: formData.storeId,
      mensagem: formData.message || "",
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/pipefy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar orçamento")
      }

      console.log("Lead criado:", data)

      toast.success(
        "Orçamento solicitado! Entraremos em contato em breve para conversarmos sobre seu projeto.",
        {
          duration: 5000,
        }
      )

      setFormData({
        name: "",
        email: "",
        phone: "",
        state: "",
        city: "",
        interests: [],
        message: "",
        storeId: "",
        investment: "",
      })
      setFormErrors({})
      setFavoriteStore(null)
    } catch (error) {
      console.error("Erro ao enviar formulário:", error)
      toast.error(
        "Ocorreu um erro ao enviar seu orçamento. Por favor, tente novamente.",
        {
          duration: 5000,
        }
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const getEstadoNome = async (estadoId: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}`
      )
      const data = await response.json()
      return data.sigla || estadoId
    } catch (error) {
      console.error("Erro ao buscar nome do estado:", error)
      return estadoId
    }
  }

  return (
    <motion.div className="w-full" variants={formVariants} initial="hidden" animate="visible">
      <Card className="p-6 md:p-8 bg-white backdrop-blur-sm shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-medium mb-2 text-balance">
            Solicite seu orçamento
          </h2>
          <p className="text-sm text-muted-foreground">
            Receba uma proposta personalizada
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormFields
            formData={formData}
            setFormData={setFormData}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            sortedStores={sortedStores}
            handleOpenStoresSelect={handleOpenStoresSelect}
            favoriteStore={favoriteStore}
          />

          <div className="md:col-span-2 flex flex-col gap-2">
            <Button
              type="submit"
              size="lg"
              className="w-full cursor-pointer bg-[#f21e1d] hover:bg-[#f21e1d]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Solicitar orçamento"
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Ao enviar este formulário, você concorda com nossa <a className="underline" aria-label="AAcessar políticas de privacidade" href="/politicas-de-privacidade">política de privacidade</a>
            </p>
          </div>
        </form>
      </Card>
    </motion.div>
  )
}
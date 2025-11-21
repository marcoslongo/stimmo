"use client"

import { useState, useEffect, useMemo } from "react"
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronsUpDown, MapPin } from "lucide-react"
import { toast } from "sonner"
import { FormData, PortfolioItem } from "@/types/portfolio"
import { GetLojasHomeQuery } from "@/generated/graphql"
import { StoreSelectorForm } from "../lojas/store-selector-form"
import { getDistance } from "@/utils/getDistance"
import { interestOptions, investmentOptions } from "@/utils/constantes"

interface QuoteFormProps {
  item: PortfolioItem
  formData: FormData
  onFormDataChange: (data: FormData) => void
  onBackToDetails: () => void
  onSubmitSuccess: () => void
  sortedStores: GetLojasHomeQuery
}

interface Estado {
  id: number
  nome: string
}

interface Cidade {
  id: number
  nome: string
}

interface StoreForSelector {
  id: string
  name: string
  city: string
  state: string
  address: string
  lat: number
  lng: number
  brand: string
  phone: string
  whatsapp: string
  hours: string
}

export function QuoteForm({
  item,
  formData,
  onFormDataChange,
  onBackToDetails,
  onSubmitSuccess,
  sortedStores,
}: QuoteFormProps) {
  const [estados, setEstados] = useState<Estado[]>([])
  const [cidades, setCidades] = useState<Cidade[]>([])
  const [loadingEstados, setLoadingEstados] = useState(true)
  const [loadingCidades, setLoadingCidades] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)
  const [locationRequested, setLocationRequested] = useState(false)
  const [sortedStoresByDistance, setSortedStoresByDistance] = useState<StoreForSelector[]>([])

  const stores = useMemo<StoreForSelector[]>(() => {
    return (
      sortedStores?.lojas?.edges
        ?.map((edge) => {
          const loja = edge.node
          const acf = loja.acfLojas

          if (!acf) return null

          return {
            id: loja.databaseId.toString(),
            name: acf.nomeLoja || `${acf.cidade || ""} - ${acf.estado || ""}`,
            city: acf.cidade || "",
            state: acf.estado || "",
            address: acf.endereco || "",
            lat: acf.latitude ? parseFloat(acf.latitude) : 0,
            lng: acf.longitude ? parseFloat(acf.longitude) : 0,
            brand: "",
            phone: acf.telefone || "",
            whatsapp: acf.whatsapp || "",
          }
        })
        .filter((store): store is StoreForSelector => store !== null) || []
    )
  }, [sortedStores])

  useEffect(() => {
    if (stores.length > 0 && sortedStoresByDistance.length === 0) {
      setSortedStoresByDistance([...stores].sort((a, b) => a.name.localeCompare(b.name)))
    }
  }, [stores, sortedStoresByDistance.length])

  const handleStoreSelectOpen = () => {
    if (locationRequested) return
    setLocationRequested(true)

    if (!navigator.geolocation) {
      setSortedStoresByDistance([...stores].sort((a, b) => a.name.localeCompare(b.name)))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const ordered = [...stores].sort((a, b) => {
          const distA = a.lat && a.lng ? getDistance(latitude, longitude, a.lat, a.lng) : Infinity
          const distB = b.lat && b.lng ? getDistance(latitude, longitude, b.lat, b.lng) : Infinity
          return distA - distB
        })
        setSortedStoresByDistance(ordered)
      },
      () => {
        const ordered = [...stores].sort((a, b) => a.name.localeCompare(b.name))
        setSortedStoresByDistance(ordered)
      }
    )
  }

  useEffect(() => {
    const loadEstados = async () => {
      try {
        const res = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
        const data = await res.json()
        setEstados(data)
      } catch (err) {
        console.error("Erro ao carregar estados:", err)
      } finally {
        setLoadingEstados(false)
      }
    }
    loadEstados()
  }, [])

  useEffect(() => {
    const loadCidades = async () => {
      if (!formData.state) return setCidades([])
      setLoadingCidades(true)
      try {
        const res = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.state}/municipios`
        )
        const data = await res.json()
        setCidades(data)
      } catch (err) {
        console.error("Erro ao carregar cidades:", err)
      } finally {
        setLoadingCidades(false)
      }
    }
    loadCidades()
  }, [formData.state])

  const handleInputChange = (field: keyof FormData, value: any) => {
    onFormDataChange({ ...formData, [field]: value })
    if (formErrors[field]) {
      const { [field]: _, ...rest } = formErrors
      setFormErrors(rest)
    }
  }

  const handleInterestToggle = (value: string) => {
    const currentInterests = Array.isArray(formData.interests) ? formData.interests : []
    const newInterests = currentInterests.includes(value)
      ? currentInterests.filter((i) => i !== value)
      : [...currentInterests, value]

    handleInputChange("interests", newInterests)
  }

  const getInterestLabel = () => {
    if (formData.interests.length === 0) return "Selecione os ambientes"
    if (formData.interests.length === 1) {
      return "Selecione os ambientes"
    }
    return `${formData.interests.length} ambientes selecionados`
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.name?.trim()) errors.name = "Nome completo é obrigatório"
    if (!formData.email?.trim()) errors.email = "E-mail é obrigatório"
    if (!formData.phone?.trim()) errors.phone = "Telefone é obrigatório"
    if (!formData.state) errors.state = "Estado é obrigatório"
    if (!formData.city) errors.city = "Cidade é obrigatória"

    const interests = Array.isArray(formData.interests) ? formData.interests : []
    if (interests.length === 0) errors.interests = "Selecione ao menos um interesse"

    if (!formData.investment) errors.investment = "Informe o valor de investimento"
    if (!formData.storeId) errors.storeId = "Selecione uma loja"
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Por favor, preencha todos os campos obrigatórios corretamente.")
      return
    }

    const lojaIdNumber = Number(formData.storeId)
    if (isNaN(lojaIdNumber)) {
      toast.error("Loja inválida. Tente novamente.")
      return
    }

    const interests = Array.isArray(formData.interests) ? formData.interests : []
    const interestesFormatados = interests.map(int => {
      const option = interestOptions.find(o => o.value === int)
      return option?.label || int
    }).join(", ")

    const payload = {
      nome: formData.name,
      email: formData.email,
      telefone: formData.phone,
      estado: formData.state,
      cidade: formData.city,
      interesse: interestesFormatados,
      expectativaInvestimento: formData.investment,
      mensagem: formData.message || "",
      lojaId: lojaIdNumber,
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/pipefy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Erro ao enviar")

      toast.success("Orçamento solicitado com sucesso!")
      onSubmitSuccess()
    } catch (err) {
      console.error("Erro ao enviar formulário:", err)
      toast.error("Erro ao enviar o formulário. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStoreChange = (value: string) => {
    handleInputChange("storeId", value)
  }

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToDetails}
            className="flex items-center gap-2 text-sm text-charcoal/70 hover:text-charcoal transition-colors cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar aos detalhes
          </button>
        </div>
        <DialogTitle className="text-3xl font-light text-charcoal mt-2">
          Solicitar Orçamento
        </DialogTitle>
        <DialogDescription className="text-base text-charcoal/70">
          Preencha o formulário abaixo para solicitar um orçamento baseado em "{item.title}"
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="space-y-1">
          <Label htmlFor="name">Nome completo *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={formErrors.name ? "border-red-500" : ""}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={formErrors.email ? "border-red-500" : ""}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="phone">Telefone/WhatsApp *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className={formErrors.phone ? "border-red-500" : ""}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="state">Estado *</Label>
          <Select
            value={formData.state}
            onValueChange={(value) => handleInputChange("state", value)}
          >
            <SelectTrigger className={`w-full ${formErrors.state ? "border-red-500" : ""}`}>
              <SelectValue placeholder="Selecione seu estado" />
            </SelectTrigger>
            <SelectContent>
              {estados.map((estado) => (
                <SelectItem key={estado.id} value={estado.id.toString()}>
                  {estado.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="city">Cidade *</Label>
          <Select
            value={formData.city}
            onValueChange={(value) => handleInputChange("city", value)}
            disabled={!formData.state}
          >
            <SelectTrigger className={`w-full ${formErrors.state ? "border-red-500" : ""}`}>
              <SelectValue placeholder="Selecione sua cidade" />
            </SelectTrigger>
            <SelectContent>
              {cidades.map((cidade) => (
                <SelectItem key={cidade.id} value={cidade.nome}>
                  {cidade.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="investment">Investimento aproximado *</Label>
          <Select
            value={formData.investment}
            onValueChange={(value) => handleInputChange("investment", value)}
          >
            <SelectTrigger className={`w-full ${formErrors.state ? "border-red-500" : ""}`}>
              <SelectValue placeholder="Selecione o valor" />
            </SelectTrigger>
            <SelectContent>
              {investmentOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="interests" className="text-sm">Interesse *</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={`w-full justify-between font-normal ${formErrors.interests ? "border-red-500" : ""}`}
              >
                <span className={(Array.isArray(formData.interests) && formData.interests.length === 0) ? "text-muted-foreground" : ""}>
                  {getInterestLabel()}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <div className="p-2 space-y-1">
                {interestOptions.map((option) => {
                  const checked = formData.interests.includes(option.value)
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        handleInterestToggle(option.value)
                      }}
                      className="w-full flex items-center space-x-2 rounded-sm px-2 py-2 hover:bg-accent cursor-pointer text-left"
                    >
                      <Checkbox checked={checked} />
                      <span className="flex-1 text-sm">{option.label}</span>
                    </button>
                  )
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-1 md:col-span-2">
          <Label htmlFor="store" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Unidade de preferência *
          </Label>

          <div onClick={handleStoreSelectOpen}>
            <StoreSelectorForm
              stores={sortedStoresByDistance}
              value={formData.storeId}
              onValueChange={handleStoreChange}
              placeholder="Selecione a unidade mais próxima"
              className={formErrors.storeId ? "border-red-500" : ""}
            />
          </div>
        </div>

        <div className="space-y-1 md:col-span-2">
          <Label htmlFor="message">Mensagem</Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            placeholder="Conte-nos sobre seu projeto..."
            rows={3}
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-2">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            size="lg"
            className="w-full cursor-pointer bg-[#f21e1d] hover:bg-[#f21e1d]/90"
          >
            {isSubmitting ? "Enviando..." : "Solicitar orçamento"}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Ao enviar este formulário, você concorda com nossa política de privacidade.
          </p>
        </div>
      </div>
    </>
  )
}
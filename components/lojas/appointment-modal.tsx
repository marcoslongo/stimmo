"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronsUpDown } from "lucide-react"
import { toast } from "sonner"
import { interestOptions, investmentOptions } from "@/utils/constantes"

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  storeName: string
  storeCity: string
  storeStateId: string
  storeId: string | number
  storeRegion: string
}

interface Estado {
  id: number
  nome: string
}

interface Cidade {
  id: number
  nome: string
}

export function AppointmentModal({
  isOpen,
  onClose,
  storeName,
  storeCity,
  storeStateId,
  storeId,
  storeRegion,
}: AppointmentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    city: "",
    interests: [] as string[],
    investment: "",
    message: "",
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [estados, setEstados] = useState<Estado[]>([])
  const [cidades, setCidades] = useState<Cidade[]>([])
  const [loadingEstados, setLoadingEstados] = useState(true)
  const [loadingCidades, setLoadingCidades] = useState(false)
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.state}/municipios`)
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

  const handleInvestmentChange = (value: string) => {
    setFormData({ ...formData, investment: value })
    if (formErrors.investment) {
      const { investment, ...rest } = formErrors
      setFormErrors(rest)
    }
  }

  const handleInterestToggle = (value: string) => {
    setFormData((prev) => {
      const interests = prev.interests.includes(value)
        ? prev.interests.filter((i) => i !== value)
        : [...prev.interests, value]
      return { ...prev, interests }
    })
    if (formErrors.interests) {
      const { interests, ...rest } = formErrors
      setFormErrors(rest)
    }
  }

  const getInterestLabel = () =>
    formData.interests.length > 0
      ? formData.interests.map((i) => interestOptions.find((o) => o.value === i)?.label).join(", ")
      : "Selecione um ou mais interesses"

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.name.trim()) errors.name = "Nome completo é obrigatório"
    if (!formData.email.trim()) errors.email = "E-mail é obrigatório"
    if (!formData.phone.trim()) errors.phone = "Telefone/WhatsApp é obrigatório"
    if (!formData.state) errors.state = "Estado é obrigatório"
    if (!formData.city.trim()) errors.city = "Cidade é obrigatória"
    if (formData.interests.length === 0) errors.interests = "Selecione pelo menos um interesse"
    if (!formData.investment) errors.investment = "Informe o valor aproximado de investimento"
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    const lojaIdNumber = Number(storeId)
    if (!storeId || isNaN(lojaIdNumber)) {
      toast.error("Loja não selecionada ou inválida. Tente novamente.")
      return
    }

    if (!validateForm()) {
      toast.error("Por favor, preencha todos os campos obrigatórios corretamente.")
      return
    }

    const payload = {
      nome: formData.name,
      email: formData.email,
      telefone: formData.phone,
      estado: formData.state,
      cidade: formData.city,
      interesse: formData.interests.join(", "),
      expectativaInvestimento: formData.investment,
      mensagem: formData.message || "",
      lojaId: lojaIdNumber,
      lojaRegiao: storeRegion || "",
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/pipefy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Erro ao enviar formulário")

      toast.success(`Agendamento solicitado para ${storeName}! Entraremos em contato em breve.`)

      setFormData({
        name: "",
        email: "",
        phone: "",
        state: storeStateId,
        city: storeCity,
        interests: [],
        investment: "",
        message: "",
      })
      setFormErrors({})
      onClose()
    } catch (err) {
      console.error("❌ Erro na requisição:", err)
      toast.error("Ocorreu um erro ao enviar o formulário. Tente novamente mais tarde.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-light">Agendar Contato</DialogTitle>
          <p className="text-muted-foreground">{storeName} - {storeCity}</p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-1">
            <Label htmlFor="modal-name">Nome completo *</Label>
            <Input
              id="modal-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Seu nome"
              className={formErrors.name ? "border-red-500" : ""}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="modal-email">E-mail *</Label>
            <Input
              id="modal-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="seu@email.com"
              className={formErrors.email ? "border-red-500" : ""}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="modal-phone">Telefone/WhatsApp *</Label>
            <Input
              id="modal-phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(00) 00000-0000"
              className={formErrors.phone ? "border-red-500" : ""}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="modal-state">Estado *</Label>
            <Select
              value={formData.state}
              onValueChange={(value) => setFormData({ ...formData, state: value, city: "" })}
              disabled={loadingEstados}
            >
              <SelectTrigger className={`w-full ${formErrors.state ? "border-red-500" : ""}`}>
                <SelectValue placeholder={loadingEstados ? "Carregando estados..." : "Selecione seu estado"} />
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
            <Label htmlFor="modal-city">Cidade *</Label>
            <Select
              value={formData.city}
              onValueChange={(value) => setFormData({ ...formData, city: value })}
              disabled={!formData.state || loadingCidades}
            >
              <SelectTrigger className={`w-full ${formErrors.city ? "border-red-500" : ""}`}>
                <SelectValue
                  placeholder={
                    !formData.state
                      ? "Selecione um estado primeiro"
                      : loadingCidades
                        ? "Carregando cidades..."
                        : "Selecione sua cidade"
                  }
                />
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

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="investment" className="text-sm">Valor aproximado de investimento *</Label>
            <Select value={formData.investment} onValueChange={handleInvestmentChange}>
              <SelectTrigger className={`w-full ${formErrors.investment ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Selecione o valor desejado" />
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
                  <span className={formData.interests.length === 0 ? "text-muted-foreground" : ""}>
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

          <div className="md:col-span-2 space-y-1">
            <Label htmlFor="modal-message">Mensagem</Label>
            <Textarea
              id="modal-message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Conte-nos sobre seu projeto..."
              rows={4}
            />
          </div>

          <div className="md:col-span-2 flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Confirmar agendamento"}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground md:col-span-2">
            Ao enviar este formulário, você concorda com nossa política de privacidade.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
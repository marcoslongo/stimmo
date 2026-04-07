"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronsUpDown } from "lucide-react"
import { fetchEstados, fetchCidades, Estado, Cidade } from "@/lib/location-service"
import { interestOptions, investmentOptions } from "@/utils/constantes"
import { maskPhone } from "@/utils/maskPhone"

const OPENCAGE_API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY!
const MAX_DISTANCE_KM = 300

const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

async function geocodeLocation(
  city: string,
  stateName: string,
  neighborhood?: string
): Promise<{ lat: number; lng: number } | null> {
  const queryParts = [neighborhood?.trim() || null, city, stateName, "Brasil"].filter(Boolean)
  const query = encodeURIComponent(queryParts.join(", "))
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${OPENCAGE_API_KEY}&language=pt&countrycode=br&limit=1&no_annotations=1`
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    const result = data?.results?.[0]
    if (!result) return null
    return { lat: result.geometry.lat, lng: result.geometry.lng }
  } catch {
    return null
  }
}

function findNearestStore(stores: any[], lat: number, lng: number) {
  const withDistance = stores
    .filter((s) => s.lat != null && s.lng != null)
    .map((s) => ({ ...s, distance: calculateDistance(lat, lng, s.lat, s.lng) }))
    .sort((a, b) => a.distance - b.distance)

  const nearest = withDistance.find((s) => s.distance <= MAX_DISTANCE_KM)
  if (nearest) return nearest

  const matriz = stores.find((s) => s.eMatriz === true)
  if (matriz) return matriz

  return withDistance[0] ?? null
}

interface FormFieldsProps {
  formData: {
    name: string
    email: string
    phone: string
    state: string
    city: string
    neighborhood: string
    interests: string[]
    message: string
    storeId: string
    investment: string
  }
  setFormData: React.Dispatch<React.SetStateAction<any>>
  formErrors: Record<string, string>
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
  sortedStores: any[]
  favoriteStore: any
}

export function FormFields({
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  sortedStores,
  favoriteStore,
}: FormFieldsProps) {
  const [open, setOpen] = useState(false)
  const [estados, setEstados] = useState<Estado[]>([])
  const [cidades, setCidades] = useState<Cidade[]>([])
  const [loadingEstados, setLoadingEstados] = useState(true)
  const [loadingCidades, setLoadingCidades] = useState(false)

  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "found" | "error">("idle")
  const [userOverride, setUserOverride] = useState(false)
  const lastGeoKey = useRef("")
  const geoDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { loadEstados() }, [])

  useEffect(() => {
    if (formData.state) {
      loadCidades(parseInt(formData.state))
    } else {
      setCidades([])
    }
  }, [formData.state])

  useEffect(() => {
    if (favoriteStore && !formData.storeId) {
      setFormData((prev: any) => ({ ...prev, storeId: favoriteStore.id }))
    }
  }, [favoriteStore])

  useEffect(() => {
    const { city, state, neighborhood } = formData
    if (!city.trim() || !state || sortedStores.length === 0 || userOverride) return

    if (geoDebounce.current) clearTimeout(geoDebounce.current)

    geoDebounce.current = setTimeout(() => {
      const geoKey = `${city}|${state}|${neighborhood}`
      if (geoKey === lastGeoKey.current) return
      lastGeoKey.current = geoKey

      setGeoStatus("loading")

      const stateName = estados.find((e) => e.id.toString() === state)?.nome ?? state

      geocodeLocation(city, stateName, neighborhood).then((coords) => {
        if (!coords) { setGeoStatus("error"); return }

        const nearest = findNearestStore(sortedStores, coords.lat, coords.lng)
        if (!nearest) { setGeoStatus("error"); return }

        setFormData((prev: any) => ({ ...prev, storeId: nearest.id.toString() }))
        setGeoStatus("found")
        setFormErrors((prev) => { const e = { ...prev }; delete e.storeId; return e })
      })
    }, 800)

    return () => { if (geoDebounce.current) clearTimeout(geoDebounce.current) }
  }, [formData.city, formData.state, formData.neighborhood, sortedStores, userOverride, estados])

  const loadEstados = async () => {
    try {
      setLoadingEstados(true)
      const data = await fetchEstados()
      setEstados(data)
    } catch (error) {
      console.error("Erro ao carregar estados:", error)
    } finally {
      setLoadingEstados(false)
    }
  }

  const loadCidades = async (estadoId: number) => {
    try {
      setLoadingCidades(true)
      const data = await fetchCidades(estadoId)
      setCidades(data)
    } catch (error) {
      console.error("Erro ao carregar cidades:", error)
    } finally {
      setLoadingCidades(false)
    }
  }

  const handleStateChange = (value: string) => {
    setFormData((prev: any) => ({ ...prev, state: value, city: "", neighborhood: "", storeId: "" }))
    setUserOverride(false)
    setGeoStatus("idle")
    lastGeoKey.current = ""
    if (formErrors.state) setFormErrors((prev) => { const e = { ...prev }; delete e.state; return e })
  }

  const handleCityChange = (value: string) => {
    setFormData((prev: any) => ({ ...prev, city: value, neighborhood: "", storeId: "" }))
    setUserOverride(false)
    setGeoStatus("idle")
    lastGeoKey.current = ""
    if (formErrors.city) setFormErrors((prev) => { const e = { ...prev }; delete e.city; return e })
  }

  const handleNeighborhoodChange = (value: string) => {
    setFormData((prev: any) => ({ ...prev, neighborhood: value }))
    setUserOverride(false)
    lastGeoKey.current = ""
    if (formErrors.neighborhood) setFormErrors((prev) => { const e = { ...prev }; delete e.neighborhood; return e })
  }

  const handleInterestToggle = (value: string) => {
    setFormData((prev: any) => {
      const interests = prev.interests.includes(value)
        ? prev.interests.filter((i: string) => i !== value)
        : [...prev.interests, value]
      return { ...prev, interests }
    })
    if (formErrors.interests) setFormErrors((prev) => { const e = { ...prev }; delete e.interests; return e })
  }

  const handleInvestmentChange = (value: string) => {
    setFormData((prev: any) => ({ ...prev, investment: value }))
    if (formErrors.investment) setFormErrors((prev) => { const e = { ...prev }; delete e.investment; return e })
  }

  const getInterestLabel = () => {
    if (formData.interests.length === 0) return "Selecione os ambientes"
    if (formData.interests.length === 1)
      return interestOptions.find((opt) => opt.value === formData.interests[0])?.label
    return `${formData.interests.length} ambientes selecionados`
  }

  return (
    <>
      <div className="space-y-1">
        <Label htmlFor="name" className="text-sm">Nome completo *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((p: any) => ({ ...p, name: e.target.value }))}
          placeholder="Seu nome"
          className={formErrors.name ? "border-red-500" : ""}
        />
        {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="email" className="text-sm">E-mail *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData((p: any) => ({ ...p, email: e.target.value }))}
          placeholder="seu@email.com"
          className={formErrors.email ? "border-red-500" : ""}
        />
        {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="phone" className="text-sm">Telefone/WhatsApp *</Label>
        <Input
          id="phone"
          value={formData.phone}
          inputMode="numeric"
          maxLength={15}
          onChange={(e) => setFormData((p: any) => ({ ...p, phone: maskPhone(e.target.value) }))}
          placeholder="(00) 00000-0000"
          className={formErrors.phone ? "border-red-500" : ""}
        />
        {formErrors.phone && <p className="text-sm text-red-500">{formErrors.phone}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="state" className="text-sm">Estado *</Label>
        <Select value={formData.state} onValueChange={handleStateChange} disabled={loadingEstados}>
          <SelectTrigger className={`w-full ${formErrors.state ? "border-red-500" : ""}`}>
            <SelectValue placeholder={loadingEstados ? "Carregando..." : "Selecione o estado"} />
          </SelectTrigger>
          <SelectContent>
            {estados.map((estado) => (
              <SelectItem key={estado.id} value={estado.id.toString()}>
                {estado.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formErrors.state && <p className="text-sm text-red-500">{formErrors.state}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="city" className="text-sm">Cidade *</Label>
        <Select
          value={formData.city}
          onValueChange={handleCityChange}
          disabled={!formData.state || loadingCidades}
        >
          <SelectTrigger className={`w-full ${formErrors.city ? "border-red-500" : ""}`}>
            <SelectValue
              placeholder={
                !formData.state ? "Selecione o estado primeiro"
                  : loadingCidades ? "Carregando..."
                    : "Selecione a cidade"
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
        {formErrors.city && <p className="text-sm text-red-500">{formErrors.city}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="neighborhood" className="text-sm">Bairro *</Label>
        <Input
          id="neighborhood"
          value={formData.neighborhood}
          placeholder="Digite seu bairro"
          disabled={!formData.city}
          onChange={(e) => handleNeighborhoodChange(e.target.value)}
          className={formErrors.neighborhood ? "border-red-500" : ""}
        />
        {formErrors.neighborhood && <p className="text-sm text-red-500">{formErrors.neighborhood}</p>}
      </div>

      <div className="space-y-1">
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
                    onClick={(e) => { e.preventDefault(); handleInterestToggle(option.value) }}
                    className="w-full flex items-center space-x-2 rounded-sm px-2 py-2 hover:bg-accent cursor-pointer text-left"
                  >
                    <Checkbox checked={checked} />
                    <span className="flex-1 text-sm">{option.label}</span>
                  </button>
                )
              })}
            </div>
            <div className="border-t p-2">
              <Button type="button" size="sm" className="w-full cursor-pointer" onClick={() => setOpen(false)}>
                Confirmar
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        {formErrors.interests && <p className="text-sm text-red-500">{formErrors.interests}</p>}
      </div>

      <div className="space-y-1 md:col-span-2">
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
        {formErrors.investment && <p className="text-sm text-red-500">{formErrors.investment}</p>}
      </div>

      <div className="space-y-1 md:col-span-2">
        <Label htmlFor="message" className="text-sm">Mensagem</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData((p: any) => ({ ...p, message: e.target.value }))}
          placeholder="Conte-nos sobre seu projeto..."
          rows={3}
        />
      </div>
    </>
  )
}
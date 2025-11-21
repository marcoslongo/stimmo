"use client"

import { useState, useEffect, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { MapPin, ChevronsUpDown } from "lucide-react"
import { StoreSelectorForm } from "../lojas/store-selector-form"
import { fetchEstados, fetchCidades, Estado, Cidade } from "@/lib/location-service"
import { interestOptions, investmentOptions } from "@/utils/constantes"



const MAX_DISTANCE_KM = 100000

const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

interface FormFieldsProps {
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
}

export function FormFields({
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  sortedStores,
  handleOpenStoresSelect,
  favoriteStore,
}: FormFieldsProps) {
  const [open, setOpen] = useState(false)
  const [estados, setEstados] = useState<Estado[]>([])
  const [cidades, setCidades] = useState<Cidade[]>([])
  const [loadingEstados, setLoadingEstados] = useState(true)
  const [loadingCidades, setLoadingCidades] = useState(false)

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [locationRequested, setLocationRequested] = useState(false)

  useEffect(() => {
    loadEstados()
  }, [])

  useEffect(() => {
    if (formData.state) {
      loadCidades(parseInt(formData.state))
    } else {
      setCidades([])
    }
  }, [formData.state])

  useEffect(() => {
    if (favoriteStore && !formData.storeId) {
      setFormData((prev: any) => ({
        ...prev,
        storeId: favoriteStore.id
      }))
    }
  }, [favoriteStore])

  const handleStoreSelectOpen = () => {
    handleOpenStoresSelect()

    if (!locationRequested && !userLocation) {
      setLocationRequested(true)
      getUserLocation()
    }
  }

  const getUserLocation = () => {
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
          console.log("Localização não disponível:", error.message)
          setIsLoadingLocation(false)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
      )
    } else {
      setIsLoadingLocation(false)
    }
  }

  const sortedStoresByDistance = useMemo(() => {
    if (!userLocation) return sortedStores

    const storesWithDistance = sortedStores.map((store) => ({
      ...store,
      distance: calculateDistance(userLocation.lat, userLocation.lng, store.lat, store.lng),
    }))

    const filtered = storesWithDistance.filter((store) => store.distance <= MAX_DISTANCE_KM)

    return filtered.sort((a, b) => a.distance - b.distance)
  }, [userLocation, sortedStores])

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
    setFormData({ ...formData, state: value, city: "" })
    if (formErrors.state) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.state
        return newErrors
      })
    }
  }

  const handleCityChange = (value: string) => {
    setFormData({ ...formData, city: value })
    if (formErrors.city) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.city
        return newErrors
      })
    }
  }

  const handleInterestToggle = (value: string) => {
    setFormData((prev: any) => {
      const interests = prev.interests.includes(value)
        ? prev.interests.filter((i: string) => i !== value)
        : [...prev.interests, value]
      return { ...prev, interests }
    })
    if (formErrors.interests) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.interests
        return newErrors
      })
    }
  }

  const handleInvestmentChange = (value: string) => {
    setFormData({ ...formData, investment: value })
    if (formErrors.investment) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.investment
        return newErrors
      })
    }
  }

  const getInterestLabel = () => {
    if (formData.interests.length === 0) return "Selecione os ambientes"
    if (formData.interests.length === 1) {
      return interestOptions.find((opt) => opt.value === formData.interests[0])?.label
    }
    return `${formData.interests.length} ambientes selecionados`
  }

  return (
    <>
      <div className="space-y-1">
        <Label htmlFor="name" className="text-sm">Nome completo *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Seu nome"
          className={formErrors.name ? "border-red-500" : ""}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="email" className="text-sm">E-mail *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="seu@email.com"
          className={formErrors.email ? "border-red-500" : ""}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="phone" className="text-sm">Telefone/WhatsApp *</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="(00) 00000-0000"
          className={formErrors.phone ? "border-red-500" : ""}
        />
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
      </div>

      <div className="space-y-1">
        <Label htmlFor="city" className="text-sm">Cidade *</Label>
        <Select
          value={formData.city}
          onValueChange={handleCityChange}
          disabled={!formData.state || loadingCidades}
        >
          <SelectTrigger className={`w-full ${formErrors.city ? "border-red-500" : ""}`}>
            <SelectValue placeholder={!formData.state
              ? "Selecione o estado primeiro"
              : loadingCidades
                ? "Carregando..."
                : "Selecione a cidade"}
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

      <div className="space-y-1 md:col-span-2">
        <Label htmlFor="store" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Unidade de preferência *
        </Label>

        <div onClick={handleStoreSelectOpen}>
          <StoreSelectorForm
            stores={sortedStoresByDistance.map((s) => ({
              ...s,
              id: s.id.toString(),
            }))}
            value={formData.storeId}
            onValueChange={(value) => {
              setFormData({ ...formData, storeId: value })

              if (formErrors.storeId) {
                setFormErrors((prev) => {
                  const newErrors = { ...prev }
                  delete newErrors.storeId
                  return newErrors
                })
              }
            }}
            preferredStoreId={favoriteStore?.id}
            placeholder="Selecione a unidade mais próxima"
            className={formErrors.storeId ? "border-red-500" : ""}
          />
        </div>
      </div>

      <div className="space-y-1 md:col-span-2">
        <Label htmlFor="message" className="text-sm">Mensagem</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Conte-nos sobre seu projeto..."
          rows={3}
        />
      </div>
    </>
  )
}
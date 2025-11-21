"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Store {
  id: string
  name: string
  city: string
  state: string
  address: string
  phone: string
  whatsapp: string
  hours: string
  lat: number
  lng: number
}

interface FavoritesContextType {
  favoriteStore: Store | null
  setFavoriteStore: (store: Store | null) => void
  isFavorite: (storeId: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteStore, setFavoriteStoreState] = useState<Store | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // ⚠️ NOTA: localStorage não funciona em artifacts do Claude
  // Esta versão está pronta para uso no seu ambiente real
  useEffect(() => {
    // Tente carregar do localStorage apenas se disponível
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem("simonetto-favorite-store")
        if (stored) {
          setFavoriteStoreState(JSON.parse(stored))
        }
      } catch (error) {
        console.error("Error loading favorite store:", error)
      }
    }
    setIsLoaded(true)
  }, [])

  const setFavoriteStore = (store: Store | null) => {
    setFavoriteStoreState(store)
    
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        if (store) {
          localStorage.setItem("simonetto-favorite-store", JSON.stringify(store))
        } else {
          localStorage.removeItem("simonetto-favorite-store")
        }
      } catch (error) {
        console.error("Error saving favorite store:", error)
      }
    }
  }

  const isFavorite = (storeId: string) => {
    return favoriteStore?.id === storeId
  }

  if (!isLoaded) {
    return null
  }

  return (
    <FavoritesContext.Provider value={{ favoriteStore, setFavoriteStore, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
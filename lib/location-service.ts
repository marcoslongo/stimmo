
export interface Estado {
  id: number
  sigla: string
  nome: string
}

export interface Cidade {
  id: number
  nome: string
}

const CACHE_DURATION = 24 * 60 * 60 * 1000 
const ESTADOS_CACHE_KEY = 'ibge_estados_cache'
const CIDADES_CACHE_KEY_PREFIX = 'ibge_cidades_'

interface CacheData<T> {
  data: T
  timestamp: number
}

function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION
}

function getFromCache<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  
  try {
    const cached = localStorage.getItem(key)
    if (!cached) return null
    
    const { data, timestamp }: CacheData<T> = JSON.parse(cached)
    
    if (isCacheValid(timestamp)) {
      return data
    }
    
    localStorage.removeItem(key)
    return null
  } catch (error) {
    console.error('Erro ao ler cache:', error)
    return null
  }
}

function saveToCache<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return
  
  try {
    const cacheData: CacheData<T> = {
      data,
      timestamp: Date.now()
    }
    localStorage.setItem(key, JSON.stringify(cacheData))
  } catch (error) {
    console.error('Erro ao salvar cache:', error)
  }
}

export async function fetchEstados(): Promise<Estado[]> {
  const cached = getFromCache<Estado[]>(ESTADOS_CACHE_KEY)
  if (cached) {
    return cached
  }
  
  try {
    const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
    
    if (!response.ok) {
      throw new Error('Erro ao buscar estados')
    }
    
    const data: Estado[] = await response.json()
    
    saveToCache(ESTADOS_CACHE_KEY, data)
    
    return data
  } catch (error) {
    console.error('Erro ao buscar estados:', error)
    throw error
  }
}

export async function fetchCidades(estadoId: number): Promise<Cidade[]> {
  const cacheKey = `${CIDADES_CACHE_KEY_PREFIX}${estadoId}`
  
  const cached = getFromCache<Cidade[]>(cacheKey)
  if (cached) {
    return cached
  }
  
  try {
    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios?orderBy=nome`
    )
    
    if (!response.ok) {
      throw new Error('Erro ao buscar cidades')
    }
    
    const data: Cidade[] = await response.json()
    
    saveToCache(cacheKey, data)
    
    return data
  } catch (error) {
    console.error('Erro ao buscar cidades:', error)
    throw error
  }
}

export function clearLocationCache(): void {
  if (typeof window === 'undefined') return
  
  try {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key === ESTADOS_CACHE_KEY || key.startsWith(CIDADES_CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error('Erro ao limpar cache:', error)
  }
}
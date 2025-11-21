export type ModalView = 'details' | 'quote'

export interface PortfolioItem {
  id: number
  slug?: string
  title: string
  description: string
  image: string
  images: string[]
  tags: string[]
  category?: string
}

export interface PortfolioCategory {
  id: string
  label: string
}

export interface FormData {
  name: string
  email: string
  phone: string
  city: string
  interests: string[]
  storeId: string
  message: string
  state: string
  investment: string
}

export interface PortfolioDetailsResponse {
  __typename?: string
  id: string
  title?: string | null
  slug?: string | null
  tags?: {
    __typename?: string
    edges: Array<{
      __typename?: string
      node: {
        __typename?: string
        id: string
        name?: string | null
      }
    }>
  } | null
  categoriasPortfolio?: {
    __typename?: string
    edges: Array<{
      __typename?: string
      node: {
        __typename?: string
        id: string
        name?: string | null
      }
    }>
  } | null
  acfPortfolio?: {
    __typename?: string
    image?: {
      __typename?: string
      node: {
        __typename?: string
        mediaItemUrl?: string | null
      }
    } | null
    description?: string | null
    gallery?: {
      __typename?: string
      nodes: Array<{
        __typename?: string
        mediaItemUrl?: string | null
      }>
    } | null
  } | null
}
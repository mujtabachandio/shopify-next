interface ShopifyImage {
  url: string
  altText?: string
  width?: number
  height?: number
}

interface MoneyV2 {
  amount: string
  currencyCode: string
}

interface ProductVariant {
  id: string
  title: string
  price: MoneyV2
  availableForSale: boolean
  selectedOptions: Array<{
    name: string
    value: string
  }>
}

interface ShopifyProduct {
  tags: never[]
  collections: never[]
  id: string
  title: string
  description: string
  featuredImage?: ShopifyImage
  variants: {
    edges: Array<{
      node: {
        id: string
        price: {
          amount: string
          currencyCode: string
        }
        availableForSale: boolean
        selectedOptions: Array<{
          name: string
          value: string
        }>
      }
    }>
  }
  price: {
    amount: number
    currencyCode: string
  }
  media: Array<{
    embedUrl: string | undefined
    type: string
    imageUrl?: string
    videoUrl?: string
    originUrl?: string
    host?: string
  }>
  brandName?: string
}

interface CartItem extends ShopifyProduct {
  quantity: number
  selectedVariant: ProductVariant
}

type ShopifyResponse<T> = {
  data?: T
  errors?: Array<{
    message: string
  }>
}
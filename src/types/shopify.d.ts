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
}

interface ShopifyProduct {
  id: string
  title: string
  description: string
  featuredImage?: ShopifyImage
  variants: {
    edges: Array<{
      node: ProductVariant
    }>
  }
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
// import type { ShopifyProduct } from '@/types/shopify'

import Image from "next/image"
import { Media } from "@/lib/shopify-api"

interface ProductCardProps {
  product: {
    id: string
    title: string
    description: string
    media: Media[]
    price: {
      amount: number
      currencyCode: string
    }
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  // Get the first media item for the card preview
  const firstMedia = product.media[0]
  
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      {firstMedia && (
        <div className="relative w-full h-48">
          {/* Image Media */}
          {firstMedia.type === 'IMAGE' && firstMedia.imageUrl && (
            <Image
              src={firstMedia.imageUrl}
              alt={firstMedia.imageAltText || product.title}
              fill
              className="object-cover"
            />
          )}
          
          {/* External Video */}
          {firstMedia.type === 'EXTERNAL_VIDEO' && firstMedia.embedUrl && (
            <iframe
              src={firstMedia.embedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
          
          {/* Uploaded Video */}
          {firstMedia.type === 'VIDEO' && firstMedia.videoUrl && (
            <video
              src={firstMedia.videoUrl}
              className="w-full h-full object-cover"
              controls
              muted
              playsInline
            />
          )}
        </div>
      )}
      
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.title}</h3>
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <span className="font-bold">
            {product.price.currencyCode} {product.price.amount}
          </span>
          <button className="bg-black text-white px-4 py-2 rounded">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
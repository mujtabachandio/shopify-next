// import type { ShopifyProduct } from '@/types/shopify'

import Image from "next/image"

interface ProductCardProps {
  product: ShopifyProduct
}

export default function ProductCard({ product }: ProductCardProps) {
  const firstVariant = product.variants.edges[0]?.node
  
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      {product.featuredImage && (
        <Image
          src={product.featuredImage.url} 
          alt={product.title}
          width={200}
          height={200}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.title}</h3>
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-4 flex justify-between items-center">
          {firstVariant && (
            <span className="font-bold">
              ${firstVariant.price.amount}
            </span>
          )}
          <button className="bg-black text-white px-4 py-2 rounded">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
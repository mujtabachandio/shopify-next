"use client";

import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { getAllProducts } from "@/lib/shopify-api";
import { useSearchParams } from "next/navigation";

interface Media {
  type: string;
  imageUrl?: string;
  videoUrl?: string;
  originUrl?: string;
  host?: string;
  embedUrl?: string;
}

interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  price: {
    amount: number;
    currencyCode: string;
  };
  media: Media[];
  variants: {
    edges: Array<{
      node: {
        id: string;
        price: {
          amount: number;
          currencyCode: string;
        };
      };
    }>;
  };
  tags: string[];
  collections: {
    edges: Array<{
      node: {
        title: string;
      };
    }>;
  };
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: {
    amount: number;
    currencyCode: string;
  };
  image: string;
  videoUrl?: string;
  category?: string;
  tags: string[];
  collections: string[];
  media: Media[];
}

interface CartItem {
  id: string;
  title: string;
  price: {
    amount: number;
    currencyCode: string;
  };
  quantity: number;
  image: string;
  videoUrl?: string;
}

function CollectionsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts(100);
        console.log('API Response:', response);
        
        const processedProducts = (response.products as unknown as ShopifyProduct[]).map((product) => {
          // Get the first media item
          const firstMedia = product.media[0];
          let imageUrl = '/placeholder.png';
          let videoUrl: string | undefined = undefined;

          if (firstMedia) {
            switch (firstMedia.type) {
              case 'IMAGE':
                imageUrl = firstMedia.imageUrl || '/placeholder.png';
                break;
              case 'VIDEO':
                imageUrl = firstMedia.imageUrl || '/placeholder.png';
                videoUrl = firstMedia.videoUrl;
                break;
              case 'EXTERNAL_VIDEO':
                if (firstMedia.host === 'YOUTUBE') {
                  videoUrl = firstMedia.embedUrl;
                  const videoId = firstMedia.originUrl?.split('/').pop()?.split('?')[0];
                  imageUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                }
                break;
            }
          }

          // Get categories from tags only
          const tags = product.tags || [];
          console.log('Product:', product.title);
          console.log('Original Tags:', tags);
          
          // Use the first tag as the primary category
          const primaryCategory = tags.length > 0 ? tags[0] : 'uncategorized';
          console.log('Primary Category:', primaryCategory);

          return {
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
            image: imageUrl,
            videoUrl,
            category: primaryCategory,
            tags,
            collections: product.collections?.edges.map((edge) => edge.node.title) || [],
            media: product.media
          } as Product;
        });

        console.log('Processed Products:', processedProducts);
        setProducts(processedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    console.log('Adding product to cart:', product);
    const cartItem: CartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.image,
      videoUrl: product.videoUrl
    };
    console.log('Cart item to be added:', cartItem);
    addItem(cartItem);
  };

  // Filter products by category if one is selected
  const filteredProducts = currentCategory
    ? products.filter(product => {
        // Map category values to their corresponding tags
        const categoryTagMap: Record<string, string[]> = {
          'luxury': ['luxury', 'luxury collection'],
          'summer': ['summer', 'summer collection'],
          'winter': ['winter', 'winter collection'],
          'mens': ['mens', "men's", "men's collection"],
          'kids': ['kids', 'kids collection', 'children'],
          'deals': ['deals', 'sale', 'discount'],
          'stitched': ['stitched', 'ready to wear'],
          'unstitched': ['unstitched', 'fabric']
        };

        const categoryTags = categoryTagMap[currentCategory.toLowerCase()] || [];
        console.log('Current Category:', currentCategory);
        console.log('Category Tags to match:', categoryTags);
        console.log('Product Tags:', product.tags);
        
        const matches = product.tags.some(tag => 
          categoryTags.some(categoryTag => 
            tag.toLowerCase() === categoryTag.toLowerCase()
          )
        );
        
        console.log('Product matches:', matches);
        return matches;
      })
    : products;

  console.log('Total products:', products.length);
  console.log('Filtered products:', filteredProducts.length);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {currentCategory ? `${currentCategory} Collection` : 'Our Collection'}
          </h1>
          {currentCategory && (
            <div className="flex gap-4">
              <button
                onClick={() => window.history.back()}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => window.location.href = '/collections'}
                className="bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors"
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-lg shadow-lg overflow-hidden border border-border"
            >
              {/* Media Layer */}
              <div className="relative aspect-square">
                {product.videoUrl ? (
                  <div className="absolute inset-0">
                    <iframe
                      src={product.videoUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ pointerEvents: 'none' }}
                    />
                  </div>
                ) : (
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              {/* Content Layer */}
              <div className="relative bg-card">
                <div className="p-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                    {product.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-base sm:text-lg font-bold text-foreground">
                      {product.price.currencyCode} {product.price.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {/* Button Container */}
                <div className="p-4 pt-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Add to cart clicked for:', product.title);
                      handleAddToCart(product);
                    }}
                    className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg hover:bg-primary/90 active:bg-primary/80 transition-colors text-center touch-manipulation select-none"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <CollectionsContent />
    </Suspense>
  );
} 
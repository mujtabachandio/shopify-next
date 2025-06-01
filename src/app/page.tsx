"use client"
import { useEffect, useState, useCallback, Suspense } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import VideoCard from "@/components/VideoCard";
import { getAllProducts } from "@/lib/shopify-api";
import { useInView } from "react-intersection-observer";
import BottomNav from "@/components/BottomNav";
import { useSearchParams } from "next/navigation";

interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  price: {
    amount: number;
    currencyCode: string;
  };
  handle: string;
  media: Array<{
    type: string;
    imageUrl?: string;
    videoUrl?: string;
    originUrl?: string;
    host?: string;
  }>;
  variants?: {
    edges: Array<{
      node: {
        id: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
}

interface Product extends ShopifyProduct {
  image: string;
  videoUrl: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'YOUTUBE';
  category: string;
  brandName?: string;
  thumbnail: string;
  hasVideo: boolean;
  variantId: string;
}

interface Collection {
  id: string;
  title: string;
  products: Product[];
}

interface ApiResponse {
  collections: Collection[];
}

interface ProcessedProduct extends ShopifyProduct {
  image: string;
  videoUrl: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'YOUTUBE';
  category: string;
  brandName?: string;
  thumbnail: string;
  hasVideo: boolean;
  variantId: string;
  tags: string[];
  variants: {
    edges: Array<{
      node: {
        id: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
}

function HomePageContent() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<ProcessedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

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

  // Filter products by category if one is selected
  const filteredProducts = currentCategory
    ? products.filter(product => {
        const categoryTags = categoryTagMap[currentCategory.toLowerCase()] || [];
        console.log('Current Category:', currentCategory);
        console.log('Category Tags to match:', categoryTags);
        console.log('Product:', product.title);
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

  const getVideoUrl = useCallback((url: string, host?: string, mediaType?: string): string => {
    if (!url) return '';
    
    // Handle direct video URLs
    if (mediaType === 'VIDEO' || url.endsWith('.mp4') || url.endsWith('.mov') || url.endsWith('.webm')) {
      return url;
    }
    
    // Handle YouTube URLs
    if (host === 'YOUTUBE' || url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('/').pop() 
        : new URL(url).searchParams.get('v');
      
      if (!videoId) return url;
      
      // Use the YouTube embed URL with autoplay and other parameters
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=0&loop=1&playlist=${videoId}&playsinline=1`;
    }
    
    return url;
  }, []);

  const getYouTubeThumbnail = useCallback((url: string): string => {
    if (!url) return '';
    
    if (url.includes('youtu.be')) {
      const videoId = url.split('/').pop();
      return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
    }
    if (url.includes('youtube.com')) {
      const videoId = new URL(url).searchParams.get('v');
      return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
    }
    return '';
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/collections', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch collections: ${response.statusText}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (!data.collections || data.collections.length === 0) {
        setError('No collections found');
        return;
      }
      
      setCollections(data.collections);
    } catch (error) {
      console.error('Error fetching collections:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch collections');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductsFromApi = useCallback(async (cursor: string | null = null) => {
    try {
      setLoading(true);
      const response = await getAllProducts(50, cursor || undefined);
      
      if (!response.products || response.products.length === 0) {
        setHasMore(false);
        return;
      }

      console.log('API Response Products:', response.products);

      const processedProducts: ProcessedProduct[] = response.products.map(product => {
        const videoMedia = product.media?.find((m) => m.type === 'VIDEO');
        const externalVideoMedia = product.media?.find((m) => m.type === 'EXTERNAL_VIDEO');
        const imageMedia = product.media?.find((m) => m.type === 'IMAGE');
        
        let videoUrl = '';
        let thumbnail = '/placeholder.jpg';
        let mediaType: 'IMAGE' | 'VIDEO' | 'YOUTUBE' = 'IMAGE';

        // Handle image media
        if (imageMedia?.imageUrl) {
          thumbnail = imageMedia.imageUrl;
        }

        // Handle external video (YouTube)
        if (externalVideoMedia?.originUrl) {
          const originUrl = externalVideoMedia.originUrl;
          const host = externalVideoMedia.host || '';
          videoUrl = getVideoUrl(originUrl, host, 'EXTERNAL_VIDEO');
          mediaType = 'YOUTUBE';
          
          if (host === 'YOUTUBE') {
            const youtubeThumbnail = getYouTubeThumbnail(originUrl);
            if (youtubeThumbnail) {
              thumbnail = youtubeThumbnail;
            }
          }
        } 
        // Handle direct video upload
        else if (videoMedia?.videoUrl) {
          videoUrl = videoMedia.videoUrl;
          mediaType = 'VIDEO';
          
          // Use video thumbnail if available
          if (videoMedia.imageUrl) {
            thumbnail = videoMedia.imageUrl;
          }
        }

        // Process variants
        const variants = product.variants?.edges.map(edge => ({
          id: edge.node.id,
          title: edge.node.title || 'Default',
          price: {
            amount: parseFloat(edge.node.price.amount),
            currencyCode: edge.node.price.currencyCode
          },
          selectedOptions: edge.node.selectedOptions
        })) || [];

        const processedProduct: ProcessedProduct = {
          ...product,
          videoUrl,
          thumbnail,
          hasVideo: !!videoUrl,
          image: thumbnail,
          mediaType,
          category: product.tags?.[0] || 'Uncategorized',
          tags: product.tags || [],
          variants: {
            edges: variants.map(variant => ({
              node: {
                id: variant.id,
                price: {
                  amount: variant.price.amount.toString(),
                  currencyCode: variant.price.currencyCode
                },
                availableForSale: true,
                selectedOptions: variant.selectedOptions
              }
            }))
          },
          variantId: variants[0]?.id || ''
        };

        console.log('Processed Product:', {
          title: processedProduct.title,
          tags: processedProduct.tags
        });

        return processedProduct;
      });

      if (!cursor) {
        setProducts(processedProducts);
      } else {
        setProducts(prev => [...prev, ...processedProducts]);
      }

      setHasMore(response.hasNextPage);
      setEndCursor(response.endCursor || null);
    } catch (error) {
      let errorMessage = 'Failed to load products. Please try again later.';
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid or expired Shopify API token')) {
          errorMessage = 'Shopify API token is invalid or expired. Please contact support.';
        } else if (error.message.includes('Shopify store not found')) {
          errorMessage = 'Shopify store not found. Please check the store configuration.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many requests. Please try again in a few moments.';
        } else if (error.message.includes('Network error')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        }
      }
      
      setError(errorMessage);
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }, [getVideoUrl, getYouTubeThumbnail]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (collections.length > 0) {
    }
  }, [collections]);

  useEffect(() => {
    fetchProductsFromApi();
  }, [fetchProductsFromApi]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchProductsFromApi(endCursor);
    }
  }, [inView, hasMore, loading, endCursor, fetchProductsFromApi]);


  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl text-center">
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="text-white/80 hover:text-white transition-colors underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <div className="snap-y snap-mandatory h-screen overflow-y-auto">
            {filteredProducts.length === 0 ? (
              <div className="h-screen flex items-center justify-center text-white">
                <p>No products available</p>
              </div>
            ) : (
              <>
                {filteredProducts.map((product) => (
                  <div key={product.id} className="h-screen">
                    <VideoCard
                      id={product.id}
                      title={product.title}
                      videoUrl={product.videoUrl}
                      image={product.image}
                      description={product.description}
                      price={product.price}
                      variants={product.variants || { edges: [] }}
                      category={product.category}
                    />
                  </div>
                ))}
                <div ref={ref} className="h-20 flex items-center justify-center">
                  {loading && (
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                  )}
                  {!hasMore && !loading && filteredProducts.length > 0 && (
                    <p className="text-white/60">No more products to load</p>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}










 







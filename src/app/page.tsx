"use client"
import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import VideoCard from "@/components/VideoCard";
import { getAllProducts } from "@/lib/shopify-api";
import { useInView } from "react-intersection-observer";
import BottomNav from "@/components/BottomNav";

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

interface ProcessedProduct extends Product {
  videoUrl: string;
  thumbnail: string;
  hasVideo: boolean;
}

export default function HomePage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  const getVideoUrl = useCallback((url: string, host?: string): string => {
    if (!url) return '';
    
    // If it's a direct video URL, return it
    if (url.endsWith('.mp4') || url.endsWith('.mov') || url.endsWith('.webm')) {
      return url;
    }
    
    // If it's a YouTube URL, convert to direct video URL
    if (host === 'YOUTUBE' || url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('/').pop() 
        : new URL(url).searchParams.get('v');
      
      if (!videoId) return url;
      
      // Use the YouTube embed URL with autoplay and other parameters
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=0&loop=1&playlist=${videoId}`;
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
      const response = await fetch('/api/collections');
      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }
      const data: ApiResponse = await response.json();
      setCollections(data.collections);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch collections');
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

      const processedProducts: ProcessedProduct[] = response.products.map((product: ShopifyProduct) => {
        const videoMedia = product.media?.find((m) => m.type === 'VIDEO');
        const externalVideoMedia = product.media?.find((m) => m.type === 'EXTERNAL_VIDEO');
        const imageMedia = product.media?.find((m) => m.type === 'IMAGE');
        
        let videoUrl = '';
        let thumbnail = '/placeholder.jpg';

        if (imageMedia?.imageUrl) {
          thumbnail = imageMedia.imageUrl;
        }

        if (externalVideoMedia?.originUrl) {
          const originUrl = externalVideoMedia.originUrl;
          const host = externalVideoMedia.host || '';
          videoUrl = getVideoUrl(originUrl, host);
          if (host === 'YOUTUBE') {
            const youtubeThumbnail = getYouTubeThumbnail(originUrl);
            if (youtubeThumbnail) {
              thumbnail = youtubeThumbnail;
            }
          }
        } else if (videoMedia?.videoUrl) {
          videoUrl = videoMedia.videoUrl;
        }

        // Get the first available variant or use a default
        const firstVariant = product.variants?.edges?.[0]?.node;
        const variantId = firstVariant?.id || '';

        const processedProduct: ProcessedProduct = {
          ...product,
          videoUrl,
          thumbnail,
          hasVideo: !!videoUrl,
          image: thumbnail,
          mediaType: videoUrl ? 'VIDEO' : 'IMAGE',
          category: 'Uncategorized',
          variantId
        };

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
      setError('Failed to load products. Please try again later.');
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
            {products.length === 0 ? (
              <div className="h-screen flex items-center justify-center text-white">
                <p>No products available</p>
              </div>
            ) : (
              <>
                {products.map((product) => (
                  <div key={product.id} className="h-screen">
                    <VideoCard
                      id={product.id}
                      variantId={product.variantId}
                      title={product.title}
                      videoUrl={product.videoUrl}
                      thumbnail={product.thumbnail}
                      description={product.description}
                      price={product.price}
                      brandName={product.brandName || ''}
                    />
                  </div>
                ))}
                <div ref={ref} className="h-20 flex items-center justify-center">
                  {loading && (
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                  )}
                  {!hasMore && !loading && products.length > 0 && (
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










 







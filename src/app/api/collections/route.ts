import { NextResponse } from 'next/server';
import { CollectionsResponse, getCollections } from '@/lib/shopify-api';

const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('youtu.be')) {
    const videoId = url.split('/').pop();
    return videoId ? `https://www.youtube.com/embed/${videoId}?mute=1` : '';
  }
  if (url.includes('youtube.com')) {
    const videoId = new URL(url).searchParams.get('v');
    return videoId ? `https://www.youtube.com/embed/${videoId}?mute=1` : '';
  }
  return url;
};

const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1 second

async function fetchCollectionsWithRetry(retryCount = 0): Promise<CollectionsResponse>	 {
  try {
    const response = await getCollections(5);
    
    if (!response || !response.collections) {
      throw new Error('No collections found');
    }
    
    return response;
  } catch (error) {
    if (retryCount >= MAX_RETRIES) {
      throw error;
    }

    // Calculate delay with exponential backoff and jitter
    const delay = BASE_DELAY * Math.pow(2, retryCount) * (0.5 + Math.random());
    console.log(`Retrying collections fetch (attempt ${retryCount + 1}/${MAX_RETRIES}) after ${Math.round(delay)}ms`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchCollectionsWithRetry(retryCount + 1);
  }
}

export async function GET() {
  try {
    const response = await fetchCollectionsWithRetry();
    
    // Process collections to ensure proper image URLs
    const processedCollections = response.collections.map((collection) => {
      return {
        id: collection.id,
        title: collection.title,
        handle: collection.handle,
        description: collection.description,
        products: collection.products.map((product) => {
          let mediaType = 'IMAGE';
          let videoUrl = '';
          let imageUrl = '/placeholder.png';

          // Check all media items to determine the type and get URLs
          if (product.media?.length > 0) {
            const firstMedia = product.media[0];

            switch (firstMedia.type) {
              case 'IMAGE':
                mediaType = 'IMAGE';
                imageUrl = firstMedia.imageUrl || '/placeholder.png';
                break;

              case 'VIDEO':
                mediaType = 'VIDEO';
                videoUrl = firstMedia.videoUrl || '';
                imageUrl = firstMedia.imageUrl || '/placeholder.png';
                break;

              case 'EXTERNAL_VIDEO':
                mediaType = 'YOUTUBE';
                if (firstMedia.host === 'YOUTUBE' && firstMedia.originUrl) {
                  videoUrl = getYouTubeEmbedUrl(firstMedia.originUrl);
                  const videoId = firstMedia.originUrl.split('/').pop()?.split('?')[0];
                  if (videoId) {
                    imageUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                  }
                }
                break;
            }
          }
          
          return {
            id: product.id,
            title: product.title,
            handle: product.handle,
            description: product.description,
            mediaType,
            image: imageUrl,
            videoUrl,
            category: collection.title,
            price: {
              amount: parseFloat(product.price?.amount?.toString() || '0'),
              currencyCode: product.price?.currencyCode || 'PKR'
            },
            variants: {
              edges: product.variants?.edges?.map(edge => ({
                node: {
                  id: edge.node.id,
                  price: {
                    amount: edge.node.price.amount.toString(),
                    currencyCode: edge.node.price.currencyCode
                  },
                  availableForSale: edge.node.availableForSale ?? true,
                  selectedOptions: edge.node.selectedOptions || []
                }
              })) || []
            }
          };
        }),
      };
    });

    return NextResponse.json({ collections: processedCollections });
  } catch (error) {
    console.error('Error in collections API:', error);
    
    // Return a more specific error message based on the error type
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch collections';
    const status = errorMessage === 'No collections found' ? 404 : 500;
    
    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
} 
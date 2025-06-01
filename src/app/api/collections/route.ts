import { NextResponse } from 'next/server';
import { getCollections } from '@/lib/shopify-api';

const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('youtu.be')) {
    const videoId = url.split('/').pop();
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  }
  if (url.includes('youtube.com')) {
    const videoId = new URL(url).searchParams.get('v');
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  }
  return url;
};

export async function GET() {
  try {
    const response = await getCollections(5);
    
    if (!response || !response.collections) {
      return NextResponse.json(
        { error: 'No collections found' },
        { status: 404 }
      );
    }
    
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
            variants: product.variants
          };
        }),
      };
    });

    return NextResponse.json({ collections: processedCollections });
  } catch (error) {
    console.error('Error in collections API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
} 
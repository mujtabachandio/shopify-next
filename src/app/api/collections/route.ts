import { NextResponse } from 'next/server';
import { getCollections } from '@/lib/shopify-api';

const getYouTubeEmbedUrl = (url: string) => {
  if (url.includes('youtu.be')) {
    const videoId = url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes('youtube.com')) {
    const videoId = new URL(url).searchParams.get('v');
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  }
  return url;
};

export async function GET() {
  try {
    // Check if environment variables are set
    if (!process.env.SHOPIFY_STORE_DOMAIN || !process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
      console.error('Missing required environment variables');
      return NextResponse.json(
        { error: 'Shopify configuration is not set up properly' },
        { status: 500 }
      );
    }

    const response = await getCollections(5);
    // console.log('Raw Shopify response:', JSON.stringify(response, null, 2));
    
    // Process collections to ensure proper image URLs
    const processedCollections = response.collections.map((collection) => {
      // console.log(`Processing collection: ${collection.title}`);
      
      return {
        ...collection,
        products: collection.products.map((product) => {
          // console.log(`Processing product: ${product.title}`);
          
          let mediaType = 'IMAGE';
          let videoUrl = null;
          let imageUrl = null;

          // Check all media items to determine the type and get URLs
          if (product.media?.length > 0) {
            const firstMedia = product.media[0];
            // console.log('First media item:', firstMedia);

            switch (firstMedia.type) {
              case 'IMAGE':
                mediaType = 'IMAGE';
                imageUrl = firstMedia.imageUrl;
                break;

              case 'VIDEO':
                mediaType = 'VIDEO';
                videoUrl = firstMedia.videoUrl;
                imageUrl = firstMedia.imageUrl;
                break;

              case 'EXTERNAL_VIDEO':
                mediaType = 'YOUTUBE';
                if (firstMedia.host === 'YOUTUBE') {
                  videoUrl = getYouTubeEmbedUrl(firstMedia.originUrl || '');
                  const videoId = firstMedia.originUrl?.split('/').pop()?.split('?')[0];
                  imageUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                }
                break;
            }
          }
          
          const processedProduct = {
            ...product,
            mediaType,
            image: imageUrl || '/placeholder.png',
            videoUrl,
            category: collection.title,
            price: {
              amount: parseFloat(product.price?.amount?.toString() || '0'),
              currencyCode: product.price?.currencyCode || 'PKR'
            }
          };
          
          console.log('Product data from Shopify:', {
            title: product.title,
            id: product.id,
            price: product.price
          });

          console.log('Processed product:', processedProduct);
          return processedProduct;
        }),
      };
    });

    console.log('Final processed collections:', JSON.stringify(processedCollections, null, 2));
    return NextResponse.json({ collections: processedCollections });
  } catch (error) {
    console.error('Error in collections API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
} 
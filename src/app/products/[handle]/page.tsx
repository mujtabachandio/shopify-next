import ProductMediaReel from '@/components/ProductMediaReel';
import { getProduct, getAllProducts, Product as ShopifyProduct } from '@/lib/shopify-api';

interface Media {
  type: 'IMAGE' | 'VIDEO' | 'EXTERNAL_VIDEO' | 'MODEL_3D';
  imageUrl?: string;
  videoUrl?: string;
  embedUrl?: string;
  originUrl?: string;
  host?: string;
  alt?: string;
}

interface PageProps {
  params: { handle: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateStaticParams() {
  try {
    const { products } = await getAllProducts();
    return products.map((product: ShopifyProduct) => ({
      handle: product.handle,
    }));
  } catch (error) {
    // During build time, if environment variables are not set,
    // return an empty array to prevent build failure
    console.warn('Failed to generate static params:', error);
    return [];
  }
}

const transformedMedia = (product: ShopifyProduct): Media[] => {
  return product.media.map((media) => ({
    type: media.type as Media['type'],
    imageUrl: media.imageUrl,
    videoUrl: media.videoUrl,
    embedUrl: media.embedUrl,
    originUrl: media.originUrl,
    host: media.host,
    alt: media.imageAltText
  }));
};

export default async function ProductPage({ params }: PageProps) {
  try {
    const product = await getProduct(params.handle);
    if (!product) {
      return <div>Product not found</div>;
    }
    const media = transformedMedia(product);
    return (
      <div>
        <ProductMediaReel media={media} />
      </div>
    );
  } catch (error) {
    console.error('Error loading product:', error);
    return <div>Error loading product. Please try again later.</div>;
  }
} 
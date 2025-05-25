import ProductClient from './ProductClient';

// Mock product IDs for static generation
const mockProductIds = ['1', '2', '3'];

export async function generateStaticParams() {
  return mockProductIds.map((id) => ({
    id: id,
  }));
}

export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductClient id={params.id} />;
} 
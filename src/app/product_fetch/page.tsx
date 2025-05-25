// src/app/product_fetch/page.tsx
// import { fetchProducts } from '@/lib/shopify';
import Image from 'next/image';

// Product type define kiya
type Product = {
  node: {
    id: string;
    title: string;
    description: string;
    images: {
      edges: {
        node: {
          url: string;
          altText: string | null;
        };
      }[];
    };
  };
};

export default async function ProductFetchPage() {
  // const products: Product[] = await fetchProducts(); // type lagaya
  const products: Product[] = [];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Shopify Products</h1>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center',
        }}
      >
        {products.map((product) => {
          const { node } = product;

          return (
            <li
              key={node.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '15px',
                width: '250px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                textAlign: 'center',
              }}
            >
              <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>{node.title}</h2>
              <p
                style={{
                  fontSize: '14px',
                  color: '#555',
                  height: '50px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {node.description}
              </p>
              {node.images.edges[0] && (
                <Image
                  src={node.images.edges[0].node.url}
                  alt={node.images.edges[0].node.altText || 'product image'}
                  width={200}
                  height={200}
                  style={{ borderRadius: '4px', marginTop: '10px' }}
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}





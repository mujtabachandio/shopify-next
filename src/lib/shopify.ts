// lib/shopify.ts (create this file for API calls)
import { GraphQLClient } from 'graphql-request';

const SHOPIFY_STORE_URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}`;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const client = new GraphQLClient(`${SHOPIFY_STORE_URL}/api/2024-01/graphql.json`, {
  headers: {
    'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
  },
});

export interface VideoProduct {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail?: string;
  brandName?: string;
  price: number;
  description?: string;
  likes?: number;
  comments?: number;
  shares?: number;
}

type ShopifyVideoProductNode = {
  id: string;
  title: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  media: {
    edges: Array<{
      node: {
        mediaContentType: string;
        sources?: Array<{
          url: string;
        }>;
        preview?: {
          image?: {
            url: string;
          };
        };
      };
    }>;
  };
  vendor: string;
};

const GET_VIDEO_PRODUCTS = `
  query GetVideoProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          media(first: 10) {
            edges {
              node {
                mediaContentType
                ... on Video {
                  sources {
                    url
                    mimeType
                    height
                    width
                  }
                  preview {
                    image {
                      url
                    }
                  }
                }
              }
            }
          }
          vendor
        }
      }
    }
  }
`;

interface ShopifyResponse {
  products: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor?: string;
    };
    edges: Array<{
      node: ShopifyVideoProductNode;
    }>;
  };
}

export async function fetchVideoProducts(first: number = 10, after?: string): Promise<{
  products: VideoProduct[];
  hasNextPage: boolean;
  endCursor?: string;
}> {
  try {
    const response = await client.request<ShopifyResponse>(GET_VIDEO_PRODUCTS, {
      first,
      after,
    });

    const products = response.products.edges.map((edge) => {
      const node = edge.node;
      const videoMedia = node.media.edges.find(
        (media) => media.node.mediaContentType === 'VIDEO'
      );
      const videoUrl = videoMedia && videoMedia.node.sources && videoMedia.node.sources[0]
        ? videoMedia.node.sources[0].url
        : '';
      return {
        id: node.id,
        title: node.title,
        videoUrl,
        thumbnail: videoMedia?.node.preview?.image?.url,
        brandName: node.vendor,
        price: parseFloat(node.priceRange.minVariantPrice.amount),
        description: node.description,
      };
    });

    return {
      products,
      hasNextPage: response.products.pageInfo.hasNextPage,
      endCursor: response.products.pageInfo.endCursor,
    };
  } catch (error) {
    console.error('Error fetching video products:', error);
    return {
      products: [],
      hasNextPage: false,
    };
  }
}

// lib/shopify.ts (create this file for API calls)
import { GraphQLClient } from 'graphql-request';

// Shopify API configuration
const SHOPIFY_STORE_URL = process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!SHOPIFY_STORE_URL || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
  throw new Error('Missing required Shopify environment variables');
}

// Create GraphQL client
const client = new GraphQLClient(
  `https://${SHOPIFY_STORE_URL}/api/2024-01/graphql.json`,
  {
    headers: {
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
  }
);

export interface VideoProduct {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail?: string;
  brandName?: string;
  price: {
    amount: number;
    currencyCode: string;
  };
  description?: string;
  variantId: string;
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
  variants: {
    edges: Array<{
      node: {
        id: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
        inventoryQuantity: number;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
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
          status
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                price {
                  amount
                  currencyCode
                }
                inventoryQuantity
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
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

      // Get the first available variant
      const variant = node.variants.edges.find(edge => edge.node.availableForSale)?.node;
      if (!variant) {
        console.error('No available variant found for product:', node.title);
        return null;
      }

      // Ensure we have a valid variant ID
      if (!variant.id || !variant.id.startsWith('gid://shopify/ProductVariant/')) {
        console.error('Invalid variant ID format:', {
          product: node.title,
          variantId: variant.id
        });
        return null;
      }

      console.log('Processing product:', {
        title: node.title,
        productId: node.id,
        variantId: variant.id,
        availableForSale: variant.availableForSale,
        inventoryQuantity: variant.inventoryQuantity,
        selectedOptions: variant.selectedOptions
      });

      return {
        id: node.id,
        variantId: variant.id,
        title: node.title,
        videoUrl,
        thumbnail: videoMedia?.node.preview?.image?.url,
        brandName: node.vendor,
        price: {
          amount: parseFloat(variant.price.amount),
          currencyCode: variant.price.currencyCode
        },
        description: node.description,
      };
    }).filter(Boolean) as VideoProduct[];

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

const CREATE_CHECKOUT = `
  mutation CreateCheckout($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        webUrl
        completedAt
        order {
          id
          orderNumber
          processedAt
          totalPriceV2 {
            amount
            currencyCode
          }
        }
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;

interface CheckoutResponse {
  checkoutCreate?: {
    checkout?: {
      webUrl: string;
    };
    checkoutUserErrors?: Array<{
      message: string;
    }>;
  };
}

export async function createCheckout(items: CartItem[]): Promise<string | null> {
  try {
    console.log('Creating checkout with items:', items);

    // Format the line items for the checkout
    const lineItems = items.map(item => {
      console.log('Processing item for checkout:', {
        title: item.title,
        variantId: item.id,
        quantity: item.quantity
      });

      // Ensure we have a valid variant ID
      if (!item.id || !item.id.startsWith('gid://shopify/ProductVariant/')) {
        throw new Error(`Invalid variant ID for item ${item.title}: ${item.id}`);
      }

      return {
        variantId: item.id,
        quantity: item.quantity
      };
    });

    console.log('Formatted line items:', lineItems);

    const response = await client.request<CheckoutResponse>(CREATE_CHECKOUT, {
      input: {
        lineItems
      }
    });

    console.log('Checkout response:', response);

    const checkoutCreate = response.checkoutCreate;
    if (!checkoutCreate) {
      throw new Error('Failed to create checkout');
    }

    const userErrors = checkoutCreate.checkoutUserErrors || [];
    if (userErrors.length > 0) {
      console.error('Checkout user errors:', userErrors);
      throw new Error(userErrors.map(error => error.message).join(', '));
    }

    const checkoutUrl = checkoutCreate.checkout?.webUrl;
    if (!checkoutUrl) {
      throw new Error('No checkout URL returned from Shopify');
    }

    return checkoutUrl;
  } catch (error) {
    console.error('Error creating checkout:', error);
    throw error;
  }
}

import { GraphQLClient } from 'graphql-request';
import { GET_COLLECTIONS, GET_PRODUCT, GET_PRODUCTS_BY_COLLECTION, GET_ALL_PRODUCTS } from './shopify-queries';

// Hard-coded Shopify credentials
const SHOPIFY_STORE_URL = 'https://sastabazarbynabeelaadnan.myshopify.com';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = '6814d8eaf588e22f9468079520508b17';
const API_VERSION = '2024-01';

const client = new GraphQLClient(`${SHOPIFY_STORE_URL}/api/${API_VERSION}/graphql.json`, {
  headers: {
    'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Helper function to handle GraphQL errors
const handleGraphQLError = (error: unknown) => {
  const graphqlError = error as { response?: { status: number }, message?: string };
  if (graphqlError.response?.status === 401) {
    throw new Error('Invalid or expired Shopify API token');
  } else if (graphqlError.response?.status === 404) {
    throw new Error('Shopify store not found');
  } else if (graphqlError.response?.status === 429) {
    throw new Error('Too many requests to Shopify API');
  } else if (graphqlError.message?.includes('Network Error')) {
    throw new Error('Network error - please check your internet connection');
  }
  throw error;
};

export interface Media {
  type: string;
  // Image fields
  imageUrl?: string;
  imageAltText?: string;
  imageWidth?: number;
  imageHeight?: number;
  // Video fields
  videoUrl?: string;
  videoMimeType?: string;
  videoHeight?: number;
  videoWidth?: number;
  // External video fields
  embedUrl?: string;
  host?: string;
  originUrl?: string;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  status?: string;
  tags: string[];
  media: Media[];
  price: {
    amount: number;
    currencyCode: string;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
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

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string;
  products: Array<{
    id: string;
    title: string;
    handle: string;
    description: string;
    status: string;
    media: Media[];
    price: {
      amount: number;
      currencyCode: string;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
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
  }>;
}

export interface CollectionsResponse {
  collections: Collection[];
  hasNextPage: boolean;
  endCursor?: string;
}

export interface ProductsResponse {
  products: Product[];
  hasNextPage: boolean;
  endCursor?: string;
}

interface ShopifyResponse {
  products: Array<{
    id: string;
    title: string;
    description: string;
    handle: string;
    tags: string[];
    price: {
      amount: number;
      currencyCode: string;
    };
    media: Array<{
      type: string;
      imageUrl?: string;
      videoUrl?: string;
      originUrl?: string;
      host?: string;
    }>;
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
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
  }>;
  hasNextPage: boolean;
  endCursor?: string;
}


interface GraphQLResponse {
  collections?: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        handle: string;
        description: string;
        products: {
          edges: Array<{
            node: {
              id: string;
              title: string;
              handle: string;
              description: string;
              status: string;
              media: {
                edges: Array<{
                  node: GraphQLMediaNode;
                }>;
              };
              variants: {
                edges: Array<{
                  node: {
                    id: string;
                    title: string;
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
              priceRange: {
                minVariantPrice: {
                  amount: string;
                  currencyCode: string;
                };
              };
            };
          }>;
        };
      };
    }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
}

interface GraphQLProductResponse {
  productByHandle?: {
    id: string;
    title: string;
    handle: string;
    description: string;
    tags: string[];
    media: {
      edges: Array<{
        node: GraphQLMediaNode;
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
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
  };
}

interface GraphQLCollectionResponse {
  collectionByHandle?: {
    products: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          handle: string;
          description: string;
          tags: string[];
          media: {
            edges: Array<{
              node: {
                mediaContentType: string;
                sources?: Array<{
                  url: string;
                  mimeType: string;
                  height: number;
                  width: number;
                }>;
              };
            }>;
          };
          variants: {
            edges: Array<{
              node: {
                id: string;
                title: string;
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
          priceRange: {
            minVariantPrice: {
              amount: string;
              currencyCode: string;
            };
          };
        };
      }>;
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string;
      };
    };
  };
}

interface GraphQLProductsResponse {
  products?: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        handle: string;
        description: string;
        tags: string[];
        media: {
          edges: Array<{
            node: GraphQLMediaNode;
          }>;
        };
        variants: {
          edges: Array<{
            node: {
              id: string;
              title: string;
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
        priceRange: {
          minVariantPrice: {
            amount: string;
            currencyCode: string;
          };
        };
      };
    }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
}


interface GraphQLMediaNode {
  mediaContentType: string;
  sources?: Array<{
    url: string;
    mimeType: string;
    height: number;
    width: number;
  }>;
  image?: {
    url: string;
    altText: string;
    width: number;
    height: number;
  };
  embedUrl?: string;
  host?: string;
  originUrl?: string;
  preview?: {
    image?: {
      url: string;
    };
  };
}




export async function getCollections(first: number = 5, after?: string): Promise<CollectionsResponse> {
  try {
    console.log('Fetching collections with params:', { first, after });
    
    const response = await client.request(GET_COLLECTIONS, {
      first,
      after: after || null,
    }) as GraphQLResponse;

    console.log('Raw API response:', response);

    if (!response.collections || !response.collections.edges) {
      console.error('Invalid API response structure:', response);
      return { collections: [], hasNextPage: false };
    }

    const collections = response.collections.edges.map((edge) => {
      const node = edge.node;
      console.log('Processing collection node:', node.title);
      
      if (!node.products || !node.products.edges) {
        console.log('No products found in collection:', node.title);
        return {
          id: node.id,
          title: node.title,
          handle: node.handle,
          description: node.description,
          products: []
        };
      }

      const products = node.products.edges.map((productEdge) => {
        const product = productEdge.node;
        console.log('Processing product:', product.title, 'Status:', product.status);
        
        return {
          id: product.id,
          title: product.title,
          handle: product.handle,
          description: product.description,
          status: product.status,
          media: product.media.edges.map((mediaEdge) => {
            const mediaNode = mediaEdge.node;
            const media: Media = {
              type: mediaNode.mediaContentType,
            };

            switch (mediaNode.mediaContentType) {
              case 'VIDEO':
                media.videoUrl = mediaNode.sources?.[0]?.url;
                media.videoMimeType = mediaNode.sources?.[0]?.mimeType;
                media.videoHeight = mediaNode.sources?.[0]?.height;
                media.videoWidth = mediaNode.sources?.[0]?.width;
                break;
              case 'EXTERNAL_VIDEO':
                media.embedUrl = mediaNode.embedUrl;
                media.host = mediaNode.host;
                media.originUrl = mediaNode.originUrl;
                break;
              case 'IMAGE':
                media.imageUrl = mediaNode.image?.url;
                media.imageAltText = mediaNode.image?.altText;
                media.imageWidth = mediaNode.image?.width;
                media.imageHeight = mediaNode.image?.height;
                break;
            }

            return media;
          }),
          price: {
            amount: parseFloat(product.priceRange.minVariantPrice.amount),
            currencyCode: product.priceRange.minVariantPrice.currencyCode,
          },
          variants: product.variants
        };
      });

      return {
        id: node.id,
        title: node.title,
        handle: node.handle,
        description: node.description,
        products
      };
    });

    console.log('Processed collections:', collections);

    return {
      collections,
      hasNextPage: response.collections.pageInfo.hasNextPage,
      endCursor: response.collections.pageInfo.endCursor,
    };
  } catch (error) {
    handleGraphQLError(error);
    console.error('Error fetching collections:', error);
    return { collections: [], hasNextPage: false };
  }
}

export async function getProduct(handle: string): Promise<Product | null> {
  try {
    const response = await client.request(GET_PRODUCT, { handle }) as GraphQLProductResponse;
    const product = response.productByHandle;
    
    if (!product) return null;

    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      description: product.description,
      tags: product.tags || [],
      media: product.media.edges.map((mediaEdge) => ({
        type: mediaEdge.node.mediaContentType,
        videoUrl: mediaEdge.node.mediaContentType === 'VIDEO' ? mediaEdge.node.sources?.[0]?.url : undefined,
        videoMimeType: mediaEdge.node.mediaContentType === 'VIDEO' ? mediaEdge.node.sources?.[0]?.mimeType : undefined,
        videoHeight: mediaEdge.node.mediaContentType === 'VIDEO' ? mediaEdge.node.sources?.[0]?.height : undefined,
        videoWidth: mediaEdge.node.mediaContentType === 'VIDEO' ? mediaEdge.node.sources?.[0]?.width : undefined,
      })),
      price: {
        amount: parseFloat(product.variants.edges[0].node.price.amount),
        currencyCode: product.variants.edges[0].node.price.currencyCode,
      },
      variants: {
        edges: product.variants.edges
      }
    };
  } catch (error) {
    handleGraphQLError(error);
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function getProductsByCollection(
  handle: string,
  first: number = 10,
  after?: string
): Promise<{
  products: Product[];
  hasNextPage: boolean;
  endCursor?: string;
}> {
  try {
    const response = await client.request(GET_PRODUCTS_BY_COLLECTION, {
      handle,
      first,
      after,
    }) as GraphQLCollectionResponse;

    const collection = response.collectionByHandle;
    if (!collection) {
      return { products: [], hasNextPage: false };
    }

    const products = collection.products.edges.map((edge) => {
      const node = edge.node;
      return {
        id: node.id,
        title: node.title,
        handle: node.handle,
        description: node.description,
        tags: node.tags || [],
        media: node.media.edges.map((mediaEdge) => ({
          type: mediaEdge.node.mediaContentType,
          videoUrl: mediaEdge.node.mediaContentType === 'VIDEO' ? mediaEdge.node.sources?.[0]?.url : undefined,
          videoMimeType: mediaEdge.node.mediaContentType === 'VIDEO' ? mediaEdge.node.sources?.[0]?.mimeType : undefined,
          videoHeight: mediaEdge.node.mediaContentType === 'VIDEO' ? mediaEdge.node.sources?.[0]?.height : undefined,
          videoWidth: mediaEdge.node.mediaContentType === 'VIDEO' ? mediaEdge.node.sources?.[0]?.width : undefined,
        })),
        price: {
          amount: parseFloat(node.priceRange.minVariantPrice.amount),
          currencyCode: node.priceRange.minVariantPrice.currencyCode,
        },
        variants: {
          edges: node.variants.edges
        }
      };
    });

    return {
      products,
      hasNextPage: collection.products.pageInfo.hasNextPage,
      endCursor: collection.products.pageInfo.endCursor,
    };
  } catch (error) {
    handleGraphQLError(error);
    console.error('Error fetching products by collection:', error);
    return { products: [], hasNextPage: false };
  }
}

export async function getAllProducts(first: number = 50, after?: string): Promise<ShopifyResponse> {
  const maxRetries = 3;
  let retryCount = 0;
  const baseDelay = 1000; // 1 second

  while (retryCount < maxRetries) {
    try {
      console.log(`Fetching all products (attempt ${retryCount + 1}/${maxRetries})`);
      
      const response = await client.request(GET_ALL_PRODUCTS, {
        first,
        after: after || null,
      }) as GraphQLProductsResponse;

      if (!response.products?.edges) {
        console.error('No products found in response:', response);
        return { products: [], hasNextPage: false };
      }

      const products = response.products.edges.map(({ node }) => {
        const media = node.media.edges.map(({ node: mediaNode }) => {
          const mediaItem: Media = {
            type: mediaNode.mediaContentType,
          };

          switch (mediaNode.mediaContentType) {
            case 'IMAGE':
              if (mediaNode.image) {
                mediaItem.imageUrl = mediaNode.image.url;
                mediaItem.imageAltText = mediaNode.image.altText;
                mediaItem.imageWidth = mediaNode.image.width;
                mediaItem.imageHeight = mediaNode.image.height;
              }
              break;

            case 'VIDEO':
              if (mediaNode.sources && mediaNode.sources.length > 0) {
                const source = mediaNode.sources[0];
                mediaItem.videoUrl = source.url;
                mediaItem.videoMimeType = source.mimeType;
                mediaItem.videoWidth = source.width;
                mediaItem.videoHeight = source.height;
              }
              break;

            case 'EXTERNAL_VIDEO':
              mediaItem.embedUrl = mediaNode.embedUrl;
              mediaItem.host = mediaNode.host;
              mediaItem.originUrl = mediaNode.originUrl;
              break;
          }

          return mediaItem;
        });

        const variants = node.variants.edges.map(edge => edge.node);
        if (variants.length === 0) {
          console.warn('No variants found for product:', node.title);
          return null;
        }

        return {
          id: node.id,
          title: node.title,
          handle: node.handle,
          description: node.description,
          tags: node.tags || [],
          media,
          price: {
            amount: parseFloat(variants[0].price.amount),
            currencyCode: variants[0].price.currencyCode,
          },
          variants: {
            edges: node.variants.edges
          }
        };
      }).filter((product): product is Product => product !== null);

      return {
        products,
        hasNextPage: response.products.pageInfo.hasNextPage,
        endCursor: response.products.pageInfo.endCursor
      };
    } catch (error) {
      const graphqlError = error as { response?: { status: number, errors?: Array<{ message: string }> } };
      
      // Check if it's an internal server error
      if (graphqlError.response?.errors?.[0]?.message?.includes('Internal error')) {
        console.warn(`Shopify API internal error (attempt ${retryCount + 1}/${maxRetries})`);
        retryCount++;
        
        if (retryCount === maxRetries) {
          console.error('Max retries reached, returning empty response');
          return { products: [], hasNextPage: false };
        }
        
        // Exponential backoff with jitter
        const delay = baseDelay * Math.pow(2, retryCount) * (0.5 + Math.random());
        console.log(`Waiting ${Math.round(delay)}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Handle other types of errors
      handleGraphQLError(error);
      console.error(`Error fetching products (attempt ${retryCount + 1}/${maxRetries}):`, error);
      retryCount++;
      
      if (retryCount === maxRetries) {
        console.error('Max retries reached, returning empty response');
        return { products: [], hasNextPage: false };
      }
      
      // Wait before retrying
      const delay = baseDelay * Math.pow(2, retryCount);
      console.log(`Waiting ${Math.round(delay)}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return { products: [], hasNextPage: false };
}

export async function getProductByHandle(handle: string): Promise<ShopifyResponse> {
  try {
    const response = await client.request(GET_PRODUCT, { handle }) as GraphQLProductResponse;
    const product = response.productByHandle;
    
    if (!product) return { products: [], hasNextPage: false, endCursor: undefined };

    return {
      products: [
        {
          id: product.id,
          title: product.title,
          handle: product.handle,
          description: product.description,
          tags: product.tags || [],
          media: product.media.edges.map((mediaEdge) => ({
            type: mediaEdge.node.mediaContentType,
            videoUrl: mediaEdge.node.mediaContentType === 'VIDEO' ? mediaEdge.node.sources?.[0]?.url : undefined,
            videoMimeType: mediaEdge.node.mediaContentType === 'VIDEO' ? mediaEdge.node.sources?.[0]?.mimeType : undefined,
            videoHeight: mediaEdge.node.mediaContentType === 'VIDEO' ? mediaEdge.node.sources?.[0]?.height : undefined,
            videoWidth: mediaEdge.node.mediaContentType === 'VIDEO' ? mediaEdge.node.sources?.[0]?.width : undefined,
          })),
          price: {
            amount: parseFloat(product.variants.edges[0].node.price.amount),
            currencyCode: product.variants.edges[0].node.price.currencyCode,
          },
          variants: {
            edges: product.variants.edges
          }
        }
      ],
      hasNextPage: false,
      endCursor: undefined
    };
  } catch (error) {
    handleGraphQLError(error);
    console.error('Error fetching product:', error);
    return { products: [], hasNextPage: false, endCursor: undefined };
  }
} 
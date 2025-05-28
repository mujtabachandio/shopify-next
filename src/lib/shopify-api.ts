import { GraphQLClient } from 'graphql-request';
import { GET_COLLECTIONS, GET_PRODUCT, GET_PRODUCTS_BY_COLLECTION, GET_ALL_PRODUCTS } from './shopify-queries';

// Initialize Shopify Storefront GraphQL client
const getClient = () => {
  const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
  const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    console.error('Shopify environment variables missing:', {
      storeDomain: SHOPIFY_STORE_DOMAIN ? 'set' : 'missing',
      accessToken: SHOPIFY_STOREFRONT_ACCESS_TOKEN ? 'set' : 'missing'
    });
    // During build time, return a mock client that throws a more descriptive error
    return {
      request: async () => {
        throw new Error(
          'Shopify environment variables are not set. Please ensure SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN are configured in your environment.'
        );
      }
    };
  }

  const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;
  console.log('Initializing Shopify GraphQL client with endpoint:', endpoint);

  return new GraphQLClient(endpoint, {
    headers: {
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
  });
};

const client = getClient();

// Add a wrapper function for GraphQL requests with better error handling
const makeRequest = async <T>(query: string, variables?: any): Promise<T> => {
  try {
    console.log('Making GraphQL request:', {
      query: query.split('\n')[0] + '...', // Log first line of query
      variables
    });
    
    const response = await client.request(query, variables);
    return response as T;
  } catch (error) {
    console.error('GraphQL request failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      query: query.split('\n')[0] + '...',
      variables
    });
    throw error;
  }
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
    const response = await makeRequest<GraphQLResponse>(GET_COLLECTIONS, { first, after });
    
    if (!response.collections?.edges) {
      console.error('Invalid collections response:', response);
      throw new Error('Invalid response from Shopify: collections data is missing');
    }

    const collections = response.collections.edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
      handle: node.handle,
      description: node.description,
      products: node.products.edges.map(({ node: productNode }) => ({
        id: productNode.id,
        title: productNode.title,
        handle: productNode.handle,
        description: productNode.description,
        status: productNode.status,
        media: productNode.media.edges.map(({ node: mediaNode }) => ({
          type: mediaNode.mediaContentType,
          imageUrl: mediaNode.image?.url,
          imageAltText: mediaNode.image?.altText,
          imageWidth: mediaNode.image?.width,
          imageHeight: mediaNode.image?.height,
          videoUrl: mediaNode.sources?.[0]?.url,
          videoMimeType: mediaNode.sources?.[0]?.mimeType,
          videoWidth: mediaNode.sources?.[0]?.width,
          videoHeight: mediaNode.sources?.[0]?.height,
          embedUrl: mediaNode.embedUrl,
          host: mediaNode.host,
          originUrl: mediaNode.originUrl
        })),
        price: {
          amount: parseFloat(productNode.priceRange.minVariantPrice.amount),
          currencyCode: productNode.priceRange.minVariantPrice.currencyCode
        },
        variants: productNode.variants
      }))
    }));

    console.log(`Successfully processed ${collections.length} collections`);
    return {
      collections,
      hasNextPage: response.collections.pageInfo.hasNextPage,
      endCursor: response.collections.pageInfo.endCursor
    };
  } catch (error) {
    console.error('Error in getCollections:', error);
    throw error;
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
    console.error('Error fetching products by collection:', error);
    return { products: [], hasNextPage: false };
  }
}

export async function getAllProducts(first: number = 50, after?: string): Promise<ShopifyResponse> {
  try {
    console.log('Fetching all products with params:', { first, after });
    
    const response = await client.request(GET_ALL_PRODUCTS, {
      first,
      after: after || null,
    }) as GraphQLProductsResponse;

    if (!response.products?.edges) {
      console.error('No products found in response:', response);
      return { products: [], hasNextPage: false };
    }

    const products = response.products.edges.map(({ node }) => {
      console.log('Processing product:', node.title);
      console.log('Product media:', JSON.stringify(node.media.edges, null, 2));
      
      const media = node.media.edges.map(({ node: mediaNode }) => {
        console.log('Processing media node:', {
          type: mediaNode.mediaContentType,
          sources: mediaNode.sources,
          embedUrl: mediaNode.embedUrl,
          host: mediaNode.host,
          originUrl: mediaNode.originUrl
        });

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
            console.log('Processing external video:', {
              embedUrl: mediaNode.embedUrl,
              host: mediaNode.host,
              originUrl: mediaNode.originUrl
            });
            mediaItem.embedUrl = mediaNode.embedUrl;
            mediaItem.host = mediaNode.host;
            mediaItem.originUrl = mediaNode.originUrl;
            break;
        }

        console.log('Processed media item:', mediaItem);
        return mediaItem;
      });

      // Get the first available variant
      const firstVariant = node.variants.edges[0]?.node;
      if (!firstVariant) {
        console.error('No variant found for product:', node.title);
        return null;
      }

      return {
        id: node.id,
        title: node.title,
        handle: node.handle,
        description: node.description,
        media,
        price: {
          amount: parseFloat(firstVariant.price.amount),
          currencyCode: firstVariant.price.currencyCode,
        },
        variants: {
          edges: node.variants.edges
        }
      };
    }).filter((product): product is Product => product !== null);

    return {
      products,
      hasNextPage: response.products.pageInfo.hasNextPage,
      endCursor: response.products.pageInfo.endCursor,
    };
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
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
    console.error('Error fetching product:', error);
    return { products: [], hasNextPage: false, endCursor: undefined };
  }
} 
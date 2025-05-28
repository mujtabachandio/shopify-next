import { NextResponse } from 'next/server';
import { GraphQLClient } from 'graphql-request';

// interface ProductVariantResponse {
//   product?: {
//     id: string;
//     title: string;
//     variants: {
//       edges: Array<{
//         node: {
//           id: string;
//           title: string;
//           price: {
//             amount: string;
//             currencyCode: string;
//           };
//         };
//       }>;
//     };
//   };
// }

// interface CheckoutResponse {
//   checkoutCreate?: {
//     checkout?: {
//       id: string;
//       webUrl: string;
//     };
//     checkoutUserErrors?: Array<{
//       code: string;
//       field: string;
//       message: string;
//     }>;
//   };
// }

// interface DraftOrderResponse {
//   draftOrderCreate: {
//     draftOrder?: {
//       id: string;
//       order?: {
//         id: string;
//         name: string;
//         totalPriceSet: {
//           shopMoney: {
//             amount: string;
//             currencyCode: string;
//           };
//         };
//       };
//       checkoutUrl: string;
//     };
//     userErrors: Array<{
//       field: string;
//       message: string;
//     }>;
//   };
// }

// Initialize Shopify Storefront GraphQL client
const client = new GraphQLClient('https://tven40-ib.myshopify.com/api/2024-01/graphql.json', {
  headers: {
    'X-Shopify-Storefront-Access-Token': 'c72eea1c6de28db7d3f0fa22f0cf86fa',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

const GET_PRODUCT_VARIANT = `
  query getProductVariant($id: ID!) {
    productVariant(id: $id) {
      id
      title
      price {
        amount
        currencyCode
      }
      product {
        id
        title
        publishedAt
      }
    }
  }
`;

const CREATE_CART = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

interface ProductVariantResponse {
  productVariant?: {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    product: {
      id: string;
      title: string;
      publishedAt: string;
    };
  };
}

interface CartResponse {
  cartCreate: {
    cart?: {
      id: string;
      checkoutUrl: string;
      lines: {
        edges: Array<{
          node: {
            id: string;
            quantity: number;
            merchandise: {
              id: string;
              title: string;
              price: {
                amount: string;
                currencyCode: string;
              };
            };
          };
        }>;
      };
    };
    userErrors: Array<{
      field: string;
      message: string;
    }>;
  };
}

// CORS headers configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
  'Access-Control-Max-Age': '86400',
};

// Helper function to create response with CORS headers
function corsResponse(data: Record<string, unknown>, status: number = 200) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

// Handle OPTIONS request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// Handle POST request
export async function POST(request: Request) {
  console.log('📬 /api/orders POST request received');

  try {
    // Parse the request body
    let body;
    try {
      body = await request.json();
      console.log('Request body:', body);
    } catch (e) {
      console.error('Failed to parse request body:', e);
      return corsResponse(
        { error: 'Invalid request body' },
        400
      );
    }

    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('Invalid items array:', items);
      return corsResponse(
        { error: 'Invalid or empty items array' },
        400
      );
    }

    console.log('Processing items:', items);

    // Validate and format line items for cart
    const validatedLines = [];
    for (const item of items) {
      if (!item.productId || !item.quantity) {
        return corsResponse(
          { error: 'Each item must have a productId and quantity' },
          400
        );
      }

      // Verify the product variant exists and is published
      try {
        const variantResponse = await client.request<ProductVariantResponse>(GET_PRODUCT_VARIANT, {
          id: item.productId
        });

        if (!variantResponse.productVariant) {
          return corsResponse(
            { error: `Product variant ${item.productId} not found` },
            400
          );
        }

        if (!variantResponse.productVariant.product.publishedAt) {
          return corsResponse(
            { error: `Product ${variantResponse.productVariant.product.title} is not published` },
            400
          );
        }

        validatedLines.push({
          merchandiseId: item.productId,
          quantity: item.quantity
        });
      } catch (error) {
        console.error('Error validating product variant:', error);
        return corsResponse(
          { error: `Failed to validate product variant ${item.productId}` },
          400
        );
      }
    }

    console.log('Validated cart lines:', validatedLines);

    // Create cart in Shopify
    const response = await client.request<CartResponse>(CREATE_CART, {
      input: {
        lines: validatedLines
      }
    });

    console.log('Shopify response:', response);

    const cartCreate = response.cartCreate;
    if (!cartCreate) {
      return corsResponse(
        { error: 'Failed to create cart' },
        500
      );
    }

    const userErrors = cartCreate.userErrors || [];
    if (userErrors.length > 0) {
      console.error('Cart creation errors:', userErrors);
      return corsResponse(
        { error: userErrors.map((e: { message: string }) => e.message).join(', ') },
        400
      );
    }

    if (!cartCreate.cart?.checkoutUrl) {
      return corsResponse(
        { error: 'No checkout URL received from Shopify' },
        500
      );
    }

    console.log('Cart created successfully:', cartCreate.cart);

    return corsResponse({
      success: true,
      checkout: {
        webUrl: cartCreate.cart.checkoutUrl
      }
    });
  } catch (error) {
    console.error('Error creating cart:', error);
    return corsResponse(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      500
    );
  }
}

// Add configuration for the API route
export const runtime = 'edge'; 
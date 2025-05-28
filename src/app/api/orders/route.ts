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
  },
});

// const GET_PRODUCT_VARIANT = `
//   query getProductVariant($id: ID!) {
//     product(id: $id) {
//       id
//       title
//       variants(first: 1) {
//         edges {
//           node {
//             id
//             title
//             price {
//               amount
//               currencyCode
//             }
//           }
//         }
//       }
//     }
//   }
// `;

const CREATE_CART = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

interface CartResponse {
  cartCreate: {
    cart?: {
      id: string;
      checkoutUrl: string;
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
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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

    // Format line items for cart
    const lines = items.map(item => ({
      merchandiseId: item.productId,
      quantity: item.quantity
    }));

    console.log('Created cart lines:', lines);

    // Create cart in Shopify
    const response = await client.request<CartResponse>(CREATE_CART, {
      input: {
        lines
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
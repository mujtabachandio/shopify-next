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
//     productVariant(id: $id) {
//       id
//       title
//       price {
//         amount
//         currencyCode
//       }
//       product {
//         id
//         title
//         publishedAt
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

// interface ProductVariantResponse {
//   productVariant?: {
//     id: string;
//     title: string;
//     price: {
//       amount: string;
//       currencyCode: string;
//     };
//     product: {
//       id: string;
//       title: string;
//       publishedAt: string;
//     };
//   };
// }

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
  try {
    // Parse the request body
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return corsResponse(
        { error: 'No items provided' },
        400
      );
    }

    // Format line items for cart
    const lines = items.map(item => ({
      merchandiseId: item.productId,
      quantity: item.quantity
    }));

    // Create cart in Shopify
    const response = await client.request<CartResponse>(CREATE_CART, {
      input: { lines }
    });

    const cartCreate = response.cartCreate;
    
    if (cartCreate.userErrors?.length > 0) {
      return corsResponse(
        { error: cartCreate.userErrors[0].message },
        400
      );
    }

    if (!cartCreate.cart?.checkoutUrl) {
      return corsResponse(
        { error: 'Failed to create checkout' },
        500
      );
    }

    return corsResponse({
      success: true,
      checkoutUrl: cartCreate.cart.checkoutUrl
    });
  } catch (error) {
    console.error('Error:', error);
    return corsResponse(
      { error: 'Failed to process checkout' },
      500
    );
  }
}

// Add configuration for the API route
export const runtime = 'edge'; 
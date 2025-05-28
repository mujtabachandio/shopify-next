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

interface DraftOrderResponse {
  draftOrderCreate: {
    draftOrder?: {
      id: string;
      order?: {
        id: string;
        name: string;
        totalPriceSet: {
          shopMoney: {
            amount: string;
            currencyCode: string;
          };
        };
      };
      checkoutUrl: string;
    };
    userErrors: Array<{
      field: string;
      message: string;
    }>;
  };
}

// Initialize Shopify Admin GraphQL client
const client = new GraphQLClient('https://tven40-ib.myshopify.com/admin/api/2024-01/graphql.json', {
  headers: {
    'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '',
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

const CREATE_CHECKOUT = `
  mutation draftOrderCreate($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder {
        id
        order {
          id
          name
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
        }
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

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

    // Format line items for draft order
    const lineItems = items.map(item => ({
      variantId: item.productId,
      quantity: item.quantity,
      title: item.title,
      price: item.price.amount
    }));

    console.log('Created line items:', lineItems);

    // Create draft order in Shopify
    const response = await client.request<DraftOrderResponse>(CREATE_CHECKOUT, {
      input: {
        lineItems,
        email: 'customer@example.com',
        shippingAddress: {
          address1: '123 Main St',
          city: 'Toronto',
          province: 'ON',
          country: 'Canada',
          zip: 'M5V 2T6'
        }
      }
    });

    console.log('Shopify response:', response);

    const draftOrderCreate = response.draftOrderCreate;
    if (!draftOrderCreate) {
      return corsResponse(
        { error: 'Failed to create draft order' },
        500
      );
    }

    const userErrors = draftOrderCreate.userErrors || [];
    if (userErrors.length > 0) {
      return corsResponse(
        { error: userErrors.map((e: { message: string }) => e.message).join(', ') },
        400
      );
    }

    if (!draftOrderCreate.draftOrder?.checkoutUrl) {
      return corsResponse(
        { error: 'No checkout URL received from Shopify' },
        500
      );
    }

    console.log('Draft order created successfully:', draftOrderCreate.draftOrder);

    return corsResponse({
      success: true,
      checkout: {
        webUrl: draftOrderCreate.draftOrder.checkoutUrl
      }
    });
  } catch (error) {
    console.error('Error creating draft order:', error);
    return corsResponse(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      500
    );
  }
}

// Add configuration for the API route
export const runtime = 'edge'; 
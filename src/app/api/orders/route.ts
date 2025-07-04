import { NextResponse } from 'next/server';
import { GraphQLClient } from 'graphql-request';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface CheckoutResponse {
  checkoutCreate: {
    checkout: {
      id: string;
      webUrl: string;
      completedAt: string | null;
      order: {
        id: string;
        orderNumber: number;
        processedAt: string;
        totalPriceV2: {
          amount: string;
          currencyCode: string;
        };
      } | null;
    } | null;
    checkoutUserErrors: Array<{
      code: string;
      field: string[];
      message: string;
    }>;
  };
}

// interface CheckoutItem {
//   quantity: number;
//   variantId: string;
// }

// Initialize Shopify Storefront GraphQL client
const client = new GraphQLClient(`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL}/api/2024-01/graphql.json`, {
  headers: {
    'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
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
  mutation checkoutCreate($input: CheckoutCreateInput!) {
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

// Enable CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

export async function POST(request: Request) {
  try {
    // Verify environment variables
    if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL || !process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
      console.error('Missing required Shopify environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500, headers: corsHeaders }
      );
    }

    const body = await request.json();
    const { items, total } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('Received order request:', { items, total });

    // Format line items for checkout
    const lineItems = items.map((item: { quantity: number; variantId: string }) => ({
      quantity: item.quantity,
      variantId: item.variantId
    }));

    console.log('Prepared line items:', lineItems);

    // Create checkout in Shopify
    const response = await client.request<CheckoutResponse>(CREATE_CHECKOUT, {
      input: {
        lineItems,
        allowPartialAddresses: true,
        email: "customer@example.com"
      }
    });

    console.log('Checkout response:', response);

    const checkoutCreate = response.checkoutCreate;
    if (!checkoutCreate) {
      return NextResponse.json(
        { error: 'Failed to create checkout' },
        { status: 500, headers: corsHeaders }
      );
    }

    const userErrors = checkoutCreate.checkoutUserErrors || [];
    if (userErrors.length > 0) {
      console.error('Checkout creation errors:', userErrors);
      return NextResponse.json(
        { error: userErrors.map((e: { message: string }) => e.message).join(', ') },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!checkoutCreate.checkout?.webUrl) {
      return NextResponse.json(
        { error: 'No checkout URL received' },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json({
      success: true,
      checkout: {
        id: checkoutCreate.checkout.id,
        webUrl: checkoutCreate.checkout.webUrl,
        completedAt: checkoutCreate.checkout.completedAt,
        order: checkoutCreate.checkout.order ? {
          id: checkoutCreate.checkout.order.id,
          orderNumber: checkoutCreate.checkout.order.orderNumber,
          processedAt: checkoutCreate.checkout.order.processedAt,
          totalPriceV2: checkoutCreate.checkout.order.totalPriceV2
        } : null
      }
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error creating checkout:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
} 
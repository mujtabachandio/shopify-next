import { NextResponse } from 'next/server';
import { GraphQLClient } from 'graphql-request';

interface ProductVariantResponse {
  product?: {
    id: string;
    title: string;
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
        };
      }>;
    };
  };
}

interface CheckoutResponse {
  checkoutCreate?: {
    checkout?: {
      id: string;
      webUrl: string;
    };
    checkoutUserErrors?: Array<{
      code: string;
      field: string;
      message: string;
    }>;
  };
}


// Initialize Shopify Storefront GraphQL client
const client = new GraphQLClient('https://tven40-ib.myshopify.com/api/2024-01/graphql.json', {
  headers: {
    'X-Shopify-Storefront-Access-Token': 'c72eea1c6de28db7d3f0fa22f0cf86fa',
    'Content-Type': 'application/json',
  },
});

const GET_PRODUCT_VARIANT = `
  query getProductVariant($id: ID!) {
    product(id: $id) {
      id
      title
      variants(first: 1) {
        edges {
          node {
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
`;

const CREATE_CHECKOUT = `
  mutation checkoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        webUrl
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;

export async function POST(request: Request) {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { headers });
  }

  try {
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or empty items array' },
        { status: 400, headers }
      );
    }

    // Get the first variant ID for each product
    const lineItems = await Promise.all(items.map(async (item) => {
      try {
        // Get the first variant of the product
        const response = await client.request<ProductVariantResponse>(GET_PRODUCT_VARIANT, {
          id: item.productId
        });

        const variant = response.product?.variants?.edges[0]?.node;
        if (!variant) {
          throw new Error(`No variant found for product: ${item.title}`);
        }

        return {
          quantity: item.quantity,
          variantId: variant.id
        };
      } catch (error) {
        console.error('Error processing item:', error);
        throw error;
      }
    }));

    // Create checkout in Shopify
    const response = await client.request<CheckoutResponse>(CREATE_CHECKOUT, {
      input: {
        lineItems
      }
    });

    const checkoutCreate = response.checkoutCreate;
    if (!checkoutCreate) {
      return NextResponse.json(
        { error: 'Failed to create checkout' },
        { status: 500, headers }
      );
    }

    const userErrors = checkoutCreate.checkoutUserErrors || [];
    if (userErrors.length > 0) {
      return NextResponse.json(
        { error: userErrors.map((e: { message: string }) => e.message).join(', ') },
        { status: 400, headers }
      );
    }

    if (!checkoutCreate.checkout?.webUrl) {
      return NextResponse.json(
        { error: 'No checkout URL received from Shopify' },
        { status: 500, headers }
      );
    }

    return NextResponse.json({
      success: true,
      checkout: checkoutCreate.checkout
    }, { headers });
  } catch (error) {
    console.error('Error creating checkout:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500, headers }
    );
  }
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 
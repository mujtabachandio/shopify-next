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

// CORS headers configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};

// Helper function to create response with CORS headers
function corsResponse(data: any, status: number = 200) {
  return NextResponse.json(data, {
    status,
    headers: corsHeaders,
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
  try {
    // Log the incoming request
    console.log('Received checkout request');

    const body = await request.json();
    console.log('Request body:', body);

    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('Invalid items array:', items);
      return corsResponse(
        { error: 'Invalid or empty items array' },
        400
      );
    }

    console.log('Processing items:', items);

    // Get the first variant ID for each product
    const lineItems = await Promise.all(items.map(async (item) => {
      try {
        console.log('Processing item:', item);
        
        // Get the first variant of the product
        const response = await client.request<ProductVariantResponse>(GET_PRODUCT_VARIANT, {
          id: item.productId
        });

        console.log('Variant response:', response);

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

    console.log('Created line items:', lineItems);

    // Create checkout in Shopify
    const response = await client.request<CheckoutResponse>(CREATE_CHECKOUT, {
      input: {
        lineItems
      }
    });

    console.log('Shopify checkout response:', response);

    const checkoutCreate = response.checkoutCreate;
    if (!checkoutCreate) {
      return corsResponse(
        { error: 'Failed to create checkout' },
        500
      );
    }

    const userErrors = checkoutCreate.checkoutUserErrors || [];
    if (userErrors.length > 0) {
      return corsResponse(
        { error: userErrors.map((e: { message: string }) => e.message).join(', ') },
        400
      );
    }

    if (!checkoutCreate.checkout?.webUrl) {
      return corsResponse(
        { error: 'No checkout URL received from Shopify' },
        500
      );
    }

    console.log('Checkout created successfully:', checkoutCreate.checkout);

    return corsResponse({
      success: true,
      checkout: checkoutCreate.checkout
    });
  } catch (error) {
    console.error('Error creating checkout:', error);
    return corsResponse(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      500
    );
  }
} 
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

interface CartItem {
  productId: string;
  title: string;
  quantity: number;
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

// Add CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  return new NextResponse(
    JSON.stringify({ error: 'Method not allowed. Please use POST for creating orders.' }),
    { 
      status: 405,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      }
    }
  );
}

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error('Failed to parse request body:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { 
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    }

    const { items, total } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: 'No items provided in the order' }),
        { 
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    }

    console.log('Received order request:', { items, total });

    // Get the first variant ID for each product
    const lineItems = await Promise.all(items.map(async (item: CartItem) => {
      console.log('Processing item:', item);

      if (!item.productId) {
        throw new Error(`Missing product ID for item: ${item.title}`);
      }

      try {
        // Get the first variant of the product
        const response = await client.request<ProductVariantResponse>(GET_PRODUCT_VARIANT, {
          id: item.productId
        });

        console.log('Product variant response:', response);

        const variant = response.product?.variants?.edges[0]?.node;
        if (!variant) {
          throw new Error(`No variant found for product: ${item.title}`);
        }

        console.log('Found variant:', variant);

        return {
          quantity: item.quantity,
          variantId: variant.id
        };
      } catch (error) {
        console.error('Error processing item:', error);
        // Log the full error details
        if (error instanceof Error) {
          console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
          });
        }
        throw new Error(`Failed to process item ${item.title}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }));

    console.log('Prepared line items:', lineItems);

    // Create checkout in Shopify
    const response = await client.request<CheckoutResponse>(CREATE_CHECKOUT, {
      input: {
        lineItems
      }
    });

    console.log('Checkout response:', response);

    const checkoutCreate = response.checkoutCreate;
    if (!checkoutCreate) {
      console.error('No checkout response from Shopify');
      return new NextResponse(
        JSON.stringify({ error: 'Failed to create checkout - no response from Shopify' }),
        { 
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    }

    const userErrors = checkoutCreate.checkoutUserErrors || [];
    if (userErrors.length > 0) {
      console.error('Checkout creation errors:', userErrors);
      return new NextResponse(
        JSON.stringify({ error: userErrors.map((e: { message: string }) => e.message).join(', ') }),
        { 
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    }

    if (!checkoutCreate.checkout?.webUrl) {
      console.error('No checkout URL in response:', checkoutCreate);
      return new NextResponse(
        JSON.stringify({ error: 'No checkout URL received from Shopify' }),
        { 
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        checkout: checkoutCreate.checkout
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error) {
    console.error('Error creating checkout:', error);
    // Log the full error details
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    return new NextResponse(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to create checkout' }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      }
    );
  }
} 
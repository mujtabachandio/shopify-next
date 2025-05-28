import { NextResponse } from 'next/server';
import { GraphQLClient } from 'graphql-request';

interface CartItem {
  productId: string;
  title: string;
  quantity: number;
  price: {
    amount: number;
    currencyCode: string;
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
            };
          };
        }>;
      };
      cost: {
        totalAmount: {
          amount: number;
          currencyCode: string;
        };
        subtotalAmount: {
          amount: number;
          currencyCode: string;
        };
        totalTaxAmount: {
          amount: number;
          currencyCode: string;
        };
      };
    };
    userErrors?: Array<{
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
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
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

export async function POST() {
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

export async function GET(request: Request) {
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

    console.log('Received cart request:', { items, total });

    // Format line items for Shopify cart
    const lineItems = items.map((item: CartItem) => ({
      quantity: item.quantity,
      merchandiseId: item.productId.startsWith('gid://') ? item.productId : `gid://shopify/ProductVariant/${item.productId.split('/').pop()}`
    }));

    console.log('Formatted line items:', lineItems);

    // Create cart in Shopify
    const response = await client.request<CartResponse>(CREATE_CART, {
      input: {
        lines: lineItems
      }
    });

    console.log('Cart response:', response);

    const cartCreate = response.cartCreate;
    if (!cartCreate) {
      console.error('No cart response from Shopify');
      return new NextResponse(
        JSON.stringify({ error: 'Failed to create cart - no response from Shopify' }),
        { 
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    }

    const userErrors = cartCreate.userErrors || [];
    if (userErrors.length > 0) {
      console.error('Cart creation errors:', userErrors);
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

    if (!cartCreate.cart?.checkoutUrl) {
      console.error('No checkout URL in response:', cartCreate);
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
        cart: cartCreate.cart
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error) {
    console.error('Error creating cart:', error);
    // Log the full error details
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    return new NextResponse(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to create cart' }),
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
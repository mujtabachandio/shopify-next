import { NextResponse } from 'next/server';
import { GraphQLClient } from 'graphql-request';
import cartFragment from '@/lib/graphql/fragments/cart';

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
  price?: {
    amount: number;
    currencyCode: string;
  };
}

interface CartResponse {
  cart?: {
    id: string;
    checkoutUrl: string;
    cost: {
      subtotalAmount: {
        amount: string;
        currencyCode: string;
      };
      totalAmount: {
        amount: string;
        currencyCode: string;
      };
      totalTaxAmount: {
        amount: string;
        currencyCode: string;
      };
    };
    lines: {
      edges: Array<{
        node: {
          id: string;
          quantity: number;
          cost: {
            totalAmount: {
              amount: string;
              currencyCode: string;
            };
          };
          merchandise: {
            id: string;
            title: string;
            selectedOptions: Array<{
              name: string;
              value: string;
            }>;
            product: {
              id: string;
              title: string;
            };
          };
        };
      }>;
    };
    totalQuantity: number;
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

const GET_CART = `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...cart
    }
  }
  ${cartFragment}
`;

// Export both methods as named exports
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cartId = searchParams.get('cartId');

    if (!cartId) {
      return new NextResponse(
        JSON.stringify({ error: 'Cart ID is required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const response = await client.request<CartResponse>(GET_CART, { cartId });
    
    if (!response.cart) {
      return new NextResponse(
        JSON.stringify({ error: 'Cart not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new NextResponse(
      JSON.stringify(response.cart),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error fetching cart:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch cart' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { items, total, cartId } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: 'No items provided in the order' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Received order request:', { items, total, cartId });

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
      return new NextResponse(
        JSON.stringify({ error: 'Failed to create checkout - no response from Shopify' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
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
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!checkoutCreate.checkout?.webUrl) {
      return new NextResponse(
        JSON.stringify({ error: 'No checkout URL received from Shopify' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        checkout: checkoutCreate.checkout
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error creating checkout:', error);
    return new NextResponse(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to create checkout' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 
import { NextResponse } from 'next/server';

interface CartItem {
  productId: string;
  title: string;
  quantity: number;
  price: {
    amount: number;
    currencyCode: string;
  };
}

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

    // Format line items for Shopify Admin API
    const lineItems = items.map((item: CartItem) => ({
      title: item.title,
      quantity: item.quantity,
      price: item.price.amount,
      // Extract variant ID from the product ID
      variant_id: item.productId.split('/').pop()
    }));

    console.log('Formatted line items:', lineItems);

    // Create order in Shopify using Admin API
    const response = await fetch('https://tven40-ib.myshopify.com/admin/api/2024-01/orders.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': 'c72eea1c6de28db7d3f0fa22f0cf86fa',
      },
      body: JSON.stringify({
        order: {
          line_items: lineItems,
          financial_status: 'pending',
          send_receipt: false,
          send_fulfillment_receipt: false,
        }
      })
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Shopify API error:', responseData);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to create order in Shopify' }),
        { 
          status: response.status,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    }

    console.log('Order created in Shopify:', responseData);

    return new NextResponse(
      JSON.stringify({
        success: true,
        order: responseData.order
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    // Log the full error details
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    return new NextResponse(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to create order' }),
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
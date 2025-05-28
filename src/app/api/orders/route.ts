import { NextResponse } from 'next/server';

// Initialize Shopify Admin API client
const SHOPIFY_ADMIN_API_URL = 'https://tven40-ib.myshopify.com/admin/api/2024-01';
const SHOPIFY_ACCESS_TOKEN = 'c72eea1c6de28db7d3f0fa22f0cf86fa';

// CORS headers configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Shopify-Access-Token',
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

    // Format line items for order
    const lineItems = items.map(item => ({
      variant_id: item.productId.split('/').pop(), // Extract variant ID from GID
      quantity: item.quantity
    }));

    // Create order in Shopify
    const response = await fetch(`${SHOPIFY_ADMIN_API_URL}/orders.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        order: {
          line_items: lineItems,
          financial_status: 'pending',
          send_receipt: true,
          send_fulfillment_receipt: true
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Shopify API Error:', errorData);
      return corsResponse(
        { error: errorData.errors || 'Failed to create order' },
        response.status
      );
    }

    const orderData = await response.json();
    console.log('Order created successfully:', orderData);

    return corsResponse({
      success: true,
      order: {
        id: orderData.order.id,
        orderNumber: orderData.order.order_number,
        totalPrice: orderData.order.total_price,
        status: orderData.order.financial_status
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return corsResponse(
      { error: 'Failed to process order' },
      500
    );
  }
}

// Add configuration for the API route
export const runtime = 'edge'; 
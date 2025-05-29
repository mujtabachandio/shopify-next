import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;

function verifyWebhookSignature(
  body: string,
  hmac: string,
  secret: string
): boolean {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('base64');
  return hash === hmac;
}

export async function POST(request: Request) {
  try {
    // Get the raw body as text for HMAC verification
    const rawBody = await request.text();
    const hmac = request.headers.get('x-shopify-hmac-sha256');
    const topic = request.headers.get('x-shopify-topic');

    // Verify webhook signature
    if (!hmac || !WEBHOOK_SECRET) {
      console.error('Missing HMAC or secret');
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    // Verify the webhook signature
    const isValid = verifyWebhookSignature(rawBody, hmac, WEBHOOK_SECRET);
    if (!isValid) {
      console.error('Invalid HMAC signature');
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    // Parse the body as JSON
    const body = JSON.parse(rawBody);
    console.log(`Received webhook: ${topic}`, body);

    // Revalidate relevant paths based on the webhook topic
    switch (topic) {
      case 'products/create':
      case 'products/update':
      case 'products/delete':
        revalidatePath('/');
        revalidatePath('/products/[handle]');
        break;
      case 'collections/create':
      case 'collections/update':
      case 'collections/delete':
        revalidatePath('/');
        revalidatePath('/collections/[handle]');
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
} 
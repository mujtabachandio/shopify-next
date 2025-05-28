import { NextResponse } from 'next/server';

export async function GET() {
  // You can customize the redirect destination
  return NextResponse.redirect(new URL('/collections', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
} 
"use client";

import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const dynamic = 'force-dynamic';

function CheckoutContent() {
  const { items } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const cartId = searchParams.get('cartId');

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/');
    }
  }, [items, router]);

  useEffect(() => {
    const processCheckout = async () => {
      if (!cartId) {
        setError('No cart ID provided');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // First, get the cart details
        console.log('Fetching cart details for cartId:', cartId);
        const cartResponse = await fetch(`/api/orders?cartId=${cartId}`);
        
        if (!cartResponse.ok) {
          const errorText = await cartResponse.text();
          console.error('Cart fetch error:', {
            status: cartResponse.status,
            statusText: cartResponse.statusText,
            body: errorText
          });
          throw new Error(`Failed to fetch cart: ${cartResponse.status} ${cartResponse.statusText}`);
        }

        const cartData = await cartResponse.json();
        console.log('Cart data received:', cartData);

        if (!cartData || !cartData.lines || !cartData.lines.edges) {
          throw new Error('Invalid cart data received');
        }

        // Prepare the order data
        const orderData = {
          items: cartData.lines.edges.map((edge: { node: { merchandise: { product: { id: string; title: string }; }; quantity: number; cost: { totalAmount: { amount: string; }; }; }; }) => ({
            productId: edge.node.merchandise.product.id,
            title: edge.node.merchandise.product.title,
            quantity: edge.node.quantity,
            price: edge.node.cost.totalAmount.amount
          })),
          total: cartData.cost.totalAmount.amount,
          cartId: cartId
        };

        console.log('Sending order data:', orderData);

        // Create the checkout
        const checkoutResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData)
        });

        if (!checkoutResponse.ok) {
          const errorText = await checkoutResponse.text();
          console.error('Checkout error:', {
            status: checkoutResponse.status,
            statusText: checkoutResponse.statusText,
            body: errorText
          });
          throw new Error(`Checkout failed: ${checkoutResponse.status} ${checkoutResponse.statusText}`);
        }

        const checkoutData = await checkoutResponse.json();
        console.log('Checkout response:', checkoutData);

        if (!checkoutData.success || !checkoutData.checkout?.webUrl) {
          throw new Error('Invalid checkout response received');
        }

        // Redirect to Shopify checkout
        window.location.href = checkoutData.checkout.webUrl;
      } catch (err) {
        console.error('Checkout process error:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    processCheckout();
  }, [cartId]);

  const total = items.reduce((sum, item) => sum + (item.price.amount * item.quantity), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Processing your order...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error</div>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => router.push('/cart')}
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-lg shadow-lg overflow-hidden border border-border"
        >
          <div className="p-6">
            <h1 className="text-2xl font-bold text-foreground mb-6">Order Summary</h1>

            {/* Order Summary */}
            <div className="space-y-4 mb-6">
              <h2 className="text-lg font-semibold text-foreground">Items</h2>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-border">
                  <div>
                    <p className="text-foreground font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    <p className="text-xs text-muted-foreground">Product ID: {item.id}</p>
                  </div>
                  <p className="text-foreground">
                    {item.price.currencyCode} {(item.price.amount * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4">
                <p className="text-lg font-semibold text-foreground">Total</p>
                <p className="text-xl font-bold text-foreground">
                  {items[0]?.price.currencyCode} {total.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-md">
                <p className="text-destructive">{error}</p>
              </div>
            )}

            {/* Submit Order Button */}
            <button
              onClick={() => router.push('/cart')}
              className="w-full py-3 px-4 rounded-lg font-medium transition-all bg-gray-400 cursor-not-allowed"
            >
              Return to Cart
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
} 
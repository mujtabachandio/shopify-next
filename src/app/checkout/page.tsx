"use client";

import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!items || items.length === 0) {
        throw new Error('Cart is empty');
      }

      console.log('Starting checkout process with items:', items);

      // Create a checkout in Shopify
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity
          }))
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json() as {
        success: boolean;
        checkout?: {
          webUrl: string;
        };
        error?: string;
      };
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to create checkout');
      }

      if (!data.checkout?.webUrl) {
        throw new Error('No checkout URL received from server');
      }
      
      // Clear the cart after successful checkout creation
      clearCart();
      
      // Redirect to Shopify checkout
      window.location.href = data.checkout.webUrl;
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create checkout');
    } finally {
      setIsLoading(false);
    }
  };

  const total = items.reduce((sum, item) => sum + (item.price.amount * item.quantity), 0);

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
              onClick={handleCheckout}
              disabled={isLoading || items.length === 0}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                isLoading || items.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Checkout...
                </span>
              ) : (
                'Proceed to Checkout'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 
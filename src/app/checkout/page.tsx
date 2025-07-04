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
      // Create a checkout in Shopify
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            variantId: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity
          })),
          total: items.reduce((sum, item) => sum + (item.price.amount * item.quantity), 0)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout');
      }

      console.log('Checkout created:', data);
      
      // Clear the cart after successful checkout creation
      clearCart();
      
      // Redirect to Shopify checkout
      if (data.checkout?.webUrl) {
        window.location.href = data.checkout.webUrl;
      } else {
        throw new Error('No checkout URL received');
      }
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
              {isLoading ? 'Creating Checkout...' : 'Proceed to Checkout'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 
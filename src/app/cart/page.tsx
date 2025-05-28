"use client";
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { TrashIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();
  const router = useRouter();

  const formatPrice = (amount: number | undefined) => {
    if (amount === undefined) return 'PKR 0.00';
    return `PKR ${amount.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`;
  };

  const formatVariantId = (id: string) => {
    const parts = id.split('/');
    return parts[parts.length - 1];
  };

  const total = items.reduce((sum, item) => {
    const itemTotal = (item.price?.amount || 0) * item.quantity;
    return sum + itemTotal;
  }, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Add some items to your cart to continue shopping.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
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
            <h1 className="text-2xl font-bold text-foreground mb-6">Shopping Cart</h1>

            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-4 border-b border-border">
                  <div className="flex-1">
                    <h3 className="text-foreground font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.price?.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Variant ID: {formatVariantId(item.id)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-2 py-1 border border-border rounded hover:bg-accent"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 border border-border rounded hover:bg-accent"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold text-foreground">Total</span>
              <span className="text-xl font-bold text-foreground">{formatPrice(total)}</span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => router.push('/checkout')}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


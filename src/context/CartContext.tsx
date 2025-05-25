'use client'

import { createContext, useState, useContext } from 'react'
// import type { CartItem } from '@/types/shopify'

type CartContextType = {
  cart: CartItem[]
  addToCart: (product: CartItem) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  
  const addToCart = (product: CartItem) => {
    setCart([...cart, product])
  }
  
  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id))
  }
  
  const clearCart = () => {
    setCart([])
  }
  
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
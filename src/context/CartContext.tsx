'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
// import type { CartItem } from '@/types/shopify'

interface CartItem {
  id: string
  title: string
  price: {
    amount: number
    currencyCode: string
  }
  quantity: number
  videoUrl?: string
  thumbnail?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        console.log('Loaded cart from localStorage:', parsedCart)
        setItems(parsedCart)
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    console.log('Saving cart to localStorage:', items)
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (newItem: CartItem) => {
    console.log('Adding item to cart:', newItem)
    try {
      setItems(currentItems => {
        const existingItem = currentItems.find(item => item.id === newItem.id)
        
        if (existingItem) {
          console.log('Item already in cart, updating quantity')
          return currentItems.map(item =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          )
        }
        
        console.log('Adding new item to cart')
        return [...currentItems, newItem]
      })
    } catch (error) {
      console.error('Error adding item to cart:', error)
    }
  }
  
  const removeItem = (id: string) => {
    console.log('Removing item from cart:', id)
    setItems(currentItems => currentItems.filter(item => item.id !== id))
  }
  
  const updateQuantity = (id: string, quantity: number) => {
    console.log('Updating item quantity:', { id, quantity })
    if (quantity < 1) {
      removeItem(id)
      return
    }
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }
  
  const clearCart = () => {
    console.log('Clearing cart')
    setItems([])
  }
  
  const total = items.reduce(
    (sum, item) => sum + item.price.amount * item.quantity,
    0
  )

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}>
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
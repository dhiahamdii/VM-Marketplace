"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useAuth } from "../auth/auth-provider"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"

interface CartItem {
  product_id: number
  quantity: number
  price: number
}

interface Cart {
  id: number
  items: CartItem[]
  total_amount: number
}

interface CartContextType {
  cart: Cart | null
  loading: boolean
  addItem: (item: CartItem) => Promise<void>
  removeItem: (productId: number) => Promise<void>
  updateQuantity: (productId: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchCart()
    } else {
      setCart(null)
      setLoading(false)
    }
  }, [user])

  const fetchCart = async () => {
    try {
      const response = await axios.get("/api/payment-methods")
      setCart(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch cart",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addItem = async (item: CartItem) => {
    try {
      if (!cart) {
        // Create new cart
        const response = await axios.post("/api/payment-methods", {
          items: [item],
          total_amount: item.price * item.quantity,
        })
        setCart(response.data)
      } else {
        // Update existing cart
        const existingItem = cart.items.find((i) => i.product_id === item.product_id)
        let updatedItems: CartItem[]
        let totalAmount: number

        if (existingItem) {
          updatedItems = cart.items.map((i) =>
            i.product_id === item.product_id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          )
          totalAmount = updatedItems.reduce(
            (sum, i) => sum + i.price * i.quantity,
            0
          )
        } else {
          updatedItems = [...cart.items, item]
          totalAmount = cart.total_amount + item.price * item.quantity
        }

        const response = await axios.put("/api/payment-methods", {
          items: updatedItems,
          total_amount: totalAmount,
        })
        setCart(response.data)
      }

      toast({
        title: "Success",
        description: "Item added to cart",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    }
  }

  const removeItem = async (productId: number) => {
    try {
      if (!cart) return

      const updatedItems = cart.items.filter((i) => i.product_id !== productId)
      const totalAmount = updatedItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      )

      const response = await axios.put("/api/payment-methods", {
        items: updatedItems,
        total_amount: totalAmount,
      })
      setCart(response.data)

      toast({
        title: "Success",
        description: "Item removed from cart",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      })
    }
  }

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      if (!cart) return

      const updatedItems = cart.items.map((i) =>
        i.product_id === productId ? { ...i, quantity } : i
      )
      const totalAmount = updatedItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      )

      const response = await axios.put("/api/payment-methods", {
        items: updatedItems,
        total_amount: totalAmount,
      })
      setCart(response.data)

      toast({
        title: "Success",
        description: "Cart updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive",
      })
    }
  }

  const clearCart = async () => {
    try {
      await axios.delete("/api/payment-methods")
      setCart(null)
      toast({
        title: "Success",
        description: "Cart cleared",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      })
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
} 
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface CartItem {
  productId: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

// Initialize cart from localStorage
const INITIAL_CART: CartItem[] = (() => {
  try {
    const stored = typeof window !== "undefined" ? localStorage.getItem("cart") : null;
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
})();

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {
      // localStorage not available, ignore
    }
  }, [cart]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + parseFloat(item.price.replace("$", "")) * item.quantity,
    0
  );

  const addToCart = (product: { id: string; name: string; price: string; image: string }, quantity = 1) => {
    const existingIndex = cart.findIndex((item) => item.productId === product.id);

    if (existingIndex >= 0) {
      setCart(
        cart.map((item, index) =>
          index === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        },
      ]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  if (cart.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          Shopping Cart
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Your cart is empty
        </p>
        <a href="/products" className="mt-4 inline-block text-zinc-500 underline">
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 dark:bg-black min-h-screen">
      <nav className="border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Shopping Cart
          </h1>
          <span className="text-zinc-500 dark:text-zinc-400">
            {totalItems} items
          </span>
        </div>
      </nav>

      <main className="px-6 py-8 max-w-2xl mx-auto">
        <div className="space-y-6">
          {cart.map((item) => (
            <div key={item.productId} className="flex items-center gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-700 last:border-0">
              <Image
                src={item.image}
                alt={item.name}
                width={80}
                height={80}
                className="rounded-lg w-24 h-24 object-cover"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-zinc-900 dark:text-zinc-100 font-medium mb-1">
                  {item.name}
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-2">
                  {item.quantity} x {item.price}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.productId, 1)}
                  className="flex-1 bg-zinc-100 text-zinc-700 px-3 py-1 rounded text-xs font-medium hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
                >
                  +
                </button>
                <span className="mx-2 text-zinc-600 dark:text-zinc-400">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.productId, -1)}
                  className="flex-1 bg-zinc-100 text-zinc-700 px-3 py-1 rounded text-xs font-medium hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
                >
                  -
                </button>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="ml-2 text-zinc-400 text-xs underline underline-offset-2 hover:text-zinc-300 dark:hover:text-zinc-200 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-700">
            <div className="flex justify-between mb-4">
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                Total
              </span>
              <span className="text-zinc-900 dark:text-zinc-100 font-bold text-lg">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              className="w-full bg-zinc-600 text-white py-3 rounded-md font-medium text-lg hover:bg-zinc-500 dark:bg-zinc-600 dark:hover:bg-zinc-500 transition-colors mb-4"
            >
              Proceed to Checkout
            </button>

            <a
              href="/products"
              className="text-zinc-500 text-sm underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
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

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "Premium Wool Rug",
    description: "Handcrafted wool rug, 8x10 feet, natural beige. Made from 100% natural wool, this rug is soft, durable, and perfect for adding warmth to any room.",
    price: "$299.00",
    image: "https://placeholder.com/600/400/beige/6b4c/white?text=Rug",
  },
  {
    id: "2",
    name: "Modern Desk Lamp",
    description: "Minimalist LED desk lamp with adjustable brightness. Energy-efficient LED technology with 3-level dimming and a sleek metal base. Perfect for home offices and study rooms.",
    price: "$89.99",
    image: "https://placeholder.com/600/400/gray/354/white?text=Lamp",
  },
  {
    id: "3",
    name: "Leather Office Chair",
    description: "Ergonomic leather chair with lumbar support. Features adjustable armrests, height adjustment, and a 360-degree swivel. Padded seat and backrest for all-day comfort during long work sessions.",
    price: "$459.00",
    image: "https://placeholder.com/600/400/brown/8b5a/white?text=Chair",
  },
  {
    id: "4",
    name: "Wooden Bookshelf",
    description: "Solid oak bookshelf, 5-tier, 72\" tall. Sturdy construction with weight capacity of 50lbs per shelf. Natural wood finish that complements any decor. Easy assembly required.",
    price: "$379.00",
    image: "https://placeholder.com/600/400/natural/7a5/white?text=Bookshelf",
  },
];

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const productId = params.id || "1";
  const product = products.find((p) => p.id === productId);

  // Initialize cart from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = typeof window !== "undefined"
        ? localStorage.getItem("cart")
        : null;
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {
      // Ignore localStorage errors
    }
  }, [cart]);

  if (!product) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-zinc-600">
          The product with ID {productId} does not exist.
        </p>
        <a href="/" className="mt-4 inline-block text-zinc-500 underline">
          Back to Catalogue
        </a>
      </div>
    );
  }

  const addToCart = (qty = 1) => {
    const existingIndex = cart.findIndex((item) => item.productId === product.id);

    if (existingIndex >= 0) {
      setCart(
        cart.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + qty }
            : item
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
          quantity: qty,
        },
      ]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.productId !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
    } else {
      setCart(
        cart.map((item) =>
          item.productId === id ? { ...item, quantity: qty } : item
        )
      );
    }
  };

  return (
    <div className="bg-zinc-50 dark:bg-black min-h-screen">
      <nav className="border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Product Detail
          </h1>
          <a href="/"
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          >
            Back to Catalogue
          </a>
        </div>
      </nav>

      <main className="px-6 py-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <Image
              src={product.image}
              alt={product.name}
              width={600}
              height={400}
              className="rounded-lg w-full h-auto object-cover"
              loading="lazy"
            />
            <div className="mt-4 flex gap-2">
              <span
                className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400"
              >
                <span className="w-2 h-2 rounded-full bg-zinc-500"></span>
                <span className="w-2 h-2 rounded-full bg-zinc-500"></span>
                <span className="w-2 h-2 rounded-full bg-zinc-500"></span>
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-100">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold text-zinc-600 dark:text-zinc-400">
                {product.price}
              </span>
            </div>

            <p className="text-zinc-500 dark:text-zinc-400 text-line-clamp-4 line-clamp-line">
              {product.description}
            </p>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-zinc-500 dark:text-zinc-400">Quantity:</span>
                <span className="w-16 text-center">
                  <button
                    onClick={() => addToCart(1)}
                    className="flex-1 bg-zinc-100 text-zinc-700 px-2 py-1 rounded text-xs font-medium hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
                  >
                    +
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={1}
                    className="mt-1 block w-full border border-zinc-300 rounded px-2 py-1 text-center dark:bg-zinc-700 dark:text-white"
                  />
                  <button
                    onClick={() => addToCart(-1)}
                    className="ml-2 bg-zinc-100 text-zinc-700 px-2 py-1 rounded text-xs font-medium hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
                  >
                    -
                  </button>
                </span>
              </div>

              <button
                onClick={() => addToCart()}
                className="bg-zinc-600 text-white py-2 px-4 rounded-md font-medium text-lg hover:bg-zinc-500 dark:bg-zinc-600 dark:hover:bg-zinc-500 transition-colors"
              >
                Add to Cart
              </button>
            </div>

            <div className="pt-6 border-t border-zinc-200 dark:border-zinc-700">
              <h2 className="text-zinc-600 dark:text-zinc-400 mb-4">Product Specifications</h2>
              <ul className="space-y-3 text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start">
                  <span className="w-3 h-3 rounded-full bg-zinc-500 flex-shrink-0 mt-1"></span>
                  <div>
                    <strong>Material:</strong> {getMaterial(product.name)}
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-3 h-3 rounded-full bg-zinc-500 flex-shrink-0 mt-1"></span>
                  <div>
                    <strong>Dimensions:</strong> {getDimensions(product.name)}
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-3 h-3 rounded-full bg-zinc-500 flex-shrink-0 mt-1"></span>
                  <div>
                    <strong>Color:</strong> {getColor(product.name)}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function getMaterial(name: string) {
  if (name.includes("Rug")) return "100% Natural Wool";
  if (name.includes("Lamp")) return "Metal + Glass";
  if (name.includes("Chair")) return "Premium Leather + Steel";
  if (name.includes("Bookshelf")) return "Solid Oak";
  return "Unknown";
}

function getDimensions(name: string) {
  if (name.includes("Rug")) return "8' x 10' (240 x 300 cm)";
  if (name.includes("Lamp")) return "18\\\" H x 12\\\" W x 12\\\" D";
  if (name.includes("Chair")) return "24\\\" D x 26\\\" W x 34\\\" H";
  if (name.includes("Bookshelf")) return "72\\\" H x 12\\\" D x 30\\\" W";
  return "Unknown";
}

function getColor(name: string) {
  if (name.includes("Rug")) return "Beige";
  if (name.includes("Lamp")) return "Silver";
  if (name.includes("Chair")) return "Brown";
  if (name.includes("Bookshelf")) return "Natural Wood";
  return "Unknown";
}

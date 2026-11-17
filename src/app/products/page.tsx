import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  stock: number;
}

// Static products data - can be replaced with API data later
const products: Product[] = [
  {
    id: "1",
    name: "Premium Wool Rug",
    description: "Handcrafted wool rug, 8x10 feet, natural beige",
    price: "$299.00",
    image: "https://placeholder.com/400x300/beige/6b4c/white?text=Rug",
    stock: 25,
  },
  {
    id: "2",
    name: "Modern Desk Lamp",
    description: "Minimalist LED desk lamp with adjustable brightness",
    price: "$89.99",
    image: "https://placeholder.com/400x300/gray/354/white?text=Lamp",
    stock: 15,
  },
  {
    id: "3",
    name: "Leather Office Chair",
    description: "Ergonomic leather chair with lumbar support",
    price: "$459.00",
    image: "https://placeholder.com/400x300/brown/8b5a/white?text=Chair",
    stock: 10,
  },
  {
    id: "4",
    name: "Wooden Bookshelf",
    description: "Solid oak bookshelf, 5-tier, 72\" tall",
    price: "$379.00",
    image: "https://placeholder.com/400x300/natural/7a5/white?text=Bookshelf",
    stock: 8,
  },
];

export default function ProductsPage() {
  return (
    <div className="bg-zinc-50 dark:bg-black min-h-screen">
      <nav className="border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Inventory Management
          </h1>
          <span className="text-zinc-500 dark:text-zinc-400">
            {products.length} products
          </span>
        </div>
      </nav>

      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="w-full text-zinc-700 dark:text-zinc-300">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="text-left p-4 font-bold text-zinc-600 dark:text-zinc-400">
                    Name
                  </th>
                  <th className="text-left p-4 font-bold text-zinc-600 dark:text-zinc-400">
                    Description
                  </th>
                  <th className="text-center p-4 font-bold text-zinc-600 dark:text-zinc-400">
                    Price
                  </th>
                  <th className="text-center p-4 font-bold text-zinc-600 dark:text-zinc-400">
                    Stock
                  </th>
                  <th className="text-center p-4 font-bold text-zinc-600 dark:text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500 dark:text-zinc-400">
                      No products found.
                    </td>
                  </tr>
                )}
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                    <td className="p-4">{product.name}</td>
                    <td className="p-4 text-sm">{product.description}</td>
                    <td className="text-right p-4 font-medium">{product.price}</td>
                    <td className="text-center p-4">
                      <span className={product.stock <= 5 ? "text-red-600" : "text-zinc-600"}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="text-right p-4">
                      <div className="flex gap-2">
                        <a
                          href={`/product/${product.id}`}
                          className="text-zinc-500 underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-50 text-sm"
                        >
                          View
                        </a>
                        <span className="text-zinc-400 text-xs">|</span>
                        <a
                          href={`/product/delete/${product.id}`}
                          className="text-zinc-400 underline underline-offset-2 hover:text-zinc-300 dark:hover:text-zinc-200 text-xs"
                        >
                          Remove
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

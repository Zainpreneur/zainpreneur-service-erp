import { NextResponse } from "next/server";

// In-memory database (replace with real DB later)
const products = [
  {
    id: "1",
    name: "Premium Wool Rug",
    description: "Handcrafted wool rug, 8x10 feet, natural beige",
    price: "299.00",
    image: "https://placeholder.com/400x300/beige/6b4c/white?text=Rug",
    stock: 25,
  },
  {
    id: "2",
    name: "Modern Desk Lamp",
    description: "Minimalist LED desk lamp with adjustable brightness",
    price: "89.99",
    image: "https://placeholder.com/400x300/gray/354/white?text=Lamp",
    stock: 15,
  },
  {
    id: "3",
    name: "Leather Office Chair",
    description: "Ergonomic leather chair with lumbar support",
    price: "459.00",
    image: "https://placeholder.com/400x300/brown/8b5a/white?text=Chair",
    stock: 10,
  },
  {
    id: "4",
    name: "Wooden Bookshelf",
    description: "Solid oak bookshelf, 5-tier, 72\" tall",
    price: "379.00",
    image: "https://placeholder.com/400x300/natural/7a5/white?text=Bookshelf",
    stock: 8,
  },
];

export async function GET() {
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newProduct = {
    id: crypto.randomUUID(),
    name: body.name,
    description: body.description,
    price: body.price,
    image: body.image,
    stock: body.stock ?? 0,
    createdAt: new Date().toISOString(),
  };
  // In a real app, save to database
  return NextResponse.json(newProduct, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  // Update product logic
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  // Delete product logic
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  return NextResponse.json({ success: id ? true : false });
}

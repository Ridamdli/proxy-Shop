import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cartService } from "@/lib/cart";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const items = await cartService.getCartItems(userId);
    const total = await cartService.getCartTotal(userId);

    return NextResponse.json({
      items,
      ...total,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const { productId, quantity = 1, variantId } = await request.json();

    const item = await cartService.addToCart(
      productId,
      quantity,
      variantId,
      userId,
    );
    const total = await cartService.getCartTotal(userId);

    return NextResponse.json({
      item,
      ...total,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

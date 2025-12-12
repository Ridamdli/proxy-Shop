import { NextRequest, NextResponse } from "next/server";
import { cartService } from "@/lib/cart";

export async function PUT(
  request: NextRequest,
  { params }: { params: { itemId: string } },
) {
  try {
    const { quantity } = await request.json();
    const item = await cartService.updateCartItem(params.itemId, quantity);

    return NextResponse.json({ item });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } },
) {
  try {
    await cartService.removeFromCart(params.itemId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

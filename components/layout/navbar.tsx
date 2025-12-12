"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { CartIconBadge } from "@/components/cart/cart-icon-badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            Store
          </Link>

          {/* Mobile menu button */}
          <button
            className="lg:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Shop
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-gray-700 hover:text-gray-900 transition-colors">
                Categories
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/shop?category=electronics">Electronics</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/shop?category=clothing">Clothing</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/shop?category=accessories">Accessories</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/about"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Contact
            </Link>

            <CartIconBadge />

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src={session.user?.image || undefined} />
                    <AvatarFallback>
                      {session.user?.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button onClick={() => signOut()}>Logout</button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => signIn()}>
                  Sign In
                </Button>
                <Button onClick={() => signIn()}>Sign Up</Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="space-y-4 pb-4">
              <Link
                href="/"
                className="block text-gray-700 hover:text-gray-900 transition-colors"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="block text-gray-700 hover:text-gray-900 transition-colors"
                onClick={toggleMenu}
              >
                Shop
              </Link>
              <div className="space-y-2">
                <p className="text-gray-700">Categories</p>
                <Link
                  href="/shop?category=electronics"
                  className="block pl-4 text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={toggleMenu}
                >
                  Electronics
                </Link>
                <Link
                  href="/shop?category=clothing"
                  className="block pl-4 text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={toggleMenu}
                >
                  Clothing
                </Link>
                <Link
                  href="/shop?category=accessories"
                  className="block pl-4 text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={toggleMenu}
                >
                  Accessories
                </Link>
              </div>
              <Link
                href="/about"
                className="block text-gray-700 hover:text-gray-900 transition-colors"
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block text-gray-700 hover:text-gray-900 transition-colors"
                onClick={toggleMenu}
              >
                Contact
              </Link>

              <div className="py-2">
                <CartIconBadge />
              </div>

              {session ? (
                <div className="space-y-2">
                  <Link
                    href="/profile"
                    className="block text-gray-700 hover:text-gray-900 transition-colors"
                    onClick={toggleMenu}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="block text-gray-700 hover:text-gray-900 transition-colors"
                    onClick={toggleMenu}
                  >
                    Orders
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      toggleMenu();
                    }}
                    className="block text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      signIn();
                      toggleMenu();
                    }}
                    className="w-full"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => {
                      signIn();
                      toggleMenu();
                    }}
                    className="w-full"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

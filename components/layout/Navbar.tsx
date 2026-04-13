"use client"

import { useCart } from '@/contexts/CartContext';
import { signOut, useSession } from '@/lib/auth-client/auth-client';
import Link from 'next/link'
import React, { useState } from 'react'
import { FiMenu, FiShoppingCart, FiUser, FiX } from 'react-icons/fi';
import CartDrawer from './CartDrawer';

const Navbar = () => {

  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items } = useCart();

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-primary">
              HerboSpot
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <Link href="/products" className="hover:text-primary transition">
                Products
              </Link>
              <Link href="/orders" className="hover:text-primary transition">
                My Orders
              </Link>
              {/* Admin link removed - role property not available in session */}
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
              >
                <FiShoppingCart size={24} />
                {cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {session?.user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full transition">
                    <FiUser size={24} />
                    <span className="hidden md:inline">{session.user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="btn-primary px-4 py-2 text-sm"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 hover:bg-gray-100 rounded-full"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t">
              <div className="flex flex-col space-y-3">
                <Link
                  href="/products"
                  className="hover:text-primary transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  href="/orders"
                  className="hover:text-primary transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
                {/* Admin link removed - role property not available in session */}
              </div>
            </div>
          )}
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}

export default Navbar
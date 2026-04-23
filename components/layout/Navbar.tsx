"use client"

import { useCart } from '@/contexts/CartContext';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FiGrid, FiHeart, FiHome, FiLogOut, FiMenu, FiPackage, FiSearch, FiSettings, FiShoppingCart, FiUser, FiX } from 'react-icons/fi';
import CartDrawer from './CartDrawer';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession, signIn, signUp } from '@/lib/auth-client/auth-client';
import Image from 'next/image';
import { PiPlantBold } from "react-icons/pi";

const Navbar = () => {

  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const { totalItems } = useCart();

  const session = useSession();
  const isAuthenticated = !!session;
  const user = session?.data?.user;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: FiHome },
    { href: '/products', label: 'Shop', icon: FiGrid },
    { href: '/orders', label: 'Orders', icon: FiPackage },
  ];

  const adminLinks = [
    { href: '/admin/products', label: 'Manage Products', icon: FiGrid },
    { href: '/admin/orders', label: 'Manage Orders', icon: FiPackage },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
        }`}>
        <div className="container-custom">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center gap-2 text-2xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                <PiPlantBold color='green' />
                HerboSpot
              </div>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </form>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 transition ${isActive ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary'
                      }`}
                  >
                    <link.icon size={18} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition relative"
                aria-label="Shopping cart"
              >
                <FiShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded-full transition"
                    aria-label="User menu"
                  >
                    {user?.image ? (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden">
                        <Image
                          src={user.image}
                          alt={user.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-linear-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border z-50 animate-fade-in">
                      <div className="p-4 border-b">
                        <p className="font-semibold text-gray-800">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FiUser size={18} />
                          Profile
                        </Link>
                        <Link
                          href="/orders"
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FiPackage size={18} />
                          My Orders
                        </Link>
                        <Link
                          href="/wishlist"
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FiHeart size={18} />
                          Wishlist
                        </Link>
                        {isAdmin && (
                          <>
                            <div className="border-t my-2"></div>
                            {adminLinks.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                                onClick={() => setIsUserMenuOpen(false)}
                              >
                                <FiSettings size={18} />
                                {link.label}
                              </Link>
                            ))}
                          </>
                        )}
                        <div className="border-t my-2"></div>
                        <button
                          onClick={() => {
                            signOut();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition"
                        >
                          <FiLogOut size={18} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
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
                aria-label="Menu"
              >
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </form>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg animate-slide-down">
            <div className="container-custom py-4">
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <link.icon size={20} />
                      {link.label}
                    </Link>
                  );
                })}

                {isAdmin && (
                  <>
                    <div className="border-t my-2"></div>
                    <p className="px-4 text-xs font-semibold text-gray-500 uppercase">Admin</p>
                    {adminLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiSettings size={20} />
                        {link.label}
                      </Link>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from going under navbar */}
      <div className="h-16"></div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}

export default Navbar
'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiHeart } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useSession } from '@/lib/auth-client/auth-client';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, totalAmount, totalItems, updateQuantity, removeItem, isLoading } = useCart();
    const { data: session } = useSession();
    const isAuthenticated = !!session;
    const drawerRef = useRef<HTMLDivElement>(null);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Handle escape key
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [isOpen, onClose]);

    const handleQuantityChange = (productId: string, currentQuantity: number, delta: number) => {
        const newQuantity = currentQuantity + delta;
        if (newQuantity >= 1) {
            updateQuantity(productId, newQuantity);
        }
    };

    const getFreeShippingProgress = () => {
        const freeShippingThreshold = 5000;
        const progress = Math.min((totalAmount / freeShippingThreshold) * 100, 100);
        const remaining = freeShippingThreshold - totalAmount;
        return { progress, remaining, threshold: freeShippingThreshold };
    };

    const shippingProgress = getFreeShippingProgress();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 bg-opacity-50 z-50"
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        ref={drawerRef}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b bg-linear-to-r from-primary to-secondary text-white">
                            <div className="flex items-center gap-2">
                                <FiShoppingBag size={24} />
                                <h2 className="text-xl font-semibold">Your Cart</h2>
                                {totalItems > 0 && (
                                    <span className="bg-white text-primary px-2 py-1 rounded-full text-sm font-bold ml-2">
                                        {totalItems}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                aria-label="Close cart"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        {/* Free Shipping Progress Bar */}
                        {totalAmount > 0 && totalAmount < shippingProgress.threshold && (
                            <div className="p-4 bg-blue-50 border-b">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-blue-800">🎁 Free Shipping</span>
                                    <span className="text-blue-800 font-semibold">
                                        Add Rs. {shippingProgress.remaining.toLocaleString()} more
                                    </span>
                                </div>
                                <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${shippingProgress.progress}%` }}
                                        transition={{ duration: 0.5 }}
                                        className="bg-primary h-full rounded-full"
                                    />
                                </div>
                                <p className="text-xs text-blue-600 mt-2">
                                    Spend Rs. {shippingProgress.threshold.toLocaleString()} to get free shipping!
                                </p>
                            </div>
                        )}

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                                        <p className="text-gray-500">Loading cart...</p>
                                    </div>
                                </div>
                            ) : items.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center justify-center h-full text-center"
                                >
                                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <FiShoppingBag size={48} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        Your cart is empty
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        Looks like you haven't added any items yet
                                    </p>
                                    <button
                                        onClick={onClose}
                                        className="btn-primary inline-flex items-center gap-2"
                                    >
                                        Continue Shopping
                                    </button>
                                </motion.div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item, index) => (
                                        <motion.div
                                            key={item.productId}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex gap-4 bg-white border rounded-lg p-3 hover:shadow-md transition-shadow"
                                        >
                                            {/* Product Image */}
                                            <Link
                                                href={`/products/${item.productId}`}
                                                onClick={onClose}
                                                className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
                                            >
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover hover:scale-110 transition duration-300"
                                                    sizes="80px"
                                                />
                                            </Link>

                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={`/products/${item.productId}`}
                                                    onClick={onClose}
                                                    className="font-semibold text-gray-800 hover:text-primary transition line-clamp-2"
                                                >
                                                    {item.name}
                                                </Link>

                                                <div className="mt-1">
                                                    <span className="text-primary font-bold">
                                                        Rs. {item.price.toLocaleString()}
                                                    </span>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2 mt-2">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.productId, item.quantity, -1)}
                                                        className="p-1 border rounded hover:bg-gray-100 transition disabled:opacity-50"
                                                        disabled={item.quantity <= 1}
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <FiMinus size={14} />
                                                    </button>
                                                    <span className="w-8 text-center font-medium text-sm">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.productId, item.quantity, 1)}
                                                        className="p-1 border rounded hover:bg-gray-100 transition"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <FiPlus size={14} />
                                                    </button>

                                                    <button
                                                        onClick={() => removeItem(item.productId)}
                                                        className="ml-auto p-1 text-red-500 hover:bg-red-50 rounded transition"
                                                        aria-label="Remove item"
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Item Total */}
                                            <div className="text-right">
                                                <div className="font-semibold text-gray-800">
                                                    Rs. {(item.price * item.quantity).toLocaleString()}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {item.quantity} item(s)
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="border-t bg-gray-50 p-4 space-y-4"
                            >
                                {/* Wishlist Suggestion */}
                                <div className="flex items-center justify-between text-sm">
                                    <button className="flex items-center gap-2 text-primary hover:text-primary/90 transition">
                                        <FiHeart size={16} />
                                        <span>Move to Wishlist</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm('Are you sure you want to clear your cart?')) {
                                                useCart().clearCart();
                                            }
                                        }}
                                        className="text-red-500 hover:text-red-600 transition text-sm"
                                    >
                                        Clear Cart
                                    </button>
                                </div>

                                {/* Order Summary */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">Rs. {totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Shipping</span>
                                        {totalAmount >= 5000 ? (
                                            <span className="text-green-600 font-medium">Free</span>
                                        ) : (
                                            <span className="text-gray-600">Calculated at checkout</span>
                                        )}
                                    </div>
                                    <div className="border-t pt-2 mt-2">
                                        <div className="flex justify-between font-bold text-lg">
                                            <span>Total</span>
                                            <span className="text-primary">Rs. {totalAmount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    {!isAuthenticated && (
                                        <div className="bg-yellow-50 p-3 rounded-lg">
                                            <p className="text-sm text-yellow-800">
                                                🔐 Sign in to save your cart and checkout faster
                                            </p>
                                        </div>
                                    )}

                                    <Link
                                        href="/cart"
                                        onClick={onClose}
                                        className="w-full border-2 border-primary text-primary py-3 rounded-lg font-semibold text-center hover:bg-primary hover:text-white transition block"
                                    >
                                        View Cart
                                    </Link>

                                    <Link
                                        href={isAuthenticated ? "/checkout" : "/login"}
                                        onClick={onClose}
                                        className="w-full btn-primary py-3 text-center block"
                                    >
                                        {isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"}
                                    </Link>

                                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                        <FiShield size={14} />
                                        <span>Secure payment with eSewa</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Helper icon component
const FiShield = ({ size = 14, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);
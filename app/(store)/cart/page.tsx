'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { useSession } from '@/lib/auth-client/auth-client';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
    const { items, totalAmount, updateQuantity, removeItem, clearCart } = useCart();
    const { data: session } = useSession();

    if (items.length === 0) {
        return (
            <div className="container-custom py-16 text-center">
                <div className="max-w-md mx-auto">
                    <FiShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                    <p className="text-gray-600 mb-8">
                        Looks like you haven't added any items to your cart yet.
                    </p>
                    <Link href="/products" className="btn-primary inline-block">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container-custom py-8">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50 p-4 font-semibold">
                            <div className="col-span-6">Product</div>
                            <div className="col-span-2 text-center">Price</div>
                            <div className="col-span-2 text-center">Quantity</div>
                            <div className="col-span-2 text-center">Total</div>
                        </div>

                        <div className="divide-y">
                            {items.map((item) => (
                                <div key={item.productId} className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                        {/* Product Info */}
                                        <div className="md:col-span-6 flex gap-4">
                                            <div className="relative w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{item.name}</h3>
                                                <button
                                                    onClick={() => removeItem(item.productId)}
                                                    className="text-red-500 text-sm hover:text-red-600 mt-2 flex items-center gap-1"
                                                >
                                                    <FiTrash2 size={14} />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="md:col-span-2 text-center">
                                            <span className="md:hidden font-semibold mr-2">Price:</span>
                                            Rs. {item.price.toLocaleString()}
                                        </div>

                                        {/* Quantity */}
                                        <div className="md:col-span-2">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                    className="p-1 border rounded hover:bg-gray-100"
                                                >
                                                    <FiMinus size={14} />
                                                </button>
                                                <span className="w-12 text-center font-semibold">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                    className="p-1 border rounded hover:bg-gray-100"
                                                >
                                                    <FiPlus size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Total */}
                                        <div className="md:col-span-2 text-center font-semibold">
                                            <span className="md:hidden font-semibold mr-2">Total:</span>
                                            Rs. {(item.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-gray-50">
                            <button
                                onClick={clearCart}
                                className="text-red-500 hover:text-red-600 flex items-center gap-2"
                            >
                                <FiTrash2 size={18} />
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>Rs. {totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="border-t pt-3 mt-3">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-primary">Rs. {totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {!session ? (
                            <div className="space-y-3">
                                <p className="text-sm text-gray-600 text-center">
                                    Please login to proceed with checkout
                                </p>
                                <Link href="/login" className="btn-primary w-full text-center block">
                                    Login to Checkout
                                </Link>
                            </div>
                        ) : (
                            <Link href="/checkout" className="btn-primary w-full text-center block">
                                Proceed to Checkout
                            </Link>
                        )}

                        <div className="mt-4 text-center text-sm text-gray-500">
                            <p>Secure payment with eSewa</p>
                            <p className="mt-1">100% secure checkout</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
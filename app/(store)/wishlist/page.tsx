'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiShoppingCart, FiTrash2, FiEye, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useSession } from '@/lib/auth-client/auth-client';
import { useCart } from '@/contexts/CartContext';

interface WishlistItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    image: string;
    category: string;
    stock: number;
    addedAt: string;
}

export default function WishlistPage() {

    const { data: session } = useSession();
    const router = useRouter();
    const { addItem } = useCart();
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState<string | null>(null);

    useEffect(() => {
        if (!session) {
            router.push('/login');
            return;
        }
        fetchWishlist();
    }, [session, router]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/wishlist');
            const data = await response.json()
            setWishlistItems(data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            toast.error('Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromWishlist = async (productId: string) => {
        setRemovingId(productId);
        try {
            await fetch(`/api/wishlist?productId=${productId}`, {
                method: 'DELETE',
            });
            setWishlistItems(prev => prev.filter(item => item.productId !== productId));
            toast.success('Removed from wishlist');
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            toast.error('Failed to remove item');
        } finally {
            setRemovingId(null);
        }
    };

    const handleMoveToCart = async (item: WishlistItem) => {
        if (item.stock === 0) {
            toast.error('Out of stock');
            return;
        }

        try {
            await addItem({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: 1,
                image: item.image,
            });

            // Optionally remove from wishlist after adding to cart
            // await handleRemoveFromWishlist(item.productId);

            toast.success(`Added ${item.name} to cart`);
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add to cart');
        }
    };

    const handleAddAllToCart = async () => {
        let successCount = 0;
        for (const item of wishlistItems) {
            if (item.stock > 0) {
                try {
                    await addItem({
                        productId: item.productId,
                        name: item.name,
                        price: item.price,
                        quantity: 1,
                        image: item.image,
                    });
                    successCount++;
                } catch (error) {
                    console.error(`Error adding ${item.name}:`, error);
                }
            }
        }

        if (successCount > 0) {
            toast.success(`Added ${successCount} items to cart`);
        } else {
            toast.error('No items could be added to cart');
        }
    };

    const clearAllWishlist = async () => {
        if (confirm('Are you sure you want to clear your entire wishlist?')) {
            try {
                await fetch('/api/wishlist', {
                    method: 'DELETE',
                });
                setWishlistItems([]);
                toast.success('Wishlist cleared');
            } catch (error) {
                console.error('Error clearing wishlist:', error);
                toast.error('Failed to clear wishlist');
            }
        }
    };

    if (loading) {
        return (
            <div className="container-custom py-8">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-gray-600">Loading your wishlist...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-custom py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <FiHeart className="text-red-500" />
                        My Wishlist
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                    </p>
                </div>

                {wishlistItems.length > 0 && (
                    <div className="flex gap-3">
                        <button
                            onClick={handleAddAllToCart}
                            className="btn-primary flex items-center gap-2"
                        >
                            <FiShoppingCart size={18} />
                            Add All to Cart
                        </button>
                        <button
                            onClick={clearAllWishlist}
                            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition flex items-center gap-2"
                        >
                            <FiTrash2 size={18} />
                            Clear All
                        </button>
                    </div>
                )}
            </div>

            {wishlistItems.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiHeart size={48} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
                    <p className="text-gray-600 mb-6">
                        Save your favorite items here for easy access later
                    </p>
                    <Link href="/products" className="btn-primary inline-block">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <>
                    {/* Wishlist Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlistItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 group relative"
                            >
                                {/* Product Image */}
                                <Link href={`/products/${item.productId}`}>
                                    <div className="relative h-64 bg-gray-100 overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition duration-500"
                                        />
                                        {item.stock === 0 && (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                <span className="text-white font-semibold px-3 py-1 bg-red-500 rounded-full">
                                                    Out of Stock
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </Link>

                                {/* Quick Actions Overlay */}
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleMoveToCart(item)}
                                        disabled={item.stock === 0}
                                        className="p-2 bg-white rounded-full shadow-md hover:bg-primary hover:text-white transition disabled:opacity-50"
                                        title="Add to Cart"
                                    >
                                        <FiShoppingCart size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleRemoveFromWishlist(item.productId)}
                                        disabled={removingId === item.productId}
                                        className="p-2 bg-white rounded-full shadow-md hover:bg-red-500 hover:text-white transition"
                                        title="Remove from Wishlist"
                                    >
                                        {removingId === item.productId ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                                        ) : (
                                            <FiX size={18} />
                                        )}
                                    </button>
                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    <Link href={`/products/${item.productId}`}>
                                        <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition">
                                            {item.name}
                                        </h3>
                                    </Link>

                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {item.category}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <span className="text-primary font-bold text-xl">
                                                Rs. {item.price.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleMoveToCart(item)}
                                            disabled={item.stock === 0}
                                            className="flex-1 btn-primary py-2 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <FiShoppingCart size={16} />
                                            {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                        </button>
                                        <Link
                                            href={`/products/${item.productId}`}
                                            className="px-3 py-2 border border-gray-300 rounded-lg hover:border-primary hover:text-primary transition flex items-center gap-1"
                                        >
                                            <FiEye size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recommended Products Section */}
                    <div className="mt-12 pt-8 border-t">
                        <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* You can add recommended products here based on wishlist items */}
                            <div className="text-center text-gray-500 py-8 col-span-full">
                                <p>Recommended products will appear here based on your wishlist</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
import { Product } from '@/interfaces';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { FiEye, FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';

interface ProductCardProps {
    product: Product;
    viewMode?: 'grid' | 'list';
}

const ProductCard = ({ product, viewMode }: ProductCardProps) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (product.stock === 0) {
            toast.error('Out of stock');
            return;
        }

    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
        toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    };

    const calculateDiscount = () => {
        const hasDiscount = product.category === 'herbs' && product.price > 30;
        if (hasDiscount) {
            const discount = 30;
            const originalPrice = product.price;
            const discountedPrice = originalPrice * (1 - discount / 100);
            return { hasDiscount: true, discount, originalPrice, discountedPrice };
        }
        return { hasDiscount: false };
    };

    const discountInfo = calculateDiscount();
    const rating = 4.5; // In real app, fetch from API
    const reviewCount = Math.floor(Math.random() * 100) + 20;

    if (viewMode === 'list') {
        return (
            <Link href={`/products/${product.id}`}>
                <div
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="flex flex-col md:flex-row">
                        {/* Image Section */}
                        <div className="relative md:w-64 h-64 md:h-auto bg-gray-100">
                            {product.images[0] ? (
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition duration-500"
                                    sizes="(max-width: 768px) 100vw, 256px"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    No image
                                </div>
                            )}
                            {product.stock === 0 && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                    <span className="text-white font-semibold px-3 py-1 bg-red-500 rounded-full">Out of Stock</span>
                                </div>
                            )}
                            {discountInfo.hasDiscount && product.stock > 0 && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold z-10">
                                    -{discountInfo.discount}%
                                </div>
                            )}
                            <button
                                onClick={handleWishlist}
                                className={`absolute top-4 right-4 p-2 rounded-full bg-white shadow-md transition z-10 ${isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                                    }`}
                            >
                                <FiHeart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                            </button>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 p-6">
                            <div className="flex flex-col h-full">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                                            {product.category}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <FiStar
                                                        key={i}
                                                        size={14}
                                                        fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
                                                        className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-500">({reviewCount})</span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-primary transition line-clamp-2">
                                        {product.name}
                                    </h3>

                                    <p className="text-gray-600 mb-4 line-clamp-2">
                                        {product.description}
                                    </p>
                                </div>

                                <div className="mt-auto">
                                    <div className="flex items-baseline gap-2 mb-4">
                                        {discountInfo.hasDiscount ? (
                                            <>
                                                <span className="text-2xl font-bold text-primary">
                                                    Rs. {Math.round(Number(discountInfo.discountedPrice)).toLocaleString()}
                                                </span>
                                                <span className="text-lg text-gray-400 line-through">
                                                    Rs. {product.price.toLocaleString()}
                                                </span>
                                                <span className="text-sm text-green-600 font-semibold">
                                                    Save Rs. {Math.round(product.price - Number(discountInfo.discountedPrice)).toLocaleString()}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-2xl font-bold text-primary">
                                                Rs. {product.price.toLocaleString()}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={product.stock === 0}
                                            className="flex-1 btn-primary flex items-center justify-center gap-2 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FiShoppingCart size={18} />
                                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                        </button>
                                        <Link
                                            href={`/products/${product.id}`}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:border-primary hover:text-primary transition flex items-center gap-2"
                                        >
                                            <FiEye size={18} />
                                            View
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    // Grid View
    return (
        <Link href={`/products/${product.id}`}>
            <div
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 group h-full flex flex-col"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Container */}
                <div className="relative h-64 bg-gray-100 overflow-hidden">
                    {product.images[0] ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            No image
                        </div>
                    )}

                    {/* Badges */}
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                            <span className="text-white font-semibold px-3 py-1 bg-red-500 rounded-full">Out of Stock</span>
                        </div>
                    )}

                    {discountInfo.hasDiscount && product.stock > 0 && (
                        <div className="absolute top-4 left-4 bg-linear-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-md text-sm font-bold z-10 shadow-lg">
                            -{discountInfo.discount}%
                        </div>
                    )}

                    {product.stock > 0 && product.stock < 10 && (
                        <div className="absolute top-4 right-4 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-semibold z-10">
                            Only {product.stock} left
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className={`absolute bottom-4 left-0 right-0 flex justify-center gap-2 transition-all duration-300 z-10 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                        }`}>
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FiShoppingCart size={16} />
                            Add to Cart
                        </button>
                        <button
                            onClick={handleWishlist}
                            className={`bg-white p-2 rounded-lg transition shadow-md ${isWishlisted ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                                }`}
                        >
                            <FiHeart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                            {product.category}
                        </span>
                        <div className="flex items-center gap-1">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <FiStar
                                        key={i}
                                        size={12}
                                        fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
                                        className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-gray-500">({reviewCount})</span>
                        </div>
                    </div>

                    <h3 className="font-semibold text-lg mb-2 text-gray-800 group-hover:text-primary transition line-clamp-2">
                        {product.name}
                    </h3>

                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                        {product.description}
                    </p>

                    <div className="mt-auto">
                        <div className="flex items-baseline gap-2 mb-2">
                            {discountInfo.hasDiscount ? (
                                <>
                                    <span className="text-xl font-bold text-primary">
                                        Rs. {Math.round(Number(discountInfo.discountedPrice)).toLocaleString()}
                                    </span>
                                    <span className="text-sm text-gray-400 line-through">
                                        Rs. {product.price.toLocaleString()}
                                    </span>
                                </>
                            ) : (
                                <span className="text-xl font-bold text-primary">
                                    Rs. {product.price.toLocaleString()}
                                </span>
                            )}
                        </div>

                        {product.stock > 0 && (
                            <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                                <div
                                    className="bg-primary rounded-full h-1 transition-all duration-500"
                                    style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard
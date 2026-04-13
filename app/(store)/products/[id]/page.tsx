'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import toast from 'react-hot-toast';
import { FiMinus, FiPlus, FiShoppingCart, FiHeart } from 'react-icons/fi';
import ProductImageGallery from '@/components/products/ProductImageGallery';
import { useCart } from '@/contexts/CartContext';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    stock: number;
    featured: boolean;
}

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const { addItem } = useCart();

    useEffect(() => {
        fetchProduct();
    }, [params.id]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/products/${params.id}`);
            const productData = await response.json();
            setProduct(productData);
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Product not found');
            router.push('/products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        if (product.stock === 0) {
            toast.error('Out of stock');
            return;
        }

        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.images[0],
        });

    };

    if (loading) {
        return (
            <div className="container-custom py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <SkeletonLoader type="image" />
                    <div className="space-y-4">
                        <SkeletonLoader type="text" />
                        <SkeletonLoader type="text" />
                        <SkeletonLoader type="text" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container-custom py-8 text-center">
                <h2 className="text-2xl font-bold">Product not found</h2>
                <button onClick={() => router.push('/products')} className="btn-primary mt-4">
                    Back to Products
                </button>
            </div>
        );
    }

    return (
        <div className="container-custom py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Images */}
                <ProductImageGallery images={product.images} />

                {/* Product Info */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                        <p className="text-gray-600">{product.category}</p>
                    </div>

                    <div className="text-3xl font-bold text-primary">
                        Rs. {product.price.toLocaleString()}
                    </div>

                    <div className="border-t border-b py-4">
                        <p className="text-gray-700 leading-relaxed">{product.description}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="font-semibold">Quantity:</span>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-2 border rounded hover:bg-gray-100"
                                >
                                    <FiMinus size={16} />
                                </button>
                                <span className="w-12 text-center font-semibold">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="p-2 border rounded hover:bg-gray-100"
                                >
                                    <FiPlus size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="btn-primary flex-1 flex items-center justify-center gap-2"
                            >
                                <FiShoppingCart size={20} />
                                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                            <button className="p-3 border rounded-lg hover:bg-gray-50">
                                <FiHeart size={24} />
                            </button>
                        </div>

                        {product.stock > 0 && product.stock < 10 && (
                            <p className="text-orange-600 text-sm">
                                Only {product.stock} left in stock!
                            </p>
                        )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Product Details</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>✓ Free shipping on orders over Rs. 5000</li>
                            <li>✓ 7-day return policy</li>
                            <li>✓ Secure payment with eSewa</li>
                            <li>✓ 24/7 customer support</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
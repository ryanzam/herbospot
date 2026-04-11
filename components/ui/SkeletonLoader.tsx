'use client';

import { ReactNode } from 'react';

interface SkeletonLoaderProps {
    type?: 'product' | 'cart' | 'text' | 'image' | 'card' | 'order';
    count?: number;
    className?: string;
}

export default function SkeletonLoader({ type = 'product', count = 1, className = '' }: SkeletonLoaderProps) {
    const renderSkeleton = () => {
        switch (type) {
            case 'product':
                return (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                        <div className="h-64 bg-gray-200" />
                        <div className="p-4 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-1/4" />
                            <div className="h-6 bg-gray-200 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                            <div className="flex justify-between items-center pt-2">
                                <div className="h-8 bg-gray-200 rounded w-1/3" />
                                <div className="h-10 bg-gray-200 rounded w-1/2" />
                            </div>
                        </div>
                    </div>
                );

            case 'cart':
                return (
                    <div className="flex gap-4 animate-pulse">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg" />
                        <div className="flex-1 space-y-2">
                            <div className="h-5 bg-gray-200 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-1/4" />
                            <div className="h-10 bg-gray-200 rounded w-32" />
                        </div>
                        <div className="w-20 h-8 bg-gray-200 rounded" />
                    </div>
                );

            case 'text':
                return (
                    <div className={`space-y-2 ${className}`}>
                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
                    </div>
                );

            case 'image':
                return (
                    <div className={`bg-gray-200 animate-pulse rounded-lg ${className}`} />
                );

            case 'card':
                return (
                    <div className="bg-white rounded-lg shadow-md p-6 space-y-4 animate-pulse">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                                <div className="h-3 bg-gray-200 rounded w-1/3" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-5/6" />
                            <div className="h-4 bg-gray-200 rounded w-4/6" />
                        </div>
                    </div>
                );

            case 'order':
                return (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                        <div className="p-6 border-b bg-gray-50">
                            <div className="flex justify-between items-center">
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-32" />
                                    <div className="h-5 bg-gray-200 rounded w-48" />
                                </div>
                                <div className="h-8 bg-gray-200 rounded w-24" />
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-16 h-16 bg-gray-200 rounded" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                                    </div>
                                    <div className="w-20 h-6 bg-gray-200 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
                );
        }
    };

    if (count > 1) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: count }).map((_, index) => (
                    <div key={index}>{renderSkeleton()}</div>
                ))}
            </div>
        );
    }

    return renderSkeleton();
}

// Additional skeleton components for specific use cases
export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, i) => (
            <SkeletonLoader key={i} type="product" />
        ))}
    </div>
);

export const CartSkeleton = ({ count = 3 }: { count?: number }) => (
    <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
            <SkeletonLoader key={i} type="cart" />
        ))}
    </div>
);

export const OrderHistorySkeleton = ({ count = 2 }: { count?: number }) => (
    <div className="space-y-6">
        {Array.from({ length: count }).map((_, i) => (
            <SkeletonLoader key={i} type="order" />
        ))}
    </div>
);

export const ProductDetailSkeleton = () => (
    <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SkeletonLoader type="image" className="h-96" />
            <div className="space-y-6">
                <SkeletonLoader type="text" />
                <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
                <SkeletonLoader type="text" />
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
                <div className="h-24 bg-gray-200 rounded animate-pulse" />
            </div>
        </div>
    </div>
);

export const CheckoutSkeleton = () => (
    <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse" />
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i}>
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 animate-pulse" />
                            <div className="h-10 bg-gray-200 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <div className="h-64 bg-gray-200 rounded animate-pulse" />
            </div>
        </div>
    </div>
);

// Button skeleton
export const ButtonSkeleton = ({ className = '' }: { className?: string }) => (
    <div className={`h-10 bg-gray-200 rounded-lg animate-pulse ${className}`} />
);

// Avatar skeleton
export const AvatarSkeleton = ({ size = 'w-10 h-10' }: { size?: string }) => (
    <div className={`${size} bg-gray-200 rounded-full animate-pulse`} />
);

// Table row skeleton
export const TableRowSkeleton = ({ cols = 5 }: { cols?: number }) => (
    <div className="flex gap-4 p-4 animate-pulse">
        {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded flex-1" />
        ))}
    </div>
);

// Hero section skeleton
export const HeroSkeleton = () => (
    <div className="w-full h-[600px] bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
);
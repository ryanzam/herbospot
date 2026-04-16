'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiBox } from 'react-icons/fi';

import { FiXCircle } from 'react-icons/fi';
import { useSession } from '@/lib/auth-client/auth-client';
import { IconType } from 'react-icons';
import { OrderStatus, PaymentStatus } from '@prisma/client';

interface Order {
    id: string;
    totalAmount: number;
    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;
    createdAt: string;
    items: Array<{
        name: string;
        price: number;
        quantity: number;
        image: string;
    }>;
}

const statusIcons: Record<OrderStatus, IconType> = {
    [OrderStatus.PENDING]: FiClock,
    [OrderStatus.PROCESSING]: FiPackage,
    [OrderStatus.SHIPPED]: FiTruck,
    [OrderStatus.DELIVERED]: FiCheckCircle,
    [OrderStatus.CANCELLED]: FiXCircle,
};

const statusColors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'text-yellow-600 bg-yellow-50',
    [OrderStatus.PROCESSING]: 'text-blue-600 bg-blue-50',
    [OrderStatus.SHIPPED]: 'text-purple-600 bg-purple-50',
    [OrderStatus.DELIVERED]: 'text-green-600 bg-green-50',
    [OrderStatus.CANCELLED]: 'text-red-600 bg-red-50',
};

export default function OrdersPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session) {
            router.push('/login');
            return;
        }
        fetchOrders();
    }, [session]);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders');
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container-custom py-8">
                <div className="text-center">Loading orders...</div>
            </div>
        );
    }

    return (
        <div className="container-custom py-8">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <FiPackage className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
                    <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                    <Link href="/products" className="btn-primary inline-block">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => {
                        const StatusIcon = statusIcons[order.orderStatus];
                        return (
                            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="p-6 border-b bg-gray-50">
                                    <div className="flex flex-wrap justify-between items-center gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Order ID</p>
                                            <p className="font-mono text-sm">{order.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Date</p>
                                            <p className="font-semibold">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Total Amount</p>
                                            <p className="font-bold text-primary">
                                                Rs. {order.totalAmount.toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.orderStatus as keyof typeof statusColors]}`}>
                                                <StatusIcon size={14} />
                                                {order.orderStatus.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="space-y-4">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex gap-4">
                                                <div className="relative w-16 h-16 bg-gray-100 rounded">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover rounded"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold">{item.name}</h3>
                                                    <p className="text-sm text-gray-600">
                                                        Quantity: {item.quantity} × Rs. {item.price.toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">
                                                        Rs. {(item.price * item.quantity).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
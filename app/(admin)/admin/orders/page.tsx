'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface Order {
    id: string;
    totalAmount: number;
    orderStatus: string;
    paymentStatus: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
    items: Array<{
        name: string;
        price: number;
        quantity: number;
        image: string;
    }>;
    shippingAddress: {
        fullName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        postalCode: string;
    };
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders');
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, status: string) => {
        try {
            await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderStatus: status }),
            });
            toast.success('Order status updated');
            fetchOrders();
        } catch (error) {
            console.error('Error updating order:', error);
            toast.error('Failed to update order status');
        }
    };

    const getStatusColor = (status: string) => {
        const colors = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            PROCESSING: 'bg-blue-100 text-blue-800',
            SHIPPED: 'bg-purple-100 text-purple-800',
            DELIVERED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return <div className="text-center py-8">Loading orders...</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left">Order ID</th>
                                <th className="px-4 py-3 text-left">Customer</th>
                                <th className="px-4 py-3 text-right">Total</th>
                                <th className="px-4 py-3 text-center">Status</th>
                                <th className="px-4 py-3 text-center">Payment</th>
                                <th className="px-4 py-3 text-center">Date</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-mono text-sm">{order.id.slice(-8)}</td>
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="font-medium">{order.user.name}</p>
                                            <p className="text-sm text-gray-600">{order.user.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold">
                                        Rs. {order.totalAmount.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                                            {order.orderStatus.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.paymentStatus === 'completed'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {order.paymentStatus.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-sm">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="text-primary hover:text-primary/90 text-sm font-medium"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold">Order Details</h2>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold mb-2">Order Information</h3>
                                    <p className="text-sm">Order ID: {selectedOrder.id}</p>
                                    <p className="text-sm">Date: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                    <p className="text-sm">Total: Rs. {selectedOrder.totalAmount.toLocaleString()}</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">Customer Information</h3>
                                    <p className="text-sm">Name: {selectedOrder.user.name}</p>
                                    <p className="text-sm">Email: {selectedOrder.user.email}</p>
                                    <p className="text-sm">Phone: {selectedOrder.shippingAddress.phone}</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                                    <p className="text-sm">{selectedOrder.shippingAddress.address}</p>
                                    <p className="text-sm">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">Order Status</h3>
                                    <select
                                        value={selectedOrder.orderStatus}
                                        onChange={(e) => {
                                            updateOrderStatus(selectedOrder.id, e.target.value);
                                            setSelectedOrder(null);
                                        }}
                                        className="input-field"
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="PROCESSING">Processing</option>
                                        <option value="SHIPPED">Shipped</option>
                                        <option value="DELIVERED">Delivered</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">Items</h3>
                                    <div className="space-y-3">
                                        {selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex gap-4 border-b pb-3">
                                                <div className="relative w-16 h-16 bg-gray-100 rounded">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover rounded"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium">{item.name}</p>
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
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
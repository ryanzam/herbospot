'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useSession } from '@/lib/auth-client/auth-client';
import { useCart } from '@/contexts/CartContext';

export default function CheckoutPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const { items, totalAmount, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
    });

    useEffect(() => {
        if (!session) {
            router.push('/login');
        }
        if (items.length === 0) {
            router.push('/cart');
        }
        if (session?.user) {
            setFormData(prev => ({
                ...prev,
                fullName: session.user.name || '',
                email: session.user.email || '',
            }));
        }
    }, [session, items]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create order
            const orderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items,
                    totalAmount,
                    shippingAddress: formData,
                }),
            });

            const order = await orderResponse.json();

            // Initiate eSewa payment
            const paymentResponse = await fetch('/api/esewa/initiate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId: order.id,
                }),
            });

            const { esewaUrl, esewaData } = await paymentResponse.json();

            // Create and submit eSewa form
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = esewaUrl;

            Object.entries(esewaData).forEach(([key, value]) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value as string;
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('Failed to process checkout');
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const grandTotal = totalAmount < 5000 ? totalAmount + 100 : totalAmount;

    return (
        <div className="container-custom py-8">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Shipping Form */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Full Name *</label>
                            <input
                                type="text"
                                name="fullName"
                                required
                                value={formData.fullName}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Email *</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Phone Number *</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Address *</label>
                            <input
                                type="text"
                                name="address"
                                required
                                value={formData.address}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Postal Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3 cursor-pointer"
                        >
                            {loading ? 'Processing...' : 'Pay with eSewa'}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                    <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                        {items.map((item) => (
                            <div key={item.productId} className="flex gap-4">
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
                                        Quantity: {item.quantity}
                                    </p>
                                    <p className="text-primary font-semibold">
                                        Rs. {(item.price * item.quantity).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>Rs. {totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>{totalAmount < 5000 ? 'Rs. 100' : 'Free'}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                            <span>Total</span>
                            <span className="text-primary">Rs. {grandTotal.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded">
                        <p className="text-sm text-blue-800">
                            🔒 You will be redirected to eSewa secure payment gateway to complete your payment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
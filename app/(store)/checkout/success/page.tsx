'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle } from 'react-icons/fi';
import { useCart } from '@/contexts/CartContext';

export default function CheckoutSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { clearCart } = useCart();
    const [verifying, setVerifying] = useState(true);
    const [orderDetails, setOrderDetails] = useState<any>(null);

    useEffect(() => {
        const verifyPayment = async () => {
            const data = searchParams.get('data');
            const signature = searchParams.get('signature');
            const transaction_uuid = searchParams.get('transaction_uuid');

            if (!data || !signature || !transaction_uuid) {
                router.push('/');
                return;
            }

            try {
                const response = await fetch('/api/esewa/verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        data,
                        signature,
                        transaction_uuid,
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    setOrderDetails(result.order);
                    await clearCart();
                    setVerifying(false);
                } else {
                    router.push('/checkout/failure');
                }
            } catch (error) {
                console.error('Verification error:', error);
                router.push('/checkout/failure');
            }
        };

        verifyPayment();
    }, [searchParams, router, clearCart]);

    if (verifying) {
        return (
            <div className="container-custom py-16 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p>Verifying your payment...</p>
            </div>
        );
    }

    return (
        <div className="container-custom py-16">
            <div className="max-w-2xl mx-auto text-center">
                <FiCheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
                <p className="text-gray-600 mb-8">
                    Thank you for your order. Your payment has been confirmed and we'll start processing your order right away.
                </p>

                {orderDetails && (
                    <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                        <h2 className="font-semibold mb-3">Order Details</h2>
                        <p className="text-sm text-gray-600">Order ID: {orderDetails.id}</p>
                        <p className="text-sm text-gray-600">
                            Total Amount: Rs. {orderDetails.totalAmount.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                            eSewa Ref ID: {orderDetails.esewaRefId}
                        </p>
                    </div>
                )}

                <div className="space-x-4">
                    <Link href="/orders" className="btn-primary inline-block">
                        View My Orders
                    </Link>
                    <Link href="/products" className="btn-secondary inline-block">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
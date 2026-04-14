'use client';

import Link from 'next/link';
import { FiXCircle } from 'react-icons/fi';

export default function CheckoutFailurePage() {
    return (
        <div className="container-custom py-16">
            <div className="max-w-2xl mx-auto text-center">
                <FiXCircle className="w-24 h-24 text-red-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-4">Payment Failed</h1>
                <p className="text-gray-600 mb-8">
                    We're sorry, but your payment could not be processed. Please try again or contact support if the issue persists.
                </p>

                <div className="space-x-4">
                    <Link href="/cart" className="btn-primary inline-block">
                        Return to Cart
                    </Link>
                    <Link href="/products" className="btn-secondary inline-block">
                        Continue Shopping
                    </Link>
                </div>

                <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> If money was deducted from your account, please contact customer support within 24 hours with your transaction details.
                    </p>
                </div>
            </div>
        </div>
    );
}
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { FiPackage, FiShoppingBag, FiUsers, FiBarChart2 } from 'react-icons/fi';
import { useSession } from '@/lib/auth-client/auth-client';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            router.push('/login');
        } else if ((session.user as any).role !== 'admin') {
            router.push('/');
        }
    }, [session, router]);

    if (!session || (session.user as any).role !== 'admin') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-md min-h-screen fixed">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
                    </div>
                    <nav className="mt-6">
                        <Link
                            href="/admin/products"
                            className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition"
                        >
                            <FiPackage size={20} />
                            Products
                        </Link>
                        <Link
                            href="/admin/orders"
                            className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition"
                        >
                            <FiShoppingBag size={20} />
                            Orders
                        </Link>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 ml-64 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
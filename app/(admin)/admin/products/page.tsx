"use client";

import { Product } from '@/interfaces';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi'
import Image from 'next/image';

const AdminProductsPage = () => {

    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();
            setProducts(data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                toast.error('Failed to delete product');
                return;
            }
            toast.success('Product deleted successfully');
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product');
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase())
    );


    return (
        <div className='p-4'>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Products</h1>
                <Link
                    href="/admin/products/new"
                    className="btn-primary flex items-center gap-2"
                >
                    <FiPlus size={20} />
                    Add Product
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-field pl-10"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left">Image</th>
                                    <th className="px-4 py-3 text-left">Name</th>
                                    <th className="px-4 py-3 text-left">Category</th>
                                    <th className="px-4 py-3 text-right">Price</th>
                                    <th className="px-4 py-3 text-center">Stock</th>
                                    <th className="px-4 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="relative w-12 h-12 bg-gray-100 rounded">
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover rounded"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium">{product.name}</td>
                                        <td className="px-4 py-3">{product.category}</td>
                                        <td className="px-4 py-3 text-right">
                                            Rs. {product.price.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    href={`/admin/products/${product.id}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                >
                                                    <FiEdit2 size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminProductsPage
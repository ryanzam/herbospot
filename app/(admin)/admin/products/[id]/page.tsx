'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { FiUpload, FiX, FiSave, FiTrash2, FiArrowLeft } from 'react-icons/fi';

interface ProductFormData {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    featured: boolean;
}

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        description: '',
        price: 0,
        category: '',
        stock: 0,
        featured: false,
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Fetch product data
    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/products/${productId}`);
            const product = await response.json();

            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                stock: product.stock,
                featured: product.featured || false,
            });
            setImages(product.images || []);
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Failed to load product');
            router.push('/admin/products');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        if (images.length + files.length > 8) {
            toast.error('Maximum 8 images allowed');
            return;
        }

        setUploading(true);
        const uploadedImages: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                const result = await response.json();
                uploadedImages.push(result.data.url);
                toast.success(`Uploaded ${file.name}`);
            } catch (error) {
                console.error('Upload error:', error);
                toast.error(`Failed to upload ${file.name}`);
            }
        }

        setImages([...images, ...uploadedImages]);
        setUploading(false);
        e.target.value = '';
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (images.length === 0) {
            toast.error('Please upload at least one product image');
            return;
        }

        setSaving(true);

        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price as any),
                    stock: parseInt(formData.stock as any),
                    images,
                }),
            });
            if (!res.ok) {
                toast.error('Failed to update product');
                return;
            }
            toast.success('Product updated successfully');
            router.push('/admin/products');
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Failed to update product');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
            });
            if (!res.ok) {
                toast.error('Failed to delete product');
                return;
            }
            toast.success('Product deleted successfully');
            router.push('/admin/products');
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product');
        } finally {
            setSaving(false);
            setShowDeleteConfirm(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-gray-600">Loading product...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <FiArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold">Edit Product</h1>
                </div>
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
                >
                    <FiTrash2 size={18} />
                    Delete
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                {/* Product Name */}
                <div>
                    <label className="block text-sm font-medium mb-1">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        rows={5}
                        value={formData.description}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>

                {/* Price and Stock */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Price (Rs.)</label>
                        <input
                            type="number"
                            name="price"
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                        <input
                            type="number"
                            name="stock"
                            min="0"
                            value={formData.stock}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>
                </div>

                {/* Category and Featured */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="input-field"
                        >
                            <option value="">Select category</option>
                            <option value="herbs">Herbs</option>
                            <option value="spices">Spices</option>
                            <option value="aromatic">Aromatic</option>
                        </select>
                    </div>
                    <div className="flex items-center">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleChange}
                                className="w-4 h-4"
                            />
                            <span className="text-sm font-medium">Feature this product</span>
                        </label>
                    </div>
                </div>

                {/* Product Images */}
                <div>
                    <label className="block text-sm font-medium mb-2">Product Images</label>

                    {/* Image Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-4 gap-4 mb-4">
                            {images.map((image, index) => (
                                <div key={index} className="relative group">
                                    <div className="relative h-24 bg-gray-100 rounded">
                                        <Image
                                            src={image}
                                            alt={`Product ${index + 1}`}
                                            fill
                                            className="object-cover rounded"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <FiX size={14} />
                                    </button>
                                    {index === 0 && (
                                        <span className="absolute bottom-1 left-1 bg-primary text-white text-xs px-1 rounded">
                                            Main
                                        </span>
                                    )}
                                </div>
                            ))}
                            <label className="cursor-pointer">
                                <div className="h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center hover:border-primary transition">
                                    {uploading ? (
                                        <div className="text-sm text-gray-500">Uploading...</div>
                                    ) : (
                                        <div className="text-center">
                                            <FiUpload className="mx-auto text-gray-400" />
                                            <span className="text-xs text-gray-500">Upload</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={uploading}
                                />
                            </label>
                        </div>
                        <p className="text-xs text-gray-500">
                            Upload up to 8 images. First image will be used as thumbnail.
                        </p>
                    </div>
                </div>

                {/* Form Buttons */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving || uploading}
                        className="flex-1 btn-primary flex items-center justify-center gap-2"
                    >
                        {saving ? (
                            <>
                                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <FiSave size={18} />
                                Update Product
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h2 className="text-xl font-bold mb-4">Delete Product</h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{formData.name}"? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
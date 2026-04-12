'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { FiUpload, FiX } from 'react-icons/fi';

const NewProductPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        featured: false,
    });
    const [images, setImages] = useState<string[]>([]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setUploading(true);
        const uploadedImages: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                uploadedImages.push(data.url);
                toast.success(`Uploaded ${file.name}`);
            } catch (error) {
                console.error('Upload error:', error);
                toast.error(`Failed to upload ${file.name}`);
            }
        }

        setImages([...images, ...uploadedImages]);
        setUploading(false);
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (images.length === 0) {
            toast.error('Please upload at least one product image');
            return;
        }

        setLoading(true);

        try {
            await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    stock: parseInt(formData.stock),
                    images,
                })
            });
            toast.success('Product created successfully');
            router.push('/admin/products');
        } catch (error) {
            console.error('Error creating product:', error);
            toast.error('Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Product Name *</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description *</label>
                    <textarea
                        name="description"
                        required
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Price (Rs.) *</label>
                        <input
                            type="number"
                            name="price"
                            required
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Stock Quantity *</label>
                        <input
                            type="number"
                            name="stock"
                            required
                            min="0"
                            value={formData.stock}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Category *</label>
                        <select
                            name="category"
                            required
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

                <div>
                    <label className="block text-sm font-medium mb-2">Product Images *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <div className="grid grid-cols-4 gap-4 mb-4">
                            {images?.map((image, index) => (
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
                        <p className="text-xs text-gray-500 mt-2">
                            Upload up to 4 product images. First image will be used as thumbnail.
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="btn-primary flex-1"
                    >
                        {loading ? 'Creating...' : 'Create Product'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewProductPage;
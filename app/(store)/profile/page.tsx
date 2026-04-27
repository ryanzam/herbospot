'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    FiEdit2,
    FiCheck,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useSession } from '@/lib/auth-client/auth-client';

export default function ProfilePage() {
    const { data: session, } = useSession();
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
    });

    const isAuthenticated = session?.session

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (session?.user) {
            setFormData({
                name: session.user.name || '',
                email: session.user.email || '',
                phone: (session.user as any).phone || '',
                address: (session.user as any).address || '',
                city: (session.user as any).city || '',
                postalCode: (session.user as any).postalCode || '',
            });
        }

    }, [session, isAuthenticated, router]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData
                })
            })

            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!session) {
        return null;
    }

    return (
        <div className="container-custom py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                        {/* Profile Summary */}
                        <div className="text-center mb-6">
                            <div className="relative w-24 h-24 mx-auto mb-3">
                                {session.user?.image ? (
                                    <Image
                                        src={session.user.image}
                                        alt={session.user.name}
                                        fill
                                        className="rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-24 h-24 bg-linear-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto">
                                        <span className="text-4xl text-white font-bold">
                                            {session.user?.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <h2 className="text-xl font-semibold">{session.user?.name}</h2>
                            <p className="text-gray-500 text-sm">{session.user?.email}</p>
                        </div>

                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Profile Information</h2>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 text-primary hover:text-primary/90"
                                >
                                    <FiEdit2 size={18} />
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="input-field bg-gray-50"
                                        disabled
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="input-field"
                                        placeholder="+977 XXXXXXXXX"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Address</label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="input-field"
                                        placeholder="Street address"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">City</label>
                                        <input
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Postal Code</label>
                                        <input
                                            type="text"
                                            value={formData.postalCode}
                                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary flex items-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <FiCheck size={18} />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({
                                                name: session.user?.name || '',
                                                email: session.user?.email || '',
                                                phone: (session.user as any)?.phone || '',
                                                address: (session.user as any)?.address || '',
                                                city: (session.user as any)?.city || '',
                                                postalCode: (session.user as any)?.postalCode || '',
                                            });
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-500">Full Name</label>
                                        <p className="font-medium">{formData.name || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500">Email</label>
                                        <p className="font-medium">{formData.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500">Phone Number</label>
                                        <p className="font-medium">{formData.phone || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500">Address</label>
                                        <p className="font-medium">{formData.address || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500">City</label>
                                        <p className="font-medium">{formData.city || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500">Postal Code</label>
                                        <p className="font-medium">{formData.postalCode || 'Not set'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
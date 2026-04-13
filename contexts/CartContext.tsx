'use client';

import { useSession } from '@/lib/auth-client/auth-client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface CartContextType {
    items: CartItem[];
    totalAmount: number;
    totalItems: number;
    isLoading: boolean;
    addItem: (item: CartItem) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { data: session } = useSession();
    const isAuthenticated = !!session;

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    // Fetch cart from server when authenticated
    const fetchCart = async () => {
        if (!isAuthenticated) return;

        try {
            setIsLoading(true);
            const response = await fetch('/api/cart');
            const data = await response.json();
            setItems(data.items || []);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Load cart from localStorage for guests or fetch from server for authenticated users
    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            // Load from localStorage for guests
            const savedCart = localStorage.getItem('guestCart');
            if (savedCart) {
                try {
                    const parsedCart = JSON.parse(savedCart);
                    setItems(parsedCart);
                } catch (error) {
                    console.error('Failed to parse guest cart:', error);
                }
            }
        }
    }, [isAuthenticated]);

    // Save guest cart to localStorage whenever it changes
    useEffect(() => {
        if (!isAuthenticated && items.length > 0) {
            localStorage.setItem('guestCart', JSON.stringify(items));
        } else if (!isAuthenticated && items.length === 0) {
            localStorage.removeItem('guestCart');
        }
    }, [items, isAuthenticated]);

    // Sync guest cart to server after login
    useEffect(() => {
        const syncGuestCart = async () => {
            const guestCart = localStorage.getItem('guestCart');
            if (isAuthenticated && guestCart) {
                try {
                    const guestItems = JSON.parse(guestCart);
                    if (guestItems.length > 0) {
                        setIsLoading(true);
                        for (const item of guestItems) {
                            await fetch('/api/cart', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(item),
                            });
                        }
                        localStorage.removeItem('guestCart');
                        await fetchCart();
                        toast.success('Cart synced successfully');
                    }
                } catch (error) {
                    console.error('Failed to sync guest cart:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        syncGuestCart();
    }, [isAuthenticated]);

    const addItem = async (item: CartItem) => {
        setIsLoading(true);
        try {
            if (isAuthenticated) {
                await fetch('/api/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(item),
                });
                await fetchCart();
            } else {
                // Guest cart
                const existingItem = items.find(i => i.productId === item.productId);
                if (existingItem) {
                    setItems(items.map(i =>
                        i.productId === item.productId
                            ? { ...i, quantity: i.quantity + item.quantity }
                            : i
                    ));
                } else {
                    setItems([...items, item]);
                }
            }
            toast.success('Added to cart', {
                icon: '🛒',
                duration: 2000,
            });
        } catch (error) {
            toast.error('Failed to add to cart');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const removeItem = async (productId: string) => {
        setIsLoading(true);
        try {
            if (isAuthenticated) {
                await fetch(`/api/cart?productId=${productId}`, {
                    method: 'DELETE',
                });
                await fetchCart();
            } else {
                setItems(items.filter(i => i.productId !== productId));
            }
            toast.success('Removed from cart');
        } catch (error) {
            toast.error('Failed to remove item');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        if (quantity < 1) {
            await removeItem(productId);
            return;
        }

        setIsLoading(true);
        try {
            if (isAuthenticated) {
                await fetch('/api/cart', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ productId, quantity }),
                });
                await fetchCart();
            } else {
                setItems(items.map(i =>
                    i.productId === productId ? { ...i, quantity } : i
                ));
            }
        } catch (error) {
            toast.error('Failed to update quantity');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const clearCart = async () => {
        setIsLoading(true);
        try {
            if (isAuthenticated) {
                await fetch('/api/cart', {
                    method: 'DELETE',
                });
                await fetchCart();
            } else {
                setItems([]);
                localStorage.removeItem('guestCart');
            }
            toast.success('Cart cleared');
        } catch (error) {
            toast.error('Failed to clear cart');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <CartContext.Provider
            value={{
                items,
                totalAmount,
                totalItems,
                isLoading,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                fetchCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
import { OrderStatus } from "@/types";

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    stock: number;
    featured?: boolean;
    createdAt?: string;
}

export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface ShippingAddress {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
}

export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    shippingAddress: ShippingAddress;
    paymentStatus: 'pending' | 'completed' | 'failed';
    paymentMethod: 'esewa';
    orderStatus: OrderStatus;
    esewaRefId?: string;
    createdAt: string;
    updatedAt: string;
}
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
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { auth } from '@/lib/auth/better-auth';

// GET - Fetch user's cart
export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const cart = await prisma.cart.findUnique({
            where: { userId: session.user.id },
            include: {
                items: true,
            },
        });

        return NextResponse.json(cart || { items: [], totalAmount: 0 });
    } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST - Add item to cart
export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { productId, name, price, quantity, image } = await req.json();

        let cart = await prisma.cart.findUnique({
            where: { userId: session.user.id },
            include: { items: true },
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    userId: session.user.id,
                    totalAmount: 0,
                },
                include: { items: true },
            });
        }

        const existingItem = cart.items.find(item => item.productId === productId);

        if (existingItem) {
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: existingItem.quantity + quantity,
                },
            });
        } else {
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    name,
                    price,
                    quantity,
                    image,
                },
            });
        }

        // Update total amount
        const updatedCart = await prisma.cart.findUnique({
            where: { userId: session.user.id },
            include: { items: true },
        });

        const totalAmount = updatedCart!.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        await prisma.cart.update({
            where: { id: cart.id },
            data: { totalAmount },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error adding to cart:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT - Update cart item quantity
export async function PUT(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { productId, quantity } = await req.json();

        const cart = await prisma.cart.findUnique({
            where: { userId: session.user.id },
            include: { items: true },
        });

        if (!cart) {
            return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
        }

        const cartItem = cart.items.find(item => item.productId === productId);

        if (cartItem) {
            await prisma.cartItem.update({
                where: { id: cartItem.id },
                data: { quantity },
            });

            // Update total amount
            const updatedCart = await prisma.cart.findUnique({
                where: { userId: session.user.id },
                include: { items: true },
            });

            const totalAmount = updatedCart!.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            await prisma.cart.update({
                where: { id: cart.id },
                data: { totalAmount },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating cart:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE - Remove item from cart or clear cart
export async function DELETE(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const productId = searchParams.get('productId');

        const cart = await prisma.cart.findUnique({
            where: { userId: session.user.id },
            include: { items: true },
        });

        if (!cart) {
            return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
        }

        if (productId) {
            // Remove specific item
            await prisma.cartItem.deleteMany({
                where: {
                    cartId: cart.id,
                    productId,
                },
            });
        } else {
            // Clear entire cart
            await prisma.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
        }

        // Update total amount
        const updatedCart = await prisma.cart.findUnique({
            where: { userId: session.user.id },
            include: { items: true },
        });

        const totalAmount = updatedCart!.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        await prisma.cart.update({
            where: { id: cart.id },
            data: { totalAmount },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error removing from cart:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
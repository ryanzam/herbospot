import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { auth } from '@/lib/auth/better-auth';

// GET - Fetch user's orders
export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const isAdmin = (session.user as any).role === 'admin';
        const userId = isAdmin ? searchParams.get('userId') : session.user.id;

        const orders = await prisma.order.findMany({
            where: userId ? { userId } : undefined,
            include: {
                items: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST - Create new order
export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { items, totalAmount, shippingAddress } = await req.json();

        const order = await prisma.order.create({
            data: {
                userId: session.user.id,
                totalAmount,
                shippingAddress,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { auth } from '@/lib/auth/better-auth';

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const wishlist = await prisma.wishlist.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(wishlist);
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { productId, name, price, image, category } = body;

        // Check if already exists
        const existing = await prisma.wishlist.findFirst({
            where: {
                userId: session.user.id,
                productId,
            },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Item already in wishlist' },
                { status: 400 }
            );
        }

        const wishlistItem = await prisma.wishlist.create({
            data: {
                userId: session.user.id,
                productId,
                name,
                price,
                image,
                category,
            },
        });

        return NextResponse.json(wishlistItem, { status: 201 });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

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

        if (productId) {
            await prisma.wishlist.deleteMany({
                where: {
                    userId: session.user.id,
                    productId,
                },
            });
        } else {
            // Clear entire wishlist
            await prisma.wishlist.deleteMany({
                where: { userId: session.user.id },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
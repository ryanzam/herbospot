import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { auth } from '@/lib/auth/better-auth';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const sort = searchParams.get('sort');
        const maxPrice = searchParams.get('maxPrice');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const search = searchParams.get('search');

        let where: any = {};

        if (category && category !== 'all') {
            where.category = category;
        }

        if (maxPrice) {
            where.price = { lte: parseInt(maxPrice) };
        }

        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }

        let orderBy: any = { createdAt: 'desc' };

        if (sort === 'price-asc') {
            orderBy = { price: 'asc' };
        } else if (sort === 'price-desc') {
            orderBy = { price: 'desc' };
        } else if (sort === 'newest') {
            orderBy = { createdAt: 'desc' };
        }

        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                orderBy,
                skip,
                take: limit,
            }),
            prisma.product.count({ where }),
        ]);

        return NextResponse.json({
            products,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST - Create new product (Admin only)
export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        /* if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        } */

        const body = await req.json();
        const product = await prisma.product.create({
            data: {
                name: body.name,
                description: body.description,
                price: body.price,
                category: body.category,
                images: body.images,
                stock: body.stock,
                featured: body.featured || false,
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
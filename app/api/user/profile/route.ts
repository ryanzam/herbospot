import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { auth } from '@/lib/auth/better-auth';

// GET - Get user profile
export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                createdAt: true,
                phone: true,
                address: true,
                city: true,
                postalCode: true,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, phone, address, city, postalCode } = body;

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name,
                phone,
                address,
                city,
                postalCode,
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                phone: true,
                address: true,
                city: true,
                postalCode: true,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
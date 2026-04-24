import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import crypto from 'crypto';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { data, signature, transaction_uuid } = body;

        // Verify signature
        const secret = process.env.ESEWA_SECRET!;
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(data)
            .digest('base64');

        if (signature !== expectedSignature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        // Parse the data
        const decodedData = Buffer.from(data, 'base64').toString();
        const params = new URLSearchParams(decodedData);
        const status = params.get('status');
        const refId = params.get('ref_id');

        if (status !== 'COMPLETE') {
            return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
        }

        // Find order by transaction UUID
        const orders = await prisma.order.findMany({
            where: {
                paymentDetails: {
                    equals: {
                        transactionUUID: transaction_uuid,
                    },
                },
            },
        });

        const order = orders[0];

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Update order
        const updatedOrder = await prisma.order.update({
            where: { id: order.id },
            data: {
                paymentStatus: PaymentStatus.COMPLETED,
                orderStatus: OrderStatus.PROCESSING,
                esewaRefId: refId,
                paymentDetails: {
                    ...(order.paymentDetails as any),
                    verifiedAt: new Date(),
                    refId,
                },
            },
        });

        // Clear user's cart
        await prisma.cart.deleteMany({
            where: { userId: order.userId },
        });

        return NextResponse.json({ success: true, order: updatedOrder });
    } catch (error) {
        console.error('eSewa verification error:', error);
        return NextResponse.json(
            { error: 'Verification failed' },
            { status: 500 }
        );
    }
}
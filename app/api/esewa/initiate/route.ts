import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { auth } from '@/lib/auth/better-auth';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { orderId } = body;

        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (order.userId !== session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Generate eSewa signature
        const totalAmount = order.totalAmount;
        const transactionUUID = `${orderId}_${Date.now()}`;
        const productCode = process.env.ESEWA_PRODUCT_CODE!;
        const secret = process.env.ESEWA_SECRET!;

        const message = `total_amount=${totalAmount},transaction_uuid=${transactionUUID},product_code=${productCode}`;
        const signature = crypto
            .createHmac('sha256', secret)
            .update(message)
            .digest('base64');

        const esewaData = {
            amount: totalAmount.toString(),
            tax_amount: '0',
            total_amount: totalAmount.toString(),
            transaction_uuid: transactionUUID,
            product_code: productCode,
            product_service_charge: '0',
            product_delivery_charge: '0',
            success_url: `${process.env.NEXTAUTH_URL}/checkout/success`,
            failure_url: `${process.env.NEXTAUTH_URL}/checkout/failure`,
            signed_field_names: 'total_amount,transaction_uuid,product_code',
            signature: signature,
        };

        // Update order with esewa reference
        await prisma.order.update({
            where: { id: orderId },
            data: {
                paymentDetails: {
                    transactionUUID,
                    esewaData,
                },
            },
        });

        return NextResponse.json({
            esewaUrl: process.env.NEXT_PUBLIC_ESEWA_URL,
            esewaData,
        });
    } catch (error) {
        console.error('eSewa initiation error:', error);
        return NextResponse.json(
            { error: 'Failed to initiate payment' },
            { status: 500 }
        );
    }
}
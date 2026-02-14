import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

export async function GET() {
    // 1. Check if Env Vars are loaded
    const configCheck = {
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: process.env.SMTP_PORT,
        SMTP_USER: process.env.SMTP_USER ? 'Set' : 'Missing',
        SMTP_PASS: process.env.SMTP_PASS ? 'Set' : 'Missing',
        SMTP_FROM: process.env.SMTP_FROM,
    };

    try {
        // 2. Setup Transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // 3. Verify Connection
        await new Promise((resolve, reject) => {
            transporter.verify(function (error, success) {
                if (error) {
                    reject(error);
                } else {
                    resolve(success);
                }
            });
        });

        // 4. Send Test Email
        const testRecipient = process.env.RECIPIENT_EMAIL || process.env.SMTP_USER;

        // 4. Send Test Email
        if (process.env.SMTP_USER) {
            await transporter.sendMail({
                from: process.env.SMTP_FROM || process.env.SMTP_USER,
                to: testRecipient,
                subject: "KaKe Vercel Email Test",
                text: `If you received this, your Vercel email configuration is CORRECT!\n\nSent to: ${testRecipient}`,
            });
        }

        return NextResponse.json({
            status: 'Success',
            message: 'SMTP connection verified and test email sent!',
            config: configCheck,
        });

    } catch (error: any) {
        return NextResponse.json({
            status: 'Error',
            message: error.message,
            stack: error.stack,
            config: configCheck,
        }, { status: 500 });
    }
}

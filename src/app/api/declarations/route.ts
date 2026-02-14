import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { sendEmailNotification } from '@/lib/email';
import { initDb } from '@/lib/db';

// Force dynamic to ensure Env Vars are always loaded
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await initDb(); // Ensure table exists
        const { rows } = await sql`SELECT * FROM declarations ORDER BY created_at DESC LIMIT 50;`;
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Failed to fetch declarations:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { content, author, recipients } = body;

        // DEBUG: Check if we have Env Vars in this route
        const debugEnv = {
            hasSmtpUser: !!process.env.SMTP_USER,
            hasRecipientEnv: !!process.env.RECIPIENT_EMAIL
        };
        console.log("Declarations Route Env Check:", debugEnv);

        if (!content || !author) {
            return NextResponse.json(
                { error: 'Content and author are required' },
                { status: 400 }
            );
        }

        // Insert into Postgres
        await initDb(); // Ensure table exists
        const result = await sql`
            INSERT INTO declarations (content, author)
            VALUES (${content}, ${author})
            RETURNING id, content, author, created_at;
        `;
        const newDeclaration = result.rows[0];

        // Run synchronously (awaited) to ensure Vercel doesn't freeze the lambda before email sends
        // If recipients provided (from UI), use them. Otherwise pass undefined to use server-side Env Var fallback.
        const headerRecipients = (recipients && recipients.length > 0) ? recipients : undefined;

        try {
            await sendEmailNotification(author, content, headerRecipients);
        } catch (emailError) {
            console.error("Email sending failed (but declaration saved):", emailError);
        }

        return NextResponse.json(newDeclaration, { status: 201 });
    } catch (error: any) {
        console.error('Error saving declaration:', error);
        return NextResponse.json(
            {
                error: 'Failed to save declaration',
                details: error.message,
                debugEnv: {
                    hasSmtpUser: !!process.env.SMTP_USER,
                    hasRecipientEnv: !!process.env.RECIPIENT_EMAIL
                }
            },
            { status: 500 }
        );
    }
}

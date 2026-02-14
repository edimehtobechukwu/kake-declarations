import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { sendEmailNotification } from '@/lib/email';

// Force dynamic to ensure Env Vars are always loaded
export const dynamic = 'force-dynamic';

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

        const stmt = db.prepare(
            'INSERT INTO declarations (content, author) VALUES (?, ?)'
        );
        const result = stmt.run(content, author);

        // Run asynchronously to not block response
        // If recipients provided (from UI), use them. Otherwise pass undefined to use server-side Env Var fallback.
        const headerRecipients = (recipients && recipients.length > 0) ? recipients : undefined;
        // DEBUG: Await specifically to return debug info to client
        const debugSentTo = await sendEmailNotification(author, content, headerRecipients);

        return NextResponse.json({
            id: result.lastInsertRowid,
            content,
            author,
            debugSentTo
        }, { status: 201 });
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

export async function GET() {
    try {
        const stmt = db.prepare('SELECT * FROM declarations ORDER BY created_at DESC');
        const declarations = stmt.all(); // Returns an array of objects
        return NextResponse.json(declarations);
    } catch (error) {
        console.error('Error fetching declarations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch declarations' },
            { status: 500 }
        );
    }
}

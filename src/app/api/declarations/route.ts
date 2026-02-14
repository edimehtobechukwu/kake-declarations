import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { sendEmailNotification } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { content, author, recipients } = body;

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
        sendEmailNotification(author, content, headerRecipients).catch(console.error);

        return NextResponse.json({ id: result.lastInsertRowid, content, author }, { status: 201 });
    } catch (error) {
        console.error('Error saving declaration:', error);
        return NextResponse.json(
            { error: 'Failed to save declaration' },
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

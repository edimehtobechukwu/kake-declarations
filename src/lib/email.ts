import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendEmailNotification(
    author: string,
    content: string,
    recipientEmail?: string | string[]
) {
    // Use the provided recipient email(s), or fall back to env var, or placeholder
    const toEmail = recipientEmail
        ? (Array.isArray(recipientEmail) ? recipientEmail.join(', ') : recipientEmail)
        : process.env.RECIPIENT_EMAIL || 'test@example.com';

    const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: toEmail,
        subject: `New Declaration from ${author}`,
        text: `"${content}"\n\n- ${author}`,
        html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #333;">New Declaration from ${author}</h2>
      <blockquote style="font-size: 1.25rem; font-style: italic; color: #555; border-left: 4px solid #0070f3; padding-left: 1rem; margin: 20px 0;">
        "${content}"
      </blockquote>
      <p style="color: #777;">Sent from KaKe Web</p>
    </div>`,
    };

    try {
        if (!process.env.SMTP_USER) {
            console.log('Mock Email Sent (Configure .env.local to send real emails):', mailOptions);
            return `MOCK_MODE (My SMTP_USER is ${process.env.SMTP_USER ? 'Set' : 'Null'}). Target: ${toEmail}`;
        }
        await transporter.sendMail(mailOptions);
        return toEmail;
    } catch (error) {
        console.error('Error sending email:', error);
        return `Error: ${error}`;
    }
}

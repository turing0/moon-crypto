import { MagicLinkEmail } from '@/emails/magic-link-email';
import { NextRequest } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { toEmail } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'MoonCrypto <notify@mooncryp.to>',
      to: [toEmail],
      subject: 'Hello world',
      react: MagicLinkEmail({ 
        firstName: 'John',
        actionUrl: 'https://mooncryp.to',
        mailType: 'login',
        siteName: 'MoonCrypto',
    }),
    });

    if (error) {
      console.log("Resend error", error)
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

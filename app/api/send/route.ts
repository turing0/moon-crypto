import { MagicLinkEmail } from '@/emails/magic-link-email';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { from, to, subject, react, header } = await request.json();

    const { data, error } = await resend.emails.send({
      from: from || 'MoonCrypto <notify@mooncryp.to>',
      to: [to],
      subject: subject || 'default subject',
      react: react || MagicLinkEmail({ 
        firstName: 'John',
        actionUrl: 'https://mooncryp.to',
        mailType: 'login',
        siteName: 'MoonCrypto',
    }),
    });

    if (error) {
      console.log("Resend error", error)
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

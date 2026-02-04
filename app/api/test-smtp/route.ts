import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  const config = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER ? '***configured***' : 'NOT SET',
    pass: process.env.SMTP_PASS ? '***configured***' : 'NOT SET',
  };

  try {
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2',
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
    });

    // Test connection
    await transporter.verify();

    return NextResponse.json({
      status: 'success',
      message: 'SMTP connection verified successfully',
      config,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      status: 'error',
      message: errorMessage,
      config,
    }, { status: 500 });
  }
}

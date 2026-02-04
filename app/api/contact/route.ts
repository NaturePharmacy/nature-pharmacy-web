import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Create transporter (supports both SMTP_* and EMAIL_* variable names)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '587'),
      secure: (process.env.SMTP_PORT || process.env.EMAIL_PORT) === '465',
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER,
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
      },
    });

    // Email to admin/support
    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
    const adminMailOptions = {
      from: `"Nature Pharmacy Contact" <${smtpUser}>`,
      to: process.env.CONTACT_EMAIL || smtpUser || 'contact@naturepharmacy.com',
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">New Contact Form Submission</h2>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="background: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
            This message was sent from the Nature Pharmacy contact form.
          </p>
        </div>
      `,
    };

    // Confirmation email to user
    const userMailOptions = {
      from: `"Nature Pharmacy" <${smtpUser}>`,
      to: email,
      subject: 'We received your message - Nature Pharmacy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px;">
            <h1 style="color: #16a34a;">Nature Pharmacy</h1>
          </div>
          <div style="padding: 20px;">
            <h2>Thank you for contacting us, ${name}!</h2>
            <p>We have received your message and will get back to you within 24-48 hours.</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Your message:</strong></p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            <p>Best regards,<br>The Nature Pharmacy Team</p>
          </div>
          <div style="background: #16a34a; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
            <p style="margin: 0;">Your international marketplace for natural products</p>
          </div>
        </div>
      `,
    };

    // Check if email is configured
    if (!smtpUser || (!process.env.SMTP_PASS && !process.env.EMAIL_PASS)) {
      console.log('Email not configured. Contact form submission:', { name, email, subject, message });
      // Return success anyway to not block users, but log the submission
      return NextResponse.json({
        success: true,
        message: 'Message received (email delivery pending configuration)'
      });
    }

    // Send emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}

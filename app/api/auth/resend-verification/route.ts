import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { sendEmail, generateVerificationEmail } from '@/lib/email';

// POST /api/auth/resend-verification - Resend verification email
export async function POST(request: NextRequest) {
  try {
    const { email, locale = 'fr' } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists for security
      return NextResponse.json({
        message: 'If an account with this email exists, a verification email has been sent',
      });
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await user.save();

    // Send verification email
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/${locale}/verify-email?token=${verificationToken}`;

    await sendEmail({
      to: user.email,
      subject: locale === 'fr' ? 'Vérifiez votre email - Nature Pharmacy' : 'Verify your email - Nature Pharmacy',
      html: generateVerificationEmail(user.name, verificationUrl, locale),
    });

    return NextResponse.json({
      message: 'Verification email sent successfully',
    });
  } catch (error: any) {
    console.error('Error resending verification:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to resend verification email' },
      { status: 500 }
    );
  }
}

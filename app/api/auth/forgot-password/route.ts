import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { sendEmail, generatePasswordResetEmail } from '@/lib/email';

// POST /api/auth/forgot-password - Request password reset
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

    // Return error if user doesn't exist
    if (!user) {
      const errorMessages = {
        fr: 'Aucun compte n\'existe avec cette adresse email',
        en: 'No account exists with this email address',
        es: 'No existe ninguna cuenta con este correo electrónico',
      };
      return NextResponse.json(
        { error: errorMessages[locale as keyof typeof errorMessages] || errorMessages.fr },
        { status: 404 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Send reset email
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/${locale}/reset-password?token=${resetToken}`;

    const emailResult = await sendEmail({
      to: user.email,
      subject: locale === 'fr' ? 'Réinitialisation de mot de passe - Nature Pharmacy' : 'Password Reset - Nature Pharmacy',
      html: generatePasswordResetEmail(user.name, resetUrl, locale),
    });

    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error);
      return NextResponse.json(
        { error: locale === 'fr' ? 'Échec de l\'envoi de l\'email. Veuillez réessayer.' : 'Failed to send email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Password reset email sent successfully',
    });
  } catch (error: any) {
    console.error('Error sending reset email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send reset email' },
      { status: 500 }
    );
  }
}

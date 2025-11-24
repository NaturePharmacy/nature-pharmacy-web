import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    await transporter.sendMail({
      from: `"Nature Pharmacy" <${process.env.SMTP_USER || 'noreply@naturepharmacy.com'}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export function generateVerificationEmail(name: string, verificationUrl: string, locale: string = 'fr') {
  const translations = {
    fr: {
      title: 'Vérifiez votre adresse email',
      greeting: `Bonjour ${name},`,
      message: 'Merci de vous être inscrit sur Nature Pharmacy. Veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse email.',
      button: 'Vérifier mon email',
      expires: 'Ce lien expire dans 24 heures.',
      ignore: "Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.",
      footer: '© 2025 Nature Pharmacy. Tous droits réservés.',
    },
    en: {
      title: 'Verify your email address',
      greeting: `Hello ${name},`,
      message: 'Thank you for signing up for Nature Pharmacy. Please click the button below to verify your email address.',
      button: 'Verify my email',
      expires: 'This link expires in 24 hours.',
      ignore: "If you didn't create an account, you can ignore this email.",
      footer: '© 2025 Nature Pharmacy. All rights reserved.',
    },
  };

  const t = translations[locale as keyof typeof translations] || translations.fr;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t.title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding: 40px 40px 20px; text-align: center; background-color: #16a34a; border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px;">🌿 Nature Pharmacy</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 20px; color: #333333; font-size: 20px;">${t.greeting}</h2>
                  <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6;">${t.message}</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" style="display: inline-block; padding: 14px 32px; background-color: #16a34a; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">${t.button}</a>
                  </div>
                  <p style="margin: 20px 0 0; color: #999999; font-size: 14px;">${t.expires}</p>
                  <p style="margin: 10px 0 0; color: #999999; font-size: 14px;">${t.ignore}</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 40px; background-color: #f8f8f8; border-radius: 0 0 8px 8px; text-align: center;">
                  <p style="margin: 0; color: #999999; font-size: 12px;">${t.footer}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function generatePasswordResetEmail(name: string, resetUrl: string, locale: string = 'fr') {
  const translations = {
    fr: {
      title: 'Réinitialisation de mot de passe',
      greeting: `Bonjour ${name},`,
      message: 'Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.',
      button: 'Réinitialiser mon mot de passe',
      expires: 'Ce lien expire dans 1 heure.',
      ignore: "Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email. Votre mot de passe restera inchangé.",
      footer: '© 2025 Nature Pharmacy. Tous droits réservés.',
    },
    en: {
      title: 'Password Reset',
      greeting: `Hello ${name},`,
      message: 'You have requested to reset your password. Click the button below to create a new password.',
      button: 'Reset my password',
      expires: 'This link expires in 1 hour.',
      ignore: "If you didn't request this reset, you can ignore this email. Your password will remain unchanged.",
      footer: '© 2025 Nature Pharmacy. All rights reserved.',
    },
  };

  const t = translations[locale as keyof typeof translations] || translations.fr;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t.title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding: 40px 40px 20px; text-align: center; background-color: #16a34a; border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px;">🌿 Nature Pharmacy</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 20px; color: #333333; font-size: 20px;">${t.greeting}</h2>
                  <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6;">${t.message}</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background-color: #16a34a; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">${t.button}</a>
                  </div>
                  <p style="margin: 20px 0 0; color: #999999; font-size: 14px;">${t.expires}</p>
                  <p style="margin: 10px 0 0; color: #999999; font-size: 14px;">${t.ignore}</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 40px; background-color: #f8f8f8; border-radius: 0 0 8px 8px; text-align: center;">
                  <p style="margin: 0; color: #999999; font-size: 12px;">${t.footer}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

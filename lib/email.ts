import nodemailer from 'nodemailer';
import Settings from '@/models/Settings';

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
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
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

// Welcome email for new users
export async function sendWelcomeEmail(userEmail: string, userName: string, locale: 'fr' | 'en' | 'es' = 'fr') {
  const settings = await Settings.findOne();
  if (!settings?.emailNotifications?.newUserWelcome) {
    return { success: false, message: 'Welcome email is disabled in settings' };
  }

  const translations = {
    fr: {
      subject: 'Bienvenue sur Nature Pharmacy',
      title: 'Bienvenue !',
      greeting: `Bonjour ${userName},`,
      message: 'Merci de vous être inscrit sur Nature Pharmacy. Nous sommes ravis de vous compter parmi nous !',
      discover: 'Découvrez notre large gamme de produits naturels et bio.',
      button: 'Découvrir nos produits',
      footer: '© 2025 Nature Pharmacy. Tous droits réservés.',
    },
    en: {
      subject: 'Welcome to Nature Pharmacy',
      title: 'Welcome!',
      greeting: `Hello ${userName},`,
      message: 'Thank you for signing up for Nature Pharmacy. We are delighted to have you with us!',
      discover: 'Discover our wide range of natural and organic products.',
      button: 'Discover our products',
      footer: '© 2025 Nature Pharmacy. All rights reserved.',
    },
    es: {
      subject: 'Bienvenido a Nature Pharmacy',
      title: '¡Bienvenido!',
      greeting: `Hola ${userName},`,
      message: '¡Gracias por registrarte en Nature Pharmacy! Estamos encantados de tenerte con nosotros.',
      discover: 'Descubre nuestra amplia gama de productos naturales y orgánicos.',
      button: 'Descubrir nuestros productos',
      footer: '© 2025 Nature Pharmacy. Todos los derechos reservados.',
    },
  };

  const t = translations[locale];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const html = `
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
                  <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6;">${t.discover}</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${baseUrl}/${locale}/products" style="display: inline-block; padding: 14px 32px; background-color: #16a34a; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">${t.button}</a>
                  </div>
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

  return sendEmail({ to: userEmail, subject: t.subject, html });
}

// Order confirmation email
export async function sendOrderConfirmationEmail(
  userEmail: string,
  userName: string,
  orderId: string,
  orderTotal: number,
  locale: 'fr' | 'en' | 'es' = 'fr'
) {
  const settings = await Settings.findOne();
  if (!settings?.emailNotifications?.orderConfirmation) {
    return { success: false, message: 'Order confirmation email is disabled in settings' };
  }

  const translations = {
    fr: {
      subject: 'Confirmation de commande',
      title: 'Commande confirmée',
      greeting: `Bonjour ${userName},`,
      message: 'Nous avons bien reçu votre commande et nous la préparons avec soin.',
      orderNumber: 'Numéro de commande',
      total: 'Total',
      button: 'Voir ma commande',
      footer: '© 2025 Nature Pharmacy. Tous droits réservés.',
    },
    en: {
      subject: 'Order Confirmation',
      title: 'Order Confirmed',
      greeting: `Hello ${userName},`,
      message: 'We have received your order and are preparing it carefully.',
      orderNumber: 'Order number',
      total: 'Total',
      button: 'View my order',
      footer: '© 2025 Nature Pharmacy. All rights reserved.',
    },
    es: {
      subject: 'Confirmación de pedido',
      title: 'Pedido confirmado',
      greeting: `Hola ${userName},`,
      message: 'Hemos recibido tu pedido y lo estamos preparando cuidadosamente.',
      orderNumber: 'Número de pedido',
      total: 'Total',
      button: 'Ver mi pedido',
      footer: '© 2025 Nature Pharmacy. Todos los derechos reservados.',
    },
  };

  const t = translations[locale];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const currencySymbol = settings?.currencySymbol || '€';

  const html = `
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
                  <div style="background-color: #dcfce7; border-left: 4px solid #16a34a; padding: 16px; margin: 20px 0;">
                    <p style="margin: 0; color: #166534; font-weight: 600;">✓ ${t.title}</p>
                  </div>
                  <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6;">${t.message}</p>
                  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr>
                      <td style="padding: 12px; background-color: #f8f8f8; border: 1px solid #e5e5e5;"><strong>${t.orderNumber}:</strong></td>
                      <td style="padding: 12px; background-color: #f8f8f8; border: 1px solid #e5e5e5;">${orderId}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px; background-color: #ffffff; border: 1px solid #e5e5e5;"><strong>${t.total}:</strong></td>
                      <td style="padding: 12px; background-color: #ffffff; border: 1px solid #e5e5e5;">${orderTotal.toFixed(2)} ${currencySymbol}</td>
                    </tr>
                  </table>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${baseUrl}/${locale}/account/orders/${orderId}" style="display: inline-block; padding: 14px 32px; background-color: #16a34a; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">${t.button}</a>
                  </div>
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

  return sendEmail({ to: userEmail, subject: `${t.subject} #${orderId}`, html });
}

// Order shipped email
export async function sendOrderShippedEmail(
  userEmail: string,
  userName: string,
  orderId: string,
  trackingNumber: string | undefined,
  locale: 'fr' | 'en' | 'es' = 'fr'
) {
  const settings = await Settings.findOne();
  if (!settings?.emailNotifications?.orderShipped) {
    return { success: false, message: 'Order shipped email is disabled in settings' };
  }

  const translations = {
    fr: {
      subject: 'Votre commande a été expédiée',
      title: 'Commande expédiée',
      greeting: `Bonjour ${userName},`,
      message: 'Bonne nouvelle ! Votre commande a été expédiée et est en route vers vous.',
      orderNumber: 'Numéro de commande',
      tracking: 'Numéro de suivi',
      button: 'Suivre ma commande',
      footer: '© 2025 Nature Pharmacy. Tous droits réservés.',
    },
    en: {
      subject: 'Your order has been shipped',
      title: 'Order Shipped',
      greeting: `Hello ${userName},`,
      message: 'Good news! Your order has been shipped and is on its way to you.',
      orderNumber: 'Order number',
      tracking: 'Tracking number',
      button: 'Track my order',
      footer: '© 2025 Nature Pharmacy. All rights reserved.',
    },
    es: {
      subject: 'Tu pedido ha sido enviado',
      title: 'Pedido enviado',
      greeting: `Hola ${userName},`,
      message: '¡Buenas noticias! Tu pedido ha sido enviado y está en camino hacia ti.',
      orderNumber: 'Número de pedido',
      tracking: 'Número de seguimiento',
      button: 'Rastrear mi pedido',
      footer: '© 2025 Nature Pharmacy. Todos los derechos reservados.',
    },
  };

  const t = translations[locale];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const html = `
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
                  <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0;">
                    <p style="margin: 0; color: #1e40af; font-weight: 600;">📦 ${t.title}</p>
                  </div>
                  <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6;">${t.message}</p>
                  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr>
                      <td style="padding: 12px; background-color: #f8f8f8; border: 1px solid #e5e5e5;"><strong>${t.orderNumber}:</strong></td>
                      <td style="padding: 12px; background-color: #f8f8f8; border: 1px solid #e5e5e5;">${orderId}</td>
                    </tr>
                    ${trackingNumber ? `<tr>
                      <td style="padding: 12px; background-color: #ffffff; border: 1px solid #e5e5e5;"><strong>${t.tracking}:</strong></td>
                      <td style="padding: 12px; background-color: #ffffff; border: 1px solid #e5e5e5;">${trackingNumber}</td>
                    </tr>` : ''}
                  </table>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${baseUrl}/${locale}/account/orders/${orderId}" style="display: inline-block; padding: 14px 32px; background-color: #16a34a; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">${t.button}</a>
                  </div>
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

  return sendEmail({ to: userEmail, subject: t.subject, html });
}

// Order delivered email
export async function sendOrderDeliveredEmail(
  userEmail: string,
  userName: string,
  orderId: string,
  locale: 'fr' | 'en' | 'es' = 'fr'
) {
  const settings = await Settings.findOne();
  if (!settings?.emailNotifications?.orderDelivered) {
    return { success: false, message: 'Order delivered email is disabled in settings' };
  }

  const translations = {
    fr: {
      subject: 'Votre commande a été livrée',
      title: 'Commande livrée',
      greeting: `Bonjour ${userName},`,
      message: 'Votre commande a été livrée avec succès ! Nous espérons que vous apprécierez vos produits.',
      review: 'Partagez votre expérience en laissant un avis sur les produits.',
      orderNumber: 'Numéro de commande',
      button: 'Laisser un avis',
      footer: '© 2025 Nature Pharmacy. Tous droits réservés.',
    },
    en: {
      subject: 'Your order has been delivered',
      title: 'Order Delivered',
      greeting: `Hello ${userName},`,
      message: 'Your order has been successfully delivered! We hope you enjoy your products.',
      review: 'Share your experience by leaving a review on the products.',
      orderNumber: 'Order number',
      button: 'Leave a review',
      footer: '© 2025 Nature Pharmacy. All rights reserved.',
    },
    es: {
      subject: 'Tu pedido ha sido entregado',
      title: 'Pedido entregado',
      greeting: `Hola ${userName},`,
      message: '¡Tu pedido ha sido entregado con éxito! Esperamos que disfrutes de tus productos.',
      review: 'Comparte tu experiencia dejando una reseña sobre los productos.',
      orderNumber: 'Número de pedido',
      button: 'Dejar una reseña',
      footer: '© 2025 Nature Pharmacy. Todos los derechos reservados.',
    },
  };

  const t = translations[locale];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const html = `
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
                  <div style="background-color: #dcfce7; border-left: 4px solid #16a34a; padding: 16px; margin: 20px 0;">
                    <p style="margin: 0; color: #166534; font-weight: 600;">✓ ${t.title}</p>
                  </div>
                  <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">${t.message}</p>
                  <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6;">${t.review}</p>
                  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr>
                      <td style="padding: 12px; background-color: #f8f8f8; border: 1px solid #e5e5e5;"><strong>${t.orderNumber}:</strong></td>
                      <td style="padding: 12px; background-color: #f8f8f8; border: 1px solid #e5e5e5;">${orderId}</td>
                    </tr>
                  </table>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${baseUrl}/${locale}/account/orders/${orderId}" style="display: inline-block; padding: 14px 32px; background-color: #16a34a; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">${t.button}</a>
                  </div>
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

  return sendEmail({ to: userEmail, subject: t.subject, html });
}

// Order cancelled email
export async function sendOrderCancelledEmail(
  userEmail: string,
  userName: string,
  orderId: string,
  reason: string | undefined,
  locale: 'fr' | 'en' | 'es' = 'fr'
) {
  const settings = await Settings.findOne();
  if (!settings?.emailNotifications?.orderCancelled) {
    return { success: false, message: 'Order cancelled email is disabled in settings' };
  }

  const translations = {
    fr: {
      subject: 'Votre commande a été annulée',
      title: 'Commande annulée',
      greeting: `Bonjour ${userName},`,
      message: 'Nous vous informons que votre commande a été annulée.',
      reason: 'Raison',
      contact: 'Si vous avez des questions, n\'hésitez pas à nous contacter.',
      orderNumber: 'Numéro de commande',
      button: 'Nous contacter',
      footer: '© 2025 Nature Pharmacy. Tous droits réservés.',
    },
    en: {
      subject: 'Your order has been cancelled',
      title: 'Order Cancelled',
      greeting: `Hello ${userName},`,
      message: 'We inform you that your order has been cancelled.',
      reason: 'Reason',
      contact: 'If you have any questions, please do not hesitate to contact us.',
      orderNumber: 'Order number',
      button: 'Contact us',
      footer: '© 2025 Nature Pharmacy. All rights reserved.',
    },
    es: {
      subject: 'Tu pedido ha sido cancelado',
      title: 'Pedido cancelado',
      greeting: `Hola ${userName},`,
      message: 'Te informamos que tu pedido ha sido cancelado.',
      reason: 'Razón',
      contact: 'Si tienes alguna pregunta, no dudes en contactarnos.',
      orderNumber: 'Número de pedido',
      button: 'Contáctanos',
      footer: '© 2025 Nature Pharmacy. Todos los derechos reservados.',
    },
  };

  const t = translations[locale];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const html = `
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
                  <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0;">
                    <p style="margin: 0; color: #991b1b; font-weight: 600;">✗ ${t.title}</p>
                  </div>
                  <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6;">${t.message}</p>
                  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr>
                      <td style="padding: 12px; background-color: #f8f8f8; border: 1px solid #e5e5e5;"><strong>${t.orderNumber}:</strong></td>
                      <td style="padding: 12px; background-color: #f8f8f8; border: 1px solid #e5e5e5;">${orderId}</td>
                    </tr>
                    ${reason ? `<tr>
                      <td style="padding: 12px; background-color: #ffffff; border: 1px solid #e5e5e5;"><strong>${t.reason}:</strong></td>
                      <td style="padding: 12px; background-color: #ffffff; border: 1px solid #e5e5e5;">${reason}</td>
                    </tr>` : ''}
                  </table>
                  <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6;">${t.contact}</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${baseUrl}/${locale}/contact" style="display: inline-block; padding: 14px 32px; background-color: #16a34a; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">${t.button}</a>
                  </div>
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

  return sendEmail({ to: userEmail, subject: t.subject, html });
}

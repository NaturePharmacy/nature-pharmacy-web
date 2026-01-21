# Email System Setup Guide

This guide explains how to configure and use the automated email system in Nature Pharmacy.

## Overview

The email system automatically sends notifications to users for:
- **Welcome emails** - Sent after email verification
- **Order confirmation** - Sent when an order is placed
- **Order shipped** - Sent when an order is shipped
- **Order delivered** - Sent when an order is delivered
- **Order cancelled** - Sent when an order is cancelled
- **Password reset** - Sent when a password reset is requested

## Email Configuration

### 1. SMTP Setup

The application uses SMTP to send emails. You can use any SMTP provider (Gmail, Outlook, custom SMTP server).

#### Option A: Gmail (Recommended for Development)

1. **Enable 2-Factor Authentication**
   - Go to your Google Account settings
   - Navigate to Security → 2-Step Verification
   - Enable 2FA

2. **Generate App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Nature Pharmacy" as the name
   - Click "Generate"
   - Copy the 16-character password

3. **Update .env.local**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-character-app-password
   ```

#### Option B: Outlook/Office 365

```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

#### Option C: Custom SMTP Server

```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
```

### 2. Email Notification Settings

Email notifications can be enabled/disabled from the Admin Settings page:

1. Login as admin
2. Go to `/admin/settings`
3. Navigate to the "Email Notifications" tab
4. Toggle individual notification types on/off:
   - Order Confirmation
   - Order Shipped
   - Order Delivered
   - Order Cancelled
   - New User Welcome
   - Password Reset

## Email Templates

All email templates are multilingual (French, English, Spanish) and located in [`lib/email.ts`](../lib/email.ts).

### Available Templates

1. **Welcome Email** - `sendWelcomeEmail()`
2. **Order Confirmation** - `sendOrderConfirmationEmail()`
3. **Order Shipped** - `sendOrderShippedEmail()`
4. **Order Delivered** - `sendOrderDeliveredEmail()`
5. **Order Cancelled** - `sendOrderCancelledEmail()`
6. **Password Reset** - `generatePasswordResetEmail()`
7. **Email Verification** - `generateVerificationEmail()`

### Email Template Structure

All emails include:
- Professional header with Nature Pharmacy branding
- Clear, localized message content
- Call-to-action button
- Order/account details table
- Footer with copyright

## How It Works

### Registration Flow

1. User registers → Verification email sent
2. User clicks verification link → Email verified → Welcome email sent

### Order Flow

1. User places order → Order confirmation email sent
2. Seller updates status to "shipped" → Shipped email sent (with tracking number if available)
3. Order delivered → Delivered email sent (with prompt to leave a review)
4. Order cancelled → Cancellation email sent (with reason if provided)

### Password Reset Flow

1. User requests password reset → Reset link email sent
2. User clicks reset link → Redirected to reset password page

## Testing Email System

### 1. Test Email Configuration

Create a test script to verify SMTP connection:

```typescript
// scripts/test-email.ts
import { sendEmail } from '../lib/email';

async function testEmail() {
  const result = await sendEmail({
    to: 'your-test-email@example.com',
    subject: 'Test Email from Nature Pharmacy',
    html: '<h1>Test Email</h1><p>If you received this, email is configured correctly!</p>',
  });

  console.log(result.success ? '✅ Email sent!' : '❌ Email failed:', result.error);
}

testEmail();
```

Run with: `npx tsx scripts/test-email.ts`

### 2. Test Individual Templates

```typescript
// Test welcome email
import { sendWelcomeEmail } from '../lib/email';

await sendWelcomeEmail(
  'user@example.com',
  'Test User',
  'fr' // or 'en', 'es'
);
```

### 3. Check Email Settings in Database

Verify email notifications are enabled:

```javascript
// In MongoDB shell or Compass
db.settings.findOne({}, { emailNotifications: 1 })
```

## Troubleshooting

### Email Not Sending

1. **Check SMTP credentials**
   - Verify `SMTP_USER` and `SMTP_PASS` are correct
   - For Gmail, ensure you're using an App Password, not your regular password

2. **Check SMTP connection**
   - Ensure `SMTP_HOST` and `SMTP_PORT` are correct
   - Check if your firewall/network allows outbound connections on port 587

3. **Check email notifications are enabled**
   - Go to Admin → Settings → Email Notifications
   - Ensure the specific notification type is enabled

4. **Check server logs**
   - Look for error messages in the terminal/console
   - Check for authentication errors or connection timeouts

### Emails Going to Spam

1. **Add SPF record** to your domain DNS:
   ```
   v=spf1 include:_spf.google.com ~all
   ```

2. **Add DKIM** (if using custom domain)

3. **Use a verified sender email**

4. **Avoid spam trigger words** in subject/body

### Template Customization

To customize email templates, edit the HTML in [`lib/email.ts`](../lib/email.ts):

```typescript
const html = `
  <!DOCTYPE html>
  <html>
    <!-- Customize your template here -->
  </html>
`;
```

## Production Considerations

### 1. Use a Dedicated Email Service

For production, consider using dedicated email services:
- **SendGrid** - Free tier: 100 emails/day
- **Mailgun** - Free tier: 5,000 emails/month
- **Amazon SES** - Pay as you go, very cheap
- **Postmark** - Transactional email specialist

### 2. Email Delivery Monitoring

Implement email delivery tracking:
- Track open rates
- Track click rates
- Monitor bounce rates
- Handle unsubscribes

### 3. Email Queue

For high-volume applications, implement an email queue:
- Use Bull or BullMQ with Redis
- Retry failed emails
- Rate limiting to avoid SMTP throttling

### 4. Legal Compliance

Ensure compliance with:
- **GDPR** (Europe) - Include unsubscribe link, privacy policy
- **CAN-SPAM** (USA) - Include physical address, unsubscribe option
- **CASL** (Canada) - Obtain consent before sending

## Environment Variables Reference

```env
# Required
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Optional
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Support

If you encounter issues with email configuration, check:
1. [Gmail App Passwords Guide](https://support.google.com/accounts/answer/185833)
2. [Nodemailer Documentation](https://nodemailer.com/)
3. Your SMTP provider's documentation

For application-specific issues, contact the development team.

# Stripe Connect Setup Guide

Complete guide for setting up Stripe Connect to enable seller payouts in Nature Pharmacy.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Stripe Account Setup](#stripe-account-setup)
4. [Configure Environment Variables](#configure-environment-variables)
5. [Webhook Configuration](#webhook-configuration)
6. [Testing Locally](#testing-locally)
7. [Seller Onboarding Flow](#seller-onboarding-flow)
8. [Payment Flow](#payment-flow)
9. [Commission Structure](#commission-structure)
10. [Troubleshooting](#troubleshooting)
11. [Production Checklist](#production-checklist)

---

## Overview

Stripe Connect allows Nature Pharmacy to:
- Enable sellers to receive payments directly to their bank accounts
- Automatically transfer funds when orders are delivered
- Take a platform commission (default: 10%)
- Manage seller verification and compliance
- Track all transactions and payouts

**Architecture:**
```
Buyer → Stripe Payment → Platform Account → Stripe Connect Transfer → Seller Account
```

---

## Prerequisites

- Active Stripe account
- Stripe API keys (publishable and secret)
- SSL certificate for production (HTTPS required)
- Business verification completed on Stripe

---

## Stripe Account Setup

### Step 1: Enable Stripe Connect

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Settings** → **Connect**
3. Click **Get started** if not already enabled
4. Complete the Connect onboarding form:
   - **Platform name**: Nature Pharmacy
   - **Platform type**: Marketplace
   - **Business type**: Select your business structure
   - **Website URL**: Your production URL

### Step 2: Configure Connect Settings

1. In **Connect Settings**, configure:
   - **Account type**: Express (recommended for simplicity)
   - **Onboarding**: Enable standard onboarding
   - **Branding**: Upload logo and set brand color
   - **Return URL**: `https://yourdomain.com/seller/dashboard/payout`

### Step 3: Get API Keys

1. Navigate to **Developers** → **API keys**
2. Copy your keys:
   - **Publishable key**: Starts with `pk_test_` (test) or `pk_live_` (production)
   - **Secret key**: Starts with `sk_test_` (test) or `sk_live_` (production)

---

## Configure Environment Variables

Add to your `.env.local` file:

```env
# Stripe API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key

# Stripe Webhooks
STRIPE_WEBHOOK_SECRET=whsec_your_payment_webhook_secret
STRIPE_CONNECT_WEBHOOK_SECRET=whsec_your_connect_webhook_secret
```

---

## Webhook Configuration

### Webhook 1: Payment Events

This webhook handles order payments.

**URL**: `https://yourdomain.com/api/webhooks/stripe`

**Events to subscribe to**:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `payment_intent.canceled`
- `charge.refunded`
- `checkout.session.completed`

**Setup**:
1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events listed above
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add to `.env.local` as `STRIPE_WEBHOOK_SECRET`

### Webhook 2: Connect Events

This webhook handles seller account updates.

**URL**: `https://yourdomain.com/api/webhooks/stripe-connect`

**Events to subscribe to**:
- `account.updated`
- `account.application.authorized`
- `account.application.deauthorized`
- `capability.updated`
- `payout.paid`
- `payout.failed`

**Setup**:
1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter URL: `https://yourdomain.com/api/webhooks/stripe-connect`
4. Select **Connect** tab
5. Select events listed above
6. Click **Add endpoint**
7. Copy the **Signing secret**
8. Add to `.env.local` as `STRIPE_CONNECT_WEBHOOK_SECRET`

---

## Testing Locally

### Using Stripe CLI

1. **Install Stripe CLI**:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe

   # Windows (via Scoop)
   scoop install stripe

   # Or download from: https://stripe.com/docs/stripe-cli
   ```

2. **Login to Stripe**:
   ```bash
   stripe login
   ```

3. **Forward webhooks to local server**:
   ```bash
   # For payment webhooks
   stripe listen --forward-to localhost:3000/api/webhooks/stripe

   # For Connect webhooks (separate terminal)
   stripe listen --events account.updated,payout.paid,payout.failed \
     --forward-to localhost:3000/api/webhooks/stripe-connect
   ```

4. **Get webhook secret**:
   - Stripe CLI will display: `Your webhook signing secret is whsec_...`
   - Add to `.env.local`

5. **Trigger test events**:
   ```bash
   # Test payment success
   stripe trigger payment_intent.succeeded

   # Test account update
   stripe trigger account.updated

   # Test payout
   stripe trigger payout.paid
   ```

---

## Seller Onboarding Flow

### How It Works

1. **Seller creates account** on Nature Pharmacy (role: `seller`)
2. **Seller navigates to** Payout Settings in dashboard
3. **Seller clicks** "Connect Stripe Account"
4. **API creates** Stripe Connect account: `POST /api/stripe-connect/onboard`
5. **Seller redirected** to Stripe onboarding page
6. **Seller completes** identity verification, bank details, business info
7. **Stripe redirects** back to: `/seller/dashboard/payout?success=true`
8. **Webhook receives** `account.updated` event
9. **Account status** updated in database

### API Endpoints

#### Create Onboarding Link
```typescript
POST /api/stripe-connect/onboard

Response:
{
  "success": true,
  "url": "https://connect.stripe.com/setup/...",
  "accountId": "acct_..."
}
```

#### Check Account Status
```typescript
GET /api/stripe-connect/status

Response:
{
  "hasAccount": true,
  "accountId": "acct_...",
  "onboardingComplete": true,
  "chargesEnabled": true,
  "payoutsEnabled": true,
  "detailsSubmitted": true,
  "bankAccountAdded": true,
  "country": "US",
  "currency": "usd",
  "requiresAction": false
}
```

#### Get Dashboard Link
```typescript
POST /api/stripe-connect/dashboard

Response:
{
  "success": true,
  "url": "https://connect.stripe.com/express/..."
}
```

#### Get Balance & Payouts
```typescript
GET /api/stripe-connect/balance

Response:
{
  "success": true,
  "balance": {
    "available": 1250.50,
    "pending": 340.00,
    "currency": "usd"
  },
  "payouts": [
    {
      "id": "po_...",
      "amount": 450.00,
      "currency": "usd",
      "status": "paid",
      "arrivalDate": 1234567890,
      "created": 1234567890
    }
  ]
}
```

---

## Payment Flow

### 1. Buyer Places Order

```
1. Buyer adds items to cart from multiple sellers
2. Proceeds to checkout
3. Enters payment info (Stripe Checkout)
4. Stripe processes payment
5. Webhook: payment_intent.succeeded
6. Order marked as "paid" in database
```

### 2. Order Processing

```
1. Seller prepares and ships items
2. Admin/seller updates order status to "shipped"
3. Tracking number added
4. Buyer receives shipment
5. Admin/buyer confirms "delivered"
```

### 3. Automatic Payout

When order status changes to **delivered**:

```typescript
// Triggered automatically in webhook
async function transferFundsToSellers(order) {
  // 1. Group items by seller
  // 2. Calculate each seller's subtotal
  // 3. Apply platform commission (10%)
  // 4. Create Stripe transfer to seller's Connect account
  // 5. Send notification to seller
}
```

**Example calculation**:
```
Order Total: $100.00
Seller A subtotal: $60.00
Seller B subtotal: $40.00

Platform commission: 10%

Seller A receives: $60.00 × 0.90 = $54.00
Seller B receives: $40.00 × 0.90 = $36.00
Platform keeps: $10.00
```

---

## Commission Structure

The platform commission is configured in:
```typescript
// app/api/webhooks/stripe/route.ts

const platformCommission = 0.10; // 10%
const sellerAmount = sellerTotal * (1 - platformCommission);
```

**To change commission**:
1. Update the `platformCommission` value (0.10 = 10%, 0.15 = 15%, etc.)
2. Restart the application
3. New transfers will use the updated rate

**Best practices**:
- Move to environment variable for easier configuration:
  ```env
  PLATFORM_COMMISSION=0.10
  ```
- Consider different rates for different seller tiers
- Disclose commission clearly in Terms of Service

---

## Troubleshooting

### Common Issues

#### 1. "No Stripe Connect account found"

**Problem**: Seller hasn't completed onboarding

**Solution**:
```bash
# Check seller's account status
GET /api/stripe-connect/status

# If hasAccount is false, seller needs to start onboarding
# Direct them to: /seller/dashboard/payout
```

#### 2. "Charges not enabled"

**Problem**: Stripe account not fully verified

**Reasons**:
- Missing business information
- ID verification pending
- Bank account not added
- Additional verification required

**Solution**:
1. Check Stripe Dashboard for the specific account
2. Look for required actions
3. Contact Stripe support if verification is stuck

#### 3. "Transfer failed"

**Problem**: Transfer to seller failed

**Common causes**:
- Insufficient balance in platform account
- Seller account suspended
- Invalid currency conversion
- Bank account issues

**Solution**:
```bash
# Check Stripe Dashboard → Connect → Transfers
# Look for error message and code
# Common fixes:
# - Wait for payment to settle (2-7 days)
# - Verify seller account is active
# - Check currency compatibility
```

#### 4. Webhook not receiving events

**Problem**: Webhooks aren't being called

**Solution**:
```bash
# Check webhook endpoint is accessible
curl https://yourdomain.com/api/webhooks/stripe-connect

# Verify webhook secret is correct
# Check Stripe Dashboard → Webhooks → Attempts

# Test with Stripe CLI:
stripe listen --forward-to localhost:3000/api/webhooks/stripe-connect
```

#### 5. "Seller not receiving payouts"

**Problem**: Payouts not arriving in seller's bank

**Check**:
1. Stripe Dashboard → Connect → Account → Payouts
2. Verify payout schedule (automatic or manual)
3. Check bank account details are correct
4. Review payout timeline (2-3 business days standard)

---

## Production Checklist

### Before Launch

- [ ] **Switch to live API keys**
  - Replace `pk_test_` with `pk_live_`
  - Replace `sk_test_` with `sk_live_`

- [ ] **Complete Stripe account verification**
  - Business details submitted
  - Bank account verified
  - Identity verification completed

- [ ] **Configure webhooks in live mode**
  - Create both webhooks (payment & connect)
  - Use production URLs (HTTPS required)
  - Save signing secrets to production environment

- [ ] **Test Connect flow end-to-end**
  - Create test seller account
  - Complete full onboarding
  - Process test order
  - Verify transfer is created
  - Check payout arrives

- [ ] **Set payout schedule**
  - Default: Automatic daily
  - Can customize in Stripe Dashboard → Settings → Payout schedule

- [ ] **Review commission structure**
  - Confirm commission percentage
  - Update Terms of Service
  - Disclose to sellers clearly

- [ ] **Enable fraud detection**
  - Stripe Radar (recommended)
  - Set risk rules
  - Configure 3D Secure

- [ ] **Prepare support docs**
  - Seller onboarding guide
  - FAQ about payouts
  - Tax information requirements

- [ ] **Monitor initially**
  - Watch webhook logs
  - Review first transfers
  - Check for errors
  - Be ready to support sellers

### Security Checklist

- [ ] **Webhook signatures verified** (already implemented)
- [ ] **HTTPS enforced** in production
- [ ] **API keys in environment variables** (not hardcoded)
- [ ] **Rate limiting enabled** (already implemented)
- [ ] **Seller verification** before enabling payouts
- [ ] **Transaction logging** for audit trail
- [ ] **Error monitoring** (Sentry or equivalent)

### Legal Checklist

- [ ] **Terms of Service** updated with:
  - Platform commission disclosure
  - Payout schedule
  - Refund policy
  - Seller obligations

- [ ] **Privacy Policy** updated with:
  - Stripe data sharing
  - Financial information handling

- [ ] **Seller Agreement** created with:
  - Commission structure
  - Payout terms
  - Prohibited products
  - Compliance requirements

---

## API Reference

### Database Schema

User model updates:
```typescript
sellerInfo: {
  stripeAccountId?: string;
  stripeOnboardingComplete: boolean;
  stripeChargesEnabled: boolean;
  stripePayoutsEnabled: boolean;
  stripeDetailsSubmitted: boolean;
  stripeBankAccountAdded: boolean;
}
```

### Stripe Objects

**Account**: Connected seller account
```typescript
{
  id: "acct_...",
  type: "express",
  charges_enabled: true,
  payouts_enabled: true,
  details_submitted: true
}
```

**Transfer**: Payment to seller
```typescript
{
  id: "tr_...",
  amount: 5400, // in cents ($54.00)
  currency: "usd",
  destination: "acct_...",
  metadata: {
    orderId: "...",
    sellerId: "...",
    platformCommission: "600"
  }
}
```

**Payout**: Bank transfer to seller
```typescript
{
  id: "po_...",
  amount: 5400,
  arrival_date: 1234567890,
  status: "paid" | "pending" | "failed"
}
```

---

## Best Practices

### DO ✅

- **Verify seller identity** before enabling payouts
- **Monitor failed transfers** and notify sellers
- **Keep commission transparent** in UI and docs
- **Handle webhook retries** gracefully
- **Log all financial transactions** for audit
- **Test thoroughly** in sandbox before production
- **Communicate payout schedules** clearly to sellers
- **Provide dashboard** for sellers to track earnings

### DON'T ❌

- **Don't store bank details** in your database
- **Don't skip webhook signature verification**
- **Don't manually process transfers** (use automation)
- **Don't change commission** retroactively without notice
- **Don't ignore failed payouts**
- **Don't expose Stripe secret keys** in frontend code
- **Don't process payments** without seller verification

---

## Additional Resources

- [Stripe Connect Documentation](https://stripe.com/docs/connect)
- [Stripe Express Accounts](https://stripe.com/docs/connect/express-accounts)
- [Stripe Transfers](https://stripe.com/docs/connect/charges-transfers)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

---

## Support

If you encounter issues:

1. **Check Stripe Dashboard** → Logs for detailed error messages
2. **Review webhook attempts** in Stripe Dashboard
3. **Test with Stripe CLI** locally
4. **Contact Stripe Support** for account-specific issues
5. **Check Nature Pharmacy logs** for application errors

---

**Last Updated**: January 2026
**Version**: 1.0.0

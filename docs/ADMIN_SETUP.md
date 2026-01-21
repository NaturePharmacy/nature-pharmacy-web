# Admin Account Setup Guide

This guide explains how to create and manage admin accounts in Nature Pharmacy.

## Creating the First Admin Account

There are two methods to create the initial admin account:

### Method 1: CLI Script (Recommended)

This is the easiest and most secure method.

1. **Run the create-admin script**
   ```bash
   npm run create-admin
   ```

2. **Follow the prompts**
   ```
   🌿 Nature Pharmacy - Admin Account Creation

   ✓ Connected to MongoDB

   Admin name (default: Admin): John Doe
   Admin email (default: admin@naturepharmacy.com): admin@example.com
   Admin password (min 6 characters): ********

   ✅ Admin account created successfully!

   Admin Details:
      ID: 507f1f77bcf86cd799439011
      Name: John Doe
      Email: admin@example.com
      Role: admin
      Email Verified: true

   🎉 You can now login with these credentials.
   ```

3. **Login**
   - Go to http://localhost:3000/login
   - Enter your admin email and password
   - You'll be redirected to the admin dashboard

### Method 2: API Endpoint

This method is useful for automated deployments or when CLI access is not available.

1. **Set the SEED_ADMIN_KEY in .env.local**
   ```env
   SEED_ADMIN_KEY=your-secret-seed-key
   ```

   Generate a secure key with:
   ```bash
   openssl rand -base64 32
   ```

2. **Make a POST request**

   Using cURL:
   ```bash
   curl -X POST http://localhost:3000/api/admin/seed \
     -H "Content-Type: application/json" \
     -H "x-seed-key: your-secret-seed-key" \
     -d '{
       "name": "Admin",
       "email": "admin@example.com",
       "password": "Admin@123"
     }'
   ```

   Using Postman/Insomnia:
   - **Method**: POST
   - **URL**: `http://localhost:3000/api/admin/seed`
   - **Headers**:
     ```
     Content-Type: application/json
     x-seed-key: your-secret-seed-key
     ```
   - **Body** (JSON):
     ```json
     {
       "name": "Admin",
       "email": "admin@example.com",
       "password": "Admin@123"
     }
     ```

3. **Response**
   ```json
   {
     "message": "Admin account and settings created successfully",
     "admin": {
       "id": "507f1f77bcf86cd799439011",
       "name": "Admin",
       "email": "admin@example.com",
       "role": "admin",
       "isEmailVerified": true,
       "createdAt": "2025-01-15T10:30:00.000Z"
     },
     "settings": {
       "commissionRate": 10,
       "storeName": {
         "fr": "Nature Pharmacy",
         "en": "Nature Pharmacy",
         "es": "Nature Pharmacy"
       },
       "defaultCurrency": "FCFA"
     }
   }
   ```

## Admin Dashboard Overview

Once logged in as admin, you have access to:

### 1. Dashboard (`/admin`)
- Overview statistics
- Recent orders
- Top selling products
- Quick actions

### 2. User Management (`/admin/users`)
- View all users (buyers, sellers, admins)
- Edit user details
- Change user roles
- Delete users
- View user activity

### 3. Product Management (`/admin/products`)
- View all products
- Create new products
- Edit product details
- Delete products
- Manage product images
- Set pricing and stock

### 4. Category Management (`/admin/categories`)
- Create categories
- Edit categories
- Manage category hierarchy
- Set display order
- Upload category images

### 5. Brand Management (`/admin/brands`)
- Create brands
- Edit brand details
- Upload brand logos
- Manage brand visibility

### 6. Order Management (`/admin/orders`)
- View all orders
- Update order status
- View order details
- Track shipments
- Handle refunds

### 7. Coupon Management (`/admin/coupons`)
- Create discount coupons
- Set coupon rules
- Track coupon usage
- Enable/disable coupons

### 8. Shipping Zones (`/admin/shipping-zones`)
- Configure shipping zones
- Set shipping rates
- Manage delivery areas

### 9. Seller Management (`/admin/sellers`)
- View all sellers
- Verify seller accounts
- View seller performance
- Manage seller commissions

### 10. Review Moderation (`/admin/reviews`)
- Approve/reject reviews
- Flag inappropriate reviews
- Delete reviews
- View review statistics

### 11. Support Tickets (`/admin/tickets`)
- View all support tickets
- Respond to tickets
- Close resolved tickets
- Escalate issues

### 12. Analytics (`/admin/analytics`)
- Sales analytics
- Revenue charts
- Top products
- Top sellers
- Category performance

### 13. Settings (`/admin/settings`)
- General settings
- Contact information
- Localization settings
- Tax configuration
- Shipping settings
- Payment methods
- Email notifications
- Order settings
- Maintenance mode

## Admin Permissions

### What Admins Can Do
- ✅ Full access to all admin pages
- ✅ Create, edit, delete any content
- ✅ Manage users and permissions
- ✅ View all orders and analytics
- ✅ Configure system settings
- ✅ Access API endpoints with admin-only routes

### What Admins Cannot Do
- ❌ View other admins' passwords (hashed in database)
- ❌ Bypass audit logs (all actions are logged)

## Security Best Practices

### 1. Strong Passwords
- Minimum 8 characters
- Include uppercase, lowercase, numbers, and symbols
- Don't reuse passwords from other sites
- Use a password manager

### 2. Two-Factor Authentication (Future Enhancement)
Currently not implemented, but recommended for production.

### 3. Regular Audits
- Review user access logs regularly
- Check for suspicious activity
- Monitor failed login attempts

### 4. Limit Admin Accounts
- Only create admin accounts for trusted personnel
- Use "seller" role for vendors
- Use "buyer" role for customers

### 5. Rotate Credentials
- Change admin passwords every 90 days
- Rotate NEXTAUTH_SECRET annually
- Update SEED_ADMIN_KEY after initial setup

## Managing Additional Admins

### Creating More Admin Accounts

1. **Login as existing admin**
2. **Go to Users page** (`/admin/users`)
3. **Create a new user** with role "admin"
4. **Send credentials** securely to the new admin

Or use the User API:
```bash
POST /api/admin/users
Authorization: Bearer <admin-session-token>

{
  "name": "New Admin",
  "email": "newadmin@example.com",
  "password": "SecurePassword123",
  "role": "admin"
}
```

### Removing Admin Access

1. **Login as admin**
2. **Go to Users page**
3. **Find the admin user**
4. **Change role to "buyer"** or **delete the account**

## Troubleshooting

### "Admin account already exists" Error

If you see this error when running the seed script:
```
⚠️  An admin account already exists:
   Email: admin@naturepharmacy.com
   Name: Admin
```

This means an admin was already created. You can:
- Use the existing admin credentials
- Login and create a new admin from the Users page
- Reset the admin password via the forgot password flow

### Cannot Access Admin Dashboard

If redirected to login when accessing `/admin`:
1. Verify you're logged in
2. Check your user role is "admin" in the database
3. Clear browser cookies and login again
4. Check the `session` collection in MongoDB

### Forgot Admin Password

1. **Use the password reset flow**:
   - Go to `/forgot-password`
   - Enter admin email
   - Check email for reset link
   - Set new password

2. **Or reset directly in database** (use with caution):
   ```javascript
   // MongoDB shell
   const bcrypt = require('bcryptjs');
   const newPassword = await bcrypt.hash('NewPassword123', 10);

   db.users.updateOne(
     { email: 'admin@example.com' },
     { $set: { password: newPassword } }
   );
   ```

## Default Settings

When creating the first admin via the seed endpoint, the following default settings are initialized:

- **Commission Rate**: 10%
- **Default Currency**: FCFA
- **Default Language**: French
- **Tax Rate**: 19.25% (Cameroon VAT)
- **Free Shipping Threshold**: 50,000 FCFA
- **All email notifications**: Enabled
- **Payment Methods**: Cash on Delivery, Bank Transfer
- **Maintenance Mode**: Disabled

These can all be changed in Admin → Settings.

## Production Deployment

### Before Going Live

1. **Create production admin account**
   ```bash
   npm run create-admin
   ```

2. **Configure environment variables**
   - Set strong `NEXTAUTH_SECRET`
   - Set strong `SEED_ADMIN_KEY`
   - Configure production MongoDB URI
   - Set production email SMTP

3. **Disable the seed endpoint** (optional)
   - After creating admin, you can remove the seed route
   - Or add additional IP restrictions

4. **Enable HTTPS**
   - Required for secure session cookies
   - Use Vercel, Netlify, or configure nginx/Apache

5. **Configure backup strategy**
   - Regular MongoDB backups
   - Store in secure location
   - Test restore procedure

## Support

For issues with admin setup:
1. Check the terminal/console for error messages
2. Verify MongoDB connection
3. Check environment variables in `.env.local`
4. Review the [Email Setup Guide](./EMAIL_SETUP.md)

For security concerns, contact the development team immediately.

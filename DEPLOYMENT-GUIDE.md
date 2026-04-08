# Deployment Guide - E-Commerce Updates

## Summary of Changes

### 1. Database Schema Updates
**New columns added to `orders` table:**
- `shipping_cost` (DECIMAL) - Stores delivery/pickup cost
- `logistics_company` (VARCHAR) - Stores selected logistics company
- `pickup_location` (VARCHAR) - Stores pickup station location

**Migration SQL (IMPORTANT - Run on production database):**
```sql
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS logistics_company VARCHAR(100),
ADD COLUMN IF NOT EXISTS pickup_location VARCHAR(255);

UPDATE orders 
SET shipping_cost = 0 
WHERE shipping_cost IS NULL;

UPDATE orders 
SET logistics_company = 'N/A' 
WHERE logistics_company IS NULL;

UPDATE orders 
SET pickup_location = 'N/A' 
WHERE pickup_location IS NULL;
```

### 2. New Files Created
- `src/components/OrderDetailsModal.tsx` - Modal for viewing full order details in admin panel
- `src/pages/api/orders/[id].ts` - API endpoint for fetching single order and updating order status
- `add-shipping-columns.sql` - Database migration script

### 3. Modified Files

#### Core Functionality Changes:
- **src/lib/api.ts** - Added `shipping_cost`, `logistics_company`, `pickup_location` to Order interface
- **src/lib/email.ts** - Fixed environment variable loading with dotenv, changed from `import.meta.env` to `process.env`
- **src/pages/api/orders/index.ts** - Updated to handle shipping/logistics data, added inventory decrement logic
- **src/components/pages/CheckoutPage.tsx** - Restructured delivery method flow (Door Delivery vs Pickup Station)
- **src/components/pages/OrderConfirmationPage.tsx** - Enhanced to show full order details with cost breakdown
- **src/components/pages/AdminSalesPage.tsx** - Added order details modal, status update functionality

### 4. New Dependencies
- `dotenv` - For loading environment variables in server-side code

## Pre-Deployment Checklist

### 1. Environment Variables
Ensure your `.env` file has these variables:
```env
# Database
DATABASE_URL=your_production_database_url

# Paystack
PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_cff7d96c22c5db380bd7a0e5937a655490e64f33

# Resend Email
RESEND_API_KEY=re_VZe8XJTg_5seRPErEqNBsNiH1JQY61USc
ADMIN_EMAIL=glowvaskin@gmail.com
```

### 2. Git Commit Commands
```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: Complete checkout flow with delivery options, admin panel enhancements, and email notifications

- Add delivery method selection (Door Delivery vs Pickup Station)
- Implement logistics company and pickup location selection
- Add shipping cost calculation and display
- Create order details modal for admin panel
- Add order status update functionality
- Implement inventory management (auto-decrement on orders)
- Fix email notifications with dotenv configuration
- Update order confirmation page with full receipt
- Add database migration for shipping/logistics columns"

# Push to repository
git push origin main
```

### 3. Hostinger Deployment Steps

#### A. Database Migration (CRITICAL - Do this first!)
1. Access your Hostinger database (phpMyAdmin or MySQL CLI)
2. Run the migration SQL from `add-shipping-columns.sql`
3. Verify columns were added:
   ```sql
   DESCRIBE orders;
   ```

#### B. Environment Variables on Hostinger
1. Go to your Hostinger control panel
2. Navigate to your application settings
3. Add/verify these environment variables:
   - `DATABASE_URL`
   - `PUBLIC_PAYSTACK_PUBLIC_KEY`
   - `RESEND_API_KEY`
   - `ADMIN_EMAIL`

#### C. Deploy Code
1. Push code to Git repository
2. If using Hostinger Git deployment:
   - Go to Hostinger control panel
   - Navigate to Git deployment section
   - Pull latest changes from your repository
3. If using manual deployment:
   - Upload files via FTP/SFTP
   - Ensure `node_modules` is rebuilt on server

#### D. Install Dependencies
SSH into your Hostinger server and run:
```bash
cd /path/to/your/app
npm install
npm run build
```

#### E. Restart Application
```bash
# Restart your Node.js application
# (Command depends on your Hostinger setup - PM2, systemd, etc.)
pm2 restart your-app-name
# OR
systemctl restart your-app-name
```

### 4. Post-Deployment Verification

Test these features on production:

#### Checkout Flow:
- [ ] Add products to cart
- [ ] Navigate to checkout
- [ ] Fill customer information
- [ ] Select "Door Delivery" - verify shipping address fields appear
- [ ] Select "Pickup Station" - verify logistics/pickup selection appears
- [ ] Complete payment with Paystack
- [ ] Verify order confirmation page shows full details
- [ ] Check customer email received
- [ ] Check admin email received at glowvaskin@gmail.com

#### Admin Panel:
- [ ] Navigate to `/admin/sales`
- [ ] Verify orders display with logistics details
- [ ] Click "View Details" on an order - modal should open
- [ ] Change order status using dropdown
- [ ] Verify statistics are correct (Total Orders, Revenue, Pending, Delivered)

#### Inventory:
- [ ] Check product stock before order
- [ ] Place order
- [ ] Verify stock decreased
- [ ] Check inventory status updates (Low Stock, Out of Stock)

## Troubleshooting

### Emails Not Sending
- Verify `RESEND_API_KEY` is set correctly in production environment
- Check Resend dashboard for any failed sends
- Ensure `dotenv` package is installed: `npm install dotenv`
- Verify sender email is `orders@glowvaskin.com` (verified domain)

### Database Errors
- Ensure migration SQL was run successfully
- Check database connection string in `DATABASE_URL`
- Verify all columns exist: `shipping_cost`, `logistics_company`, `pickup_location`

### Orders Not Saving
- Check server logs for database errors
- Verify database schema matches code expectations
- Ensure all required fields are being sent from checkout

### Checkout Flow Issues
- Clear browser cache and cookies
- Check browser console for JavaScript errors
- Verify Paystack public key is correct
- Test with Paystack test card: 4084 0840 8408 4081

## Features Summary

### Customer-Facing:
✅ Delivery method selection (Door Delivery / Pickup Station)
✅ Dynamic form fields based on delivery choice
✅ Logistics company selection (GUO, GIG, ABC, PARK)
✅ Pickup location selection by state
✅ Shipping cost display
✅ Order confirmation page with full receipt
✅ Email notifications with order details

### Admin-Facing:
✅ Sales dashboard with statistics
✅ Order list with logistics details
✅ Order details modal with full information
✅ Order status management (dropdown updates)
✅ Inventory tracking
✅ Email notifications for new orders

### Backend:
✅ Database schema for shipping/logistics
✅ Inventory management (auto-decrement)
✅ Email system with Resend integration
✅ Order status API endpoints
✅ Proper environment variable handling

## Support

If you encounter any issues during deployment:
1. Check server logs for error messages
2. Verify all environment variables are set
3. Ensure database migration was successful
4. Test locally first before deploying to production

---

**Last Updated:** April 8, 2026
**Version:** 2.0.0

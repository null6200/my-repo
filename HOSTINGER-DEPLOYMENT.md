# Hostinger Deployment Checklist

## CRITICAL: Database Migration First!

Before deploying code, you MUST run this SQL on your Hostinger database:

### Access Hostinger Database:
1. Log into Hostinger control panel
2. Go to "Databases" → "phpMyAdmin"
3. Select your `skincare_ecommerce` database
4. Go to "SQL" tab
5. Paste and run this SQL:

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

6. Verify success - you should see "ALTER TABLE" and "UPDATE" messages

---

## Environment Variables on Hostinger

### Method 1: Via Control Panel
1. Go to Hostinger → Your Website → Advanced → Environment Variables
2. Add these variables:

```
DATABASE_URL=your_production_database_connection_string
PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_cff7d96c22c5db380bd7a0e5937a655490e64f33
RESEND_API_KEY=re_VZe8XJTg_5seRPErEqNBsNiH1JQY61USc
ADMIN_EMAIL=glowvaskin@gmail.com
```

### Method 2: Via .env file (if Hostinger supports it)
Create `.env` file in your app root with the same variables above.

---

## Code Deployment

### Option A: Git Deployment (Recommended)
1. Push code to your Git repository (GitHub, GitLab, etc.)
2. In Hostinger control panel:
   - Go to "Git" section
   - Connect your repository
   - Select branch (usually `main`)
   - Click "Deploy"

### Option B: FTP/SFTP Upload
1. Connect via FTP/SFTP to your Hostinger server
2. Upload all files EXCEPT:
   - `node_modules/` (will be rebuilt on server)
   - `.env` (set via environment variables)
   - `test-env.js`, `test-resend.js` (test files)
3. Upload to your application directory

---

## Build and Start Application

### SSH into Hostinger:
```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start/Restart the application
pm2 restart your-app-name
# OR if using npm start
npm start
```

---

## Post-Deployment Testing

### 1. Test Checkout Flow
- [ ] Go to your-domain.com/checkout
- [ ] Add products to cart
- [ ] Fill customer information
- [ ] Select "Door Delivery" → verify address fields show
- [ ] Select "Pickup Station" → verify logistics/pickup fields show
- [ ] Complete test payment (use Paystack test card)
- [ ] Verify order confirmation page displays

### 2. Test Emails
- [ ] Check customer email inbox (including spam)
- [ ] Check admin email: glowvaskin@gmail.com (including spam)
- [ ] Verify email content is correct

### 3. Test Admin Panel
- [ ] Go to your-domain.com/admin/sales
- [ ] Verify orders display with logistics details
- [ ] Click "View Details" on an order
- [ ] Change order status
- [ ] Verify statistics are accurate

### 4. Test Inventory
- [ ] Note product stock before order
- [ ] Place an order
- [ ] Verify stock decreased
- [ ] Check if "Low Stock" or "Out of Stock" displays correctly

---

## Troubleshooting

### Issue: "Column shipping_cost does not exist"
**Solution:** Run the database migration SQL (see top of this document)

### Issue: Emails not sending
**Solutions:**
1. Verify `RESEND_API_KEY` is set in environment variables
2. Check Resend dashboard for errors
3. Ensure `dotenv` package is installed: `npm install dotenv`
4. Restart application after setting environment variables

### Issue: Orders not saving
**Solutions:**
1. Check database connection string
2. Verify migration was successful
3. Check server logs for errors

### Issue: Checkout page errors
**Solutions:**
1. Clear browser cache
2. Check browser console for errors
3. Verify Paystack public key is correct
4. Ensure all dependencies are installed

---

## Important Notes

1. **Database Migration is CRITICAL** - App will crash without it
2. **Environment Variables** - Must be set before starting app
3. **Dependencies** - Run `npm install` on server before starting
4. **Build** - Run `npm run build` for production
5. **Restart** - Always restart app after deployment

---

## Support Contacts

- **Resend Support:** https://resend.com/support
- **Paystack Support:** https://paystack.com/support
- **Hostinger Support:** Via control panel chat

---

**Deployment Date:** _____________
**Deployed By:** _____________
**Version:** 2.0.0

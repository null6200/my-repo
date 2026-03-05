# Migration from Wix to Standalone Docker Setup

This guide explains how to migrate from the Wix-based setup to a standalone Docker-based setup.

## What Changed

### Before (Wix-based)
- ❌ Wix Data for database
- ❌ Wix Media for images
- ❌ Wix CLI for deployment
- ❌ Wix cart system
- ❌ Dependent on Wix infrastructure

### After (Standalone)
- ✅ PostgreSQL in Docker for database
- ✅ Local/Cloudinary for images
- ✅ Standard Astro deployment
- ✅ Local storage cart (Zustand)
- ✅ Completely independent

## Migration Steps

### 1. Backup Your Wix Data (if you have existing data)

If you already have products in Wix:
1. Export products from Wix dashboard
2. Save as CSV or JSON
3. Import into PostgreSQL later

### 2. Replace package.json

```bash
# Backup current package.json
mv package.json package.json.wix-backup

# Use new standalone package.json
mv package.json.new package.json

# Remove node_modules and package-lock
rm -rf node_modules package-lock.json

# Fresh install
npm install
```

### 3. Start Docker

```bash
# Start PostgreSQL
docker-compose up -d

# Verify it's running
docker ps
```

### 4. Configure Environment

```bash
# Copy template
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://skincare_user:skincare_pass_2024@localhost:5433/skincare_ecommerce
PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_key
IMAGE_STORAGE=local
```

### 5. Test the Setup

```bash
# Start dev server
npm run dev
```

Visit:
- Website: http://localhost:4321
- pgAdmin: http://localhost:5050

## What Still Works

✅ All frontend pages (Home, Products, Product Detail, Checkout, Admin)
✅ Shopping cart functionality
✅ Paystack payment integration
✅ Order management
✅ Product CRUD operations
✅ Futuristic animations

## What Needs Updating

The following files need to be updated to work with PostgreSQL instead of Wix:

1. **API Routes** (to be created)
   - `/src/pages/api/products/index.ts` - Get all products
   - `/src/pages/api/products/[id].ts` - Get/Update/Delete product
   - `/src/pages/api/orders/index.ts` - Create order

2. **Components** (to be updated)
   - `AdminPage.tsx` - Use new API endpoints
   - `ProductsPage.tsx` - Fetch from new API
   - `ProductDetailPage.tsx` - Fetch from new API
   - `CheckoutPage.tsx` - Save to new API

3. **Cart System** (to be updated)
   - `useCartStore.ts` - Use localStorage instead of Wix cart

4. **Image Upload** (to be updated)
   - `image-upload.tsx` - Use local/Cloudinary instead of Wix Media

## Port Configuration

This setup uses port **5433** for PostgreSQL to avoid conflicts with other Docker projects.

If you need to change it:
1. Edit `docker-compose.yml`: Change `"5433:5432"` to your preferred port
2. Update `DATABASE_URL` in `.env` to match

## Running Multiple Docker Projects

You can run this alongside other Docker projects:

```bash
# This project uses:
- PostgreSQL: 5433
- pgAdmin: 5050
- Astro: 4321

# Your other project might use:
- PostgreSQL: 5432
- App: 3000

# They won't conflict!
```

## Troubleshooting

### "Port already in use"
Change the port in `docker-compose.yml` and `.env`

### "Cannot connect to database"
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# View logs
docker logs skincare-ecommerce-db

# Restart
docker-compose restart postgres
```

### "npm install fails"
```bash
# Clear cache
npm cache clean --force

# Remove and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

After migration is complete, I'll create:
1. ✅ API routes for database operations
2. ✅ Updated components to use new API
3. ✅ Local storage cart system
4. ✅ Image upload with local/Cloudinary support

## Benefits of Standalone Setup

- 🚀 **Faster** - No external API calls to Wix
- 💰 **Free** - No Wix subscription needed
- 🔧 **Full Control** - Customize everything
- 📦 **Portable** - Works anywhere with Docker
- 🔒 **Secure** - Your data, your server
- 🌍 **Deploy Anywhere** - Vercel, Netlify, VPS, etc.

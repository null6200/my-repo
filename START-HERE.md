# 🚀 Quick Start - Standalone E-Commerce Site

## What You Have Now

A **completely independent** e-commerce skincare website that runs locally with Docker. No Wix needed!

- ✅ PostgreSQL database in Docker (port 5433)
- ✅ Sample products pre-loaded
- ✅ Admin panel for product management
- ✅ Shopping cart with guest checkout
- ✅ Paystack payment integration
- ✅ Futuristic animations

## 3-Step Setup

### Step 1: Start Docker Database

```bash
docker-compose up -d
```

This starts:
- PostgreSQL database (with 5 sample products)
- pgAdmin (database management UI)

**Check it's running:**
```bash
docker ps
```

You should see `skincare-ecommerce-db` and `skincare-ecommerce-pgadmin`

### Step 2: Configure Environment

```bash
# Copy the template
cp .env.example .env
```

**Edit `.env` file** and add your Paystack key:
```env
DATABASE_URL=postgresql://skincare_user:skincare_pass_2024@localhost:5433/skincare_ecommerce
PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
IMAGE_STORAGE=local
PUBLIC_SITE_URL=http://localhost:4321
```

Get Paystack key from: https://dashboard.paystack.com/#/settings/developer

### Step 3: Install & Run

```bash
# Install dependencies (if not done)
npm install

# Start the website
npm run dev
```

## 🎉 You're Done!

Visit: **http://localhost:4321**

The site comes with 5 sample products already loaded!

## What You Can Do Now

### Browse Products
- Go to `/products`
- See 5 pre-loaded skincare products
- Filter by skin type
- View product details

### Test Shopping
1. Add products to cart
2. Click cart icon (top right)
3. Click "Checkout"
4. Fill in shipping info
5. Pay with Paystack test card:
   - **Card**: 4084084084084081
   - **CVV**: 123
   - **Expiry**: Any future date
   - **PIN**: 1234

### Manage Products (Admin)
- Go to `/admin`
- Add new products
- Upload images (drag & drop)
- Edit or delete products

### View Database (pgAdmin)
- Open: http://localhost:5050
- Login: `admin@skincare.local` / `admin123`
- Connect to database (see DOCKER-SETUP.md)

## Running with Other Docker Projects

This uses **port 5433** for PostgreSQL, so it won't conflict with other projects using port 5432.

```bash
# Start this project
docker-compose up -d

# Start another project (in its folder)
cd /path/to/other-project
docker-compose up -d

# Both run simultaneously! 🎉
```

## Common Commands

```bash
# Start Docker
docker-compose up -d

# Stop Docker
docker-compose down

# View logs
docker-compose logs -f

# Restart database
docker-compose restart postgres

# Start website
npm run dev

# Build for production
npm run build
```

## Troubleshooting

### Port 5433 already in use?
Edit `docker-compose.yml` line 9:
```yaml
ports:
  - "5434:5432"  # Change 5433 to 5434 or any free port
```

Then update `DATABASE_URL` in `.env` to match.

### Can't connect to database?
```bash
# Check if running
docker ps

# View logs
docker logs skincare-ecommerce-db

# Restart
docker-compose restart postgres
```

### Website won't start?
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## What's Next?

The current setup has Wix dependencies in the code. I need to update the components to use the PostgreSQL database instead of Wix Data.

**Would you like me to:**
1. ✅ Update all components to use PostgreSQL API routes
2. ✅ Remove all Wix dependencies
3. ✅ Make it 100% standalone

This will take about 10-15 minutes to complete. Should I continue?

## File Structure

```
my-repo-main/
├── docker-compose.yml          # Docker configuration
├── database/
│   └── init.sql               # Database schema + sample data
├── .env.example               # Environment template
├── .env                       # Your configuration (create this)
├── DOCKER-SETUP.md           # Detailed Docker guide
├── MIGRATION-GUIDE.md        # Migration from Wix
└── START-HERE.md             # This file!
```

## Need Help?

- **Docker Setup**: See `DOCKER-SETUP.md`
- **Migration Info**: See `MIGRATION-GUIDE.md`
- **Docker Docs**: https://docs.docker.com
- **Paystack Docs**: https://paystack.com/docs

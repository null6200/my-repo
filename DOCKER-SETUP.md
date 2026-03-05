# Docker Setup Guide - Standalone E-Commerce Site

This guide will help you run the skincare e-commerce website completely independently using Docker.

## Prerequisites

- Docker Desktop installed (https://www.docker.com/products/docker-desktop)
- Node.js 18+ installed
- Git (optional)

## Architecture

The application runs with:
- **PostgreSQL Database** (Port 5433) - Stores products and orders
- **pgAdmin** (Port 5050) - Optional database management UI
- **Astro/React Frontend** (Port 4321) - Your website
- **Paystack** - Payment processing (external service)

## Quick Start

### 1. Start Docker Containers

```bash
# Start PostgreSQL and pgAdmin
docker-compose up -d

# Check if containers are running
docker ps
```

You should see:
- `skincare-ecommerce-db` (PostgreSQL)
- `skincare-ecommerce-pgadmin` (pgAdmin)

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` file:
```env
DATABASE_URL=postgresql://skincare_user:skincare_pass_2024@localhost:5433/skincare_ecommerce
PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_actual_key
IMAGE_STORAGE=local
PUBLIC_SITE_URL=http://localhost:4321
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

Visit: http://localhost:4321

## Database Management

### Using pgAdmin (Web UI)

1. Open http://localhost:5050
2. Login:
   - Email: `admin@skincare.local`
   - Password: `admin123`
3. Add server:
   - Host: `postgres` (container name)
   - Port: `5432` (internal port)
   - Username: `skincare_user`
   - Password: `skincare_pass_2024`
   - Database: `skincare_ecommerce`

### Using Command Line

```bash
# Connect to PostgreSQL
docker exec -it skincare-ecommerce-db psql -U skincare_user -d skincare_ecommerce

# View products
SELECT * FROM products;

# View orders
SELECT * FROM orders;

# Exit
\q
```

## Multiple Projects with Docker

You can run multiple Docker projects simultaneously. Each project uses different ports:

**This Project:**
- PostgreSQL: 5433
- pgAdmin: 5050

**Your Other Project:**
- Uses its own ports (e.g., 5432, 3000, etc.)

They won't conflict as long as ports are different.

### Managing Multiple Projects

```bash
# Start this project
cd /path/to/skincare-ecommerce
docker-compose up -d

# Start another project
cd /path/to/other-project
docker-compose up -d

# View all running containers
docker ps

# Stop this project only
cd /path/to/skincare-ecommerce
docker-compose down

# Stop all Docker containers
docker stop $(docker ps -q)
```

## Database Schema

### Products Table
- `id` - UUID primary key
- `name` - Product name
- `price` - Decimal price
- `description` - Product description
- `image_url` - Product image URL
- `texture_shot_url` - Optional texture image
- `ph_level` - pH level (decimal)
- `key_ingredients` - Comma-separated ingredients
- `skin_type_recommendation` - Target skin types
- `inventory_status` - In Stock, Out of Stock, Coming Soon
- `created_at`, `updated_at` - Timestamps

### Orders Table
- `id` - UUID primary key
- `customer_name`, `customer_email`, `customer_phone`
- `shipping_address`, `city`, `state`, `country`, `postal_code`
- `total_amount` - Order total
- `order_status` - Processing, Shipped, Delivered, Cancelled
- `payment_status` - Pending, Paid, Failed
- `paystack_reference` - Payment reference
- `order_items` - JSON array of items
- `created_at`, `updated_at` - Timestamps

## Sample Data

The database comes pre-loaded with 5 sample products:
1. Hydrating Serum - $85
2. Night Recovery Cream - $120
3. Daily Protection SPF 50 - $65
4. Gentle Cleansing Gel - $45
5. Vitamin C Brightening Serum - $95

## Image Storage Options

### Option 1: Local Storage (Default)
Images stored in `public/uploads/` folder.
- Pros: Free, simple, no external dependencies
- Cons: Not suitable for production scaling

### Option 2: Cloudinary (Recommended for Production)
1. Sign up at https://cloudinary.com (free tier: 25GB storage)
2. Get credentials from dashboard
3. Update `.env`:
   ```env
   IMAGE_STORAGE=cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

## Common Commands

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Restart containers
docker-compose restart

# Remove containers and volumes (WARNING: deletes data)
docker-compose down -v

# Backup database
docker exec skincare-ecommerce-db pg_dump -U skincare_user skincare_ecommerce > backup.sql

# Restore database
docker exec -i skincare-ecommerce-db psql -U skincare_user skincare_ecommerce < backup.sql
```

## Troubleshooting

### Port Already in Use
If port 5433 is taken:
1. Edit `docker-compose.yml`
2. Change `"5433:5432"` to `"5434:5432"` (or any free port)
3. Update `DATABASE_URL` in `.env` to match

### Database Connection Failed
```bash
# Check if PostgreSQL is running
docker ps

# Check logs
docker logs skincare-ecommerce-db

# Restart database
docker-compose restart postgres
```

### Can't Access pgAdmin
```bash
# Check if pgAdmin is running
docker ps | grep pgadmin

# Restart pgAdmin
docker-compose restart pgadmin
```

### Reset Everything
```bash
# Stop and remove everything
docker-compose down -v

# Start fresh
docker-compose up -d
```

## Production Deployment

### Option 1: Docker on VPS
1. Get a VPS (DigitalOcean, Linode, AWS EC2)
2. Install Docker
3. Clone repository
4. Update `.env` with production values
5. Run `docker-compose up -d`
6. Set up Nginx reverse proxy
7. Add SSL certificate (Let's Encrypt)

### Option 2: Managed Services
- **Frontend**: Vercel, Netlify
- **Database**: Railway, Render, Supabase
- **Images**: Cloudinary

## Security Notes

- Change default passwords in production
- Use environment variables for secrets
- Enable SSL/HTTPS in production
- Implement rate limiting
- Add input validation
- Regular database backups

## Performance Tips

- Add Redis for caching (optional)
- Use CDN for images (Cloudinary)
- Enable database connection pooling
- Optimize images before upload
- Add database indexes (already included)

## Next Steps

1. ✅ Start Docker containers
2. ✅ Configure `.env` file
3. ✅ Install dependencies
4. ✅ Start dev server
5. 🎯 Add products via `/admin`
6. 🎯 Test checkout flow
7. 🎯 Deploy to production

## Support

- Docker Documentation: https://docs.docker.com
- PostgreSQL Documentation: https://www.postgresql.org/docs
- Astro Documentation: https://docs.astro.build
- Paystack Documentation: https://paystack.com/docs

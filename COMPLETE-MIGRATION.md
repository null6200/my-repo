# Complete Migration to Standalone Docker Setup

## ✅ What's Been Done

### Infrastructure
- ✅ Docker Compose with PostgreSQL (port 5433)
- ✅ pgAdmin for database management (port 5050)
- ✅ Database schema with products and orders tables
- ✅ 5 sample products pre-loaded

### Backend
- ✅ PostgreSQL database connection (`src/lib/db.ts`)
- ✅ API routes for products (GET, POST, PUT, DELETE)
- ✅ API routes for orders (GET, POST)
- ✅ Image upload API (local storage)

### Frontend
- ✅ Standalone cart system (localStorage with Zustand)
- ✅ API client library (`src/lib/api.ts`)
- ✅ Updated Cart component
- ✅ Updated Header component
- ✅ Updated image upload component

### Configuration
- ✅ New package.json without Wix dependencies
- ✅ Standalone Astro config
- ✅ Environment variables template
- ✅ Documentation (Docker setup, migration guide, quick start)

## 🔧 Final Steps to Complete

### 1. Replace package.json

```bash
# Backup current package.json
mv package.json package.json.wix-backup

# Use new standalone package.json
mv package.json.new package.json

# Clean install
rm -rf node_modules package-lock.json
npm install
```

### 2. Replace astro.config.mjs

```bash
# Backup current config
mv astro.config.mjs astro.config.wix-backup.mjs

# Use standalone config
mv astro.config.standalone.mjs astro.config.mjs
```

### 3. Update Page Components

The following components need to be updated to use the new API:

#### ProductsPage.tsx
Replace:
```typescript
import { BaseCrudService } from '@/integrations';
import { SkincareProducts } from '@/entities';

const result = await BaseCrudService.getAll<SkincareProducts>('skincareproducts');
```

With:
```typescript
import { api, type Product } from '@/lib/api';

const result = await api.getProducts();
```

#### ProductDetailPage.tsx
Replace:
```typescript
const data = await BaseCrudService.getById<SkincareProducts>('skincareproducts', id);
```

With:
```typescript
const data = await api.getProduct(id);
```

#### AdminPage.tsx
Replace all `BaseCrudService` calls with `api` calls:
- `BaseCrudService.getAll()` → `api.getProducts()`
- `BaseCrudService.create()` → `api.createProduct()`
- `BaseCrudService.update()` → `api.updateProduct()`
- `BaseCrudService.delete()` → `api.deleteProduct()`

#### CheckoutPage.tsx
Replace:
```typescript
import { BaseCrudService } from '@/integrations';
await BaseCrudService.create('orders', order);
```

With:
```typescript
import { api } from '@/lib/api';
await api.createOrder(order);
```

Also update cart usage:
```typescript
import { useCartStore } from '@/lib/cart-store';
const { items, getTotalPrice, clearCart } = useCartStore();
```

### 4. Remove Wix Integrations Folder

```bash
# Backup (optional)
mv integrations integrations.wix-backup

# Or delete
rm -rf integrations
```

### 5. Remove Wix-specific Files

```bash
rm -f framewire.js
rm -f vite-error-overlay-plugin.js
rm -f wix.config.json
```

### 6. Update Entity Types

Edit `src/entities/index.ts` to match database schema:
```typescript
export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  texture_shot_url?: string;
  ph_level?: number;
  key_ingredients?: string;
  skin_type_recommendation?: string;
  inventory_status?: string;
  created_at?: string;
  updated_at?: string;
}
```

## 🚀 Quick Start After Migration

```bash
# 1. Start Docker
docker-compose up -d

# 2. Create .env file
cp .env.example .env
# Edit .env and add your Paystack key

# 3. Install dependencies
npm install

# 4. Start dev server
npm run dev
```

Visit: http://localhost:4321

## 📝 Component Update Script

I can create updated versions of all page components. Would you like me to:
1. Update ProductsPage.tsx
2. Update ProductDetailPage.tsx  
3. Update AdminPage.tsx
4. Update CheckoutPage.tsx

All to use the new standalone API?

## 🎯 Benefits After Migration

- ✅ **No Wix dependency** - Runs completely standalone
- ✅ **Docker-based** - Easy to deploy anywhere
- ✅ **PostgreSQL** - Reliable, scalable database
- ✅ **Local development** - No external services needed
- ✅ **Full control** - Customize everything
- ✅ **Lightweight** - Only essential dependencies
- ✅ **Fast** - No external API calls
- ✅ **Secure** - Your data, your server

## 🔍 Testing Checklist

After migration:
- [ ] Docker containers running
- [ ] Database accessible
- [ ] Products page loads with sample data
- [ ] Can add product in admin
- [ ] Can upload images
- [ ] Can add to cart
- [ ] Cart persists on refresh
- [ ] Checkout flow works
- [ ] Paystack payment works
- [ ] Order saved to database

## 📚 Documentation

- `DOCKER-SETUP.md` - Docker and database guide
- `START-HERE.md` - Quick start guide
- `MIGRATION-GUIDE.md` - Wix to standalone migration
- `README.md` - Updated project overview

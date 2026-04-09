# Logistics Management System - Deployment Guide

## What's New

You now have a **database-driven logistics management system** where:
- Each logistics company has ONE price that applies to ALL their locations
- Admins can manage companies and locations via the Logistics Management page
- Checkout dynamically fetches prices from the database
- PARK Logistics now has 35+ pickup locations across Nigeria

## Current Pricing (can be changed via admin panel later)
- **GUO Transport**: ₦2,500
- **GIG Logistics**: ₦2,000
- **ABC Transport**: ₦1,800
- **PARK Logistics**: ₦2,200

## Deployment Steps

### 1. Push Code to GitHub
```bash
git add -A
git commit -m "Add complete logistics management system with database and admin UI"
git push origin main
```

### 2. Run Database Setup on Hostinger

SSH into your Hostinger VPS and run:

```bash
# Copy the SQL content and run it
docker exec -i glowvaskin-db psql -U skincare_user -d skincare_ecommerce << 'EOF'
-- Paste the entire content of setup-logistics.sql here
-- Or upload the file and run: cat setup-logistics.sql | docker exec -i glowvaskin-db psql -U skincare_user -d skincare_ecommerce
EOF
```

**Easier method - run this single command:**
```bash
cat << 'EOF' | docker exec -i glowvaskin-db psql -U skincare_user -d skincare_ecommerce
CREATE TABLE IF NOT EXISTS logistics_companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pickup_locations (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES logistics_companies(id) ON DELETE CASCADE,
  state VARCHAR(100) NOT NULL,
  location_name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pickup_locations_company ON pickup_locations(company_id);
CREATE INDEX IF NOT EXISTS idx_pickup_locations_state ON pickup_locations(state);
CREATE INDEX IF NOT EXISTS idx_logistics_companies_code ON logistics_companies(code);

INSERT INTO logistics_companies (name, code, base_price, is_active) VALUES
  ('GUO Transport', 'GUO', 2500.00, true),
  ('GIG Logistics', 'GIG', 2000.00, true),
  ('ABC Transport', 'ABC', 1800.00, true),
  ('PARK Logistics', 'PARK', 2200.00, true)
ON CONFLICT (code) DO UPDATE SET 
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  is_active = EXCLUDED.is_active;
EOF
```

### 3. Seed PARK Logistics Locations

After creating the tables, add PARK locations:

```bash
# This will be a long command - see setup-logistics.sql for the complete version
# Or manually add locations via the Logistics Management admin page
```

### 4. Restart Deployment

In Hostinger Docker Manager:
- Click **Manage** → **Restart**

Or via SSH:
```bash
docker restart glowvaskin-app
```

### 5. Test the System

1. **Test Checkout:**
   - Go to https://glowvaskin.com
   - Add product to cart
   - Go to checkout
   - Select "Pickup Station" delivery
   - Choose a logistics company - you should see the price next to the name
   - Select a pickup location - PARK should now have locations!

2. **Test Admin Panel:**
   - Go to https://glowvaskin.com/admin/logistics
   - You should see all 4 companies with their prices
   - Click on a company to see/edit locations
   - Try changing a company's price and verify it updates in checkout

## How to Change Prices

**Option 1: Via Admin Panel (Coming Soon)**
The Logistics Management page will allow you to edit company prices directly.

**Option 2: Via Database**
```bash
docker exec -i glowvaskin-db psql -U skincare_user -d skincare_ecommerce << 'EOF'
UPDATE logistics_companies SET base_price = 3000.00 WHERE code = 'GUO';
UPDATE logistics_companies SET base_price = 2500.00 WHERE code = 'GIG';
EOF
```

Then restart the app to clear any caches.

## Troubleshooting

**Checkout not showing prices?**
- Check browser console for API errors
- Verify tables exist: `docker exec -i glowvaskin-db psql -U skincare_user -d skincare_ecommerce -c "\dt"`
- Check API endpoints: `curl https://glowvaskin.com/api/logistics/companies`

**PARK has no locations?**
- Run the seed SQL again
- Or add them manually via admin panel

**Prices not updating?**
- Clear browser cache
- Restart the app container
- Check the database: `SELECT * FROM logistics_companies;`

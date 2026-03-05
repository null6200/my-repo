# Seeded Data Management Guide

## Overview
Your database currently has **20 seeded products** with placeholder images for testing and development purposes.

## Current Seeded Products

### Categories:
- **Serums** (5 products): Vitamin C, Niacinamide, Retinol, Hyaluronic Acid, Peptide Firming
- **Sunscreen** (3 products): Mineral SPF 50+, Invisible UV Shield, Tinted Sunscreen  
- **Body Wash** (3 products): Coconut, Coffee Scrub, Oat Milk
- **Face** (5 products): Brightening Cream, Calming Gel, Exfoliating Toner, Barrier Repair, Tea Tree
- **Body Lotions** (4 products): Shea Butter, Vitamin E Glow, Collagen Firming, Aloe Vera

All products include:
- Professional product images from Unsplash
- Detailed descriptions
- Pricing (₦6,000 - ₦16,500)
- Key ingredients
- Skin type recommendations
- pH levels

---

## When You're Ready for Production

### Option 1: Clear ALL Products (Recommended for Fresh Start)

**Via API Endpoint:**
```bash
curl http://localhost:4321/api/clear-seed-data
```

**Or via Direct SQL:**
```bash
docker exec skincare-ecommerce-db psql -U skincare_user -d skincare_ecommerce -c "DELETE FROM products;"
```

This will:
- Delete all 20 seeded products
- Reset the product ID sequence to start from 1
- Leave your database clean and ready for real products

### Option 2: Delete Specific Products by Pattern

**Via API with POST request:**
```bash
curl -X POST http://localhost:4321/api/clear-seed-data \
  -H "Content-Type: application/json" \
  -d '{"deletePattern": "Serum"}'
```

This allows you to delete only products matching a specific name pattern (e.g., all "Serums").

### Option 3: Manual Deletion via Admin Panel

1. Go to `/admin` in your browser
2. Manually delete products one by one
3. This gives you full control over what to keep/remove

---

## Adding Your Real Products

After clearing seeded data, you can add your real products through:

### 1. Admin Panel (Recommended)
- Navigate to `http://localhost:4321/admin`
- Click "Add New Product"
- Fill in product details
- Upload your product images
- Save

### 2. Bulk Import (Future Enhancement)
You can create a CSV import feature or use the seed endpoint pattern to bulk-add your products.

---

## Keeping Seeded Data for Testing

If you want to keep the seeded data for testing while adding real products:
- The seeded products will remain in the database
- You can add new products alongside them
- Filter or categorize them differently
- Delete individual seeded products as needed

---

## Database Backup Before Clearing

**Always backup before clearing data:**

```bash
# Backup entire database
docker exec skincare-ecommerce-db pg_dump -U skincare_user skincare_ecommerce > backup_$(date +%Y%m%d).sql

# Restore from backup if needed
docker exec -i skincare-ecommerce-db psql -U skincare_user skincare_ecommerce < backup_20260216.sql
```

---

## Notes

- Seeded data uses free Unsplash images (properly licensed)
- All prices are in Nigerian Naira (₦)
- Product images are optimized at 500x500px
- The seed data is designed to showcase all category types
- You can re-run the seed endpoint anytime to repopulate test data

---

## Questions?

- **Can I edit seeded products?** Yes, via the admin panel at `/admin`
- **Will clearing affect orders?** No, only products are deleted
- **Can I re-seed after clearing?** Yes, visit `/api/seed` to re-add test products
- **Are images stored locally?** No, they're hosted on Unsplash CDN

---

**Ready to go live?** Just run the clear endpoint and start adding your real Glowva Skin products! 🌟

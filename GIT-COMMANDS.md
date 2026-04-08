# Quick Git Deployment Commands

## Step 1: Review Changes
```bash
git status
```

## Step 2: Add All Changes
```bash
git add .
```

## Step 3: Commit Changes
```bash
git commit -m "feat: Complete e-commerce checkout and admin panel updates

Major Features:
- Delivery method selection (Door Delivery vs Pickup Station)
- Logistics integration (GUO, GIG, ABC, PARK with pickup locations)
- Order details modal in admin panel
- Order status management
- Inventory auto-decrement
- Email notifications (customer + admin)
- Enhanced order confirmation page

Technical Changes:
- Added shipping_cost, logistics_company, pickup_location to orders table
- Fixed email system with dotenv configuration
- Created OrderDetailsModal component
- Added /api/orders/[id] endpoint
- Updated checkout flow with conditional forms"
```

## Step 4: Push to Repository
```bash
git push origin main
```

## If You Need to Pull First
```bash
git pull origin main
git push origin main
```

## Check Remote Repository
```bash
git remote -v
```

## View Commit History
```bash
git log --oneline -5
```

# E-Commerce Skincare Website Setup Guide

## Overview

This is a lightweight, futuristic e-commerce skincare website with:
- ✅ Guest checkout (no login required)
- ✅ Paystack payment integration
- ✅ Admin panel for product management
- ✅ Image upload functionality
- ✅ Cart with add/remove/update quantity
- ✅ Order management system
- ✅ Beautiful animations with Framer Motion

## Prerequisites

- Node.js 18 or higher
- Wix account and site
- Paystack account (for payment processing)

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Wix environment**:
   ```bash
   npm run env
   ```

3. **Configure Paystack**:
   - Create a `.env` file in the root directory
   - Copy contents from `.env.example`
   - Get your Paystack public key from https://dashboard.paystack.com/#/settings/developer
   - Add your key to `.env`:
     ```
     PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_actual_key_here
     ```

4. **Create Wix Data Collections**:

   You need to create two collections in your Wix site:

   ### Collection 1: `skincareproducts`
   - **Type**: Catalog (eCommerce)
   - **Fields**:
     - `itemName` (Text)
     - `itemPrice` (Number)
     - `itemImage` (Image)
     - `itemDescription` (Text)
     - `phLevel` (Number)
     - `keyIngredients` (Text)
     - `skinTypeRecommendation` (Text)
     - `textureShot` (Image)
     - `inventoryStatus` (Text)

   ### Collection 2: `orders`
   - **Type**: Standard Collection
   - **Fields**:
     - `customerName` (Text)
     - `customerEmail` (Text)
     - `customerPhone` (Text)
     - `shippingAddress` (Text)
     - `city` (Text)
     - `state` (Text)
     - `country` (Text)
     - `postalCode` (Text)
     - `totalAmount` (Number)
     - `orderStatus` (Text)
     - `paymentStatus` (Text)
     - `paystackReference` (Text)
     - `orderItems` (Text)

5. **Start development server**:
   ```bash
   npm run dev
   ```

   The site will be available at `http://localhost:4321`

## Features

### Customer Features

1. **Browse Products**
   - Navigate to `/products` to view all skincare products
   - Filter by skin type (Oily, Dry, Combination, Sensitive, Normal)
   - View product details including pH level, ingredients, and recommendations

2. **Shopping Cart**
   - Click "Add to Cart" on any product
   - Cart drawer opens from the right side
   - Adjust quantities or remove items
   - View real-time total

3. **Guest Checkout**
   - No login required!
   - Click "Checkout" in cart
   - Fill in shipping and contact information
   - Pay securely with Paystack (card, bank transfer, USSD)
   - Receive order confirmation with reference number

### Admin Features

1. **Access Admin Panel**
   - Navigate to `/admin`
   - View all products in a list

2. **Add New Product**
   - Click "Add Product" button
   - Upload product image (drag & drop or click)
   - Upload optional texture shot
   - Fill in product details:
     - Name and price (required)
     - Description
     - pH level
     - Key ingredients
     - Skin type recommendation
     - Inventory status
   - Click "Create Product"

3. **Edit Product**
   - Click edit icon on any product
   - Modify any field
   - Upload new images if needed
   - Click "Update Product"

4. **Delete Product**
   - Click trash icon on any product
   - Confirm deletion

## Payment Flow

1. Customer adds products to cart
2. Customer proceeds to checkout
3. Customer fills in shipping information
4. Customer clicks "Pay with Paystack"
5. Paystack popup opens with payment options:
   - Card payment
   - Bank transfer
   - USSD
   - Mobile money
6. After successful payment:
   - Order is saved to database
   - Cart is cleared
   - Customer redirected to confirmation page
   - Order reference displayed

## Testing Payments

For testing, use Paystack test cards:
- **Success**: 4084084084084081
- **Insufficient Funds**: 5060666666666666666
- **CVV**: Any 3 digits
- **Expiry**: Any future date
- **PIN**: 1234

## Project Structure

```
src/
├── components/
│   ├── pages/
│   │   ├── HomePage.tsx          # Landing page with animations
│   │   ├── ProductsPage.tsx      # Product listing with filters
│   │   ├── ProductDetailPage.tsx # Individual product view
│   │   ├── CheckoutPage.tsx      # Guest checkout form
│   │   ├── OrderConfirmationPage.tsx # Order success page
│   │   └── AdminPage.tsx         # Product management
│   ├── ui/
│   │   └── image-upload.tsx      # Image upload component
│   ├── Cart.tsx                  # Shopping cart drawer
│   ├── Header.tsx                # Site header
│   └── Footer.tsx                # Site footer
├── entities/
│   └── index.ts                  # Data types (Products, Orders)
└── integrations/
    └── cms/                      # Wix CMS integration
```

## Customization

### Colors & Branding

Edit `src/styles/global.css` to customize:
- Primary colors
- Accent colors (gold by default)
- Typography
- Spacing

### Currency

The site uses NGN (Nigerian Naira) by default for Paystack. To change:
1. Update currency in `CheckoutPage.tsx` (line 104)
2. Ensure your Paystack account supports the currency

### Shipping

Currently, shipping is noted as "Calculated at next step". To add shipping:
1. Add shipping calculation logic in `CheckoutPage.tsx`
2. Update the total amount calculation
3. Store shipping cost in order

## Deployment

```bash
npm run build
npm run release
```

This builds and deploys to your Wix site.

## Troubleshooting

### Paystack popup not opening
- Check that `PUBLIC_PAYSTACK_PUBLIC_KEY` is set correctly
- Verify the key is for the correct environment (test/live)
- Check browser console for errors

### Images not uploading
- Ensure Wix Media API is enabled in your site
- Check file size (max 5MB)
- Verify file format (PNG, JPG, etc.)

### Orders not saving
- Verify `orders` collection exists in Wix Data
- Check collection permissions (allow write access)
- Check browser console for errors

### Cart not working
- Ensure `skincareproducts` collection is set as Catalog type
- Verify collection ID matches in code

## Support

For issues or questions:
- Check Wix Developer Documentation: https://dev.wix.com/
- Paystack Documentation: https://paystack.com/docs
- Astro Documentation: https://docs.astro.build/

## Security Notes

- Never commit `.env` file to version control
- Use test keys for development
- Switch to live keys only in production
- Validate all user inputs on the server side
- Keep dependencies updated

## Next Steps

1. Add email notifications for orders
2. Add order tracking for customers
3. Add admin dashboard for order management
4. Add product reviews and ratings
5. Add wishlist functionality
6. Add promotional codes/discounts

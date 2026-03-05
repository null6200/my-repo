# Wixstro - E-Commerce Skincare Website

A modern, lightweight e-commerce skincare website built with Astro, React, TypeScript, and Tailwind CSS. Features futuristic animations, Paystack payment integration, and guest checkout functionality.

## 🚀 Features

### E-Commerce Features
- **Guest Checkout** - No login required for customers to purchase
- **Paystack Payment Integration** - Secure payment processing with multiple payment methods
- **Shopping Cart** - Add, remove, and update quantities with real-time totals
- **Product Management** - Full CRUD admin panel for managing products
- **Image Upload** - Direct image upload to Wix Media from admin panel
- **Order Management** - Automatic order creation and tracking after successful payment
- **Product Filtering** - Filter products by skin type

### Technical Features
- **Astro Framework** - Modern static site generator with server-side rendering
- **React Integration** - Full React support with JSX components
- **TypeScript** - Type-safe development experience
- **Tailwind CSS** - Utility-first CSS framework with custom components
- **Framer Motion** - Beautiful, futuristic animations throughout
- **Wix Data Integration** - Product and order storage with Wix CMS
- **Modern UI Components** - Radix UI components with custom styling
- **Client-side Routing** - React Router for seamless navigation
- **Responsive Design** - Mobile-first responsive design
- **Testing** - Vitest testing framework setup

## 🛠️ Tech Stack

- **Framework**: Astro 5.8.0
- **Frontend**: React 18.3.0
- **Styling**: Tailwind CSS 3.4.14
- **Language**: TypeScript 5.8.3
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Testing**: Vitest
- **Build Tool**: Vite
- **Deployment**: Cloudflare


## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Wix account and site

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Wix environment**:
   ```bash
   npm run env
   ```

3. **Configure Paystack**:
   - Copy `.env.example` to `.env`
   - Add your Paystack public key from https://dashboard.paystack.com
   ```bash
   PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_key_here
   ```

4. **Create Wix Data Collections**:
   - Create `skincareproducts` collection (Catalog type)
   - Create `orders` collection (Standard type)
   - See `SETUP.md` for detailed field configuration

5. **Start development server**:
   ```bash
   npm run dev
   ```

The development server will start and you can view your site at `http://localhost:4321`.

## 📁 Project Structure

```
main/
├── src/
│   ├── components/          # React components
│   │   ├── pages/          # Page components
│   │   │   ├── HomePage.tsx           # Landing page
│   │   │   ├── ProductsPage.tsx       # Product listing
│   │   │   ├── ProductDetailPage.tsx  # Product details
│   │   │   ├── CheckoutPage.tsx       # Guest checkout
│   │   │   ├── OrderConfirmationPage.tsx # Order success
│   │   │   └── AdminPage.tsx          # Product management
│   │   ├── ui/             # Reusable UI components
│   │   │   └── image-upload.tsx       # Image upload widget
│   │   ├── Cart.tsx        # Shopping cart drawer
│   │   ├── Header.tsx      # Site header
│   │   ├── Footer.tsx      # Site footer
│   │   └── Router.tsx      # Routing component
│   ├── entities/           # Data types (Products, Orders)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── pages/              # Astro pages
│   └── styles/             # Global styles
├── integrations/           # Wix integrations
│   ├── cms/               # CMS & eCommerce integration
│   └── members/           # Member authentication
├── public/                # Static assets
└── eslint-rules/          # Custom ESLint rules
```

## 🎨 UI Components

This template includes a comprehensive set of UI components built with Radix UI and styled with Tailwind CSS:

- **Layout**: Accordion, Collapsible, Tabs, Sheet
- **Forms**: Input, Select, Checkbox, Radio Group, Switch
- **Navigation**: Navigation Menu, Menubar, Breadcrumb
- **Feedback**: Alert, Toast, Progress, Skeleton
- **Overlays**: Dialog, Popover, Tooltip, Hover Card
- **Data Display**: Table, Card, Badge, Avatar
- **Interactive**: Button, Toggle, Slider, Command

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run release` - Release to Wix
- `npm run env` - Pull environment variables
- `npm run check` - Type check with Astro
- `npm run test:run` - Run tests
- `npm install` - Install dependencies

## 🛍️ Using the E-Commerce Features

### For Customers
1. Browse products at `/products`
2. Filter by skin type
3. Click on a product to view details
4. Add products to cart
5. Click cart icon to review items
6. Click "Checkout" (no login required!)
7. Fill in shipping information
8. Pay securely with Paystack
9. Receive order confirmation

### For Admins
1. Navigate to `/admin`
2. Click "Add Product" to create new products
3. Upload images directly (drag & drop or click)
4. Fill in product details (name, price, description, etc.)
5. Edit or delete existing products
6. Manage inventory status

### Payment Testing
Use Paystack test cards for development:
- **Card**: 4084084084084081
- **CVV**: Any 3 digits
- **Expiry**: Any future date
- **PIN**: 1234

See `SETUP.md` for detailed configuration and troubleshooting.

## 🧪 Testing

The project includes Vitest for testing:

```bash
npm run test:run
```

## 📱 Responsive Design

The template is built with a mobile-first approach and includes:

- Responsive breakpoints
- Touch-friendly interactions
- Optimized images
- Flexible layouts

## 🚀 Deployment

The template is configured for deployment on Cloudflare:

```bash
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📚 Documentation

- **SETUP.md** - Detailed setup guide with collection configuration
- **Wix Developer Documentation** - https://dev.wix.com/
- **Paystack Documentation** - https://paystack.com/docs
- **Astro Documentation** - https://docs.astro.build/

## 🆘 Support

For support and questions:

- Check `SETUP.md` for detailed configuration
- Review the [Wix Developer Documentation](https://dev.wix.com/)
- Check [Paystack Documentation](https://paystack.com/docs) for payment issues
- Review the [Astro Documentation](https://docs.astro.build/)

## 🔒 Security

- Never commit `.env` file to version control
- Use test keys for development
- Switch to live Paystack keys only in production
- Keep dependencies updated regularly

---

Built with ❤️ using Wix, Astro, Paystack, and modern web technologies.

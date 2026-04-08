import { Link } from 'react-router-dom';
import { ShoppingCart, User, Heart, Menu, X } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import Cart from '@/components/Cart';
import SearchAutocomplete from '@/components/SearchAutocomplete';
import { useState } from 'react';

export default function Header() {
  const { getItemCount, toggleCart } = useCartStore();
  const itemCount = getItemCount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-white sticky top-0 z-50 shadow-md">
        {/* Top Bar */}
        <div className="border-b border-gray-200">
          <div className="max-w-[100rem] mx-auto px-3 md:px-8 py-2 md:py-4">
            <div className="flex justify-between items-center gap-2">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:text-accent-pink transition-colors bg-accent-lavender/20 rounded-lg flex-shrink-0"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Left Navigation - Desktop Only */}
              <nav className="hidden md:flex items-center gap-8">
                <Link to="/" className="font-paragraph text-base text-accent-pink hover:text-accent-purple transition-colors font-bold uppercase tracking-wide">
                  Home
                </Link>
                <Link to="/about" className="font-paragraph text-base text-foreground hover:text-accent-pink transition-colors font-bold uppercase tracking-wide">
                  About Us
                </Link>
                <Link to="/contact" className="font-paragraph text-base text-foreground hover:text-accent-pink transition-colors font-bold uppercase tracking-wide">
                  Contact Us
                </Link>
              </nav>

              {/* Center Logo */}
              <Link to="/" className="font-heading text-xl md:text-4xl lg:text-5xl font-extrabold text-accent-purple hover:text-accent-pink transition-colors flex-shrink-0">
                <span className="text-accent-purple">GLOWVA</span>{' '}
                <span className="text-accent-pink italic">SKIN</span>
              </Link>
              
              {/* Right Icons */}
              <div className="flex items-center gap-1 md:gap-4">
                <div className="hidden md:block">
                  <SearchAutocomplete />
                </div>
                <button className="hidden md:block p-2 hover:text-accent-pink transition-colors" aria-label="Account">
                  <User className="w-5 h-5" />
                </button>
                <button className="hidden md:block p-2 hover:text-accent-pink transition-colors" aria-label="Wishlist">
                  <Heart className="w-5 h-5" />
                </button>
                <button
                  onClick={toggleCart}
                  className="relative p-2 hover:text-accent-pink transition-colors"
                  aria-label="Shopping cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent-pink text-white text-xs font-paragraph font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-b border-gray-200 bg-white shadow-lg">
            <nav className="flex flex-col px-4 py-4 space-y-3">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="font-paragraph text-base text-accent-pink hover:text-accent-purple transition-colors font-bold uppercase tracking-wide py-2"
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="font-paragraph text-base text-foreground hover:text-accent-pink transition-colors font-bold uppercase tracking-wide py-2"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="font-paragraph text-base text-foreground hover:text-accent-pink transition-colors font-bold uppercase tracking-wide py-2"
              >
                Contact Us
              </Link>
              
              {/* Product Categories */}
              <div className="border-t border-gray-200 pt-3 mt-2">
                <p className="font-paragraph text-xs text-gray-500 uppercase tracking-wider mb-2">Categories</p>
                <Link
                  to="/products?category=serums"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-paragraph text-sm text-foreground hover:text-accent-pink transition-colors font-bold uppercase tracking-wide py-2 block"
                >
                  Serums
                </Link>
                <Link
                  to="/products?category=sunscreen"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-paragraph text-sm text-foreground hover:text-accent-pink transition-colors font-bold uppercase tracking-wide py-2 block"
                >
                  Sunscreen
                </Link>
                <Link
                  to="/products?category=face"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-paragraph text-sm text-foreground hover:text-accent-pink transition-colors font-bold uppercase tracking-wide py-2 block"
                >
                  Face
                </Link>
                <Link
                  to="/products?category=body-wash"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-paragraph text-sm text-foreground hover:text-accent-pink transition-colors font-bold uppercase tracking-wide py-2 block"
                >
                  Body Wash
                </Link>
                <Link
                  to="/products?category=body-lotions"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-paragraph text-sm text-foreground hover:text-accent-pink transition-colors font-bold uppercase tracking-wide py-2 block"
                >
                  Body Lotions
                </Link>
                <Link
                  to="/products?category=oils-serums"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-paragraph text-sm text-foreground hover:text-accent-pink transition-colors font-bold uppercase tracking-wide py-2 block"
                >
                  Oils & Serums
                </Link>
                <Link
                  to="/products?category=treatments"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-paragraph text-sm text-foreground hover:text-accent-pink transition-colors font-bold uppercase tracking-wide py-2 block"
                >
                  Treatments
                </Link>
              </div>
            </nav>
          </div>
        )}

        {/* Category Menu Bar - Desktop Only */}
        <div className="hidden md:block bg-white border-b border-gray-100">
          <div className="max-w-[100rem] mx-auto px-4 md:px-8">
            <nav className="flex items-center justify-center gap-8 py-4">
              <Link to="/products?category=serums" className="font-paragraph text-sm md:text-base text-foreground hover:text-accent-pink transition-colors whitespace-nowrap uppercase font-bold tracking-wide">
                Serums
              </Link>
              <Link to="/products?category=sunscreen" className="font-paragraph text-sm md:text-base text-foreground hover:text-accent-pink transition-colors whitespace-nowrap uppercase font-bold tracking-wide">
                Sunscreen
              </Link>
              <Link to="/products?category=face" className="font-paragraph text-sm md:text-base text-foreground hover:text-accent-pink transition-colors whitespace-nowrap uppercase font-bold tracking-wide">
                Face
              </Link>
              <Link to="/products?category=body-wash" className="font-paragraph text-sm md:text-base text-foreground hover:text-accent-pink transition-colors whitespace-nowrap uppercase font-bold tracking-wide">
                Body Wash
              </Link>
              <Link to="/products?category=body-lotions" className="font-paragraph text-sm md:text-base text-foreground hover:text-accent-pink transition-colors whitespace-nowrap uppercase font-bold tracking-wide">
                Body Lotions
              </Link>
              <Link to="/products?category=oils-serums" className="font-paragraph text-sm md:text-base text-foreground hover:text-accent-pink transition-colors whitespace-nowrap uppercase font-bold tracking-wide">
                Oils & Serums
              </Link>
              <Link to="/products?category=treatments" className="font-paragraph text-sm md:text-base text-foreground hover:text-accent-pink transition-colors whitespace-nowrap uppercase font-bold tracking-wide">
                Treatments
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      <Cart />
    </>
  );
}

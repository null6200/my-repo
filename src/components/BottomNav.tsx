import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, ShoppingCart, Menu } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { useState } from 'react';

export default function BottomNav() {
  const location = useLocation();
  const { getItemCount } = useCartStore();
  const itemCount = getItemCount();
  const [showMenu, setShowMenu] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 z-50 shadow-lg">
        <div className="flex items-center justify-around py-2">
          {/* Home */}
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
              isActive('/') ? 'text-accent-pink' : 'text-gray-600'
            }`}
          >
            <Home size={24} />
            <span className="text-xs font-paragraph font-bold">Home</span>
          </Link>

          {/* Products */}
          <Link
            to="/products"
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
              isActive('/products') ? 'text-accent-pink' : 'text-gray-600'
            }`}
          >
            <ShoppingBag size={24} />
            <span className="text-xs font-paragraph font-bold">Products</span>
          </Link>

          {/* Cart */}
          <Link
            to="/checkout"
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors relative ${
              location.pathname.includes('/checkout') ? 'text-accent-pink' : 'text-gray-600'
            }`}
          >
            <ShoppingCart size={24} />
            {itemCount > 0 && (
              <span className="absolute top-0 right-2 bg-accent-pink text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
            <span className="text-xs font-paragraph font-bold">Cart</span>
          </Link>

          {/* More */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex flex-col items-center gap-1 px-4 py-2 transition-colors text-gray-600"
          >
            <Menu size={24} />
            <span className="text-xs font-paragraph font-bold">More</span>
          </button>
        </div>
      </nav>

      {/* More Menu Overlay */}
      {showMenu && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setShowMenu(false)}>
          <div className="absolute bottom-16 left-0 right-0 bg-white rounded-t-3xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h3 className="font-heading text-xl text-foreground mb-4">More Options</h3>
              <div className="space-y-3">
                <Link
                  to="/about"
                  onClick={() => setShowMenu(false)}
                  className="block font-paragraph text-base text-foreground hover:text-accent-pink transition-colors font-bold py-3 border-b border-gray-100"
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setShowMenu(false)}
                  className="block font-paragraph text-base text-foreground hover:text-accent-pink transition-colors font-bold py-3 border-b border-gray-100"
                >
                  Contact Us
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setShowMenu(false)}
                  className="block font-paragraph text-base text-foreground hover:text-accent-pink transition-colors font-bold py-3"
                >
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for bottom nav on mobile */}
      <div className="md:hidden h-16"></div>
    </>
  );
}

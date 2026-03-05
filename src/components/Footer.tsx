import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-accent-purple text-white py-8 md:py-12 lg:py-16">
      <div className="max-w-[100rem] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-12 mb-8 md:mb-12">
          {/* Logo & Social */}
          <div className="col-span-2 md:col-span-1 space-y-4 md:space-y-6">
            <div className="space-y-2">
              <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-white rounded-full flex items-center justify-center">
                <span className="font-heading text-2xl md:text-3xl">GS</span>
              </div>
              <p className="font-paragraph text-xs md:text-sm">Glowvaskin.ng</p>
            </div>
            <div className="flex gap-2 md:gap-3">
              <a href="#" className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                <Instagram size={16} className="md:w-[18px] md:h-[18px]" />
              </a>
              <a href="#" className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                <span className="text-xs md:text-sm">𝕏</span>
              </a>
            </div>
          </div>
          
          {/* Top Brands */}
          <div className="space-y-3 md:space-y-4">
            <h4 className="font-heading text-sm md:text-base lg:text-lg">Top Brands</h4>
            <nav className="flex flex-col gap-1.5 md:gap-2">
              <Link to="/products" className="font-paragraph text-xs md:text-sm hover:text-accent-lavender transition-colors">
                Nivea
              </Link>
              <Link to="/products" className="font-paragraph text-xs md:text-sm hover:text-accent-lavender transition-colors">
                CeraVe
              </Link>
              <Link to="/products" className="font-paragraph text-xs md:text-sm hover:text-accent-lavender transition-colors">
                The Ordinary
              </Link>
              <Link to="/products" className="font-paragraph text-xs md:text-sm hover:text-accent-lavender transition-colors">
                Olay
              </Link>
            </nav>
          </div>
          
          {/* Category */}
          <div className="space-y-3 md:space-y-4">
            <h4 className="font-heading text-sm md:text-base lg:text-lg">Category</h4>
            <nav className="flex flex-col gap-1.5 md:gap-2">
              <Link to="/products" className="font-paragraph text-xs md:text-sm hover:text-accent-lavender transition-colors">
                Bath & Body
              </Link>
              <Link to="/products" className="font-paragraph text-xs md:text-sm hover:text-accent-lavender transition-colors">
                Personal Care
              </Link>
              <Link to="/products" className="font-paragraph text-xs md:text-sm hover:text-accent-lavender transition-colors">
                Skincare
              </Link>
              <Link to="/products" className="font-paragraph text-xs md:text-sm hover:text-accent-lavender transition-colors">
                Sunscreen
              </Link>
            </nav>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-3 md:space-y-4">
            <h4 className="font-heading text-sm md:text-base lg:text-lg">Quick Links</h4>
            <nav className="flex flex-col gap-1.5 md:gap-2">
              <Link to="/products" className="font-paragraph text-xs md:text-sm hover:text-accent-lavender transition-colors">
                Shop All
              </Link>
              <Link to="/" className="font-paragraph text-xs md:text-sm hover:text-accent-lavender transition-colors">
                About
              </Link>
              <a href="#" className="font-paragraph text-xs md:text-sm hover:text-accent-lavender transition-colors">
                My Account
              </a>
              <a href="#" className="font-paragraph text-xs md:text-sm hover:text-accent-lavender transition-colors">
                My Orders
              </a>
            </nav>
          </div>
          
          {/* Support */}
          <div className="space-y-3 md:space-y-4">
            <h4 className="font-heading text-sm md:text-base lg:text-lg">Support</h4>
            <nav className="flex flex-col gap-1.5 md:gap-2">
              <a href="#" className="font-paragraph text-xs md:text-sm hover:text-accent-lavender transition-colors">
                Contact us
              </a>
              <a href="#" className="font-paragraph text-xs md:text-sm hover:text-accent-lavender transition-colors">
                Refunds/Returns
              </a>
              <a href="#" className="font-paragraph text-xs md:text-sm hover:text-accent-lavender transition-colors">
                Terms
              </a>
              <a href="#" className="font-paragraph text-xs md:text-sm hover:text-accent-lavender transition-colors">
                Privacy Policy
              </a>
            </nav>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
          <p className="font-paragraph text-xs md:text-sm">
            © {new Date().getFullYear()} Glowvaskin | All rights reserved
          </p>
          <p className="font-paragraph text-xs md:text-sm">
            Designed by <span className="font-semibold">Bave</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

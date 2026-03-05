import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { SkincareProducts } from '@/entities';
import { api, formatPrice } from '@/lib/api';

export default function SearchAutocomplete() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState<SkincareProducts[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<SkincareProducts[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Load all products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const result = await api.getProducts();
      setAllProducts(result.items as any);
    } catch (error) {
      console.error('Error loading products:', error);
    }
    setIsLoading(false);
  };

  // Filter products as user types - only match products that START with typed letters
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts([]);
      setIsOpen(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const matches = allProducts.filter(product => 
      product.itemName?.toLowerCase().startsWith(query)
    );

    setFilteredProducts(matches.slice(0, 5)); // Show max 5 suggestions
    setIsOpen(matches.length > 0);
  }, [searchQuery, allProducts]);

  const handleClear = () => {
    setSearchQuery('');
    setFilteredProducts([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery && setIsOpen(true)}
          placeholder="Search products..."
          className="w-full pl-10 pr-10 py-2 border-2 border-gray-200 rounded-full font-paragraph text-sm focus:outline-none focus:border-accent-pink transition-colors"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-accent-pink transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && filteredProducts.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-accent-pink/20 max-h-96 overflow-y-auto z-50">
          <div className="p-2">
            {filteredProducts.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                onClick={() => {
                  setIsOpen(false);
                  setSearchQuery('');
                }}
                className="flex items-center gap-4 p-3 hover:bg-accent-lavender/20 rounded-xl transition-colors group"
              >
                {/* Product Image */}
                {product.itemImage && (
                  <div className="w-16 h-16 flex-shrink-0 bg-accent-lavender/20 rounded-lg overflow-hidden">
                    <img
                      src={product.itemImage}
                      alt={product.itemName || 'Product'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-paragraph font-semibold text-foreground text-sm truncate group-hover:text-accent-pink transition-colors">
                    {product.itemName}
                  </h4>
                  <p className="font-paragraph text-xs text-secondary truncate">
                    {product.itemDescription}
                  </p>
                  <p className="font-heading text-accent-pink font-bold text-sm mt-1">
                    {formatPrice(product.itemPrice || 0)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Results */}
          {filteredProducts.length === 5 && (
            <div className="border-t border-accent-lavender/30 p-3">
              <Link
                to={`/products?search=${encodeURIComponent(searchQuery)}`}
                onClick={() => {
                  setIsOpen(false);
                  setSearchQuery('');
                }}
                className="block text-center font-paragraph text-sm text-accent-pink hover:text-accent-purple font-semibold"
              >
                View all results for "{searchQuery}"
              </Link>
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {isOpen && searchQuery && filteredProducts.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-accent-pink/20 p-6 z-50">
          <p className="font-paragraph text-center text-secondary">
            No products found for "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  );
}

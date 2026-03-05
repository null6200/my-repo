import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SkincareProducts } from '@/entities';
import { useCartStore } from '@/lib/cart-store';
import { api, formatPrice } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProductsPage() {
  const [products, setProducts] = useState<SkincareProducts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSkinType, setSelectedSkinType] = useState<string>('All');
  const [searchParams] = useSearchParams();
  const { addItem } = useCartStore();
  const [addingItemId, setAddingItemId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const category = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    const result = await api.getProducts();
    setProducts(result.items as any);
    setIsLoading(false);
  };

  const skinTypes = ['All', 'Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'];

  // Category mapping for filtering
  const getCategoryName = (cat: string | null) => {
    if (!cat) return null;
    const categoryMap: { [key: string]: string } = {
      'serums': 'Serums',
      'sunscreen': 'Sunscreen',
      'face': 'Face',
      'body-wash': 'Body Wash',
      'body-lotions': 'Body Lotions',
      'oils-serums': 'Oils & Serums',
      'treatments': 'Treatments'
    };
    return categoryMap[cat] || null;
  };

  const categoryName = getCategoryName(category);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [category, selectedSkinType, searchQuery]);

  // Filter by search query, category, then by skin type
  let filteredProducts = products;
  
  // Search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.itemName?.toLowerCase().includes(query) ||
      p.itemDescription?.toLowerCase().includes(query) ||
      p.keyIngredients?.toLowerCase().includes(query)
    );
  }
  
  // Category filter
  if (categoryName) {
    filteredProducts = filteredProducts.filter(p => 
      p.itemName?.toLowerCase().includes(categoryName.toLowerCase()) ||
      p.itemDescription?.toLowerCase().includes(categoryName.toLowerCase())
    );
  }

  // Skin type filter
  if (selectedSkinType !== 'All') {
    filteredProducts = filteredProducts.filter(p => 
      p.skinTypeRecommendation?.includes(selectedSkinType)
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-accent-pink to-accent-purple text-white py-12 md:py-16">
        <div className="max-w-[100rem] mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl">
              {searchQuery ? `Search Results` : categoryName ? categoryName : 'Our Collection'}
            </h1>
            <p className="font-paragraph text-sm md:text-base text-white/90 max-w-2xl mx-auto">
              {searchQuery 
                ? `Showing results for "${searchQuery}"` 
                : categoryName 
                  ? `Browse our ${categoryName.toLowerCase()} collection` 
                  : 'Scientifically formulated products tailored to your unique skin needs'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="w-full py-6 md:py-8 border-b border-secondary/20">
        <div className="max-w-[100rem] mx-auto px-4 md:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {skinTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedSkinType(type)}
                className={`font-paragraph text-sm px-6 py-2 transition-colors ${
                  selectedSkinType === type
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-transparent text-foreground border border-secondary/30 hover:bg-primary/10'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="w-full py-8 md:py-12">
        <div className="max-w-[100rem] mx-auto px-4 md:px-8">
          <div className="min-h-[600px]">
            {isLoading ? null : currentProducts.length > 0 ? (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
                >
                  {currentProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group space-y-2 md:space-y-3"
                  >
                    <Link to={`/products/${product._id}`} className="block">
                      <div className="relative aspect-square bg-primary/10 overflow-hidden mb-2">
                        {product.itemImage && (
                          <img
                            src={product.itemImage}
                            alt={product.itemName || 'Product'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        {product.inventoryStatus === 'Coming Soon' && (
                          <div className="absolute top-2 right-2 bg-accent-gold text-primary-foreground font-paragraph text-[10px] md:text-xs px-2 py-1">
                            Coming Soon
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="space-y-1 md:space-y-2">
                      <Link to={`/products/${product._id}`}>
                        <h3 className="font-heading text-sm md:text-base lg:text-lg text-foreground group-hover:text-secondary transition-colors line-clamp-2">
                          {product.itemName}
                        </h3>
                      </Link>
                      
                      {product.skinTypeRecommendation && (
                        <p className="font-paragraph text-[10px] md:text-xs text-secondary line-clamp-1">
                          Best for: {product.skinTypeRecommendation}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <span className="font-heading text-base md:text-lg text-foreground">
                          {formatPrice(product.itemPrice || 0)}
                        </span>
                        
                        {product.inventoryStatus === 'Coming Soon' ? (
                          <button
                            disabled
                            className="bg-secondary/20 text-secondary font-paragraph text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 cursor-not-allowed"
                          >
                            Notify Me
                          </button>
                        ) : (
                          <button
                            disabled={addingItemId === product._id}
                            onClick={async () => {
                              setAddingItemId(product._id);
                              addItem({
                                id: product._id,
                                name: product.itemName || '',
                                price: product.itemPrice || 0,
                                image: product.itemImage,
                                quantity: 1
                              });
                              setAddingItemId(null);
                            }}
                            className="bg-primary text-primary-foreground font-paragraph text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 hover:opacity-90 transition-opacity disabled:opacity-50"
                          >
                            {addingItemId === product._id ? 'Adding...' : 'Add'}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border-2 border-accent-pink text-accent-pink font-paragraph font-bold rounded-lg hover:bg-accent-pink hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg font-paragraph font-bold transition-colors ${
                          currentPage === page
                            ? 'bg-accent-pink text-white'
                            : 'bg-white border-2 border-gray-200 text-foreground hover:border-accent-pink'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border-2 border-accent-pink text-accent-pink font-paragraph font-bold rounded-lg hover:bg-accent-pink hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
            ) : (
              <div className="text-center py-20">
                <p className="font-paragraph text-lg text-secondary">
                  No products found for this {categoryName ? 'category' : 'skin type'}.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

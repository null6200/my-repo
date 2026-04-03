import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Heart, Plus, Minus, ChevronDown, ChevronUp, Share2 } from 'lucide-react';
import { SkincareProducts } from '@/entities';
import { useCartStore } from '@/lib/cart-store';
import { api, formatPrice } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<SkincareProducts | null>(null);
  const [allProducts, setAllProducts] = useState<SkincareProducts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('description');

  useEffect(() => {
    loadProduct();
    loadAllProducts();
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    setIsLoading(true);
    const data = await api.getProduct(id);
    setProduct(data as SkincareProducts);
    setIsLoading(false);
  };

  const loadAllProducts = async () => {
    const result = await api.getProducts();
    setAllProducts(result.items as any);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const getRelatedProducts = () => {
    if (!product) return [];
    // Get products from same category, excluding current product
    const category = product.itemDescription?.split(' - ')[0];
    return allProducts
      .filter(p => p._id !== product._id && p.itemDescription?.includes(category || ''))
      .slice(0, 4);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="w-full py-6 md:py-12">
        <div className="max-w-[100rem] mx-auto px-4 md:px-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 font-paragraph text-xs md:text-sm text-secondary hover:text-foreground transition-colors mb-4 md:mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>

          <div className="min-h-[600px]">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner />
              </div>
            ) : !product ? (
              <div className="text-center py-20">
                <h2 className="font-heading text-3xl text-foreground mb-4">Product Not Found</h2>
                <p className="font-paragraph text-secondary">
                  The product you're looking for doesn't exist.
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 mb-8 md:mb-16">
                  {/* Product Image */}
                  <div className="lg:sticky lg:top-24 h-fit">
                    <div className="border-2 md:border-4 border-accent-pink/20 rounded-xl md:rounded-2xl overflow-hidden bg-white p-4 md:p-8">
                      <div className="aspect-square bg-gradient-to-br from-accent-lavender/10 to-accent-pink/5">
                        {product.itemImage && (
                          <img
                            src={product.itemImage}
                            alt={product.itemName || 'Product'}
                            className="w-full h-full object-contain"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-4 md:space-y-6">
                    <div>
                      <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-accent-purple mb-3 md:mb-4 leading-tight">
                        {product.itemName}
                      </h1>
                      <p className="font-heading text-2xl md:text-3xl lg:text-4xl text-foreground mb-4 md:mb-6">
                        {formatPrice(product.itemPrice || 0)}
                      </p>
                    </div>

                    {product.itemDescription && (
                      <div className="prose">
                        <p className="font-paragraph text-sm md:text-base text-foreground leading-relaxed">
                          {product.itemDescription.split(' - ')[1] || product.itemDescription}
                        </p>
                      </div>
                    )}

                    {/* Stock Status */}
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        product.inventoryStatus === 'In Stock' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span className="font-paragraph text-xs md:text-sm font-medium text-foreground">
                        {product.inventoryStatus || 'Out of Stock'}
                        {product.stockQuantity !== undefined && product.stockQuantity > 0 && ` (${product.stockQuantity} units)`}
                      </span>
                    </div>

                    {/* Quantity Selector and Add to Cart */}
                    <div className="space-y-3 md:space-y-4 pt-4 md:pt-6 border-t border-gray-200">
                      <div className="flex items-center gap-2 md:gap-4">
                        <div className="flex items-center border-2 border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(-1)}
                            className="p-2 md:p-3 hover:bg-gray-100 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                          <span className="px-4 md:px-6 font-paragraph font-semibold text-base md:text-lg">
                            {quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(1)}
                            className="p-2 md:p-3 hover:bg-gray-100 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        </div>

                        <button
                          disabled={isAdding || product.inventoryStatus !== 'In Stock'}
                          onClick={async () => {
                            setIsAdding(true);
                            addItem({
                              id: product._id,
                              name: product.itemName || '',
                              price: product.itemPrice || 0,
                              image: product.itemImage,
                              quantity: quantity
                            });
                            setIsAdding(false);
                          }}
                          className="flex-1 bg-foreground text-white font-paragraph font-bold px-4 md:px-8 py-3 md:py-4 text-sm md:text-base rounded-lg hover:bg-accent-purple transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                          {product.inventoryStatus !== 'In Stock' ? 'OUT OF STOCK' : isAdding ? 'Adding...' : 'ADD TO CART'}
                        </button>

                        <button
                          onClick={() => setIsWishlisted(!isWishlisted)}
                          className={`p-3 md:p-4 border-2 rounded-lg transition-all duration-300 ${
                            isWishlisted 
                              ? 'border-accent-pink bg-accent-pink text-white' 
                              : 'border-gray-300 hover:border-accent-pink'
                          }`}
                          aria-label="Add to wishlist"
                        >
                          <Heart className="w-4 h-4 md:w-5 md:h-5" fill={isWishlisted ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Sections */}
                    <div className="space-y-3 md:space-y-4 pt-4 md:pt-6">
                      {/* Description */}
                      <div className="border-b border-gray-200">
                        <button
                          onClick={() => toggleSection('description')}
                          className="w-full flex items-center justify-between py-3 md:py-4 font-paragraph font-bold text-base md:text-lg text-foreground hover:text-accent-pink transition-colors"
                        >
                          Description
                          {expandedSection === 'description' ? <ChevronUp className="w-5 h-5 md:w-6 md:h-6" /> : <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />}
                        </button>
                        {expandedSection === 'description' && (
                          <div className="pb-4 md:pb-6 space-y-3 md:space-y-4">
                            <p className="font-paragraph text-sm md:text-base text-secondary leading-relaxed">
                              {product.itemDescription}
                            </p>
                            {product.keyIngredients && (
                              <div>
                                <h4 className="font-paragraph font-semibold text-sm md:text-base text-foreground mb-2">Ingredients:</h4>
                                <p className="font-paragraph text-xs md:text-sm text-secondary">
                                  {product.keyIngredients}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Additional Info */}
                      <div className="border-b border-gray-200">
                        <button
                          onClick={() => toggleSection('additional')}
                          className="w-full flex items-center justify-between py-3 md:py-4 font-paragraph font-bold text-base md:text-lg text-foreground hover:text-accent-pink transition-colors"
                        >
                          Additional Info
                          {expandedSection === 'additional' ? <ChevronUp className="w-5 h-5 md:w-6 md:h-6" /> : <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />}
                        </button>
                        {expandedSection === 'additional' && (
                          <div className="pb-4 md:pb-6 space-y-2 md:space-y-3">
                            {product.phLevel !== undefined && product.phLevel !== null && (
                              <div className="flex justify-between">
                                <span className="font-paragraph font-semibold text-sm md:text-base text-foreground">pH Level:</span>
                                <span className="font-paragraph text-sm md:text-base text-secondary">{product.phLevel}</span>
                              </div>
                            )}
                            {product.skinTypeRecommendation && (
                              <div className="flex justify-between">
                                <span className="font-paragraph font-semibold text-sm md:text-base text-foreground">Skin Type:</span>
                                <span className="font-paragraph text-sm md:text-base text-secondary">{product.skinTypeRecommendation}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="font-paragraph font-semibold text-sm md:text-base text-foreground">SKU:</span>
                              <span className="font-paragraph text-sm md:text-base text-secondary">{product._id.slice(0, 8)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-paragraph font-semibold text-sm md:text-base text-foreground">Category:</span>
                              <span className="font-paragraph text-sm md:text-base text-secondary">
                                {product.itemDescription?.split(' - ')[0] || 'Skincare'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Reviews */}
                      <div className="border-b border-gray-200">
                        <button
                          onClick={() => toggleSection('reviews')}
                          className="w-full flex items-center justify-between py-3 md:py-4 font-paragraph font-bold text-base md:text-lg text-foreground hover:text-accent-pink transition-colors"
                        >
                          Reviews
                          {expandedSection === 'reviews' ? <ChevronUp className="w-5 h-5 md:w-6 md:h-6" /> : <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />}
                        </button>
                        {expandedSection === 'reviews' && (
                          <div className="pb-4 md:pb-6">
                            <p className="font-paragraph text-sm text-secondary italic">
                              There are no reviews yet.
                            </p>
                            <p className="font-paragraph text-sm text-secondary mt-2">
                              Only logged in customers who have purchased this product may leave a review.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Social Share */}
                    <div className="pt-4 md:pt-6">
                      <p className="font-paragraph text-xs md:text-sm font-semibold text-foreground mb-2 md:mb-3">SHARE:</p>
                      <div className="flex items-center gap-3">
                        <button className="p-2 border border-gray-300 rounded hover:border-accent-pink transition-colors">
                          <Share2 className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Related Products */}
                {getRelatedProducts().length > 0 && (
                  <div className="mt-8 md:mt-20 pt-6 md:pt-12 border-t border-gray-200">
                    <h2 className="font-heading text-xl md:text-2xl lg:text-3xl xl:text-4xl text-foreground mb-4 md:mb-8">Related Products</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                      {getRelatedProducts().map((relatedProduct) => (
                        <Link
                          key={relatedProduct._id}
                          to={`/products/${relatedProduct._id}`}
                          className="group"
                        >
                          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-accent-pink/30">
                            <div className="aspect-square bg-gradient-to-br from-accent-lavender/10 to-accent-pink/5 overflow-hidden">
                              {relatedProduct.itemImage && (
                                <img
                                  src={relatedProduct.itemImage}
                                  alt={relatedProduct.itemName || 'Product'}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              )}
                            </div>
                            <div className="p-3 md:p-4 space-y-1 md:space-y-2">
                              <h3 className="font-paragraph text-xs md:text-sm font-semibold text-foreground line-clamp-2 group-hover:text-accent-pink transition-colors">
                                {relatedProduct.itemName}
                              </h3>
                              <p className="font-heading text-sm md:text-base lg:text-lg text-accent-pink font-bold">
                                {formatPrice(relatedProduct.itemPrice || 0)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { SkincareProducts } from '@/entities';
import { useCartStore } from '@/lib/cart-store';
import { api, formatPrice } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [products, setProducts] = useState<SkincareProducts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCartStore();
  const [addingItemId, setAddingItemId] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    const result = await api.getProducts();
    setProducts(result.items as any);
    setIsLoading(false);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for subscribing!');
    setEmail('');
    setName('');
  };

  const categories = [
    { 
      name: 'Serums', 
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop',
      link: '/products?category=serums' 
    },
    { 
      name: 'Sunscreen', 
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop',
      link: '/products?category=sunscreen' 
    },
    { 
      name: 'Body Wash', 
      image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=300&h=300&fit=crop',
      link: '/products?category=body-wash' 
    },
    { 
      name: 'Face', 
      image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=300&h=300&fit=crop',
      link: '/products?category=face' 
    },
    { 
      name: 'Body Lotions', 
      image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&h=300&fit=crop',
      link: '/products?category=body-lotions' 
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-accent-pink to-accent-purple text-white py-3 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <span className="mx-8 font-paragraph text-sm">❉ Your glow is our priority ❉</span>
          <span className="mx-8 font-paragraph text-sm">❉ SHOP PRODUCTS THAT ACTUALLY WORK ❉</span>
          <span className="mx-8 font-paragraph text-sm">❉ LOOK GOOD, FEEL GOOD ❉</span>
          <span className="mx-8 font-paragraph text-sm">❉ Your glow is our priority ❉</span>
          <span className="mx-8 font-paragraph text-sm">❉ SHOP PRODUCTS THAT ACTUALLY WORK ❉</span>
          <span className="mx-8 font-paragraph text-sm">❉ LOOK GOOD, FEEL GOOD ❉</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-accent-lavender/10 to-white px-4 md:px-12 py-8 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Hero Content */}
            <div className="space-y-4 md:space-y-10 text-center lg:text-left">
              <div className="space-y-3 md:space-y-6">
                <h2 className="font-heading text-2xl md:text-4xl text-accent-purple">
                  GLOWVA <span className="italic text-accent-pink">SKIN</span>
                </h2>
                <h1 className="font-heading text-3xl md:text-6xl lg:text-7xl leading-tight text-foreground">
                  Your Confidence Begins with{' '}
                  <span className="text-accent-pink">Your Skin</span>
                </h1>
              </div>
              
              <div className="space-y-4 md:space-y-8">
                <div className="bg-gradient-to-r from-accent-pink to-accent-purple rounded-2xl md:rounded-3xl p-5 md:p-10 text-white shadow-2xl max-w-md mx-auto lg:mx-0">
                  <div className="flex items-center gap-3 md:gap-4">
                    <span className="text-2xl md:text-4xl">▸</span>
                    <span className="font-paragraph text-base md:text-xl font-semibold">Original skincare products</span>
                  </div>
                </div>

                <div>
                  <Link to="/products">
                    <button className="bg-accent-pink text-white font-paragraph font-bold px-8 py-3 md:px-16 md:py-6 rounded-full hover:bg-accent-purple transition-all duration-300 shadow-2xl hover:shadow-accent-pink/50 hover:scale-105 text-base md:text-xl">
                      Shop Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Hero Image - Desktop Only */}
            <div className="hidden lg:block relative h-[450px] lg:h-[600px]">
              <div className="w-full h-full rounded-2xl md:rounded-3xl overflow-hidden relative shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop"
                  alt="Glowva Skin Products" 
                  className="w-full h-full object-contain"
                />
                {/* Gradient fade overlay to blend with background */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/20"></div>
              </div>
              <div className="absolute top-3 right-3 md:top-6 md:right-6 bg-white rounded-xl md:rounded-2xl px-3 py-2 md:px-6 md:py-4 shadow-xl border-2 border-accent-pink/20">
                <p className="font-paragraph text-xs md:text-sm font-bold text-accent-purple uppercase text-center leading-tight">
                  Fast Delivery<br/>Nationwide &<br/>Worldwide
                </p>
              </div>
              <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-accent-purple to-accent-pink px-4 py-2 md:px-8 md:py-4 rounded-full shadow-2xl">
                <p className="font-heading text-sm md:text-lg text-white italic">
                  Your skin deserves the best...
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full px-4 md:px-12 py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-heading text-2xl md:text-5xl text-foreground mb-2 md:mb-4">Our Category</h2>
            <p className="font-paragraph text-sm md:text-lg text-secondary">Explore our curated collections</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8 mb-6 md:mb-8">
          {categories.map((category, idx) => (
            <Link
              key={idx}
              to={category.link}
              className="flex flex-col items-center group"
            >
              <div className="w-28 h-28 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-accent-lavender/30 to-accent-pink/10 overflow-hidden mb-2 md:mb-4 flex items-center justify-center p-4 md:p-8 transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl shadow-lg border-2 md:border-4 border-white">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-heading text-sm md:text-xl font-semibold text-foreground group-hover:text-accent-pink transition-colors">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
        <div className="text-center mt-6 md:mt-8">
          <Link to="/products" className="inline-flex items-center gap-2 text-accent-pink hover:text-accent-purple font-paragraph font-bold text-sm md:text-lg border-2 border-accent-pink hover:border-accent-purple px-6 py-2 md:px-8 md:py-3 rounded-full transition-all duration-300 hover:scale-105">
            VIEW ALL CATEGORIES <ArrowRight size={20} className="md:w-6 md:h-6" />
          </Link>
        </div>
        </div>
      </section>

      {/* Best Seller Section */}
      <section className="w-full px-4 md:px-12 py-12 md:py-20 bg-gradient-to-b from-accent-lavender/5 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-heading text-2xl md:text-5xl text-foreground mb-2 md:mb-4">Best Seller</h2>
            <p className="font-paragraph text-sm md:text-lg text-secondary">Our most loved products</p>
          </div>

        {isLoading ? (
          <div className="text-center py-12 md:py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-accent-pink"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
              {products.slice(0, 5).map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100 hover:border-accent-pink/30 flex flex-col h-full"
                >
                  <Link to={`/products/${product._id}`} className="block flex-shrink-0">
                    <div className="aspect-square bg-gradient-to-br from-accent-lavender/10 to-accent-pink/5 overflow-hidden">
                      {product.itemImage && (
                        <img
                          src={product.itemImage}
                          alt={product.itemName || 'Product'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                  </Link>
                  <div className="p-3 md:p-5 space-y-2 md:space-y-3 flex flex-col flex-grow">
                    <Link to={`/products/${product._id}`} className="flex-grow">
                      <h3 className="font-paragraph text-xs md:text-base font-semibold text-foreground line-clamp-2 hover:text-accent-pink transition-colors">
                        {product.itemName}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between mt-auto pt-2 md:pt-3">
                      <span className="font-heading text-sm md:text-xl text-accent-pink font-bold">
                        {formatPrice(product.itemPrice || 0)}
                      </span>
                      <button
                        disabled={addingItemId === product._id || product.inventoryStatus === 'Coming Soon'}
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
                        className="bg-accent-pink text-white p-3 rounded-full hover:bg-accent-purple transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                        aria-label="Add to cart"
                      >
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8 md:mt-12">
              <Link to="/products" className="inline-flex items-center gap-1 md:gap-2 bg-accent-pink text-white hover:bg-accent-purple font-paragraph font-bold text-xs md:text-lg px-6 py-2.5 md:px-10 md:py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl">
                VIEW ALL PRODUCTS <ArrowRight size={16} className="md:w-6 md:h-6" />
              </Link>
            </div>
          </>
        )}
        </div>
      </section>

      {/* New In Section */}
      <section className="w-full px-6 md:px-12 py-12 max-w-[120rem] mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-2">New In</h2>
          <p className="font-paragraph text-secondary">Latest Beauty Products & Arrivals</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8 max-w-6xl mx-auto">
          {products.slice(5, 10).map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
            >
              <Link to={`/products/${product._id}`} className="block">
                <div className="aspect-square bg-accent-lavender/20 overflow-hidden relative">
                  {product.itemImage && (
                    <img
                      src={product.itemImage}
                      alt={product.itemName || 'Product'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  {product.inventoryStatus === 'Coming Soon' && (
                    <div className="absolute top-2 right-2 bg-accent-pink text-white text-xs font-bold px-2 py-1 rounded">
                      NEW
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-4 space-y-3">
                <Link to={`/products/${product._id}`}>
                  <h3 className="font-paragraph text-sm text-foreground line-clamp-2 hover:text-accent-pink transition-colors">
                    {product.itemName}
                  </h3>
                </Link>
                <div className="flex items-center justify-between">
                  <span className="font-heading text-lg text-accent-pink font-bold">
                    {formatPrice(product.itemPrice || 0)}
                  </span>
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
                    className="bg-accent-pink text-white p-2 rounded-full hover:bg-accent-purple transition-colors"
                    aria-label="Add to cart"
                  >
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link to="/products">
            <button className="border-2 border-foreground text-foreground font-paragraph font-semibold px-8 py-3 rounded-full hover:bg-foreground hover:text-white transition-all duration-300">
              VIEW MORE →
            </button>
          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="w-full px-6 md:px-12 py-16 max-w-[120rem] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white rounded-3xl overflow-hidden shadow-xl">
          <div className="h-full">
            <img 
              src="https://static.wixstatic.com/media/07c53c_c6d97d4cf6b144959793310590cb498d~mv2.png"
              alt="Skincare Products" 
              className="w-full h-full object-cover min-h-[400px]"
            />
          </div>
          <div className="p-8 lg:p-12 space-y-6">
            <h2 className="font-heading text-4xl md:text-5xl">
              <span className="text-accent-pink">Radiant skin</span>{' '}
              <span className="text-foreground">products that actually work</span>
            </h2>
            <p className="font-paragraph text-lg text-secondary">
              Join thousands of happy customers across Nigeria who trust us to care for their skin. 
              <span className="italic text-accent-pink font-semibold"> Your glow is our priority</span>
            </p>
            <Link to="/products">
              <button className="bg-accent-pink text-white font-paragraph font-bold px-10 py-4 rounded-full hover:bg-accent-purple transition-all duration-300 shadow-lg">
                Shop Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Media Feed Section */}
      <section className="w-full px-6 md:px-12 py-16 max-w-[120rem] mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-heading text-2xl md:text-4xl text-foreground mb-2">Join Our Community</h2>
          <p className="font-paragraph text-sm md:text-base text-secondary">Follow us on Instagram</p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          {/* Big Boxes Row - 3 across */}
          <div className="grid grid-cols-3 gap-2 md:gap-6 mb-3 md:mb-6">
            {/* Instagram Big Box */}
            <div>
              <p className="text-center font-paragraph font-bold text-xs md:text-sm text-accent-pink mb-1 md:mb-2">INSTAGRAM</p>
              <a
                href="https://www.instagram.com/glowva_skin?igsh=MWY2bmpsbGI0Z2xhaQ%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-square overflow-hidden rounded-lg group relative"
              >
              <img
                src="/instagram.jpg"
                alt="Instagram"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-accent-pink/0 group-hover:bg-accent-pink/70 transition-all duration-300 flex items-center justify-center">
                <span className="text-white font-paragraph font-bold text-xs md:text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Instagram
                </span>
              </div>
            </a>
            </div>

            {/* TikTok Big Box */}
            <div>
              <p className="text-center font-paragraph font-bold text-xs md:text-sm text-accent-pink mb-1 md:mb-2">TIKTOK</p>
              <a
                href="https://www.tiktok.com/@glowva_skin?_r=1&_t=ZS-95DH5ugzLHN"
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-square overflow-hidden rounded-lg group relative"
            >
              <img
                src="/tiktok.jpg"
                alt="TikTok"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-accent-pink/0 group-hover:bg-accent-pink/70 transition-all duration-300 flex items-center justify-center">
                <span className="text-white font-paragraph font-bold text-xs md:text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  TikTok
                </span>
              </div>
            </a>
            </div>

            {/* Snapchat Big Box */}
            <div>
              <p className="text-center font-paragraph font-bold text-xs md:text-sm text-accent-pink mb-1 md:mb-2">SNAPCHAT</p>
              <a
                href="https://www.snapchat.com/add/glowva_skin?share_id=pDCvABTPS4GhzmKHLqXyKQ&locale=en_US"
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-square overflow-hidden rounded-lg group relative"
            >
              <img
                src="/snapchat.jpg"
                alt="Snapchat"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-accent-pink/0 group-hover:bg-accent-pink/70 transition-all duration-300 flex items-center justify-center">
                <span className="text-white font-paragraph font-bold text-xs md:text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Snapchat
                </span>
              </div>
            </a>
            </div>
          </div>

          {/* Small Boxes Row - 3 groups of 3 */}
          <div className="grid grid-cols-3 gap-2 md:gap-6">
            {/* Instagram small boxes group */}
            <div className="grid grid-cols-3 gap-1">
              <a
                href="https://www.instagram.com/reel/DVat94cjN5y/?igsh=amNpeHVkYWI4NWJn"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden rounded-lg group relative hover:scale-105 transition-all duration-300"
              >
                <img
                  src="/instagram1.jpg"
                  alt="Instagram"
                  className="w-full h-full object-cover"
                />
              </a>
              <a
                href="https://www.instagram.com/reel/DVHvfaqjBFi/?igsh=MnBsZmpoYWQ2Y3Zl"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden rounded-lg group relative hover:scale-105 transition-all duration-300"
              >
                <img
                  src="/instagram2.jpg"
                  alt="Instagram"
                  className="w-full h-full object-cover"
                />
              </a>
              <a
                href="https://www.instagram.com/reel/DQSOZP-jPJB/?igsh=ODRxdDQxdHp4NGw1"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden rounded-lg group relative hover:scale-105 transition-all duration-300"
              >
                <img
                  src="/instagram3.jpg"
                  alt="Instagram"
                  className="w-full h-full object-cover"
                />
              </a>
            </div>

            {/* TikTok small boxes group */}
            <div className="grid grid-cols-3 gap-1">
              <a
                href="https://vt.tiktok.com/ZSHrue6P7/"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden rounded-lg group relative hover:scale-105 transition-all duration-300"
              >
                <img
                  src="/tiktok1.jpeg"
                  alt="TikTok"
                  className="w-full h-full object-cover"
                />
              </a>
              <a
                href="https://vt.tiktok.com/ZSHru5qw9/"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden rounded-lg group relative hover:scale-105 transition-all duration-300"
              >
                <img
                  src="/tiktok2.jpg"
                  alt="TikTok"
                  className="w-full h-full object-cover"
                />
              </a>
              <a
                href="https://vt.tiktok.com/ZSHruh9xj/"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden rounded-lg group relative hover:scale-105 transition-all duration-300"
              >
                <img
                  src="/tiktok3.jpg"
                  alt="TikTok"
                  className="w-full h-full object-cover"
                />
              </a>
            </div>

            {/* Snapchat small boxes group */}
            <div className="grid grid-cols-3 gap-1">
              <a
                href="https://snapchat.com/t/XXFjSbcc"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden rounded-lg group relative hover:scale-105 transition-all duration-300"
              >
                <img
                  src="/snapchat1.jpg"
                  alt="Snapchat"
                  className="w-full h-full object-cover"
                />
              </a>
              <a
                href="https://snapchat.com/t/BRLaUOq1"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden rounded-lg group relative hover:scale-105 transition-all duration-300"
              >
                <img
                  src="/snapchat2.jpg"
                  alt="Snapchat"
                  className="w-full h-full object-cover"
                />
              </a>
              <a
                href="https://snapchat.com/t/NNnkM53x"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden rounded-lg group relative hover:scale-105 transition-all duration-300"
              >
                <img
                  src="/snapchat3.jpg"
                  alt="Snapchat"
                  className="w-full h-full object-cover"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="w-full px-6 md:px-12 py-16 max-w-[120rem] mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4">Sign up to our Newsletter</h2>
          <p className="font-paragraph text-secondary mb-8">
            Get exclusive deals and be the first to see and get discounts
          </p>
          <form onSubmit={handleNewsletterSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-6 py-4 border-2 border-secondary/30 rounded-lg font-paragraph focus:outline-none focus:border-accent-pink transition-colors"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-6 py-4 border-2 border-secondary/30 rounded-lg font-paragraph focus:outline-none focus:border-accent-pink transition-colors"
            />
            <button
              type="submit"
              className="w-full bg-foreground text-white font-paragraph font-bold px-6 py-4 rounded-lg hover:bg-accent-purple transition-colors"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}

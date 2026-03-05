import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-accent-pink to-accent-purple text-white py-24">
        <div className="max-w-[100rem] mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl">
              About Glowva <span className="italic">Skin</span>
            </h1>
            <p className="font-paragraph text-xl text-white/90 max-w-3xl mx-auto">
              Your Confidence Begins with Your Skin
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full py-20">
        <div className="max-w-5xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-12"
          >
            {/* Our Story */}
            <div className="space-y-6">
              <h2 className="font-heading text-4xl text-accent-pink">Our Story</h2>
              <p className="font-paragraph text-lg text-secondary leading-relaxed">
                At Glowva Skin, we believe that beautiful, healthy skin is the foundation of confidence. 
                We're dedicated to providing original, high-quality skincare products that help you achieve 
                your best skin yet. Our journey began with a simple mission: to make premium skincare 
                accessible to everyone who deserves to feel confident in their skin.
              </p>
              <p className="font-paragraph text-lg text-secondary leading-relaxed">
                Your skin deserves the best, and that's exactly what we deliver. From carefully curated 
                products to personalized recommendations, we're here to support your skincare journey 
                every step of the way.
              </p>
            </div>

            {/* How We Help You Glow */}
            <div className="bg-gradient-to-r from-accent-pink to-accent-purple rounded-3xl p-12 text-white">
              <h2 className="font-heading text-3xl mb-8 text-center">HOW WE HELP YOU GLOW:</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">▸</span>
                    <h3 className="font-heading text-xl">Original Skincare Products</h3>
                  </div>
                  <p className="font-paragraph text-white/90 pl-10">
                    We source only authentic, high-quality products from trusted brands worldwide.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">▸</span>
                    <h3 className="font-heading text-xl">Product Recommendations</h3>
                  </div>
                  <p className="font-paragraph text-white/90 pl-10">
                    Get expert advice tailored to your unique skin type and concerns.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">▸</span>
                    <h3 className="font-heading text-xl">Personalized Skincare Routines</h3>
                  </div>
                  <p className="font-paragraph text-white/90 pl-10">
                    Custom routines designed to help you achieve your skincare goals.
                  </p>
                </div>
              </div>
            </div>

            {/* Our Promise */}
            <div className="space-y-6">
              <h2 className="font-heading text-4xl text-accent-purple">Our Promise</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-accent-lavender/20 rounded-2xl p-8 space-y-4">
                  <h3 className="font-heading text-2xl text-accent-pink">Fast Delivery</h3>
                  <p className="font-paragraph text-secondary">
                    Nationwide and worldwide shipping to bring our products to your doorstep quickly and safely.
                  </p>
                </div>
                <div className="bg-accent-lavender/20 rounded-2xl p-8 space-y-4">
                  <h3 className="font-heading text-2xl text-accent-pink">Quality Guaranteed</h3>
                  <p className="font-paragraph text-secondary">
                    Every product is carefully selected and verified for authenticity and effectiveness.
                  </p>
                </div>
                <div className="bg-accent-lavender/20 rounded-2xl p-8 space-y-4">
                  <h3 className="font-heading text-2xl text-accent-pink">Expert Support</h3>
                  <p className="font-paragraph text-secondary">
                    Our team is here to help you find the perfect products for your skin.
                  </p>
                </div>
                <div className="bg-accent-lavender/20 rounded-2xl p-8 space-y-4">
                  <h3 className="font-heading text-2xl text-accent-pink">Customer First</h3>
                  <p className="font-paragraph text-secondary">
                    Your satisfaction and skin health are our top priorities.
                  </p>
                </div>
              </div>
            </div>

            {/* Closing Statement */}
            <div className="text-center py-12">
              <p className="font-heading text-3xl text-accent-purple italic">
                Your skin deserves the best...
              </p>
              <p className="font-paragraph text-xl text-secondary mt-4">
                And we're here to help you achieve it.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

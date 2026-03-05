import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Mail } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function OrderConfirmationPage() {
  const [searchParams] = useSearchParams();
  const orderRef = searchParams.get('ref');
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="w-full py-20">
        <div className="max-w-3xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-green-500/10 rounded-full"
            >
              <CheckCircle className="w-12 h-12 text-green-500" />
            </motion.div>

            <div className="space-y-4">
              <h1 className="font-heading text-4xl md:text-5xl text-foreground">
                Order Confirmed!
              </h1>
              <p className="font-paragraph text-lg text-secondary max-w-xl mx-auto">
                Thank you for your purchase. Your order has been successfully placed and is being processed.
              </p>
            </div>

            {orderRef && (
              <div className="bg-primary/10 border border-secondary/20 p-6 rounded-sm">
                <p className="font-paragraph text-sm text-secondary mb-2">
                  Order Reference
                </p>
                <p className="font-heading text-xl text-foreground">
                  {orderRef}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
              <div className="bg-background border border-secondary/20 p-8 text-left">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-accent-gold" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg text-foreground mb-2">
                      Confirmation Email
                    </h3>
                    <p className="font-paragraph text-sm text-secondary">
                      A confirmation email with your order details has been sent to your email address.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-background border border-secondary/20 p-8 text-left">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-accent-gold" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg text-foreground mb-2">
                      Order Processing
                    </h3>
                    <p className="font-paragraph text-sm text-secondary">
                      Your order is being prepared and will be shipped within 2-3 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 space-y-4">
              <Link to="/products">
                <button className="bg-accent-gold text-primary-foreground font-paragraph font-medium px-10 py-4 hover:opacity-90 transition-opacity">
                  Continue Shopping
                </button>
              </Link>
              <p className="font-paragraph text-sm text-secondary">
                Need help? Contact us at support@yourskincare.com
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

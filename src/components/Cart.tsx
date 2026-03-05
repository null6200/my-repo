import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/api';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { items, isOpen, getTotalPrice, updateQuantity, removeItem, closeCart } = useCartStore();
  const navigate = useNavigate();
  const totalPrice = getTotalPrice();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-foreground/60 z-50"
          />

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-secondary/20">
              <h2 className="font-heading text-2xl text-foreground">Your Cart</h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-primary/20 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <ShoppingBag className="w-16 h-16 text-secondary/40" />
                  <p className="font-paragraph text-secondary text-center">
                    Your cart is empty
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-6 border-b border-secondary/10">
                      {item.image && (
                        <div className="w-20 h-20 bg-primary/10 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 space-y-2">
                        <h3 className="font-paragraph font-medium text-foreground">
                          {item.name}
                        </h3>
                        <p className="font-paragraph text-sm text-secondary">
                          {formatPrice(item.price)}
                        </p>
                        
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1 hover:bg-primary/20 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4 text-foreground" />
                          </button>
                          <span className="font-paragraph text-sm font-medium text-foreground w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-primary/20 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4 text-foreground" />
                          </button>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-secondary hover:text-destructive transition-colors self-start"
                        aria-label="Remove item"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-secondary/20 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-xl text-foreground">Total</span>
                  <span className="font-heading text-2xl text-foreground">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full bg-accent-pink text-white font-paragraph font-bold px-8 py-4 rounded-lg hover:bg-accent-purple transition-all duration-300 shadow-lg hover:shadow-xl text-lg uppercase tracking-wide"
                >
                  Proceed to Checkout
                </button>
                
                <button
                  onClick={closeCart}
                  className="w-full bg-transparent text-foreground border-2 border-gray-300 font-paragraph font-medium px-8 py-3 rounded-lg hover:border-accent-pink hover:text-accent-pink transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

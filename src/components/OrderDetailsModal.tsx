import { X, Package, User, MapPin, Truck, CreditCard } from 'lucide-react';
import { formatPrice } from '@/lib/api';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderDetailsModalProps {
  order: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: OrderItem[];
    total: number;
    shippingCost: number;
    logistics: string;
    pickupLocation: string;
    state: string;
    city: string;
    shippingAddress: string;
    status: string;
    paymentStatus: string;
    paystackReference?: string;
    createdAt: string;
  };
  onClose: () => void;
}

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  const subtotal = order.total - order.shippingCost;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl text-foreground">Order Details</h2>
            <p className="font-paragraph text-sm text-secondary">Order #{order.orderNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-paragraph text-xs text-secondary mb-1">Order Status</p>
              <p className={`font-paragraph font-semibold ${
                order.status === 'Delivered' ? 'text-green-600' :
                order.status === 'Shipped' ? 'text-blue-600' :
                order.status === 'Processing' ? 'text-yellow-600' :
                'text-gray-600'
              }`}>
                {order.status}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-paragraph text-xs text-secondary mb-1">Payment Status</p>
              <p className={`font-paragraph font-semibold ${
                order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-600'
              }`}>
                {order.paymentStatus}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-paragraph text-xs text-secondary mb-1">Order Date</p>
              <p className="font-paragraph font-semibold text-foreground">
                {new Date(order.createdAt).toLocaleDateString('en-NG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-heading text-lg text-foreground mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-accent-pink" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-paragraph text-xs text-secondary mb-1">Name</p>
                <p className="font-paragraph text-foreground">{order.customerName}</p>
              </div>
              <div>
                <p className="font-paragraph text-xs text-secondary mb-1">Email</p>
                <p className="font-paragraph text-foreground">{order.customerEmail}</p>
              </div>
              <div>
                <p className="font-paragraph text-xs text-secondary mb-1">Phone</p>
                <p className="font-paragraph text-foreground">{order.customerPhone}</p>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-heading text-lg text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent-pink" />
              Shipping Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="font-paragraph text-xs text-secondary mb-1">Delivery Address</p>
                <p className="font-paragraph text-foreground">
                  {order.shippingAddress}, {order.city}, {order.state}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-paragraph text-xs text-secondary mb-1">Logistics Company</p>
                  <p className="font-paragraph text-foreground">{order.logistics}</p>
                </div>
                <div>
                  <p className="font-paragraph text-xs text-secondary mb-1">Pickup Location</p>
                  <p className="font-paragraph text-foreground">{order.pickupLocation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-heading text-lg text-foreground mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-accent-pink" />
              Order Items
            </h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <p className="font-paragraph font-medium text-foreground">{item.name}</p>
                    <p className="font-paragraph text-sm text-secondary">
                      Quantity: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="font-paragraph font-semibold text-foreground">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between font-paragraph text-secondary">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between font-paragraph text-secondary">
                <span>Delivery Fee</span>
                <span>{formatPrice(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between font-heading text-xl text-foreground pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          {order.paystackReference && (
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-heading text-lg text-foreground mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-accent-pink" />
                Payment Information
              </h3>
              <div>
                <p className="font-paragraph text-xs text-secondary mb-1">Paystack Reference</p>
                <p className="font-paragraph text-foreground font-mono text-sm">
                  {order.paystackReference}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="w-full bg-accent-pink text-white font-paragraph font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

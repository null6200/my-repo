import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { api, formatPrice } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

declare global {
  interface Window {
    PaystackPop?: {
      setup: (config: PaystackConfig) => {
        openIframe: () => void;
      };
    };
  }
}

interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  onClose: () => void;
  callback: (response: { reference: string }) => void;
}

interface CheckoutFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  deliveryMethod: 'door' | 'pickup';
  logisticsCompany: string;
  pickupLocation: string;
  deliveryInstructions: string;
}

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara'
];

const LOGISTICS_COMPANIES = [
  { name: 'GUO Transport', value: 'GUO' },
  { name: 'GIG Logistics', value: 'GIG' },
  { name: 'ABC Transport', value: 'ABC' },
  { name: 'PARK Logistics', value: 'PARK' }
];

const PICKUP_LOCATIONS: { [key: string]: { [state: string]: string[] } } = {
  'GUO': {
    'Abia': [
      'ABA - 23, Milverton Avenue',
      'UMUAHIA - 50 Mission Hill, Opposite Gado Hotels'
    ],
    'Adamawa': [
      'YOLA - Jambutu Park'
    ],
    'Anambra': [
      'AWKA - Unizik Junction, Beside Mobil Filling Station',
      'EKWULOBIA - 7, Awka Road',
      'IFITE-AWKA - Don-Greg Park, Before Unizik School Gate',
      'IHIALA - 42, Osha Owerri Road by Patigian Hotels',
      'NNEWI - 2, Ibeto Road, Opp. First Bank',
      'ONITSHA - 166, Port Harcourt Rd, Upper Iweka',
      'ONITSHA NM - 41 New Market Road, Opp. UBA Head Office',
      'UMUNZE - Round About'
    ],
    'Bauchi': [
      'BAUCHI - Maiduguri Bye Pass, Plaza Hotel'
    ],
    'Ebonyi': [
      'ABAKALIKI - New Park, Opposite International Market',
      'AFIKPO - 27, Eke Market Road, Opp. Zenith Bank'
    ],
    'Edo': [
      'BENIN - 211 Ugbowo-Lagos Rd, Technical Junction'
    ],
    'Enugu': [
      'ENUGU - 34 Okpara Avenue (Between UBA & Polaris Bank)'
    ],
    'FCT': [
      'GWARINPA - House 110, 4th Avenue, Chambia Plaza Road',
      'KUBWA - Lora Mall Plaza, Gado Nasko Road Phase 2',
      'MARARABA - Suite 9, Bomma Plaza, Sharp Corner',
      'UTAKO - GOUBA Plaza, 15 A. E. Ekukinam Street',
      'WUSE 2 - The RUBY Centre, 762 Aminu Kano Crescent',
      'ZUBA - Lagos Park'
    ],
    'Imo': [
      'AKOKWA - 10, Orlu Road, by Akokwa Roundabout',
      'ORLU - No 7 ASIKA ILOBI Avenue',
      'OWERRI - 15, Egbu Road',
      'UMUAKA - 6, Orlu Owerri Road, by Afor Umuaka'
    ],
    'Kaduna': [
      'KADUNA - Television Park',
      'KADUNA MANDO - Mando Park, Off NAF Kaduna',
      'ZARIA - Shop 8, Block C, Central Motor Park, Sabon Gari'
    ],
    'Kano': [
      'KANO - 14, New Road, Sabongari'
    ],
    'Lagos': [
      'AGEGE - 3, Agunbiade Oke-koto Street',
      'AJAH - KM 22, Epe Expressway, Abraham Adesanya Junction',
      'AJAH (ADDO RD) - Shodiya Odunlami Plaza, Addo Road',
      'ALABA - 29, Ojo Ebegbede Road, Opp. Chemist Bus-Stop',
      'AMUWO - Shop 11, Lawfel Mall, Festac Access Rd',
      'BALOGUN - 1st Floor, Alatise Plaza, Opp 33 7UP Plaza',
      'COKER - 36 Alhaji Orire Street, Wema Bank Bus Stop',
      'EJIGBO - 67A, Ikotun-Egbe Road, Opp Power Line',
      'IBA - Iyana School Bus Stop, Beside El-Shaddai Hospital',
      'IDDO - 7, Railway Compound, Otto Bus Stop',
      'IKEJA - 4 Kodesho Street, Opp Computer Village Flyover',
      'IKORODU - 37 Sagamu Road, Beside Police Station',
      'IKOSI-KETU - 9B Sanwo-Olu Intl Market, Prince S. Olujobi Block',
      'IKOTUN - 10 Ijegun Road',
      'IYANA IPAJA - KM 168 Abeokuta Expressway, Beside Access Bank',
      'JIBOWU - 2 Jibowu Street, Ikorodu Expressway',
      'LEKKI - Admiralty Mall, Block 10, Plot 1 Admiralty Rd',
      'MAZA MAZA - 1st Gate, Badagry Express Way',
      'OKOTA (CELE) - 164, Okota Road',
      'ORCHID ROAD - Unicity Mall, Shop A10, Oba Akinloye Dr',
      'OSAPA - Shore Mall, 6 Ganiu Eletu Way, Lekki Phase II',
      'OTTO - 7 Railway Compound, Otto Bus Stop',
      'SURULERE - 44, Ogunlana Drive',
      'TRADE FAIR - Shop D52, Akwaibom Plaza, Balogun Market'
    ],
    'Plateau': [
      'JOS - Zaria Bye Pass No.3, Along OLA Hospital Road'
    ],
    'Rivers': [
      'ADA GEORGE - 9 Ada George Road, Opp OPM Free School',
      'CHOBA-ALAKAHIA - Anwuri Pavilion, East-West Rd',
      'PORT HARCOURT - Aba Road, Opp Air Force Base'
    ],
    'Delta': [
      'ASABA - Asaba-Onitsha Expressway by Head-Bridge',
      'ASABA (TOWN) - Suite 6 Independence Mall, Okpanam Road'
    ],
    'Taraba': [
      'JALINGO - Opp. Coca Cola Depot, Mile 6, Yola Road'
    ],
    'Cross River': [
      'OGOJA - 4B Okuku Rd., Igoli Ogoja'
    ],
    'Akwa Ibom': [
      'UYO - KM 9, Ikot-Ekpene/Uyo Highway by Waterboard'
    ],
    'default': [
      'Contact Customer Service for Nearest Location'
    ]
  },
  'GIG': {
    'Lagos': ['Ikeja Hub', 'Yaba Office', 'Victoria Island'],
    'Abuja': ['Wuse Terminal', 'Gwarinpa Hub'],
    'default': ['Main Hub']
  },
  'ABC': {
    'Lagos': ['Ojota Terminal', 'Oshodi Park'],
    'Abuja': ['Jabi Terminal'],
    'default': ['Main Park']
  },
  'PARK': {
    'Lagos': ['Ojuelegba Terminal', 'Surulere Hub'],
    'Abuja': ['Area 1 Terminal'],
    'default': ['Main Terminal']
  }
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const totalPrice = getTotalPrice();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    city: '',
    state: '',
    country: 'Nigeria',
    postalCode: '',
    deliveryMethod: 'door',
    logisticsCompany: '',
    pickupLocation: '',
    deliveryInstructions: '',
  });
  const [shippingCost, setShippingCost] = useState(0);
  const [availablePickupLocations, setAvailablePickupLocations] = useState<string[]>([]);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/products');
    }
  }, [items, navigate]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => setPaystackLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Reset logistics fields when switching delivery method
    if (name === 'deliveryMethod') {
      setFormData(prev => ({
        ...prev,
        deliveryMethod: value as 'door' | 'pickup',
        logisticsCompany: '',
        pickupLocation: '',
      }));
      setAvailablePickupLocations([]);
      
      // Set base shipping cost for door delivery
      if (value === 'door') {
        setShippingCost(2500); // Default door delivery cost
      } else {
        setShippingCost(0); // Reset for pickup station
      }
    }

    // Update pickup locations when state or logistics company changes (for pickup station)
    if (name === 'state' || name === 'logisticsCompany') {
      const company = name === 'logisticsCompany' ? value : formData.logisticsCompany;
      const state = name === 'state' ? value : formData.state;
      
      if (formData.deliveryMethod === 'pickup' && company && state) {
        const locations = PICKUP_LOCATIONS[company]?.[state] || PICKUP_LOCATIONS[company]?.['default'] || [];
        setAvailablePickupLocations(locations);
        setFormData(prev => ({ ...prev, pickupLocation: '' }));
      }
    }

    // Calculate shipping cost for pickup station (placeholder - admin will set real prices later)
    if (name === 'logisticsCompany' && formData.deliveryMethod === 'pickup') {
      const baseCost = value === 'GUO' ? 2500 : value === 'GIG' ? 2000 : value === 'ABC' ? 1800 : 2200;
      setShippingCost(baseCost);
    }
  };

  const generateOrderReference = () => {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paystackLoaded || !window.PaystackPop) {
      alert('Payment system is loading. Please try again in a moment.');
      return;
    }

    setIsProcessing(true);

    const orderReference = generateOrderReference();
    const totalWithShipping = totalPrice + shippingCost;
    const amountInKobo = Math.round(totalWithShipping * 100);

    const handler = window.PaystackPop.setup({
      key: import.meta.env.PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxx',
      email: formData.customerEmail,
      amount: amountInKobo,
      currency: 'NGN',
      ref: orderReference,
      onClose: () => {
        setIsProcessing(false);
      },
      callback: async (response) => {
        try {
          const orderItems = items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          }));

          await api.createOrder({
            customer_name: formData.customerName,
            customer_email: formData.customerEmail,
            customer_phone: formData.customerPhone,
            shipping_address: formData.shippingAddress,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            postal_code: formData.postalCode,
            total_amount: totalPrice,
            order_status: 'Processing',
            payment_status: 'Paid',
            paystack_reference: response.reference,
            order_items: orderItems,
          });

          clearCart();
          navigate(`/order-confirmation?ref=${response.reference}`);
        } catch (error) {
          console.error('Failed to save order:', error);
          alert('Payment successful but failed to save order. Please contact support with reference: ' + response.reference);
        } finally {
          setIsProcessing(false);
        }
      },
    });

    handler.openIframe();
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="w-full py-12">
        <div className="max-w-[100rem] mx-auto px-8">
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 font-paragraph text-sm text-secondary hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shopping
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-12">
              Checkout
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="bg-background border border-secondary/20 p-8">
                    <h2 className="font-heading text-2xl text-foreground mb-6 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-accent-gold" />
                      Customer Information
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <label className="font-paragraph text-sm text-foreground mb-2 block">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="customerName"
                          required
                          value={formData.customerName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-background border border-secondary/30 text-foreground font-paragraph focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="font-paragraph text-sm text-foreground mb-2 block">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="customerEmail"
                            required
                            value={formData.customerEmail}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-background border border-secondary/30 text-foreground font-paragraph focus:outline-none focus:border-primary"
                          />
                        </div>

                        <div>
                          <label className="font-paragraph text-sm text-foreground mb-2 block">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            name="customerPhone"
                            required
                            value={formData.customerPhone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-background border border-secondary/30 text-foreground font-paragraph focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-background border border-secondary/20 p-8">
                    <h2 className="font-heading text-2xl text-foreground mb-6">
                      Shipping Address
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <label className="font-paragraph text-sm text-foreground mb-2 block">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          name="shippingAddress"
                          required
                          value={formData.shippingAddress}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-background border border-secondary/30 text-foreground font-paragraph focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="font-paragraph text-sm text-foreground mb-2 block">
                            City *
                          </label>
                          <input
                            type="text"
                            name="city"
                            required
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-background border border-secondary/30 text-foreground font-paragraph focus:outline-none focus:border-primary"
                          />
                        </div>

                        <div>
                          <label className="font-paragraph text-sm text-foreground mb-2 block">
                            State *
                          </label>
                          <select
                            name="state"
                            required
                            value={formData.state}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-background border border-secondary/30 text-foreground font-paragraph focus:outline-none focus:border-primary"
                          >
                            <option value="">Select State</option>
                            {NIGERIAN_STATES.map(state => (
                              <option key={state} value={state}>{state}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="font-paragraph text-sm text-foreground mb-2 block">
                            Country *
                          </label>
                          <input
                            type="text"
                            name="country"
                            required
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-background border border-secondary/30 text-foreground font-paragraph focus:outline-none focus:border-primary"
                            readOnly
                          />
                        </div>

                        <div>
                          <label className="font-paragraph text-sm text-foreground mb-2 block">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-background border border-secondary/30 text-foreground font-paragraph focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Method Section */}
                  <div className="bg-background border border-secondary/20 p-8">
                    <h2 className="font-heading text-2xl text-foreground mb-6">
                      Delivery Method
                    </h2>

                    <div className="space-y-6">
                      {/* Delivery Method Radio Buttons */}
                      <div>
                        <label className="font-paragraph text-sm text-foreground mb-3 block font-semibold">
                          How would you like to receive your order? *
                        </label>
                        <div className="space-y-3">
                          <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-accent-pink transition-colors">
                            <input
                              type="radio"
                              name="deliveryMethod"
                              value="door"
                              checked={formData.deliveryMethod === 'door'}
                              onChange={handleInputChange}
                              className="w-5 h-5 text-accent-pink focus:ring-accent-pink"
                            />
                            <div className="ml-3">
                              <span className="font-paragraph font-semibold text-foreground">Door Delivery</span>
                              <p className="text-xs text-secondary mt-1">Get your order delivered directly to your address</p>
                            </div>
                          </label>

                          <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-accent-pink transition-colors">
                            <input
                              type="radio"
                              name="deliveryMethod"
                              value="pickup"
                              checked={formData.deliveryMethod === 'pickup'}
                              onChange={handleInputChange}
                              className="w-5 h-5 text-accent-pink focus:ring-accent-pink"
                            />
                            <div className="ml-3">
                              <span className="font-paragraph font-semibold text-foreground">Pickup Station</span>
                              <p className="text-xs text-secondary mt-1">Pick up your order at a nearby logistics station</p>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Pickup Station Options - Only show if pickup is selected */}
                      {formData.deliveryMethod === 'pickup' && (
                        <>
                          <div>
                            <label className="font-paragraph text-sm text-foreground mb-2 block">
                              Logistics Company *
                            </label>
                            <select
                              name="logisticsCompany"
                              required
                              value={formData.logisticsCompany}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-background border border-secondary/30 text-foreground font-paragraph focus:outline-none focus:border-primary rounded-lg"
                            >
                              <option value="">Select Logistics Company</option>
                              {LOGISTICS_COMPANIES.map(company => (
                                <option key={company.value} value={company.value}>{company.name}</option>
                              ))}
                            </select>
                            <p className="mt-2 text-xs text-secondary">
                              Choose your preferred logistics company
                            </p>
                          </div>

                          {availablePickupLocations.length > 0 && (
                            <div>
                              <label className="font-paragraph text-sm text-foreground mb-2 block">
                                Pickup Location *
                              </label>
                              <select
                                name="pickupLocation"
                                required
                                value={formData.pickupLocation}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-background border border-secondary/30 text-foreground font-paragraph focus:outline-none focus:border-primary rounded-lg"
                              >
                                <option value="">Select Pickup Location</option>
                                {availablePickupLocations.map(location => (
                                  <option key={location} value={location}>{location}</option>
                                ))}
                              </select>
                              <p className="mt-2 text-xs text-secondary">
                                Select the nearest pickup location to you
                              </p>
                            </div>
                          )}
                        </>
                      )}

                      {/* Delivery Instructions */}
                      <div>
                        <label className="font-paragraph text-sm text-foreground mb-2 block">
                          Delivery Instructions (Optional)
                        </label>
                        <textarea
                          name="deliveryInstructions"
                          value={formData.deliveryInstructions}
                          onChange={(e) => handleInputChange(e as any)}
                          rows={3}
                          className="w-full px-4 py-3 bg-background border border-secondary/30 text-foreground font-paragraph focus:outline-none focus:border-primary rounded-lg resize-none"
                          placeholder="e.g., Leave package at the gate, Call before delivery, etc."
                        />
                        <p className="mt-2 text-xs text-secondary">
                          Add any special instructions for delivery
                        </p>
                      </div>

                      {/* Shipping Cost Display */}
                      {shippingCost > 0 && (
                        <div className="bg-accent-lavender/10 p-4 rounded-lg border border-accent-pink/20">
                          <div className="flex justify-between items-center">
                            <span className="font-paragraph text-sm font-semibold text-foreground">
                              {formData.deliveryMethod === 'door' ? 'Delivery' : 'Pickup'} Cost:
                            </span>
                            <span className="font-heading text-xl text-accent-pink font-bold">{formatPrice(shippingCost)}</span>
                          </div>
                          <p className="mt-2 text-xs text-secondary">
                            Estimated delivery: 3-5 business days
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <button
                      type="submit"
                      disabled={isProcessing || !paystackLoaded}
                      className="w-full bg-gradient-to-r from-accent-pink to-accent-purple text-white font-paragraph font-bold text-lg px-8 py-5 rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
                    >
                      {isProcessing ? (
                        <>Processing Payment...</>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Complete Payment with Paystack
                        </>
                      )}
                    </button>

                    <p className="font-paragraph text-xs text-secondary text-center">
                      🔒 Your payment information is secure and encrypted
                    </p>
                  </div>
                </form>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-background border border-secondary/20 p-8 sticky top-24">
                  <h2 className="font-heading text-2xl text-foreground mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        {item.image && (
                          <div className="w-16 h-16 bg-primary/10 flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-paragraph text-sm font-medium text-foreground">
                            {item.name}
                          </h3>
                          <p className="font-paragraph text-xs text-secondary">
                            Qty: {item.quantity}
                          </p>
                          <p className="font-paragraph text-sm text-foreground mt-1">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-secondary/20 pt-6 space-y-3">
                    <div className="flex justify-between font-paragraph text-sm">
                      <span className="text-secondary">Subtotal</span>
                      <span className="text-foreground">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between font-paragraph text-sm">
                      <span className="text-secondary">Shipping</span>
                      <span className="text-foreground">
                        {shippingCost > 0 ? formatPrice(shippingCost) : 'Select logistics'}
                      </span>
                    </div>
                    <div className="border-t border-secondary/20 pt-3 flex justify-between">
                      <span className="font-heading text-xl text-foreground">Total</span>
                      <span className="font-heading text-xl text-foreground">
                        {formatPrice(totalPrice + shippingCost)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

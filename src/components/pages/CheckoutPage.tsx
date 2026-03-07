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
    'Lagos': [
      'AJAH 1 - KM 25, Lekki-Epe Expressway, Ajiwe-Ajah',
      'AJAH 2 - KM 22, Lekki-Epe Expressway, by Abraham Adesanya Roundabout',
      'AKOWONJO - 41 Shasha Road, Akowonjo Junction, Dopemu',
      'ALABA - CS1 Ground Floor, CornerStone Plaza, Alaba International Market',
      'BROAD STREET - 158 Broad Street, Lagos Island (Behind UBA Head Office)',
      'CELE-OKOTA - 2 Okota Road, Beside Zenith Bank / 103 Okota Road',
      'ELEGANZA - Block B, Eleganza Shopping Mall, Lekki-Epe Express Road',
      'EPE - Animashaun Plaza, Beside Petrocam Filling Station',
      'FADEYI - 69 Ikorodu Road, Fadeyi',
      'FESTAC - 1st Avenue Road, Festac First Gate, Beside INEC Office',
      'GBAGADA - 7 Hospital Road, Ifako, Gbagada',
      'GBAGADA EXPRESS - No. 1 Sunday Ogunyade Street, Beside Eterna Filling Station',
      'IGANDO - Eunice Ato Filling Station, College Bus Stop',
      'IGBO EFON - KM 17, Scapular Plaza',
      'IKEJA - 9 Medical Road, Opposite Zenith Bank',
      'IKOYI - 103 Awolowo Road',
      'IKOTUN - 29 Idimu Road, Opp. Local Govt. Council',
      'ILUPEJU - 13C, Ilupeju Bypass',
      'TRADE FAIR - Shop D77 & D78, Abia Plaza, BBA',
      'IPAJA - 164 Lagos Abeokuta Express Way, Beside Diamond Bank',
      'JIBOWU - 20 Ikorodu Express Road',
      'LEKKI ADMIRALTY - No 1A, Wole Ariyo Street, Beside First Bank, Phase 1',
      'LEKKI 2 - Scapula Plaza, Lekki-Epe Express Road, Peninsula II',
      'OLD OJO ROAD - By Police Station',
      'OGBA - 3 Ijaiye Road, Beside FCMB',
      'OPEBI - 62 Opebi Road, Ikeja',
      'OYINGBO - No 25, Otto Causeway Opp Iddo Bus Stop',
      'SANGO - 3 Abeokuta-Lagos Expressway, Opp. Sango Bridge',
      'SURULERE - 78 Ogunlana Drive',
      'VICTORIA ISLAND - 1436 Sanusi Fafunwa Street',
      'VOLKS - 169 Badagry Expressway, Volkswagen Bus Stop',
      'YABA - Tejuosho Ultra Modern Market, Ojuelegba Road'
    ],
    'FCT': [
      'GARKI - Shop C11, Efab Plaza, Area 11',
      'GWARIMPA 1 - House 38, 3rd Avenue, Opposite Union Bank',
      'GWARIMPA 2 - Suite A1, Bricks and More Plaza, 4th Avenue',
      'GWAGWALADA - Ajibada Plaza, Shop 10, Plot 48, Along Park Road',
      'KUBWA - Block 43, Gado Nasko Way, Opp. 2/2 Court',
      'MARABA - 132, Giga Plaza, via Nyanya, Opp. Chrisgold Plaza',
      'MADALLA - Near Mobil Filling Station, Along Kaduna Express Road',
      'UTAKO 1 - Plot 113, I.V.W Osisiogu Str, Beside Utako Police Station',
      'UTAKO 2 - Suite A13, Abraham Plaza, Plot 6 Ekikunam Street',
      'WUSE - Plot 80 Aminu Kano Crescent, Opp. Shariff Plaza',
      'ZUBA - 206, Zuba Market, Opp. Lagos Line'
    ],
    'Rivers': [
      'PHC ADA GEORGE - 18 Ada George, By Okilton Junction',
      'PHC ALAKAHIA - Linus Book Shop Building, East-West Road',
      'PHC ARTILLERY - Cocaine Village Junction, Off Aba Road, Rumuogba',
      'PHC ELELENWO - 299 Old Refinery Road, By De-Young Junction',
      'PHC ELIOZU - Emmanuel Plaza, G.U. Ake Road, Beside Planet Filling Station',
      'PHC OLU OBASANJO - 61 Olu Obasanjo Road, Opposite Roundabout',
      'PHC PETER ODILI - 89 Peter Odili Road, Besides Eterna Filling Station',
      'PHC STADIUM ROAD - 9 Stadium Road, Beside Benjack',
      'PHC TOMBIA - 67 Tombia Ext, GRA',
      'PHC WOJI - Agora Plaza, 118 Woji Road, By Bodo Junction, GRA Phase 2',
      'PHC CHOBA - LACFOG PLAZA Adjacent Choba Police Station, East-west Road'
    ],
    'Oyo': [
      'IBADAN 1 - Town Planning Complex, By Sumal Foods, Ring Road',
      'IBADAN 2 - Suite 5, Kamal Memorial Plaze, Bodija-UI Road',
      'IBADAN 3 - Bovas Filling Station, 106/107 Agbaakin Layout, Iwo Road',
      'IBADAN 4 - Block E2, Preboye Shopping Complex Sango Ojoo',
      'OGBOMOSHO - Eterna Filling Station, Opposite Zenith Bank, Starlight'
    ],
    'Abia': [
      'ABA 1 - No 5, Asa Road, Former/Old Nitel Building',
      'ABA 2 - 30 Brass Street, G.R.A, After Jevinic Restaurant',
      'UMUAHIA 1 - 8 Mission Hill, Opposite Villaroy Hotel',
      'UMUAHIA 2 - 60 Aba Road, Close to MTN Office',
      'UMUAHIA 3 - Aba-Port-Harcourt Expressway, Ohiya'
    ],
    'Anambra': [
      'AWKA - Elite Shopping Complex, Enugu/Onitsha Expressway',
      'ONITSHA - 2 Awka Road, By DMGS Junction, Beside All Saints Cathedral',
      'NNEWI - No 73 Owerri Road, Martina Chukwuma Plaza (Innoson Plaza)'
    ],
    'Bauchi': [
      'BAUCHI - Shop 7, Yandoka Road, Adjacent MTN office'
    ],
    'Bayelsa': [
      'YENAGOA - Kpansia Epia, Opposite Wema Bank by INEC Junction'
    ],
    'Benue': [
      'MAKURDI - No 4, Old Otukpo Road, Opposite Dester\'s'
    ],
    'Cross River': [
      'CALABAR - 29 Ndidem Usang Iso Road (Aka Marian Road)'
    ],
    'Delta': [
      'ASABA 1 - Asaba Onitsha Expressway, By Head Bridge',
      'ASABA 2 - 445, Nnebisi Road, Opposite Zenith Bank',
      'WARRI 1 - 138, Effurun-Sapele Rd, By Airport Junction',
      'WARRI 2 - 116, Effurun-Sapele Warri Road, Effurun'
    ],
    'Ebonyi': [
      'ABAKALIKI - 1A, Ogoja Road (Beside Ecobank)'
    ],
    'Edo': [
      'BENIN AKPAKPAVA - 112, Akpakpava Road',
      'BENIN AIRPORT - Shop 1, Omegatron Plaza, 47 Airport Road',
      'BENIN RAMAT PARK - 42, Benin/Agbor Road, Oregbeni',
      'BENIN USELU - 202, Uselu Lagos Road, Ugbowo',
      'AUCHI - Okene Express Way, Opp Auchi Polytechnic',
      'EKPOMA - Ukpenu Road Opp. Grail Message Centre, Akahia'
    ],
    'Ekiti': [
      'ADO EKITI - Sola Dola Filling Station, Along Ikere Road, Ajilosun'
    ],
    'Enugu': [
      'ENUGU 1 - 7, Market Road, Holy Ghost Park, Opp. State Library',
      'ENUGU 2 - 67, Zik Avenue Uwani'
    ],
    'Imo': [
      'OWERRI - Plot C31, Relief Road, by Relief Junction, Off Egbu Road'
    ],
    'Kaduna': [
      'KADUNA 1 - 8 Ahmadu Bello Way, Off Kastina Roundabout',
      'KADUNA 2 - Lagos Garage by Airforce Mami Mando',
      'KADUNA 3 - Nnamdi Azikiwe Expressway, By Command Junction',
      'ZARIA - Dairu Garba Plaza, 18 Sokoto Road, MTD Junction'
    ],
    'Kano': [
      'KANO - 69 Murtala Mohammed Way / No 1 Bompai Road'
    ],
    'Kwara': [
      'ILORIN 1 - 190, Ibrahim Taiwo Road, Adjacent Chicken Republic/UBA',
      'ILORIN 2 - No 1 Umar Audi road, Fate Road, Tanke GRA'
    ],
    'Nasarawa': [
      'LAFIA - Shops 1 & 2 Police Officers Mess, Opposite Polaris Bank'
    ],
    'Niger': [
      'MINNA - Shop J4, Awalu Ibrahim Shopping Complex, Tunga'
    ],
    'Ogun': [
      'ABEOKUTA 1 - 62, Tinubu Street, Ita Eko',
      'ABEOKUTA 2 - Alumni Building, Federal University of Agric (FUNAAB)',
      'IJEBU ODE - 102 Ibadan Road, Opposite NEPA Office',
      'SANGO OTTA - 3 Abeokuta-Lagos Expressway, Beside 9mobile Office'
    ],
    'Ondo': [
      'AKURE - No 22 Oyemekun Road by Cathedral Junction'
    ],
    'Osun': [
      'OSOGBO - Ogo Oluwa Bus Stop, Gbangan/Ibadan Road',
      'GBONGAN - Gbongan Branch'
    ],
    'Plateau': [
      'JOS 1 - Suite B3, Emerald Royal Plaza, Zaramangada',
      'JOS 2 - Angwan Soya Zaria Road Bypass'
    ],
    'Sokoto': [
      'SOKOTO - 3/4 Maiduguri Road, Gawon Nama Area'
    ],
    'Taraba': [
      'JALINGO - 106 White Castle Plaza, Barde Way'
    ],
    'Yobe': [
      'DAMATURU - Zainami Plaza, Shop Z15, Gujba Roundabout'
    ],
    'default': ['Contact Customer Service for Nearest Location']
  },
  'ABC': {
    'Abia': [
      'ABA - 2, Ikot Ekpene Road',
      'UMUAHIA - 8 Mission Hill'
    ],
    'Anambra': [
      'ONITSHA - Onitsha-Asaba Expressway, Opp Ogbaru Main Market'
    ],
    'Akwa Ibom': [
      'UYO - Long Distance Bus Terminal, Park Road, Itam'
    ],
    'Bayelsa': [
      'YENAGOA - No 47, Erepa Road, Opposite The Rainbow Hospital'
    ],
    'Cross River': [
      'CALABAR - Calabar Terminal'
    ],
    'Delta': [
      'WARRI - 194 PTI Road, Effurun'
    ],
    'Edo': [
      'BENIN - By Terminal Resort & Park, Ovbiogie'
    ],
    'Enugu': [
      'ENUGU - 122 Ogui Road, Beside Union Bank Plc',
      'NGWO - 9th Mile Corner, Ngwo'
    ],
    'FCT': [
      'UTAKO - 36 Ekukinam Street, Utako District (off Berger Junction)',
      'GWAGWALADA - Jibeco Nigeria Ltd, Gwagwalada'
    ],
    'Imo': [
      'OWERRI - Km 5, MCC Uratta Road, Umuoba Uratta',
      'MBAISE - Mbaise Terminal'
    ],
    'Kogi': [
      'LOKOJA - Lokoja Terminal'
    ],
    'Ogun': [
      'IJEBU ODE - Ijebu Ode Branch'
    ],
    'Plateau': [
      'JOS - Jos Terminal'
    ],
    'Rivers': [
      'PORT HARCOURT - Eliozu Junction, East/West Road'
    ],
    'Lagos': [
      'AMUWO-ODOFIN - Plot 79, Oba Kayode Akinyemi Way, by Festac Bypass',
      'BOLADE OSHODI - 129 Agege Motor Road, Oshodi',
      'JIBOWU - 22 Ikorodu Road, Yaba',
      'IKEJA CARGO - 2 Simbiat Abiola Way, Computer Village',
      'LEKKI/JAKANDE - Opposite Jakande 1st Gate, Lekki Expressway',
      'AJAH - Km 51 Lekki-Epe Expressway, opposite Enyo fueling station',
      'OKOTA - Block H, Atinuke Shopping Complex, 129 Okota Rd',
      'MAZAMAZA - No 35 Old Ojo Road, by Dandolas Park',
      'FADEYI - 52C Ikorodu Road, Fadeyi (Head Office)',
      'ALABA - Alaba International Market area',
      'AKOWONJO - Akowonjo area',
      'FESTAC - Festac Town',
      'IKORODU - Ikorodu area',
      'TEJUOSHO - Tejuosho Market area',
      'BALOGUN - Balogun area',
      'OGBA - Ogba area',
      'AWOYAYA - Awoyaya area',
      'IKOTUN - Ikotun area',
      'IDIMU - Idimu area',
      'LEKKI PHASE 1 - Lekki Phase 1',
      'IYANA IPAJA - Iyana Ipaja area'
    ],
    'default': ['Contact Customer Service for Nearest Location']
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

// HPI 1.7-G
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { ArrowRight, Droplets, ShieldCheck, Sparkles, FlaskConical } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// --- Utility Components ---

const SectionDivider = () => (
  <div className="w-full flex justify-center items-center py-12 opacity-20">
    <div className="h-px w-full max-w-[120rem] bg-foreground/30" />
  </div>
);

const ParallaxImage = ({ src, alt, className, speed = 0.1 }: { src: string, alt: string, className?: string, speed?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="w-full h-[120%] relative -top-[10%]">
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
        />
      </motion.div>
    </div>
  );
};

const FadeIn = ({ children, delay = 0, className }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- Main Component ---

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Placeholder URL for all images as per instructions
  const PLACEHOLDER_IMG = "https://static.wixstatic.com/media/07c53c_c6d97d4cf6b144959793310590cb498d~mv2.png?originWidth=1152&originHeight=704";

  // Static data for display (preserving intent of original code but enhancing presentation)
  const philosophyPoints = [
    {
      id: "01",
      title: "Precision Formulation",
      description: "Each product is crafted with scientifically proven ingredients at optimal pH levels for maximum efficacy.",
      icon: FlaskConical
    },
    {
      id: "02",
      title: "Transparent Science",
      description: "We believe in full transparency. Every ingredient, percentage, and benefit is clearly documented.",
      icon: ShieldCheck
    },
    {
      id: "03",
      title: "Tailored Solutions",
      description: "Personalized recommendations based on your unique skin type and concerns.",
      icon: Droplets
    }
  ];

  const featuredProducts = [
    { name: "Hydrating Serum", price: "$85.00", type: "Restore" },
    { name: "Night Recovery", price: "$120.00", type: "Repair" },
    { name: "Daily Protection", price: "$65.00", type: "Defend" }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-accent-lavender via-background to-white text-foreground overflow-x-hidden selection:bg-accent-pink/30">
      <Header />

      {/* --- Hero Section --- */}
      <section className="w-full min-h-[70vh] px-4 sm:px-6 md:px-12 py-8 md:py-12 lg:py-16 max-w-[120rem] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-4 md:space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-accent-purple mb-2">
                Glowva <span className="italic text-accent-pink">Skin</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight text-accent-pink">
                Your Confidence Begins with Your Skin
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-gradient-to-r from-accent-pink to-accent-purple rounded-2xl p-4 md:p-6 text-white shadow-xl"
            >
              <h3 className="font-heading text-lg sm:text-xl md:text-2xl mb-4 md:mb-6 border-b border-white/30 pb-3 md:pb-4">HOW WE HELP YOU GLOW:</h3>
              <ul className="space-y-3 md:space-y-4 text-left">
                <li className="flex items-start gap-2 md:gap-3">
                  <span className="text-2xl md:text-3xl">▸</span>
                  <span className="font-paragraph text-base md:text-lg">Original skincare products</span>
                </li>
                
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link to="/products" className="group">
                <button className="bg-accent-pink text-white font-paragraph font-semibold px-10 py-4 rounded-full hover:bg-accent-purple transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto">
                  Shop Now
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Hero Image */}
          <div className="relative h-[40vh] sm:h-[50vh] lg:h-[70vh] order-1 lg:order-2">
            <motion.div 
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="w-full h-full rounded-3xl overflow-hidden shadow-2xl"
            >
              <img 
                src={PLACEHOLDER_IMG} 
                alt="Glowva Skin Products" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent-purple/30 to-transparent"></div>
            </motion.div>

            {/* Delivery Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute top-3 right-3 sm:top-6 sm:right-6 bg-accent-lavender/90 backdrop-blur-sm rounded-full px-3 py-2 sm:px-6 sm:py-4 shadow-lg border-2 border-white"
            >
              <p className="font-paragraph text-[10px] sm:text-xs font-semibold text-accent-purple uppercase tracking-wide text-center">
                Fast Delivery<br/>Nationwide &<br/>Worldwide
              </p>
            </motion.div>

            {/* Bottom Tagline */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 bg-accent-purple/95 backdrop-blur-sm px-4 py-2 sm:px-8 sm:py-4 rounded-full shadow-xl"
            >
              <p className="font-heading text-sm sm:text-base md:text-lg lg:text-xl text-white italic text-center">
                Your skin deserves the best...
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* --- Marquee Section --- */}
      <section className="py-6 md:py-8 overflow-hidden bg-primary/5 border-y border-foreground/5">
        <div className="flex whitespace-nowrap">
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            className="flex gap-16 items-center"
          >
            {[...Array(4)].map((_, i) => (
              <React.Fragment key={i}>
                <span className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground/10 uppercase tracking-widest">Precision</span>
                <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-accent-gold/40"></span>
                <span className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground/10 uppercase tracking-widest">Formulation</span>
                <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-accent-gold/40"></span>
                <span className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground/10 uppercase tracking-widest">Transparency</span>
                <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-accent-gold/40"></span>
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- Philosophy Section (Sticky Scroll) --- */}
      <section className="relative w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 max-w-[120rem] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
          
          {/* Sticky Title Area */}
          <div className="lg:sticky lg:top-32 h-fit space-y-4 md:space-y-6">
            <FadeIn>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-foreground leading-none">
                Our <br /> Philosophy
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="font-paragraph text-lg text-secondary max-w-md">
                We bridge the gap between clinical efficacy and luxury experience. Our approach is grounded in three immutable pillars.
              </p>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="h-px w-24 bg-accent-gold mt-8"></div>
            </FadeIn>
          </div>

          {/* Scrollable Content Cards */}
          <div className="space-y-16 lg:space-y-24 pt-8 lg:pt-0">
            {philosophyPoints.map((point, index) => (
              <FadeIn key={point.id} className="group">
                <div className="flex flex-col gap-6 relative">
                  {/* Decorative Number */}
                  <span className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-foreground/5 absolute -top-12 sm:-top-16 md:-top-20 -left-6 sm:-left-8 md:-left-10 -z-10 select-none group-hover:text-accent-gold/10 transition-colors duration-700">
                    {point.id}
                  </span>
                  
                  <div className="w-16 h-16 bg-primary/20 flex items-center justify-center rounded-full mb-4 text-foreground group-hover:bg-accent-gold group-hover:text-white transition-colors duration-500">
                    <point.icon size={28} strokeWidth={1.5} />
                  </div>
                  
                  <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl text-foreground">
                    {point.title}
                  </h3>
                  
                  <p className="font-paragraph text-lg text-secondary leading-relaxed max-w-lg">
                    {point.description}
                  </p>

                  <div className="w-full h-[200px] md:h-[250px] mt-6 overflow-hidden rounded-sm relative">
                     <div className="absolute inset-0 bg-foreground/5 z-10 group-hover:bg-transparent transition-colors duration-500" />
                     <img 
                       src={PLACEHOLDER_IMG} 
                       alt={point.title} 
                       className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
                     />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* --- Featured Collection (Horizontal Scroll Preview) --- */}
      <section className="w-full py-12 sm:py-16 md:py-20 bg-foreground text-background overflow-hidden">
        <div className="max-w-[120rem] mx-auto px-4 sm:px-6 md:px-12 mb-6 sm:mb-8 md:mb-10 flex justify-between items-end">
          <FadeIn>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">Signature Formulations</h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Link to="/products" className="hidden md:flex items-center gap-2 font-paragraph text-accent-gold hover:text-white transition-colors">
              View All <ArrowRight size={18} />
            </Link>
          </FadeIn>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="w-full overflow-x-auto pb-8 sm:pb-12 px-4 sm:px-6 md:px-12 scrollbar-hide">
          <div className="flex gap-4 sm:gap-6 md:gap-8 w-max">
            {featuredProducts.map((product, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="w-[250px] sm:w-[300px] md:w-[400px] group cursor-pointer"
              >
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-secondary/10 mb-6">
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex items-center justify-center">
                    <span className="font-paragraph text-white border border-white/30 px-6 py-2 backdrop-blur-sm">Quick View</span>
                  </div>
                  <img 
                    src={PLACEHOLDER_IMG} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-paragraph text-xs text-accent-gold uppercase tracking-wider mb-1">{product.type}</p>
                    <h3 className="font-heading text-xl sm:text-2xl text-background group-hover:text-accent-gold transition-colors">{product.name}</h3>
                  </div>
                  <span className="font-paragraph text-lg text-secondary">{product.price}</span>
                </div>
              </motion.div>
            ))}
            
            {/* "See More" Card */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-[250px] sm:w-[300px] md:w-[400px] flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <Link to="/products" className="flex flex-col items-center gap-4 text-center p-8">
                <span className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-accent-gold">
                  <ArrowRight size={24} />
                </span>
                <span className="font-heading text-xl sm:text-2xl">Explore Full<br/>Collection</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- The Ritual (Narrative Section) --- */}
      <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-12 max-w-[120rem] mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="font-paragraph text-accent-gold text-sm uppercase tracking-[0.2em]">The Daily Ritual</span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-4 text-foreground">Elevate Your Routine</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent"></div>

          {[
            { step: "01", title: "Cleanse", desc: "Remove impurities without stripping natural oils." },
            { step: "02", title: "Treat", desc: "Target specific concerns with potent active ingredients." },
            { step: "03", title: "Protect", desc: "Lock in moisture and shield against environmental stressors." }
          ].map((item, idx) => (
            <FadeIn key={idx} delay={idx * 0.2} className="relative flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-background border border-foreground/10 rounded-full flex items-center justify-center z-10 mb-8 group-hover:border-accent-gold transition-colors duration-500">
                <span className="font-heading text-3xl text-foreground group-hover:text-accent-gold transition-colors">{item.step}</span>
              </div>
              <div className="w-full aspect-square overflow-hidden rounded-full max-w-[200px] mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
                 <img src={PLACEHOLDER_IMG} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl mb-3">{item.title}</h3>
              <p className="font-paragraph text-secondary max-w-xs">{item.desc}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-12 bg-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeIn>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl text-foreground mb-6 sm:mb-8">
              Begin Your Journey
            </h2>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <p className="font-paragraph text-base sm:text-lg md:text-xl text-secondary mb-8 sm:mb-12 max-w-2xl mx-auto">
              Explore our collection of meticulously formulated products, each designed to address specific skin concerns with scientific precision.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <Link to="/products">
              <button className="bg-accent-gold text-white font-paragraph font-medium px-12 py-5 text-lg hover:bg-foreground transition-colors duration-500 inline-flex items-center gap-3 shadow-xl shadow-accent-gold/20">
                View All Products
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
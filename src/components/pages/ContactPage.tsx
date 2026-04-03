import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitMessage('Thank you for contacting us! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
              Contact Us
            </h1>
            <p className="font-paragraph text-xl text-white/90 max-w-3xl mx-auto">
              We'd love to hear from you. Get in touch with our team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full py-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="font-heading text-4xl text-accent-pink mb-6">Get In Touch</h2>
                <p className="font-paragraph text-lg text-secondary leading-relaxed">
                  Have questions about our products or need skincare advice? We're here to help! 
                  Reach out to us and our team will get back to you as soon as possible.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                <div className="flex items-start gap-4 bg-accent-lavender/20 rounded-2xl p-6">
                  <div className="bg-accent-pink text-white p-3 rounded-full">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl text-foreground mb-2">Email Us</h3>
                    <a href="mailto:hello@glowvaskin.com" className="font-paragraph text-accent-pink hover:text-accent-purple transition-colors">
                      hello@glowvaskin.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-accent-lavender/20 rounded-2xl p-6">
                  <div className="bg-accent-pink text-white p-3 rounded-full">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl text-foreground mb-2">Call Us</h3>
                    <a href="tel:+2348067394465" className="font-paragraph text-accent-pink hover:text-accent-purple transition-colors">
                      +234 806 739 4465
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-accent-lavender/20 rounded-2xl p-6">
                  <div className="bg-accent-pink text-white p-3 rounded-full">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl text-foreground mb-2">WhatsApp</h3>
                    <a href="https://wa.me/2348067394465" className="font-paragraph text-accent-pink hover:text-accent-purple transition-colors">
                      0806 739 4465
                    </a>
                    <p className="font-paragraph text-secondary mt-2">
                      For more enquiries, visit our WhatsApp
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-accent-lavender/20 rounded-2xl p-6">
                  <div className="bg-accent-pink text-white p-3 rounded-full">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl text-foreground mb-2">Visit Us</h3>
                    <p className="font-paragraph text-secondary">
                      Lagos, Nigeria
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-gradient-to-r from-accent-pink to-accent-purple rounded-2xl p-8 text-white">
                <h3 className="font-heading text-2xl mb-4">Business Hours</h3>
                <div className="space-y-2 font-paragraph">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
            >
              <h2 className="font-heading text-3xl text-accent-purple mb-8">Send Us a Message</h2>
              
              {submitMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                  {submitMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block font-paragraph font-semibold text-foreground mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-accent-lavender rounded-lg font-paragraph focus:outline-none focus:border-accent-pink transition-colors"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-paragraph font-semibold text-foreground mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-accent-lavender rounded-lg font-paragraph focus:outline-none focus:border-accent-pink transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block font-paragraph font-semibold text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-accent-lavender rounded-lg font-paragraph focus:outline-none focus:border-accent-pink transition-colors"
                    placeholder="+234 800 000 0000"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block font-paragraph font-semibold text-foreground mb-2">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-accent-lavender rounded-lg font-paragraph focus:outline-none focus:border-accent-pink transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent-pink text-white font-paragraph font-bold px-8 py-4 rounded-full hover:bg-accent-purple transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 bg-accent-lavender/10">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl text-accent-purple mb-4">
            Ready to Start Your Skincare Journey?
          </h2>
          <p className="font-paragraph text-lg text-secondary mb-8">
            Explore our collection of premium skincare products
          </p>
          <a
            href="/products"
            className="inline-block bg-accent-pink text-white font-paragraph font-bold px-10 py-4 rounded-full hover:bg-accent-purple transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Shop Now
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

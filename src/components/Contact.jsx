import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Store",
      details: ["123 Luxury Avenue", "Fashion District, NY 10001", "United States"]
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+1 (555) 123-4567", "+1 (555) 765-4321"]
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@luxebags.com", "support@luxebags.com"]
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Mon - Fri: 9AM - 7PM", "Sat: 10AM - 6PM", "Sun: Closed"]
    }
  ];

  return (
    <div className="min-h-screen bg-(--base-1)">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold text-(--text) mb-6"
          >
            Get in <span className="bg-gradient-to-r from-(--main-1) to-(--main-2) bg-clip-text text-transparent">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg text-(--text-4) max-w-2xl mx-auto"
          >
            Have questions about our luxury bags? We're here to help. Reach out to our team
            and we'll get back to you as soon as possible.
          </motion.p>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-(--text) mb-8">Contact Information</h2>

              <div className="space-y-8">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-(--main-1)/10 to-(--main-2)/10 rounded-xl flex items-center justify-center border border-(--main-1)/20 flex-shrink-0">
                      <info.icon className="w-6 h-6 text-(--main-1)" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-(--text) mb-2">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-(--text-4)">{detail}</p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Map Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="mt-12 h-64 bg-(--base-2) rounded-2xl flex items-center justify-center border border-(--base-3)"
              >
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-(--main-1) mx-auto mb-4" />
                  <p className="text-(--text-4)">Interactive Map Coming Soon</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-(--text) mb-8">Send us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-(--text) mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-(--base-2) border border-(--base-3) rounded-xl text-(--text) placeholder-(--text-4) focus:outline-none focus:ring-2 focus:ring-(--main-1) focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-(--text) mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-(--base-2) border border-(--base-3) rounded-xl text-(--text) placeholder-(--text-4) focus:outline-none focus:ring-2 focus:ring-(--main-1) focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-(--text) mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-(--base-2) border border-(--base-3) rounded-xl text-(--text) placeholder-(--text-4) focus:outline-none focus:ring-2 focus:ring-(--main-1) focus:border-transparent"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-(--text) mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-(--base-2) border border-(--base-3) rounded-xl text-(--text) placeholder-(--text-4) focus:outline-none focus:ring-2 focus:ring-(--main-1) focus:border-transparent resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-8 py-4 bg-gradient-to-r from-(--main-1) to-(--main-2) text-(--text) font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-(--base-2)">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-(--text) mb-4">Frequently Asked Questions</h2>
            <p className="text-(--text-4)">Quick answers to common questions about our luxury bags.</p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "Do you offer international shipping?",
                answer: "Yes, we ship worldwide with premium packaging and insurance for all orders over $500."
              },
              {
                question: "What is your return policy?",
                answer: "We offer a 30-day return policy for all unused items in original condition with tags attached."
              },
              {
                question: "Are your bags authentic leather?",
                answer: "All our bags are crafted from premium genuine leather sourced from sustainable suppliers."
              },
              {
                question: "Do you offer customization?",
                answer: "Yes, we offer custom engraving and color options for select collections. Contact us for details."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-(--base-1) rounded-xl p-6 border border-(--base-3)"
              >
                <h3 className="text-lg font-semibold text-(--text) mb-2">{faq.question}</h3>
                <p className="text-(--text-4)">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

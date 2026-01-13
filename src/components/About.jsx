import { motion } from "framer-motion";
import { Award, Users, Heart, Shield } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

export default function About() {
  const values = [
    {
      icon: Award,
      title: "Premium Quality",
      description: "Every bag is crafted with the finest materials and attention to detail."
    },
    {
      icon: Heart,
      title: "Passionate Craftsmanship",
      description: "Our artisans pour their heart into creating timeless pieces."
    },
    {
      icon: Shield,
      title: "Sustainable Luxury",
      description: "Committed to ethical sourcing and environmentally conscious practices."
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Your satisfaction and trust are at the center of everything we do."
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
            About <span className="bg-gradient-to-r from-(--main-1) to-(--main-2) bg-clip-text text-transparent">Luxe Bags</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg text-(--text-4) max-w-2xl mx-auto"
          >
            Crafting luxury handbags that blend timeless elegance with modern sophistication.
            Each piece tells a story of exceptional craftsmanship and unparalleled quality.
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-(--text) mb-6">Our Story</h2>
              <p className="text-(--text-4) mb-6">
                Founded in 2009, Luxe Bags began as a small workshop with a vision to revolutionize
                the luxury handbag industry. What started as a passion project has grown into a
                global brand known for its innovative designs and commitment to excellence.
              </p>
              <p className="text-(--text-4) mb-6">
                We believe that a luxury bag is more than just an accessory—it's an expression of
                personal style, a companion for life's important moments, and a testament to the
                artistry of skilled craftsmanship.
              </p>
              <p className="text-(--text-4)">
                Today, we continue to push boundaries, combining traditional techniques with
                contemporary aesthetics to create pieces that are both functional and breathtakingly beautiful.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-1 gap-4">
                <img
                  src="/assets/WhatsApp Image 2025-11-23 at 00.24.44_2c0e37b7.jpg"
                  alt="Luxe Bags craftsmanship"
                  className="rounded-2xl shadow-2xl w-full h-48 object-cover"
                />
                <img
                  src="/assets/b1.jpg"
                  alt="Premium materials"
                  className="rounded-2xl shadow-2xl w-full h-48 object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-(--base-2)">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-(--text) mb-4">Our Values</h2>
            <p className="text-(--text-4) max-w-2xl mx-auto">
              The principles that guide everything we do, from design to delivery.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-(--main-1)/10 to-(--main-2)/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-(--main-1)/20">
                  <value.icon className="w-8 h-8 text-(--main-1)" />
                </div>
                <h3 className="text-xl font-semibold text-(--text) mb-2">{value.title}</h3>
                <p className="text-(--text-4)">{value.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Showcase Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <img
              src="/assets/b2.jpg"
              alt="Craftsmanship detail"
              className="rounded-xl shadow-lg w-full h-48 object-cover"
            />
            <img
              src="/assets/WhatsApp Image 2025-11-23 at 00.24.44_b803d73a.jpg"
              alt="Design process"
              className="rounded-xl shadow-lg w-full h-48 object-cover"
            />
            <img
              src="/assets/WhatsApp Image 2025-11-23 at 00.24.47_9d34577a.jpg"
              alt="Finished product"
              className="rounded-xl shadow-lg w-full h-48 object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-(--text) mb-12">By the Numbers</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-(--main-1) mb-2">15+</div>
              <div className="text-(--text-4)">Years of Excellence</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-(--main-1) mb-2">10K+</div>
              <div className="text-(--text-4)">Happy Customers</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-(--main-1) mb-2">500+</div>
              <div className="text-(--text-4)">Premium Bags</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-(--main-1) mb-2">4.9★</div>
              <div className="text-(--text-4)">Average Rating</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

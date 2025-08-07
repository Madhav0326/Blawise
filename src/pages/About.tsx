import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20 px-6 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold mb-5 mt-8"
        >
          About Blawise
        </motion.h1>
        <p className="text-lg max-w-3xl mx-auto">
          We’re democratizing access to expertise, making knowledge and guidance available to everyone, everywhere.
        </p>
      </section>

      {/* Our Mission */}
      <section className="bg-gray-50 py-20 px-6 md:px-24 text-center">
        <h2 className="text-3xl font-bold text-purple-600 mb-4">Our Mission</h2>
        <p className="text-gray-600 max-w-4xl mx-auto text-lg">
          At Blawise, we believe that everyone deserves access to expert knowledge and guidance.
          Whether you're a student struggling with homework, an entrepreneur building a business,
          or someone learning a new skill, we connect you with verified experts who can help you succeed.
        </p>
      </section>

      {/* Why We Started + Stats */}
      <section className="py-20 px-6 md:px-24 grid md:grid-cols-2 gap-10 items-center bg-white">
        <div>
          <h3 className="text-2xl font-semibold mb-4">Why We Started Blawise</h3>
          <p className="text-gray-700 text-base leading-relaxed">
            In today’s fast-paced world, finding the right expertise at the right time can be challenging.
            Traditional consulting is often expensive and inaccessible to many who need it most.
            We created Blawise to break down these barriers — offering affordable, on-demand access
            to experts across every field imaginable — from fitness training to rocket science.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 bg-purple-50 p-8 rounded-xl shadow text-center text-purple-800 font-semibold">
          <div>
            <p className="text-3xl font-bold">10,000+</p>
            <p className="text-sm">Expert Consultants</p>
          </div>
          <div>
            <p className="text-3xl font-bold">50+</p>
            <p className="text-sm">Categories</p>
          </div>
          <div>
            <p className="text-3xl font-bold">99.9%</p>
            <p className="text-sm">Uptime</p>
          </div>
          <div>
            <p className="text-3xl font-bold">24/7</p>
            <p className="text-sm">Support</p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-gray-50 py-20 px-6 md:px-24 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Values</h2>
        <p className="text-gray-600 mb-12 text-base max-w-3xl mx-auto">
          The principles that guide everything we do
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "🛡️",
              title: "Expert Quality",
              desc: "Every consultant is verified and vetted to ensure you get the best advice possible.",
            },
            {
              icon: "🌍",
              title: "Global Reach",
              desc: "Connect with experts from around the world, available in multiple time zones.",
            },
            {
              icon: "⚡",
              title: "Fair Pricing",
              desc: "Transparent per-minute pricing set by consultants. No hidden fees.",
            },
          ].map((value, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
              <p className="text-sm text-gray-600">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Story */}
      <section className="py-20 px-6 md:px-24 bg-gradient-to-br from-purple-50 to-blue-50 text-center">
        <h2 className="text-3xl font-bold text-purple-700 mb-6">The Blawise Story</h2>
        <p className="max-w-4xl mx-auto text-gray-700 text-lg mb-10 leading-relaxed">
          Blawise was born from a simple observation: in our hyper-connected world,
          people still struggle to find the right expertise when they need it most.
          Whether it’s getting help with a workout routine, learning to code, or
          understanding complex business strategies — the barriers to quality guidance remained high.
          <br /><br />
          We set out to change that by creating a platform where expertise meets accessibility,
          where anyone with knowledge can share it, and anyone seeking guidance can find it instantly.
        </p>
        <div className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto text-gray-700">
          <h3 className="text-xl font-semibold mb-2">Building the Future of Learning</h3>
          <p>
            Today, Blawise serves thousands of users worldwide — facilitating millions of minutes
            of consultations across hundreds of categories. From homework help to business consulting,
            we make expertise accessible 24/7 — and we’re just getting started.
          </p>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 px-6 md:px-24 bg-white text-center">
        <h2 className="text-3xl font-bold mb-4">Our Team</h2>
        <p className="max-w-3xl mx-auto text-gray-600 text-base">
          Our diverse team of engineers, designers, and domain experts works tirelessly
          to provide the best possible experience for both consultants and clients.
          We're always looking for passionate individuals who share our mission.
        </p>
      </section>
    </div>
  );
}
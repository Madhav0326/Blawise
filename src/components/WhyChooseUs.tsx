import { motion } from "framer-motion";

const features = [
  {
    title: "Verified Experts",
    desc: "Each consultant is screened and verified to ensure quality and trust.",
    icon: "🛡️"
  },
  {
    title: "Multiple Communication Channels",
    desc: "Choose between Text, Voice, or Video — consult your way.",
    icon: "💬"
  },
  {
    title: "Pay-per-Minute",
    desc: "No subscriptions. Only pay for what you use.",
    icon: "⏱️"
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-[#f5f6fc]">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-[#0a0a33]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Why Choose Blawise?
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="bg-[#3737e8] text-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.2 }}
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
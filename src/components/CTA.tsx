import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="bg-blue-400 py-16 rounded-t-3xl">
      <div className="max-w-4xl mx-auto text-center px-4">
        <motion.h2
          className="text-3xl font-bold text-[#0a0a33]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Ready to Get Expert Advice?
        </motion.h2>
        <p className="mt-2 text-[#0a0a33] text-sm md:text-base">
          Join thousands of satisfied users who’ve found the perfect consultant.
        </p>

        <div className="mt-6 flex justify-center gap-4 flex-wrap">
          <button className="bg-[#0a0a33] text-white px-6 py-2 rounded hover:bg-[#1a1a5c] transition">
            Browse Experts
          </button>
          <button className="border border-[#0a0a33] text-[#ffffff] px-6 py-2 rounded hover:bg-[#0a0a33] transition">
            Start Consulting
          </button>
        </div>
      </div>
    </section>
  );
}
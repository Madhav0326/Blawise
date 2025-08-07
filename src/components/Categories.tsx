import { motion } from 'framer-motion';

const categories = [
  "Psychology", "Career Guidance", "Nutrition", "Health & Fitness",
  "Education", "Legal Advice", "Astrology", "Finance & Tax"
];

export default function Categories() {
  return (
    <section className="py-16 bg-[#f5f6fc]">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-[#0a0a33]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Explore Categories
        </motion.h2>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-5 justify-items-center">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              className="bg-white text-[#0a0a33] px-6 py-3 rounded-md shadow hover:shadow-lg cursor-pointer font-medium text-center w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              {cat}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
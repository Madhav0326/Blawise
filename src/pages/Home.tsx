import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import TopConsultants from "@/components/TopConsultants";
import WhyChooseUs from "@/components/WhyChooseUs";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="bg-background text-foreground">
      <Hero />
      <Categories />
      <TopConsultants />
      <WhyChooseUs />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedMedicines from "@/components/home/FeaturedMedicines";
import HowItWorks from "@/components/home/HowItWorks";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import TrustBanner from "@/components/home/TrustBanner";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <CategoriesSection />
        <FeaturedMedicines />
        <HowItWorks />
        <TestimonialsSection />
        <TrustBanner />
      </main>
      <Footer />
    </>
  );
}

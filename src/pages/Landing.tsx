import { Navigation } from "@/components/landing/Navigation";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { QuickDecisionSection } from "@/components/landing/QuickDecisionSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { Footer } from "@/components/landing/Footer";

const Landing = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <div id="features">
        <FeaturesSection />
      </div>
      <QuickDecisionSection />
      <div id="testimonials">
        <TestimonialsSection />
      </div>
      <Footer />
    </main>
  );
};

export default Landing;
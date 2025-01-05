import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { QuickDecisionSection } from "@/components/landing/QuickDecisionSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { Footer } from "@/components/landing/Footer";
import { Navigation } from "@/components/landing/Navigation";

const Landing = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#1A1F2C]">
      {/* Main background gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#1A1F2C] via-[#222222] to-[#1E1E3F] -z-20" />
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900" />
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent" />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="fixed inset-0 grid-pattern opacity-10 -z-10" />
      
      {/* Enhanced accent gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[90px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navigation />
        <HeroSection />
        <FeaturesSection />
        <QuickDecisionSection />
        <TestimonialsSection />
        <Footer />
      </div>
    </div>
  );
};

export default Landing;
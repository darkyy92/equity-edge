import { ArrowRight, LineChart, Brain, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Primary gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F2C] via-[#222222] to-[#1E1E3F]" />
      
      {/* Grid pattern overlay with enhanced opacity */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 grid-pattern opacity-20" />
      </div>
      
      {/* Accent gradients for depth */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4" />
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in relative z-10">
        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          <span className="px-3 py-1 rounded-full bg-black/20 text-white backdrop-blur-sm border border-white/10">
            Powered by AI
          </span>
        </div>
        
        <h1 className="text-4xl md:text-7xl font-bold text-white">
          AI-Powered Stock Analysis
        </h1>
        
        <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
          Make smarter investment decisions with our advanced AI analysis platform. Get real-time insights, comprehensive analysis, and data-driven recommendations.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/dashboard">
            <Button size="lg" className="group bg-black/20 backdrop-blur-sm hover:bg-black/30 text-white border border-white/10">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="backdrop-blur-sm border-white/10 text-white hover:bg-black/20">
            Watch Demo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="flex items-center gap-3 justify-center p-4 rounded-lg backdrop-blur-sm bg-black/20 border border-white/5">
            <LineChart className="h-5 w-5 text-white" />
            <span className="text-white/80">Real-time Analysis</span>
          </div>
          <div className="flex items-center gap-3 justify-center p-4 rounded-lg backdrop-blur-sm bg-black/20 border border-white/5">
            <Brain className="h-5 w-5 text-white" />
            <span className="text-white/80">AI-Driven Insights</span>
          </div>
          <div className="flex items-center gap-3 justify-center p-4 rounded-lg backdrop-blur-sm bg-black/20 border border-white/5">
            <Shield className="h-5 w-5 text-white" />
            <span className="text-white/80">Risk Management</span>
          </div>
        </div>
      </div>
    </div>
  );
};
import { ArrowRight, LineChart, Brain, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 pb-16 overflow-hidden">
      {/* Primary gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F2C] via-[#222222] to-[#1E1E3F]" />
      
      {/* Colorful gradient overlays */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900" />
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent" />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 grid-pattern opacity-40" />
      </div>
      
      {/* Enhanced accent gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[90px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in relative z-10 px-4">
        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          <span className="px-3 py-1 rounded-full bg-black/20 text-white backdrop-blur-sm border border-white/10">
            Powered by AI
          </span>
        </div>
        
        <div className="space-y-2 mb-8">
          <h1 className="text-4xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-white to-blue-100">
            Trade Smarter with
          </h1>
          <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text leading-tight">
            AI-Powered Intelligence
          </h1>
        </div>
        
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
          <div className="flex items-center gap-3 justify-center p-4 rounded-lg backdrop-blur-sm bg-black/20 border border-white/5 hover:bg-black/30 transition-colors">
            <LineChart className="h-5 w-5 text-white" />
            <span className="text-white/80">Real-time Analysis</span>
          </div>
          <div className="flex items-center gap-3 justify-center p-4 rounded-lg backdrop-blur-sm bg-black/20 border border-white/5 hover:bg-black/30 transition-colors">
            <Brain className="h-5 w-5 text-white" />
            <span className="text-white/80">AI-Driven Insights</span>
          </div>
          <div className="flex items-center gap-3 justify-center p-4 rounded-lg backdrop-blur-sm bg-black/20 border border-white/5 hover:bg-black/30 transition-colors">
            <Shield className="h-5 w-5 text-white" />
            <span className="text-white/80">Risk Management</span>
          </div>
        </div>
      </div>
    </div>
  );
};
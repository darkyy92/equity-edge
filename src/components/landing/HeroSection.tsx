import { ArrowRight, LineChart, Brain, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Primary gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black/90 to-black/80" />
      
      {/* Accent gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4" />
      </div>
      
      {/* Grid pattern with enhanced opacity control */}
      <div className="absolute inset-0 grid-pattern opacity-10" />
      
      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/40" />

      <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in relative z-10">
        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary backdrop-blur-sm border border-primary/20">
            Powered by AI
          </span>
        </div>
        
        <h1 className="text-4xl md:text-7xl font-bold">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
            AI-Powered Stock Analysis
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
          Make smarter investment decisions with our advanced AI analysis platform. Get real-time insights, comprehensive analysis, and data-driven recommendations.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/dashboard">
            <Button size="lg" className="group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="backdrop-blur-sm border-primary/20 hover:bg-primary/10">
            Watch Demo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="flex items-center gap-3 justify-center p-4 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10">
            <LineChart className="h-5 w-5 text-primary" />
            <span className="text-muted-foreground">Real-time Analysis</span>
          </div>
          <div className="flex items-center gap-3 justify-center p-4 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10">
            <Brain className="h-5 w-5 text-primary" />
            <span className="text-muted-foreground">AI-Driven Insights</span>
          </div>
          <div className="flex items-center gap-3 justify-center p-4 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-muted-foreground">Risk Management</span>
          </div>
        </div>
      </div>
    </div>
  );
};
import { ArrowRight, LineChart, Brain, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden hero-gradient">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in relative z-10">
        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">
            Powered by AI
          </span>
        </div>
        
        <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
          AI-Powered Stock Analysis
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
          Make smarter investment decisions with our advanced AI analysis platform. Get real-time insights, comprehensive analysis, and data-driven recommendations.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/dashboard">
            <Button size="lg" className="group">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Button variant="outline" size="lg">
            Watch Demo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="flex items-center gap-3 justify-center">
            <LineChart className="h-5 w-5 text-primary" />
            <span className="text-muted-foreground">Real-time Analysis</span>
          </div>
          <div className="flex items-center gap-3 justify-center">
            <Brain className="h-5 w-5 text-primary" />
            <span className="text-muted-foreground">AI-Driven Insights</span>
          </div>
          <div className="flex items-center gap-3 justify-center">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-muted-foreground">Risk Management</span>
          </div>
        </div>
      </div>
    </div>
  );
};
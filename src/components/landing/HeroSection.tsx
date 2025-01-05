import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-background to-accent/20">
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          AI-Powered Stock Analysis
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground">
          Make smarter investment decisions with our advanced AI analysis platform
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/dashboard">
            <Button size="lg" className="group">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
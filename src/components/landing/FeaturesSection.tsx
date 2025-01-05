import { Brain, TrendingUp, Shield, Zap, ChartBar, Globe, Clock, Target } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced algorithms analyze market trends and company fundamentals to provide accurate insights"
  },
  {
    icon: TrendingUp,
    title: "Real-Time Insights",
    description: "Get up-to-date recommendations and market analysis with continuous data updates"
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Understand potential risks and opportunities for each investment with detailed risk metrics"
  },
  {
    icon: Zap,
    title: "Quick Actions",
    description: "Act on insights with our intuitive dashboard interface and one-click actions"
  },
  {
    icon: ChartBar,
    title: "Technical Analysis",
    description: "Advanced charting tools and technical indicators for in-depth market analysis"
  },
  {
    icon: Globe,
    title: "Global Markets",
    description: "Access insights from markets worldwide with our comprehensive coverage"
  },
  {
    icon: Clock,
    title: "Historical Data",
    description: "Deep historical analysis to identify patterns and market trends"
  },
  {
    icon: Target,
    title: "Custom Alerts",
    description: "Set personalized alerts for price movements and market opportunities"
  }
];

export const FeaturesSection = () => {
  return (
    <div className="relative py-32 bg-background overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Powerful Features for Smart Investing
          </h2>
          <p className="text-xl text-muted-foreground">
            Our platform combines cutting-edge AI technology with comprehensive market data to help you make informed investment decisions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg glass-card hover-scale"
            >
              <feature.icon className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
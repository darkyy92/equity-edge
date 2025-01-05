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
    <div className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-100 via-white to-blue-100">
            Powerful Features for Smart Investing
          </h2>
          <p className="text-xl text-white/80">
            Our platform combines cutting-edge AI technology with comprehensive market data to help you make informed investment decisions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-colors"
            >
              <feature.icon className="h-12 w-12 mb-4 text-blue-400" />
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
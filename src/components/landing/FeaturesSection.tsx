import { Brain, TrendingUp, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced algorithms analyze market trends and company fundamentals"
  },
  {
    icon: TrendingUp,
    title: "Real-Time Insights",
    description: "Get up-to-date recommendations and market analysis"
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Understand potential risks and opportunities for each investment"
  },
  {
    icon: Zap,
    title: "Quick Actions",
    description: "Act on insights with our intuitive dashboard interface"
  }
];

export const FeaturesSection = () => {
  return (
    <div className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">
          Powerful Features for Smart Investing
        </h2>
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
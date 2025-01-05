import { Clock, Target, Brain, Zap } from "lucide-react";

export const QuickDecisionSection = () => {
  return (
    <div className="relative py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/70" />
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4" />
      </div>
      <div className="absolute inset-0 grid-pattern opacity-10" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Make Faster, Smarter Investment Decisions
          </h2>
          <p className="text-xl text-muted-foreground">
            Our AI-powered platform streamlines your investment process, helping you make informed decisions quickly and confidently.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-lg glass-card hover-scale">
            <Clock className="h-12 w-12 mb-6 text-primary" />
            <h3 className="text-2xl font-semibold mb-4">Real-Time Analysis</h3>
            <p className="text-muted-foreground">
              Get instant insights on market movements and stock performance, allowing you to act quickly on opportunities.
            </p>
          </div>
          
          <div className="p-8 rounded-lg glass-card hover-scale">
            <Target className="h-12 w-12 mb-6 text-primary" />
            <h3 className="text-2xl font-semibold mb-4">Precision Targeting</h3>
            <p className="text-muted-foreground">
              Identify optimal entry and exit points with our advanced technical analysis and AI predictions.
            </p>
          </div>
          
          <div className="p-8 rounded-lg glass-card hover-scale">
            <Brain className="h-12 w-12 mb-6 text-primary" />
            <h3 className="text-2xl font-semibold mb-4">AI-Driven Insights</h3>
            <p className="text-muted-foreground">
              Let our AI analyze vast amounts of market data to surface the most promising opportunities.
            </p>
          </div>
          
          <div className="p-8 rounded-lg glass-card hover-scale">
            <Zap className="h-12 w-12 mb-6 text-primary" />
            <h3 className="text-2xl font-semibold mb-4">Quick Actions</h3>
            <p className="text-muted-foreground">
              Execute your strategy with one-click actions based on our AI recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
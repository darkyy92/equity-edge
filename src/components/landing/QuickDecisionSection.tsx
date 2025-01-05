import { Clock, Target, Brain, Zap } from "lucide-react";

export const QuickDecisionSection = () => {
  return (
    <div className="relative py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F2C]/80 via-[#222222]/70 to-[#1E1E3F]/60" />
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[90px] -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-100 via-white to-blue-100">
            Make Faster, Smarter Investment Decisions
          </h2>
          <p className="text-xl text-white/80">
            Our AI-powered platform streamlines your investment process, helping you make informed decisions quickly and confidently.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-lg backdrop-blur-sm bg-black/20 border border-white/10 hover:bg-black/30 transition-all hover:scale-[1.02] duration-300">
            <Clock className="h-12 w-12 mb-6 text-blue-400" />
            <h3 className="text-2xl font-semibold mb-4 text-white">Real-Time Analysis</h3>
            <p className="text-white/70">
              Get instant insights on market movements and stock performance, allowing you to act quickly on opportunities.
            </p>
          </div>
          
          <div className="p-8 rounded-lg backdrop-blur-sm bg-black/20 border border-white/10 hover:bg-black/30 transition-all hover:scale-[1.02] duration-300">
            <Target className="h-12 w-12 mb-6 text-purple-400" />
            <h3 className="text-2xl font-semibold mb-4 text-white">Precision Targeting</h3>
            <p className="text-white/70">
              Identify optimal entry and exit points with our advanced technical analysis and AI predictions.
            </p>
          </div>
          
          <div className="p-8 rounded-lg backdrop-blur-sm bg-black/20 border border-white/10 hover:bg-black/30 transition-all hover:scale-[1.02] duration-300">
            <Brain className="h-12 w-12 mb-6 text-indigo-400" />
            <h3 className="text-2xl font-semibold mb-4 text-white">AI-Driven Insights</h3>
            <p className="text-white/70">
              Let our AI analyze vast amounts of market data to surface the most promising opportunities.
            </p>
          </div>
          
          <div className="p-8 rounded-lg backdrop-blur-sm bg-black/20 border border-white/10 hover:bg-black/30 transition-all hover:scale-[1.02] duration-300">
            <Zap className="h-12 w-12 mb-6 text-blue-400" />
            <h3 className="text-2xl font-semibold mb-4 text-white">Quick Actions</h3>
            <p className="text-white/70">
              Execute your strategy with one-click actions based on our AI recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
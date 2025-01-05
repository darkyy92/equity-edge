import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Investment Analyst",
    content: "This platform has revolutionized how I analyze stocks. The AI-powered insights have helped me make more informed decisions.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Portfolio Manager",
    content: "The real-time analysis and risk management features are outstanding. It's become an essential tool in my investment strategy.",
    rating: 5
  },
  {
    name: "Emma Davis",
    role: "Day Trader",
    content: "The technical analysis tools combined with AI recommendations give me a competitive edge in the market.",
    rating: 5
  }
];

export const TestimonialsSection = () => {
  return (
    <div className="py-24 bg-background/50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          What Our Users Say
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-6 rounded-lg glass-card hover-scale">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">{testimonial.content}</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
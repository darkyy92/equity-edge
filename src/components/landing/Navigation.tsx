import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-black/20 backdrop-blur-lg border-b border-white/10" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/lovable-uploads/7661dd9d-dc3b-4bb9-958a-cf142b8196e4.png" alt="Equity Edge Logo" className="h-20 w-auto" />
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection("features")} 
            className="text-white/80 hover:text-white transition-colors"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection("testimonials")} 
            className="text-white/80 hover:text-white transition-colors"
          >
            Testimonials
          </button>
          <Link 
            to="/dashboard" 
            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
};
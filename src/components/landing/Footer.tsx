import { Mail, Copyright, Link as LinkIcon } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-12 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <img src="/lovable-uploads/7661dd9d-dc3b-4bb9-958a-cf142b8196e4.png" alt="Equity Edge Logo" className="h-16 w-auto" />
            <p className="text-white/70">
              Advanced AI-powered stock analysis for smarter investment decisions.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-blue-400">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-white/70 hover:text-white transition-colors">Features</a>
              </li>
              <li>
                <a href="#testimonials" className="text-white/70 hover:text-white transition-colors">Testimonials</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-blue-400">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors">Documentation</a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors">API Reference</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-blue-400">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-white/70">
                <Mail className="h-4 w-4" />
                <span>support@equityedge.ai</span>
              </li>
              <li className="flex items-center space-x-2 text-white/70">
                <LinkIcon className="h-4 w-4" />
                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10">
          <div className="flex items-center justify-between text-sm text-white/60">
            <div className="flex items-center space-x-1">
              <Copyright className="h-4 w-4" />
              <span>{new Date().getFullYear()} Equity Edge. All rights reserved.</span>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
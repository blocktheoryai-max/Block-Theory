import { ChartLine, Twitter, Github, Linkedin } from "lucide-react";
import { SiDiscord } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
              <ChartLine className="text-primary mr-2 h-6 w-6" />
              TradeTutor
            </h3>
            <p className="text-slate-400 mb-4">
              Empowering the next generation of crypto traders through education, simulation, and community.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                <SiDiscord className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Learn</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Beginner Courses</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Advanced Strategies</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Market Analysis</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Risk Management</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Tools</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Trading Simulator</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Portfolio Tracker</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Market Data</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Price Alerts</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Community Forum</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary transition-colors">API Documentation</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            &copy; 2025 TradeTutor. Built for crypto learners, by crypto believers.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Terms of Service</a>
            <a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

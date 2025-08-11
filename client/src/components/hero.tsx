import { Play, ChartLine } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const handleStartLearning = () => {
    const learnSection = document.getElementById('learn');
    learnSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTrySimulator = () => {
    const simulateSection = document.getElementById('simulate');
    simulateSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="gradient-hero py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
          Master Crypto Trading<br />
          <span className="text-primary">One Lesson at a Time</span>
        </h2>
        <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
          Interactive lessons, real-time simulations, and adaptive learning paths designed to transform crypto beginners into confident traders.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            onClick={handleStartLearning}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-semibold text-lg h-auto shadow-lg"
          >
            <Play className="mr-2 h-5 w-5" />
            Start Learning Free
          </Button>
          <Button 
            onClick={handleTrySimulator}
            variant="outline"
            className="bg-white hover:bg-slate-50 text-slate-800 px-8 py-4 rounded-xl font-semibold text-lg h-auto shadow-lg border border-slate-200"
          >
            <ChartLine className="mr-2 h-5 w-5" />
            Try Simulator
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900">50K+</div>
            <div className="text-slate-600">Active Learners</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900">200+</div>
            <div className="text-slate-600">Lessons</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900">95%</div>
            <div className="text-slate-600">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900">24/7</div>
            <div className="text-slate-600">Market Data</div>
          </div>
        </div>
      </div>
    </section>
  );
}

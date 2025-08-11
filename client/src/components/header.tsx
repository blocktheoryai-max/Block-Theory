import { ChartLine, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export default function Header() {
  const { data: prices } = useQuery({
    queryKey: ['/api/prices'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const portfolioValue = "10,247.85";
  const portfolioChange = "+2.3%";

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-primary flex items-center">
              <ChartLine className="mr-2" />
              TradeTutor
            </h1>
            <nav className="hidden md:flex space-x-8">
              <a href="#learn" className="text-slate-600 hover:text-primary transition-colors font-medium">
                Learn
              </a>
              <a href="#simulate" className="text-slate-600 hover:text-primary transition-colors font-medium">
                Simulate
              </a>
              <a href="#nft" className="text-slate-600 hover:text-primary transition-colors font-medium">
                NFTs
              </a>
              <a href="#cryptocurrency" className="text-slate-600 hover:text-primary transition-colors font-medium">
                Cryptocurrency
              </a>
              <a href="#analyze" className="text-slate-600 hover:text-primary transition-colors font-medium">
                Analyze
              </a>
              <a href="#community" className="text-slate-600 hover:text-primary transition-colors font-medium">
                Community
              </a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-sm text-slate-600">
                <span>${portfolioValue}</span>
                <span className="text-success text-xs ml-1">{portfolioChange}</span>
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Sign In
            </Button>
            <Button variant="ghost" className="md:hidden text-slate-600" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

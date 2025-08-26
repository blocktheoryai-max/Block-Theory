import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Shield, Zap, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function LaunchEnhancementBanner() {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-4 border-b border-purple-500/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Badge className="bg-yellow-500 text-yellow-900 border-0 font-semibold">
              <Star className="h-3 w-3 mr-1" />
              NEW
            </Badge>
            <p className="text-sm sm:text-base font-medium">
              🚀 <strong>Enterprise-Ready Platform:</strong> Complete feature showcase with real market data, professional design & scalable architecture
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <Shield className="h-3 w-3" />
              <Zap className="h-3 w-3" />
              <TrendingUp className="h-3 w-3" />
            </div>
            <Button 
              size="sm" 
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold"
              asChild
            >
              <Link href="/enterprise-showcase">
                View Showcase
                <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
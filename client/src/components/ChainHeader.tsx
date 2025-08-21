import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BookOpen, Play, BarChart3, Users, Crown } from "lucide-react";

export function ChainHeader() {
  return (
    <header className="blockchain-gradient-subtle border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo with animated chain links */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              {/* Animated chain links */}
              <div className="chain-link w-6 h-6 border-2 border-primary rounded border-l-transparent"></div>
              <div className="chain-pulse w-6 h-6 border-2 border-primary rounded border-r-transparent"></div>
              <div className="chain-link w-6 h-6 border-2 border-primary rounded border-l-transparent"></div>
            </div>
            <span className="text-2xl font-bold text-primary">Block Theory</span>
          </Link>

          {/* Navigation - Learning First */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/learn" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
              <BookOpen className="w-4 h-4" />
              <span className="font-medium">Learn</span>
            </Link>
            <Link href="/simulate" className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
              <Play className="w-4 h-4" />
              <span>Simulate</span>
            </Link>
            <Link href="/analyze" className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
              <BarChart3 className="w-4 h-4" />
              <span>Analyze</span>
            </Link>
            <Link href="/community" className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
              <Users className="w-4 h-4" />
              <span>Community</span>
            </Link>
          </nav>

          {/* Premium CTA */}
          <div className="flex items-center space-x-4">
            <Link href="/pricing">
              <Button className="premium-glow bg-primary hover:bg-primary/90 text-primary-foreground">
                <Crown className="w-4 h-4 mr-2" />
                Go Premium
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
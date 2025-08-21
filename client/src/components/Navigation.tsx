import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { TrendingUp, BookOpen, BarChart3, FileText, Users, DollarSign, Fish, Activity } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: TrendingUp },
    { path: "/learn", label: "Learn", icon: BookOpen },
    { path: "/simulate", label: "Simulate", icon: BarChart3 },
    { path: "/analyze", label: "Analyze", icon: FileText },
    { path: "/technical-analysis", label: "Technical Analysis", icon: Activity },
    { path: "/whale-tracker", label: "Whale Tracker", icon: Fish },
    { path: "/community", label: "Community", icon: Users },
    { path: "/pricing", label: "Pricing", icon: DollarSign },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold">Block Theory</h1>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          <div className="md:hidden">
            <Button variant="outline" size="sm">
              Menu
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
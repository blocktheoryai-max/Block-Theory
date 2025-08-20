import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, Users, BarChart3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  const navItems = [
    {
      name: "Learn",
      path: "/learn",
      icon: BookOpen,
      tutorial: "learn-link"
    },
    {
      name: "Simulate", 
      path: "/simulate",
      icon: TrendingUp,
      tutorial: "simulate-link"
    },
    {
      name: "Analyze",
      path: "/analyze", 
      icon: BarChart3,
      tutorial: "analyze-link"
    },
    {
      name: "Community",
      path: "/community",
      icon: Users,
      tutorial: "community-link"
    }
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center space-x-1 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link 
                key={item.path} 
                href={item.path}
                data-tutorial={item.tutorial}
              >
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 transition-all duration-200",
                    isActive && "bg-blue-600 text-white shadow-sm"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
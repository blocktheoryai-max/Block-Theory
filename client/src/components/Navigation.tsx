import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { TrendingUp, BookOpen, BarChart3, FileText, Users, DollarSign, Fish, Activity } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navigation() {
  const [location] = useLocation();
  const { translate } = useLanguage();

  const navItems = [
    { path: "/", label: translate("nav.home", "Home"), icon: TrendingUp },
    { path: "/learn", label: translate("nav.learn", "Learn"), icon: BookOpen },
    { path: "/simulate", label: translate("nav.simulate", "Simulate"), icon: BarChart3 },
    { path: "/analyze", label: translate("nav.analyze", "Analyze"), icon: FileText },
    { path: "/technical-analysis", label: translate("nav.technical_analysis", "Technical Analysis"), icon: Activity },
    { path: "/whale-tracker", label: translate("nav.whale_tracker", "Whale Tracker"), icon: Fish },
    { path: "/community", label: translate("nav.community", "Community"), icon: Users },
    { path: "/pricing", label: translate("nav.pricing", "Pricing"), icon: DollarSign },
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

          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <div className="md:hidden">
              <Button variant="outline" size="sm">
                {translate("nav.menu", "Menu")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
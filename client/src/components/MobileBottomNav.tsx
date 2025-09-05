import { Link, useLocation } from "wouter";
import { 
  Home, 
  BookOpen, 
  TrendingUp,
  Trophy,
  Wallet,
  Copy
} from "lucide-react";

export default function MobileBottomNav() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/learn", label: "Learn", icon: BookOpen },
    { path: "/copy-trading", label: "Copy", icon: Copy },
    { path: "/portfolio", label: "Portfolio", icon: Wallet },
    { path: "/achievements", label: "Rewards", icon: Trophy },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link key={item.path} href={item.path}>
              <div className={`flex flex-col items-center justify-center px-3 py-2 cursor-pointer ${
                active ? 'text-purple-500' : 'text-gray-400'
              }`}>
                <Icon className={`w-5 h-5 mb-1 ${active ? 'scale-110' : ''} transition-all`} />
                <span className="text-xs">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
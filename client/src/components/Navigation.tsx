import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  TrendingUp, 
  BookOpen, 
  BarChart3, 
  FileText, 
  Users, 
  DollarSign, 
  Fish, 
  Activity,
  MessageCircle,
  Palette,
  Brain,
  LineChart,
  ChevronDown,
  Zap,
  Presentation,
  Trophy,
  Wallet,
  Gift
} from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { WalletConnect } from "@/components/wallet-connect";
import { Badge } from "@/components/ui/badge";

export default function Navigation() {
  const [location] = useLocation();
  const { translate } = useLanguage();

  // Core navigation items
  const coreNavItems = [
    { path: "/", label: translate("nav.home", "Home"), icon: TrendingUp },
    { path: "/learn", label: translate("nav.learn", "Learn"), icon: BookOpen },
    { path: "/rewards", label: translate("nav.rewards", "Rewards"), icon: Gift, badge: "NEW" },
    { path: "/simulate", label: translate("nav.simulate", "Simulate"), icon: BarChart3 },
    { path: "/analyze", label: translate("nav.analyze", "Analyze"), icon: Activity },
  ];

  // Advanced tools dropdown
  const advancedTools = [
    { path: "/competitions", label: translate("nav.competitions", "Trading Competitions"), icon: Trophy, badge: "HOT" },
    { path: "/slideshow-generator", label: translate("nav.slideshow", "Slideshow Generator"), icon: Presentation },
    { path: "/ai-assistant", label: translate("nav.ai", "AI Assistant"), icon: Brain },
    { path: "/whale-tracker", label: translate("nav.whale", "Whale Tracker"), icon: Fish },
    { path: "/whitepaper-analyzer", label: translate("nav.whitepaper", "AI Analyzer"), icon: FileText },
    { path: "/technical-analysis", label: translate("nav.technical", "Technical Analysis"), icon: LineChart },
  ];

  // Marketplace and community
  const marketplaceItems = [
    { path: "/nft-marketplace", label: translate("nav.nft", "NFT Market"), icon: Palette },
    { path: "/chat-rooms", label: translate("nav.chat", "Chat Rooms"), icon: MessageCircle },
    { path: "/community", label: translate("nav.community", "Community"), icon: Users },
  ];

  const finalNavItems = [
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
            {/* Core Navigation */}
            {coreNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center gap-2"
                    data-testid={`nav-${item.path.replace('/', '') || 'home'}`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                    {item.badge && (
                      <Badge 
                        className={`ml-1 text-xs px-1.5 py-0 h-5 ${
                          item.badge === 'NEW' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-red-600 text-white animate-pulse'
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}

            {/* Advanced Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-2"
                  data-testid="nav-tools-dropdown"
                >
                  <Zap className="h-4 w-4" />
                  Tools
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {advancedTools.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link href={item.path} className="w-full">
                        <div className="flex items-center gap-2 w-full" data-testid={`nav-${item.path.replace('/', '').replace('-', '_')}`}>
                          <Icon className="h-4 w-4" />
                          {item.label}
                          {item.badge && (
                            <Badge 
                              className={`ml-auto text-xs px-1.5 py-0 h-5 ${
                                item.badge === 'HOT' 
                                  ? 'bg-red-600 text-white animate-pulse'
                                  : 'bg-green-600 text-white'
                              }`}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Marketplace & Community Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-2"
                  data-testid="nav-marketplace-dropdown"
                >
                  <Users className="h-4 w-4" />
                  Social
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {marketplaceItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link href={item.path} className="w-full">
                        <div className="flex items-center gap-2 w-full" data-testid={`nav-${item.path.replace('/', '').replace('-', '_')}`}>
                          <Icon className="h-4 w-4" />
                          {item.label}
                          {item.badge && (
                            <Badge 
                              className={`ml-auto text-xs px-1.5 py-0 h-5 ${
                                item.badge === 'HOT' 
                                  ? 'bg-red-600 text-white animate-pulse'
                                  : 'bg-green-600 text-white'
                              }`}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Final Items */}
            {finalNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center gap-2"
                    data-testid={`nav-${item.path.replace('/', '')}`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden md:block">
              <WalletConnect />
            </div>
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
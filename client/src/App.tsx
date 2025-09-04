import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Learn from "@/pages/learn";
import Simulate from "@/pages/simulate";
import Analyze from "@/pages/analyze";
import Community from "@/pages/community";
import Pricing from "@/pages/pricing";
import WhaleTracker from "@/pages/whale-tracker";
import WhitepaperAnalyzer from "@/pages/whitepaper-analyzer";
import TechnicalAnalysis from "@/pages/technical-analysis";
import EnterpriseShowcase from "@/pages/enterprise-showcase";
import Checkout from "@/pages/checkout";
import NftMarketplace from "@/pages/nft-marketplace";
import ChatRooms from "@/pages/chat-rooms";
import AiAssistant from "@/pages/ai-assistant";
import SlideshowGeneratorPage from "@/pages/slideshow-generator";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import CookiePolicy from "@/pages/cookie-policy";
import NotFound from "@/pages/not-found";
import Rewards from "@/pages/Rewards";
import Competitions from "@/pages/Competitions";
import CopyTrading from "@/pages/copy-trading";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import MobileBottomNav from "@/components/MobileBottomNav";
import LaunchEnhancementBanner from "@/components/launch-enhancement-banner";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Block Theory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <LaunchEnhancementBanner />
      <div className="hidden md:block">
        <Navigation />
      </div>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/home" component={Home} />
        <Route path="/learn" component={Learn} />
        <Route path="/simulate" component={Simulate} />
        <Route path="/analyze" component={Analyze} />
        <Route path="/community" component={Community} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/whale-tracker" component={WhaleTracker} />
        <Route path="/whitepaper-analyzer" component={WhitepaperAnalyzer} />
        <Route path="/technical-analysis" component={TechnicalAnalysis} />
        <Route path="/enterprise-showcase" component={EnterpriseShowcase} />
        <Route path="/nft-marketplace" component={NftMarketplace} />
        <Route path="/chat-rooms" component={ChatRooms} />
        <Route path="/ai-assistant" component={AiAssistant} />
        <Route path="/slideshow-generator" component={SlideshowGeneratorPage} />
        <Route path="/rewards" component={Rewards} />
        <Route path="/competitions" component={Competitions} />
        <Route path="/copy-trading" component={CopyTrading} />
        <Route path="/portfolio" component={Simulate} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route path="/cookie-policy" component={CookiePolicy} />
        <Route component={NotFound} />
      </Switch>
      <MobileBottomNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;

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
import Checkout from "@/pages/checkout";
import NftMarketplace from "@/pages/nft-marketplace";
import ChatRooms from "@/pages/chat-rooms";
import AiAssistant from "@/pages/ai-assistant";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <>
      <Navigation />
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
        <Route path="/nft-marketplace" component={NftMarketplace} />
        <Route path="/chat-rooms" component={ChatRooms} />
        <Route path="/ai-assistant" component={AiAssistant} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <Router />
          </div>
          <Toaster />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Learn from "@/pages/learn";
import Simulate from "@/pages/simulate";
import Analyze from "@/pages/analyze";
import Community from "@/pages/community";
import Pricing from "@/pages/pricing";
import Checkout from "@/pages/checkout";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/ui/navigation";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/home" component={Home} />
      <Route path="/learn" component={Learn} />
      <Route path="/simulate" component={Simulate} />
      <Route path="/analyze" component={Analyze} />
      <Route path="/community" component={Community} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/checkout" component={Checkout} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

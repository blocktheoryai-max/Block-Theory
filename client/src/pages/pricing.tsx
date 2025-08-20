import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useAuth, useSubscriptionStatus } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface SubscriptionPlan {
  id: string;
  name: string;
  tier: string;
  priceMonthly: string;
  priceYearly?: string;
  features: string[];
  maxLessons?: number;
  hasSimulator: boolean;
  hasCommunity: boolean;
  hasAnalytics: boolean;
  hasLiveTrading: boolean;
  hasMentoring: boolean;
  hasSignals: boolean;
}

const defaultPlans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    tier: "free",
    priceMonthly: "0",
    features: [
      "15 foundation lessons",
      "Basic trading simulator",
      "Community access",
      "Basic portfolio tracking",
      "14-day full trial"
    ],
    maxLessons: 15,
    hasSimulator: true,
    hasCommunity: true,
    hasAnalytics: false,
    hasLiveTrading: false,
    hasMentoring: false,
    hasSignals: false
  },
  {
    id: "basic",
    name: "Basic",
    tier: "basic",
    priceMonthly: "19.99",
    priceYearly: "199.99",
    features: [
      "Complete lesson library (100+ lessons)",
      "Advanced trading simulator",
      "Priority community access",
      "Advanced portfolio analytics",
      "NFT Academy access",
      "Quiz and certification system"
    ],
    hasSimulator: true,
    hasCommunity: true,
    hasAnalytics: true,
    hasLiveTrading: false,
    hasMentoring: false,
    hasSignals: false
  },
  {
    id: "pro",
    name: "Pro",
    tier: "pro",
    priceMonthly: "49.99",
    priceYearly: "499.99",
    features: [
      "Everything in Basic",
      "Live trading sessions",
      "Trading signals & alerts",
      "Advanced analytics dashboard",
      "Exchange API connections",
      "Priority customer support"
    ],
    hasSimulator: true,
    hasCommunity: true,
    hasAnalytics: true,
    hasLiveTrading: true,
    hasMentoring: false,
    hasSignals: true
  },
  {
    id: "elite",
    name: "Elite",
    tier: "elite",
    priceMonthly: "99.99",
    priceYearly: "999.99",
    features: [
      "Everything in Pro",
      "1-on-1 mentoring sessions",
      "Private Discord community",
      "Exclusive content & strategies",
      "Custom trading bot development",
      "White-glove onboarding"
    ],
    hasSimulator: true,
    hasCommunity: true,
    hasAnalytics: true,
    hasLiveTrading: true,
    hasMentoring: true,
    hasSignals: true
  }
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const { subscription, tier: currentTier } = useSubscriptionStatus();

  const { data: plans = defaultPlans } = useQuery({
    queryKey: ["/api/subscription-plans"],
    retry: false,
  });

  const startTrial = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/subscription/start-trial");
    },
    onSuccess: () => {
      toast({
        title: "Trial Started!",
        description: "Your 14-day Pro trial is now active!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription/status"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Please Login",
          description: "You need to login to start a trial.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1000);
        return;
      }
      toast({
        title: "Trial Failed",
        description: error.message || "Failed to start trial",
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = (planId: string, tier: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to subscribe to a plan.",
      });
      window.location.href = "/api/login";
      return;
    }

    if (tier === "free") {
      // Free plan - just redirect to app
      window.location.href = "/";
      return;
    }

    // Redirect to checkout with plan details
    const params = new URLSearchParams({
      planId,
      yearly: isYearly.toString()
    });
    window.location.href = `/checkout?${params.toString()}`;
  };

  const handleStartTrial = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to start your trial.",
      });
      window.location.href = "/api/login";
      return;
    }
    startTrial.mutate();
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "free": return null;
      case "basic": return <Star className="h-5 w-5 text-blue-500" />;
      case "pro": return <Zap className="h-5 w-5 text-purple-500" />;
      case "elite": return <Crown className="h-5 w-5 text-yellow-500" />;
      default: return null;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "free": return "border-gray-200";
      case "basic": return "border-blue-200 shadow-blue-50";
      case "pro": return "border-purple-200 shadow-purple-50";
      case "elite": return "border-yellow-200 shadow-yellow-50";
      default: return "border-gray-200";
    }
  };

  const isCurrentPlan = (tier: string) => currentTier === tier;

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Trading Education Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Start learning crypto trading with our comprehensive curriculum
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${!isYearly ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isYearly ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isYearly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isYearly ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500'}`}>
              Yearly
            </span>
            {isYearly && (
              <Badge variant="secondary" className="ml-2">
                Save 17%
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden ${getTierColor(plan.tier)} ${
                plan.tier === "pro" ? "ring-2 ring-purple-500 ring-opacity-50" : ""
              }`}
            >
              {plan.tier === "pro" && (
                <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-xs font-semibold">
                  MOST POPULAR
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-2">
                  {getTierIcon(plan.tier)}
                  <CardTitle className="text-2xl font-bold ml-2">{plan.name}</CardTitle>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">
                    ${isYearly && plan.priceYearly ? 
                      (parseFloat(plan.priceYearly) / 12).toFixed(2) : 
                      plan.priceMonthly
                    }
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">/month</span>
                  {isYearly && plan.priceYearly && plan.tier !== "free" && (
                    <div className="text-sm text-gray-500 mt-1">
                      Billed annually (${plan.priceYearly})
                    </div>
                  )}
                </div>
                <CardDescription className="text-sm">
                  {plan.tier === "free" && "Perfect for getting started"}
                  {plan.tier === "basic" && "Everything you need to learn trading"}
                  {plan.tier === "pro" && "Advanced features for serious traders"}
                  {plan.tier === "elite" && "Premium support and exclusive content"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-2">
                  <Button
                    className="w-full"
                    variant={plan.tier === "pro" ? "default" : "outline"}
                    disabled={isCurrentPlan(plan.tier)}
                    onClick={() => handleSubscribe(plan.id, plan.tier)}
                  >
                    {isCurrentPlan(plan.tier) ? "Current Plan" : 
                     plan.tier === "free" ? "Get Started" : "Subscribe"}
                  </Button>
                  
                  {plan.tier === "pro" && !isCurrentPlan(plan.tier) && !isCurrentPlan("elite") && (
                    <Button
                      className="w-full"
                      variant="secondary"
                      disabled={startTrial.isPending}
                      onClick={handleStartTrial}
                    >
                      {startTrial.isPending ? "Starting Trial..." : "Start 14-Day Trial"}
                    </Button>
                  )}
                </div>

                {isCurrentPlan(plan.tier) && (
                  <Badge variant="secondary" className="w-full text-center">
                    Active
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Why Choose TradeTutor?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Interactive Learning</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Learn by doing with our hands-on trading simulator and real market data.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Expert Guidance</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Learn from professional traders with years of market experience.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Crown className="h-8 w-8 text-yellow-600" />
              </div>
              <h4 className="font-semibold mb-2">Community Support</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Join thousands of traders in our active community forums and chats.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
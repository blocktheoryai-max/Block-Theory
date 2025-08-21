import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown, Rocket, Shield, Trophy, Target } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

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
  recommended?: boolean;
  popular?: boolean;
}

const defaultPlans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free Explorer",
    tier: "free",
    priceMonthly: "0",
    features: [
      "15 foundation crypto lessons",
      "Basic trading simulator with $10K virtual funds",
      "Community forum access",
      "Basic portfolio tracking",
      "Market data and live prices",
      "14-day full platform trial"
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
    name: "Crypto Apprentice",
    tier: "basic",
    priceMonthly: "19.99",
    priceYearly: "199.99",
    features: [
      "Complete lesson library (100+ lessons)",
      "Advanced trading simulator with real market conditions",
      "Priority community access and expert discussions",
      "Advanced portfolio analytics and performance tracking",
      "NFT Academy and digital asset education",
      "Quiz system and blockchain certification",
      "DeFi protocols deep dives",
      "Technical analysis masterclasses"
    ],
    hasSimulator: true,
    hasCommunity: true,
    hasAnalytics: true,
    hasLiveTrading: false,
    hasMentoring: false,
    hasSignals: false,
    popular: true
  },
  {
    id: "pro",
    name: "Trading Master",
    tier: "pro",
    priceMonthly: "49.99",
    priceYearly: "499.99",
    features: [
      "Everything in Crypto Apprentice",
      "Live trading sessions with market experts",
      "Premium trading signals and market analysis",
      "1-on-1 monthly mentoring sessions",
      "Exclusive market insights and research reports",
      "Advanced derivatives and futures trading education",
      "Private Discord community with pro traders",
      "Early access to new features and content",
      "Custom trading bot tutorials",
      "Institutional-grade portfolio management tools"
    ],
    hasSimulator: true,
    hasCommunity: true,
    hasAnalytics: true,
    hasLiveTrading: true,
    hasMentoring: true,
    hasSignals: true,
    recommended: true
  },
  {
    id: "elite",
    name: "Crypto Elite",
    tier: "elite",
    priceMonthly: "99.99",
    priceYearly: "999.99",
    features: [
      "Everything in Trading Master",
      "Weekly 1-on-1 coaching with crypto experts",
      "Exclusive whale tracker and on-chain analysis",
      "Pre-IPO and private token sale access",
      "Custom trading strategies development",
      "Direct line to institutional trading desks",
      "Exclusive research reports from top analysts",
      "VIP events and meetups with industry leaders",
      "Custom algorithm development support",
      "Personal portfolio optimization consultation",
      "24/7 priority support hotline"
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
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleSubscribe = (planId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to subscribe to a plan",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would redirect to payment processing
    toast({
      title: "Subscription processing",
      description: `Redirecting to payment for ${planId} plan...`,
    });
  };

  const getPlanIcon = (tier: string) => {
    switch (tier) {
      case "free": return <Target className="w-6 h-6" />;
      case "basic": return <Rocket className="w-6 h-6" />;
      case "pro": return <Crown className="w-6 h-6" />;
      case "elite": return <Trophy className="w-6 h-6" />;
      default: return <Star className="w-6 h-6" />;
    }
  };

  const getPlanGradient = (tier: string) => {
    switch (tier) {
      case "free": return "from-gray-600 to-gray-700";
      case "basic": return "from-blue-600 to-purple-600";
      case "pro": return "from-purple-600 to-pink-600";
      case "elite": return "from-yellow-500 to-orange-600";
      default: return "from-blue-600 to-purple-600";
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Choose Your Trading Journey
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Unlock the full potential of cryptocurrency trading education
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`text-sm ${!isYearly ? 'text-white font-semibold' : 'text-gray-400'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isYearly ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isYearly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm ${isYearly ? 'text-white font-semibold' : 'text-gray-400'}`}>
                Yearly
              </span>
              {isYearly && (
                <Badge className="bg-green-900/50 text-green-400 ml-2">
                  Save 17%
                </Badge>
              )}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {defaultPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 ${
                  plan.recommended ? 'ring-2 ring-purple-500/50 scale-105' : ''
                } ${plan.popular ? 'ring-2 ring-blue-500/50' : ''}`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1">
                      Recommended
                    </Badge>
                  </div>
                )}
                {plan.popular && !plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${getPlanGradient(plan.tier)} flex items-center justify-center`}>
                    <div className="text-white">
                      {getPlanIcon(plan.tier)}
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-white">
                        ${isYearly && plan.priceYearly ? 
                          (parseFloat(plan.priceYearly) / 12).toFixed(0) : 
                          plan.priceMonthly
                        }
                      </span>
                      <span className="text-gray-400 ml-1">/month</span>
                    </div>
                    {isYearly && plan.priceYearly && (
                      <div className="text-sm text-gray-400 mt-1">
                        Billed annually (${plan.priceYearly})
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <Check className="w-4 h-4 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full mt-6 ${
                      plan.tier === "free" 
                        ? "bg-gray-600 hover:bg-gray-700" 
                        : `bg-gradient-to-r ${getPlanGradient(plan.tier)} hover:opacity-90`
                    }`}
                    disabled={plan.tier === "free"}
                  >
                    {plan.tier === "free" ? "Current Plan" : `Get ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Comparison */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mb-12">
            <CardHeader>
              <CardTitle className="text-2xl text-white text-center">Feature Comparison</CardTitle>
              <CardDescription className="text-gray-400 text-center">
                Compare all features across our plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left text-white py-4 px-4">Features</th>
                      {defaultPlans.map((plan) => (
                        <th key={plan.id} className="text-center text-white py-4 px-4 min-w-[120px]">
                          {plan.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-slate-700/50">
                      <td className="py-3 px-4 text-gray-300">Lessons Access</td>
                      <td className="text-center py-3 px-4 text-yellow-400">15 lessons</td>
                      <td className="text-center py-3 px-4 text-green-400">100+ lessons</td>
                      <td className="text-center py-3 px-4 text-green-400">All lessons</td>
                      <td className="text-center py-3 px-4 text-green-400">All lessons</td>
                    </tr>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-3 px-4 text-gray-300">Trading Simulator</td>
                      <td className="text-center py-3 px-4 text-green-400"><Check className="w-4 h-4 mx-auto" /></td>
                      <td className="text-center py-3 px-4 text-green-400"><Check className="w-4 h-4 mx-auto" /></td>
                      <td className="text-center py-3 px-4 text-green-400"><Check className="w-4 h-4 mx-auto" /></td>
                      <td className="text-center py-3 px-4 text-green-400"><Check className="w-4 h-4 mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-3 px-4 text-gray-300">Community Access</td>
                      <td className="text-center py-3 px-4 text-green-400"><Check className="w-4 h-4 mx-auto" /></td>
                      <td className="text-center py-3 px-4 text-green-400"><Check className="w-4 h-4 mx-auto" /></td>
                      <td className="text-center py-3 px-4 text-green-400"><Check className="w-4 h-4 mx-auto" /></td>
                      <td className="text-center py-3 px-4 text-green-400"><Check className="w-4 h-4 mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-3 px-4 text-gray-300">Portfolio Analytics</td>
                      <td className="text-center py-3 px-4 text-gray-500">-</td>
                      <td className="text-center py-3 px-4 text-green-400"><Check className="w-4 h-4 mx-auto" /></td>
                      <td className="text-center py-3 px-4 text-green-400"><Check className="w-4 h-4 mx-auto" /></td>
                      <td className="text-center py-3 px-4 text-green-400"><Check className="w-4 h-4 mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-3 px-4 text-gray-300">Live Trading Sessions</td>
                      <td className="text-center py-3 px-4 text-gray-500">-</td>
                      <td className="text-center py-3 px-4 text-gray-500">-</td>
                      <td className="text-center py-3 px-4 text-green-400"><Check className="w-4 h-4 mx-auto" /></td>
                      <td className="text-center py-3 px-4 text-green-400"><Check className="w-4 h-4 mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-3 px-4 text-gray-300">1-on-1 Mentoring</td>
                      <td className="text-center py-3 px-4 text-gray-500">-</td>
                      <td className="text-center py-3 px-4 text-gray-500">-</td>
                      <td className="text-center py-3 px-4 text-yellow-400">Monthly</td>
                      <td className="text-center py-3 px-4 text-green-400">Weekly</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-300">Trading Signals</td>
                      <td className="text-center py-3 px-4 text-gray-500">-</td>
                      <td className="text-center py-3 px-4 text-gray-500">-</td>
                      <td className="text-center py-3 px-4 text-green-400"><Check className="w-4 h-4 mx-auto" /></td>
                      <td className="text-center py-3 px-4 text-green-400"><Check className="w-4 h-4 mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Money Back Guarantee */}
          <Card className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-500/50 backdrop-blur-sm text-center">
            <CardContent className="p-8">
              <Shield className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">30-Day Money Back Guarantee</h3>
              <p className="text-green-200 mb-4">
                Not satisfied? Get a full refund within 30 days, no questions asked.
              </p>
              <p className="text-sm text-green-300">
                We're confident you'll love our platform. Start your crypto education journey risk-free.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
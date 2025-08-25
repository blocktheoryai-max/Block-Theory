import { Link } from "wouter";
import { ChainHeader } from "@/components/ChainHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Crown,
  Check,
  BookOpen,
  PlayCircle,
  BarChart3,
  Users,
  Zap,
  Shield,
  Star
} from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with crypto trading basics",
      features: [
        "Access to 50 foundation video lessons",
        "Basic trading simulator",
        "Community access",
        "Weekly market updates",
        "Basic portfolio tracking"
      ],
      limitations: [
        "Limited simulation features",
        "No advanced lessons",
        "No AI assistant access"
      ],
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Basic",
      price: "$19.99",
      period: "month",
      description: "Unlock the complete lesson library and advanced simulator",
      features: [
        "Complete video library (200+ lessons)",
        "Advanced trading simulator",
        "Progress tracking & analytics",
        "Community access",
        "Weekly market reports",
        "Technical analysis tools",
        "Email support"
      ],
      limitations: [],
      buttonText: "Start Basic Plan",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Pro",
      price: "$49.99",
      period: "month",
      description: "Everything in Basic plus live sessions and premium tools",
      features: [
        "Everything in Basic",
        "Live trading sessions (weekly)",
        "Premium automated signals",
        "Advanced analytics dashboard",
        "AI-powered portfolio insights",
        "Private Discord community",
        "Priority email support",
        "Early access to new features"
      ],
      limitations: [],
      buttonText: "Upgrade to Pro",
      buttonVariant: "default" as const,
      popular: false
    },
    {
      name: "Elite",
      price: "$99.99",
      period: "month",
      description: "Ultimate trading education with AI-powered insights",
      features: [
        "Everything in Pro",
        "Advanced AI trading assistant",
        "Automated strategy recommendations",
        "AI portfolio optimization",
        "Exclusive premium market data",
        "VIP Discord channels",
        "24/7 automated support chat",
        "Access to all premium content"
      ],
      limitations: [],
      buttonText: "Go Elite",
      buttonVariant: "default" as const,
      popular: false
    }
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Comprehensive Curriculum",
      description: "500+ video lessons covering everything from basics to advanced trading strategies"
    },
    {
      icon: PlayCircle,
      title: "Risk-Free Simulation",
      description: "Practice with real market data using virtual currency"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track your progress and identify areas for improvement"
    },
    {
      icon: Users,
      title: "Active Community",
      description: "Connect with thousands of traders at every skill level"
    },
    {
      icon: Zap,
      title: "Real-Time Data",
      description: "Always up-to-date market information and price feeds"
    },
    {
      icon: Shield,
      title: "Safe Learning",
      description: "Learn without risking real money until you're confident"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <ChainHeader />
      
      {/* Hero Section */}
      <section className="blockchain-gradient-subtle py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Choose Your Learning Path
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Start free and upgrade as you grow. All plans include our core features with increasing levels of support and advanced tools.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>No contracts</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>7-day money back guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-primary premium-glow' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    {plan.price !== "$0" && (
                      <span className="text-muted-foreground">/{plan.period}</span>
                    )}
                  </div>
                  <CardDescription className="mt-4">{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Link href={plan.name === "Free" ? "/learn" : "/checkout"}>
                    <Button 
                      variant={plan.buttonVariant} 
                      className={`w-full mt-6 ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                    >
                      {plan.name === "Free" ? (
                        <>
                          <BookOpen className="w-4 h-4 mr-2" />
                          {plan.buttonText}
                        </>
                      ) : (
                        <>
                          <Crown className="w-4 h-4 mr-2" />
                          {plan.buttonText}
                        </>
                      )}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Block Theory?</h2>
            <p className="text-xl text-muted-foreground">Comprehensive crypto trading education designed for real results</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I switch plans anytime?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Yes! You can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is there a money-back guarantee?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Absolutely. We offer a 7-day money-back guarantee on all paid plans. If you're not satisfied, we'll refund your payment.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do I need any prior trading experience?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Not at all! Our curriculum is designed for complete beginners. We start with the basics and gradually build up to advanced concepts.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is the trading simulator realistic?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Yes, our simulator uses real market data and mirrors actual trading conditions. The only difference is you're using virtual currency.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 blockchain-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Start Your Trading Journey?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students who have transformed their understanding of cryptocurrency trading
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/learn">
                <Button size="lg" variant="outline">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Start Free Today
                </Button>
              </Link>
              <Link href="/checkout">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Crown className="w-5 h-5 mr-2" />
                  Upgrade to Premium
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
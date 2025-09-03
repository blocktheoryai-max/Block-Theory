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
import { SEOHead, SEO_PRESETS } from "@/components/SEOHead";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Try Block Theory with limited access",
      features: [
        "First 5 beginner lessons",
        "Basic trading simulator ($1K portfolio)",
        "Community forum (read-only)",
        "Sample market analysis",
        "Basic portfolio view"
      ],
      limitations: [
        "Only 5 lessons available",
        "Limited simulator features",
        "No advanced content"
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Starter",
      price: "$9.99",
      period: "month",
      description: "Perfect for beginners exploring crypto education",
      features: [
        "20 foundation lessons",
        "Basic trading simulator ($5K portfolio)",
        "Community forum access",
        "Weekly market updates",
        "Basic portfolio tracking",
        "Mobile app access",
        "Copy trading (view-only mode)"
      ],
      limitations: [],
      buttonText: "Start Starter Plan",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Basic",
      price: "$24.99",
      period: "month",
      description: "Unlock the complete lesson library and advanced simulator",
      features: [
        "Complete video library (100+ lessons)",
        "Advanced trading simulator ($10K portfolio)",
        "Progress tracking & analytics",
        "Community forum access",
        "Weekly market reports (email)",
        "Technical analysis tools",
        "Email support (48hr response)"
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
        "Live trading sessions (3x weekly)",
        "Premium AI trading signals (daily)",
        "Advanced analytics dashboard",
        "AI-powered portfolio optimizer",
        "Priority support (4hr response)",
        "Early access to new features"
      ],
      limitations: [],
      buttonText: "Upgrade to Pro",
      buttonVariant: "default" as const,
      popular: false
    }
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Comprehensive Curriculum",
      description: "50+ professional video lessons covering everything from basics to advanced trading strategies"
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
    <>
      <SEOHead {...SEO_PRESETS.pricing} canonical="/pricing" />
      <div className="min-h-screen bg-background">
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

      {/* Feature Comparison Table */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Detailed Feature Comparison
          </h2>
          <div className="max-w-6xl mx-auto overflow-x-auto">
            <table className="w-full border-collapse bg-card rounded-lg overflow-hidden">
              <thead>
                <tr className="border-b bg-muted">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4">Free</th>
                  <th className="text-center p-4 bg-primary/10">Basic</th>
                  <th className="text-center p-4">Pro</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-4 font-medium">Video Lessons</td>
                  <td className="text-center p-4 text-muted-foreground">5</td>
                  <td className="text-center p-4 bg-primary/10 font-medium">100+</td>
                  <td className="text-center p-4 font-medium">100+</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-4 font-medium">Trading Simulator Portfolio</td>
                  <td className="text-center p-4 text-muted-foreground">$1K</td>
                  <td className="text-center p-4 bg-primary/10 font-medium">$10K</td>
                  <td className="text-center p-4 font-medium">$10K</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-4 font-medium">Weekly Market Reports</td>
                  <td className="text-center p-4 text-muted-foreground">-</td>
                  <td className="text-center p-4 bg-primary/10">✓</td>
                  <td className="text-center p-4 text-green-600">✓</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-4 font-medium">Live Trading Sessions</td>
                  <td className="text-center p-4 text-muted-foreground">-</td>
                  <td className="text-center p-4 bg-primary/10 text-muted-foreground">-</td>
                  <td className="text-center p-4 font-medium text-blue-600">3x Weekly</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-4 font-medium">AI Trading Signals</td>
                  <td className="text-center p-4 text-muted-foreground">-</td>
                  <td className="text-center p-4 bg-primary/10 text-muted-foreground">-</td>
                  <td className="text-center p-4 font-medium text-blue-600">Daily</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-4 font-medium">AI Portfolio Optimizer</td>
                  <td className="text-center p-4 text-muted-foreground">-</td>
                  <td className="text-center p-4 bg-primary/10 text-muted-foreground">-</td>
                  <td className="text-center p-4 text-green-600">✓</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-4 font-medium">Support Response Time</td>
                  <td className="text-center p-4 text-muted-foreground">-</td>
                  <td className="text-center p-4 bg-primary/10">48 hours</td>
                  <td className="text-center p-4 font-medium">4 hours</td>
                </tr>
                <tr className="hover:bg-muted/50">
                  <td className="p-4 font-medium">Early Access Features</td>
                  <td className="text-center p-4 text-muted-foreground">-</td>
                  <td className="text-center p-4 bg-primary/10 text-muted-foreground">-</td>
                  <td className="text-center p-4 text-green-600">✓</td>
                </tr>
              </tbody>
            </table>
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
    </>
  );
}
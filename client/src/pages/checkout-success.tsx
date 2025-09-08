import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Check, Crown, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SEOHead } from "@/components/SEOHead";

export default function CheckoutSuccess() {
  const [, setLocation] = useLocation();
  const [planName, setPlanName] = useState("");

  useEffect(() => {
    // Get plan name from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const planFromUrl = urlParams.get('plan');
    
    if (planFromUrl) {
      setPlanName(planFromUrl);
    } else {
      // Fallback to localStorage if available
      const storedPlan = localStorage.getItem('checkoutPlan');
      if (storedPlan) {
        setPlanName(storedPlan);
        localStorage.removeItem('checkoutPlan'); // Clean up
      }
    }

    // Auto-redirect after 10 seconds
    const timer = setTimeout(() => {
      setLocation('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <>
      <SEOHead 
        title="Payment Successful - Block Theory"
        description="Your subscription has been activated successfully."
        canonical="/checkout-success"
      />
      
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader className="pb-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
              Payment Successful!
            </CardTitle>
            <CardDescription className="text-lg">
              Welcome to Block Theory {planName && `${planName} plan`}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-3">
                Your subscription has been activated and you now have access to:
              </p>
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Complete lesson library</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Advanced trading simulator</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Community forum access</span>
                </div>
                {planName === "Pro" && (
                  <>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Live trading sessions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">AI trading signals</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/learn">
                <Button className="w-full" size="lg">
                  <Crown className="w-4 h-4 mr-2" />
                  Start Learning
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              
              <Link href="/">
                <Button variant="outline" className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground">
              You'll receive a confirmation email shortly. <br />
              Redirecting to dashboard in 10 seconds...
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
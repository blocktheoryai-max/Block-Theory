import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Shield, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  planId: string;
  isYearly: boolean;
  planName: string;
  amount: number;
}

function CheckoutForm({ planId, isYearly, planName, amount }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const confirmPayment = useMutation({
    mutationFn: async (paymentIntentId: string) => {
      return apiRequest("POST", "/api/subscription/confirm-payment", { paymentIntentId });
    },
    onSuccess: () => {
      toast({
        title: "Payment Successful!",
        description: `Welcome to ${planName}! Your subscription is now active.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription/status"] });
      setTimeout(() => setLocation("/"), 2000);
    },
    onError: (error) => {
      toast({
        title: "Payment Processing Failed", 
        description: error.message || "Failed to activate subscription",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout-success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent?.status === 'succeeded') {
        confirmPayment.mutate(paymentIntent.id);
      }
    } catch (err) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred during payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">{planName}</span>
          <Badge variant="secondary">{isYearly ? 'Yearly' : 'Monthly'}</Badge>
        </div>
        <div className="text-2xl font-bold">
          ${(amount / 100).toFixed(2)}
          <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
            /{isYearly ? 'year' : 'month'}
          </span>
        </div>
        {isYearly && (
          <div className="text-sm text-green-600 dark:text-green-400 mt-1">
            Save 17% with yearly billing
          </div>
        )}
      </div>

      <PaymentElement />

      <Button 
        type="submit" 
        className="w-full" 
        disabled={!stripe || !elements || isProcessing || confirmPayment.isPending}
      >
        <CreditCard className="h-4 w-4 mr-2" />
        {isProcessing || confirmPayment.isPending ? "Processing..." : `Pay $${(amount / 100).toFixed(2)}`}
      </Button>

      <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center">
          <Shield className="h-4 w-4 mr-1" />
          Secure Payment
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          Instant Access
        </div>
      </div>
    </form>
  );
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [paymentDetails, setPaymentDetails] = useState<{
    planName: string;
    amount: number;
    planId: string;
    isYearly: boolean;
  } | null>(null);

  useEffect(() => {
    // Get checkout details from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const planId = urlParams.get('planId');
    const isYearly = urlParams.get('yearly') === 'true';
    
    if (!planId) {
      toast({
        title: "Invalid Checkout",
        description: "Please select a plan first",
        variant: "destructive",
      });
      setLocation("/pricing");
      return;
    }

    // Create payment intent
    apiRequest("POST", "/api/subscription/create-payment-intent", { planId, isYearly })
      .then((response) => response.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setPaymentDetails({
          planName: data.planName,
          amount: data.amount,
          planId,
          isYearly
        });
      })
      .catch((error) => {
        if (isUnauthorizedError(error)) {
          toast({
            title: "Please Login",
            description: "You need to login to subscribe",
            variant: "destructive",
          });
          setTimeout(() => {
            window.location.href = "/api/login";
          }, 1000);
          return;
        }
        toast({
          title: "Checkout Error",
          description: error.message || "Failed to initialize payment",
          variant: "destructive",
        });
        setLocation("/pricing");
      });
  }, []);

  if (!clientSecret || !paymentDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="container mx-auto px-4 max-w-md">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/pricing")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pricing
          </Button>
          
          <h1 className="text-3xl font-bold text-center mb-2">Complete Your Subscription</h1>
          <p className="text-center text-gray-600 dark:text-gray-300">
            Secure payment powered by Stripe
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Details
            </CardTitle>
            <CardDescription>
              Your subscription will be activated immediately after payment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Elements 
              stripe={stripePromise} 
              options={{ 
                clientSecret,
                appearance: {
                  theme: 'stripe',
                }
              }}
            >
              <CheckoutForm 
                planId={paymentDetails.planId}
                isYearly={paymentDetails.isYearly}
                planName={paymentDetails.planName}
                amount={paymentDetails.amount}
              />
            </Elements>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Test with card number: 4242 4242 4242 4242</p>
          <p>Use any future date for expiry and any 3-digit CVC</p>
        </div>
      </div>
    </div>
  );
}
import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}

export function useSubscriptionStatus() {
  const { data: subscription, isLoading } = useQuery({
    queryKey: ["/api/subscription/status"],
    retry: false,
  });

  return {
    subscription,
    isLoading,
    tier: subscription?.tier || 'free',
    status: subscription?.status || 'inactive',
    isTrialActive: subscription?.trialEndDate && new Date(subscription.trialEndDate) > new Date(),
  };
}
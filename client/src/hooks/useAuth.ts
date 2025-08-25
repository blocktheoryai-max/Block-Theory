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
    tier: (subscription as any)?.tier || 'free',
    status: (subscription as any)?.status || 'inactive',
    isTrialActive: (subscription as any)?.trialEndDate && new Date((subscription as any).trialEndDate) > new Date(),
  };
}
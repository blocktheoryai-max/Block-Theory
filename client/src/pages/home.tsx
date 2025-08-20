import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, TrendingUp, Users, BarChart3, Crown, Star, Zap } from "lucide-react";
import { useAuth, useSubscriptionStatus } from "@/hooks/useAuth";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { subscription, tier } = useSubscriptionStatus();

  const { data: lessons = [] } = useQuery({
    queryKey: ["/api/lessons"],
    enabled: isAuthenticated,
  });

  const { data: progress = [] } = useQuery({
    queryKey: ["/api/progress", user?.id],
    enabled: isAuthenticated && !!user?.id,
  });

  // Landing page for non-authenticated users
  if (!isAuthenticated && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">TradeTutor</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/pricing">
                <Button variant="outline">Pricing</Button>
              </Link>
              <Button onClick={() => window.location.href = "/api/login"}>
                Sign In
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Master Crypto Trading with 
              <span className="text-blue-600"> Interactive Learning</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              TradeTutor is the comprehensive crypto trading education platform combining lessons, 
              simulation, analytics, and community - all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/learn">
                <Button size="lg" className="text-lg px-8 py-3">
                  Start Learning
                </Button>
              </Link>
              <Link href="/simulate">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                  Try Simulator
                </Button>
              </Link>
              <Link href="/analyze">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                  View Analysis
                </Button>
              </Link>
              <Link href="/community">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                  Join Community
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Trade Crypto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card>
                <CardHeader className="text-center">
                  <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle>Interactive Lessons</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600 dark:text-gray-300">
                    100+ comprehensive lessons from basics to advanced trading strategies
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <CardTitle>Trading Simulator</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600 dark:text-gray-300">
                    Practice with real market data in a risk-free environment
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <CardTitle>Whitepaper Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600 dark:text-gray-300">
                    Professional-grade analysis tools for evaluating crypto projects
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <CardTitle>Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600 dark:text-gray-300">
                    Connect with traders worldwide and share strategies
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Dashboard for authenticated users
  const completedLessons = progress.length;
  const totalLessons = lessons.length;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const getTierIcon = () => {
    switch (tier) {
      case "basic": return <Star className="h-5 w-5 text-blue-500" />;
      case "pro": return <Zap className="h-5 w-5 text-purple-500" />;
      case "elite": return <Crown className="h-5 w-5 text-yellow-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">TradeTutor</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {getTierIcon()}
              <Badge variant={tier === "free" ? "secondary" : "default"}>
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </Badge>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Welcome, {user?.firstName || "Trader"}!
            </span>
            <Button variant="outline" onClick={() => window.location.href = "/api/logout"}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Trading Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Continue your crypto trading education journey
          </p>
        </div>

        {/* Subscription Status */}
        {tier === "free" && (
          <Card className="mb-8 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
                <Star className="h-5 w-5 mr-2" />
                Upgrade to unlock premium features
              </CardTitle>
              <CardDescription>
                Get access to advanced lessons, live trading sessions, and exclusive content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/pricing">
                <Button>View Pricing Plans</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Progress</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressPercentage.toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground">
                {completedLessons} of {totalLessons} lessons completed
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$10,000</div>
              <p className="text-xs text-muted-foreground">
                Simulated portfolio
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Community Rank</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#1,247</div>
              <p className="text-xs text-muted-foreground">
                Top 15% this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Continue Learning</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Pick up where you left off
              </p>
              <Link href="/learn">
                <Button className="w-full">Start Lesson</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Trade Simulator</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Practice with live market data
              </p>
              <Link href="/simulate">
                <Button className="w-full" variant="outline">Open Simulator</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Analyze Projects</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Professional whitepaper analysis
              </p>
              <Link href="/analyze">
                <Button className="w-full" variant="outline">Start Analysis</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Community</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Connect with traders
              </p>
              <Link href="/community">
                <Button className="w-full" variant="outline">Join Discussion</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

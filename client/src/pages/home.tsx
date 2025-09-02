import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, TrendingUp, Users, BarChart3, Crown, Star, Zap, Trophy, Gift, Lock, Play, Clock, Target, Flame, HelpCircle } from "lucide-react";
import { useAuth, useSubscriptionStatus } from "@/hooks/useAuth";
import { Link } from "wouter";
import { TutorialOverlay, useTutorial } from "@/components/ui/tutorial-overlay";
import { homeTutorialSteps } from "@/components/tutorial-steps";
import { SEOHead, SEO_PRESETS } from "@/components/SEOHead";
import { useEffect } from "react";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { subscription, tier } = useSubscriptionStatus();
  const tutorial = useTutorial();

  const { data: lessons = [] } = useQuery({
    queryKey: ["/api/lessons"],
    enabled: isAuthenticated,
  });

  const { data: progress = [] } = useQuery({
    queryKey: ["/api/progress", user?.id],
    enabled: isAuthenticated && !!user?.id,
  });

  const { data: achievements = [] } = useQuery({
    queryKey: ["/api/achievements"],
    enabled: isAuthenticated,
  });

  const { data: premiumContent = [] } = useQuery({
    queryKey: ["/api/premium-content"],
    enabled: isAuthenticated,
  });

  const { data: tradingSignals = [] } = useQuery({
    queryKey: ["/api/trading-signals"],
    enabled: isAuthenticated,
  });

  // Auto-start tutorial for first-time users
  useEffect(() => {
    if (isAuthenticated && !tutorial.isTutorialCompleted('home-tutorial')) {
      const timer = setTimeout(() => {
        tutorial.startTutorial();
      }, 1000); // Delay to ensure page is loaded
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, tutorial]);

  // Landing page for non-authenticated users
  if (!isAuthenticated && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <SEOHead 
          title={SEO_PRESETS.home.title}
          description={SEO_PRESETS.home.description}
          keywords={SEO_PRESETS.home.keywords}
          canonical="/"
        />
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

        {/* Achievement System */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
              Your Achievements
            </CardTitle>
            <CardDescription>
              Earn points and unlock rewards as you progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.slice(0, 4).map((achievement, index) => {
                const IconComponent = achievement.iconName === "BookOpen" ? BookOpen :
                  achievement.iconName === "Trophy" ? Trophy :
                  achievement.iconName === "TrendingUp" ? TrendingUp :
                  achievement.iconName === "Flame" ? Flame : Star;
                
                return (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <IconComponent className="h-8 w-8 text-blue-500" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{achievement.name}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{achievement.description}</p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        +{achievement.pointsReward} XP
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                View All Achievements
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Premium Content Teasers */}
        {tier === "free" || tier === "basic" ? (
          <Card className="mb-8 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-700 dark:text-purple-300">
                <Crown className="h-5 w-5 mr-2" />
                Exclusive Premium Content
              </CardTitle>
              <CardDescription>
                Unlock advanced masterclasses and expert strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {premiumContent.slice(0, 2).map((content, index) => (
                  <div key={index} className="relative p-4 bg-white dark:bg-gray-800 rounded-lg border">
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-xs">
                        {content.requiredTier.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded">
                        <Play className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">{content.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{content.description.substring(0, 80)}...</p>
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {content.duration}min
                          </div>
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {content.views} views
                          </div>
                        </div>
                      </div>
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link href="/pricing">
                  <Button className="mr-2">Upgrade Now</Button>
                </Link>
                <Button variant="outline" size="sm">
                  View All Premium Content
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Trading Signals for Premium Users */}
        {(tier === "pro" || tier === "elite") && tradingSignals.length > 0 ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-green-500" />
                Live Trading Signals
              </CardTitle>
              <CardDescription>
                Expert trading recommendations updated daily
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tradingSignals.slice(0, 3).map((signal, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant={signal.signalType === "buy" ? "default" : 
                                     signal.signalType === "sell" ? "destructive" : "secondary"}>
                        {signal.signalType.toUpperCase()}
                      </Badge>
                      <div>
                        <h4 className="font-semibold">{signal.symbol}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Entry: ${signal.entryPrice} | Target: ${signal.targetPrice}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{signal.confidence}% confidence</div>
                      <div className="text-xs text-gray-500">{signal.status}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm">
                  View All Signals
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

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
              <Link href="/learn" data-tutorial="learn-link">
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
              <Link href="/simulate" data-tutorial="simulate-link">
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
              <Link href="/community" data-tutorial="community-link">
                <Button className="w-full" variant="outline">Join Discussion</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tutorial Overlay */}
      <TutorialOverlay
        steps={homeTutorialSteps}
        isActive={tutorial.isActive}
        onComplete={() => tutorial.completeTutorial('home-tutorial')}
        onSkip={() => tutorial.skipTutorial('home-tutorial')}
      />

      {/* Tutorial Help Button */}
      <Button
        onClick={tutorial.startTutorial}
        className="fixed bottom-6 right-6 rounded-full h-12 w-12 shadow-lg hover:shadow-xl transition-shadow z-40"
        size="sm"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>
    </div>
  );
}

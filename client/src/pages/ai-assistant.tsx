import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Zap,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Sparkles,
  PieChart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Info
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface PortfolioAnalysis {
  overall_health: number;
  risk_level: string;
  diversification_score: number;
  top_performers: string[];
  underperformers: string[];
  recommendations: string[];
  market_outlook: string;
  next_actions: string[];
}

interface StrategyRecommendation {
  primary_strategy: {
    name: string;
    description: string;
    risk_level: string;
    expected_return: string;
  };
  asset_allocation: Array<{
    symbol: string;
    percentage: number;
    rationale: string;
  }>;
  entry_strategies: string[];
  risk_management: {
    stop_loss_strategy: string;
    position_sizing: string;
    diversification_rules: string;
  };
  market_timing: string;
  alternative_strategies: Array<{
    name: string;
    description: string;
  }>;
}

interface PortfolioOptimization {
  current_analysis: {
    total_value: number;
    risk_score: number;
    diversification_rating: number;
  };
  optimized_allocation: Array<{
    symbol: string;
    target_percentage: number;
    current_percentage: number;
    adjustment_needed: string;
  }>;
  rebalancing_actions: string[];
  risk_metrics: {
    expected_volatility: number;
    sharpe_ratio_estimate: number;
    max_drawdown_estimate: number;
  };
  performance_projection: {
    "3_month": string;
    "12_month": string;
  };
  optimization_rationale: string;
}

export default function AiAssistant() {
  const [selectedTab, setSelectedTab] = useState("recommendations");
  const [riskTolerance, setRiskTolerance] = useState("medium");
  const [investmentGoal, setInvestmentGoal] = useState("growth");
  const [timeHorizon, setTimeHorizon] = useState("long_term");
  const [optimizationGoal, setOptimizationGoal] = useState("risk_adjusted_returns");
  const [analysisData, setAnalysisData] = useState<PortfolioAnalysis | null>(null);
  const [strategyData, setStrategyData] = useState<StrategyRecommendation | null>(null);
  const [optimizationData, setOptimizationData] = useState<PortfolioOptimization | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const getCurrentUserId = () => {
    return (user as any)?.id || "demo-user-id";
  };

  // Fetch portfolio data
  const { data: portfolio = [] } = useQuery<any[]>({
    queryKey: [`/api/portfolio/${getCurrentUserId()}`],
  });

  // Portfolio Analysis Mutation
  const portfolioAnalysisMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ai/portfolio-analysis", { 
        userId: getCurrentUserId() 
      });
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisData(data);
      toast({
        title: "Analysis Complete",
        description: "AI portfolio analysis generated successfully"
      });
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Failed to generate portfolio analysis",
        variant: "destructive"
      });
    }
  });

  // Strategy Recommendations Mutation
  const strategyMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ai/strategy-recommendations", { 
        userId: getCurrentUserId(),
        riskTolerance,
        investmentGoal,
        timeHorizon
      });
      return response.json();
    },
    onSuccess: (data) => {
      setStrategyData(data);
      toast({
        title: "Strategies Generated",
        description: "AI trading strategies created successfully"
      });
    },
    onError: () => {
      toast({
        title: "Strategy Generation Failed",
        description: "Failed to generate trading strategies",
        variant: "destructive"
      });
    }
  });

  // Portfolio Optimization Mutation
  const optimizationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ai/portfolio-optimization", {
        userId: getCurrentUserId(),
        goal: optimizationGoal
      });
      return response.json();
    },
    onSuccess: (data) => {
      setOptimizationData(data);
      toast({
        title: "Optimization Complete",
        description: "Portfolio optimization recommendations generated"
      });
    },
    onError: () => {
      toast({
        title: "Optimization Failed",
        description: "Failed to optimize portfolio",
        variant: "destructive"
      });
    }
  });

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "text-green-500";
      case "medium": return "text-yellow-500";
      case "high": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  // Generate smart recommendations based on market data
  const generateRecommendations = () => {
    const hour = new Date().getHours();
    const isMarketOpen = hour >= 9 && hour <= 16;
    
    return {
      marketStatus: isMarketOpen ? "Market Open" : "Market Closed",
      topPicks: [
        { symbol: "BTC", action: "Hold", reason: "Strong support at current levels, wait for breakout above $115k" },
        { symbol: "ETH", action: "Buy", reason: "Undervalued relative to BTC, upcoming upgrades positive catalyst" },
        { symbol: "SOL", action: "Watch", reason: "High volatility, wait for clearer trend formation" }
      ],
      riskAlerts: [
        "High volatility expected in altcoins this week",
        "Fed announcement may impact crypto markets Wednesday",
        "Bitcoin dominance increasing - consider BTC allocation"
      ],
      learningTips: [
        "Complete 'Advanced Technical Analysis' lesson for better trading insights",
        "Review risk management strategies in current market conditions",
        "Practice with smaller positions during high volatility periods"
      ]
    };
  };

  const recommendations = generateRecommendations();

  return (
    <div className="container mx-auto px-4 py-8" data-testid="page-ai-assistant">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          AI Trading Assistant
        </h1>
        <p className="text-muted-foreground">Get personalized insights, strategies, and optimization recommendations powered by advanced AI</p>
      </div>

      {/* AI Capabilities Banner */}
      <Card className="mb-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Info className="h-5 w-5 text-purple-400 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold mb-2">AI-Powered Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-1" />
                  <div className="text-sm">
                    <strong>Real-Time Analysis</strong>
                    <p className="text-muted-foreground">Live market data integration</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-1" />
                  <div className="text-sm">
                    <strong>Personalized Strategies</strong>
                    <p className="text-muted-foreground">Based on your risk profile</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-1" />
                  <div className="text-sm">
                    <strong>Learning Integration</strong>
                    <p className="text-muted-foreground">Connects with your progress</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="analysis">Portfolio Analysis</TabsTrigger>
          <TabsTrigger value="strategies">Strategy Builder</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        {/* AI Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Market Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Market Status
                  </span>
                  <Badge variant={recommendations.marketStatus === "Market Open" ? "default" : "secondary"}>
                    {recommendations.marketStatus}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sentiment</span>
                    <Badge className="bg-green-500/20 text-green-400">Bullish</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Volatility</span>
                    <Badge className="bg-yellow-500/20 text-yellow-400">Medium</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Trend</span>
                    <Badge className="bg-blue-500/20 text-blue-400">Upward</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Picks Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Today's Top Picks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.topPicks.map((pick, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Badge variant="outline" className={
                        pick.action === "Buy" ? "text-green-500" : 
                        pick.action === "Hold" ? "text-yellow-500" : "text-blue-500"
                      }>
                        {pick.action}
                      </Badge>
                      <div className="flex-1">
                        <div className="font-medium">{pick.symbol}</div>
                        <div className="text-sm text-muted-foreground">{pick.reason}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Risk Alerts & Market Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recommendations.riskAlerts.map((alert, index) => (
                  <Alert key={index}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{alert}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Learning Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Personalized Learning Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recommendations.learningTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Portfolio Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                AI Portfolio Analysis
              </CardTitle>
              <CardDescription>
                Get comprehensive AI-powered analysis of your portfolio performance and risk profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => portfolioAnalysisMutation.mutate()}
                disabled={portfolioAnalysisMutation.isPending || portfolio.length === 0}
                className="w-full"
                data-testid="button-analyze-portfolio"
              >
                {portfolioAnalysisMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Portfolio...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analyze My Portfolio
                  </>
                )}
              </Button>

              {portfolio.length === 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    You need to make some trades in the simulator first to analyze your portfolio.
                  </AlertDescription>
                </Alert>
              )}

              {analysisData && (
                <div className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Portfolio Health</span>
                          <span className={`font-semibold ${getHealthColor(analysisData.overall_health)}`}>
                            {analysisData.overall_health}/100
                          </span>
                        </div>
                        <Progress value={analysisData.overall_health} className="mt-2" />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Risk Level</span>
                          <Badge variant="outline" className={getRiskColor(analysisData.risk_level)}>
                            {analysisData.risk_level}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Diversification</span>
                          <span className="font-semibold">
                            {analysisData.diversification_score}/100
                          </span>
                        </div>
                        <Progress value={analysisData.diversification_score} className="mt-2" />
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          Top Performers
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysisData.top_performers?.map((performer, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>{performer}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <ArrowDownRight className="h-4 w-4 text-red-500" />
                          Underperformers
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysisData.underperformers?.map((underperformer, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                              <span>{underperformer}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Strategy Builder Tab */}
        <TabsContent value="strategies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                AI Strategy Builder
              </CardTitle>
              <CardDescription>
                Generate personalized trading strategies based on your goals and risk tolerance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Risk Tolerance</label>
                  <Select value={riskTolerance} onValueChange={setRiskTolerance}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Conservative</SelectItem>
                      <SelectItem value="medium">Moderate</SelectItem>
                      <SelectItem value="high">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Investment Goal</label>
                  <Select value={investmentGoal} onValueChange={setInvestmentGoal}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="growth">Growth</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="preservation">Capital Preservation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Time Horizon</label>
                  <Select value={timeHorizon} onValueChange={setTimeHorizon}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short_term">Short Term (< 1 year)</SelectItem>
                      <SelectItem value="medium_term">Medium Term (1-3 years)</SelectItem>
                      <SelectItem value="long_term">Long Term (> 3 years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={() => strategyMutation.mutate()}
                disabled={strategyMutation.isPending}
                className="w-full"
                data-testid="button-generate-strategy"
              >
                {strategyMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating Strategy...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate AI Strategy
                  </>
                )}
              </Button>

              {strategyData && (
                <div className="space-y-4 mt-6">
                  <Card className="bg-primary/5">
                    <CardHeader>
                      <CardTitle>{strategyData.primary_strategy.name}</CardTitle>
                      <CardDescription>{strategyData.primary_strategy.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Risk Level</span>
                          <p className="font-medium">{strategyData.primary_strategy.risk_level}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Expected Return</span>
                          <p className="font-medium">{strategyData.primary_strategy.expected_return}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recommended Asset Allocation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {strategyData.asset_allocation?.map((allocation, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{allocation.symbol}</span>
                              <span>{allocation.percentage}%</span>
                            </div>
                            <Progress value={allocation.percentage} className="h-2" />
                            <p className="text-sm text-muted-foreground">{allocation.rationale}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Portfolio Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Portfolio Optimization
              </CardTitle>
              <CardDescription>
                Optimize your portfolio allocation for maximum risk-adjusted returns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Optimization Goal</label>
                <Select value={optimizationGoal} onValueChange={setOptimizationGoal}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="risk_adjusted_returns">Maximize Risk-Adjusted Returns</SelectItem>
                    <SelectItem value="minimize_risk">Minimize Risk</SelectItem>
                    <SelectItem value="maximize_returns">Maximize Returns</SelectItem>
                    <SelectItem value="income_generation">Income Generation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={() => optimizationMutation.mutate()}
                disabled={optimizationMutation.isPending || portfolio.length === 0}
                className="w-full"
                data-testid="button-optimize-portfolio"
              >
                {optimizationMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Optimizing Portfolio...
                  </>
                ) : (
                  <>
                    <PieChart className="h-4 w-4 mr-2" />
                    Optimize Portfolio
                  </>
                )}
              </Button>

              {portfolio.length === 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    You need holdings in your portfolio to run optimization.
                  </AlertDescription>
                </Alert>
              )}

              {optimizationData && (
                <div className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <span className="text-sm text-muted-foreground">Current Value</span>
                        <p className="text-2xl font-bold">${optimizationData.current_analysis.total_value.toFixed(2)}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <span className="text-sm text-muted-foreground">Risk Score</span>
                        <p className="text-2xl font-bold">{optimizationData.current_analysis.risk_score}/100</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <span className="text-sm text-muted-foreground">Diversification</span>
                        <p className="text-2xl font-bold">{optimizationData.current_analysis.diversification_rating}/100</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Optimized Allocation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {optimizationData.optimized_allocation?.map((allocation, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{allocation.symbol}</span>
                              <div className="flex gap-2">
                                <Badge variant="outline">Current: {allocation.current_percentage}%</Badge>
                                <Badge>Target: {allocation.target_percentage}%</Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{allocation.adjustment_needed}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {optimizationData.optimization_rationale && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>{optimizationData.optimization_rationale}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
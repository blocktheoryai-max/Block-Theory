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
  ArrowDownRight
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
  const [selectedTab, setSelectedTab] = useState("analysis");
  const [riskTolerance, setRiskTolerance] = useState("medium");
  const [investmentGoal, setInvestmentGoal] = useState("growth");
  const [timeHorizon, setTimeHorizon] = useState("long_term");
  const [optimizationGoal, setOptimizationGoal] = useState("risk_adjusted_returns");
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const getCurrentUserId = () => {
    return (user as any)?.id || "demo-user-id";
  };

  // Fetch portfolio data
  const { data: portfolio = [] } = useQuery({
    queryKey: ["/api/portfolio", getCurrentUserId()],
  });

  // Portfolio Analysis Mutation
  const portfolioAnalysisMutation = useMutation({
    mutationFn: () => apiRequest("/api/ai/portfolio-analysis", {
      method: "POST",
      body: JSON.stringify({ userId: getCurrentUserId() })
    }),
    onSuccess: () => {
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
    mutationFn: () => apiRequest("/api/ai/strategy-recommendations", {
      method: "POST",
      body: JSON.stringify({ 
        userId: getCurrentUserId(),
        riskTolerance,
        investmentGoal,
        timeHorizon
      })
    }),
    onSuccess: () => {
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
    mutationFn: () => apiRequest("/api/ai/portfolio-optimization", {
      method: "POST",
      body: JSON.stringify({ 
        userId: getCurrentUserId(),
        optimizationGoal
      })
    }),
    onSuccess: () => {
      toast({
        title: "Optimization Complete",
        description: "AI portfolio optimization generated successfully"
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

  return (
    <div className="container mx-auto px-4 py-8" data-testid="page-ai-assistant">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          AI Trading Assistant
        </h1>
        <p className="text-muted-foreground">Get personalized insights, strategies, and optimization recommendations powered by advanced AI</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analysis">Portfolio Analysis</TabsTrigger>
          <TabsTrigger value="strategies">Strategy Recommendations</TabsTrigger>
          <TabsTrigger value="optimization">Portfolio Optimization</TabsTrigger>
        </TabsList>

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

              {portfolioAnalysisMutation.data && (
                <div className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Portfolio Health</span>
                          <span className={`font-semibold ${getHealthColor(portfolioAnalysisMutation.data.overall_health)}`}>
                            {portfolioAnalysisMutation.data.overall_health}/100
                          </span>
                        </div>
                        <Progress value={portfolioAnalysisMutation.data.overall_health} className="mt-2" />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Risk Level</span>
                          <Badge variant="outline" className={getRiskColor(portfolioAnalysisMutation.data.risk_level)}>
                            {portfolioAnalysisMutation.data.risk_level}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Diversification</span>
                          <span className="font-semibold">
                            {portfolioAnalysisMutation.data.diversification_score}/100
                          </span>
                        </div>
                        <Progress value={portfolioAnalysisMutation.data.diversification_score} className="mt-2" />
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
                          {portfolioAnalysisMutation.data.top_performers?.map((performer, index) => (
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
                          {portfolioAnalysisMutation.data.underperformers?.map((underperformer, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                              <span>{underperformer}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>AI Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {portfolioAnalysisMutation.data.recommendations?.map((recommendation, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Zap className="h-4 w-4 text-primary mt-0.5" />
                            <span>{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Market Outlook & Next Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Market Outlook</h4>
                          <p className="text-muted-foreground">{portfolioAnalysisMutation.data.market_outlook}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Immediate Actions</h4>
                          <ul className="space-y-2">
                            {portfolioAnalysisMutation.data.next_actions?.map((action, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Target className="h-4 w-4 text-primary mt-0.5" />
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                AI Strategy Recommendations
              </CardTitle>
              <CardDescription>
                Get personalized trading strategies based on your risk profile and goals
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
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
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
                      <SelectItem value="speculation">High Risk/High Reward</SelectItem>
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
                      <SelectItem value="short_term">Short Term (&lt; 6 months)</SelectItem>
                      <SelectItem value="medium_term">Medium Term (6-24 months)</SelectItem>
                      <SelectItem value="long_term">Long Term (2+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={() => strategyMutation.mutate()}
                disabled={strategyMutation.isPending}
                className="w-full"
                data-testid="button-generate-strategies"
              >
                {strategyMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating Strategies...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Generate AI Strategies
                  </>
                )}
              </Button>

              {strategyMutation.data && (
                <div className="space-y-4 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Primary Strategy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <h4 className="font-semibold">{strategyMutation.data.primary_strategy?.name}</h4>
                        <p className="text-muted-foreground">{strategyMutation.data.primary_strategy?.description}</p>
                        <div className="flex gap-4">
                          <Badge variant="outline">Risk: {strategyMutation.data.primary_strategy?.risk_level}</Badge>
                          <Badge variant="outline">Expected Return: {strategyMutation.data.primary_strategy?.expected_return}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {strategyMutation.data.asset_allocation && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <PieChart className="h-4 w-4" />
                          Recommended Asset Allocation
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {strategyMutation.data.asset_allocation.map((allocation, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded">
                              <div>
                                <span className="font-medium">{allocation.symbol}</span>
                                <p className="text-sm text-muted-foreground">{allocation.rationale}</p>
                              </div>
                              <Badge variant="secondary">{allocation.percentage}%</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI Portfolio Optimization
              </CardTitle>
              <CardDescription>
                Optimize your portfolio allocation for better risk-adjusted returns
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
                    <SelectItem value="risk_adjusted_returns">Risk-Adjusted Returns</SelectItem>
                    <SelectItem value="maximum_returns">Maximum Returns</SelectItem>
                    <SelectItem value="minimum_risk">Minimum Risk</SelectItem>
                    <SelectItem value="balanced_growth">Balanced Growth</SelectItem>
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
                    <Sparkles className="h-4 w-4 mr-2" />
                    Optimize My Portfolio
                  </>
                )}
              </Button>

              {portfolio.length === 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    You need to have a portfolio to optimize. Start trading in the simulator first.
                  </AlertDescription>
                </Alert>
              )}

              {optimizationMutation.data && (
                <div className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <DollarSign className="h-6 w-6 mx-auto mb-2" />
                          <span className="text-sm text-muted-foreground">Total Value</span>
                          <p className="font-semibold">${optimizationMutation.data.current_analysis?.total_value?.toLocaleString()}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
                          <span className="text-sm text-muted-foreground">Risk Score</span>
                          <p className="font-semibold">{optimizationMutation.data.current_analysis?.risk_score}/100</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <PieChart className="h-6 w-6 mx-auto mb-2" />
                          <span className="text-sm text-muted-foreground">Diversification</span>
                          <p className="font-semibold">{optimizationMutation.data.current_analysis?.diversification_rating}/100</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {optimizationMutation.data.optimized_allocation && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Optimized Allocation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {optimizationMutation.data.optimized_allocation.map((allocation, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded">
                              <div>
                                <span className="font-medium">{allocation.symbol}</span>
                                <p className="text-sm text-muted-foreground">{allocation.adjustment_needed}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-muted-foreground">
                                  {allocation.current_percentage}% → {allocation.target_percentage}%
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle>Optimization Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{optimizationMutation.data.optimization_rationale}</p>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold">Recommended Actions:</h4>
                        <ul className="space-y-1">
                          {optimizationMutation.data.rebalancing_actions?.map((action, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Target className="h-4 w-4 text-primary mt-0.5" />
                              <span className="text-sm">{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
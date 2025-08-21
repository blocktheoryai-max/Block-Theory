import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3, 
  LineChart, 
  AlertCircle,
  Target,
  Bell,
  Zap,
  Signal,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatPrice, useMarketData } from "@/hooks/useMarketData";
import { triggerCelebration } from "@/lib/confetti";

interface TechnicalIndicator {
  id: string;
  symbol: string;
  timeframe: string;
  indicatorType: string;
  value: number;
  signal: "BUY" | "SELL" | "HOLD";
  confidence: number;
  parameters: any;
  calculatedAt: string;
}

interface MarketAnalysisResult {
  id: string;
  symbol: string;
  timeframe: string;
  trendDirection: "BULLISH" | "BEARISH" | "SIDEWAYS";
  supportLevels: number[];
  resistanceLevels: number[];
  keyLevels: any;
  patternDetected: string;
  volumeAnalysis: any;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  analysisText: string;
  confidence: number;
  updatedAt: string;
}

interface PriceAlert {
  id: string;
  symbol: string;
  alertType: string;
  targetValue: number;
  currentValue: number;
  isTriggered: boolean;
  isActive: boolean;
}

const CRYPTO_SYMBOLS = ["BTC", "ETH", "BNB", "ADA", "SOL", "DOT", "LINK", "UNI", "AVAX", "MATIC"];
const TIMEFRAMES = ["1h", "4h", "1d", "1w"];
const INDICATORS = [
  { key: "RSI", name: "Relative Strength Index", description: "Momentum oscillator (0-100)" },
  { key: "MACD", name: "MACD", description: "Trend-following momentum indicator" },
  { key: "SMA", name: "Simple Moving Average", description: "Average price over time periods" },
  { key: "EMA", name: "Exponential Moving Average", description: "Weighted moving average" },
  { key: "BB", name: "Bollinger Bands", description: "Volatility bands around price" },
  { key: "STOCH", name: "Stochastic Oscillator", description: "Momentum indicator (0-100)" },
  { key: "WILLIAMS_R", name: "Williams %R", description: "Momentum indicator (-100-0)" },
  { key: "CCI", name: "Commodity Channel Index", description: "Cyclical indicator" }
];

export default function TechnicalAnalysis() {
  const [selectedSymbol, setSelectedSymbol] = useState("BTC");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1d");
  const [alertSymbol, setAlertSymbol] = useState("BTC");
  const [alertPrice, setAlertPrice] = useState("");
  const [alertType, setAlertType] = useState("PRICE_ABOVE");

  const { data: marketData } = useMarketData();

  // Mock data - in a real app, these would come from API endpoints
  const mockIndicators: TechnicalIndicator[] = [
    {
      id: "1",
      symbol: selectedSymbol,
      timeframe: selectedTimeframe,
      indicatorType: "RSI",
      value: 67.3,
      signal: "HOLD",
      confidence: 75,
      parameters: { period: 14 },
      calculatedAt: new Date().toISOString()
    },
    {
      id: "2",
      symbol: selectedSymbol,
      timeframe: selectedTimeframe,
      indicatorType: "MACD",
      value: 1250.45,
      signal: "BUY",
      confidence: 82,
      parameters: { fast: 12, slow: 26, signal: 9 },
      calculatedAt: new Date().toISOString()
    },
    {
      id: "3",
      symbol: selectedSymbol,
      timeframe: selectedTimeframe,
      indicatorType: "BB",
      value: 0.85,
      signal: "SELL",
      confidence: 68,
      parameters: { period: 20, stdDev: 2 },
      calculatedAt: new Date().toISOString()
    },
    {
      id: "4",
      symbol: selectedSymbol,
      timeframe: selectedTimeframe,
      indicatorType: "STOCH",
      value: 34.2,
      signal: "BUY",
      confidence: 71,
      parameters: { k: 14, d: 3 },
      calculatedAt: new Date().toISOString()
    }
  ];

  const mockAnalysis: MarketAnalysisResult = {
    id: "1",
    symbol: selectedSymbol,
    timeframe: selectedTimeframe,
    trendDirection: "BULLISH",
    supportLevels: [110000, 108500, 107000],
    resistanceLevels: [115000, 117500, 120000],
    keyLevels: { pivot: 112500, r1: 114000, s1: 111000 },
    patternDetected: "ASCENDING_TRIANGLE",
    volumeAnalysis: { trend: "INCREASING", volume: "ABOVE_AVERAGE" },
    riskLevel: "MEDIUM",
    analysisText: `${selectedSymbol} is showing strong bullish momentum with an ascending triangle pattern forming. Volume is increasing, supporting the upward price movement. Key resistance at $115K needs to be broken for further upside.`,
    confidence: 78,
    updatedAt: new Date().toISOString()
  };

  const mockAlerts: PriceAlert[] = [
    {
      id: "1",
      symbol: "BTC",
      alertType: "PRICE_ABOVE",
      targetValue: 115000,
      currentValue: 112899,
      isTriggered: false,
      isActive: true
    },
    {
      id: "2",
      symbol: "ETH",
      alertType: "PRICE_BELOW",
      targetValue: 4000,
      currentValue: 4256.39,
      isTriggered: false,
      isActive: true
    }
  ];

  const handleCreateAlert = () => {
    if (!alertPrice) return;
    
    // Trigger confetti celebration
    triggerCelebration('alert');
    
    // In a real app, this would make an API call
    console.log("Creating alert:", { symbol: alertSymbol, type: alertType, price: alertPrice });
    
    // Reset form
    setAlertPrice("");
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case "BUY": return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case "SELL": return <ArrowDownRight className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case "BUY": return "text-green-600 bg-green-50 border-green-200";
      case "SELL": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-yellow-600 bg-yellow-50 border-yellow-200";
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "BULLISH": return "text-green-600";
      case "BEARISH": return "text-red-600";
      default: return "text-yellow-600";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "LOW": return "text-green-600 bg-green-50 border-green-200";
      case "HIGH": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-yellow-600 bg-yellow-50 border-yellow-200";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-3">
          <Activity className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Technical Analysis</h1>
            <p className="text-muted-foreground">Advanced trading indicators and market analysis tools</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Label>Symbol:</Label>
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CRYPTO_SYMBOLS.map(symbol => (
                  <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Label>Timeframe:</Label>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEFRAMES.map(tf => (
                  <SelectItem key={tf} value={tf}>{tf}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <Signal className="h-3 w-3 mr-1" />
            Live Analysis
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="indicators" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="indicators">Technical Indicators</TabsTrigger>
          <TabsTrigger value="analysis">Market Analysis</TabsTrigger>
          <TabsTrigger value="patterns">Pattern Recognition</TabsTrigger>
          <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="indicators" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockIndicators.map((indicator) => {
              const indicatorInfo = INDICATORS.find(i => i.key === indicator.indicatorType);
              return (
                <Card key={indicator.id} className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        <span>{indicatorInfo?.name || indicator.indicatorType}</span>
                      </div>
                      {getSignalIcon(indicator.signal)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{indicatorInfo?.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {indicator.indicatorType === 'RSI' || indicator.indicatorType === 'STOCH' 
                          ? indicator.value.toFixed(1)
                          : indicator.value.toLocaleString()
                        }
                      </div>
                      <Badge className={`${getSignalColor(indicator.signal)} mt-2`}>
                        {indicator.signal}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Confidence:</span>
                        <span className="font-medium">{indicator.confidence}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all" 
                          style={{ width: `${indicator.confidence}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LineChart className="h-5 w-5 text-primary" />
                <span>Indicator Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {mockIndicators.filter(i => i.signal === "BUY").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Buy Signals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {mockIndicators.filter(i => i.signal === "SELL").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Sell Signals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {mockIndicators.filter(i => i.signal === "HOLD").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Hold Signals</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Trend Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Overall Trend:</span>
                  <Badge className={`${getTrendColor(mockAnalysis.trendDirection)} font-semibold`}>
                    {mockAnalysis.trendDirection}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Risk Level:</span>
                  <Badge className={`${getRiskColor(mockAnalysis.riskLevel)}`}>
                    {mockAnalysis.riskLevel}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Confidence:</span>
                  <span className="font-semibold">{mockAnalysis.confidence}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${mockAnalysis.confidence}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Key Levels</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Resistance Levels:</div>
                  <div className="space-y-1">
                    {mockAnalysis.resistanceLevels.map((level, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="text-sm">R{i + 1}:</span>
                        <span className="font-medium text-red-600">{formatPrice(level)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Support Levels:</div>
                  <div className="space-y-1">
                    {mockAnalysis.supportLevels.map((level, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="text-sm">S{i + 1}:</span>
                        <span className="font-medium text-green-600">{formatPrice(level)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                <span>Analysis Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">{mockAnalysis.analysisText}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>Pattern Detection</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📈</div>
                <div className="text-xl font-semibold text-foreground mb-2">Ascending Triangle Detected</div>
                <div className="text-muted-foreground mb-4">
                  A bullish continuation pattern with increasing highs and stable support
                </div>
                <Badge className="bg-green-50 text-green-600 border-green-200 px-3 py-1">
                  Bullish Pattern
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Pattern Characteristics:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Higher highs with consistent resistance</li>
                    <li>• Strong horizontal support line</li>
                    <li>• Decreasing volume during formation</li>
                    <li>• Breakout typically occurs at 75% completion</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Trading Implications:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Target: Pattern height + breakout point</li>
                    <li>• Stop loss: Below support line</li>
                    <li>• Wait for volume confirmation on breakout</li>
                    <li>• Consider partial position sizing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <span>Create Price Alert</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Symbol</Label>
                  <Select value={alertSymbol} onValueChange={setAlertSymbol}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CRYPTO_SYMBOLS.map(symbol => (
                        <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Alert Type</Label>
                  <Select value={alertType} onValueChange={setAlertType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRICE_ABOVE">Price Above</SelectItem>
                      <SelectItem value="PRICE_BELOW">Price Below</SelectItem>
                      <SelectItem value="CHANGE_PERCENT">% Change</SelectItem>
                      <SelectItem value="VOLUME_SPIKE">Volume Spike</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Target Price</Label>
                  <Input
                    type="number"
                    placeholder="Enter price"
                    value={alertPrice}
                    onChange={(e) => setAlertPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button onClick={handleCreateAlert} className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    Create Alert
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                    <div className="flex items-center space-x-4">
                      <Bell className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-semibold text-foreground">
                          {alert.symbol} {alert.alertType.replace('_', ' ').toLowerCase()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Target: {formatPrice(alert.targetValue)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">
                        {formatPrice(alert.currentValue)}
                      </div>
                      <Badge className={alert.isActive ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-50 text-gray-600 border-gray-200"}>
                        {alert.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
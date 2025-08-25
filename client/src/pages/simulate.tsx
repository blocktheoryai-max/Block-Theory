import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { LiveMarketData } from "@/components/LiveMarketData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Target,
  Activity,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Wallet,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Brain,
  Rocket
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface CryptoPriceData {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: string;
}

interface Portfolio {
  id: string;
  userId: string;
  cash: number;
  totalValue: number;
  holdings: Array<{
    symbol: string;
    amount: number;
    averagePrice: number;
    currentValue: number;
  }>;
}

interface Trade {
  id: string;
  userId: string;
  symbol: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  total: number;
  timestamp: string;
}

export default function Simulate() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedSymbol, setSelectedSymbol] = useState("BTC");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [tradeAmount, setTradeAmount] = useState("");
  const [tradePrice, setTradePrice] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const getCurrentUserId = () => {
    return (user as any)?.id || "demo-user-id";
  };

  // Fetch market data
  const { data: marketData, isLoading: pricesLoading } = useQuery({
    queryKey: ["/api/market-data"],
    refetchInterval: 10000,
  });

  // Transform market data to prices array
  const prices: CryptoPriceData[] = marketData 
    ? Object.values(marketData).map((data: any) => ({
        id: data.symbol.toLowerCase(),
        symbol: data.symbol,
        name: data.name,
        currentPrice: data.price,
        priceChange24h: data.change24h * data.price / 100,
        priceChangePercentage24h: data.change24h,
        high24h: data.price * 1.05,
        low24h: data.price * 0.95,
        volume24h: data.volume,
        marketCap: data.marketCap,
        lastUpdated: new Date().toISOString()
      }))
    : [];

  // Fetch portfolio
  const { data: portfolio, isLoading: portfolioLoading } = useQuery<Portfolio>({
    queryKey: ["/api/portfolio", getCurrentUserId()],
  });

  // Fetch trade history
  const { data: trades = [], isLoading: tradesLoading } = useQuery<Trade[]>({
    queryKey: ["/api/trades", getCurrentUserId()],
  });

  // Execute trade
  const executeTrade = useMutation({
    mutationFn: async ({ symbol, type, amount, price }: {
      symbol: string;
      type: "buy" | "sell";
      amount: number;
      price: number;
    }) => {
      return apiRequest("POST", "/api/trades", {
        userId: getCurrentUserId(),
        symbol,
        type,
        amount,
        price,
        total: amount * price,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["/api/trades"] });
      setTradeAmount("");
      setTradePrice("");
      toast({ 
        title: `${tradeType === "buy" ? "Buy" : "Sell"} order executed!`,
        description: `Successfully ${tradeType === "buy" ? "bought" : "sold"} ${selectedSymbol}`
      });
    },
    onError: (error) => {
      toast({
        title: "Trade failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const selectedPrice = prices.find(p => p.symbol === selectedSymbol);
  const tradeTotal = parseFloat(tradeAmount || "0") * parseFloat(tradePrice || selectedPrice?.currentPrice?.toString() || "0");

  // Portfolio calculations with null safety
  const portfolioValue = portfolio?.totalValue ?? 10000;
  const cashBalance = portfolio?.cash ?? 10000;
  const portfolioChange = portfolioValue - 10000; // Starting amount
  const portfolioChangePercent = portfolioChange ? ((portfolioChange / 10000) * 100) : 0;

  const handleTrade = () => {
    if (!tradeAmount || !selectedPrice) return;
    
    const amount = parseFloat(tradeAmount);
    const price = parseFloat(tradePrice) || selectedPrice?.currentPrice || 0;
    
    if (amount <= 0) {
      toast({ title: "Invalid amount", variant: "destructive" });
      return;
    }

    executeTrade.mutate({
      symbol: selectedSymbol,
      type: tradeType,
      amount,
      price,
    });
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Trading Simulator
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Practice crypto trading with real market data in a risk-free environment
            </p>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 max-w-4xl mx-auto mb-6">
              <p className="text-red-300 text-sm font-medium">
                ⚠️ <strong>Educational Simulation Only:</strong> This is a virtual trading environment using simulated funds. 
                All trades are educational and do not involve real money or cryptocurrency. Results do not guarantee real trading performance.
              </p>
            </div>
            
            {/* Portfolio Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Portfolio Value</p>
                      <p className="text-2xl font-bold text-white">${portfolioValue?.toLocaleString() || '10,000'}</p>
                      <p className={`text-xs ${portfolioChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {portfolioChange >= 0 ? '+' : ''}${(portfolioChange || 0).toFixed(2)} ({(portfolioChangePercent || 0).toFixed(2)}%)
                      </p>
                    </div>
                    <PieChart className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Cash Balance</p>
                      <p className="text-2xl font-bold text-white">${cashBalance?.toLocaleString() || '10,000'}</p>
                      <p className="text-xs text-gray-400">Available to trade</p>
                    </div>
                    <Wallet className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Trades</p>
                      <p className="text-2xl font-bold text-white">{trades.length}</p>
                      <p className="text-xs text-gray-400">Executed orders</p>
                    </div>
                    <Activity className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Holdings</p>
                      <p className="text-2xl font-bold text-white">{portfolio?.holdings?.length || 0}</p>
                      <p className="text-xs text-gray-400">Crypto assets</p>
                    </div>
                    <Target className="h-8 w-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-700">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
                Overview
              </TabsTrigger>
              <TabsTrigger value="trade" className="data-[state=active]:bg-blue-600">
                Trade
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="data-[state=active]:bg-blue-600">
                Portfolio
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-blue-600">
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Live Market Data */}
              <LiveMarketData />

              {/* Quick Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                      Top Gainers (24h)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {prices
                        .filter(p => p.priceChangePercentage24h > 0)
                        .sort((a, b) => b.priceChangePercentage24h - a.priceChangePercentage24h)
                        .slice(0, 3)
                        .map((price) => (
                          <div key={price.symbol} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-white">{price.symbol[0]}</span>
                              </div>
                              <div>
                                <div className="text-white font-semibold">{price.symbol}</div>
                                <div className="text-xs text-gray-400">{price.name}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-semibold">${price.currentPrice.toLocaleString()}</div>
                              <div className="text-green-400 text-sm flex items-center">
                                <ArrowUpRight className="w-3 h-3" />
                                +{price.priceChangePercentage24h.toFixed(2)}%
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <TrendingDown className="h-5 w-5 mr-2 text-red-400" />
                      Top Losers (24h)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {prices
                        .filter(p => p.priceChangePercentage24h < 0)
                        .sort((a, b) => a.priceChangePercentage24h - b.priceChangePercentage24h)
                        .slice(0, 3)
                        .map((price) => (
                          <div key={price.symbol} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-white">{price.symbol[0]}</span>
                              </div>
                              <div>
                                <div className="text-white font-semibold">{price.symbol}</div>
                                <div className="text-xs text-gray-400">{price.name}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-semibold">${price.currentPrice.toLocaleString()}</div>
                              <div className="text-red-400 text-sm flex items-center">
                                <ArrowDownRight className="w-3 h-3" />
                                {price.priceChangePercentage24h.toFixed(2)}%
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trade" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Trading Panel */}
                <Card className="lg:col-span-1 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                      Execute Trade
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Buy or sell cryptocurrency with simulated funds
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Asset Selection */}
                    <div>
                      <Label htmlFor="symbol" className="text-gray-300">Select Asset</Label>
                      <select
                        id="symbol"
                        value={selectedSymbol}
                        onChange={(e) => setSelectedSymbol(e.target.value)}
                        className="w-full mt-1 p-2 bg-slate-700/50 border border-slate-600 rounded text-white"
                      >
                        {prices.map((price) => (
                          <option key={price.symbol} value={price.symbol}>
                            {price.symbol} - ${price.currentPrice.toLocaleString()}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Trade Type */}
                    <div className="flex space-x-2">
                      <Button
                        variant={tradeType === "buy" ? "default" : "outline"}
                        onClick={() => setTradeType("buy")}
                        className={tradeType === "buy" ? "bg-green-600" : "border-slate-600"}
                      >
                        Buy
                      </Button>
                      <Button
                        variant={tradeType === "sell" ? "default" : "outline"}
                        onClick={() => setTradeType("sell")}
                        className={tradeType === "sell" ? "bg-red-600" : "border-slate-600"}
                      >
                        Sell
                      </Button>
                    </div>

                    {/* Amount */}
                    <div>
                      <Label htmlFor="amount" className="text-gray-300">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(e.target.value)}
                        placeholder="0.00"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <Label htmlFor="price" className="text-gray-300">Price (USD)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={tradePrice}
                        onChange={(e) => setTradePrice(e.target.value)}
                        placeholder={selectedPrice?.currentPrice.toString() || "0"}
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Current market price: ${selectedPrice?.currentPrice.toLocaleString() || 0}
                      </p>
                    </div>

                    {/* Trade Summary */}
                    <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total:</span>
                        <span className="text-white font-semibold">${tradeTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Available:</span>
                        <span className="text-white">${cashBalance.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Execute Button */}
                    <Button
                      onClick={handleTrade}
                      disabled={!tradeAmount || executeTrade.isPending || (tradeType === "buy" && tradeTotal > cashBalance)}
                      className={`w-full ${tradeType === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
                    >
                      {executeTrade.isPending ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Rocket className="w-4 h-4 mr-2" />
                      )}
                      {tradeType === "buy" ? "Buy" : "Sell"} {selectedSymbol}
                    </Button>

                    {tradeType === "buy" && tradeTotal > cashBalance && (
                      <Alert className="border-red-500/50 bg-red-900/20">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-red-400">
                          Insufficient cash balance for this trade
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Market Data */}
                <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                      Real-Time Market Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-slate-700">
                            <TableHead className="text-gray-400">Asset</TableHead>
                            <TableHead className="text-gray-400">Price</TableHead>
                            <TableHead className="text-gray-400">24h Change</TableHead>
                            <TableHead className="text-gray-400">Volume</TableHead>
                            <TableHead className="text-gray-400">Market Cap</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {prices.map((price) => (
                            <TableRow key={price.symbol} className="border-slate-700 hover:bg-slate-700/30">
                              <TableCell className="text-white font-medium">
                                <div className="flex items-center space-x-2">
                                  <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-bold text-white">{price.symbol[0]}</span>
                                  </div>
                                  <span>{price.symbol}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-white">${price.currentPrice.toLocaleString()}</TableCell>
                              <TableCell className={price.priceChangePercentage24h >= 0 ? "text-green-400" : "text-red-400"}>
                                {price.priceChangePercentage24h >= 0 ? "+" : ""}{price.priceChangePercentage24h.toFixed(2)}%
                              </TableCell>
                              <TableCell className="text-gray-300">${(price.volume24h / 1000000).toFixed(1)}M</TableCell>
                              <TableCell className="text-gray-300">${(price.marketCap / 1000000000).toFixed(1)}B</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <PieChart className="h-5 w-5 mr-2 text-purple-400" />
                    Your Holdings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {portfolioLoading ? (
                    <div className="text-center py-8">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-400" />
                      <p className="text-gray-400">Loading portfolio...</p>
                    </div>
                  ) : portfolio?.holdings && portfolio.holdings.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-slate-700">
                            <TableHead className="text-gray-400">Asset</TableHead>
                            <TableHead className="text-gray-400">Amount</TableHead>
                            <TableHead className="text-gray-400">Avg Price</TableHead>
                            <TableHead className="text-gray-400">Current Value</TableHead>
                            <TableHead className="text-gray-400">P&L</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {portfolio.holdings.map((holding) => {
                            const currentPrice = prices.find(p => p.symbol === holding.symbol)?.currentPrice || 0;
                            const pnl = (currentPrice - holding.averagePrice) * holding.amount;
                            const pnlPercentage = ((currentPrice - holding.averagePrice) / holding.averagePrice) * 100;
                            
                            return (
                              <TableRow key={holding.symbol} className="border-slate-700">
                                <TableCell className="text-white font-medium">{holding.symbol}</TableCell>
                                <TableCell className="text-white">{holding.amount}</TableCell>
                                <TableCell className="text-white">${holding.averagePrice.toLocaleString()}</TableCell>
                                <TableCell className="text-white">${holding.currentValue.toLocaleString()}</TableCell>
                                <TableCell className={pnl >= 0 ? "text-green-400" : "text-red-400"}>
                                  {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)} ({pnlPercentage.toFixed(2)}%)
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No holdings yet</h3>
                      <p className="text-gray-400 mb-4">Start trading to build your portfolio</p>
                      <Button onClick={() => setSelectedTab("trade")} className="bg-blue-600 hover:bg-blue-700">
                        Start Trading
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Activity className="h-5 w-5 mr-2 text-green-400" />
                    Trade History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tradesLoading ? (
                    <div className="text-center py-8">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-400" />
                      <p className="text-gray-400">Loading trades...</p>
                    </div>
                  ) : trades.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-slate-700">
                            <TableHead className="text-gray-400">Date</TableHead>
                            <TableHead className="text-gray-400">Type</TableHead>
                            <TableHead className="text-gray-400">Asset</TableHead>
                            <TableHead className="text-gray-400">Amount</TableHead>
                            <TableHead className="text-gray-400">Price</TableHead>
                            <TableHead className="text-gray-400">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {trades.map((trade) => (
                            <TableRow key={trade.id} className="border-slate-700">
                              <TableCell className="text-gray-300">
                                {new Date(trade.timestamp).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Badge className={trade.type === "buy" ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}>
                                  {trade.type.toUpperCase()}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-white font-medium">{trade.symbol}</TableCell>
                              <TableCell className="text-white">{trade.amount}</TableCell>
                              <TableCell className="text-white">${trade.price.toLocaleString()}</TableCell>
                              <TableCell className="text-white">${trade.total.toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No trades yet</h3>
                      <p className="text-gray-400 mb-4">Your trading history will appear here</p>
                      <Button onClick={() => setSelectedTab("trade")} className="bg-blue-600 hover:bg-blue-700">
                        Make Your First Trade
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
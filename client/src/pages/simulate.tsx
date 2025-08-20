import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  ArrowLeft,
  DollarSign,
  Target,
  Activity,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Link } from "wouter";

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
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoPriceData | null>(null);
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [tradeAmount, setTradeAmount] = useState("");
  const [isExecutingTrade, setIsExecutingTrade] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  const { data: prices = [], isLoading: pricesLoading } = useQuery({
    queryKey: ["/api/prices"],
    refetchInterval: 10000, // Update every 10 seconds
  });

  const { data: portfolio, isLoading: portfolioLoading } = useQuery({
    queryKey: ["/api/portfolio", user?.id],
    enabled: isAuthenticated && !!user?.id,
  });

  const { data: trades = [], isLoading: tradesLoading } = useQuery({
    queryKey: ["/api/trades", user?.id],
    enabled: isAuthenticated && !!user?.id,
  });

  const executeTrade = useMutation({
    mutationFn: async ({ symbol, type, amount, price }: {
      symbol: string;
      type: "buy" | "sell";
      amount: number;
      price: number;
    }) => {
      return apiRequest("POST", "/api/trades", {
        symbol,
        type,
        amount,
        price,
        total: amount * price,
      });
    },
    onSuccess: () => {
      toast({
        title: "Trade Executed!",
        description: `Successfully ${tradeType === "buy" ? "bought" : "sold"} ${tradeAmount} ${selectedCrypto?.symbol}`,
      });
      setTradeAmount("");
      setIsExecutingTrade(false);
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/trades", user?.id] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Please Login",
          description: "You need to login to execute trades.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1000);
        return;
      }
      toast({
        title: "Trade Failed",
        description: error.message || "Failed to execute trade",
        variant: "destructive",
      });
      setIsExecutingTrade(false);
    },
  });

  const handleTrade = async () => {
    if (!selectedCrypto || !tradeAmount || !isAuthenticated) return;

    const amount = parseFloat(tradeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const price = selectedCrypto.currentPrice;
    const total = amount * price;

    // Check if user has enough funds for buy orders
    if (tradeType === "buy" && portfolio && total > portfolio.cash) {
      toast({
        title: "Insufficient Funds",
        description: `You need $${total.toFixed(2)} but only have $${portfolio.cash.toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }

    // Check if user has enough holdings for sell orders
    if (tradeType === "sell" && portfolio) {
      const holding = portfolio.holdings.find(h => h.symbol === selectedCrypto.symbol);
      if (!holding || holding.amount < amount) {
        toast({
          title: "Insufficient Holdings",
          description: `You only have ${holding?.amount || 0} ${selectedCrypto.symbol}`,
          variant: "destructive",
        });
        return;
      }
    }

    setIsExecutingTrade(true);
    executeTrade.mutate({
      symbol: selectedCrypto.symbol,
      type: tradeType,
      amount,
      price,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatNumber = (value: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  const getHolding = (symbol: string) => {
    return portfolio?.holdings.find(h => h.symbol === symbol);
  };

  const calculatePnL = (holding: any, currentPrice: number) => {
    const currentValue = holding.amount * currentPrice;
    const costBasis = holding.amount * holding.averagePrice;
    const pnl = currentValue - costBasis;
    const pnlPercentage = (pnl / costBasis) * 100;
    return { pnl, pnlPercentage };
  };

  if (pricesLoading || portfolioLoading || tradesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Trading Simulator
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Practice trading with real market data in a risk-free environment
              </p>
            </div>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>

          {!isAuthenticated && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please <Link href="/api/login" className="underline">login</Link> to track your portfolio and execute trades.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Market Data */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Live Market Data</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/prices"] })}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prices.map((crypto: CryptoPriceData) => {
                    const isSelected = selectedCrypto?.id === crypto.id;
                    const holding = getHolding(crypto.symbol);
                    const pnlData = holding ? calculatePnL(holding, crypto.currentPrice) : null;

                    return (
                      <div
                        key={crypto.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedCrypto(crypto)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div>
                              <h3 className="font-semibold">{crypto.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{crypto.symbol}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(crypto.currentPrice)}</p>
                            <div className={`flex items-center text-sm ${
                              crypto.priceChangePercentage24h >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {crypto.priceChangePercentage24h >= 0 ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                              )}
                              {formatNumber(Math.abs(crypto.priceChangePercentage24h), 2)}%
                            </div>
                          </div>
                        </div>
                        {holding && (
                          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between text-sm">
                              <span>Holdings: {formatNumber(holding.amount, 6)} {crypto.symbol}</span>
                              <span className={pnlData && pnlData.pnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {pnlData && (formatCurrency(pnlData.pnl) + ` (${formatNumber(pnlData.pnlPercentage, 2)}%)`)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trading Panel & Portfolio */}
          <div className="lg:col-span-2 space-y-6">
            {/* Portfolio Summary */}
            {isAuthenticated && portfolio && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Portfolio Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
                      <p className="text-2xl font-bold">{formatCurrency(portfolio.totalValue)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Available Cash</p>
                      <p className="text-2xl font-bold">{formatCurrency(portfolio.cash)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Trading Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Execute Trade
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedCrypto ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">{selectedCrypto.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Current Price: {formatCurrency(selectedCrypto.currentPrice)}
                      </p>
                    </div>

                    <Tabs value={tradeType} onValueChange={(value) => setTradeType(value as "buy" | "sell")}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="buy">Buy</TabsTrigger>
                        <TabsTrigger value="sell">Sell</TabsTrigger>
                      </TabsList>
                    </Tabs>

                    <div>
                      <Label htmlFor="amount">Amount ({selectedCrypto.symbol})</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(e.target.value)}
                        placeholder="0.00"
                        step="0.000001"
                        disabled={!isAuthenticated || isExecutingTrade}
                      />
                    </div>

                    {tradeAmount && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm">
                          Total: {formatCurrency(parseFloat(tradeAmount || "0") * selectedCrypto.currentPrice)}
                        </p>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      onClick={handleTrade}
                      disabled={!isAuthenticated || !tradeAmount || isExecutingTrade}
                    >
                      {isExecutingTrade ? "Executing..." : `${tradeType === "buy" ? "Buy" : "Sell"} ${selectedCrypto.symbol}`}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Select a cryptocurrency from the market data to start trading
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Trades */}
            {isAuthenticated && trades.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Recent Trades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trades.slice(0, 5).map((trade: Trade) => (
                        <TableRow key={trade.id}>
                          <TableCell className="font-medium">{trade.symbol}</TableCell>
                          <TableCell>
                            <Badge variant={trade.type === "buy" ? "default" : "secondary"}>
                              {trade.type.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatNumber(trade.amount, 6)}</TableCell>
                          <TableCell>{formatCurrency(trade.price)}</TableCell>
                          <TableCell>{formatCurrency(trade.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
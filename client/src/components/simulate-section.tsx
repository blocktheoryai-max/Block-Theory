import { Gamepad2, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import PriceChart from "./price-chart";

export default function SimulateSection() {
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [buyOrderType, setBuyOrderType] = useState("market");
  const [sellOrderType, setSellOrderType] = useState("market");
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const { data: prices, refetch: refetchPrices } = useQuery({
    queryKey: ['/api/prices'],
    refetchInterval: 30000,
  });

  const { data: portfolio } = useQuery({
    queryKey: ['/api/portfolio'],
    enabled: isAuthenticated // Only fetch portfolio if user is authenticated
  });

  const { data: trades } = useQuery({
    queryKey: ['/api/trades'],
    enabled: isAuthenticated // Only fetch trades if user is authenticated
  });

  const updatePricesMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/prices/update'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prices'] });
      toast({
        title: "Prices Updated",
        description: "Market data has been refreshed",
      });
    },
  });

  const placeTradeMutation = useMutation({
    mutationFn: (tradeData: any) => apiRequest('POST', '/api/trades', tradeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trades'] });
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
      toast({
        title: "Trade Executed",
        description: "Your trade has been successfully executed",
      });
      setBuyAmount("");
      setSellAmount("");
    },
    onError: () => {
      toast({
        title: "Trade Failed",
        description: "Unable to execute trade. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBuyOrder = () => {
    if (!buyAmount || parseFloat(buyAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to buy",
        variant: "destructive",
      });
      return;
    }

    const btcPrice = Array.isArray(prices) ? prices.find((p: any) => p.symbol === "BTC")?.price || "45000" : "45000";
    const btcAmount = (parseFloat(buyAmount) / parseFloat(btcPrice)).toFixed(8);

    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to start trading",
        variant: "destructive",
      });
      return;
    }

    placeTradeMutation.mutate({
      symbol: "BTC",
      type: "buy",
      amount: btcAmount,
      price: btcPrice,
      totalValue: buyAmount,
    });
  };

  const handleSellOrder = () => {
    if (!sellAmount || parseFloat(sellAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to sell",
        variant: "destructive",
      });
      return;
    }

    const btcPrice = Array.isArray(prices) ? prices.find((p: any) => p.symbol === "BTC")?.price || "45000" : "45000";
    const totalValue = (parseFloat(sellAmount) * parseFloat(btcPrice)).toFixed(2);

    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to start trading",
        variant: "destructive",
      });
      return;
    }

    placeTradeMutation.mutate({
      symbol: "BTC",
      type: "sell",
      amount: sellAmount,
      price: btcPrice,
      totalValue,
    });
  };

  const calculatePortfolioValue = () => {
    if (!Array.isArray(portfolio) || !Array.isArray(prices)) return "10,247.85";
    
    let total = 2847.32; // Available USD
    portfolio.forEach((asset: any) => {
      const price = prices.find((p: any) => p.symbol === asset.symbol)?.price || "0";
      total += parseFloat(asset.amount) * parseFloat(price);
    });
    
    return total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getBTCHoldings = () => {
    if (!Array.isArray(portfolio)) return "0.00000";
    const btcAsset = portfolio.find((p: any) => p.symbol === "BTC");
    return btcAsset ? parseFloat(btcAsset.amount).toFixed(5) : "0.00000";
  };

  const getETHHoldings = () => {
    if (!Array.isArray(portfolio)) return "0.0000";
    const ethAsset = portfolio.find((p: any) => p.symbol === "ETH");
    return ethAsset ? parseFloat(ethAsset.amount).toFixed(4) : "0.0000";
  };

  return (
    <section id="simulate" className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 flex items-center justify-center">
            <Gamepad2 className="text-primary mr-3 h-10 w-10" />
            Simulate
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Practice trading with real market data and virtual currency. Build confidence before risking real money.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trading Interface */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-slate-900">Live Trading Simulator</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-600">Live Market Data</span>
                </div>
                <Button
                  onClick={() => updatePricesMutation.mutate()}
                  disabled={updatePricesMutation.isPending}
                  variant="outline"
                  size="sm"
                >
                  {updatePricesMutation.isPending ? 'Updating...' : 'Refresh'}
                </Button>
              </div>
            </div>

            {/* Price Chart Area */}
            <div className="mb-6">
              <PriceChart />
            </div>

            {/* Trading Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900">Buy BTC</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="buyAmount">Amount (USD)</Label>
                    <Input
                      id="buyAmount"
                      type="number"
                      placeholder="0.00"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="buyOrderType">Order Type</Label>
                    <Select value={buyOrderType} onValueChange={setBuyOrderType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select order type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="market">Market Order</SelectItem>
                        <SelectItem value="limit">Limit Order</SelectItem>
                        <SelectItem value="stop">Stop Loss</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleBuyOrder}
                    disabled={placeTradeMutation.isPending}
                    className="w-full bg-success hover:bg-success/90 text-white"
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    {placeTradeMutation.isPending ? 'Placing...' : 'Place Buy Order'}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900">Sell BTC</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="sellAmount">Amount (BTC)</Label>
                    <Input
                      id="sellAmount"
                      type="number"
                      placeholder="0.00000000"
                      value={sellAmount}
                      onChange={(e) => setSellAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sellOrderType">Order Type</Label>
                    <Select value={sellOrderType} onValueChange={setSellOrderType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select order type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="market">Market Order</SelectItem>
                        <SelectItem value="limit">Limit Order</SelectItem>
                        <SelectItem value="stop">Stop Loss</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleSellOrder}
                    disabled={placeTradeMutation.isPending}
                    className="w-full bg-error hover:bg-error/90 text-white"
                  >
                    <TrendingDown className="mr-2 h-4 w-4" />
                    {placeTradeMutation.isPending ? 'Placing...' : 'Place Sell Order'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio Sidebar */}
          <div className="space-y-6">
            {/* Virtual Balance */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Virtual Portfolio</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Total Value</span>
                  <span className="text-2xl font-bold text-slate-900">${calculatePortfolioValue()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Today's P&L</span>
                  <span className="text-success font-semibold">+$234.56 (+2.3%)</span>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Available USD</span>
                      <span className="font-medium">$2,847.32</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">BTC Holdings</span>
                      <span className="font-medium">{getBTCHoldings()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">ETH Holdings</span>
                      <span className="font-medium">{getETHHoldings()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {Array.isArray(trades) && trades.slice(0, 3).map((trade: any) => (
                  <div key={trade.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {trade.type === 'buy' ? 'Buy' : 'Sell'} {trade.symbol}
                      </div>
                      <div className="text-xs text-slate-500">Market Order</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900">
                        ${parseFloat(trade.totalValue).toFixed(2)}
                      </div>
                      <Badge className="text-xs bg-success/10 text-success">Filled</Badge>
                    </div>
                  </div>
                )) || (
                  <div className="text-center text-slate-500 text-sm py-4">
                    No recent orders
                  </div>
                )}
              </div>
            </div>

            {/* Risk Management */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Risk Management</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Risk Level</span>
                  <Badge className="bg-warning/10 text-warning">Moderate</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Stop Loss</span>
                  <span className="text-sm font-medium text-slate-900">-5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Position Size</span>
                  <span className="text-sm font-medium text-slate-900">2% per trade</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

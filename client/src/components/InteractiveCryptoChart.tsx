import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

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

interface ChartDataPoint {
  timestamp: string;
  price: number;
  volume: number;
  date: string;
}

const timeframeOptions = [
  { value: "1H", label: "1 Hour" },
  { value: "24H", label: "24 Hours" },
  { value: "7D", label: "7 Days" },
  { value: "1M", label: "1 Month" },
  { value: "3M", label: "3 Months" },
  { value: "1Y", label: "1 Year" },
  { value: "ALL", label: "All Time" }
];

const popularCryptos = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "BNB", name: "Binance Coin" },
  { symbol: "XRP", name: "Ripple" },
  { symbol: "ADA", name: "Cardano" },
  { symbol: "DOGE", name: "Dogecoin" },
  { symbol: "SOL", name: "Solana" },
  { symbol: "DOT", name: "Polkadot" },
  { symbol: "MATIC", name: "Polygon" },
  { symbol: "AVAX", name: "Avalanche" },
  { symbol: "UNI", name: "Uniswap" },
  { symbol: "LINK", name: "Chainlink" }
];

export function InteractiveCryptoChart() {
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [selectedTimeframe, setSelectedTimeframe] = useState("24H");
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const lastGeneratedRef = useRef<string>("");

  // Fetch current market data
  const { data: marketDataResponse, isLoading: marketLoading } = useQuery({
    queryKey: ["/api/market-data"],
    refetchInterval: 60000, // Refresh every minute to reduce instability
    staleTime: 30000 // Keep data fresh for 30 seconds
  });

  // Convert market data response to proper format for chart
  const marketData: CryptoPriceData[] = marketDataResponse && typeof marketDataResponse === 'object' 
    ? Object.values(marketDataResponse).map((item: any) => ({
        id: item.symbol?.toLowerCase() || 'unknown',
        symbol: item.symbol || 'UNKNOWN',
        name: item.name || 'Unknown',
        currentPrice: item.price || 0,
        priceChange24h: item.change24h || 0,
        priceChangePercentage24h: item.change24h || 0,
        high24h: item.high24h || item.price || 0,
        low24h: item.low24h || item.price || 0,
        volume24h: item.volume || 0,
        marketCap: item.marketCap || 0,
        lastUpdated: item.lastUpdate || new Date().toISOString()
      }))
    : [];

  // Get current crypto data
  const currentCrypto = marketData.find(crypto => crypto.symbol === selectedCrypto);

  // Generate historical data based on current price and timeframe
  useEffect(() => {
    if (!currentCrypto) return;
    
    // Prevent frequent regeneration of chart data
    const cacheKey = `${selectedCrypto}-${selectedTimeframe}-${Math.floor(currentCrypto.currentPrice / 100)}`;
    if (lastGeneratedRef.current === cacheKey) return;
    lastGeneratedRef.current = cacheKey;

    const generateHistoricalData = () => {
      const dataPoints: ChartDataPoint[] = [];
      const now = new Date();
      let intervals = 24;
      let timeUnit = 'hour';

      switch (selectedTimeframe) {
        case "1H":
          intervals = 60;
          timeUnit = 'minute';
          break;
        case "24H":
          intervals = 24;
          timeUnit = 'hour';
          break;
        case "7D":
          intervals = 7;
          timeUnit = 'day';
          break;
        case "1M":
          intervals = 30;
          timeUnit = 'day';
          break;
        case "3M":
          intervals = 90;
          timeUnit = 'day';
          break;
        case "1Y":
          intervals = 12;
          timeUnit = 'month';
          break;
        case "ALL":
          intervals = 24;
          timeUnit = 'month';
          break;
      }

      for (let i = intervals; i >= 0; i--) {
        const timestamp = new Date(now);
        
        switch (timeUnit) {
          case 'minute':
            timestamp.setMinutes(timestamp.getMinutes() - i);
            break;
          case 'hour':
            timestamp.setHours(timestamp.getHours() - i);
            break;
          case 'day':
            timestamp.setDate(timestamp.getDate() - i);
            break;
          case 'month':
            timestamp.setMonth(timestamp.getMonth() - i);
            break;
        }

        // Generate stable price variation based on current real price
        const basePrice = currentCrypto?.currentPrice || 50000; 
        const volatility = basePrice * 0.005; // Reduce volatility to 0.5% for stability
        const trendFactor = (intervals - i) / intervals * 0.05; // Smaller trend factor
        const randomFactor = (Math.sin(i * 0.1) * 0.5 + Math.cos(i * 0.2) * 0.3) * volatility; // Smoother variation
        const price = basePrice * (0.98 + trendFactor) + randomFactor;

        const volume = (currentCrypto?.volume24h || 1000000000) * (0.95 + Math.sin(i * 0.1) * 0.05);

        dataPoints.push({
          timestamp: timestamp.toISOString(),
          price: Math.max(price, 0),
          volume: volume,
          date: timestamp.toLocaleDateString()
        });
      }

      return dataPoints;
    };

    setChartData(generateHistoricalData());
  }, [currentCrypto, selectedTimeframe]);

  const formatPrice = (price: number) => {
    if (!price || isNaN(price)) return "$0.00";
    if (price >= 1) {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatVolume = (volume: number) => {
    if (!volume || isNaN(volume)) return "$0";
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`;
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`;
    } else {
      return `$${(volume / 1e3).toFixed(2)}K`;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-muted-foreground">{new Date(data.timestamp).toLocaleString()}</p>
          <p className="text-sm font-medium">
            Price: <span className="text-primary">{formatPrice(data.price)}</span>
          </p>
          <p className="text-sm font-medium">
            Volume: <span className="text-muted-foreground">{formatVolume(data.volume)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (marketLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading market data...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl mb-2">Interactive Price Chart</CardTitle>
            <div className="flex items-center gap-4">
              <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  {popularCryptos.map((crypto) => (
                    <SelectItem key={crypto.symbol} value={crypto.symbol}>
                      {crypto.symbol} - {crypto.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  {timeframeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {currentCrypto && (
            <div className="flex flex-col lg:items-end">
              <div className="text-3xl font-bold">{formatPrice(currentCrypto.currentPrice)}</div>
              <div className="flex items-center gap-2">
                {(currentCrypto.priceChangePercentage24h || 0) >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <Badge variant={(currentCrypto.priceChangePercentage24h || 0) >= 0 ? "default" : "destructive"}>
                  {(currentCrypto.priceChangePercentage24h || 0) >= 0 ? "+" : ""}
                  {(currentCrypto.priceChangePercentage24h || 0).toFixed(2)}%
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {(currentCrypto.priceChange24h || 0) >= 0 ? "+" : ""}
                  {formatPrice(Math.abs(currentCrypto.priceChange24h || 0))}
                </span>
              </div>
            </div>
          )}
        </div>

        {currentCrypto && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">24h High</div>
              <div className="font-medium">{formatPrice(currentCrypto.high24h || 0)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">24h Low</div>
              <div className="font-medium">{formatPrice(currentCrypto.low24h || 0)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">24h Volume</div>
              <div className="font-medium">{formatVolume(currentCrypto.volume24h || 0)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Market Cap</div>
              <div className="font-medium">{formatVolume(currentCrypto.marketCap || 0)}</div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="h-96 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(139, 92, 246)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="rgb(139, 92, 246)" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255, 255, 255, 0.08)" strokeWidth={1} />
                <XAxis 
                  dataKey="timestamp"
                  stroke="rgba(255, 255, 255, 0.6)"
                  tick={{ fontSize: 12, fill: 'rgba(255, 255, 255, 0.7)' }}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    if (selectedTimeframe === "1H") {
                      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    } else if (["24H", "7D"].includes(selectedTimeframe)) {
                      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                    } else {
                      return date.toLocaleDateString([], { month: 'short', year: '2-digit' });
                    }
                  }}
                />
                <YAxis 
                  stroke="rgba(255, 255, 255, 0.6)"
                  tick={{ fontSize: 12, fill: 'rgba(255, 255, 255, 0.7)' }}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
                  domain={['dataMin * 0.995', 'dataMax * 1.005']}
                  tickFormatter={formatPrice}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="rgb(139, 92, 246)"
                  fill="url(#priceGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-muted-foreground">No chart data available</div>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {timeframeOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedTimeframe === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeframe(option.value)}
              className="text-xs"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
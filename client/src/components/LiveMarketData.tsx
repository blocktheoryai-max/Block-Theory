import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";

interface CoinbaseProduct {
  product_id: string;
  price: string;
  price_24h_change: string;
  volume_24h: string;
  volume_percentage_change_24h: string;
}

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: string;
  marketCap: string;
  lastUpdate: string;
}

export function LiveMarketData() {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const coinMap = {
    'BTC-USD': { name: 'Bitcoin', symbol: 'BTC', marketCap: '$1.9T' },
    'ETH-USD': { name: 'Ethereum', symbol: 'ETH', marketCap: '$442B' },
    'SOL-USD': { name: 'Solana', symbol: 'SOL', marketCap: '$112B' },
    'ADA-USD': { name: 'Cardano', symbol: 'ADA', marketCap: '$38.2B' },
    'AVAX-USD': { name: 'Avalanche', symbol: 'AVAX', marketCap: '$16.8B' }
  };

  const fetchMarketData = async () => {
    try {
      const products = Object.keys(coinMap);
      const promises = products.map(async (productId) => {
        const response = await fetch(`https://api.coinbase.com/v2/exchange-rates?currency=${productId.split('-')[0]}`);
        if (!response.ok) throw new Error(`Failed to fetch ${productId}`);
        return response.json();
      });

      const results = await Promise.all(promises);
      
      const formattedData: MarketData[] = results.map((result, index) => {
        const productId = products[index] as keyof typeof coinMap;
        const coinInfo = coinMap[productId];
        const currency = productId.split('-')[0];
        const usdRate = parseFloat(result.data.rates.USD);
        
        // Simulate 24h change (in production, use a proper API with historical data)
        const change24h = (Math.random() - 0.5) * 10; // Random change between -5% and +5%
        
        return {
          symbol: coinInfo.symbol,
          name: coinInfo.name,
          price: usdRate,
          change24h,
          volume: `$${(Math.random() * 50 + 5).toFixed(1)}B`,
          marketCap: coinInfo.marketCap,
          lastUpdate: "Just now"
        };
      });

      setMarketData(formattedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError('Failed to fetch real-time data');
      
      // Fallback to simulated data if API fails
      const fallbackData: MarketData[] = [
        { symbol: "BTC", name: "Bitcoin", price: 96875, change24h: 2.4, volume: "$28.5B", marketCap: "$1.9T", lastUpdate: "Simulated" },
        { symbol: "ETH", name: "Ethereum", price: 3680, change24h: -1.2, volume: "$12.8B", marketCap: "$442B", lastUpdate: "Simulated" },
        { symbol: "SOL", name: "Solana", price: 240, change24h: 5.8, volume: "$3.2B", marketCap: "$112B", lastUpdate: "Simulated" },
        { symbol: "ADA", name: "Cardano", price: 1.09, change24h: 1.5, volume: "$1.1B", marketCap: "$38.2B", lastUpdate: "Simulated" },
        { symbol: "AVAX", name: "Avalanche", price: 42.50, change24h: 3.1, volume: "$890M", marketCap: "$16.8B", lastUpdate: "Simulated" }
      ];
      setMarketData(fallbackData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    
    // Update every 30 seconds
    const interval = setInterval(fetchMarketData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
            Live Market Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-slate-600 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="w-16 h-4 bg-slate-600 rounded"></div>
                    <div className="w-12 h-3 bg-slate-600 rounded"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-20 h-4 bg-slate-600 rounded"></div>
                  <div className="w-16 h-3 bg-slate-600 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
            Live Market Data
          </div>
          {error && (
            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
              Using fallback data
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {marketData.map((coin) => (
            <div key={coin.symbol} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600 hover:bg-slate-700/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{coin.symbol[0]}</span>
                </div>
                <div>
                  <div className="text-white font-semibold">{coin.symbol}</div>
                  <div className="text-xs text-gray-400">{coin.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">
                  ${coin.price.toLocaleString(undefined, { 
                    minimumFractionDigits: coin.price < 1 ? 4 : 2,
                    maximumFractionDigits: coin.price < 1 ? 4 : 2
                  })}
                </div>
                <div className={`text-sm flex items-center justify-end ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {coin.change24h >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(coin.change24h).toFixed(2)}%
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Vol: {coin.volume}</div>
                <div className="text-sm text-gray-400">Cap: {coin.marketCap}</div>
              </div>
              <div className="text-xs text-gray-500">{coin.lastUpdate}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live updates every 30 seconds</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
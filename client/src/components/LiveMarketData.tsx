import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, TrendingUp, RefreshCw, AlertCircle } from "lucide-react";
import { useMarketData, formatPrice, formatMarketCap, formatVolume } from "@/hooks/useMarketData";

export function LiveMarketData() {
  const { data: marketDataResponse, isLoading, error, isRefetching } = useMarketData();

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

  if (error) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <AlertCircle className="h-5 w-5 mr-2 text-red-400" />
            Market Data Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">Failed to fetch real-time market data</p>
            <p className="text-gray-400 text-sm">Please check your internet connection or try again later</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!marketDataResponse) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
            Live Market Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-400">No market data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const marketDataArray = Object.values(marketDataResponse);

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
            Live Market Data
          </div>
          <div className="flex items-center space-x-2">
            {isRefetching && (
              <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />
            )}
            <Badge variant="outline" className="text-green-400 border-green-400">
              Live
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {marketDataArray.map((coin) => (
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
                  {formatPrice(coin.price)}
                </div>
                <div className={`text-sm flex items-center justify-end ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {coin.change24h >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(coin.change24h).toFixed(2)}%
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Vol: {formatVolume(coin.volume)}</div>
                <div className="text-sm text-gray-400">Cap: {formatMarketCap(coin.marketCap)}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live updates every 30 seconds via CoinGecko API</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
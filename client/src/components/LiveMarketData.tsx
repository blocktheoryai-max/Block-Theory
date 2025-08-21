import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, TrendingUp, RefreshCw, AlertCircle } from "lucide-react";
import { useMarketData, formatPrice, formatMarketCap, formatVolume } from "@/hooks/useMarketData";

export function LiveMarketData() {
  const { data: marketDataResponse, isLoading, error, isRefetching } = useMarketData();

  if (isLoading) {
    return (
      <Card className="bg-card border-border backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            Live Market Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="w-16 h-4 bg-primary/20 rounded"></div>
                    <div className="w-12 h-3 bg-primary/20 rounded"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-20 h-4 bg-primary/20 rounded"></div>
                  <div className="w-16 h-3 bg-primary/20 rounded"></div>
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
      <Card className="bg-card border-border backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <AlertCircle className="h-5 w-5 mr-2 text-destructive" />
            Market Data Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive mb-4">Failed to fetch real-time market data</p>
            <p className="text-muted-foreground text-sm">Please check your internet connection or try again later</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!marketDataResponse) {
    return (
      <Card className="bg-card border-border backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            Live Market Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No market data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const marketDataArray = Object.values(marketDataResponse);

  return (
    <Card className="bg-card border-border backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-foreground">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            Live Market Data
          </div>
          <div className="flex items-center space-x-2">
            {isRefetching && (
              <RefreshCw className="h-4 w-4 text-primary animate-spin" />
            )}
            <Badge variant="outline" className="text-green-600 border-green-600 dark:text-green-400 dark:border-green-400">
              Live
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {marketDataArray.map((coin) => (
            <div key={coin.symbol} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  coin.symbol === 'BTC' ? 'bg-gradient-to-r from-primary to-primary/80' :
                  coin.symbol === 'ETH' ? 'bg-gradient-to-r from-primary/90 to-primary/70' :
                  coin.symbol === 'BNB' ? 'bg-gradient-to-r from-primary/80 to-primary/60' :
                  coin.symbol === 'ADA' ? 'bg-gradient-to-r from-primary/70 to-primary/50' :
                  coin.symbol === 'SOL' ? 'bg-gradient-to-r from-primary/60 to-primary/40' :
                  'bg-gradient-to-r from-primary to-primary/80'
                }`}>
                  <span className="text-sm font-bold">{coin.symbol[0]}</span>
                </div>
                <div>
                  <div className="text-foreground font-semibold">{coin.symbol}</div>
                  <div className="text-xs text-muted-foreground">{coin.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-foreground font-semibold">
                  {formatPrice(coin.price)}
                </div>
                <div className={`text-sm flex items-center justify-end ${coin.change24h >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {coin.change24h >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(coin.change24h).toFixed(2)}%
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Vol: {formatVolume(coin.volume)}</div>
                <div className="text-sm text-muted-foreground">Cap: {formatMarketCap(coin.marketCap)}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span>Live updates every 30 seconds via CoinGecko API</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
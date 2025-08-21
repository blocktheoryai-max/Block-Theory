import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Fish,
  Zap,
  TrendingUp,
  Activity,
  Globe,
  MapPin,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Eye,
  Filter,
  RefreshCw
} from 'lucide-react';

interface WhaleTransaction {
  id: string;
  coin: string;
  amount: number;
  value: number;
  type: 'buy' | 'sell';
  exchange: string;
  location: {
    country: string;
    region: string;
    coordinates: [number, number];
  };
  timestamp: number;
  impact: 'massive' | 'large' | 'medium';
  confirmed: boolean;
}

interface MomentumData {
  coin: string;
  symbol: string;
  momentum: number;
  volume24h: number;
  transactions: number;
  whaleActivity: number;
  trend: 'explosive' | 'rising' | 'cooling';
  catalysts: string[];
}

interface RegionActivity {
  region: string;
  transactions: number;
  volume: number;
  dominantCoin: string;
  activity: 'high' | 'medium' | 'low';
}

export function WhaleHeatMap() {
  const [whaleTransactions, setWhaleTransactions] = useState<WhaleTransaction[]>([]);
  const [momentumData, setMomentumData] = useState<MomentumData[]>([]);
  const [regionActivity, setRegionActivity] = useState<RegionActivity[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'btc' | 'eth' | 'alt'>('all');
  const [timeframe, setTimeframe] = useState<'1h' | '6h' | '24h'>('6h');
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const generateWhaleTransactions = () => {
      const coins = ['BTC', 'ETH', 'BNB', 'ADA', 'SOL', 'AVAX', 'MATIC', 'DOT'];
      const exchanges = ['Binance', 'Coinbase', 'Kraken', 'Bitfinex', 'OKX', 'Huobi'];
      const locations = [
        { country: 'United States', region: 'North America', coordinates: [-95.7129, 37.0902] as [number, number] },
        { country: 'Singapore', region: 'Asia Pacific', coordinates: [103.8198, 1.3521] as [number, number] },
        { country: 'United Kingdom', region: 'Europe', coordinates: [-3.4360, 55.3781] as [number, number] },
        { country: 'Japan', region: 'Asia Pacific', coordinates: [138.2529, 36.2048] as [number, number] },
        { country: 'Germany', region: 'Europe', coordinates: [10.4515, 51.1657] as [number, number] },
        { country: 'South Korea', region: 'Asia Pacific', coordinates: [127.7669, 35.9078] as [number, number] },
        { country: 'Switzerland', region: 'Europe', coordinates: [8.2275, 46.8182] as [number, number] },
        { country: 'Australia', region: 'Asia Pacific', coordinates: [133.7751, -25.2744] as [number, number] }
      ];

      const transactions: WhaleTransaction[] = [];
      
      for (let i = 0; i < 15; i++) {
        const coin = coins[Math.floor(Math.random() * coins.length)];
        const exchange = exchanges[Math.floor(Math.random() * exchanges.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const isBuy = Math.random() > 0.5;
        const amount = Math.random() * 1000 + 100;
        const value = amount * (coin === 'BTC' ? 96000 : coin === 'ETH' ? 3600 : Math.random() * 100 + 10);
        
        transactions.push({
          id: `whale-tx-${i}`,
          coin,
          amount,
          value,
          type: isBuy ? 'buy' : 'sell',
          exchange,
          location,
          timestamp: Date.now() - Math.random() * 3600000, // Last hour
          impact: value > 2000000 ? 'massive' : value > 500000 ? 'large' : 'medium',
          confirmed: Math.random() > 0.1
        });
      }
      
      setWhaleTransactions(transactions.sort((a, b) => b.timestamp - a.timestamp));
    };

    const generateMomentumData = () => {
      const momentumCoins: MomentumData[] = [
        {
          coin: 'Solana',
          symbol: 'SOL',
          momentum: 94.2,
          volume24h: 2100000000,
          transactions: 1547,
          whaleActivity: 87,
          trend: 'explosive',
          catalysts: ['DeFi TVL surge', 'Major DEX launch', 'Institutional adoption']
        },
        {
          coin: 'Avalanche',
          symbol: 'AVAX',
          momentum: 78.5,
          volume24h: 890000000,
          transactions: 892,
          whaleActivity: 72,
          trend: 'rising',
          catalysts: ['Gaming partnerships', 'Cross-chain bridge']
        },
        {
          coin: 'Polygon',
          symbol: 'MATIC',
          momentum: 85.1,
          volume24h: 1200000000,
          transactions: 2103,
          whaleActivity: 65,
          trend: 'explosive',
          catalysts: ['zkEVM success', 'Enterprise adoption']
        },
        {
          coin: 'Chainlink',
          symbol: 'LINK',
          momentum: 67.3,
          volume24h: 650000000,
          transactions: 543,
          whaleActivity: 58,
          trend: 'rising',
          catalysts: ['Oracle expansion', 'CCIP launch']
        }
      ];
      setMomentumData(momentumCoins);
    };

    const generateRegionActivity = () => {
      const regions: RegionActivity[] = [
        {
          region: 'Asia Pacific',
          transactions: 547,
          volume: 8900000000,
          dominantCoin: 'BTC',
          activity: 'high'
        },
        {
          region: 'North America',
          transactions: 423,
          volume: 6700000000,
          dominantCoin: 'ETH',
          activity: 'high'
        },
        {
          region: 'Europe',
          transactions: 312,
          volume: 4200000000,
          dominantCoin: 'BTC',
          activity: 'medium'
        },
        {
          region: 'Middle East',
          transactions: 89,
          volume: 1200000000,
          dominantCoin: 'USDT',
          activity: 'low'
        }
      ];
      setRegionActivity(regions);
    };

    generateWhaleTransactions();
    generateMomentumData();
    generateRegionActivity();

    if (isLive) {
      const interval = setInterval(() => {
        generateWhaleTransactions();
        generateMomentumData();
        generateRegionActivity();
      }, 15000); // Update every 15 seconds

      return () => clearInterval(interval);
    }
  }, [isLive, timeframe]);

  const filteredTransactions = whaleTransactions.filter(tx => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'btc') return tx.coin === 'BTC';
    if (selectedFilter === 'eth') return tx.coin === 'ETH';
    if (selectedFilter === 'alt') return !['BTC', 'ETH'].includes(tx.coin);
    return true;
  });

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'massive': return 'bg-red-500/20 text-red-300 border-red-400';
      case 'large': return 'bg-orange-500/20 text-orange-300 border-orange-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400';
      default: return 'bg-muted';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'explosive': return <Flame className="w-4 h-4 text-orange-500" />;
      case 'rising': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'cooling': return <Activity className="w-4 h-4 text-blue-500" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) return `$${(volume / 1000000000).toFixed(1)}B`;
    if (volume >= 1000000) return `$${(volume / 1000000).toFixed(0)}M`;
    return `$${volume.toFixed(0)}`;
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Globe className="w-6 h-6 text-primary" />
              Whale Movement Heat Map
              <Badge className={`${isLive ? 'bg-red-500/20 text-red-300' : 'bg-gray-500/20 text-gray-300'}`}>
                {isLive ? 'LIVE' : 'PAUSED'}
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsLive(!isLive)}
                className="border-primary/30"
              >
                {isLive ? <Eye className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                {isLive ? 'Live' : 'Refresh'}
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filter:</span>
              {(['all', 'btc', 'eth', 'alt'] as const).map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className="h-7"
                >
                  {filter.toUpperCase()}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Timeframe:</span>
              {(['1h', '6h', '24h'] as const).map((time) => (
                <Button
                  key={time}
                  variant={timeframe === time ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeframe(time)}
                  className="h-7"
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Whale Transactions */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Fish className="w-5 h-5 text-primary" />
                Live Whale Movements
                <Badge variant="outline" className="text-xs">
                  {filteredTransactions.length} active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {filteredTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/50 hover:bg-card/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${tx.confirmed ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{tx.coin}</span>
                          <span className={`text-sm flex items-center gap-1 ${tx.type === 'buy' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {tx.type === 'buy' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {tx.type.toUpperCase()}
                          </span>
                          <Badge variant="outline" className={getImpactColor(tx.impact)}>
                            {tx.impact}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          {tx.location.country} • {tx.exchange} • {Math.floor((Date.now() - tx.timestamp) / 60000)}m ago
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-foreground">{formatValue(tx.value)}</div>
                      <div className="text-xs text-muted-foreground">{tx.amount.toFixed(2)} {tx.coin}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Regional Activity */}
        <div>
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <MapPin className="w-5 h-5 text-primary" />
                Regional Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionActivity.map((region) => (
                  <div key={region.region} className="p-3 bg-card/50 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground">{region.region}</span>
                      <Badge variant="outline" className={
                        region.activity === 'high' ? 'text-green-600 border-green-600 dark:text-green-400 dark:border-green-400' :
                        region.activity === 'medium' ? 'text-yellow-600 border-yellow-600 dark:text-yellow-400 dark:border-yellow-400' :
                        'text-red-600 border-red-600 dark:text-red-400 dark:border-red-400'
                      }>
                        {region.activity}
                      </Badge>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Volume:</span>
                        <span className="text-foreground">{formatVolume(region.volume)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transactions:</span>
                        <span className="text-foreground">{region.transactions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Top Asset:</span>
                        <span className="text-foreground font-bold">{region.dominantCoin}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Momentum Tracking */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Zap className="w-6 h-6 text-primary" />
            Real-time Momentum Tracking
            <Badge className="bg-primary/20 text-primary border-primary/30">
              Live Analysis
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {momentumData.map((coin) => (
              <Card key={coin.symbol} className="bg-card/50 border border-border/50 hover:bg-card/70 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center text-white font-bold text-sm">
                        {coin.symbol[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{coin.symbol}</div>
                        <div className="text-xs text-muted-foreground">{coin.coin}</div>
                      </div>
                    </div>
                    {getTrendIcon(coin.trend)}
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Momentum:</span>
                      <span className="text-primary font-bold">{coin.momentum}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Volume 24h:</span>
                      <span className="text-foreground">{formatVolume(coin.volume24h)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Whale Activity:</span>
                      <span className="text-foreground">{coin.whaleActivity}%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground mb-1">Key Catalysts:</div>
                    {coin.catalysts.slice(0, 2).map((catalyst, idx) => (
                      <div key={idx} className="text-xs text-foreground bg-primary/10 px-2 py-1 rounded">
                        🔥 {catalyst}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
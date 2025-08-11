import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity, Bitcoin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";

interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  price: string;
  change24h: number;
  marketCap: string;
  volume: string;
  rank: number;
}

const mockMarketData = {
  totalMarketCap: "3.92T",
  totalVolume: "301.53B",
  btcDominance: "62.01%",
  marketChange: 2.23
};

const mockCryptoAssets: CryptoAsset[] = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    price: "121,837.42",
    change24h: 3.33,
    marketCap: "2.4T",
    volume: "73.8B",
    rank: 1
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum", 
    price: "4,309.26",
    change24h: 1.86,
    marketCap: "521.4B",
    volume: "36.4B",
    rank: 2
  },
  {
    id: "xrp",
    symbol: "XRP",
    name: "XRP",
    price: "3.28",
    change24h: 0.64,
    marketCap: "194.2B",
    volume: "6.1B",
    rank: 3
  },
  {
    id: "tether",
    symbol: "USDT",
    name: "Tether",
    price: "1.00",
    change24h: 0.02,
    marketCap: "164.5B",
    volume: "120.0B",
    rank: 4
  },
  {
    id: "binancecoin",
    symbol: "BNB",
    name: "BNB",
    price: "822.72",
    change24h: 1.14,
    marketCap: "114.6B",
    volume: "2.3B",
    rank: 5
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    price: "185.58",
    change24h: 1.36,
    marketCap: "100.5B",
    volume: "6.4B",
    rank: 6
  },
  {
    id: "usd-coin",
    symbol: "USDC",
    name: "USDC",
    price: "1.00",
    change24h: 0.00,
    marketCap: "65.2B",
    volume: "13.5B",
    rank: 7
  },
  {
    id: "dogecoin",
    symbol: "DOGE",
    name: "Dogecoin",
    price: "0.24",
    change24h: 0.45,
    marketCap: "36.1B",
    volume: "2.5B",
    rank: 8
  }
];

const topMovers = [
  { symbol: "ZORA", name: "Zora", price: "0.14", change: 50.25 },
  { symbol: "ERN", name: "Ethernity Chain", price: "1.03", change: 26.44 },
  { symbol: "ZRO", name: "LayerZero", price: "2.43", change: 22.84 },
  { symbol: "STG", name: "Stargate Finance", price: "0.19", change: 16.19 },
  { symbol: "LDO", name: "Lido DAO", price: "1.51", change: 14.64 },
  { symbol: "ENA", name: "Ethena", price: "0.84", change: 11.62 }
];

const newListings = [
  { symbol: "ENA", name: "Ethena", addedDate: "Added Jun 5" },
  { symbol: "SKY", name: "Sky", addedDate: "Added Jul 10" },
  { symbol: "PUMP", name: "Pump.fun", addedDate: "Added Jul 15" }
];

export default function CryptocurrencySection() {
  const { data: prices } = useQuery({
    queryKey: ['/api/prices']
  });

  const formatPrice = (price: string) => {
    const num = parseFloat(price.replace(/,/g, ''));
    if (num >= 1000) return `$${price}`;
    return `$${price}`;
  };

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <span className={`inline-flex items-center text-sm font-medium ${
        isPositive ? 'text-green-600' : 'text-red-600'
      }`}>
        {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
        {isPositive ? '+' : ''}{change.toFixed(2)}%
      </span>
    );
  };

  return (
    <section id="cryptocurrency" className="py-20 bg-gradient-to-br from-purple-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 flex items-center justify-center">
            <Bitcoin className="text-primary mr-3 h-10 w-10" />
            Cryptocurrency Markets
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Explore live cryptocurrency prices, market data, and trends across thousands of digital assets.
          </p>
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Market Cap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">${mockMarketData.totalMarketCap}</div>
              <div className="flex items-center text-green-600 text-sm mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{mockMarketData.marketChange}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">24h Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">${mockMarketData.totalVolume}</div>
              <div className="flex items-center text-green-600 text-sm mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +1.06%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">BTC Dominance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{mockMarketData.btcDominance}</div>
              <div className="flex items-center text-green-600 text-sm mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +0.96%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Active Cryptocurrencies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">9,276</div>
              <div className="text-sm text-slate-600 mt-1">Assets tracked</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all-assets" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all-assets">All Assets</TabsTrigger>
            <TabsTrigger value="top-movers">Top Movers</TabsTrigger>
            <TabsTrigger value="new-listings">New Listings</TabsTrigger>
          </TabsList>

          <TabsContent value="all-assets" className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900">Cryptocurrency Prices</h3>
                <p className="text-sm text-slate-600">Live prices and market data for top cryptocurrencies</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Asset</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">24h Change</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Market Cap</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Volume</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {mockCryptoAssets.map((asset) => (
                      <tr key={asset.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          {asset.rank}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                              <span className="text-xs font-bold text-primary">{asset.symbol.slice(0, 2)}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-900">{asset.name}</div>
                              <div className="text-sm text-slate-500">{asset.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          {formatPrice(asset.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatChange(asset.change24h)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          ${asset.marketCap}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          ${asset.volume}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="top-movers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topMovers.map((asset) => (
                <Card key={asset.symbol} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-bold text-primary">{asset.symbol.slice(0, 2)}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{asset.symbol}</div>
                          <div className="text-sm text-slate-600">{asset.name}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-slate-900">${asset.price}</div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        +{asset.change.toFixed(2)}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="new-listings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newListings.map((asset) => (
                <Card key={asset.symbol} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                        <span className="text-sm font-bold text-primary">{asset.symbol.slice(0, 2)}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{asset.name}</div>
                        <div className="text-sm text-slate-600">{asset.symbol}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {asset.addedDate}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Start Trading Cryptocurrencies</h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Learn how to trade these cryptocurrencies safely with our interactive lessons and risk-free simulation tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Activity className="w-5 h-5 mr-2" />
              Start Learning
            </Button>
            <Button variant="outline" size="lg">
              <BarChart3 className="w-5 h-5 mr-2" />
              Try Simulator
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
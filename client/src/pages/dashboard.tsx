import { useState } from "react";
import { Link } from "wouter";
import { LiveBlockchain } from "@/components/LiveBlockchain";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  Wallet,
  CreditCard,
  ExternalLink,
  BookOpen,
  Target,
  Zap,
  Shield,
  Globe,
  Coins,
  Activity
} from "lucide-react";

interface MarketData {
  symbol: string;
  name: string;
  price: string;
  change24h: number;
  marketCap: string;
  volume: string;
}

export default function Dashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h");

  const marketData: MarketData[] = [
    { symbol: "BTC", name: "Bitcoin", price: "$96,875", change24h: 2.4, marketCap: "$1.9T", volume: "$28.5B" },
    { symbol: "ETH", name: "Ethereum", price: "$3,680", change24h: -1.2, marketCap: "$442B", volume: "$12.8B" },
    { symbol: "SOL", name: "Solana", price: "$240", change24h: 5.8, marketCap: "$112B", volume: "$3.2B" },
    { symbol: "ADA", name: "Cardano", price: "$1.09", change24h: 1.5, marketCap: "$38.2B", volume: "$1.1B" }
  ];

  const platforms = [
    {
      title: "Crypto Payments",
      description: "Accept crypto payments for your business",
      icon: CreditCard,
      color: "from-green-500 to-emerald-600",
      features: ["Multiple cryptocurrencies", "Instant settlements", "Low fees", "Global reach"]
    },
    {
      title: "Market Dashboard",
      description: "Real-time crypto market analytics",
      icon: BarChart3,
      color: "from-blue-500 to-cyan-600",
      features: ["Live price feeds", "Technical analysis", "Portfolio tracking", "Market alerts"]
    },
    {
      title: "DeFi Explorer",
      description: "Explore decentralized finance protocols",
      icon: Coins,
      color: "from-purple-500 to-violet-600",
      features: ["Yield farming", "Liquidity pools", "Protocol analytics", "Risk assessment"]
    },
    {
      title: "NFT Marketplace",
      description: "Discover and trade digital collectibles",
      icon: Wallet,
      color: "from-pink-500 to-rose-600",
      features: ["Curated collections", "Creator tools", "Auction system", "Rarity analytics"]
    }
  ];

  const externalResources = [
    { name: "CoinGecko", description: "Market data & analytics", url: "https://coingecko.com" },
    { name: "DeFiPulse", description: "DeFi protocol rankings", url: "https://defipulse.com" },
    { name: "Etherscan", description: "Ethereum blockchain explorer", url: "https://etherscan.io" },
    { name: "CoinDesk", description: "Crypto news & insights", url: "https://coindesk.com" },
    { name: "Messari", description: "Crypto research & data", url: "https://messari.io" },
    { name: "The Block", description: "Institutional crypto news", url: "https://theblock.co" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  TradeTutor
                </h1>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Crypto Education & Analytics Platform
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Master cryptocurrency trading with comprehensive education, advanced analytics, 
                  and real-time blockchain insights. Your journey to crypto expertise starts here.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/learn">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
                    Start Learning
                  </Button>
                </Link>
                <Link href="/analyze">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3 text-lg">
                    View Analytics
                  </Button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">33+</div>
                  <div className="text-sm text-gray-400">Lessons</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">4</div>
                  <div className="text-sm text-gray-400">Core Features</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-sm text-gray-400">Market Data</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Live Market Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {marketData.map((asset) => (
                    <div key={asset.symbol} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{asset.symbol[0]}</span>
                        </div>
                        <div>
                          <div className="text-white font-semibold">{asset.symbol}</div>
                          <div className="text-xs text-gray-400">{asset.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">{asset.price}</div>
                        <div className={`text-xs flex items-center ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {asset.change24h >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {Math.abs(asset.change24h)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Live Blockchain Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-400" />
                Live Blockchain Activity
              </CardTitle>
              <CardDescription className="text-gray-400">
                Watch Bitcoin blocks being mined in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LiveBlockchain />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Platform Features</CardTitle>
                <CardDescription className="text-gray-400">
                  Comprehensive crypto education and analytics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/learn">
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="text-white font-semibold">Learn</div>
                        <div className="text-xs text-gray-400">33+ comprehensive lessons</div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
                
                <Link href="/simulate">
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <Target className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="text-white font-semibold">Simulate</div>
                        <div className="text-xs text-gray-400">Practice trading risk-free</div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
                
                <Link href="/analyze">
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="w-5 h-5 text-purple-400" />
                      <div>
                        <div className="text-white font-semibold">Analyze</div>
                        <div className="text-xs text-gray-400">Advanced market analytics</div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
                
                <Link href="/community">
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-orange-400" />
                      <div>
                        <div className="text-white font-semibold">Community</div>
                        <div className="text-xs text-gray-400">Connect with traders</div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Platform Ecosystem */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Explore Other Platforms
          </h2>
          <p className="text-xl text-gray-300">
            Comprehensive crypto ecosystem for all your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {platforms.map((platform, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 group cursor-pointer">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${platform.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <platform.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{platform.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{platform.description}</p>
                <div className="space-y-1">
                  {platform.features.map((feature, i) => (
                    <div key={i} className="flex items-center text-xs text-gray-500">
                      <div className="w-1 h-1 bg-blue-400 rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* External Resources */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-400" />
              External Resources
            </CardTitle>
            <CardDescription className="text-gray-400">
              Essential crypto platforms and tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {externalResources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors group"
                >
                  <div>
                    <div className="text-white font-semibold">{resource.name}</div>
                    <div className="text-xs text-gray-400">{resource.description}</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
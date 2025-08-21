import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown,
  Activity,
  Zap,
  Eye,
  DollarSign,
  BarChart3,
  PieChart,
  Waves,
  Target,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  BookOpen
} from "lucide-react";

interface WhaleTransaction {
  id: string;
  amount: number;
  currency: string;
  type: 'buy' | 'sell';
  exchange: string;
  timestamp: string;
  walletAddress: string;
  impact: 'high' | 'medium' | 'low';
}

interface MarketMetrics {
  fearGreedIndex: number;
  dominance: { btc: number; eth: number };
  totalMarketCap: string;
  volume24h: string;
  activeAddresses: number;
  hashRate: string;
}

export default function Analyze() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h");
  const [selectedAsset, setSelectedAsset] = useState("BTC");

  // Mock data for whale transactions
  const whaleTransactions: WhaleTransaction[] = [
    {
      id: "1",
      amount: 1250,
      currency: "BTC",
      type: "buy",
      exchange: "Binance",
      timestamp: "2 hours ago",
      walletAddress: "1A1zP1...eP2gNc",
      impact: "high"
    },
    {
      id: "2", 
      amount: 15000,
      currency: "ETH",
      type: "sell",
      exchange: "Coinbase",
      timestamp: "4 hours ago",
      walletAddress: "0x742d3...4bc89",
      impact: "medium"
    },
    {
      id: "3",
      amount: 850,
      currency: "BTC",
      type: "buy",
      exchange: "Kraken",
      timestamp: "6 hours ago", 
      walletAddress: "3FJzP2...mK8nQ",
      impact: "high"
    }
  ];

  const marketMetrics: MarketMetrics = {
    fearGreedIndex: 78,
    dominance: { btc: 54.2, eth: 17.8 },
    totalMarketCap: "$2.31T",
    volume24h: "$89.4B", 
    activeAddresses: 1234567,
    hashRate: "485.6 EH/s"
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getFearGreedColor = (index: number) => {
    if (index <= 25) return "text-red-600";
    if (index <= 50) return "text-orange-600";
    if (index <= 75) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Crypto Market Analysis
            </h1>
            <p className="text-xl text-gray-300">
              Advanced blockchain analytics and whale tracking for educational insights
            </p>
          </div>

          {/* Market Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Fear & Greed Index</p>
                    <p className={`text-2xl font-bold ${getFearGreedColor(marketMetrics.fearGreedIndex)}`}>
                      {marketMetrics.fearGreedIndex}
                    </p>
                    <p className="text-xs text-gray-500">Extreme Greed</p>
                  </div>
                  <Target className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Market Cap</p>
                    <p className="text-2xl font-bold text-white">{marketMetrics.totalMarketCap}</p>
                    <p className="text-xs text-green-400">+2.8% (24h)</p>
                  </div>
                  <PieChart className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">24h Volume</p>
                    <p className="text-2xl font-bold text-white">{marketMetrics.volume24h}</p>
                    <p className="text-xs text-blue-400">+12.4% (24h)</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">BTC Dominance</p>
                    <p className="text-2xl font-bold text-white">{marketMetrics.dominance.btc}%</p>
                    <p className="text-xs text-orange-400">-0.3% (24h)</p>
                  </div>
                  <Activity className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="whale-tracker" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border-slate-700">
              <TabsTrigger value="whale-tracker" className="data-[state=active]:bg-blue-600">
                Whale Tracker
              </TabsTrigger>
              <TabsTrigger value="market-metrics" className="data-[state=active]:bg-blue-600">
                Market Metrics
              </TabsTrigger>
              <TabsTrigger value="on-chain" className="data-[state=active]:bg-blue-600">
                On-Chain Data
              </TabsTrigger>
              <TabsTrigger value="whitepaper" className="data-[state=active]:bg-blue-600">
                Project Analysis
              </TabsTrigger>
              <TabsTrigger value="educational" className="data-[state=active]:bg-blue-600">
                Learning Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="whale-tracker" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Waves className="h-5 w-5 mr-2 text-blue-400" />
                    Whale Transaction Monitor
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Track large cryptocurrency movements for market insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {whaleTransactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-full ${tx.type === 'buy' ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                            {tx.type === 'buy' ? 
                              <ArrowUpRight className="h-4 w-4 text-green-400" /> : 
                              <ArrowDownRight className="h-4 w-4 text-red-400" />
                            }
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-white">
                                {tx.amount.toLocaleString()} {tx.currency}
                              </span>
                              <Badge className={getImpactColor(tx.impact)}>
                                {tx.impact.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-400">
                              {tx.exchange} • {tx.walletAddress} • {tx.timestamp}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">Market Impact</div>
                          <div className={`font-semibold ${tx.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                            {tx.type === 'buy' ? '+' : '-'}${(tx.amount * (tx.currency === 'BTC' ? 96875 : 3680)).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="market-metrics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Market Dominance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-300">Bitcoin (BTC)</span>
                        <span className="text-white font-semibold">{marketMetrics.dominance.btc}%</span>
                      </div>
                      <Progress value={marketMetrics.dominance.btc} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-300">Ethereum (ETH)</span>
                        <span className="text-white font-semibold">{marketMetrics.dominance.eth}%</span>
                      </div>
                      <Progress value={marketMetrics.dominance.eth} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-300">Others</span>
                        <span className="text-white font-semibold">{100 - marketMetrics.dominance.btc - marketMetrics.dominance.eth}%</span>
                      </div>
                      <Progress value={100 - marketMetrics.dominance.btc - marketMetrics.dominance.eth} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Network Health</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Active Addresses</span>
                      <span className="text-white font-semibold">{marketMetrics.activeAddresses.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Hash Rate</span>
                      <span className="text-white font-semibold">{marketMetrics.hashRate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Network Security</span>
                      <Badge className="bg-green-900/50 text-green-400">Excellent</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="on-chain" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">On-Chain Analytics</CardTitle>
                  <CardDescription className="text-gray-400">
                    Real-time blockchain data for advanced analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                      <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">2.4 TPS</div>
                      <div className="text-sm text-gray-400">Bitcoin TX/sec</div>
                    </div>
                    <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                      <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">12 sec</div>
                      <div className="text-sm text-gray-400">Avg Block Time</div>
                    </div>
                    <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                      <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">$8.50</div>
                      <div className="text-sm text-gray-400">Avg TX Fee</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="whitepaper" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <FileText className="h-5 w-5 mr-2 text-purple-400" />
                    Project Analysis & Research
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Educational analysis of major cryptocurrency projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-white">Bitcoin (BTC)</h3>
                        <Badge className="bg-orange-900/50 text-orange-400">Layer 1</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Technical Score:</span>
                          <span className="text-green-400 font-semibold">95/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Use Case Score:</span>
                          <span className="text-green-400 font-semibold">100/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Market Cap:</span>
                          <span className="text-white">$1.2T</span>
                        </div>
                      </div>
                      <p className="text-gray-300 text-xs mt-3">
                        The original cryptocurrency and digital gold standard. Revolutionary proof-of-work consensus.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-white">Ethereum (ETH)</h3>
                        <Badge className="bg-blue-900/50 text-blue-400">Smart Contracts</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Technical Score:</span>
                          <span className="text-green-400 font-semibold">92/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Use Case Score:</span>
                          <span className="text-green-400 font-semibold">98/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Market Cap:</span>
                          <span className="text-white">$450B</span>
                        </div>
                      </div>
                      <p className="text-gray-300 text-xs mt-3">
                        Leading smart contract platform enabling DeFi, NFTs, and decentralized applications.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="educational" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <BookOpen className="h-5 w-5 mr-2 text-blue-400" />
                    Educational Insights
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Learn from current market conditions and whale behavior
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-blue-400 mb-2">Understanding Whale Transactions</h4>
                    <p className="text-gray-300 text-sm">
                      Large transactions (1000+ BTC or 10,000+ ETH) can indicate institutional activity. 
                      When whales buy, it often signals confidence; when they sell, it may indicate profit-taking or market uncertainty.
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-green-400 mb-2">Fear & Greed Index Analysis</h4>
                    <p className="text-gray-300 text-sm">
                      Current index of 78 suggests "Extreme Greed" - historically, this can indicate a market top. 
                      Contrarian investors often consider this a time to be cautious.
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold text-purple-400 mb-2">Market Dominance Insights</h4>
                    <p className="text-gray-300 text-sm">
                      Bitcoin's 54.2% dominance indicates a strong market leader position. 
                      When BTC dominance rises, altcoins typically underperform, and vice versa.
                    </p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-semibold text-orange-400 mb-2">On-Chain Metrics Explained</h4>
                    <p className="text-gray-300 text-sm">
                      Network hash rate indicates security level. Higher active addresses suggest growing adoption. 
                      Transaction fees reflect network demand and congestion.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
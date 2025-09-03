import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Copy, 
  Trophy,
  Star,
  ChartBar,
  Activity,
  DollarSign,
  Percent,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  Info,
  Sparkles,
  Crown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/Navigation";
import MobileBottomNav from "@/components/MobileBottomNav";

interface EliteTrader {
  id: string;
  username: string;
  avatar: string;
  rank: number;
  profitPercentage: number;
  winRate: number;
  totalCopiers: number;
  monthlyReturn: number;
  totalProfit: number;
  riskLevel: "Low" | "Medium" | "High";
  tradingStyle: string;
  topAssets: string[];
  description: string;
  isVerified: boolean;
  isPremium: boolean;
  minCopyAmount: number;
  performanceFee: number;
}

const eliteTraders: EliteTrader[] = [
  {
    id: "1",
    username: "CryptoWhale",
    avatar: "🐋",
    rank: 1,
    profitPercentage: 312.5,
    winRate: 78.4,
    totalCopiers: 2841,
    monthlyReturn: 24.3,
    totalProfit: 1250000,
    riskLevel: "Medium",
    tradingStyle: "Swing Trading",
    topAssets: ["BTC", "ETH", "SOL"],
    description: "Professional trader with 8+ years experience in crypto markets",
    isVerified: true,
    isPremium: true,
    minCopyAmount: 100,
    performanceFee: 20
  },
  {
    id: "2",
    username: "DeFiMaster",
    avatar: "🚀",
    rank: 2,
    profitPercentage: 245.8,
    winRate: 72.1,
    totalCopiers: 1923,
    monthlyReturn: 18.7,
    totalProfit: 890000,
    riskLevel: "High",
    tradingStyle: "DeFi Yield Farming",
    topAssets: ["UNI", "AAVE", "SUSHI"],
    description: "DeFi specialist focusing on yield optimization strategies",
    isVerified: true,
    isPremium: false,
    minCopyAmount: 50,
    performanceFee: 15
  },
  {
    id: "3",
    username: "SafeTrader",
    avatar: "🛡️",
    rank: 3,
    profitPercentage: 156.2,
    winRate: 81.5,
    totalCopiers: 3256,
    monthlyReturn: 12.4,
    totalProfit: 560000,
    riskLevel: "Low",
    tradingStyle: "Conservative",
    topAssets: ["BTC", "USDT", "USDC"],
    description: "Low-risk strategies for consistent returns",
    isVerified: true,
    isPremium: false,
    minCopyAmount: 25,
    performanceFee: 10
  },
  {
    id: "4",
    username: "AltcoinKing",
    avatar: "👑",
    rank: 4,
    profitPercentage: 425.7,
    winRate: 65.3,
    totalCopiers: 1547,
    monthlyReturn: 31.2,
    totalProfit: 2100000,
    riskLevel: "High",
    tradingStyle: "Altcoin Trading",
    topAssets: ["DOGE", "SHIB", "PEPE"],
    description: "High-risk high-reward altcoin specialist",
    isVerified: true,
    isPremium: true,
    minCopyAmount: 200,
    performanceFee: 25
  },
  {
    id: "5",
    username: "NFTTrader",
    avatar: "🎨",
    rank: 5,
    profitPercentage: 189.4,
    winRate: 69.8,
    totalCopiers: 892,
    monthlyReturn: 15.6,
    totalProfit: 420000,
    riskLevel: "Medium",
    tradingStyle: "NFT Flipping",
    topAssets: ["APE", "MANA", "SAND"],
    description: "Specialized in NFT ecosystem tokens",
    isVerified: false,
    isPremium: false,
    minCopyAmount: 75,
    performanceFee: 18
  }
];

export default function CopyTrading() {
  const [selectedTrader, setSelectedTrader] = useState<EliteTrader | null>(null);
  const [copyAmount, setCopyAmount] = useState<string>("100");
  const [selectedTab, setSelectedTab] = useState("all");
  const [copiedTraders, setCopiedTraders] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleCopyTrader = (trader: EliteTrader) => {
    if (parseFloat(copyAmount) < trader.minCopyAmount) {
      toast({
        title: "Minimum Amount Required",
        description: `Minimum copy amount for ${trader.username} is $${trader.minCopyAmount}`,
        variant: "destructive",
      });
      return;
    }

    setCopiedTraders([...copiedTraders, trader.id]);
    toast({
      title: "Successfully Copying Trader!",
      description: `You're now copying ${trader.username} with $${copyAmount}`,
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low": return "bg-green-500/20 text-green-400 border-green-400/30";
      case "Medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-400/30";
      case "High": return "bg-red-500/20 text-red-400 border-red-400/30";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const filteredTraders = eliteTraders.filter(trader => {
    if (selectedTab === "all") return true;
    if (selectedTab === "verified") return trader.isVerified;
    if (selectedTab === "low-risk") return trader.riskLevel === "Low";
    if (selectedTab === "high-return") return trader.monthlyReturn > 20;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 pb-20 md:pb-0">
      <div className="md:block hidden">
        <Navigation />
      </div>
      
      {/* Mobile Header */}
      <div className="md:hidden bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Copy className="w-5 h-5 text-purple-400" />
            Copy Trading
          </h1>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-400/30">
            BETA
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white">5,249</div>
              <div className="text-xs text-gray-400">Active Copiers</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-400">+42.8%</div>
              <div className="text-xs text-gray-400">Avg. Monthly Return</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white">$8.4M</div>
              <div className="text-xs text-gray-400">Total Copied</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-400">156</div>
              <div className="text-xs text-gray-400">Elite Traders</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList className="grid grid-cols-4 w-full bg-gray-800/50">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="verified" className="text-xs">Verified</TabsTrigger>
            <TabsTrigger value="low-risk" className="text-xs">Low Risk</TabsTrigger>
            <TabsTrigger value="high-return" className="text-xs">High Return</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Traders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTraders.map((trader) => {
            const isCopying = copiedTraders.includes(trader.id);
            return (
              <Card 
                key={trader.id} 
                className={`bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all ${
                  trader.isPremium ? 'ring-2 ring-yellow-500/30' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{trader.avatar}</div>
                      <div>
                        <CardTitle className="text-white flex items-center gap-2">
                          {trader.username}
                          {trader.isVerified && <CheckCircle className="w-4 h-4 text-blue-400" />}
                          {trader.isPremium && <Crown className="w-4 h-4 text-yellow-400" />}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            Rank #{trader.rank}
                          </Badge>
                          <Badge className={getRiskColor(trader.riskLevel)}>
                            {trader.riskLevel} Risk
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Performance Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-400">Total Profit</div>
                      <div className="text-lg font-bold text-green-400">
                        +{trader.profitPercentage}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Win Rate</div>
                      <div className="text-lg font-bold text-white">
                        {trader.winRate}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Monthly</div>
                      <div className="text-lg font-bold text-white">
                        +{trader.monthlyReturn}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Copiers</div>
                      <div className="text-lg font-bold text-white flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {trader.totalCopiers.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Trading Style */}
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Trading Style</div>
                    <div className="text-sm text-white">{trader.tradingStyle}</div>
                  </div>

                  {/* Top Assets */}
                  <div>
                    <div className="text-xs text-gray-400 mb-2">Top Assets</div>
                    <div className="flex gap-2">
                      {trader.topAssets.map((asset) => (
                        <Badge key={asset} variant="outline" className="text-xs">
                          {asset}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Copy Settings */}
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-gray-400">Min. Amount</span>
                      <span className="text-white">${trader.minCopyAmount}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Performance Fee</span>
                      <span className="text-white">{trader.performanceFee}%</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {isCopying ? (
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Currently Copying
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      onClick={() => handleCopyTrader(trader)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Trader
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}
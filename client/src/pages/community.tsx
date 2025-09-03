import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { LiveBlockchain } from "@/components/LiveBlockchain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  MessageSquare, 
  Send,
  Heart,
  TrendingUp,
  Trophy,
  Star,
  Clock,
  ThumbsUp,
  Eye,
  Zap,
  Activity,
  BarChart3,
  Globe,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Bitcoin,
  DollarSign,
  Target,
  AlertTriangle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { SEOHead, SEO_PRESETS } from "@/components/SEOHead";

interface CryptoNews {
  id: string;
  title: string;
  summary: string;
  category: 'market' | 'tech' | 'regulation' | 'adoption';
  timestamp: string;
  source: string;
  impact: 'bullish' | 'bearish' | 'neutral';
  relevantCoins: string[];
}

interface MarketUpdate {
  coin: string;
  price: string;
  change24h: number;
  volume: string;
  marketCap: string;
  lastUpdate: string;
}

interface CommunityMetrics {
  activeUsers: number;
  totalPosts: number;
  weeklyGrowth: number;
  onlineNow: number;
}

interface ForumPost {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  replies: number;
  views: number;
  timestamp: string;
  author: {
    name: string;
    tier: string;
    reputation: number;
  };
  tags: string[];
  isLiked: boolean;
  isPinned: boolean;
}

export default function Community() {
  const [selectedTab, setSelectedTab] = useState("feed");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("general");
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [liveThreads, setLiveThreads] = useState<any[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  // Real-time crypto news and market data from live APIs
  const [cryptoNews, setCryptoNews] = useState<CryptoNews[]>([]);
  const [marketUpdates, setMarketUpdates] = useState<MarketUpdate[]>([]);

  // Fetch live crypto news
  const { data: liveNews } = useQuery<CryptoNews[]>({
    queryKey: ["/api/crypto-news"],
    refetchInterval: 60000, // Refetch every minute
  });

  // Fetch live market data for community
  const { data: liveMarketData } = useQuery({
    queryKey: ["/api/market-data"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Live discussion threads that update in real-time
  useEffect(() => {
    const generateLiveThread = () => {
      const topics = [
        "🚀 BTC breaking resistance at $113k - Bull run continuing?",
        "💎 ETH 2.0 staking rewards discussion",
        "📈 DeFi yield farming strategies 2025", 
        "🔥 AI coins pumping - Which to watch?",
        "⚡ Lightning Network adoption growing",
        "🌟 NFT market recovery signals",
        "💰 Best altcoins under $1 discussion",
        "📊 Technical analysis: Support levels holding",
        "🎯 Portfolio rebalancing strategies",
        "🔮 Crypto predictions for Q1 2025"
      ];

      const users = ["CryptoKing", "DiamondHands", "TechAnalyst", "BlockchainBob", "DeFiDave", "AltcoinAnna"];
      const activities = ["just posted", "is analyzing", "shared insight", "asked about", "discovered"];
      
      return {
        id: Date.now(),
        topic: topics[Math.floor(Math.random() * topics.length)],
        user: users[Math.floor(Math.random() * users.length)],
        activity: activities[Math.floor(Math.random() * activities.length)],
        timestamp: new Date().toLocaleTimeString(),
        participants: Math.floor(Math.random() * 50) + 5,
        isLive: true
      };
    };

    // Add initial threads
    setLiveThreads([
      generateLiveThread(),
      generateLiveThread(),
      generateLiveThread()
    ]);

    // Update threads every 8-12 seconds to simulate live activity
    const interval = setInterval(() => {
      setLiveThreads(prev => {
        const updated = [...prev];
        if (Math.random() > 0.3) {
          // Add new thread or update existing
          if (updated.length < 6 && Math.random() > 0.5) {
            updated.unshift(generateLiveThread());
          } else if (updated.length > 0) {
            // Update existing thread
            const randomIndex = Math.floor(Math.random() * updated.length);
            updated[randomIndex] = {
              ...updated[randomIndex],
              participants: updated[randomIndex].participants + Math.floor(Math.random() * 3),
              timestamp: new Date().toLocaleTimeString()
            };
          }
        }
        return updated.slice(0, 6); // Keep max 6 threads
      });
    }, Math.random() * 4000 + 8000); // 8-12 seconds

    return () => clearInterval(interval);
  }, []);

  // Update local state when live data arrives
  useEffect(() => {
    if (liveNews && Array.isArray(liveNews)) {
      setCryptoNews(liveNews);
    }
  }, [liveNews]);

  useEffect(() => {
    if (liveMarketData) {
      // Transform live market data to display format
      const formattedUpdates: MarketUpdate[] = Object.entries(liveMarketData).map(([key, data]: [string, any]) => ({
        coin: data.symbol,
        price: `$${data.price.toLocaleString()}`,
        change24h: data.change24h,
        volume: `$${(data.volume / 1000000).toFixed(1)}M`,
        marketCap: `$${(data.marketCap / 1000000000).toFixed(1)}B`,
        lastUpdate: new Date(data.lastUpdate).toLocaleTimeString()
      }));
      setMarketUpdates(formattedUpdates.slice(0, 5)); // Show top 5
    }
  }, [liveMarketData]);

  const { data: posts, isLoading } = useQuery<ForumPost[]>({
    queryKey: ["/api/forum"],
  });

  // Ensure posts is always an array with fallback
  const safePosts = Array.isArray(posts) ? posts : [];

  const communityMetrics: CommunityMetrics = {
    activeUsers: 12847,
    totalPosts: 45623,
    weeklyGrowth: 18.5,
    onlineNow: 1247
  };

  const createPost = useMutation({
    mutationFn: async ({ title, content, category }: {
      title: string;
      content: string;
      category: string;
    }) => {
      return apiRequest("POST", "/api/forum", { title, content, category });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum"] });
      setNewPostTitle("");
      setNewPostContent("");
      setShowNewPostForm(false);
      toast({ title: "Post created successfully!" });
    },
    onError: (error) => {
      toast({
        title: "Failed to create post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "bullish": return "text-green-400";
      case "bearish": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "market": return "bg-blue-900/50 text-blue-400";
      case "tech": return "bg-purple-900/50 text-purple-400";
      case "regulation": return "bg-orange-900/50 text-orange-400";
      case "adoption": return "bg-green-900/50 text-green-400";
      default: return "bg-gray-900/50 text-gray-400";
    }
  };

  return (
    <>
      <SEOHead {...SEO_PRESETS.community} canonical="/community" />
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Crypto Community Hub
            </h1>
            <p className="text-xl text-gray-300">
              Real-time market insights and live blockchain activity
            </p>
          </div>

          {/* Community Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Active Users</p>
                    <p className="text-2xl font-bold text-white">{communityMetrics.activeUsers.toLocaleString()}</p>
                    <p className="text-xs text-green-400">+{communityMetrics.weeklyGrowth}% this week</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Posts</p>
                    <p className="text-2xl font-bold text-white">{communityMetrics.totalPosts.toLocaleString()}</p>
                    <p className="text-xs text-blue-400">Educational focus</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Online Now</p>
                    <p className="text-2xl font-bold text-white">{communityMetrics.onlineNow.toLocaleString()}</p>
                    <div className="flex items-center text-xs text-green-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      Live
                    </div>
                  </div>
                  <Activity className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Market Sentiment</p>
                    <p className="text-2xl font-bold text-green-400">Bullish</p>
                    <p className="text-xs text-gray-400">78% positive signals</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </div>


          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-slate-700">
              <TabsTrigger value="feed" className="data-[state=active]:bg-blue-600">
                Live Feed
              </TabsTrigger>
              <TabsTrigger value="market" className="data-[state=active]:bg-blue-600">
                Market Data
              </TabsTrigger>
              <TabsTrigger value="blockchain" className="data-[state=active]:bg-blue-600">
                Live Blockchain
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                    Real-Time Crypto News Feed
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Live cryptocurrency news and market updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {(cryptoNews || []).map((news) => (
                      <div key={news.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge className={getCategoryColor(news.category)}>
                              {news.category.toUpperCase()}
                            </Badge>
                            <Badge className={`${getImpactColor(news.impact)} bg-transparent border-current`}>
                              {news.impact === 'bullish' ? '↗' : news.impact === 'bearish' ? '↘' : '→'} {news.impact.toUpperCase()}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-400">{news.timestamp}</span>
                        </div>
                        <h3 className="font-semibold text-white mb-2">{news.title}</h3>
                        <p className="text-sm text-gray-300 mb-3">{news.summary}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-400">Source: {news.source}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <div className="flex items-center space-x-1">
                              {(news.relevantCoins || []).map((coin) => (
                                <Badge key={coin} variant="outline" className="text-xs">
                                  {coin}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="market" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                    Live Market Updates
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Real-time cryptocurrency prices and market data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(marketUpdates || []).map((update) => (
                      <div key={update.coin} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-white">{update.coin[0]}</span>
                          </div>
                          <div>
                            <div className="text-white font-semibold">{update.coin}</div>
                            <div className="text-xs text-gray-400">Last updated: {update.lastUpdate}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold">{update.price}</div>
                          <div className={`text-sm flex items-center ${update.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {update.change24h >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {Math.abs(update.change24h).toFixed(2)}%
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">Vol: {update.volume}</div>
                          <div className="text-sm text-gray-400">Cap: {update.marketCap}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="blockchain" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Activity className="h-5 w-5 mr-2 text-green-400" />
                    Live Bitcoin Blockchain
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Real-time blockchain activity and new block confirmations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LiveBlockchain />
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </>
  );
}
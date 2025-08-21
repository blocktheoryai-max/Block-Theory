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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  // Real-time crypto news simulation (in production, this would come from a real API)
  const [cryptoNews, setCryptoNews] = useState<CryptoNews[]>([]);
  const [marketUpdates, setMarketUpdates] = useState<MarketUpdate[]>([]);

  // Initialize news feed
  useEffect(() => {
    const initialNews: CryptoNews[] = [
      {
        id: "1",
        title: "Bitcoin ETF Sees Record $2.4B Inflows This Week",
        summary: "Institutional demand continues to drive Bitcoin adoption with unprecedented ETF inflows signaling strong institutional confidence.",
        category: "adoption",
        timestamp: "2 minutes ago",
        source: "CryptoDaily",
        impact: "bullish",
        relevantCoins: ["BTC"]
      },
      {
        id: "2",
        title: "Ethereum Dencun Upgrade Successfully Reduces Gas Fees by 70%",
        summary: "The latest Ethereum upgrade introduces proto-danksharding, significantly improving Layer 2 scalability and reducing transaction costs.",
        category: "tech",
        timestamp: "8 minutes ago",
        source: "BlockNews",
        impact: "bullish",
        relevantCoins: ["ETH"]
      },
      {
        id: "3",
        title: "Major Bank Announces Crypto Trading Services for Retail Clients",
        summary: "Traditional finance continues embracing crypto as another major institution opens cryptocurrency trading to millions of customers.",
        category: "adoption",
        timestamp: "15 minutes ago",
        source: "FinanceToday",
        impact: "bullish",
        relevantCoins: ["BTC", "ETH", "SOL"]
      },
      {
        id: "4",
        title: "DeFi TVL Reaches New All-Time High of $85B",
        summary: "Decentralized finance protocols see massive growth with total value locked surpassing previous records driven by yield farming innovation.",
        category: "market",
        timestamp: "22 minutes ago",
        source: "DeFiPulse",
        impact: "bullish",
        relevantCoins: ["ETH", "AVAX", "SOL"]
      },
      {
        id: "5",
        title: "Regulatory Clarity Emerges as Multiple Countries Update Crypto Laws",
        summary: "Several jurisdictions publish clearer cryptocurrency regulations, providing much-needed clarity for institutional adoption.",
        category: "regulation",
        timestamp: "35 minutes ago",
        source: "RegulatoryWatch",
        impact: "bullish",
        relevantCoins: ["BTC", "ETH"]
      }
    ];

    const initialMarketData: MarketUpdate[] = [
      { coin: "BTC", price: "$96,875", change24h: 2.4, volume: "$28.5B", marketCap: "$1.9T", lastUpdate: "1m ago" },
      { coin: "ETH", price: "$3,680", change24h: -1.2, volume: "$12.8B", marketCap: "$442B", lastUpdate: "1m ago" },
      { coin: "SOL", price: "$240", change24h: 5.8, volume: "$3.2B", marketCap: "$112B", lastUpdate: "2m ago" },
      { coin: "AVAX", price: "$42.50", change24h: 3.1, volume: "$890M", marketCap: "$16.8B", lastUpdate: "2m ago" },
      { coin: "ADA", price: "$1.09", change24h: 1.5, volume: "$1.1B", marketCap: "$38.2B", lastUpdate: "3m ago" }
    ];

    setCryptoNews(initialNews);
    setMarketUpdates(initialMarketData);

    // Simulate real-time updates
    const newsInterval = setInterval(() => {
      const newNewsItem: CryptoNews = {
        id: Date.now().toString(),
        title: "Breaking: Major Cryptocurrency Development Announced",
        summary: "Live market update: Significant movement detected in cryptocurrency markets as institutional activity increases.",
        category: "market",
        timestamp: "Just now",
        source: "LiveCrypto",
        impact: Math.random() > 0.5 ? "bullish" : "bearish",
        relevantCoins: ["BTC", "ETH"]
      };
      
      setCryptoNews(prev => [newNewsItem, ...prev.slice(0, 9)]);
    }, 45000); // New news every 45 seconds

    const priceInterval = setInterval(() => {
      setMarketUpdates(prev => prev.map(coin => ({
        ...coin,
        change24h: coin.change24h + (Math.random() - 0.5) * 0.5,
        lastUpdate: "Just now"
      })));
    }, 30000); // Price updates every 30 seconds

    return () => {
      clearInterval(newsInterval);
      clearInterval(priceInterval);
    };
  }, []);

  const { data: posts = [], isLoading } = useQuery<ForumPost[]>({
    queryKey: ["/api/forum"],
  });

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
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Crypto Community Hub
            </h1>
            <p className="text-xl text-gray-300">
              Real-time market insights, community discussions, and live blockchain activity
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
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-700">
              <TabsTrigger value="feed" className="data-[state=active]:bg-blue-600">
                Live Feed
              </TabsTrigger>
              <TabsTrigger value="market" className="data-[state=active]:bg-blue-600">
                Market Data
              </TabsTrigger>
              <TabsTrigger value="blockchain" className="data-[state=active]:bg-blue-600">
                Live Blockchain
              </TabsTrigger>
              <TabsTrigger value="discussions" className="data-[state=active]:bg-blue-600">
                Discussions
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
                    {cryptoNews.map((news) => (
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
                              {news.relevantCoins.map((coin) => (
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
                    {marketUpdates.map((update) => (
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

            <TabsContent value="discussions" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Community Discussions</h2>
                {isAuthenticated && (
                  <Button 
                    onClick={() => setShowNewPostForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    New Post
                  </Button>
                )}
              </div>

              {showNewPostForm && (
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Create New Post</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Post title"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                    <Textarea
                      placeholder="Share your thoughts..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white min-h-[100px]"
                    />
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowNewPostForm(false)}
                        className="border-slate-600 text-gray-300"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={() => createPost.mutate({
                          title: newPostTitle,
                          content: newPostContent,
                          category: newPostCategory
                        })}
                        disabled={!newPostTitle || !newPostContent || createPost.isPending}
                        className="bg-gradient-to-r from-blue-600 to-purple-600"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Post
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-gray-400 mt-2">Loading discussions...</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <Card key={post.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                {post.author.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-white">{post.author.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {post.author.tier}
                                </Badge>
                              </div>
                              <div className="text-xs text-gray-400">{post.timestamp}</div>
                            </div>
                          </div>
                          {post.isPinned && (
                            <Badge className="bg-yellow-900/50 text-yellow-400">
                              Pinned
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                        <p className="text-gray-300 mb-4">{post.content}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                              <ThumbsUp className="w-4 h-4" />
                              <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>{post.replies}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{post.views}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            {post.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
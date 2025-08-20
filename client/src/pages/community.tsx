import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MessageCircle, TrendingUp, BookOpen, Award, Hash } from "lucide-react";
import CommunityChat from "@/components/community-chat";

export default function Community() {
  const [selectedCoinForChat, setSelectedCoinForChat] = useState<string | undefined>();

  const communityStats = [
    { label: "Active Traders", value: "2,847", icon: Users, change: "+12%" },
    { label: "Messages Today", value: "15,293", icon: MessageCircle, change: "+8%" },
    { label: "Trading Signals", value: "47", icon: TrendingUp, change: "+23%" },
    { label: "Knowledge Shared", value: "892", icon: BookOpen, change: "+15%" }
  ];

  const trendingTopics = [
    { name: "Bitcoin Analysis", count: 156, tag: "BTC" },
    { name: "DeFi Strategies", count: 89, tag: "DEFI" },
    { name: "Technical Patterns", count: 67, tag: "TA" },
    { name: "Market Predictions", count: 45, tag: "PRED" },
    { name: "Risk Management", count: 34, tag: "RISK" }
  ];

  const topContributors = [
    { name: "CryptoSage", contributions: 245, badge: "Expert", avatar: "🧙‍♂️" },
    { name: "BlockchainBull", contributions: 189, badge: "Mentor", avatar: "🐂" },
    { name: "DeFiDeep", contributions: 156, badge: "Specialist", avatar: "🔮" },
    { name: "TechTrader", contributions: 134, badge: "Analyst", avatar: "📊" },
    { name: "CoinCrafter", contributions: 98, badge: "Helper", avatar: "⚡" }
  ];

  const quickJoinRooms = [
    { name: "General Trading", type: "general", members: 1247, coin: null },
    { name: "Bitcoin (BTC)", type: "coin-specific", members: 892, coin: "BTC" },
    { name: "Ethereum (ETH)", type: "coin-specific", members: 756, coin: "ETH" },
    { name: "Technical Analysis", type: "technical-analysis", members: 634, coin: null },
    { name: "Trading Signals", type: "trading-signals", members: 512, coin: null }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community Hub</h1>
          <p className="text-slate-600 mt-1">
            Connect with fellow traders, share insights, and learn together
          </p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          Live Community
        </Badge>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {communityStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-green-600 font-medium">{stat.change}</p>
                  </div>
                  <Icon className="h-8 w-8 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="contributors">Top Users</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <CommunityChat selectedCoin={selectedCoinForChat} />
        </TabsContent>

        <TabsContent value="trending" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Hash className="h-5 w-5 mr-2" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trendingTopics.map((topic, index) => (
                    <div key={topic.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center">
                        <span className="w-6 h-6 bg-primary text-white text-xs rounded-full flex items-center justify-center mr-3">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium">{topic.name}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            #{topic.tag}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{topic.count}</p>
                        <p className="text-xs text-slate-500">mentions</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Market Sentiment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-green-800">Bullish Sentiment</span>
                      <span className="text-green-600 font-bold">68%</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "68%" }}></div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-red-800">Bearish Sentiment</span>
                      <span className="text-red-600 font-bold">32%</span>
                    </div>
                    <div className="w-full bg-red-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: "32%" }}></div>
                    </div>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-sm text-slate-600">
                      Based on community discussions and sentiment analysis
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contributors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Top Contributors This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topContributors.map((contributor, index) => (
                  <div key={contributor.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{contributor.avatar}</span>
                      <div>
                        <p className="font-medium">{contributor.name}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {contributor.badge}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{contributor.contributions}</p>
                      <p className="text-xs text-slate-500">contributions</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Quick Join Chat Rooms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickJoinRooms.map((room) => (
                  <div key={room.name} className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{room.name}</h3>
                      {room.coin && (
                        <Badge variant="outline" className="text-xs">
                          {room.coin}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-slate-600">
                        <Users className="h-4 w-4 mr-1" />
                        {room.members.toLocaleString()} members
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedCoinForChat(room.coin || undefined);
                          // Switch to chat tab
                          const chatTab = document.querySelector('[value="chat"]') as HTMLElement;
                          chatTab?.click();
                        }}
                      >
                        Join Chat
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
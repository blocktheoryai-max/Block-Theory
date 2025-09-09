import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, Gift, Award, Target, Zap, TrendingUp, 
  Star, DollarSign, Users, BookOpen, Clock, AlertCircle
} from "lucide-react";
import { LearnToEarn } from "@/components/learn-to-earn";
import { TradingCompetition } from "@/components/trading-competition";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Rewards() {
  const [activeTab, setActiveTab] = useState("earn");

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-8">
        {/* Hero Section */}
        <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/50 mb-6">
          <CardContent className="p-4 md:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold mb-2 flex items-center gap-2 md:gap-3">
                  <Gift className="w-8 h-8 md:w-10 md:h-10 text-yellow-500" />
                  Rewards Center
                  <Badge className="bg-orange-600 text-white text-sm px-3 py-1">
                    Coming Soon
                  </Badge>
                </h1>
                <p className="text-base md:text-lg text-gray-300 mb-4">
                  Reward features are currently in development. Focus on learning our complete crypto curriculum!
                </p>
                <div className="grid grid-cols-2 md:flex gap-2 md:gap-4">
                  <Card className="bg-black/50 border-green-500/50 relative">
                    <CardContent className="p-2 md:p-3">
                      <Badge className="absolute -top-2 -right-2 bg-yellow-600 text-xs px-2 py-0.5">
                        <Clock className="w-3 h-3 mr-1" />
                        Soon
                      </Badge>
                      <p className="text-xs md:text-sm text-gray-400">Total Rewards</p>
                      <p className="text-lg md:text-2xl font-bold text-green-400 opacity-50">$0</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-black/50 border-blue-500/50 relative">
                    <CardContent className="p-2 md:p-3">
                      <Badge className="absolute -top-2 -right-2 bg-yellow-600 text-xs px-2 py-0.5">
                        <Clock className="w-3 h-3 mr-1" />
                        Soon
                      </Badge>
                      <p className="text-xs md:text-sm text-gray-400">Global Rank</p>
                      <p className="text-lg md:text-2xl font-bold text-blue-400 opacity-50">--</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-black/50 border-purple-500/50 col-span-2 md:col-span-1 relative">
                    <CardContent className="p-2 md:p-3">
                      <Badge className="absolute -top-2 -right-2 bg-yellow-600 text-xs px-2 py-0.5">
                        <Clock className="w-3 h-3 mr-1" />
                        Soon
                      </Badge>
                      <p className="text-xs md:text-sm text-gray-400">Achievements</p>
                      <p className="text-lg md:text-2xl font-bold text-purple-400 opacity-50">0</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="hidden md:block">
                <Card className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-500/50 p-4">
                  <div className="text-center">
                    <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-2" />
                    <h3 className="font-bold text-lg">Diamond Tier</h3>
                    <p className="text-sm text-gray-400">3x Reward Multiplier</p>
                    <Progress value={75} className="mt-2" />
                    <p className="text-xs text-gray-500 mt-1">25% to Platinum</p>
                  </div>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <Badge className="bg-yellow-600 text-xs px-2 py-0.5 mb-1">
                Coming Soon
              </Badge>
              <p className="text-2xl font-bold text-green-400 opacity-50">$0.00</p>
              <p className="text-sm text-gray-400">This Month</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/30">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <p className="text-2xl font-bold text-blue-400">0</p>
              <p className="text-sm text-gray-400">Lessons Completed</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <Badge className="bg-yellow-600 text-xs px-2 py-0.5 mb-1">
                Coming Soon
              </Badge>
              <p className="text-2xl font-bold text-purple-400 opacity-50">0</p>
              <p className="text-sm text-gray-400">Competitions Won</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-500/30">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-orange-400" />
              <Badge className="bg-yellow-600 text-xs px-2 py-0.5 mb-1">
                Coming Soon
              </Badge>
              <p className="text-2xl font-bold text-orange-400 opacity-50">0</p>
              <p className="text-sm text-gray-400">Referrals</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
            <TabsTrigger value="earn" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 text-xs md:text-sm">
              <Gift className="w-4 h-4" />
              <span>Earn</span>
            </TabsTrigger>
            <TabsTrigger value="competitions" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 text-xs md:text-sm">
              <Trophy className="w-4 h-4" />
              <span>Compete</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 text-xs md:text-sm">
              <Award className="w-4 h-4" />
              <span>Achieve</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 text-xs md:text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Leaders</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="earn">
            <LearnToEarn />
          </TabsContent>

          <TabsContent value="competitions">
            <TradingCompetition />
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* NFT Certificates */}
                <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Crypto Fundamentals</h4>
                        <p className="text-sm text-gray-400">NFT Certificate #1247</p>
                      </div>
                    </div>
                    <Badge className="bg-purple-600 text-white">Legendary</Badge>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/30">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">DeFi Master</h4>
                        <p className="text-sm text-gray-400">NFT Certificate #892</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-600 text-white">Epic</Badge>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Trading Champion</h4>
                        <p className="text-sm text-gray-400">Weekly Competition Winner</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600 text-white">Rare</Badge>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-900/20 to-yellow-900/20 border-orange-500/30">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">100 Day Streak</h4>
                        <p className="text-sm text-gray-400">Consistency Master</p>
                      </div>
                    </div>
                    <Badge className="bg-orange-600 text-white">Ultra Rare</Badge>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle>Global Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: "CryptoMaster", earnings: 15847, country: "🇺🇸" },
                    { rank: 2, name: "BlockchainPro", earnings: 12543, country: "🇯🇵" },
                    { rank: 3, name: "DeFiKing", earnings: 10234, country: "🇬🇧" },
                    { rank: 247, name: "You", earnings: 2847, country: "🇺🇸", isUser: true },
                  ].map((user) => (
                    <Card 
                      key={user.rank}
                      className={`${
                        user.isUser 
                          ? "bg-purple-900/30 border-purple-500/50" 
                          : "bg-black/30 border-gray-700"
                      }`}
                    >
                      <CardContent className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl font-bold text-gray-400">
                            #{user.rank}
                          </div>
                          <div className="text-2xl">{user.country}</div>
                          <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-gray-400">
                              ${user.earnings.toLocaleString()} earned
                            </p>
                          </div>
                        </div>
                        {user.rank <= 3 && (
                          <Trophy className={`w-6 h-6 ${
                            user.rank === 1 ? "text-yellow-500" :
                            user.rank === 2 ? "text-gray-400" :
                            "text-orange-600"
                          }`} />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
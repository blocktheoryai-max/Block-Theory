import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy, TrendingUp, TrendingDown, Users, Clock, DollarSign,
  Target, Award, Zap, Crown, Medal, Star, ChevronUp, ChevronDown
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { triggerFireworks } from "@/lib/confetti";

interface Trader {
  rank: number;
  username: string;
  pnl: number;
  pnlPercentage: number;
  trades: number;
  winRate: number;
  avatar?: string;
  isCurrentUser?: boolean;
}

interface Competition {
  id: string;
  title: string;
  type: "daily" | "weekly" | "monthly";
  status: "upcoming" | "active" | "completed";
  prizePool: number;
  participants: number;
  timeRemaining?: string;
  startDate: string;
  endDate: string;
  userRank?: number;
  userPnl?: number;
}

const MOCK_LEADERBOARD: Trader[] = [
  { rank: 1, username: "CryptoKing", pnl: 2847.50, pnlPercentage: 28.48, trades: 47, winRate: 72.3 },
  { rank: 2, username: "MoonTrader", pnl: 2234.20, pnlPercentage: 22.34, trades: 35, winRate: 68.5 },
  { rank: 3, username: "DiamondHands", pnl: 1876.90, pnlPercentage: 18.77, trades: 42, winRate: 64.2 },
  { rank: 4, username: "You", pnl: 1543.30, pnlPercentage: 15.43, trades: 28, winRate: 60.7, isCurrentUser: true },
  { rank: 5, username: "WhaleWatcher", pnl: 1234.50, pnlPercentage: 12.35, trades: 31, winRate: 58.1 },
];

export function TradingCompetition() {
  const [selectedCompetition, setSelectedCompetition] = useState<string>("weekly");
  const [timeRemaining, setTimeRemaining] = useState("2d 14h 32m");
  const [userPortfolio, setUserPortfolio] = useState(10000);
  const [userPnl, setUserPnl] = useState(1543.30);

  // Fetch competition data
  const { data: competitions } = useQuery({
    queryKey: ["/api/competitions"],
    refetchInterval: 60000,
  });

  // Fetch leaderboard
  const { data: leaderboard } = useQuery({
    queryKey: ["/api/competitions/leaderboard", selectedCompetition],
    refetchInterval: 30000,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      // Update countdown timer
      const end = new Date();
      end.setDate(end.getDate() + 2);
      end.setHours(end.getHours() + 14);
      end.setMinutes(end.getMinutes() + 32);
      
      const now = new Date();
      const diff = end.getTime() - now.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const joinCompetition = async (competitionId: string) => {
    try {
      const response = await fetch(`/api/competitions/${competitionId}/join`, {
        method: "POST",
        credentials: "include",
      });
      
      if (response.ok) {
        triggerFireworks();
      }
    } catch (error) {
      console.error("Failed to join competition:", error);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-orange-600" />;
      default:
        return <span className="w-5 text-center text-sm font-bold">{rank}</span>;
    }
  };

  const getPrizeForRank = (rank: number, prizePool: number) => {
    const prizes = {
      1: prizePool * 0.4,
      2: prizePool * 0.25,
      3: prizePool * 0.15,
      4: prizePool * 0.1,
      5: prizePool * 0.05,
    };
    return prizes[rank as keyof typeof prizes] || prizePool * 0.01;
  };

  return (
    <div className="space-y-6">
      {/* Active Competition Banner */}
      <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Weekly Trading Competition
            </CardTitle>
            <Badge className="bg-red-600 text-white animate-pulse">
              <Clock className="w-3 h-3 mr-1" />
              {timeRemaining} remaining
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Card className="bg-black/50 border-yellow-500/30">
              <CardContent className="p-3">
                <p className="text-xs text-gray-400">Prize Pool</p>
                <p className="text-2xl font-bold text-yellow-500">$500</p>
              </CardContent>
            </Card>
            <Card className="bg-black/50 border-blue-500/30">
              <CardContent className="p-3">
                <p className="text-xs text-gray-400">Participants</p>
                <p className="text-2xl font-bold text-blue-400">247</p>
              </CardContent>
            </Card>
            <Card className="bg-black/50 border-green-500/30">
              <CardContent className="p-3">
                <p className="text-xs text-gray-400">Your Rank</p>
                <p className="text-2xl font-bold text-green-400">#4</p>
              </CardContent>
            </Card>
            <Card className="bg-black/50 border-purple-500/30">
              <CardContent className="p-3">
                <p className="text-xs text-gray-400">Your P&L</p>
                <p className="text-2xl font-bold text-purple-400">+15.43%</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex gap-2">
            <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
              <TrendingUp className="w-4 h-4 mr-2" />
              View My Portfolio
            </Button>
            <Button variant="outline" className="flex-1">
              <Users className="w-4 h-4 mr-2" />
              Invite Friends (+$5 bonus)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Live Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {MOCK_LEADERBOARD.map((trader) => (
              <Card 
                key={trader.rank}
                className={`${
                  trader.isCurrentUser 
                    ? "bg-purple-900/30 border-purple-500/50 ring-1 ring-purple-500" 
                    : "bg-black/30 border-gray-700"
                }`}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10">
                        {getRankIcon(trader.rank)}
                      </div>
                      <div>
                        <p className="font-semibold flex items-center gap-2">
                          {trader.username}
                          {trader.isCurrentUser && (
                            <Badge className="bg-purple-600 text-xs">You</Badge>
                          )}
                        </p>
                        <div className="flex gap-4 text-xs text-gray-400">
                          <span>{trader.trades} trades</span>
                          <span>{trader.winRate}% win rate</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        trader.pnl > 0 ? "text-green-400" : "text-red-400"
                      }`}>
                        ${trader.pnl.toFixed(2)}
                      </p>
                      <p className={`text-sm ${
                        trader.pnlPercentage > 0 ? "text-green-400" : "text-red-400"
                      } flex items-center justify-end gap-1`}>
                        {trader.pnlPercentage > 0 ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                        {Math.abs(trader.pnlPercentage)}%
                      </p>
                      {trader.rank <= 5 && (
                        <Badge className="mt-1 bg-yellow-600/20 text-yellow-400 border-yellow-600/50">
                          Prize: ${getPrizeForRank(trader.rank, 500).toFixed(0)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Competitions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Upcoming Competitions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Daily Competition */}
          <Card className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-blue-500/30">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Daily Sprint</h4>
                <p className="text-sm text-gray-400">Starts in 4 hours</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">$100 Prize</Badge>
                  <Badge variant="outline">24h Duration</Badge>
                </div>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Join ($0 Free)
              </Button>
            </CardContent>
          </Card>

          {/* Sponsored Competition */}
          <Card className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border-orange-500/30 ring-2 ring-orange-500/50">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-400" />
                  Binance Sponsored Challenge
                </h4>
                <p className="text-sm text-gray-400">Starts tomorrow</p>
                <div className="flex gap-2 mt-2">
                  <Badge className="bg-orange-600 text-white">$1000 Prize</Badge>
                  <Badge variant="outline">Special Rules</Badge>
                </div>
              </div>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                Learn More
              </Button>
            </CardContent>
          </Card>

          {/* Monthly Championship */}
          <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Monthly Championship</h4>
                <p className="text-sm text-gray-400">Starts in 3 days</p>
                <div className="flex gap-2 mt-2">
                  <Badge className="bg-purple-600 text-white">$5000 Prize</Badge>
                  <Badge variant="outline">Pro Only</Badge>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
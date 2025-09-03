import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy, Users, Zap, Clock, TrendingUp, Flame, Target,
  Swords, Crown, Medal, Star, AlertCircle, ChevronUp,
  Activity, Timer, Award, Sparkles
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { triggerCelebration } from "@/lib/confetti";

interface CompetitorProgress {
  userId: string;
  username: string;
  avatar?: string;
  progress: number;
  score: number;
  speed: number; // seconds
  streak: number;
  status: "active" | "completed" | "idle";
  rank?: number;
}

interface LiveChallenge {
  id: string;
  lessonId: string;
  lessonTitle: string;
  participants: number;
  prizePool: number;
  timeLimit: number; // minutes
  startTime: Date;
  endTime?: Date;
  status: "waiting" | "active" | "completed";
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  score: number;
  completionTime: number; // seconds
  accuracy: number; // percentage
  perfectCheckpoints: number;
  country?: string;
}

export function CompetitiveLearning({ lessonId, lessonTitle }: { lessonId: string; lessonTitle: string }) {
  const [selectedMode, setSelectedMode] = useState<"solo" | "race" | "battle">("race");
  const [isInChallenge, setIsInChallenge] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<LiveChallenge | null>(null);
  const [liveCompetitors, setLiveCompetitors] = useState<CompetitorProgress[]>([]);
  const [userRank, setUserRank] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [speedBonus, setSpeedBonus] = useState(0);

  // Simulate real-time competitor updates
  useEffect(() => {
    if (isInChallenge) {
      const interval = setInterval(() => {
        // Simulate other users' progress
        setLiveCompetitors(prev => prev.map(competitor => ({
          ...competitor,
          progress: Math.min(100, competitor.progress + Math.random() * 5),
          score: competitor.score + Math.floor(Math.random() * 10),
          speed: competitor.speed + 1
        })));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isInChallenge]);

  // Calculate speed bonus based on completion time
  useEffect(() => {
    if (isInChallenge && currentChallenge) {
      const timer = setInterval(() => {
        const elapsed = Date.now() - currentChallenge.startTime.getTime();
        const remaining = (currentChallenge.timeLimit * 60 * 1000) - elapsed;
        setTimeRemaining(Math.max(0, remaining));
        
        // Speed bonus decreases over time
        const bonusPercentage = Math.max(0, 100 - (elapsed / 1000 / 60) * 10);
        setSpeedBonus(Math.floor(bonusPercentage));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isInChallenge, currentChallenge]);

  const joinChallenge = async (mode: string) => {
    setSelectedMode(mode as any);
    setIsInChallenge(true);
    
    // Mock challenge data
    const challenge: LiveChallenge = {
      id: `challenge-${Date.now()}`,
      lessonId,
      lessonTitle,
      participants: Math.floor(Math.random() * 50) + 10,
      prizePool: mode === "battle" ? 100 : 50,
      timeLimit: mode === "race" ? 10 : 15,
      startTime: new Date(),
      status: "active"
    };
    
    setCurrentChallenge(challenge);
    
    // Mock competitors
    const competitors: CompetitorProgress[] = [
      { userId: "you", username: "You", progress: 0, score: 0, speed: 0, streak: 0, status: "active", rank: 1 },
      { userId: "2", username: "CryptoNinja", progress: 0, score: 0, speed: 0, streak: 5, status: "active", rank: 2 },
      { userId: "3", username: "BlockMaster", progress: 0, score: 0, speed: 0, streak: 3, status: "active", rank: 3 },
      { userId: "4", username: "ChainKing", progress: 0, score: 0, speed: 0, streak: 7, status: "active", rank: 4 },
      { userId: "5", username: "DeFiPro", progress: 0, score: 0, speed: 0, streak: 2, status: "active", rank: 5 }
    ];
    
    setLiveCompetitors(competitors);
    triggerCelebration('achievement');
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Global Leaderboard
  const globalLeaderboard: LeaderboardEntry[] = [
    { rank: 1, userId: "1", username: "xCryptoKing", score: 9850, completionTime: 240, accuracy: 98, perfectCheckpoints: 12, country: "🇺🇸" },
    { rank: 2, userId: "2", username: "BlockchainSamurai", score: 9720, completionTime: 255, accuracy: 96, perfectCheckpoints: 11, country: "🇯🇵" },
    { rank: 3, userId: "3", username: "DeFiMaster", score: 9650, completionTime: 268, accuracy: 95, perfectCheckpoints: 10, country: "🇬🇧" },
    { rank: 4, userId: "you", username: "You", score: 8420, completionTime: 320, accuracy: 88, perfectCheckpoints: 8, country: "🇺🇸" },
    { rank: 5, userId: "5", username: "CryptoWhale", score: 8350, completionTime: 335, accuracy: 85, perfectCheckpoints: 7, country: "🇰🇷" }
  ];

  if (!isInChallenge) {
    return (
      <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Swords className="w-6 h-6 text-purple-400" />
              Competitive Learning Modes
            </span>
            <Badge className="bg-red-600 text-white animate-pulse">
              <Flame className="w-3 h-3 mr-1" />
              2x Rewards Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Challenge Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Speed Race */}
            <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/30 cursor-pointer hover:border-blue-400 transition-all"
                  onClick={() => joinChallenge("race")}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Timer className="w-8 h-8 text-blue-400" />
                  <Badge className="bg-blue-600">Popular</Badge>
                </div>
                <h3 className="font-semibold text-lg mb-1">Speed Race</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Complete the lesson faster than others
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Time Limit</span>
                    <span className="text-white">10 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Prize Pool</span>
                    <span className="text-green-400">$50 USDC</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Live Now</span>
                    <span className="text-blue-400">47 players</span>
                  </div>
                </div>
                <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700">
                  <Zap className="w-4 h-4 mr-2" />
                  Join Race
                </Button>
              </CardContent>
            </Card>

            {/* Battle Mode */}
            <Card className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border-red-500/30 cursor-pointer hover:border-red-400 transition-all"
                  onClick={() => joinChallenge("battle")}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Swords className="w-8 h-8 text-red-400" />
                  <Badge className="bg-red-600">Intense</Badge>
                </div>
                <h3 className="font-semibold text-lg mb-1">Battle Mode</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Head-to-head competition with eliminations
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Format</span>
                    <span className="text-white">5v5 Teams</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Prize Pool</span>
                    <span className="text-green-400">$100 USDC</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Live Now</span>
                    <span className="text-red-400">23 players</span>
                  </div>
                </div>
                <Button className="w-full mt-3 bg-red-600 hover:bg-red-700">
                  <Swords className="w-4 h-4 mr-2" />
                  Join Battle
                </Button>
              </CardContent>
            </Card>

            {/* Tournament */}
            <Card className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-500/30 opacity-75">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                  <Badge className="bg-yellow-600">Coming Soon</Badge>
                </div>
                <h3 className="font-semibold text-lg mb-1">Tournament</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Weekly championship with massive prizes
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Next Start</span>
                    <span className="text-white">Sunday 2PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Prize Pool</span>
                    <span className="text-green-400">$500 USDC</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Registered</span>
                    <span className="text-yellow-400">142/200</span>
                  </div>
                </div>
                <Button className="w-full mt-3" disabled variant="outline">
                  <Clock className="w-4 h-4 mr-2" />
                  Opens in 2d 14h
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Global Leaderboard Preview */}
          <Card className="bg-black/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Global Leaderboard - {lessonTitle}
                </span>
                <Button size="sm" variant="outline">View All</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {globalLeaderboard.slice(0, 3).map((entry) => (
                  <Card key={entry.rank} className={`${
                    entry.userId === "you" 
                      ? "bg-purple-900/30 border-purple-500/50" 
                      : "bg-slate-800/50 border-slate-700"
                  }`}>
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {entry.rank === 1 && <Crown className="w-6 h-6 text-yellow-500" />}
                          {entry.rank === 2 && <Medal className="w-6 h-6 text-gray-400" />}
                          {entry.rank === 3 && <Medal className="w-6 h-6 text-orange-600" />}
                          {entry.rank > 3 && <span className="w-6 text-center font-bold">#{entry.rank}</span>}
                        </div>
                        <div>
                          <p className="font-semibold flex items-center gap-2">
                            {entry.country} {entry.username}
                            {entry.userId === "you" && <Badge className="bg-purple-600 text-xs">You</Badge>}
                          </p>
                          <div className="flex gap-3 text-xs text-gray-400">
                            <span>{formatTime(entry.completionTime * 1000)}</span>
                            <span>{entry.accuracy}% accuracy</span>
                            <span>{entry.perfectCheckpoints} perfect</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-yellow-400">{entry.score}</p>
                        <p className="text-xs text-gray-400">points</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-3 text-center">
                <Activity className="w-6 h-6 mx-auto mb-1 text-blue-400" />
                <p className="text-xl font-bold">247</p>
                <p className="text-xs text-gray-400">Active Now</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-3 text-center">
                <Timer className="w-6 h-6 mx-auto mb-1 text-green-400" />
                <p className="text-xl font-bold">4:32</p>
                <p className="text-xs text-gray-400">Avg Time</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-3 text-center">
                <Target className="w-6 h-6 mx-auto mb-1 text-purple-400" />
                <p className="text-xl font-bold">92%</p>
                <p className="text-xs text-gray-400">Avg Score</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-3 text-center">
                <Award className="w-6 h-6 mx-auto mb-1 text-yellow-400" />
                <p className="text-xl font-bold">$847</p>
                <p className="text-xs text-gray-400">Today's Prizes</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Live Competition View
  return (
    <Card className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-500/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Swords className="w-6 h-6 text-red-400 animate-pulse" />
            LIVE: {selectedMode === "race" ? "Speed Race" : "Battle Mode"}
          </CardTitle>
          <div className="flex items-center gap-4">
            <Badge className="bg-yellow-600 text-white">
              <Zap className="w-3 h-3 mr-1" />
              Speed Bonus: +{speedBonus}%
            </Badge>
            <Badge className="bg-red-600 text-white animate-pulse">
              <Clock className="w-3 h-3 mr-1" />
              {formatTime(timeRemaining)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Live Rankings */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Live Rankings</h3>
            <Badge variant="outline">
              <Users className="w-3 h-3 mr-1" />
              {currentChallenge?.participants} competing
            </Badge>
          </div>
          
          {liveCompetitors.map((competitor, index) => (
            <Card 
              key={competitor.userId}
              className={`transition-all ${
                competitor.userId === "you" 
                  ? "bg-purple-900/30 border-purple-500/50 ring-2 ring-purple-500" 
                  : "bg-slate-800/50 border-slate-700"
              }`}
            >
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{competitor.username[0]}</AvatarFallback>
                      </Avatar>
                      {competitor.status === "active" && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm flex items-center gap-2">
                        {competitor.username}
                        {competitor.userId === "you" && <Badge className="text-xs">You</Badge>}
                        {competitor.streak > 3 && (
                          <span className="flex items-center gap-1 text-orange-400">
                            <Flame className="w-3 h-3" />
                            {competitor.streak}
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>{competitor.score} pts</span>
                        <span>{formatTime(competitor.speed * 1000)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-24">
                      <Progress value={competitor.progress} className="h-2" />
                    </div>
                    <Badge variant={index === 0 ? "default" : "outline"}>
                      #{index + 1}
                    </Badge>
                  </div>
                </div>
                
                {/* Position change indicator */}
                {competitor.rank && competitor.rank !== index + 1 && (
                  <div className={`text-xs ${
                    competitor.rank > index + 1 ? "text-green-400" : "text-red-400"
                  } flex items-center gap-1 mt-1`}>
                    <ChevronUp className={`w-3 h-3 ${
                      competitor.rank < index + 1 ? "rotate-180" : ""
                    }`} />
                    {Math.abs(competitor.rank - (index + 1))} positions
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Prize Distribution */}
        <Card className="bg-yellow-900/20 border-yellow-500/30">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Prize Distribution</span>
              <Badge className="bg-green-600">
                ${currentChallenge?.prizePool} USDC
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <Trophy className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                <p className="font-semibold">1st: ${(currentChallenge?.prizePool || 0) * 0.5}</p>
              </div>
              <div className="text-center">
                <Medal className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                <p className="font-semibold">2nd: ${(currentChallenge?.prizePool || 0) * 0.3}</p>
              </div>
              <div className="text-center">
                <Medal className="w-5 h-5 mx-auto mb-1 text-orange-600" />
                <p className="font-semibold">3rd: ${(currentChallenge?.prizePool || 0) * 0.2}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => setIsInChallenge(false)}
          >
            Exit Challenge
          </Button>
          <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
            <Sparkles className="w-4 h-4 mr-2" />
            Use Power-Up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
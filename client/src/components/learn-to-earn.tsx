import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, TrendingUp, Award, Zap, Target, Trophy, 
  CheckCircle2, Lock, Gift, Flame, Star, BookOpen, Clock, AlertCircle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { triggerFireworks } from "@/lib/confetti";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RewardTier {
  level: string;
  multiplier: number;
  color: string;
  icon: any;
}

const REWARD_TIERS: RewardTier[] = [
  { level: "Bronze", multiplier: 1, color: "bg-orange-500", icon: Star },
  { level: "Silver", multiplier: 1.5, color: "bg-gray-400", icon: Award },
  { level: "Gold", multiplier: 2, color: "bg-yellow-500", icon: Trophy },
  { level: "Diamond", multiplier: 3, color: "bg-blue-500", icon: Zap },
];

export function LearnToEarn() {
  const [totalEarned, setTotalEarned] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [nextReward, setNextReward] = useState(1);
  const [userTier, setUserTier] = useState(0);

  // Fetch user rewards data - disabled for coming soon
  const { data: rewardsData, isLoading } = useQuery({
    queryKey: ["/api/rewards/summary"],
    refetchInterval: 30000, // Refresh every 30 seconds
    enabled: false, // Disabled until launch
  });

  // Fetch available earn opportunities - disabled for coming soon
  const { data: opportunities } = useQuery({
    queryKey: ["/api/rewards/opportunities"],
    refetchInterval: 60000, // Refresh every minute
    enabled: false, // Disabled until launch
  });

  useEffect(() => {
    if (rewardsData) {
      setTotalEarned(rewardsData.totalEarned || 0);
      setCurrentStreak(rewardsData.streak || 0);
      setNextReward(rewardsData.nextReward || 1);
      setUserTier(Math.min(3, Math.floor(rewardsData.totalEarned / 50)));
    }
  }, [rewardsData]);

  const claimDailyReward = async () => {
    try {
      const response = await apiRequest("POST", "/api/rewards/daily-claim");
      const data = await response.json();
      
      triggerFireworks();
      setTotalEarned(prev => prev + data.amount);
      setCurrentStreak(data.newStreak);
      
      return data;
    } catch (error) {
      console.error("Failed to claim daily reward:", error);
    }
  };

  const currentTier = REWARD_TIERS[userTier];
  const TierIcon = currentTier.icon;
  const progressToNextTier = ((totalEarned % 50) / 50) * 100;

  return (
    <div className="space-y-6">
      {/* Earnings Overview */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-400" />
              Learn to Earn Dashboard
            </span>
            <Badge className="bg-yellow-600 text-white px-3 py-1 animate-pulse">
              <Clock className="w-4 h-4 mr-1" />
              Coming Soon
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Coming Soon Alert */}
          <Alert className="border-yellow-500/50 bg-yellow-900/20">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-yellow-200">
              <strong>Learn-to-Earn Launching Soon!</strong> Get ready to earn real rewards for completing lessons, achieving high scores, and participating in our community. Early adopters will receive exclusive bonuses!
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-60">
            {/* Total Earnings Preview */}
            <Card className="bg-black/50 border-green-500/30">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400 mb-1">Your Future Earnings</p>
                <p className="text-3xl font-bold text-green-400">
                  $0.00
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Complete lessons to earn
                </p>
              </CardContent>
            </Card>

            {/* Current Streak */}
            <Card className="bg-black/50 border-orange-500/30">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  Learning Streak
                </p>
                <p className="text-3xl font-bold text-orange-400">
                  {currentStreak} days
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  +{(currentStreak * 0.1).toFixed(1)} bonus multiplier
                </p>
              </CardContent>
            </Card>

            {/* Next Reward */}
            <Card className="bg-black/50 border-purple-500/30">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400 mb-1">Next Reward</p>
                <p className="text-3xl font-bold text-purple-400">
                  ${nextReward.toFixed(2)}
                </p>
                <Button
                  size="sm"
                  onClick={claimDailyReward}
                  className="mt-2 w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Gift className="w-4 h-4 mr-1" />
                  Claim Daily
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Tier Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Progress to {REWARD_TIERS[Math.min(3, userTier + 1)].level}</span>
              <span className="text-gray-400">{progressToNextTier.toFixed(0)}%</span>
            </div>
            <Progress value={progressToNextTier} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Earning Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Earning Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Complete Lessons */}
          <Card className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-blue-500/30">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-blue-400" />
                <div>
                  <h4 className="font-semibold">Complete Lessons</h4>
                  <p className="text-sm text-gray-400">
                    Earn $0.50 - $5.00 per lesson
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-blue-600 text-white">
                  Active Now
                </Badge>
                <p className="text-2xl font-bold text-blue-400 mt-1">
                  $1.00 <span className="text-sm">avg</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Perfect Quiz Scores */}
          <Card className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-500/30">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
                <div>
                  <h4 className="font-semibold">Perfect Quiz Scores</h4>
                  <p className="text-sm text-gray-400">
                    Get 100% on quizzes for bonus rewards
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-green-600 text-white">
                  2x Bonus
                </Badge>
                <p className="text-2xl font-bold text-green-400 mt-1">
                  $2.00 <span className="text-sm">bonus</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Trading Competitions */}
          <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-purple-400" />
                <div>
                  <h4 className="font-semibold">Trading Competitions</h4>
                  <p className="text-sm text-gray-400">
                    Win up to $500 in weekly competitions
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-purple-600 text-white">
                  Weekly
                </Badge>
                <p className="text-2xl font-bold text-purple-400 mt-1">
                  $500 <span className="text-sm">prize pool</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Referral Program */}
          <Card className="bg-gradient-to-r from-orange-900/20 to-yellow-900/20 border-orange-500/30">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-orange-400" />
                <div>
                  <h4 className="font-semibold">Refer Friends</h4>
                  <p className="text-sm text-gray-400">
                    Earn $5 for each friend who joins
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-orange-600 text-white">
                  Unlimited
                </Badge>
                <p className="text-2xl font-bold text-orange-400 mt-1">
                  $5.00 <span className="text-sm">per referral</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sponsored Content */}
          {opportunities?.sponsored && (
            <Card className="bg-gradient-to-r from-red-900/20 to-pink-900/20 border-red-500/30 ring-2 ring-red-500/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-8 h-8 text-red-400 animate-pulse" />
                  <div>
                    <h4 className="font-semibold">Featured: Learn About {opportunities.sponsored.project}</h4>
                    <p className="text-sm text-gray-400">
                      Complete special course for bonus rewards
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-red-600 text-white animate-pulse">
                    Limited Time
                  </Badge>
                  <p className="text-2xl font-bold text-red-400 mt-1">
                    $10.00 <span className="text-sm">bonus</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Multipliers & Bonuses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Active Multipliers
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
            <TierIcon className="w-6 h-6 mx-auto mb-1 text-purple-400" />
            <p className="text-sm font-semibold">{currentTier.level} Tier</p>
            <p className="text-xs text-gray-400">{currentTier.multiplier}x rewards</p>
          </div>
          <div className="text-center p-3 bg-orange-900/20 rounded-lg border border-orange-500/30">
            <Flame className="w-6 h-6 mx-auto mb-1 text-orange-400" />
            <p className="text-sm font-semibold">{currentStreak} Day Streak</p>
            <p className="text-xs text-gray-400">+{(currentStreak * 0.1).toFixed(1)}x bonus</p>
          </div>
          <div className="text-center p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
            <Star className="w-6 h-6 mx-auto mb-1 text-blue-400" />
            <p className="text-sm font-semibold">Premium Member</p>
            <p className="text-xs text-gray-400">2x on all rewards</p>
          </div>
          <div className="text-center p-3 bg-green-900/20 rounded-lg border border-green-500/30">
            <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-green-400" />
            <p className="text-sm font-semibold">Early Adopter</p>
            <p className="text-xs text-gray-400">+50% lifetime bonus</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
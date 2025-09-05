import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Coins, 
  Flame, 
  Brain, 
  Crown,
  CheckCircle 
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
  rewardUSDC: number;
  category: "learning" | "engagement" | "mastery" | "special";
}

interface AchievementProps {
  achievements: Achievement[];
  userStats: {
    totalLessons: number;
    streak: number;
    usdcEarned: number;
    avgQuizScore: number;
  };
}

export function AchievementSystem({ achievements, userStats }: AchievementProps) {
  const getIcon = (iconName: string) => {
    const icons = {
      trophy: Trophy,
      star: Star,
      zap: Zap,
      target: Target,
      coins: Coins,
      fire: Flame,
      brain: Brain,
      crown: Crown
    };
    const IconComponent = icons[iconName as keyof typeof icons] || Trophy;
    return <IconComponent className="w-6 h-6" />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "learning": return "from-blue-500 to-cyan-500";
      case "engagement": return "from-green-500 to-emerald-500";
      case "mastery": return "from-purple-500 to-violet-500";
      case "special": return "from-yellow-500 to-orange-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* User Stats Overview */}
      <Card className="bg-gradient-to-br from-slate-900 to-blue-900 border-slate-700">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            Your Learning Journey
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{userStats.totalLessons}</div>
              <div className="text-sm text-gray-400">Lessons Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 flex items-center justify-center gap-1">
                {userStats.streak}
                <Flame className="w-6 h-6" />
              </div>
              <div className="text-sm text-gray-400">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 flex items-center justify-center gap-1">
                {userStats.usdcEarned}
                <Coins className="w-6 h-6" />
              </div>
              <div className="text-sm text-gray-400">USDC Earned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{userStats.avgQuizScore}%</div>
              <div className="text-sm text-gray-400">Avg Quiz Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Categories */}
      {["learning", "engagement", "mastery", "special"].map((category) => {
        const categoryAchievements = achievements.filter(a => a.category === category);
        if (categoryAchievements.length === 0) return null;

        return (
          <div key={category} className="space-y-3">
            <h3 className="text-xl font-semibold text-white capitalize flex items-center gap-2">
              {category === "learning" && <Brain className="w-5 h-5 text-blue-400" />}
              {category === "engagement" && <Flame className="w-5 h-5 text-green-400" />}
              {category === "mastery" && <Star className="w-5 h-5 text-purple-400" />}
              {category === "special" && <Crown className="w-5 h-5 text-yellow-400" />}
              {category} Achievements
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryAchievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 ${
                    achievement.completed ? 'ring-2 ring-green-500/30' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(achievement.category)}`}>
                        {getIcon(achievement.icon)}
                      </div>
                      {achievement.completed && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                    
                    <h4 className="font-semibold text-white mb-1">{achievement.title}</h4>
                    <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100} 
                        className="h-1.5" 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <Badge 
                        variant="outline" 
                        className={achievement.completed ? "bg-green-900/20 border-green-500/30 text-green-300" : ""}
                      >
                        {achievement.completed ? "Completed" : "In Progress"}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-yellow-400">
                        <Coins className="w-3 h-3" />
                        {achievement.rewardUSDC}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
import { useState, useEffect } from "react";
import { BookOpen, Award, Clock, CheckCircle, Lock, Star, Trophy, Target, Zap, Brain, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface LessonCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  totalLessons: number;
  completedLessons: number;
  estimatedTime: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Expert";
  category: string;
  duration: number;
  xpReward: number;
  badgeReward?: string;
  isLocked: boolean;
  hasQuiz: boolean;
  hasSimulation: boolean;
  prerequisites: string[];
  learningObjectives: string[];
  completed?: boolean;
  progress?: number;
}

interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  earnedAt: string;
}

const lessonCategories: LessonCategory[] = [
  {
    id: "fundamentals",
    name: "Crypto Fundamentals",
    description: "Master the basics of blockchain and cryptocurrency",
    icon: BookOpen,
    totalLessons: 12,
    completedLessons: 8,
    estimatedTime: 180
  },
  {
    id: "technical-analysis", 
    name: "Technical Analysis",
    description: "Learn to read charts and predict market movements",
    icon: TrendingUp,
    totalLessons: 15,
    completedLessons: 5,
    estimatedTime: 225
  },
  {
    id: "defi",
    name: "DeFi & Protocols",
    description: "Explore decentralized finance and yield farming",
    icon: Target,
    totalLessons: 10,
    completedLessons: 2,
    estimatedTime: 150
  },
  {
    id: "nfts",
    name: "NFTs & Collectibles",
    description: "Understand digital ownership and NFT markets",
    icon: Star,
    totalLessons: 8,
    completedLessons: 6,
    estimatedTime: 120
  },
  {
    id: "psychology",
    name: "Trading Psychology",
    description: "Master your emotions and develop discipline",
    icon: Brain,
    totalLessons: 6,
    completedLessons: 1,
    estimatedTime: 90
  }
];

const comprehensiveLessons: Lesson[] = [
  // Beginner - Fundamentals
  {
    id: "1",
    title: "What is Blockchain?",
    description: "Understanding the foundation of cryptocurrency technology",
    level: "Beginner",
    category: "fundamentals",
    duration: 15,
    xpReward: 100,
    badgeReward: "blockchain-basics",
    isLocked: false,
    hasQuiz: true,
    hasSimulation: false,
    prerequisites: [],
    learningObjectives: ["Understand distributed ledger technology", "Learn about decentralization", "Grasp immutability concepts"],
    completed: true,
    progress: 100
  },
  {
    id: "2", 
    title: "Bitcoin Fundamentals",
    description: "Deep dive into the first cryptocurrency",
    level: "Beginner",
    category: "fundamentals", 
    duration: 20,
    xpReward: 120,
    isLocked: false,
    hasQuiz: true,
    hasSimulation: true,
    prerequisites: ["1"],
    learningObjectives: ["Learn Bitcoin history", "Understand mining", "Study monetary policy"],
    completed: true,
    progress: 100
  },
  {
    id: "3",
    title: "Ethereum & Smart Contracts",
    description: "Explore programmable blockchain technology",
    level: "Beginner",
    category: "fundamentals",
    duration: 25,
    xpReward: 150,
    isLocked: false,
    hasQuiz: true,
    hasSimulation: true,
    prerequisites: ["1", "2"],
    learningObjectives: ["Understand smart contracts", "Learn about gas fees", "Explore dApps"],
    completed: false,
    progress: 60
  },
  {
    id: "4",
    title: "Wallet Security Best Practices",
    description: "Keep your crypto assets safe and secure",
    level: "Beginner",
    category: "fundamentals",
    duration: 18,
    xpReward: 130,
    badgeReward: "security-guardian",
    isLocked: false,
    hasQuiz: true,
    hasSimulation: false,
    prerequisites: ["2"],
    learningObjectives: ["Master private key management", "Learn about hardware wallets", "Understand seed phrases"],
    completed: false,
    progress: 0
  },

  // Intermediate - Technical Analysis
  {
    id: "5",
    title: "Reading Candlestick Charts",
    description: "Decode market psychology through price action",
    level: "Intermediate",
    category: "technical-analysis",
    duration: 22,
    xpReward: 180,
    isLocked: false,
    hasQuiz: true,
    hasSimulation: true,
    prerequisites: ["3"],
    learningObjectives: ["Identify candlestick patterns", "Understand market sentiment", "Apply pattern recognition"],
    completed: false,
    progress: 0
  },
  {
    id: "6",
    title: "Support & Resistance Levels",
    description: "Find key price levels that matter",
    level: "Intermediate", 
    category: "technical-analysis",
    duration: 20,
    xpReward: 170,
    isLocked: false,
    hasQuiz: true,
    hasSimulation: true,
    prerequisites: ["5"],
    learningObjectives: ["Draw support/resistance lines", "Identify breakouts", "Set stop losses"],
    completed: false,
    progress: 0
  },
  {
    id: "7",
    title: "Moving Averages & Trends",
    description: "Use moving averages to identify market direction",
    level: "Intermediate",
    category: "technical-analysis", 
    duration: 25,
    xpReward: 200,
    badgeReward: "trend-master",
    isLocked: true,
    hasQuiz: true,
    hasSimulation: true,
    prerequisites: ["5", "6"],
    learningObjectives: ["Calculate moving averages", "Identify trend direction", "Use crossover strategies"],
    completed: false,
    progress: 0
  },

  // Expert - Advanced Trading
  {
    id: "8",
    title: "Options Trading Strategies",
    description: "Advanced derivatives trading techniques",
    level: "Expert",
    category: "technical-analysis",
    duration: 35,
    xpReward: 300,
    badgeReward: "options-expert",
    isLocked: true,
    hasQuiz: true,
    hasSimulation: true,
    prerequisites: ["7"],
    learningObjectives: ["Master options Greeks", "Build complex strategies", "Manage risk effectively"],
    completed: false,
    progress: 0
  },

  // DeFi Lessons
  {
    id: "9",
    title: "Liquidity Pools & AMMs",
    description: "Understanding automated market makers",
    level: "Intermediate",
    category: "defi",
    duration: 30,
    xpReward: 220,
    isLocked: true,
    hasQuiz: true,
    hasSimulation: true,
    prerequisites: ["3"],
    learningObjectives: ["Understand liquidity provision", "Learn about impermanent loss", "Use decentralized exchanges"],
    completed: false,
    progress: 0
  },

  // NFT Lessons
  {
    id: "10",
    title: "NFT Rarity Analysis",
    description: "Evaluate digital collectible value",
    level: "Intermediate",
    category: "nfts",
    duration: 25,
    xpReward: 190,
    badgeReward: "nft-expert",
    isLocked: true,
    hasQuiz: true,
    hasSimulation: true,
    prerequisites: ["3"],
    learningObjectives: ["Analyze rarity traits", "Value NFT collections", "Identify investment opportunities"],
    completed: false,
    progress: 0
  }
];

const userBadges: UserBadge[] = [
  {
    id: "1",
    name: "First Steps",
    description: "Complete your first lesson",
    icon: "👶",
    category: "Learning",
    rarity: "Common",
    earnedAt: "2024-01-15"
  },
  {
    id: "2", 
    name: "Blockchain Explorer",
    description: "Master blockchain fundamentals",
    icon: "🔗",
    category: "Learning",
    rarity: "Rare",
    earnedAt: "2024-01-18"
  },
  {
    id: "3",
    name: "Security Guardian", 
    description: "Complete wallet security course",
    icon: "🛡️",
    category: "Achievement",
    rarity: "Epic",
    earnedAt: "2024-01-20"
  }
];

export default function LessonSystem() {
  const [selectedLevel, setSelectedLevel] = useState<"all" | "Beginner" | "Intermediate" | "Expert">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  const { data: lessons } = useQuery({
    queryKey: ['/api/lessons']
  });

  const { data: userProgress } = useQuery({
    queryKey: ['/api/progress/demo-user']
  });

  const startLesson = (lesson: Lesson) => {
    if (lesson.isLocked) {
      toast({
        title: "Lesson Locked",
        description: "Complete prerequisite lessons to unlock this content.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Lesson Started!",
      description: `Starting "${lesson.title}" - ${lesson.duration} minutes`,
    });
  };

  const filteredLessons = comprehensiveLessons.filter(lesson => {
    const levelMatch = selectedLevel === "all" || lesson.level === selectedLevel;
    const categoryMatch = selectedCategory === "all" || lesson.category === selectedCategory;
    return levelMatch && categoryMatch;
  });

  const getUserXP = () => {
    return comprehensiveLessons
      .filter(l => l.completed)
      .reduce((total, lesson) => total + lesson.xpReward, 0);
  };

  const getUserLevel = () => {
    const xp = getUserXP();
    return Math.floor(xp / 500) + 1;
  };

  const getXPForNextLevel = () => {
    const currentLevel = getUserLevel();
    return currentLevel * 500;
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";  
      case "Expert": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common": return "border-gray-300 bg-gray-50";
      case "Rare": return "border-blue-300 bg-blue-50";
      case "Epic": return "border-purple-300 bg-purple-50";
      case "Legendary": return "border-yellow-300 bg-yellow-50";
      default: return "border-gray-300 bg-gray-50";
    }
  };

  return (
    <div className="space-y-8">
      {/* User Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="font-semibold">Level {getUserLevel()}</span>
              </div>
              <span className="text-sm text-slate-600">{getUserXP()} XP</span>
            </div>
            <Progress value={(getUserXP() % 500) / 5} className="mb-2" />
            <div className="text-xs text-slate-500">
              {getXPForNextLevel() - getUserXP()} XP to next level
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Trophy className="h-5 w-5 text-primary mr-2" />
                <span className="font-semibold">Badges</span>
              </div>
              <span className="text-2xl font-bold">{userBadges.length}</span>
            </div>
            <div className="text-sm text-slate-600">Achievements unlocked</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="font-semibold">Completed</span>
              </div>
              <span className="text-2xl font-bold">
                {comprehensiveLessons.filter(l => l.completed).length}
              </span>
            </div>
            <div className="text-sm text-slate-600">
              of {comprehensiveLessons.length} lessons
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-500 mr-2" />
                <span className="font-semibold">Time Spent</span>
              </div>
              <span className="text-2xl font-bold">
                {comprehensiveLessons
                  .filter(l => l.completed)
                  .reduce((total, lesson) => total + lesson.duration, 0)}m
              </span>
            </div>
            <div className="text-sm text-slate-600">Learning time</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="lessons" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex gap-2">
              <Button
                variant={selectedLevel === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLevel("all")}
              >
                All Levels
              </Button>
              <Button
                variant={selectedLevel === "Beginner" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedLevel("Beginner")}
              >
                Beginner
              </Button>
              <Button
                variant={selectedLevel === "Intermediate" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLevel("Intermediate")}
              >
                Intermediate
              </Button>
              <Button
                variant={selectedLevel === "Expert" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLevel("Expert")}
              >
                Expert
              </Button>
            </div>
          </div>

          {/* Lessons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => (
              <Card key={lesson.id} className={`relative ${lesson.isLocked ? 'opacity-60' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={getLevelBadgeColor(lesson.level)}>
                      {lesson.level}
                    </Badge>
                    {lesson.isLocked && <Lock className="h-4 w-4 text-slate-400" />}
                    {lesson.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>
                  <CardTitle className="text-lg">{lesson.title}</CardTitle>
                  <CardDescription>{lesson.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-slate-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {lesson.duration}min
                      </div>
                      <div className="flex items-center text-primary">
                        <Zap className="h-4 w-4 mr-1" />
                        +{lesson.xpReward} XP
                      </div>
                    </div>

                    {lesson.progress !== undefined && lesson.progress > 0 && (
                      <div>
                        <Progress value={lesson.progress} className="mb-1" />
                        <div className="text-xs text-slate-500">{lesson.progress}% complete</div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {lesson.hasQuiz && (
                        <Badge variant="outline" className="text-xs">
                          📝 Quiz
                        </Badge>
                      )}
                      {lesson.hasSimulation && (
                        <Badge variant="outline" className="text-xs">
                          🎯 Simulation
                        </Badge>
                      )}
                      {lesson.badgeReward && (
                        <Badge variant="outline" className="text-xs">
                          🏆 Badge
                        </Badge>
                      )}
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={() => startLesson(lesson)}
                      disabled={lesson.isLocked}
                    >
                      {lesson.completed ? "Review" : lesson.progress ? "Continue" : "Start Lesson"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessonCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <Icon className="h-6 w-6 text-primary mr-3" />
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </div>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{category.completedLessons}/{category.totalLessons}</span>
                      </div>
                      
                      <Progress 
                        value={(category.completedLessons / category.totalLessons) * 100} 
                      />
                      
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>{category.estimatedTime}min total</span>
                        <span>
                          {Math.round((category.completedLessons / category.totalLessons) * 100)}% complete
                        </span>
                      </div>

                      <Button 
                        className="w-full"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        View Lessons
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="badges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {userBadges.map((badge) => (
              <Card key={badge.id} className={`${getRarityColor(badge.rarity)} border-2`}>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <h3 className="font-semibold text-sm mb-1">{badge.name}</h3>
                  <p className="text-xs text-slate-600 mb-2">{badge.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {badge.rarity}
                  </Badge>
                  <div className="text-xs text-slate-500 mt-2">
                    Earned {new Date(badge.earnedAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
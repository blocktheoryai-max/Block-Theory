import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Brain, Sparkles, Target, BookOpen, Trophy, 
  Zap, TrendingUp, Shield, Coins, Code, 
  ChevronRight, Lock, CheckCircle2, Clock
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  icon: any;
  estimatedHours: number;
  difficulty: "beginner" | "intermediate" | "advanced";
}

const LEARNING_GOALS: LearningGoal[] = [
  {
    id: "trader",
    title: "Become a Profitable Trader",
    description: "Master technical analysis, risk management, and trading psychology",
    icon: TrendingUp,
    estimatedHours: 80,
    difficulty: "intermediate"
  },
  {
    id: "defi",
    title: "Master DeFi Protocols",
    description: "Understand yield farming, liquidity pools, and decentralized finance",
    icon: Coins,
    estimatedHours: 60,
    difficulty: "advanced"
  },
  {
    id: "nfts",
    title: "NFT Trading Expert",
    description: "Learn to identify, trade, and profit from NFT collections",
    icon: Trophy,
    estimatedHours: 40,
    difficulty: "beginner"
  },
  {
    id: "developer",
    title: "Blockchain Developer",
    description: "Build smart contracts and decentralized applications",
    icon: Code,
    estimatedHours: 120,
    difficulty: "advanced"
  },
  {
    id: "investor",
    title: "Long-term Investor",
    description: "Build and manage a crypto portfolio for long-term growth",
    icon: Shield,
    estimatedHours: 50,
    difficulty: "beginner"
  }
];

export function AiLearningPath() {
  const [selectedGoal, setSelectedGoal] = useState<string>("");
  const [currentPath, setCurrentPath] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Fetch existing learning path
  const { data: userPath, isLoading } = useQuery({
    queryKey: ["/api/learning-path"],
    refetchInterval: 60000
  });

  // Generate AI learning path
  const generatePath = useMutation({
    mutationFn: async (goalId: string) => {
      setIsGenerating(true);
      const goal = LEARNING_GOALS.find(g => g.id === goalId);
      
      const response = await apiRequest("POST", "/api/learning-path/generate", {
        goal: goalId,
        goalTitle: goal?.title,
        difficulty: goal?.difficulty,
        estimatedHours: goal?.estimatedHours
      });
      
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentPath(data);
      setIsGenerating(false);
      queryClient.invalidateQueries({ queryKey: ["/api/learning-path"] });
      toast({
        title: "AI Learning Path Created!",
        description: "Your personalized curriculum is ready"
      });
    },
    onError: () => {
      setIsGenerating(false);
      toast({
        title: "Generation Failed",
        description: "Unable to create learning path. Please try again.",
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    if (userPath) {
      setCurrentPath(userPath);
    }
  }, [userPath]);

  const startLearning = () => {
    if (!selectedGoal) return;
    generatePath.mutate(selectedGoal);
  };

  const calculateProgress = () => {
    if (!currentPath?.lessons || !currentPath?.completedLessons) return 0;
    return (currentPath.completedLessons.length / currentPath.lessons.length) * 100;
  };

  if (isLoading) {
    return <div>Loading your learning path...</div>;
  }

  // Show goal selection if no path exists
  if (!currentPath) {
    return (
      <Card className="border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" />
            AI-Powered Learning Path
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-lg">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-400" />
            <h3 className="text-xl font-semibold mb-2">
              Let AI Create Your Perfect Learning Path
            </h3>
            <p className="text-gray-400">
              Tell us your goal, and our AI will design a personalized curriculum
              optimized for your success
            </p>
          </div>

          <div>
            <Label className="text-lg mb-4 block">What's your crypto learning goal?</Label>
            <RadioGroup value={selectedGoal} onValueChange={setSelectedGoal}>
              <div className="grid gap-4">
                {LEARNING_GOALS.map((goal) => {
                  const Icon = goal.icon;
                  return (
                    <Card 
                      key={goal.id}
                      className={`cursor-pointer transition-all ${
                        selectedGoal === goal.id 
                          ? 'border-purple-500 bg-purple-900/20' 
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                      onClick={() => setSelectedGoal(goal.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <RadioGroupItem value={goal.id} className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className="w-5 h-5 text-purple-400" />
                              <h4 className="font-semibold">{goal.title}</h4>
                            </div>
                            <p className="text-sm text-gray-400 mb-2">
                              {goal.description}
                            </p>
                            <div className="flex gap-2">
                              <Badge variant="secondary">
                                <Clock className="w-3 h-3 mr-1" />
                                {goal.estimatedHours} hours
                              </Badge>
                              <Badge 
                                variant={
                                  goal.difficulty === 'beginner' ? 'default' :
                                  goal.difficulty === 'intermediate' ? 'secondary' :
                                  'destructive'
                                }
                              >
                                {goal.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </RadioGroup>
          </div>

          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            size="lg"
            onClick={startLearning}
            disabled={!selectedGoal || isGenerating}
          >
            {isGenerating ? (
              <>
                <Brain className="w-5 h-5 mr-2 animate-pulse" />
                AI is Creating Your Path...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate My AI Learning Path
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show active learning path
  const progress = calculateProgress();

  return (
    <Card className="border-purple-500/30">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" />
            Your AI Learning Path
          </CardTitle>
          <Button variant="outline" size="sm">
            <Zap className="w-4 h-4 mr-1" />
            Regenerate
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Path Overview */}
        <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">{currentPath.title}</h3>
                <p className="text-sm text-gray-400">{currentPath.description}</p>
              </div>
              <Target className="w-8 h-8 text-purple-400" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              
              <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-400">
                    {currentPath.completedLessons?.length || 0}
                  </p>
                  <p className="text-xs text-gray-400">Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-400">
                    {currentPath.lessons?.length || 0}
                  </p>
                  <p className="text-xs text-gray-400">Total Lessons</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-400">
                    {currentPath.estimatedHours || 0}h
                  </p>
                  <p className="text-xs text-gray-400">Est. Time</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="bg-black/50 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <h4 className="font-semibold">AI Recommendations</h4>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-yellow-400 mt-0.5" />
                <span>Focus on technical analysis basics before advanced patterns</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-yellow-400 mt-0.5" />
                <span>Practice with paper trading for at least 30 days</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-yellow-400 mt-0.5" />
                <span>Join weekly competitions to test your skills</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Lesson List */}
        <div>
          <h4 className="font-semibold mb-3">Your Personalized Curriculum</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {(currentPath.lessons || []).map((lessonId: string, index: number) => {
              const isCompleted = currentPath.completedLessons?.includes(lessonId);
              const isLocked = index > 0 && !currentPath.completedLessons?.includes(currentPath.lessons[index - 1]);
              
              return (
                <Card 
                  key={lessonId}
                  className={`${
                    isCompleted 
                      ? 'bg-green-900/20 border-green-500/30' 
                      : isLocked
                      ? 'bg-gray-900/50 border-gray-700 opacity-50'
                      : 'bg-black/30 border-gray-700'
                  }`}
                >
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-600/20 text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">
                          Lesson {index + 1}: {lessonId.replace(/-/g, ' ')}
                        </p>
                        <p className="text-xs text-gray-400">
                          Estimated: 45 minutes
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isCompleted && (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      )}
                      {isLocked && (
                        <Lock className="w-5 h-5 text-gray-500" />
                      )}
                      {!isCompleted && !isLocked && (
                        <Button size="sm">
                          <BookOpen className="w-4 h-4 mr-1" />
                          Start
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
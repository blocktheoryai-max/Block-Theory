import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Lock, 
  Clock, 
  Star,
  TrendingUp,
  Shield,
  Coins,
  Target,
  ArrowLeft,
  Trophy,
  Brain,
  Zap,
  Rocket,
  GraduationCap,
  Activity,
  Video,
  Users,
  Crown
} from "lucide-react";
import { VideoLessonCard } from "@/components/VideoLessonCard";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import MobileBottomNav from "@/components/MobileBottomNav";
import { SEOHead, SEO_PRESETS } from "@/components/SEOHead";
import { AiLearningPath } from "@/components/ai-learning-path";
import { SimpleLessonViewer } from "@/components/SimpleLessonViewer";

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  level: string;
  category: string;
  duration: number;
  format: string;
  order: number;
  requiredTier: string;
  prerequisites: string[];
  learningObjectives: string[];
  tags: string[];
  isLocked: boolean;
  isPremium: boolean;
  hasQuiz: boolean;
  hasSimulation: boolean;
  videoUrl?: string;
}

interface UserProgress {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  score?: number;
  completedAt?: string;
}

export default function Learn() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  // Educational disclaimer component
  const EducationalDisclaimer = () => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p className="text-red-700 text-sm font-medium">
        ⚠️ <strong>Educational Content Only:</strong> All lessons are for educational purposes and should not be considered as financial, investment, or trading advice. 
        Cryptocurrency trading involves substantial risk of loss. Always do your own research and consult with qualified financial professionals.
      </p>
    </div>
  );

  // Get user ID or use demo user
  const getCurrentUserId = () => {
    return (user as any)?.id || "demo-user-id";
  };

  // Fetch lessons
  const { data: lessons = [], isLoading: lessonsLoading } = useQuery<Lesson[]>({
    queryKey: ["/api/lessons"],
  });

  // Fetch user progress
  const { data: progress = [], isLoading: progressLoading } = useQuery<UserProgress[]>({
    queryKey: ["/api/progress", getCurrentUserId()],
  });

  // Mark lesson as complete
  const markComplete = useMutation({
    mutationFn: async (lessonId: string) => {
      return apiRequest("POST", "/api/progress", {
        userId: getCurrentUserId(),
        lessonId,
        completed: true,
        score: 100
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      toast({ title: "Lesson completed! 🎉" });
    },
    onError: (error) => {
      toast({
        title: "Failed to mark lesson complete",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const completedLessons = (progress || []).filter(p => p.completed);
  const totalLessons = (lessons || []).length;
  const completionPercentage = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0;

  const filteredLessons = (lessons || []).filter(lesson => {
    const categoryMatch = selectedCategory === "all" || lesson.category === selectedCategory;
    const levelMatch = selectedLevel === "all" || lesson.level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  const categories = ["all", "basics", "technical-analysis", "defi", "nft", "trading", "security"];
  const levels = ["all", "beginner", "intermediate", "advanced"];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "basics": return <BookOpen className="w-5 h-5" />;
      case "technical-analysis": return <TrendingUp className="w-5 h-5" />;
      case "defi": return <Coins className="w-5 h-5" />;
      case "nft": return <Star className="w-5 h-5" />;
      case "trading": return <Target className="w-5 h-5" />;
      case "security": return <Shield className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-green-900/50 text-green-400";
      case "intermediate": return "bg-yellow-900/50 text-yellow-400";
      case "advanced": return "bg-red-900/50 text-red-400";
      default: return "bg-gray-900/50 text-gray-400";
    }
  };

  if (selectedLesson) {
    return (
      <>
        <SEOHead {...SEO_PRESETS.learn} canonical="/learn" />
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
          <div className="container mx-auto px-4 py-8">
            <Button 
              onClick={() => setSelectedLesson(null)}
              variant="ghost" 
              className="mb-6 text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Lessons
            </Button>

            <SimpleLessonViewer 
              lessonId={selectedLesson.id}
              lessonTitle={selectedLesson.title}
              category={selectedLesson.category}
              difficulty={selectedLesson.level}
              onClose={() => setSelectedLesson(null)}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead {...SEO_PRESETS.learn} canonical="/learn" />
      <div className="hidden md:block">
        <Navigation />
      </div>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header with animated elements */}
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Crypto Education Hub
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Master cryptocurrency trading with interactive lessons and real-world simulations
            </p>
            
            {/* Progress Overview */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm max-w-2xl mx-auto">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Your Progress</h3>
                      <p className="text-sm text-gray-400">{completedLessons.length} of {totalLessons} lessons completed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{Math.round(completionPercentage)}%</div>
                    <div className="text-xs text-gray-400">Complete</div>
                  </div>
                </div>
                <Progress value={completionPercentage} className="h-3 bg-slate-700" />
              </CardContent>
            </Card>
          </div>

          {/* AI Learning Path Section */}
          <div className="mb-8">
            <AiLearningPath />
          </div>

          {/* Category Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {(categories || []).slice(1).map((category) => {
              const categoryLessons = lessons.filter(l => l.category === category);
              const categoryProgress = progress.filter(p => 
                p.completed && lessons.find(l => l.id === p.lessonId)?.category === category
              );
              const percentage = categoryLessons.length > 0 ? (categoryProgress.length / categoryLessons.length) * 100 : 0;
              
              return (
                <Card key={category} className="bg-slate-800/30 border-slate-700 hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="flex justify-center mb-2 text-blue-400">
                      {getCategoryIcon(category)}
                    </div>
                    <div className="text-sm font-medium text-white capitalize">{category.replace('-', ' ')}</div>
                    <div className="text-xs text-gray-400">{Math.round(percentage)}% complete</div>
                    <div className="w-full bg-slate-700 rounded-full h-1 mt-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Filters */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 bg-slate-800/50 border-slate-700">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="data-[state=active]:bg-blue-600 capitalize"
                >
                  {category === "all" ? "All" : category.replace('-', ' ')}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Level Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {levels.map((level) => (
              <Button
                key={level}
                variant={selectedLevel === level ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLevel(level)}
                className={selectedLevel === level ? "bg-blue-600" : "border-slate-600 text-gray-300"}
              >
                {level === "all" ? "All Levels" : (level || "").charAt(0).toUpperCase() + (level || "").slice(1)}
              </Button>
            ))}
          </div>

          {/* Lessons Grid */}
          {lessonsLoading || progressLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="bg-slate-800/50 border-slate-700 animate-pulse">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="w-full h-6 bg-slate-700 rounded"></div>
                      <div className="w-3/4 h-4 bg-slate-700 rounded"></div>
                      <div className="flex space-x-2">
                        <div className="w-16 h-6 bg-slate-700 rounded"></div>
                        <div className="w-12 h-6 bg-slate-700 rounded"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLessons.map((lesson: Lesson) => {
                const isCompleted = progress.some((p: UserProgress) => p.lessonId === lesson.id && p.completed);
                
                return (
                  <Card 
                    key={lesson.id} 
                    className={`bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 cursor-pointer group ${
                      isCompleted ? 'ring-2 ring-green-500/50' : ''
                    }`}
                    onClick={() => setSelectedLesson(lesson)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(lesson.category)}
                          <div className="text-blue-400">{lesson.category.replace('-', ' ')}</div>
                        </div>
                        {isCompleted && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                      </div>
                      <CardTitle className="text-white group-hover:text-blue-400 transition-colors">
                        {lesson.title}
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        {lesson.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {lesson.duration} min
                          </div>
                          <div className="flex items-center">
                            <Play className="w-4 h-4 mr-1" />
                            {lesson.format}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge className={getLevelColor(lesson.level)}>
                          {lesson.level}
                        </Badge>
                        
                        <div className="flex items-center space-x-1">
                          {(lesson.tags || []).slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {lesson.isPremium && (
                        <div className="mt-3 flex items-center text-yellow-400 text-sm">
                          <Crown className="w-4 h-4 mr-1" />
                          Premium Content
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {filteredLessons.length === 0 && !lessonsLoading && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No lessons found</h3>
              <p className="text-gray-400">Try adjusting your filters to see more content</p>
            </div>
          )}
        </div>
      </div>
      <MobileBottomNav />
    </>
  );
}
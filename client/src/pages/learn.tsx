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
  ArrowLeft
} from "lucide-react";
import { useAuth, useSubscriptionStatus } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";

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
  const { subscription, tier, status } = useSubscriptionStatus();

  // Get user ID or use demo user
  const getCurrentUserId = () => {
    return (user as any)?.id || "demo-user-id";
  };

  // Fetch lessons
  const { data: lessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ["/api/lessons"],
  });

  // Fetch user progress
  const { data: progress = [], isLoading: progressLoading } = useQuery({
    queryKey: ["/api/progress", getCurrentUserId()],
  });

  const filteredLessons = (lessons as Lesson[]).filter((lesson: Lesson) => {
    const matchesCategory = selectedCategory === "all" || lesson.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || lesson.level === selectedLevel;
    return matchesCategory && matchesLevel;
  });

  const completedLessonIds = (progress as UserProgress[]).filter(p => p.completed).map(p => p.lessonId);

  // Mark lesson as complete
  const markCompleteMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      await apiRequest("POST", "/api/progress", {
        userId: getCurrentUserId(),
        lessonId,
        completed: true,
        score: 100,
        completedAt: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      toast({
        title: "Lesson Complete!",
        description: "Great job! You've completed this lesson.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to mark lesson as complete. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Helper functions
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Fundamentals": return BookOpen;
      case "Technical Analysis": return TrendingUp;
      case "Trading": return Target;
      case "Security": return Shield;
      case "DeFi": return Coins;
      case "Research": return Target;
      default: return BookOpen;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const canAccessLesson = (lesson: Lesson) => {
    if (!lesson.isPremium) return true;
    if (!isAuthenticated) return false;
    
    const tierOrder = { free: 0, basic: 1, pro: 2, elite: 3 };
    const userTier = tier || "free";
    const requiredTier = lesson.requiredTier || "free";
    
    return tierOrder[userTier as keyof typeof tierOrder] >= tierOrder[requiredTier as keyof typeof tierOrder];
  };

  const categories = [
    { value: "all", label: "All", icon: BookOpen },
    { value: "Fundamentals", label: "Fundamentals", icon: BookOpen },
    { value: "Technical Analysis", label: "Technical Analysis", icon: TrendingUp },
    { value: "Security", label: "Security", icon: Shield },
    { value: "DeFi", label: "DeFi", icon: Coins },
    { value: "Trading", label: "Trading", icon: Target },
    { value: "Research", label: "Research", icon: Target }
  ];

  const levels = [
    { value: "all", label: "All Levels" },
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" }
  ];

  // Loading state
  if (lessonsLoading || progressLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Loading lessons...</h3>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Lesson detail view
  if (selectedLesson) {
    const isCompleted = completedLessonIds.includes(selectedLesson.id);
    const hasAccess = canAccessLesson(selectedLesson);

    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedLesson(null)}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Lessons
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Lesson Content */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {(() => {
                          const IconComponent = getCategoryIcon(selectedLesson.category);
                          return <IconComponent className="h-6 w-6 text-blue-600" />;
                        })()}
                        <CardTitle className="text-2xl">{selectedLesson.title}</CardTitle>
                      </div>
                      {isCompleted && (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      )}
                    </div>
                    <CardDescription className="text-lg">
                      {selectedLesson.description}
                    </CardDescription>
                    <div className="flex items-center space-x-4 mt-4">
                      <Badge className={getLevelColor(selectedLesson.level)}>
                        {selectedLesson.level}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        {selectedLesson.duration} min
                      </div>
                      {selectedLesson.isPremium && (
                        <Badge variant="secondary">Premium</Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {!hasAccess ? (
                      <div className="text-center py-12">
                        <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Premium Content</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          This lesson requires a {selectedLesson.requiredTier} subscription or higher.
                        </p>
                        <Link href="/pricing">
                          <Button>Upgrade Now</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Video Player Placeholder */}
                        <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                          <div className="text-center text-white">
                            <Play className="h-16 w-16 mx-auto mb-4" />
                            <p className="text-lg">Lesson Video</p>
                            <p className="text-sm text-gray-300">Duration: {selectedLesson.duration} minutes</p>
                          </div>
                        </div>

                        {/* Lesson Content */}
                        <div className="prose dark:prose-invert max-w-none">
                          <div dangerouslySetInnerHTML={{ __html: selectedLesson.content }} />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center pt-6 border-t">
                          <Button variant="outline" onClick={() => setSelectedLesson(null)}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Lessons
                          </Button>
                          {!isCompleted && (
                            <Button 
                              onClick={() => markCompleteMutation.mutate(selectedLesson.id)}
                              disabled={markCompleteMutation.isPending}
                            >
                              {markCompleteMutation.isPending ? "Completing..." : "Mark as Complete"}
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Progress Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Overall Progress</span>
                          <span>{Math.round((completedLessonIds.length / (lessons as Lesson[]).length) * 100)}%</span>
                        </div>
                        <Progress value={(completedLessonIds.length / (lessons as Lesson[]).length) * 100} />
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-green-600">{completedLessonIds.length}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{(lessons as Lesson[]).length - completedLessonIds.length}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Remaining</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Learning Objectives */}
                {selectedLesson.learningObjectives && selectedLesson.learningObjectives.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Learning Objectives</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedLesson.learningObjectives.map((objective, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Main lessons list view
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Learn Crypto Trading</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Master cryptocurrency trading with our comprehensive lessons and interactive content.
            </p>
          </div>

          {/* Progress Overview */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{(lessons as Lesson[]).length}</div>
                  <div className="text-gray-600 dark:text-gray-400">Total Lessons</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{completedLessonIds.length}</div>
                  <div className="text-gray-600 dark:text-gray-400">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{(lessons as Lesson[]).length - completedLessonIds.length}</div>
                  <div className="text-gray-600 dark:text-gray-400">Remaining</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{Math.round((completedLessonIds.length / (lessons as Lesson[]).length) * 100)}%</div>
                  <div className="text-gray-600 dark:text-gray-400">Progress</div>
                </div>
              </div>
              <div className="mt-6">
                <Progress value={(completedLessonIds.length / (lessons as Lesson[]).length) * 100} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
            <TabsList className="grid w-full grid-cols-6">
              {categories.map((category) => {
                const CategoryIcon = category.icon;
                return (
                  <TabsTrigger key={category.value} value={category.value} className="flex items-center space-x-1">
                    <CategoryIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">{category.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>

          {/* Level Filter */}
          <div className="mb-6">
            <div className="flex space-x-2">
              {levels.map((level) => (
                <Button
                  key={level.value}
                  variant={selectedLevel === level.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLevel(level.value)}
                >
                  {level.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Lessons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson: Lesson) => {
              const isCompleted = completedLessonIds.includes(lesson.id);
              const hasAccess = canAccessLesson(lesson);
              const CategoryIcon = getCategoryIcon(lesson.category);

              return (
                <Card 
                  key={lesson.id} 
                  className={`cursor-pointer transition-shadow hover:shadow-lg ${
                    isCompleted ? 'ring-2 ring-green-500' : ''
                  }`}
                  onClick={() => setSelectedLesson(lesson)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <CategoryIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg leading-tight">{lesson.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className={getLevelColor(lesson.level)} variant="secondary">
                              {lesson.level}
                            </Badge>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <Clock className="h-3 w-3 mr-1" />
                              {lesson.duration}m
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center space-y-1">
                        {isCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {!hasAccess && <Lock className="h-5 w-5 text-gray-400" />}
                        {lesson.isPremium && <Badge variant="secondary" className="text-xs">Premium</Badge>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2">
                      {lesson.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredLessons.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No lessons found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters to see more lessons.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
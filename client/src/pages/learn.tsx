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

export default function Learn() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const { tier } = useSubscriptionStatus();

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["/api/lessons"],
  });

  const { data: progress = [] } = useQuery({
    queryKey: ["/api/progress", user?.id],
    enabled: isAuthenticated && !!user?.id,
  });

  const markAsCompleted = useMutation({
    mutationFn: async (lessonId: string) => {
      return apiRequest("POST", "/api/progress", { 
        lessonId, 
        completed: true 
      });
    },
    onSuccess: () => {
      toast({
        title: "Lesson Completed!",
        description: "Great job! You've completed this lesson.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/progress", user?.id] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Please Login",
          description: "You need to login to track progress.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1000);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to update progress",
        variant: "destructive",
      });
    },
  });

  const categories = [
    { value: "all", label: "All Categories", icon: BookOpen },
    { value: "Fundamentals", label: "Fundamentals", icon: Star },
    { value: "Trading", label: "Trading", icon: TrendingUp },
    { value: "Security", label: "Security", icon: Shield },
    { value: "DeFi", label: "DeFi", icon: Coins },
    { value: "NFT", label: "NFT", icon: Target },
  ];

  const levels = [
    { value: "all", label: "All Levels" },
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" },
  ];

  const filteredLessons = lessons.filter((lesson: Lesson) => {
    const categoryMatch = selectedCategory === "all" || lesson.category === selectedCategory;
    const levelMatch = selectedLevel === "all" || lesson.level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  const completedLessonIds = progress.map((p: any) => p.lessonId);
  const completedCount = completedLessonIds.length;
  const totalCount = lessons.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const canAccessLesson = (lesson: Lesson) => {
    if (!lesson.isPremium) return true;
    if (!isAuthenticated) return false;
    
    const tierOrder = { free: 0, basic: 1, pro: 2, elite: 3 };
    const requiredTierLevel = tierOrder[lesson.requiredTier as keyof typeof tierOrder] || 0;
    const userTierLevel = tierOrder[tier as keyof typeof tierOrder] || 0;
    
    return userTierLevel >= requiredTierLevel;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.value === category);
    return categoryData ? categoryData.icon : BookOpen;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Lesson detail view
  if (selectedLesson) {
    const isCompleted = completedLessonIds.includes(selectedLesson.id);
    const hasAccess = canAccessLesson(selectedLesson);

    return (
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
                      {React.createElement(getCategoryIcon(selectedLesson.category), { 
                        className: "h-6 w-6 text-blue-600" 
                      })}
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
                          <p className="text-lg">Video Player</p>
                          <p className="text-sm opacity-75">Interactive lesson content will be displayed here</p>
                        </div>
                      </div>

                      {/* Lesson Content */}
                      <div className="prose dark:prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: selectedLesson.content.replace(/\n/g, '<br />') }} />
                      </div>

                      {/* Action Button */}
                      {hasAccess && !isCompleted && (
                        <Button 
                          onClick={() => markAsCompleted.mutate(selectedLesson.id)}
                          disabled={markAsCompleted.isPending}
                          className="w-full"
                        >
                          {markAsCompleted.isPending ? "Marking as Complete..." : "Mark as Complete"}
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Lesson Info Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Objectives</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selectedLesson.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {selectedLesson.prerequisites.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Prerequisites</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedLesson.prerequisites.map((prereq, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{prereq}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedLesson.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main lessons list view
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Learning Center
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Master crypto trading with our comprehensive lessons
              </p>
            </div>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>

          {/* Progress Bar */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {completedCount} / {totalCount} lessons
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {progressPercentage.toFixed(0)}% complete
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
          <TabsList className="grid w-full grid-cols-6">
            {categories.map((category) => (
              <TabsTrigger key={category.value} value={category.value} className="flex items-center space-x-1">
                {React.createElement(category.icon, { className: "h-4 w-4" })}
                <span className="hidden sm:inline">{category.label}</span>
              </TabsTrigger>
            ))}
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
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {lesson.category}
                    </span>
                    <Button size="sm" variant={hasAccess ? "default" : "secondary"}>
                      {!hasAccess ? "Upgrade" : isCompleted ? "Review" : "Start"}
                    </Button>
                  </div>
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
  );
}
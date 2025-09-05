import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Play, Pause, Volume2, BookOpen, Clock, 
  Target, CheckCircle, ArrowLeft, Info, Brain,
  Trophy, Coins, Star, Zap
} from "lucide-react";
import { triggerCelebration } from "@/lib/confetti";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  duration: number;
  learningObjectives: string[];
  videoUrl?: string;
  hasVideo?: boolean;
  hasQuiz?: boolean;
  level?: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

interface SimpleLessonViewerProps {
  lessonId: string;
  lessonTitle: string;
  category: string;
  difficulty: string;
  onClose: () => void;
}

export function SimpleLessonViewer({ 
  lessonId, 
  lessonTitle,
  category,
  difficulty,
  onClose 
}: SimpleLessonViewerProps) {
  const [videoWatched, setVideoWatched] = useState(false);
  const [contentRead, setContentRead] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [videoWatchTime, setVideoWatchTime] = useState(0);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch actual lesson data
  const { data: lesson, isLoading } = useQuery<Lesson>({
    queryKey: ['/api/lessons', lessonId]
  });

  // Fetch quiz questions for the lesson
  const { data: quizQuestions = [] } = useQuery<QuizQuestion[]>({
    queryKey: ['/api/lessons', lessonId, 'quiz'],
    enabled: lesson?.hasQuiz || false
  });

  // Complete lesson mutation
  const completeLessonMutation = useMutation({
    mutationFn: async (completionData: { score?: number; timeSpent: number }) => {
      return apiRequest("POST", "/api/progress/complete", {
        lessonId,
        ...completionData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
      toast({
        title: "🎉 Lesson Completed!",
        description: `Great job! You've earned ${calculateRewards()} USDC tokens.`,
      });
      triggerCelebration('achievement');
    }
  });

  // Calculate rewards based on performance
  const calculateRewards = () => {
    let baseReward = 5; // Base USDC reward
    if (quizScore >= 90) baseReward += 5; // Bonus for high score
    if (difficulty === 'advanced') baseReward += 3; // Bonus for difficulty
    return baseReward;
  };

  useEffect(() => {
    const totalSteps = lesson?.hasQuiz ? 3 : 2; // Video + Content + Quiz (if applicable)
    let completedSteps = 0;
    if (videoWatched) completedSteps++;
    if (contentRead) completedSteps++;
    if (quizCompleted) completedSteps++;
    setProgress((completedSteps / totalSteps) * 100);
  }, [videoWatched, contentRead, quizCompleted, lesson?.hasQuiz]);

  // Auto-complete lesson when all steps are done
  useEffect(() => {
    if (progress === 100 && !completeLessonMutation.isPending) {
      const completionData = {
        score: lesson?.hasQuiz ? quizScore : undefined,
        timeSpent: Math.max(1, Math.floor(videoWatchTime / 60)) // Convert to minutes
      };
      completeLessonMutation.mutate(completionData);
    }
  }, [progress, quizScore, videoWatchTime, lesson?.hasQuiz, completeLessonMutation]);

  const handleVideoEnd = () => {
    setVideoWatched(true);
    toast({
      title: "Video Complete! 📹",
      description: "Great attention! Move to the content tab to continue.",
    });
    triggerCelebration('achievement');
  };

  const handleContentComplete = () => {
    setContentRead(true);
    if (!lesson?.hasQuiz) {
      toast({
        title: "Content Mastered! 📚",
        description: "Excellent focus! Lesson complete.",
      });
    } else {
      toast({
        title: "Content Mastered! 📚",
        description: "Ready for the quiz? Test your knowledge!",
      });
    }
    triggerCelebration('achievement');
  };

  const submitQuizAnswer = () => {
    if (selectedAnswer === null) return;
    
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setQuizScore(prev => prev + currentQuestion.points);
      triggerCelebration('achievement');
    }
    
    setShowQuizResult(true);
    
    // Auto advance to next question after showing result
    setTimeout(() => {
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowQuizResult(false);
      } else {
        setQuizCompleted(true);
        toast({
          title: "Quiz Complete! 🧠",
          description: `Score: ${quizScore}/${quizQuestions.reduce((sum, q) => sum + q.points, 0)} points`,
        });
        triggerCelebration('achievement');
      }
    }, 2500);
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-900 border-slate-700">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading lesson content...</p>
        </CardContent>
      </Card>
    );
  }

  if (!lesson) {
    return (
      <Card className="bg-slate-900 border-slate-700">
        <CardContent className="p-8 text-center">
          <p className="text-red-400">Lesson not found</p>
          <Button onClick={onClose} className="mt-4">Back to Lessons</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-white mb-2">{lesson.title}</CardTitle>
              <p className="text-gray-300">{lesson.description}</p>
              <div className="flex gap-2 mt-3">
                <Badge variant="outline">{category}</Badge>
                <Badge variant="outline">{difficulty}</Badge>
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  {lesson.duration} min
                </Badge>
              </div>
            </div>
            <Button onClick={onClose} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          
          {/* Progress */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Lesson Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span className={videoWatched ? "text-green-400" : ""}>
                {videoWatched ? "✓" : "○"} Watch Video
              </span>
              <span className={contentRead ? "text-green-400" : ""}>
                {contentRead ? "✓" : "○"} Read Content
              </span>
              {lesson?.hasQuiz && (
                <span className={quizCompleted ? "text-green-400" : ""}>
                  {quizCompleted ? "✓" : "○"} Complete Quiz
                </span>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Learning Objectives */}
      {lesson.learningObjectives && lesson.learningObjectives.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Target className="w-5 h-5 text-purple-400" />
              What You'll Learn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {lesson.learningObjectives.map((objective: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Card className="bg-slate-900 border-slate-700">
        <CardContent className="p-6">
          <Tabs defaultValue="video">
            <TabsList className={`grid w-full ${lesson?.hasQuiz ? 'grid-cols-3' : 'grid-cols-2'} mb-6`}>
              <TabsTrigger value="video">
                <Play className="w-4 h-4 mr-2" />
                Video Lesson
              </TabsTrigger>
              <TabsTrigger value="content">
                <BookOpen className="w-4 h-4 mr-2" />
                Reading Material
              </TabsTrigger>
              {lesson?.hasQuiz && (
                <TabsTrigger value="quiz" disabled={!contentRead}>
                  <Brain className="w-4 h-4 mr-2" />
                  Knowledge Check
                </TabsTrigger>
              )}
            </TabsList>

            {/* Video Tab */}
            <TabsContent value="video" className="space-y-4">
              {lesson.videoUrl ? (
                <div>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={lesson.videoUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onEnded={handleVideoEnd}
                    ></iframe>
                  </div>
                  
                  {!videoWatched && (
                    <Alert className="mt-4">
                      <Info className="w-4 h-4" />
                      <AlertDescription>
                        Watch the full video to mark this section as complete
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {videoWatched && (
                    <Alert className="mt-4 border-green-500/30 bg-green-900/20">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <AlertDescription className="text-green-400">
                        Video watched! Great job!
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription>
                    Video content is being prepared for this lesson. Please check the reading material.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4">
              <div className="prose prose-invert max-w-none">
                <div 
                  className="text-gray-300"
                  dangerouslySetInnerHTML={{ __html: lesson.content }}
                />
              </div>
              
              {!contentRead && (
                <Button 
                  onClick={handleContentComplete}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Read
                </Button>
              )}
              
              {contentRead && (
                <Alert className="border-green-500/30 bg-green-900/20">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <AlertDescription className="text-green-400">
                    Content completed! You've mastered this lesson!
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* Quiz Tab */}
            {lesson?.hasQuiz && (
              <TabsContent value="quiz" className="space-y-6">
                {!quizCompleted ? (
                  <div className="space-y-6">
                    {/* Quiz Header */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Brain className="w-6 h-6 text-purple-400" />
                        <h3 className="text-xl font-semibold text-white">Knowledge Check</h3>
                      </div>
                      <p className="text-gray-400">
                        Question {currentQuestionIndex + 1} of {quizQuestions.length}
                      </p>
                      <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Current Question */}
                    {quizQuestions[currentQuestionIndex] && (
                      <Card className="bg-slate-800/50 border-slate-600">
                        <CardContent className="p-6">
                          <h4 className="text-lg font-medium text-white mb-4">
                            {quizQuestions[currentQuestionIndex].question}
                          </h4>
                          
                          {/* Answer Options */}
                          <div className="space-y-3 mb-6">
                            {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                              <Button
                                key={index}
                                variant={selectedAnswer === index ? "secondary" : "outline"}
                                className="w-full justify-start text-left h-auto p-4 hover:bg-slate-700/50"
                                onClick={() => setSelectedAnswer(index)}
                                disabled={showQuizResult}
                              >
                                <span className="font-medium mr-3 text-purple-400">
                                  {String.fromCharCode(65 + index)}.
                                </span>
                                <span className="text-white">{option}</span>
                              </Button>
                            ))}
                          </div>

                          {/* Submit Button */}
                          {!showQuizResult && (
                            <div className="flex justify-center">
                              <Button 
                                onClick={submitQuizAnswer}
                                disabled={selectedAnswer === null}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                              >
                                Submit Answer
                              </Button>
                            </div>
                          )}

                          {/* Quiz Result */}
                          {showQuizResult && (
                            <Alert className={`mt-4 ${selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer 
                              ? 'border-green-500/30 bg-green-900/20' 
                              : 'border-red-500/30 bg-red-900/20'}`}>
                              <div className="flex items-start gap-3">
                                {selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer ? (
                                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                                ) : (
                                  <Info className="w-5 h-5 text-red-400 mt-0.5" />
                                )}
                                <div>
                                  <AlertDescription className={selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer 
                                    ? 'text-green-300' 
                                    : 'text-red-300'}>
                                    <strong>
                                      {selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer 
                                        ? 'Correct!' 
                                        : `Incorrect. The correct answer is ${String.fromCharCode(65 + quizQuestions[currentQuestionIndex].correctAnswer)}.`}
                                    </strong>
                                  </AlertDescription>
                                  <p className="text-gray-300 text-sm mt-2">
                                    {quizQuestions[currentQuestionIndex].explanation}
                                  </p>
                                </div>
                              </div>
                            </Alert>
                          )}

                          {/* Mobile-friendly Next Question Button */}
                          {showQuizResult && currentQuestionIndex < quizQuestions.length - 1 && (
                            <div className="flex justify-center mt-4">
                              <Button 
                                onClick={() => {
                                  setCurrentQuestionIndex(prev => prev + 1);
                                  setSelectedAnswer(null);
                                  setShowQuizResult(false);
                                }}
                                className="bg-purple-600 hover:bg-purple-700 w-full md:w-auto"
                              >
                                Next Question →
                              </Button>
                            </div>
                          )}

                          {/* Complete Quiz Button */}
                          {showQuizResult && currentQuestionIndex === quizQuestions.length - 1 && (
                            <div className="flex justify-center mt-4">
                              <Button 
                                onClick={completeQuiz}
                                className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
                              >
                                Complete Quiz ✓
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  /* Quiz Complete */
                  <div className="text-center space-y-6">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h3>
                      <p className="text-gray-300 mb-4">
                        Your Score: {quizScore}/{quizQuestions.reduce((sum, q) => sum + q.points, 0)} points
                      </p>
                      <div className="flex items-center justify-center gap-4 text-sm">
                        <Badge variant="outline" className="bg-purple-900/20 border-purple-500/30 text-purple-300">
                          <Star className="w-3 h-3 mr-1" />
                          {Math.round((quizScore / quizQuestions.reduce((sum, q) => sum + q.points, 0)) * 100)}% Score
                        </Badge>
                        <Badge variant="outline" className="bg-green-900/20 border-green-500/30 text-green-300">
                          <Coins className="w-3 h-3 mr-1" />
                          +{calculateRewards()} USDC Earned
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Mobile-friendly Continue Button */}
                    <div className="flex justify-center mt-6">
                      <Button 
                        onClick={onClose}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full md:w-auto"
                      >
                        Continue Learning Journey
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* Completion Summary */}
      {progress === 100 && (
        <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/30">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Lesson Complete!</h3>
            <p className="text-gray-300 mb-4">
              Excellent work! You've completed "{lesson.title}"
            </p>
            <Button 
              onClick={onClose}
              className="bg-green-600 hover:bg-green-700"
            >
              Continue Learning
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
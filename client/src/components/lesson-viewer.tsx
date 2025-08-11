import { useState } from "react";
import { ChevronLeft, ChevronRight, Play, CheckCircle, Lock, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface LessonViewerProps {
  lessonId: string;
  onClose: () => void;
}

export default function LessonViewer({ lessonId, onClose }: LessonViewerProps) {
  const [currentProgress, setCurrentProgress] = useState(0);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: lesson, isLoading } = useQuery({
    queryKey: ['/api/lessons', lessonId]
  });

  const { data: userProgress } = useQuery({
    queryKey: ['/api/progress/demo-user']
  });

  const updateProgressMutation = useMutation({
    mutationFn: (progressData: { progress: number; completed?: boolean }) =>
      apiRequest('PUT', `/api/progress/demo-user/${lessonId}`, progressData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/progress/demo-user'] });
      toast({
        title: "Progress Updated",
        description: "Your learning progress has been saved",
      });
    },
  });

  const existingProgress = Array.isArray(userProgress) 
    ? userProgress.find((p: any) => p.lessonId === lessonId)
    : null;

  const progressPercent = existingProgress?.progress || currentProgress;
  const isCompleted = existingProgress?.completed || false;

  const handleProgressUpdate = (newProgress: number, completed = false) => {
    setCurrentProgress(newProgress);
    updateProgressMutation.mutate({ progress: newProgress, completed });
  };

  const handleCompleteLesson = () => {
    handleProgressUpdate(100, true);
  };

  const handleContinueLearning = () => {
    const newProgress = Math.min(progressPercent + 25, 100);
    handleProgressUpdate(newProgress, newProgress >= 100);
  };

  if (isLoading || !lesson) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="text-center py-8">Loading lesson...</div>
        </div>
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onClose}
            variant="ghost"
            className="flex items-center text-slate-600 hover:text-slate-900"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Lessons
          </Button>
          <div className="flex items-center space-x-2">
            <Badge className={`text-xs font-semibold px-3 py-1 ${getLevelColor(lesson.level)}`}>
              {lesson.level}
            </Badge>
            <span className="text-sm text-slate-500 flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              {lesson.duration} min
            </span>
          </div>
        </div>

        {/* Lesson Title and Progress */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">{lesson.title}</h1>
          <p className="text-lg text-slate-600 mb-6">{lesson.description}</p>
          
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Progress</span>
              <span className="text-sm text-slate-600">{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2 mb-3" />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : lesson.isLocked ? (
                  <Lock className="h-5 w-5 text-slate-400" />
                ) : (
                  <Play className="h-5 w-5 text-primary" />
                )}
                <span className="text-sm font-medium text-slate-700">
                  {isCompleted ? 'Completed' : lesson.isLocked ? 'Locked' : 'In Progress'}
                </span>
              </div>
              {!lesson.isLocked && !isCompleted && (
                <Button
                  onClick={handleContinueLearning}
                  disabled={updateProgressMutation.isPending}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Continue Learning
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="prose prose-slate max-w-none mb-8">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">What You'll Learn</h2>
            <div className="whitespace-pre-line text-slate-700 leading-relaxed">
              {lesson.content}
            </div>
          </div>

          {/* Interactive Elements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-3">Key Concepts</h3>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Understanding blockchain fundamentals
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Decentralized network principles
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Consensus mechanisms
                </li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-3">Practice Exercise</h3>
              <p className="text-slate-600 mb-4">
                Complete this quick knowledge check to reinforce your learning.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleProgressUpdate(Math.min(progressPercent + 15, 100))}
              >
                Start Exercise
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <Button
            variant="outline"
            className="flex items-center text-slate-600"
            disabled
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous Lesson
          </Button>
          
          <div className="flex items-center space-x-3">
            {!isCompleted && !lesson.isLocked && (
              <Button
                onClick={handleCompleteLesson}
                disabled={updateProgressMutation.isPending}
                className="bg-success hover:bg-success/90 text-white"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark Complete
              </Button>
            )}
            <Button
              className="flex items-center bg-primary hover:bg-primary/90 text-white"
              disabled
            >
              Next Lesson
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
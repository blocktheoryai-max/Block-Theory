import { GraduationCap, Clock, CheckCircle, PlayCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import LessonViewer from "./lesson-viewer";
import LessonSystem from "./lesson-system";

export default function LearnSection() {
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const { data: lessons, isLoading } = useQuery({
    queryKey: ['/api/lessons']
  });

  const { data: userProgress } = useQuery({
    queryKey: ['/api/progress'],
    enabled: isAuthenticated // Only fetch progress if user is authenticated
  });

  const getProgressForLesson = (lessonId: string) => {
    return Array.isArray(userProgress) ? userProgress.find((p: any) => p.lessonId === lessonId) : undefined;
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completedLessons = Array.isArray(userProgress) ? userProgress.filter((p: any) => p.completed).length : 0;
  const totalLessons = Array.isArray(lessons) ? lessons.length : 0;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  if (isLoading) {
    return (
      <section id="learn" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading lessons...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="learn" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 flex items-center justify-center">
            <GraduationCap className="text-primary mr-3 h-10 w-10" />
            Learn
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Comprehensive curriculum covering everything from blockchain basics to advanced trading strategies
          </p>
        </div>

        {/* Learning Path Progress */}
        <div className="bg-gradient-to-r from-purple-50 to-yellow-50 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-semibold text-slate-900 mb-6">Your Learning Journey</h3>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <Progress value={progressPercentage} className="h-3" />
            </div>
            <span className="text-sm font-medium text-slate-600">
              {completedLessons}/{totalLessons} lessons completed
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <CheckCircle className="text-success mb-2 h-6 w-6" />
              <h4 className="font-semibold text-slate-900">Fundamentals</h4>
              <p className="text-sm text-slate-600">Completed</p>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <PlayCircle className="text-primary mb-2 h-6 w-6" />
              <h4 className="font-semibold text-slate-900">Technical Analysis</h4>
              <p className="text-sm text-slate-600">In Progress</p>
            </div>
            <div className="bg-slate-100 border border-slate-200 rounded-lg p-4">
              <Lock className="text-slate-400 mb-2 h-6 w-6" />
              <h4 className="font-semibold text-slate-400">Advanced Strategies</h4>
              <p className="text-sm text-slate-400">Locked</p>
            </div>
          </div>
        </div>

        {/* Comprehensive Lesson System */}
        <LessonSystem />
      </div>
    </section>
  );
}

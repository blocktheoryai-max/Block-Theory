import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Play, Pause, Volume2, BookOpen, Clock, 
  Target, CheckCircle, ArrowLeft, Info
} from "lucide-react";
import { triggerCelebration } from "@/lib/confetti";

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  duration: number;
  learningObjectives: string[];
  videoUrl?: string;
  hasVideo?: boolean;
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
  const [progress, setProgress] = useState(0);

  // Fetch actual lesson data
  const { data: lesson, isLoading } = useQuery<Lesson>({
    queryKey: ['/api/lessons', lessonId]
  });

  useEffect(() => {
    const totalSteps = 2; // Video + Content
    let completedSteps = 0;
    if (videoWatched) completedSteps++;
    if (contentRead) completedSteps++;
    setProgress((completedSteps / totalSteps) * 100);
  }, [videoWatched, contentRead]);

  const handleVideoEnd = () => {
    setVideoWatched(true);
    triggerCelebration('achievement');
  };

  const handleContentComplete = () => {
    setContentRead(true);
    if (videoWatched) {
      triggerCelebration('achievement');
      setTimeout(() => {
        onClose();
      }, 2000);
    }
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
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="video">
                <Play className="w-4 h-4 mr-2" />
                Video Lesson
              </TabsTrigger>
              <TabsTrigger value="content">
                <BookOpen className="w-4 h-4 mr-2" />
                Reading Material
              </TabsTrigger>
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
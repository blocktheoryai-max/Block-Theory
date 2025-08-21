import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle, Clock, CheckCircle, Lock } from "lucide-react";

interface VideoLessonCardProps {
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  completed?: boolean;
  locked?: boolean;
  premium?: boolean;
  thumbnailUrl?: string;
}

export function VideoLessonCard({
  title,
  description,
  duration,
  difficulty,
  completed = false,
  locked = false,
  premium = false,
  thumbnailUrl
}: VideoLessonCardProps) {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${locked ? 'opacity-75' : ''}`}>
      <CardHeader className="p-0">
        <div className="relative">
          {/* Video Thumbnail */}
          <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center overflow-hidden">
            {thumbnailUrl ? (
              <img 
                src={thumbnailUrl} 
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 w-full h-full flex items-center justify-center">
                <PlayCircle className="w-16 h-16 text-primary/60" />
              </div>
            )}
            
            {/* Play Button Overlay */}
            {!locked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/90 rounded-full p-3">
                  <PlayCircle className="w-8 h-8 text-primary" />
                </div>
              </div>
            )}
            
            {/* Duration Badge */}
            <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {duration}
            </div>
            
            {/* Status Icons */}
            <div className="absolute top-2 left-2 flex gap-2">
              {completed && (
                <div className="bg-green-500 text-white rounded-full p-1">
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}
              {locked && (
                <div className="bg-gray-500 text-white rounded-full p-1">
                  <Lock className="w-4 h-4" />
                </div>
              )}
              {premium && (
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                  Premium
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className={getDifficultyColor(difficulty)}>
              {difficulty}
            </Badge>
          </div>
          <CardTitle className="text-lg leading-tight">{title}</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 px-4 pb-4">
        <CardDescription className="mb-4">{description}</CardDescription>
        
        <Button 
          className="w-full" 
          variant={locked ? "outline" : "default"}
          disabled={locked}
        >
          {locked ? (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Unlock with Premium
            </>
          ) : completed ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Watch Again
            </>
          ) : (
            <>
              <PlayCircle className="w-4 h-4 mr-2" />
              Start Lesson
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
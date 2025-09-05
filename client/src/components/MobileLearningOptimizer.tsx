import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Download, 
  Wifi, 
  WifiOff, 
  Battery, 
  Smartphone,
  BookOpen,
  Play,
  Pause
} from "lucide-react";

export function MobileLearningOptimizer() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [offlineLessons, setOfflineLessons] = useState<string[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const downloadForOffline = async (lessonIds: string[]) => {
    setIsDownloading(true);
    
    // Simulate progressive download
    for (let i = 0; i <= 100; i += 10) {
      setDownloadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setOfflineLessons(prev => [...prev, ...lessonIds]);
    setIsDownloading(false);
    setDownloadProgress(0);
  };

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="w-5 h-5 text-green-400" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-400" />
              )}
              <span className="text-white">
                {isOnline ? 'Connected' : 'Offline Mode'}
              </span>
            </div>
            <Badge 
              variant="outline" 
              className={isOnline ? 'text-green-400 border-green-500/30' : 'text-red-400 border-red-500/30'}
            >
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Offline Download Options */}
      {isOnline && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">Download for Offline</span>
              </div>
              <Smartphone className="w-5 h-5 text-purple-400" />
            </div>
            
            <p className="text-gray-400 text-sm mb-4">
              Save lessons to your device for learning without internet connection
            </p>
            
            {isDownloading ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Downloading lessons...</span>
                  <span>{downloadProgress}%</span>
                </div>
                <Progress value={downloadProgress} className="h-2" />
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  onClick={() => downloadForOffline(['lesson-1', 'lesson-2', 'lesson-3'])}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Next 3 Lessons
                </Button>
                <Button
                  onClick={() => downloadForOffline(['beginner-pack'])}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Download Beginner Pack (10 lessons)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Offline Lessons */}
      {offlineLessons.length > 0 && (
        <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Download className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">Offline Ready</span>
            </div>
            <p className="text-gray-300 text-sm">
              {offlineLessons.length} lesson{offlineLessons.length > 1 ? 's' : ''} available offline
            </p>
          </CardContent>
        </Card>
      )}

      {/* Mobile Learning Tips */}
      {!isOnline && (
        <Alert className="border-yellow-500/30 bg-yellow-900/20">
          <Smartphone className="w-4 h-4" />
          <AlertDescription className="text-yellow-300">
            <strong>Offline Mode:</strong> You can continue learning with downloaded lessons. 
            Progress will sync when you reconnect.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
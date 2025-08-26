import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipForward, SkipBack, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VideoLessonPlayerProps {
  lesson: {
    title: string;
    format: string;
    duration: number;
    videoUrl?: string;
    videoThumbnail?: string;
    videoDuration?: number;
    videoTranscript?: string;
    interactiveElements?: any;
    learningObjectives: string[];
    hasQuiz: boolean;
    hasSimulation: boolean;
    hasVideo: boolean;
  };
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

export function VideoLessonPlayer({ lesson, onProgress, onComplete }: VideoLessonPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [quizVisible, setQuizVisible] = useState(false);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);

  const duration = lesson.videoDuration || 0;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onProgress?.(video.currentTime / duration);
      
      // Check for quiz points
      if (lesson.interactiveElements?.quizPoints) {
        lesson.interactiveElements.quizPoints.forEach((point: number, index: number) => {
          if (Math.abs(video.currentTime - point) < 0.5) {
            setQuizVisible(true);
            setCurrentQuizQuestion(index);
            video.pause();
            setIsPlaying(false);
          }
        });
      }
    };

    const handleEnded = () => {
      onComplete?.();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [duration, lesson.interactiveElements, onProgress, onComplete]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (value[0] / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0] / 100;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case "Quick": return "bg-green-500";
      case "Standard": return "bg-blue-500";
      case "Deep Dive": return "bg-purple-500";
      case "Masterclass": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const sampleQuizQuestions = [
    {
      question: "What is the main characteristic of blockchain technology?",
      options: ["Centralized control", "Distributed ledger", "Single point of failure", "Manual verification"],
      correct: 1
    },
    {
      question: "Which consensus mechanism does Bitcoin use?",
      options: ["Proof of Stake", "Proof of Work", "Proof of Authority", "Delegated Proof of Stake"],
      correct: 1
    }
  ];

  return (
    <div className="space-y-6">
      {/* Video Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{lesson.title}</h2>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={`text-white ${getFormatColor(lesson.format)}`}>
              {lesson.format}
            </Badge>
            <Badge variant="outline">{lesson.duration} min</Badge>
            {lesson.hasVideo && <Badge variant="outline">🎥 Video</Badge>}
            {lesson.hasQuiz && <Badge variant="outline">📝 Quiz</Badge>}
            {lesson.hasSimulation && <Badge variant="outline">🎮 Simulation</Badge>}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Video Player */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="relative bg-black rounded-lg overflow-hidden">
                {lesson.videoUrl ? (
                  lesson.videoUrl.includes('youtube.com') || lesson.videoUrl.includes('youtu.be') ? (
                    <div className="w-full aspect-video">
                      <iframe
                        className="w-full h-full"
                        src={lesson.videoUrl}
                        title={lesson.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <video
                      ref={videoRef}
                      className="w-full aspect-video"
                      poster={lesson.videoThumbnail}
                      controls
                      onClick={togglePlayPause}
                    >
                      <source src={lesson.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )
                ) : (
                  <div className="w-full aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-lg">Educational Video Available</p>
                      <p className="text-sm opacity-80">Click to start learning</p>
                    </div>
                  </div>
                )}

                {/* Video Controls - Only show for non-YouTube videos */}
                {!(lesson.videoUrl?.includes('youtube.com') || lesson.videoUrl?.includes('youtu.be')) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="space-y-3">
                      {/* Progress Bar */}
                      <Slider
                        value={[progress]}
                        onValueChange={handleSeek}
                        max={100}
                        step={0.1}
                        className="w-full"
                      />

                      {/* Control Buttons */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={togglePlayPause}>
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => skip(-10)}>
                            <SkipBack className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => skip(10)}>
                            <SkipForward className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={toggleMute}>
                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </Button>
                        </div>
                        <div className="w-20">
                          <Slider
                            value={[isMuted ? 0 : volume * 100]}
                            onValueChange={handleVolumeChange}
                            max={100}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-white text-sm">
                        <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Maximize className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Quiz Overlay */}
          {quizVisible && (
            <Card className="border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-semibold">Quick Knowledge Check</h3>
                </div>
                <div className="space-y-4">
                  <p className="font-medium">{sampleQuizQuestions[currentQuizQuestion]?.question}</p>
                  <div className="grid gap-2">
                    {sampleQuizQuestions[currentQuizQuestion]?.options.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-start"
                        onClick={() => {
                          setQuizVisible(false);
                          setIsPlaying(true);
                          videoRef.current?.play();
                        }}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Tabs defaultValue="objectives">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="objectives">Objectives</TabsTrigger>
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
            </TabsList>

            <TabsContent value="objectives" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Learning Objectives</h3>
                  <ul className="space-y-2">
                    {lesson.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Interactive Elements</h3>
                  <div className="space-y-2">
                    {lesson.hasQuiz && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        Knowledge quizzes throughout
                      </div>
                    )}
                    {lesson.hasSimulation && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 bg-purple-500 rounded-full" />
                        Hands-on trading simulation
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 bg-blue-500 rounded-full" />
                      Visual animations & diagrams
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transcript" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Video Transcript</h3>
                  <div className="text-sm text-muted-foreground max-h-96 overflow-y-auto">
                    {lesson.videoTranscript || "Transcript will be available when the video is ready."}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
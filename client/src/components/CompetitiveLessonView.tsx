import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InteractiveLessonViewer } from "./InteractiveLessonViewer";
import { CompetitiveLearning } from "./CompetitiveLearning";
import { BookOpen, Users, Trophy, Zap, Play } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { triggerCelebration } from "@/lib/confetti";

interface CompetitiveLessonViewProps {
  lessonId: string;
  lessonTitle: string;
  category: string;
  difficulty: string;
  onClose: () => void;
}

export function CompetitiveLessonView({ 
  lessonId, 
  lessonTitle, 
  category, 
  difficulty,
  onClose 
}: CompetitiveLessonViewProps) {
  const [mode, setMode] = useState<"solo" | "competitive">("solo");
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [competitiveBonus, setCompetitiveBonus] = useState(0);

  const completeLessonMutation = useMutation({
    mutationFn: async (data: { score: number, mode: string, timeSpent: number }) => {
      return apiRequest("POST", "/api/progress/complete", {
        lessonId,
        score: data.score,
        mode: data.mode,
        timeSpent: data.timeSpent
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
      triggerCelebration('achievement');
    }
  });

  const handleLessonComplete = (score: number) => {
    const bonus = mode === "competitive" ? Math.floor(score * 0.5) : 0; // 50% bonus for competitive
    setFinalScore(score);
    setCompetitiveBonus(bonus);
    setLessonCompleted(true);
    
    completeLessonMutation.mutate({
      score: score + bonus,
      mode,
      timeSpent: Date.now() // Will calculate actual time on backend
    });
  };

  if (lessonCompleted) {
    return (
      <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/30">
        <div className="p-8 text-center space-y-6">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500 animate-bounce" />
          
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Lesson Complete!
            </h2>
            <p className="text-gray-300">{lessonTitle}</p>
          </div>

          <div className="space-y-3">
            <Card className="bg-slate-800/50 border-slate-700 p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Base Score</span>
                <span className="text-2xl font-bold text-white">{finalScore}</span>
              </div>
            </Card>
            
            {competitiveBonus > 0 && (
              <Card className="bg-purple-900/30 border-purple-500/30 p-4">
                <div className="flex justify-between items-center">
                  <span className="text-purple-400">Competitive Bonus</span>
                  <span className="text-2xl font-bold text-purple-400">+{competitiveBonus}</span>
                </div>
              </Card>
            )}

            <Card className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/30 p-4">
              <div className="flex justify-between items-center">
                <span className="text-yellow-400 font-semibold">Total Score</span>
                <span className="text-3xl font-bold text-yellow-400">
                  {finalScore + competitiveBonus}
                </span>
              </div>
            </Card>

            <div className="flex items-center justify-center gap-2 text-green-400">
              <Zap className="w-5 h-5" />
              <span className="font-semibold">+0.50 USDC Earned!</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Back to Lessons
            </Button>
            <Button 
              onClick={() => {
                setLessonCompleted(false);
                setMode("competitive");
              }}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Try Competitive Mode
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mode Selection Header */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">{lessonTitle}</h2>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{category}</Badge>
                <Badge variant="outline">{difficulty}</Badge>
              </div>
            </div>
            <Button onClick={onClose} variant="outline" size="sm">
              Exit Lesson
            </Button>
          </div>

          <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="solo" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Solo Learning
              </TabsTrigger>
              <TabsTrigger value="competitive" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Competitive Mode
              </TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <Card className={`p-3 ${mode === "solo" ? "border-blue-500 bg-blue-900/20" : "border-slate-700 bg-slate-800/20"}`}>
                <div className="text-center">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                  <h4 className="font-semibold mb-1">Solo Learning</h4>
                  <p className="text-xs text-gray-400">Learn at your own pace</p>
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rewards:</span>
                      <span className="text-green-400">$0.50 USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Time:</span>
                      <span>Unlimited</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className={`p-3 ${mode === "competitive" ? "border-purple-500 bg-purple-900/20" : "border-slate-700 bg-slate-800/20"}`}>
                <div className="text-center">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <h4 className="font-semibold mb-1">Competitive</h4>
                  <p className="text-xs text-gray-400">Race against others</p>
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rewards:</span>
                      <span className="text-green-400">$0.50-$50 USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Bonus:</span>
                      <span className="text-purple-400">+50% Score</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </Tabs>
        </div>
      </Card>

      {/* Lesson Content */}
      {mode === "solo" ? (
        <InteractiveLessonViewer 
          lessonId={lessonId}
          lessonTitle={lessonTitle}
          onComplete={handleLessonComplete}
        />
      ) : (
        <>
          <CompetitiveLearning 
            lessonId={lessonId}
            lessonTitle={lessonTitle}
          />
          <InteractiveLessonViewer 
            lessonId={lessonId}
            lessonTitle={lessonTitle}
            onComplete={handleLessonComplete}
          />
        </>
      )}
    </div>
  );
}
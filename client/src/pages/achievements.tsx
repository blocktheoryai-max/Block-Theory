import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import MobileBottomNav from "@/components/MobileBottomNav";
import { AchievementSystem } from "@/components/Achievement";
import { SEOHead } from "@/components/SEOHead";
import { Clock } from "lucide-react";

export default function Achievements() {
  // Achievement templates - users start with zero progress
  const achievements = [
    {
      id: "first-lesson",
      title: "First Steps",
      description: "Complete your first crypto lesson",
      icon: "star",
      progress: 0,
      maxProgress: 1,
      completed: false,
      rewardUSDC: 5,
      category: "learning" as const
    },
    {
      id: "quiz-master",
      title: "Quiz Master",
      description: "Score 100% on 5 quizzes",
      icon: "brain",
      progress: 0,
      maxProgress: 5,
      completed: false,
      rewardUSDC: 15,
      category: "mastery" as const
    },
    {
      id: "streak-warrior",
      title: "Streak Warrior",
      description: "Maintain a 7-day learning streak",
      icon: "fire",
      progress: 0,
      maxProgress: 7,
      completed: false,
      rewardUSDC: 20,
      category: "engagement" as const
    },
    {
      id: "lesson-collector",
      title: "Knowledge Collector",
      description: "Complete 25 lessons",
      icon: "trophy",
      progress: 0,
      maxProgress: 25,
      completed: false,
      rewardUSDC: 25,
      category: "learning" as const
    },
    {
      id: "early-adopter",
      title: "Early Adopter",
      description: "Join Block Theory in its first month",
      icon: "crown",
      progress: 0,
      maxProgress: 1,
      completed: false,
      rewardUSDC: 50,
      category: "special" as const
    },
    {
      id: "perfect-week",
      title: "Perfect Week",
      description: "Complete lessons 7 days in a row",
      icon: "target",
      progress: 0,
      maxProgress: 7,
      completed: false,
      rewardUSDC: 30,
      category: "engagement" as const
    }
  ];

  const userStats = {
    totalLessons: 0,
    streak: 0,
    usdcEarned: 0,
    avgQuizScore: 0
  };

  return (
    <>
      <SEOHead
        title="Achievements | Block Theory"
        description="Track your learning progress and earn USDC rewards for completing crypto education milestones"
        canonical="/achievements"
      />
      
      <div className="hidden md:block">
        <Navigation />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Achievements & Rewards
            </h1>
            <div className="bg-orange-900/20 border border-orange-500/50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-400" />
                <span className="font-semibold text-orange-400">Coming Soon</span>
              </div>
              <p className="text-gray-300 mt-2">
                Achievement rewards and USDC tokens will be available in a future update. Start learning now to track your progress!
              </p>
            </div>
          </div>

          <AchievementSystem achievements={achievements} userStats={userStats} />
        </div>
      </div>

      <div className="md:hidden">
        <MobileBottomNav />
      </div>
    </>
  );
}
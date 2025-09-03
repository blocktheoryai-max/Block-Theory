import { TradingCompetition } from "@/components/trading-competition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp, Users, Clock } from "lucide-react";

export default function Competitions() {
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-8">
        <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/50 mb-6">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              Trading Competitions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-300 mb-4">
              Compete against traders worldwide, win real crypto prizes, and prove your skills
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-black/50 border-yellow-500/30">
                <CardContent className="p-4 text-center">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <p className="text-2xl font-bold text-yellow-400">$10,000+</p>
                  <p className="text-sm text-gray-400">Monthly Prizes</p>
                </CardContent>
              </Card>
              <Card className="bg-black/50 border-blue-500/30">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                  <p className="text-2xl font-bold text-blue-400">2,847</p>
                  <p className="text-sm text-gray-400">Active Competitors</p>
                </CardContent>
              </Card>
              <Card className="bg-black/50 border-green-500/30">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <p className="text-2xl font-bold text-green-400">247%</p>
                  <p className="text-sm text-gray-400">Best Monthly Return</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <TradingCompetition />
      </div>
    </div>
  );
}
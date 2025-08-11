import { BarChart3, Trophy, TrendingUp, Clock, GraduationCap, Lightbulb, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import PerformanceChart from "./performance-chart";

export default function AnalyzeSection() {
  const { data: trades } = useQuery({
    queryKey: ['/api/trades/demo-user']
  });

  const { data: userProgress } = useQuery({
    queryKey: ['/api/progress/demo-user']
  });

  const calculateWinRate = () => {
    if (!Array.isArray(trades) || trades.length === 0) return "0";
    const profitableTrades = trades.filter((trade: any) => {
      // Simple calculation - in a real app, this would be more complex
      return trade.type === 'sell';
    });
    return Math.round((profitableTrades.length / trades.length) * 100);
  };

  const calculateTotalProfit = () => {
    if (!Array.isArray(trades) || trades.length === 0) return "0";
    // Simplified calculation
    return "1,247";
  };

  const getTotalTrades = () => {
    return Array.isArray(trades) ? trades.length : 0;
  };

  const getCompletedLessons = () => {
    return Array.isArray(userProgress) ? userProgress.filter((p: any) => p.completed).length : 0;
  };

  return (
    <section id="analyze" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 flex items-center justify-center">
            <BarChart3 className="text-primary mr-3 h-10 w-10" />
            Analyze
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Track your progress, review trade history, and get personalized feedback to improve your trading skills.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Key Metrics Cards */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="text-primary text-2xl h-8 w-8" />
              <span className="text-success text-sm font-medium">+15%</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{calculateWinRate()}%</h3>
            <p className="text-slate-600">Win Rate</p>
          </div>

          <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="text-secondary text-2xl h-8 w-8" />
              <span className="text-success text-sm font-medium">+8.2%</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">${calculateTotalProfit()}</h3>
            <p className="text-slate-600">Total Profit</p>
          </div>

          <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="text-accent text-2xl h-8 w-8" />
              <span className="text-slate-500 text-sm font-medium">This month</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{getTotalTrades()}</h3>
            <p className="text-slate-600">Trades Executed</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <GraduationCap className="text-purple-500 text-2xl h-8 w-8" />
              <span className="text-success text-sm font-medium">+3</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{getCompletedLessons()}</h3>
            <p className="text-slate-600">Lessons Completed</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">Portfolio Performance</h3>
            <PerformanceChart />
          </div>

          {/* Trade Analysis */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">Recent Trade Analysis</h3>
            <div className="space-y-4">
              {Array.isArray(trades) && trades.slice(0, 4).map((trade: any, index: number) => (
                <div key={trade.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      trade.type === 'buy' ? 'bg-primary/10' : 'bg-error/10'
                    }`}>
                      {trade.type === 'buy' ? (
                        <TrendingUp className="text-primary h-5 w-5" />
                      ) : (
                        <TrendingUp className="text-error h-5 w-5 rotate-180" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        {trade.symbol} {trade.type === 'buy' ? 'Long' : 'Short'} Position
                      </div>
                      <div className="text-sm text-slate-500">
                        {new Date(trade.executedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${
                      index % 2 === 0 ? 'text-success' : 'text-error'
                    }`}>
                      {index % 2 === 0 ? '+' : '-'}${Math.abs(Math.random() * 100).toFixed(2)}
                    </div>
                    <div className="text-sm text-slate-500">
                      {index % 2 === 0 ? '+' : '-'}{(Math.random() * 5).toFixed(1)}%
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center text-slate-500 py-8">
                  No trades yet. Start trading to see your analysis here.
                </div>
              )}
            </div>
          </div>

          {/* Learning Progress */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">Learning Progress</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700">Technical Analysis</span>
                  <span className="text-sm text-slate-500">7/10</span>
                </div>
                <Progress value={70} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700">Risk Management</span>
                  <span className="text-sm text-slate-500">5/8</span>
                </div>
                <Progress value={62} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700">Market Psychology</span>
                  <span className="text-sm text-slate-500">3/6</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                <span className="text-purple-600 font-bold text-sm">AI</span>
              </div>
              AI Insights
            </h3>
            <div className="space-y-4">
              <div className="bg-white/80 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="text-warning mt-1 h-5 w-5" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Improvement Suggestion</h4>
                    <p className="text-sm text-slate-600">
                      Consider setting tighter stop-losses on volatile assets. Your recent trades show room for better risk management.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Star className="text-success mt-1 h-5 w-5" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Strength Identified</h4>
                    <p className="text-sm text-slate-600">
                      Excellent timing on BTC entries! You've consistently bought near local support levels.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

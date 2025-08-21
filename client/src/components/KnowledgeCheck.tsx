import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Brain, Calculator, Target, Lightbulb } from "lucide-react";

interface KnowledgeCheck {
  id: string;
  type: "multiple_choice" | "calculation" | "scenario" | "drag_drop";
  title: string;
  description?: string;
  content: any;
  solution: any;
  hints: string[];
  points: number;
}

interface KnowledgeCheckProps {
  exercise: KnowledgeCheck;
  onComplete: (score: number, userAnswer: any) => void;
}

export function KnowledgeCheck({ exercise, onComplete }: KnowledgeCheckProps) {
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const getExerciseIcon = () => {
    switch (exercise.type) {
      case "calculation": return <Calculator className="w-5 h-5 text-blue-400" />;
      case "scenario": return <Target className="w-5 h-5 text-green-400" />;
      default: return <Brain className="w-5 h-5 text-purple-400" />;
    }
  };

  const checkAnswer = () => {
    let isCorrect = false;
    let score = 0;

    switch (exercise.type) {
      case "multiple_choice":
        isCorrect = userAnswer === exercise.solution.correctIndex;
        break;
      case "calculation":
        const userValue = parseFloat(userAnswer);
        const correctValue = parseFloat(exercise.solution.value);
        const tolerance = exercise.solution.tolerance || 0.01;
        isCorrect = Math.abs(userValue - correctValue) <= tolerance;
        break;
      case "scenario":
        // For scenarios, we check if key concepts are mentioned
        isCorrect = exercise.solution.keywords.some((keyword: string) => 
          userAnswer.toLowerCase().includes(keyword.toLowerCase())
        );
        break;
    }

    score = isCorrect ? exercise.points : Math.floor(exercise.points * 0.3); // Partial credit
    setShowSolution(true);
    setIsCompleted(true);
    onComplete(score, userAnswer);
  };

  const renderExerciseContent = () => {
    switch (exercise.type) {
      case "multiple_choice":
        return (
          <div className="space-y-3">
            {exercise.content.options.map((option: string, index: number) => (
              <Button
                key={index}
                variant={userAnswer === index ? "secondary" : "outline"}
                className="w-full text-left justify-start h-auto p-4"
                onClick={() => setUserAnswer(index)}
                disabled={isCompleted}
              >
                <span className="font-medium mr-3 text-blue-400">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </Button>
            ))}
          </div>
        );

      case "calculation":
        return (
          <div className="space-y-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-gray-300 text-sm leading-relaxed">
                {exercise.content.problem}
              </p>
              {exercise.content.formula && (
                <div className="mt-3 p-2 bg-slate-800 rounded font-mono text-sm text-blue-400">
                  Formula: {exercise.content.formula}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <Input
                type="number"
                placeholder="Enter your answer"
                value={userAnswer || ""}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={isCompleted}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <span className="text-gray-400">{exercise.content.unit}</span>
            </div>
          </div>
        );

      case "scenario":
        return (
          <div className="space-y-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-gray-300 text-sm leading-relaxed">
                {exercise.content.scenario}
              </p>
            </div>
            <textarea
              placeholder="Describe your approach and reasoning..."
              value={userAnswer || ""}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isCompleted}
              className="w-full h-32 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 resize-none"
            />
          </div>
        );

      default:
        return <div className="text-gray-400">Unsupported exercise type</div>;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-600">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getExerciseIcon()}
            <CardTitle className="text-lg text-white">{exercise.title}</CardTitle>
          </div>
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            {exercise.points} points
          </Badge>
        </div>
        {exercise.description && (
          <p className="text-gray-300 text-sm">{exercise.description}</p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {renderExerciseContent()}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {exercise.hints.length > 0 && !showSolution && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHints(!showHints)}
                className="text-yellow-400 border-yellow-400 hover:bg-yellow-400/10"
              >
                <Lightbulb className="w-4 h-4 mr-1" />
                {showHints ? "Hide Hints" : "Show Hint"}
              </Button>
            )}
          </div>
          
          {!isCompleted && (
            <Button
              onClick={checkAnswer}
              disabled={!userAnswer}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Check Answer
            </Button>
          )}
        </div>

        {showHints && exercise.hints.length > 0 && (
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-yellow-400 mb-2">Hint</h4>
                <p className="text-yellow-300 text-sm">
                  {exercise.hints[currentHint]}
                </p>
                {exercise.hints.length > 1 && (
                  <div className="mt-2 flex items-center space-x-2">
                    {exercise.hints.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentHint(index)}
                        className={`w-2 h-2 rounded-full ${
                          index === currentHint ? "bg-yellow-400" : "bg-yellow-600"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {showSolution && (
          <div className="bg-slate-700/50 rounded-lg p-4 border-l-4 border-green-500">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-white mb-2">Solution</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {exercise.solution.explanation}
                </p>
                {exercise.type === "calculation" && (
                  <div className="mt-2 p-2 bg-slate-800 rounded font-mono text-sm text-green-400">
                    Correct Answer: {exercise.solution.value} {exercise.content.unit}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
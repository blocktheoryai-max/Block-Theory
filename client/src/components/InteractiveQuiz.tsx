import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, HelpCircle, Lightbulb } from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

interface InteractiveQuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number, answers: number[]) => void;
}

export function InteractiveQuiz({ questions, onComplete }: InteractiveQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
    setIsAnswered(true);
    setShowExplanation(true);
    
    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(score + currentQuestion.points);
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setShowExplanation(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
      const finalScore = Math.round((score / questions.reduce((sum, q) => sum + q.points, 0)) * 100);
      onComplete(finalScore, selectedAnswers);
    }
  };

  if (quizCompleted) {
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = Math.round((score / totalPoints) * 100);
    
    return (
      <Card className="bg-slate-800/50 border-slate-600">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white flex items-center justify-center">
            <CheckCircle className="w-8 h-8 mr-3 text-green-400" />
            Quiz Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">{percentage}%</div>
            <p className="text-gray-300">You scored {score} out of {totalPoints} points</p>
          </div>
          
          <div className="space-y-3">
            {questions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div key={question.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-sm text-gray-300">Question {index + 1}</span>
                  <div className="flex items-center space-x-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-400">+{question.points} pts</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-red-400">0 pts</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="text-center">
            <Badge variant={percentage >= 80 ? "default" : percentage >= 60 ? "secondary" : "destructive"}>
              {percentage >= 80 ? "Excellent!" : percentage >= 60 ? "Good Job!" : "Keep Learning!"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-600">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            <CardTitle className="text-lg text-white">
              Question {currentQuestionIndex + 1} of {questions.length}
            </CardTitle>
          </div>
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            {currentQuestion.points} points
          </Badge>
        </div>
        <Progress value={progress} className="h-2 bg-slate-700" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-lg text-white font-medium">
          {currentQuestion.question}
        </div>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestionIndex] === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const showResult = isAnswered && showExplanation;
            
            let buttonVariant: "outline" | "default" | "destructive" | "secondary" = "outline";
            let buttonClass = "text-left h-auto p-4 justify-start";
            
            if (showResult) {
              if (isCorrect) {
                buttonVariant = "default";
                buttonClass += " bg-green-600 hover:bg-green-700 border-green-500";
              } else if (isSelected && !isCorrect) {
                buttonVariant = "destructive";
              }
            } else if (isSelected) {
              buttonVariant = "secondary";
            }
            
            return (
              <Button
                key={index}
                variant={buttonVariant}
                className={buttonClass}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
              >
                <div className="flex items-center w-full">
                  <span className="font-medium mr-3 text-blue-400">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="flex-1">{option}</span>
                  {showResult && isCorrect && (
                    <CheckCircle className="w-5 h-5 text-green-400 ml-2" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-400 ml-2" />
                  )}
                </div>
              </Button>
            );
          })}
        </div>
        
        {showExplanation && (
          <div className="bg-slate-700/50 rounded-lg p-4 border-l-4 border-blue-500">
            <div className="flex items-start space-x-2">
              <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-white mb-2">Explanation</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {isAnswered && (
          <div className="flex justify-end">
            <Button 
              onClick={handleNextQuestion}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Complete Quiz"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
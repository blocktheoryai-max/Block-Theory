import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Play, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetElement?: string; // CSS selector for the element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'hover' | 'scroll' | 'none';
  animation?: 'pulse' | 'bounce' | 'fade' | 'slide';
}

interface TutorialOverlayProps {
  steps: TutorialStep[];
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
  className?: string;
}

export function TutorialOverlay({ 
  steps, 
  isActive, 
  onComplete, 
  onSkip, 
  className 
}: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
      setCurrentStep(0);
    } else {
      setIsVisible(false);
      setHighlightedElement(null);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isVisible || currentStep >= steps.length) return;

    const step = steps[currentStep];
    if (step.targetElement) {
      const element = document.querySelector(step.targetElement);
      setHighlightedElement(element);

      // Scroll element into view with smooth behavior
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }
    } else {
      setHighlightedElement(null);
    }
  }, [currentStep, isVisible, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setHighlightedElement(null);
    onComplete();
  };

  const handleSkip = () => {
    setIsVisible(false);
    setHighlightedElement(null);
    onSkip();
  };

  if (!isVisible || steps.length === 0) return null;

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={cn("fixed inset-0 z-50", className)}>
      {/* Backdrop with spotlight effect */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-500">
        {highlightedElement && (
          <div
            className="absolute pointer-events-none transition-all duration-700 ease-out"
            style={{
              top: `${(highlightedElement as any).offsetTop - 8}px`,
              left: `${(highlightedElement as any).offsetLeft - 8}px`,
              width: `${(highlightedElement as any).offsetWidth + 16}px`,
              height: `${(highlightedElement as any).offsetHeight + 16}px`,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6), 0 0 20px rgba(59, 130, 246, 0.5)',
              borderRadius: '12px',
              background: 'transparent'
            }}
          />
        )}
      </div>

      {/* Tutorial card */}
      <div className={cn(
        "absolute bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 max-w-sm w-full mx-4",
        "transition-all duration-500 ease-out transform",
        currentStepData.position === 'center' ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" :
        currentStepData.position === 'top' ? "top-8 left-1/2 -translate-x-1/2" :
        currentStepData.position === 'bottom' ? "bottom-8 left-1/2 -translate-x-1/2" :
        currentStepData.position === 'left' ? "left-8 top-1/2 -translate-y-1/2" :
        currentStepData.position === 'right' ? "right-8 top-1/2 -translate-y-1/2" :
        "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        "animate-in slide-in-from-bottom-4 fade-in duration-500"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Tutorial {currentStep + 1} of {steps.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {currentStepData.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {currentStepData.description}
          </p>
        </div>

        {/* Action hint */}
        {currentStepData.action && currentStepData.action !== 'none' && (
          <div className={cn(
            "flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg",
            "animate-pulse"
          )}>
            {currentStepData.action === 'click' && "👆 Try clicking the highlighted element"}
            {currentStepData.action === 'hover' && "🖱️ Try hovering over the highlighted element"}
            {currentStepData.action === 'scroll' && "📜 Try scrolling to explore the content"}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <SkipForward className="w-4 h-4 mr-1" />
              Skip
            </Button>
            <Button
              onClick={handleNext}
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
              {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Animated pointer for highlighted elements */}
      {highlightedElement && currentStepData.animation && (
        <div
          className={cn(
            "absolute pointer-events-none transition-all duration-700",
            currentStepData.animation === 'pulse' && "animate-pulse",
            currentStepData.animation === 'bounce' && "animate-bounce",
            currentStepData.animation === 'fade' && "animate-pulse"
          )}
          style={{
            top: `${(highlightedElement as any).offsetTop + (highlightedElement as any).offsetHeight + 10}px`,
            left: `${(highlightedElement as any).offsetLeft + (highlightedElement as any).offsetWidth / 2 - 12}px`,
          }}
        >
          <div className="w-6 h-6 bg-blue-500 rounded-full shadow-lg flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-ping" />
          </div>
        </div>
      )}
    </div>
  );
}

// Hook for managing tutorial state
export function useTutorial() {
  const [isActive, setIsActive] = useState(false);
  const [completedTutorials, setCompletedTutorials] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tradetutor-completed-tutorials');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const startTutorial = () => setIsActive(true);
  
  const completeTutorial = (tutorialId: string) => {
    setIsActive(false);
    const updated = [...completedTutorials, tutorialId];
    setCompletedTutorials(updated);
    localStorage.setItem('tradetutor-completed-tutorials', JSON.stringify(updated));
  };

  const skipTutorial = (tutorialId: string) => {
    setIsActive(false);
    const updated = [...completedTutorials, `${tutorialId}-skipped`];
    setCompletedTutorials(updated);
    localStorage.setItem('tradetutor-completed-tutorials', JSON.stringify(updated));
  };

  const resetTutorials = () => {
    setCompletedTutorials([]);
    localStorage.removeItem('tradetutor-completed-tutorials');
  };

  const isTutorialCompleted = (tutorialId: string) => {
    return completedTutorials.includes(tutorialId) || completedTutorials.includes(`${tutorialId}-skipped`);
  };

  return {
    isActive,
    startTutorial,
    completeTutorial,
    skipTutorial,
    resetTutorials,
    isTutorialCompleted,
    completedTutorials
  };
}
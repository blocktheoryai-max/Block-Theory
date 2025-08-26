import { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Slide {
  id: number;
  title: string;
  content: string;
  keyPoints: string[];
  visualType?: 'diagram' | 'chart' | 'list' | 'comparison';
  icon?: string;
}

interface LessonSlideshowProps {
  lessonTitle: string;
  slides: Slide[];
  onComplete?: () => void;
}

export function LessonSlideshow({ lessonTitle, slides, onComplete }: LessonSlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSlides, setCompletedSlides] = useState<number[]>([]);

  const progress = ((currentSlide + 1) / slides.length) * 100;

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      const newSlide = currentSlide + 1;
      setCurrentSlide(newSlide);
      if (!completedSlides.includes(currentSlide)) {
        setCompletedSlides([...completedSlides, currentSlide]);
      }
    } else if (onComplete && !completedSlides.includes(currentSlide)) {
      setCompletedSlides([...completedSlides, currentSlide]);
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-play functionality
  useState(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        if (currentSlide < slides.length - 1) {
          nextSlide();
        } else {
          setIsPlaying(false);
        }
      }, 8000); // 8 seconds per slide
    }
    return () => clearInterval(interval);
  });

  const currentSlideData = slides[currentSlide];

  const renderSlideContent = (slide: Slide) => {
    switch (slide.visualType) {
      case 'comparison':
        return (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">Advantages</h4>
              <ul className="space-y-2">
                {slide.keyPoints.slice(0, Math.ceil(slide.keyPoints.length / 2)).map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-red-600">Considerations</h4>
              <ul className="space-y-2">
                {slide.keyPoints.slice(Math.ceil(slide.keyPoints.length / 2)).map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'diagram':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6">
              <div className="flex items-center justify-center space-x-4">
                {slide.keyPoints.map((point, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium">
                      {point}
                    </div>
                    {idx < slide.keyPoints.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-center text-sm text-gray-600 dark:text-gray-300">{slide.content}</p>
          </div>
        );

      case 'chart':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {slide.keyPoints.map((point, idx) => (
                <div key={idx} className="text-center">
                  <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2 text-lg font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-sm font-medium">{point}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-600 dark:text-gray-300">{slide.content}</p>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{slide.content}</p>
            <ul className="space-y-2">
              {slide.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6" data-testid="lesson-slideshow">
      {/* Progress and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" data-testid="slide-counter">
            Slide {currentSlide + 1} of {slides.length}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            data-testid="play-pause-button"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Auto-play'}
          </Button>
        </div>
        <Progress value={progress} className="flex-1 mx-4" data-testid="slideshow-progress" />
      </div>

      {/* Main Slide */}
      <Card className="min-h-[400px]" data-testid="slide-content">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl" data-testid="slide-title">{currentSlideData.title}</CardTitle>
            {currentSlideData.icon && (
              <span className="text-2xl">{currentSlideData.icon}</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderSlideContent(currentSlideData)}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={prevSlide} 
          disabled={currentSlide === 0}
          data-testid="prev-slide-button"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {/* Slide Indicators */}
        <div className="flex gap-2" data-testid="slide-indicators">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`w-3 h-3 rounded-full transition-colors ${
                idx === currentSlide 
                  ? 'bg-purple-600' 
                  : completedSlides.includes(idx)
                  ? 'bg-green-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              data-testid={`slide-indicator-${idx}`}
            />
          ))}
        </div>

        <Button 
          onClick={nextSlide}
          data-testid="next-slide-button"
        >
          {currentSlide === slides.length - 1 ? 'Complete' : 'Next'}
          {currentSlide < slides.length - 1 && <ChevronRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>

      {/* Lesson Overview */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Part of: <span className="font-medium">{lessonTitle}</span>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Play, 
  Lightbulb, 
  BookOpen, 
  Navigation,
  Sparkles
} from "lucide-react";
import NFTMarketplaceTour from "./nft-marketplace-tour";

interface TourLaunchButtonProps {
  variant?: "floating" | "embedded" | "header";
  className?: string;
}

export default function TourLaunchButton({ variant = "floating", className = "" }: TourLaunchButtonProps) {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);

  const handleStartTour = () => {
    setIsTourOpen(true);
  };

  const handleCloseTour = () => {
    setIsTourOpen(false);
  };

  const handleCompleteTour = () => {
    setHasCompletedTour(true);
    // Store completion status in localStorage
    localStorage.setItem('nft-marketplace-tour-completed', 'true');
  };

  // Check if user has completed tour before
  const checkTourCompletion = () => {
    const completed = localStorage.getItem('nft-marketplace-tour-completed');
    return completed === 'true';
  };

  // Different variants of the tour launch button
  if (variant === "floating") {
    return (
      <>
        <div className="fixed bottom-6 right-6 z-50">
          <Card className="shadow-lg border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <Button
                      onClick={handleStartTour}
                      size="lg"
                      className="bg-purple-600 hover:bg-purple-700 shadow-lg"
                      data-testid="button-start-nft-tour-floating"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Tour Guide
                    </Button>
                    {!checkTourCompletion() && (
                      <div className="absolute -top-2 -right-2">
                        <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-800">New to NFTs?</p>
                  <p className="text-gray-600">Take our interactive tour!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <NFTMarketplaceTour 
          isOpen={isTourOpen}
          onClose={handleCloseTour}
          onComplete={handleCompleteTour}
        />
      </>
    );
  }

  if (variant === "embedded") {
    return (
      <>
        <Card className={`border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 ${className}`}>
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Navigation className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  NFT Marketplace Guide
                </h3>
                <p className="text-gray-600 mb-4">
                  Learn how to navigate collections, understand prices, and explore NFTs safely
                </p>
                <Button
                  onClick={handleStartTour}
                  className="bg-purple-600 hover:bg-purple-700"
                  data-testid="button-start-nft-tour-embedded"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Interactive Tour
                </Button>
                {!checkTourCompletion() && (
                  <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
                    New!
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <NFTMarketplaceTour 
          isOpen={isTourOpen}
          onClose={handleCloseTour}
          onComplete={handleCompleteTour}
        />
      </>
    );
  }

  // Header variant
  return (
    <>
      <Button
        onClick={handleStartTour}
        variant="outline"
        size="sm"
        className={`border-purple-200 hover:bg-purple-50 ${className}`}
        data-testid="button-start-nft-tour-header"
      >
        <Lightbulb className="h-4 w-4 mr-2" />
        Tour Guide
        {!checkTourCompletion() && (
          <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800 text-xs">
            New
          </Badge>
        )}
      </Button>
      
      <NFTMarketplaceTour 
        isOpen={isTourOpen}
        onClose={handleCloseTour}
        onComplete={handleCompleteTour}
      />
    </>
  );
}
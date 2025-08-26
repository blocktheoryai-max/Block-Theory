import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Eye, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Award,
  ExternalLink,
  Lightbulb,
  CheckCircle,
  Info
} from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  content: string;
  tips: string[];
  position: "top" | "bottom" | "left" | "right";
  action?: string;
}

const tourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to the NFT Marketplace",
    description: "Discover, learn about, and explore top NFT collections with real market data",
    target: "page-nft-marketplace",
    content: "This marketplace showcases real NFT collections from 2025 including CryptoPunks, Bored Ape Yacht Club, Pudgy Penguins, and more. All data is live and connected to OpenSea.",
    tips: [
      "All collections show real floor prices and market data",
      "Click any collection to view it on OpenSea",
      "Verified collections have blue checkmarks"
    ],
    position: "bottom"
  },
  {
    id: "tabs",
    title: "Navigation Tabs",
    description: "Switch between Collections, Individual NFTs, and Your Collection",
    target: "tabs-collections",
    content: "Use these tabs to explore different aspects of the NFT marketplace. Collections show entire NFT projects, Assets show individual NFTs, and My NFTs shows your personal collection.",
    tips: [
      "Collections tab shows project overviews",
      "Assets tab shows individual NFTs for sale",
      "My NFTs requires wallet connection"
    ],
    position: "bottom"
  },
  {
    id: "filter",
    title: "Filter Options",
    description: "Sort collections by price, popularity, or recent activity",
    target: "select-sort-collections",
    content: "Filter collections to find exactly what you're looking for. Sort by floor price to find affordable options, or by volume to see the most active collections.",
    tips: [
      "Price Low to High finds affordable collections",
      "Volume sorts by trading activity",
      "Newest shows recently launched projects"
    ],
    position: "bottom"
  },
  {
    id: "collection-card",
    title: "Collection Cards",
    description: "Each card shows key metrics like floor price, volume, and owners",
    target: "card-collection-cryptopunks",
    content: "Collection cards display essential information including floor price (minimum price to buy), total trading volume, 24-hour price changes, and number of unique owners.",
    tips: [
      "Floor Price: Cheapest NFT in the collection",
      "Volume: Total ETH traded all-time",
      "24h Change: Price movement in last day",
      "Owners: Number of unique holders"
    ],
    position: "right"
  },
  {
    id: "opensea-link",
    title: "OpenSea Integration",
    description: "Direct links to view collections on OpenSea marketplace",
    target: "button-view-collection-cryptopunks",
    content: "Click 'View on OpenSea' to see the full collection, individual NFTs, trading history, and make purchases on the world's largest NFT marketplace.",
    tips: [
      "OpenSea shows detailed NFT information",
      "View transaction history and price charts",
      "Connect your wallet to buy NFTs",
      "Always verify collection authenticity"
    ],
    position: "top"
  },
  {
    id: "individual-nfts",
    title: "Individual NFT Assets",
    description: "Browse specific NFTs with prices and rarity information",
    target: "card-asset-cryptopunk-4207",
    content: "Individual NFT cards show specific tokens with their unique prices, rarity levels, traits, and direct links to view or purchase on OpenSea.",
    tips: [
      "Each NFT has unique traits and rarity",
      "Rarity affects price and desirability",
      "Traits are displayed as tags",
      "Click View to see full details on OpenSea"
    ],
    position: "left"
  },
  {
    id: "market-stats",
    title: "Market Statistics",
    description: "Real-time NFT market data and trends",
    target: "text-market-stats",
    content: "Stay informed with live market statistics including total market cap, daily trading volume, active collections, and trending projects.",
    tips: [
      "Market cap shows total NFT value",
      "Daily volume indicates market activity",
      "Track trending collections for opportunities",
      "High activity suggests strong community"
    ],
    position: "bottom"
  },
  {
    id: "safety-tips",
    title: "NFT Safety & Best Practices",
    description: "Important tips for safe NFT trading",
    target: "page-nft-marketplace",
    content: "Always verify collection authenticity, check contract addresses, understand gas fees, and only buy from reputable marketplaces like OpenSea.",
    tips: [
      "Verify blue checkmarks for authentic collections",
      "Double-check contract addresses",
      "Understand gas fees before purchasing",
      "Research project roadmaps and communities",
      "Never share your private keys or seed phrase"
    ],
    position: "bottom"
  }
];

interface NFTMarketplaceTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function NFTMarketplaceTour({ isOpen, onClose, onComplete }: NFTMarketplaceTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete();
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleSkip = () => {
    onClose();
  };

  const progress = ((currentStep + 1) / tourSteps.length) * 100;
  const step = tourSteps[currentStep];

  useEffect(() => {
    if (isOpen && step) {
      const targetElement = document.querySelector(`[data-testid="${step.target}"]`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStep, isOpen, step]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-nft-tour">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isCompleted ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                Tour Complete!
              </>
            ) : (
              <>
                <Lightbulb className="h-5 w-5 text-purple-500" />
                NFT Marketplace Tour
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isCompleted 
              ? "You've successfully completed the NFT marketplace tour! You're now ready to explore and understand NFT collections."
              : `Step ${currentStep + 1} of ${tourSteps.length}: ${step?.title}`
            }
          </DialogDescription>
        </DialogHeader>

        {!isCompleted && (
          <>
            <div className="space-y-4">
              <Progress value={progress} className="h-2" />
              
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Info className="h-5 w-5 text-purple-600" />
                    {step?.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {step?.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-700">{step?.content}</p>
                  
                  {step?.tips && step.tips.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-purple-700 flex items-center gap-1">
                        <Lightbulb className="h-4 w-4" />
                        Pro Tips:
                      </h4>
                      <ul className="space-y-1">
                        {step.tips.map((tip, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-purple-500 mt-1">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {step?.action && (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Try: {step.action}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleSkip}
                  data-testid="button-skip-tour"
                >
                  Skip Tour
                </Button>
                {currentStep > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={handlePrevious}
                    data-testid="button-previous-step"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {currentStep + 1} of {tourSteps.length}
                </span>
                <Button 
                  onClick={handleNext}
                  className="bg-purple-600 hover:bg-purple-700"
                  data-testid="button-next-step"
                >
                  {currentStep === tourSteps.length - 1 ? (
                    <>
                      Complete Tour
                      <CheckCircle className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}

        {isCompleted && (
          <div className="text-center space-y-4">
            <div className="text-6xl">🎉</div>
            <p className="text-gray-600">
              You're now equipped with the knowledge to navigate the NFT marketplace safely and effectively!
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-medium text-green-800">What You Learned</h4>
                <ul className="text-green-700 space-y-1 mt-2">
                  <li>• How to read collection metrics</li>
                  <li>• Understanding floor prices</li>
                  <li>• OpenSea integration</li>
                  <li>• Safety best practices</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium text-blue-800">Next Steps</h4>
                <ul className="text-blue-700 space-y-1 mt-2">
                  <li>• Explore collections</li>
                  <li>• Check OpenSea links</li>
                  <li>• Research communities</li>
                  <li>• Start your collection</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
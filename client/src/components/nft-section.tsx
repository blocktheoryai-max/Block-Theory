import { Palette, TrendingUp, Users, Award, ShoppingCart, Eye, Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function NftSection() {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  // Mock NFT data for demonstration
  const nftLessons = [
    {
      id: "nft-1",
      title: "What are NFTs?",
      description: "Understanding Non-Fungible Tokens and blockchain ownership",
      duration: 12,
      level: "Beginner",
      progress: 100,
      completed: true,
    },
    {
      id: "nft-2", 
      title: "NFT Marketplaces",
      description: "Navigate OpenSea, Foundation, and other major platforms",
      duration: 18,
      level: "Beginner",
      progress: 75,
      completed: false,
    },
    {
      id: "nft-3",
      title: "Digital Art Investment",
      description: "Evaluating NFT projects for investment potential",
      duration: 25,
      level: "Intermediate",
      progress: 0,
      completed: false,
    },
  ];

  // Fetch real NFT data from API
  const { data: nftCollections = [], isLoading: collectionsLoading } = useQuery({
    queryKey: ["/api/nft/collections"],
  });

  const { data: nftAssets = [], isLoading: assetsLoading } = useQuery({
    queryKey: ["/api/nft/assets"],
  });

  const { data: nftAnalytics } = useQuery({
    queryKey: ["/api/nft/analytics"],
  });

  // Use real data instead of mock data
  const actualCollections = Array.isArray(nftCollections) ? nftCollections.slice(0, 3) : [];
  const actualAssets = Array.isArray(nftAssets) ? nftAssets.slice(0, 2) : [];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'bg-slate-100 text-slate-800';
      case 'Rare': return 'bg-blue-100 text-blue-800';
      case 'Epic': return 'bg-purple-100 text-purple-800';
      case 'Legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section id="nft" className="py-20 bg-gradient-to-br from-yellow-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 flex items-center justify-center">
            <Palette className="text-primary mr-3 h-10 w-10" />
            NFT Academy & Marketplace
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Learn about NFTs and practice trading digital assets in our risk-free simulation environment
          </p>
        </div>

        <Tabs defaultValue="learn" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="learn">Learn NFTs</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="portfolio">My Collection</TabsTrigger>
          </TabsList>

          {/* Learn Tab */}
          <TabsContent value="learn" className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-slate-900 mb-6">NFT Learning Path</h3>
              
              {/* Progress Overview */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-slate-900">Your NFT Journey</h4>
                  <Badge className="bg-purple-100 text-purple-800">2/3 Completed</Badge>
                </div>
                <Progress value={66} className="h-3 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">67%</div>
                    <div className="text-sm text-slate-600">Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">45</div>
                    <div className="text-sm text-slate-600">Minutes Learned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">2</div>
                    <div className="text-sm text-slate-600">Certificates</div>
                  </div>
                </div>
              </div>

              {/* Lesson Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nftLessons.map((lesson) => (
                  <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`text-xs font-semibold ${getLevelColor(lesson.level)}`}>
                          {lesson.level}
                        </Badge>
                        {lesson.completed ? (
                          <Award className="h-5 w-5 text-green-600" />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-slate-200" />
                        )}
                      </div>
                      <CardTitle className="text-lg">{lesson.title}</CardTitle>
                      <CardDescription>{lesson.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">{lesson.duration} min</span>
                          <span className="text-slate-600">{lesson.progress}%</span>
                        </div>
                        <Progress value={lesson.progress} className="h-2" />
                        <Button 
                          className="w-full" 
                          variant={lesson.completed ? "outline" : "default"}
                        >
                          {lesson.completed ? "Review" : lesson.progress > 0 ? "Continue" : "Start"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-semibold text-slate-900">Featured Collections</h3>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {actualCollections.map((collection: any) => (
                      <Card key={collection.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="aspect-square rounded-lg overflow-hidden mb-4">
                            <img 
                              src={collection.imageUrl} 
                              alt={collection.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h4 className="font-semibold text-slate-900 mb-2">{collection.name}</h4>
                          <p className="text-sm text-slate-600 mb-4">{collection.description}</p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-500">Floor</span>
                              <span className="font-semibold">{collection.floorPrice} ETH</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-500">24h</span>
                              <span className={`font-medium text-sm ${
                                collection.change24h.startsWith('+') ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {collection.change24h}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-500">Owners</span>
                              <span className="text-sm font-medium">{collection.owners.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Button asChild size="sm" variant="outline">
                              <a href={collection.openseaUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View on OpenSea
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">Trending NFTs</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {actualAssets.map((asset: any) => (
                        <Card key={asset.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex space-x-4">
                              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                <img 
                                  src={asset.imageUrl} 
                                  alt={asset.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-semibold text-slate-900">{asset.name}</h5>
                                  <Badge className={`text-xs ${getRarityColor(asset.rarity)}`}>
                                    {asset.rarity}
                                  </Badge>
                                </div>
                                <p className="text-sm text-slate-600 mb-2">{asset.collection}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-bold text-slate-900">{asset.price} ETH</span>
                                  <Button size="sm" asChild className="bg-purple-600 hover:bg-purple-700">
                                    <a href={asset.openseaUrl} target="_blank" rel="noopener noreferrer">
                                      <Eye className="w-4 h-4 mr-1" />
                                      View
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Stats Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Market Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Total Volume</span>
                      <span className="font-bold text-slate-900">2,847 ETH</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Active Traders</span>
                      <span className="font-bold text-slate-900">8,429</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Collections</span>
                      <span className="font-bold text-slate-900">156</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Avg. Sale</span>
                      <span className="font-bold text-green-600">1.2 ETH</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Wallet</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">ETH Balance</span>
                      <span className="font-bold text-slate-900">12.5 ETH</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">NFTs Owned</span>
                      <span className="font-bold text-slate-900">7</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Portfolio Value</span>
                      <span className="font-bold text-purple-600">18.9 ETH</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center py-12">
                <Palette className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Your NFT Collection</h3>
                <p className="text-slate-600 mb-6">
                  Start building your digital art collection by purchasing NFTs from the marketplace
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Browse Marketplace
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, TrendingUp, TrendingDown, Eye, Heart, ShoppingCart } from "lucide-react";
import type { NftCollection, NftAsset } from "@shared/schema";

export default function NftMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("floor-price");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch NFT collections
  const { data: collections = [], isLoading: collectionsLoading } = useQuery({
    queryKey: ["/api/nft/collections"],
  });

  // Fetch NFT assets
  const { data: assets = [], isLoading: assetsLoading } = useQuery({
    queryKey: ["/api/nft/assets"],
  });

  const mockCollections = [
    {
      id: "1",
      name: "CyberPunks 2024",
      description: "Futuristic digital art collection",
      floorPrice: "2.4",
      totalVolume: "1240.5",
      change24h: "+15.2",
      owners: 1247,
      totalSupply: 10000,
      imageUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZjAwZmYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMGZmZmYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNhKSIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q1A8L3RleHQ+PC9zdmc+"
    },
    {
      id: "2",
      name: "Digital Dreamscapes",
      description: "Abstract art from emerging artists",
      floorPrice: "0.8",
      totalVolume: "450.2",
      change24h: "-3.1",
      owners: 892,
      totalSupply: 5000,
      imageUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwMGZmMDAiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmZmZmMDAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNiKSIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+REQ8L3RleHQ+PC9zdmc+"
    },
    {
      id: "3",
      name: "Crypto Kitties Reborn",
      description: "Next generation collectible cats",
      floorPrice: "1.2",
      totalVolume: "890.7",
      change24h: "+8.7",
      owners: 2103,
      totalSupply: 15000,
      imageUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImMiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZjZkMDAiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmZjAwOTAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNjKSIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q0s8L3RleHQ+PC9zdmc+"
    }
  ];

  const mockAssets = [
    {
      id: "1",
      name: "CyberPunk #1234",
      description: "Rare neon warrior with lightning eyes",
      price: "2.5",
      rarity: "Legendary",
      collection: "CyberPunks 2024",
      imageUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZjAwZmYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMGZmZmYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNhKSIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+IzEyMzQ8L3RleHQ+PC9zdmc+"
    },
    {
      id: "2", 
      name: "Dreamscape #0567",
      description: "Ethereal landscape with floating islands",
      price: "0.9",
      rarity: "Rare",
      collection: "Digital Dreamscapes",
      imageUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwMGZmMDAiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmZmZmMDAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNiKSIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+IzA1Njc8L3RleHQ+PC9zdmc+"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8" data-testid="page-nft-marketplace">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">NFT Marketplace</h1>
        <p className="text-muted-foreground">Discover, collect, and trade unique digital assets</p>
      </div>

      <Tabs defaultValue="collections" className="space-y-6">
        <TabsList>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="assets">Individual NFTs</TabsTrigger>
          <TabsTrigger value="my-nfts">My NFTs</TabsTrigger>
        </TabsList>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search collections or assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-nfts"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="art">Art</SelectItem>
              <SelectItem value="collectibles">Collectibles</SelectItem>
              <SelectItem value="gaming">Gaming</SelectItem>
              <SelectItem value="utility">Utility</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="floor-price">Floor Price</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
              <SelectItem value="change">24h Change</SelectItem>
              <SelectItem value="owners">Owners</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="collections" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCollections.map((collection) => (
              <Card key={collection.id} className="group hover:shadow-lg transition-all duration-300" data-testid={`card-collection-${collection.id}`}>
                <CardHeader className="p-0">
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    <img
                      src={collection.imageUrl}
                      alt={collection.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Button size="sm" variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{collection.name}</h3>
                    <Badge variant={parseFloat(collection.change24h) > 0 ? "default" : "destructive"}>
                      {parseFloat(collection.change24h) > 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {collection.change24h}%
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{collection.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Floor Price</span>
                      <p className="font-semibold">{collection.floorPrice} ETH</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Volume</span>
                      <p className="font-semibold">{collection.totalVolume} ETH</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Owners</span>
                      <p className="font-semibold">{collection.owners.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Items</span>
                      <p className="font-semibold">{collection.totalSupply.toLocaleString()}</p>
                    </div>
                  </div>
                  <Button className="w-full mt-4" data-testid={`button-view-collection-${collection.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Collection
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assets" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockAssets.map((asset) => (
              <Card key={asset.id} className="group hover:shadow-lg transition-all duration-300" data-testid={`card-asset-${asset.id}`}>
                <CardHeader className="p-0">
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    <img
                      src={asset.imageUrl}
                      alt={asset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Button size="sm" variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <Badge variant="secondary">{asset.rarity}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{asset.name}</h3>
                  <p className="text-muted-foreground text-xs mb-2">{asset.collection}</p>
                  <p className="text-sm text-muted-foreground mb-4">{asset.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground">Price</span>
                      <p className="font-semibold">{asset.price} ETH</p>
                    </div>
                    <Button size="sm" data-testid={`button-buy-asset-${asset.id}`}>
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Buy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-nfts">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No NFTs Found</h3>
            <p className="text-muted-foreground mb-6">You don't own any NFTs yet. Start exploring the marketplace!</p>
            <Button data-testid="button-explore-marketplace">
              <Search className="h-4 w-4 mr-2" />
              Explore Marketplace
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
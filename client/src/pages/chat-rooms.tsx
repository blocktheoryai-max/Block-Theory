import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  Users, 
  Hash, 
  TrendingUp, 
  Activity,
  Zap,
  Search,
  UserPlus,
  Circle
} from "lucide-react";
import CommunityChat from "@/components/community-chat";

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  type: string;
  coinSymbol?: string;
  memberCount: number;
  isActive: boolean;
  isOnline?: boolean;
}

export default function ChatRooms() {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Mock chat rooms data (replace with real API call)
  const mockRooms: ChatRoom[] = [
    {
      id: "1",
      name: "General Discussion",
      description: "General crypto and trading discussions",
      type: "general",
      memberCount: 1543,
      isActive: true,
      isOnline: true
    },
    {
      id: "2", 
      name: "Bitcoin Chat",
      description: "All things Bitcoin",
      type: "coin-specific",
      coinSymbol: "BTC",
      memberCount: 892,
      isActive: true,
      isOnline: true
    },
    {
      id: "3",
      name: "Ethereum Hub",
      description: "Ethereum, DeFi, and smart contracts",
      type: "coin-specific", 
      coinSymbol: "ETH",
      memberCount: 734,
      isActive: true,
      isOnline: true
    },
    {
      id: "4",
      name: "Technical Analysis",
      description: "Chart analysis and trading strategies",
      type: "technical-analysis",
      memberCount: 456,
      isActive: true,
      isOnline: true
    },
    {
      id: "5",
      name: "Trading Signals",
      description: "Real-time trading signals and alerts",
      type: "trading-signals",
      memberCount: 321,
      isActive: true,
      isOnline: true
    },
    {
      id: "6",
      name: "Solana Community",
      description: "SOL ecosystem discussions",
      type: "coin-specific",
      coinSymbol: "SOL",
      memberCount: 289,
      isActive: true,
      isOnline: false
    },
    {
      id: "7",
      name: "DeFi Discussions",
      description: "Decentralized finance protocols and yields",
      type: "general",
      memberCount: 567,
      isActive: true,
      isOnline: true
    },
    {
      id: "8",
      name: "NFT Collectors",
      description: "NFT trading and collection strategies",
      type: "general",
      memberCount: 234,
      isActive: true,
      isOnline: false
    }
  ];

  const filteredRooms = mockRooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || room.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getRoomIcon = (type: string) => {
    switch (type) {
      case "general":
        return Hash;
      case "coin-specific":
        return TrendingUp;
      case "technical-analysis":
        return Activity;
      case "trading-signals":
        return Zap;
      default:
        return MessageCircle;
    }
  };

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case "general":
        return "bg-blue-500";
      case "coin-specific":
        return "bg-green-500";
      case "technical-analysis":
        return "bg-purple-500";
      case "trading-signals":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8" data-testid="page-chat-rooms">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community Chat Rooms</h1>
        <p className="text-muted-foreground">Connect with fellow traders and crypto enthusiasts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Rooms List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Chat Rooms
              </CardTitle>
              
              {/* Search and Filter */}
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search rooms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-rooms"
                  />
                </div>
                
                <Tabs value={activeFilter} onValueChange={setActiveFilter}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                    <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
                  </TabsList>
                  <TabsList className="grid w-full grid-cols-2 mt-2">
                    <TabsTrigger value="coin-specific" className="text-xs">Coins</TabsTrigger>
                    <TabsTrigger value="trading-signals" className="text-xs">Signals</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="space-y-1 p-4">
                  {filteredRooms.map((room) => {
                    const Icon = getRoomIcon(room.type);
                    const isSelected = selectedRoom?.id === room.id;
                    
                    return (
                      <Button
                        key={room.id}
                        variant={isSelected ? "secondary" : "ghost"}
                        className="w-full justify-start p-3 h-auto"
                        onClick={() => setSelectedRoom(room)}
                        data-testid={`button-room-${room.id}`}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className={`w-8 h-8 rounded-lg ${getRoomTypeColor(room.type)} flex items-center justify-center flex-shrink-0`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{room.name}</span>
                              {room.isOnline && (
                                <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {room.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {room.memberCount.toLocaleString()} members
                              </span>
                              {room.coinSymbol && (
                                <Badge variant="outline" className="text-xs px-1 py-0">
                                  {room.coinSymbol}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2">
          {selectedRoom ? (
            <Card className="h-[700px] flex flex-col">
              <CardHeader className="flex-shrink-0 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${getRoomTypeColor(selectedRoom.type)} flex items-center justify-center`}>
                      {React.createElement(getRoomIcon(selectedRoom.type), { className: "h-5 w-5 text-white" })}
                    </div>
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        {selectedRoom.name}
                        {selectedRoom.isOnline && (
                          <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedRoom.memberCount.toLocaleString()} members • {selectedRoom.description}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" data-testid="button-join-room">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Join Room
                  </Button>
                </div>
              </CardHeader>
              
              <div className="flex-1 overflow-hidden">
                <CommunityChat selectedCoin={selectedRoom.coinSymbol} />
              </div>
            </Card>
          ) : (
            <Card className="h-[700px] flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Select a Chat Room</h3>
                <p className="text-muted-foreground">Choose a room from the list to start chatting</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
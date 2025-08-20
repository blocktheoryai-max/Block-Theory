import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Users, TrendingUp, Hash, Send, Filter } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { ChatRoom, ChatMessage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface CommunityChatProps {
  selectedCoin?: string;
}

export default function CommunityChat({ selectedCoin }: CommunityChatProps) {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [roomFilter, setRoomFilter] = useState<"all" | "general" | "coin-specific" | "technical-analysis" | "trading-signals">("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch chat rooms
  const { data: chatRooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ["/api/chat/rooms", roomFilter],
    queryFn: () => fetch(`/api/chat/rooms${roomFilter !== "all" ? `?type=${roomFilter}` : ""}`).then(res => res.json())
  });

  // Fetch messages for selected room
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/chat/rooms", selectedRoom?.id, "messages"],
    queryFn: () => selectedRoom ? fetch(`/api/chat/rooms/${selectedRoom.id}/messages`).then(res => res.json()) : [],
    enabled: !!selectedRoom
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => {
      if (!selectedRoom) throw new Error("No room selected");
      return apiRequest(`/api/chat/rooms/${selectedRoom.id}/messages`, {
        method: "POST",
        body: JSON.stringify({ content })
      });
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/chat/rooms", selectedRoom?.id, "messages"] });
    }
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-select coin-specific room if selectedCoin is provided
  useEffect(() => {
    if (selectedCoin && chatRooms.length > 0) {
      const coinRoom = chatRooms.find((room: ChatRoom) => 
        room.type === "coin-specific" && room.coinSymbol === selectedCoin
      );
      if (coinRoom && !selectedRoom) {
        setSelectedRoom(coinRoom);
      }
    }
  }, [selectedCoin, chatRooms, selectedRoom]);

  // Select first room by default
  useEffect(() => {
    if (chatRooms.length > 0 && !selectedRoom) {
      setSelectedRoom(chatRooms[0]);
    }
  }, [chatRooms, selectedRoom]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate(newMessage.trim());
    }
  };

  const getRoomIcon = (room: ChatRoom) => {
    switch (room.type) {
      case "coin-specific":
        return "₿";
      case "technical-analysis":
        return "📊";
      case "trading-signals":
        return "🚨";
      default:
        return "💬";
    }
  };

  const getRoomBadgeColor = (room: ChatRoom) => {
    switch (room.type) {
      case "coin-specific":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "technical-analysis":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "trading-signals":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (roomsLoading) {
    return (
      <Card className="h-[600px]">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Community Chat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-slate-500">Loading chat rooms...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
      {/* Chat Rooms Sidebar */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Chat Rooms
            </div>
            <Badge variant="outline" className="text-xs">
              {chatRooms.length}
            </Badge>
          </CardTitle>

          {/* Room Filter Tabs */}
          <Tabs value={roomFilter} onValueChange={(value: any) => setRoomFilter(value)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 text-xs">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="coin-specific" className="text-xs">Coins</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[500px] px-4">
            <div className="space-y-2">
              {chatRooms.map((room: ChatRoom) => (
                <div
                  key={room.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedRoom?.id === room.id
                      ? "bg-primary/10 border-2 border-primary/20"
                      : "bg-slate-50 hover:bg-slate-100 border-2 border-transparent"
                  }`}
                  onClick={() => setSelectedRoom(room)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getRoomIcon(room)}</span>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{room.name}</span>
                        {room.coinSymbol && (
                          <Badge variant="outline" className={`text-xs mt-1 w-fit ${getRoomBadgeColor(room)}`}>
                            {room.coinSymbol}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-600 mb-2 line-clamp-2">
                    {room.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {room.memberCount.toLocaleString()}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {room.type.replace("-", " ")}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Messages Area */}
      <Card className="lg:col-span-2">
        {selectedRoom ? (
          <>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-xl mr-3">{getRoomIcon(selectedRoom)}</span>
                  <div>
                    <CardTitle className="text-lg">{selectedRoom.name}</CardTitle>
                    <p className="text-sm text-slate-600">{selectedRoom.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedRoom.coinSymbol && (
                    <Badge className={getRoomBadgeColor(selectedRoom)}>
                      {selectedRoom.coinSymbol}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    {selectedRoom.memberCount.toLocaleString()}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="p-0 flex flex-col h-[550px]">
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-slate-500 py-8">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message: ChatMessage) => (
                      <div key={message.id} className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">
                              {message.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-slate-900">
                              {message.username}
                            </span>
                            <span className="text-xs text-slate-500">
                              {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                            </span>
                            {message.isEdited && (
                              <Badge variant="outline" className="text-xs">
                                edited
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-700 break-words">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t bg-slate-50 p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Message ${selectedRoom.name}...`}
                    className="flex-1"
                    disabled={sendMessageMutation.isPending}
                  />
                  <Button 
                    type="submit" 
                    disabled={!newMessage.trim() || sendMessageMutation.isPending}
                    className="px-3"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">Select a chat room to start messaging</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
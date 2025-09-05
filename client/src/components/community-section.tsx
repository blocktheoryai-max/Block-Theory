import { Users, MessageSquare, Heart, Eye, Plus, Crown, Medal, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CommunitySection() {
  const { data: forumPosts } = useQuery({
    queryKey: ['/api/forum']
  });

  // Get active community users from API
  const { data: activeUsers = [] } = useQuery<any[]>({
    queryKey: ['/api/community/active-users'],
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Get recent chat messages from API
  const { data: recentMessages = [] } = useQuery<any[]>({
    queryKey: ['/api/community/recent-messages'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fallback data for when API is unavailable
  const fallbackUsers = [
    { name: "Community Expert", posts: 342, avatar: "CE", badge: "Expert", icon: Crown },
    { name: "Market Analyst", posts: 287, avatar: "MA", badge: "Advanced", icon: Medal },
    { name: "Crypto Enthusiast", posts: 198, avatar: "CE", badge: "Intermediate", icon: Medal },
  ];

  const fallbackMessages = [
    { user: "Trader", message: "Great educational content on DeFi!", time: "2 min ago" },
    { user: "Learner", message: "The NFT marketplace tour was very helpful", time: "1 min ago" },
  ];

  const displayUsers = activeUsers.length > 0 ? activeUsers : fallbackUsers;
  const displayMessages = recentMessages.length > 0 ? recentMessages : fallbackMessages;

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-primary/10 text-primary';
      case 'Advanced': return 'bg-secondary/10 text-secondary';
      case 'Intermediate': return 'bg-accent/10 text-accent';
      default: return 'bg-slate/10 text-slate';
    }
  };

  return (
    <section id="community" className="py-20 bg-gradient-to-br from-yellow-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 flex items-center justify-center">
            <Users className="text-primary mr-3 h-10 w-10" />
            Community
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Join discussions, share strategies, and learn from fellow traders in our vibrant community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Forum Discussions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-slate-900">Latest Discussions</h3>
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  New Post
                </Button>
              </div>

              <div className="space-y-4">
                {Array.isArray(forumPosts) && forumPosts.length > 0 ? forumPosts.map((post: any) => (
                  <div key={post.id} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-white">
                          {post.userId.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-slate-900">User_{post.userId.slice(-4)}</h4>
                          <Badge className="bg-primary/10 text-primary text-xs">Expert</Badge>
                          <span className="text-sm text-slate-500">
                            {formatTimeAgo(new Date(post.createdAt))}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{post.title}</h3>
                        <p className="text-slate-600 mb-4">{post.content}</p>
                        <div className="flex items-center space-x-6 text-sm text-slate-500">
                          <span className="flex items-center">
                            <MessageSquare className="mr-1 h-4 w-4" />
                            {post.replies} replies
                          </span>
                          <span className="flex items-center">
                            <Heart className="mr-1 h-4 w-4" />
                            {post.likes} likes
                          </span>
                          <span className="flex items-center">
                            <Eye className="mr-1 h-4 w-4" />
                            {post.views} views
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  // Default posts when no forum posts exist
                  <>
                    <div className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-white">CT</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-slate-900">CryptoTrader_2024</h4>
                            <Badge className="bg-primary/10 text-primary text-xs">Expert</Badge>
                            <span className="text-sm text-slate-500">2 hours ago</span>
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">Bitcoin's Next Move: Technical Analysis</h3>
                          <p className="text-slate-600 mb-4">Based on the recent price action and volume analysis, I'm seeing some interesting patterns forming. The 4-hour RSI is showing...</p>
                          <div className="flex items-center space-x-6 text-sm text-slate-500">
                            <span className="flex items-center">
                              <MessageSquare className="mr-1 h-4 w-4" />
                              23 replies
                            </span>
                            <span className="flex items-center">
                              <Heart className="mr-1 h-4 w-4" />
                              45 likes
                            </span>
                            <span className="flex items-center">
                              <Eye className="mr-1 h-4 w-4" />
                              234 views
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarFallback className="bg-secondary text-white">DE</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-slate-900">DeFiExplorer</h4>
                            <Badge className="bg-secondary/10 text-secondary text-xs">Advanced</Badge>
                            <span className="text-sm text-slate-500">5 hours ago</span>
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">Risk Management in Volatile Markets</h3>
                          <p className="text-slate-600 mb-4">Just wanted to share some insights on position sizing during high volatility periods. The key is to...</p>
                          <div className="flex items-center space-x-6 text-sm text-slate-500">
                            <span className="flex items-center">
                              <MessageSquare className="mr-1 h-4 w-4" />
                              18 replies
                            </span>
                            <span className="flex items-center">
                              <Heart className="mr-1 h-4 w-4" />
                              67 likes
                            </span>
                            <span className="flex items-center">
                              <Eye className="mr-1 h-4 w-4" />
                              189 views
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Community Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Community Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Active Members</span>
                  <span className="font-bold text-slate-900">12,847</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Posts Today</span>
                  <span className="font-bold text-slate-900">234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Online Now</span>
                  <span className="font-bold text-success">1,247</span>
                </div>
              </div>
            </div>

            {/* Top Contributors */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Top Contributors</h3>
              <div className="space-y-4">
                {displayUsers.map((user: any, index: number) => {
                  const IconComponent = user.icon;
                  return (
                    <div key={user.name} className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-white">{user.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">{user.name}</div>
                        <div className="text-sm text-slate-500">{user.posts} helpful posts</div>
                      </div>
                      <IconComponent className={`h-5 w-5 ${
                        index === 0 ? 'text-warning' : 
                        index === 1 ? 'text-slate-400' : 
                        'text-amber-600'
                      }`} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Chat */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Live Chat</h3>
              <div className="bg-slate-50 rounded-lg p-4 h-48 overflow-y-auto mb-4">
                {displayMessages.map((msg: any, index: number) => (
                  <div key={index} className="mb-3">
                    <div className="text-sm">
                      <span className="font-semibold text-primary">{msg.user}:</span>
                      <span className="text-slate-600 ml-2">{msg.message}</span>
                    </div>
                    <div className="text-xs text-slate-400">{msg.time}</div>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Type a message..." 
                  className="flex-1"
                />
                <Button className="bg-primary hover:bg-primary/90" size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  MessageSquare, 
  ArrowLeft,
  Send,
  Heart,
  Reply,
  TrendingUp,
  Trophy,
  Star,
  Clock,
  ThumbsUp,
  Eye
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Link } from "wouter";

interface ForumPost {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  replies: number;
  views: number;
  timestamp: string;
  author: {
    name: string;
    avatar?: string;
    tier: string;
    reputation: number;
  };
  tags: string[];
  isLiked: boolean;
  isPinned: boolean;
}

export default function Community() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("general");
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["/api/forum"],
  });

  const createPost = useMutation({
    mutationFn: async ({ title, content, category }: {
      title: string;
      content: string;
      category: string;
    }) => {
      return apiRequest("POST", "/api/forum", {
        title,
        content,
        category,
      });
    },
    onSuccess: () => {
      toast({
        title: "Post Created!",
        description: "Your post has been published to the community.",
      });
      setNewPostTitle("");
      setNewPostContent("");
      setShowNewPostForm(false);
      queryClient.invalidateQueries({ queryKey: ["/api/forum"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Please Login",
          description: "You need to login to create posts.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1000);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    },
  });

  const categories = [
    { value: "all", label: "All Posts", count: posts.length },
    { value: "general", label: "General Discussion", count: posts.filter((p: ForumPost) => p.category === "general").length },
    { value: "trading", label: "Trading Strategies", count: posts.filter((p: ForumPost) => p.category === "trading").length },
    { value: "technical", label: "Technical Analysis", count: posts.filter((p: ForumPost) => p.category === "technical").length },
    { value: "news", label: "Market News", count: posts.filter((p: ForumPost) => p.category === "news").length },
    { value: "help", label: "Help & Support", count: posts.filter((p: ForumPost) => p.category === "help").length },
  ];

  const filteredPosts = selectedCategory === "all" 
    ? posts 
    : posts.filter((post: ForumPost) => post.category === selectedCategory);

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and content for your post.",
        variant: "destructive",
      });
      return;
    }

    createPost.mutate({
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory,
    });
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "basic": return "text-blue-600";
      case "pro": return "text-purple-600";
      case "elite": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "basic": return <Star className="h-3 w-3" />;
      case "pro": return <TrendingUp className="h-3 w-3" />;
      case "elite": return <Trophy className="h-3 w-3" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Trading Community
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Connect with traders, share strategies, and learn from the community
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {isAuthenticated && (
                <Button onClick={() => setShowNewPostForm(!showNewPostForm)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              )}
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                      selectedCategory === category.value
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-sm">{category.label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Posts</span>
                  <span className="font-semibold">{posts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Members</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Online Now</span>
                  <span className="font-semibold">89</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* New Post Form */}
            {showNewPostForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Create New Post</CardTitle>
                  <CardDescription>Share your thoughts with the trading community</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="postTitle">Title</Label>
                    <Input
                      id="postTitle"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      placeholder="What's your post about?"
                      disabled={createPost.isPending}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="postCategory">Category</Label>
                    <select
                      id="postCategory"
                      value={newPostCategory}
                      onChange={(e) => setNewPostCategory(e.target.value)}
                      className="w-full p-2 border rounded-md bg-background"
                      disabled={createPost.isPending}
                    >
                      <option value="general">General Discussion</option>
                      <option value="trading">Trading Strategies</option>
                      <option value="technical">Technical Analysis</option>
                      <option value="news">Market News</option>
                      <option value="help">Help & Support</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="postContent">Content</Label>
                    <Textarea
                      id="postContent"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="Share your insights, questions, or experiences..."
                      rows={6}
                      disabled={createPost.isPending}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowNewPostForm(false)}
                      disabled={createPost.isPending}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreatePost}
                      disabled={createPost.isPending}
                    >
                      {createPost.isPending ? "Publishing..." : "Publish Post"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts List */}
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Be the first to start a discussion in this category!
                    </p>
                    {isAuthenticated && (
                      <Button onClick={() => setShowNewPostForm(true)}>
                        Create First Post
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                filteredPosts.map((post: ForumPost) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>
                            {post.author.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-lg">{post.title}</h3>
                                {post.isPinned && (
                                  <Badge variant="secondary" className="text-xs">
                                    Pinned
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                <span className="font-medium">{post.author.name}</span>
                                <div className={`flex items-center space-x-1 ${getTierColor(post.author.tier)}`}>
                                  {getTierIcon(post.author.tier)}
                                  <span className="capitalize">{post.author.tier}</span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatTimeAgo(post.timestamp)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <Badge variant="outline" className="capitalize">
                              {post.category}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
                            {post.content}
                          </p>
                          
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {post.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center space-x-1">
                                <ThumbsUp className="h-4 w-4" />
                                <span>{post.likes}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Reply className="h-4 w-4" />
                                <span>{post.replies}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Eye className="h-4 w-4" />
                                <span>{post.views}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="ghost">
                                <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                                Like
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Reply className="h-4 w-4 mr-1" />
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
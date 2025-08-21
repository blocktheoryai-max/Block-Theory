import { Link } from "wouter";
import { ChainHeader } from "@/components/ChainHeader";
import { LiveMarketData } from "@/components/LiveMarketData";
import { WhaleActivity } from "@/components/WhaleActivity";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowUpRight,
  Users,
  BarChart3,
  Wallet,
  CreditCard,
  ExternalLink,
  BookOpen,
  Target,
  Globe,
  Coins,
  Activity,
  Crown,
  Lock,
  CheckCircle,
  PlayCircle
} from "lucide-react";

export default function Dashboard() {

  const platforms = [
    {
      title: "Crypto Payments",
      description: "Accept crypto payments for your business",
      icon: CreditCard,
      color: "from-green-500 to-emerald-600",
      features: ["Multiple cryptocurrencies", "Instant settlements", "Low fees", "Global reach"]
    },
    {
      title: "Market Dashboard",
      description: "Real-time crypto market analytics",
      icon: BarChart3,
      color: "from-blue-500 to-cyan-600",
      features: ["Live price feeds", "Technical analysis", "Portfolio tracking", "Market alerts"]
    },
    {
      title: "DeFi Explorer",
      description: "Explore decentralized finance protocols",
      icon: Coins,
      color: "from-purple-500 to-violet-600",
      features: ["Yield farming", "Liquidity pools", "Protocol analytics", "Risk assessment"]
    },
    {
      title: "NFT Marketplace",
      description: "Discover and trade digital collectibles",
      icon: Wallet,
      color: "from-pink-500 to-rose-600",
      features: ["Curated collections", "Creator tools", "Auction system", "Rarity analytics"]
    }
  ];

  const externalResources = [
    { name: "CoinGecko", description: "Market data & analytics", url: "https://coingecko.com" },
    { name: "DeFiPulse", description: "DeFi protocol rankings", url: "https://defipulse.com" },
    { name: "Etherscan", description: "Ethereum blockchain explorer", url: "https://etherscan.io" },
    { name: "CoinDesk", description: "Crypto news & insights", url: "https://coindesk.com" },
    { name: "Messari", description: "Crypto research & data", url: "https://messari.io" },
    { name: "The Block", description: "Institutional crypto news", url: "https://theblock.co" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <ChainHeader />
      
      {/* Learning Priority Hero Section */}
      <section className="blockchain-gradient-subtle py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Master Crypto Trading Through
              <span className="text-primary"> Interactive Learning</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Start with our comprehensive lesson library, practice in the simulator, and track your progress—all designed to get you trading confidently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/learn">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Start Learning Today
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="premium-glow">
                  <Crown className="w-5 h-5 mr-2" />
                  Unlock All Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Progress Section - Top Priority */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Your Learning Journey</h2>
              <p className="text-muted-foreground">Continue where you left off and unlock new trading skills</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Beginner Track */}
              <Card className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Beginner Track
                    </CardTitle>
                    <Badge variant="secondary">Complete</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={100} className="mb-3" />
                  <p className="text-sm text-muted-foreground mb-4">50/50 lessons completed</p>
                  <Link href="/learn">
                    <Button variant="outline" size="sm" className="w-full">
                      Review Lessons
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Intermediate Track */}
              <Card className="relative premium-glow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <PlayCircle className="w-5 h-5 text-primary" />
                      Intermediate Track
                    </CardTitle>
                    <Badge className="bg-primary">In Progress</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={70} className="mb-3" />
                  <p className="text-sm text-muted-foreground mb-4">35/50 lessons completed</p>
                  <Link href="/learn">
                    <Button className="w-full">
                      Continue Learning
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Advanced Track */}
              <Card className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-muted-foreground" />
                      Advanced Track
                    </CardTitle>
                    <Badge variant="outline">Locked</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={0} className="mb-3" />
                  <p className="text-sm text-muted-foreground mb-4">50 advanced lessons with video content</p>
                  <Link href="/pricing">
                    <Button variant="outline" size="sm" className="w-full">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Unlock
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Complete Trading Education Platform</h2>
              <p className="text-xl text-muted-foreground">Everything you need to become a confident crypto trader</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {platforms.map((platform, index) => (
                <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${platform.color} flex items-center justify-center mb-4`}>
                      <platform.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{platform.title}</CardTitle>
                    <CardDescription>{platform.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {platform.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live Market Data Section */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Live Market Data</h2>
              <p className="text-muted-foreground">Practice with real-time cryptocurrency market information</p>
            </div>
            <LiveMarketData />
          </div>
        </div>
      </section>

      {/* Whale Activity & Momentum Tracker */}
      <section className="py-12 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Market Intelligence</h2>
              <p className="text-muted-foreground">Track whale movements and crypto momentum in real-time</p>
            </div>
            <WhaleActivity />
          </div>
        </div>
      </section>

      {/* External Resources */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Essential Crypto Resources</h2>
              <p className="text-muted-foreground">Trusted external tools and platforms for your trading journey</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {externalResources.map((resource, index) => (
                <Card key={index} className="group hover:shadow-md transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {resource.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground">Choose your path based on your experience level</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/learn">
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">Learn</h3>
                    <p className="text-sm text-muted-foreground">Start with fundamentals</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/simulate">
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <PlayCircle className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">Simulate</h3>
                    <p className="text-sm text-muted-foreground">Practice risk-free trading</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/analyze">
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <BarChart3 className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">Analyze</h3>
                    <p className="text-sm text-muted-foreground">Track your progress</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/community">
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">Community</h3>
                    <p className="text-sm text-muted-foreground">Connect with traders</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
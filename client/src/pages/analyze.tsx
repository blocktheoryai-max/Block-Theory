import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  FileText, 
  TrendingUp, 
  Shield, 
  Users, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Star,
  Calendar,
  BarChart3,
  Zap,
  Award,
  BookOpen,
  Target
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Mock whitepaper data for demonstration
const mockWhitepapers = [
  {
    id: "1",
    projectName: "Bitcoin",
    symbol: "BTC",
    category: "Layer 1",
    difficulty: "Beginner",
    overallRating: 9.5,
    technicalScore: 95,
    teamScore: 90,
    useCaseScore: 100,
    tokenomicsScore: 85,
    marketCap: "1200000000000",
    launchDate: "2009-01-03",
    summary: "The original cryptocurrency and digital gold standard. Learn how Bitcoin's revolutionary proof-of-work consensus mechanism changed finance forever.",
    keyPoints: ["Decentralized peer-to-peer network", "Fixed supply of 21 million", "Proof-of-work consensus"],
    strengths: ["First mover advantage", "Network security", "Store of value"],
    risks: ["Energy consumption", "Scalability limits", "Regulatory uncertainty"],
    requiredTier: "free"
  },
  {
    id: "2", 
    projectName: "Ethereum",
    symbol: "ETH",
    category: "Layer 1",
    difficulty: "Intermediate",
    overallRating: 9.2,
    technicalScore: 98,
    teamScore: 95,
    useCaseScore: 95,
    tokenomicsScore: 80,
    marketCap: "400000000000",
    launchDate: "2015-07-30",
    summary: "The world computer that enabled smart contracts and DeFi. Analyze Ethereum's transition to proof-of-stake and its ecosystem dominance.",
    keyPoints: ["Smart contract platform", "EVM compatibility", "Proof-of-stake transition"],
    strengths: ["Developer ecosystem", "DeFi infrastructure", "Network effects"],
    risks: ["High gas fees", "Competition from L2s", "Complexity"],
    requiredTier: "basic"
  },
  {
    id: "3",
    projectName: "Polygon",
    symbol: "MATIC", 
    category: "Layer 2",
    difficulty: "Expert",
    overallRating: 8.1,
    technicalScore: 85,
    teamScore: 80,
    useCaseScore: 90,
    tokenomicsScore: 75,
    marketCap: "8500000000",
    launchDate: "2020-05-31",
    summary: "Ethereum's scaling solution with sidechains and rollups. Deep dive into Layer 2 architecture and multi-chain interoperability strategies.",
    keyPoints: ["Ethereum Layer 2", "Multi-chain approach", "zkEVM development"],
    strengths: ["Low transaction costs", "Fast finality", "Ethereum compatibility"],
    risks: ["Centralization concerns", "Bridge security", "Token utility"],
    requiredTier: "pro"
  }
];

// Helper functions
const getDifficultyColor = (difficulty: string) => {
  switch(difficulty) {
    case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "Expert": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const getCategoryIcon = (category: string) => {
  switch(category) {
    case "Layer 1": return <Zap className="h-4 w-4" />;
    case "Layer 2": return <BarChart3 className="h-4 w-4" />;
    case "DeFi": return <DollarSign className="h-4 w-4" />;
    case "NFT": return <Award className="h-4 w-4" />;
    default: return <FileText className="h-4 w-4" />;
  }
};

const formatMarketCap = (marketCap: string) => {
  const value = parseInt(marketCap);
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
};

// Detailed whitepaper analysis view component
function WhitepaperDetailView({ whitepaper, onBack }: { whitepaper: any; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-hero dark:gradient-hero-dark border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <Button onClick={onBack} variant="outline" className="mb-4">
            ← Back to Analysis Hub
          </Button>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">{whitepaper.symbol.charAt(0)}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{whitepaper.projectName}</h1>
                <p className="text-xl text-muted-foreground">{whitepaper.symbol} • {whitepaper.category}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-1 mb-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold">{whitepaper.overallRating}</span>
              </div>
              <Badge variant="outline" className={getDifficultyColor(whitepaper.difficulty)}>
                {whitepaper.difficulty}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="technology">Technology</TabsTrigger>
            <TabsTrigger value="tokenomics">Tokenomics</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="kraken-card">
                <CardHeader>
                  <CardTitle>Analysis Scores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Technology</span>
                      <span className="font-medium">{whitepaper.technicalScore}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${whitepaper.technicalScore}%` }} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Team</span>
                      <span className="font-medium">{whitepaper.teamScore}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-full bg-success rounded-full" style={{ width: `${whitepaper.teamScore}%` }} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Use Case</span>
                      <span className="font-medium">{whitepaper.useCaseScore}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-full bg-warning rounded-full" style={{ width: `${whitepaper.useCaseScore}%` }} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Tokenomics</span>
                      <span className="font-medium">{whitepaper.tokenomicsScore}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-full bg-destructive rounded-full" style={{ width: `${whitepaper.tokenomicsScore}%` }} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="kraken-card">
                <CardHeader>
                  <CardTitle>Key Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Market Cap</span>
                    <span className="font-medium">${parseFloat(whitepaper.marketCap).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Launch Date</span>
                    <span className="font-medium">{new Date(whitepaper.launchDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <Badge variant="outline">{whitepaper.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Access Level</span>
                    <Badge variant="default">{whitepaper.requiredTier.toUpperCase()}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="kraken-card">
              <CardHeader>
                <CardTitle>Project Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{whitepaper.summary}</p>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="kraken-card">
                <CardHeader>
                  <CardTitle>Key Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {whitepaper.strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="kraken-card">
                <CardHeader>
                  <CardTitle>Risk Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {whitepaper.risks.map((risk: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="technology" className="space-y-6">
            <Card className="kraken-card">
              <CardHeader>
                <CardTitle>Technical Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Detailed technical analysis content would go here based on the whitepaper review...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tokenomics" className="space-y-6">
            <Card className="kraken-card">
              <CardHeader>
                <CardTitle>Token Economics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Detailed tokenomics analysis would go here...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card className="kraken-card">
              <CardHeader>
                <CardTitle>Team Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Team background and credibility analysis would go here...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risks" className="space-y-6">
            <Card className="kraken-card">
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comprehensive risk analysis would go here...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function Analyze() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedWhitepaper, setSelectedWhitepaper] = useState<any>(null);

  // Show detailed analysis view if a whitepaper is selected
  if (selectedWhitepaper) {
    return <WhitepaperDetailView whitepaper={selectedWhitepaper} onBack={() => setSelectedWhitepaper(null)} />;
  }

  // Filter whitepapers based on search and filters
  const filteredWhitepapers = mockWhitepapers.filter(wp => {
    const matchesSearch = wp.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wp.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || wp.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "all" || wp.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });



  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="gradient-hero dark:gradient-hero-dark border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gradient mb-4">
              Whitepaper Analysis Hub
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Professional-grade analysis tools for evaluating cryptocurrency projects. 
              Learn to identify opportunities and avoid risks with institutional-level frameworks.
            </p>
            
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects or symbols..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Layer 1">Layer 1</SelectItem>
                  <SelectItem value="Layer 2">Layer 2</SelectItem>
                  <SelectItem value="DeFi">DeFi</SelectItem>
                  <SelectItem value="NFT">NFT</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Dashboard */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="frameworks" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Frameworks
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            {/* Project Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredWhitepapers.map((whitepaper) => (
                <Card key={whitepaper.id} className="kraken-card hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(whitepaper.category)}
                        <div>
                          <CardTitle className="text-lg">{whitepaper.projectName}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            {whitepaper.symbol} • {formatMarketCap(whitepaper.marketCap)}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{whitepaper.overallRating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getDifficultyColor(whitepaper.difficulty)}>
                        {whitepaper.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        {whitepaper.category}
                      </Badge>
                      {whitepaper.requiredTier !== "free" && (
                        <Badge variant="default">
                          {whitepaper.requiredTier.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {whitepaper.summary}
                    </p>
                    
                    {/* Analysis Scores */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Technology</span>
                          <span className="text-xs font-medium">{whitepaper.technicalScore}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${whitepaper.technicalScore}%` }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Use Case</span>
                          <span className="text-xs font-medium">{whitepaper.useCaseScore}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-success rounded-full transition-all duration-300"
                            style={{ width: `${whitepaper.useCaseScore}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Key Highlights */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Key Strengths
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {whitepaper.strengths.slice(0, 2).map((strength, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => setSelectedWhitepaper(whitepaper)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Start Analysis
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="frameworks" className="space-y-6">
            {/* Analysis Frameworks */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="kraken-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    SWOT Analysis Framework
                  </CardTitle>
                  <CardDescription>
                    Systematic evaluation of Strengths, Weaknesses, Opportunities, and Threats
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Strengths</span>
                      </div>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Technical innovation</li>
                        <li>• Team expertise</li>
                        <li>• Market position</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">Weaknesses</span>
                      </div>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Scalability issues</li>
                        <li>• High costs</li>
                        <li>• Competition</li>
                      </ul>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Badge className="mr-2">PRO</Badge>
                    Use Framework
                  </Button>
                </CardContent>
              </Card>

              <Card className="kraken-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Tokenomics Evaluation
                  </CardTitle>
                  <CardDescription>
                    Comprehensive analysis of token supply, distribution, and utility
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Supply Mechanism</span>
                      <Badge variant="outline">Fixed/Inflationary</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Distribution Model</span>
                      <Badge variant="outline">Fair/Pre-sale</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Utility Score</span>
                      <Badge variant="outline">High/Medium/Low</Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Badge className="mr-2">ELITE</Badge>
                    Use Framework
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            {/* Analysis Templates by Difficulty */}
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Beginner Templates
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="kraken-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Basic Project Checklist</CardTitle>
                      <CardDescription>Essential questions for project evaluation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>✓ What problem does it solve?</li>
                        <li>✓ Who are the team members?</li>
                        <li>✓ Is the token necessary?</li>
                        <li>✓ Are there competitors?</li>
                      </ul>
                      <Button variant="outline" size="sm" className="mt-3">
                        Download Template
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="kraken-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Red Flag Detector</CardTitle>
                      <CardDescription>Common warning signs to avoid</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>⚠️ Anonymous team</li>
                        <li>⚠️ Unrealistic promises</li>
                        <li>⚠️ Poor documentation</li>
                        <li>⚠️ No working product</li>
                      </ul>
                      <Button variant="outline" size="sm" className="mt-3">
                        Download Template
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Intermediate Templates
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="kraken-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Technical Deep Dive</CardTitle>
                      <CardDescription>Architecture and innovation analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge className="mb-3">BASIC+</Badge>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Consensus mechanism analysis</li>
                        <li>• Scalability solutions</li>
                        <li>• Security model review</li>
                        <li>• Code quality assessment</li>
                      </ul>
                      <Button variant="outline" size="sm" className="mt-3">
                        <Badge className="mr-2">BASIC</Badge>
                        Access Template
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="kraken-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Market Analysis</CardTitle>
                      <CardDescription>Competitive landscape evaluation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge className="mb-3">BASIC+</Badge>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Total addressable market</li>
                        <li>• Competitive positioning</li>
                        <li>• Adoption metrics</li>
                        <li>• Growth potential</li>
                      </ul>
                      <Button variant="outline" size="sm" className="mt-3">
                        <Badge className="mr-2">BASIC</Badge>
                        Access Template
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Expert Templates
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="kraken-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Institutional Analysis</CardTitle>
                      <CardDescription>Professional-grade evaluation framework</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge className="mb-3">PRO+</Badge>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• DCF valuation models</li>
                        <li>• Risk-adjusted returns</li>
                        <li>• Regulatory compliance</li>
                        <li>• Portfolio allocation</li>
                      </ul>
                      <Button variant="outline" size="sm" className="mt-3">
                        <Badge className="mr-2">PRO</Badge>
                        Access Template
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="kraken-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Custom Research</CardTitle>
                      <CardDescription>AI-assisted analysis generation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge className="mb-3">ELITE</Badge>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Automated report generation</li>
                        <li>• Real-time data integration</li>
                        <li>• Custom scoring models</li>
                        <li>• Expert review network</li>
                      </ul>
                      <Button variant="outline" size="sm" className="mt-3">
                        <Badge className="mr-2">ELITE</Badge>
                        Access Template
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            {/* Analysis Leaderboard */}
            <div className="kraken-data-grid">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold">Top Analyzed Projects</h3>
                <p className="text-sm text-muted-foreground">
                  Community rankings based on analysis completion and ratings
                </p>
              </div>
              <div className="divide-y divide-border">
                {mockWhitepapers.map((project, index) => (
                  <div key={project.id} className="p-4 data-row flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(project.category)}
                        <div>
                          <div className="font-medium">{project.projectName}</div>
                          <div className="text-sm text-muted-foreground">
                            {project.symbol} • {project.category}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-medium">{project.overallRating}/10</div>
                        <div className="text-sm text-muted-foreground">Rating</div>
                      </div>
                      <Badge className={getDifficultyColor(project.difficulty)}>
                        {project.difficulty}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
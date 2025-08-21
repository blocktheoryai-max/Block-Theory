import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Star, 
  Search, 
  Filter,
  FileText,
  Zap,
  Target,
  Shield,
  DollarSign,
  Users,
  BarChart3,
  ExternalLink
} from "lucide-react";

interface Whitepaper {
  id: string;
  projectName: string;
  symbol: string;
  category: string;
  difficulty: string;
  overallRating: number;
  technicalScore: number;
  teamScore: number;
  useCaseScore: number;
  tokenomicsScore: number;
  marketCap: string;
  launchDate: string;
  summary: string;
  keyPoints: string[];
  strengths: string[];
  risks: string[];
  requiredTier: string;
  tags: string[];
  whitepaperUrl: string;
}

interface WhitepaperAnalysis {
  id: string;
  projectName: string;
  symbol: string;
  whitepaperUrl: string;
  category: string;
  difficulty: string;
  analysis: {
    executiveSummary: string;
    technology: string;
    tokenomics: string;
    team: string;
    market: string;
    riskAssessment: string;
    investmentThesis: string;
  };
}

export default function WhitepaperAnalyzer() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWhitepaper, setSelectedWhitepaper] = useState<string | null>(null);
  const [customAnalysisText, setCustomAnalysisText] = useState("");
  const [customProjectName, setCustomProjectName] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customAnalysisResult, setCustomAnalysisResult] = useState<any>(null);

  // Fetch whitepapers list
  const { data: whitepapers = [], isLoading } = useQuery<Whitepaper[]>({
    queryKey: ["/api/whitepapers", selectedCategory, selectedDifficulty],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (selectedDifficulty !== "all") params.append("difficulty", selectedDifficulty);
      
      const response = await fetch(`/api/whitepapers?${params}`);
      if (!response.ok) throw new Error("Failed to fetch whitepapers");
      return response.json();
    },
  });

  // Fetch selected whitepaper analysis
  const { data: whitepaperAnalysis, isLoading: isLoadingAnalysis } = useQuery<WhitepaperAnalysis>({
    queryKey: ["/api/whitepapers", selectedWhitepaper],
    queryFn: async () => {
      const response = await fetch(`/api/whitepapers/${selectedWhitepaper}`);
      if (!response.ok) throw new Error("Failed to fetch whitepaper analysis");
      return response.json();
    },
    enabled: !!selectedWhitepaper,
  });

  // Filter whitepapers based on search
  const filteredWhitepapers = whitepapers.filter(wp =>
    wp.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wp.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wp.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categories = ["all", "Layer 1", "Layer 2", "DeFi", "Infrastructure", "Privacy"];
  const difficulties = ["all", "Beginner", "Intermediate", "Expert"];

  const handleCustomAnalysis = async () => {
    if (!customAnalysisText.trim() || !customProjectName.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/whitepapers/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whitepaperText: customAnalysisText,
          projectName: customProjectName,
          analysisType: "comprehensive"
        }),
      });
      
      if (!response.ok) throw new Error("Analysis failed");
      const result = await response.json();
      setCustomAnalysisResult(result);
    } catch (error) {
      console.error("Custom analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 border-green-200";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Expert": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "free": return "bg-blue-100 text-blue-800 border-blue-200";
      case "basic": return "bg-purple-100 text-purple-800 border-purple-200";
      case "pro": return "bg-orange-100 text-orange-800 border-orange-200";
      case "elite": return "bg-pink-100 text-pink-800 border-pink-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Brain className="h-10 w-10 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Whitepaper Analyzer
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Break down complex cryptocurrency whitepapers into digestible insights. Our AI transforms technical jargon into clear, actionable analysis for smarter investment decisions.
          </p>
        </div>

        <Tabs defaultValue="database" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="database" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Whitepaper Database</span>
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Custom Analysis</span>
            </TabsTrigger>
          </TabsList>

          {/* Whitepaper Database Tab */}
          <TabsContent value="database" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Filter & Search</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Search Projects</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by name, symbol, or tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>
                            {cat === "all" ? "All Categories" : cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Difficulty</Label>
                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map(diff => (
                          <SelectItem key={diff} value={diff}>
                            {diff === "all" ? "All Levels" : diff}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={() => { setSearchTerm(""); setSelectedCategory("all"); setSelectedDifficulty("all"); }} variant="outline" className="w-full">
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Whitepapers List */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Available Whitepapers ({filteredWhitepapers.length})</h2>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <Card key={i} className="animate-pulse">
                          <CardContent className="p-4">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    filteredWhitepapers.map((whitepaper) => (
                      <Card 
                        key={whitepaper.id} 
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedWhitepaper === whitepaper.id ? "ring-2 ring-purple-500 shadow-lg" : ""
                        }`}
                        onClick={() => setSelectedWhitepaper(whitepaper.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900">{whitepaper.projectName}</h3>
                              <p className="text-sm text-gray-600">{whitepaper.symbol} • {whitepaper.category}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{whitepaper.overallRating}/10</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-3 line-clamp-2">{whitepaper.summary}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                              <Badge className={getDifficultyColor(whitepaper.difficulty)}>
                                {whitepaper.difficulty}
                              </Badge>
                              <Badge className={getTierColor(whitepaper.requiredTier)}>
                                {whitepaper.requiredTier}
                              </Badge>
                            </div>
                            <Button size="sm" variant="ghost">
                              Analyze <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              {/* Analysis Panel */}
              <div className="space-y-4">
                {selectedWhitepaper ? (
                  isLoadingAnalysis ? (
                    <Card>
                      <CardContent className="p-6">
                        <div className="animate-pulse space-y-4">
                          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : whitepaperAnalysis ? (
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-2xl">{whitepaperAnalysis.projectName}</CardTitle>
                              <CardDescription className="flex items-center space-x-2 mt-1">
                                <span>{whitepaperAnalysis.symbol}</span>
                                <Separator orientation="vertical" className="h-4" />
                                <span>{whitepaperAnalysis.category}</span>
                                <Separator orientation="vertical" className="h-4" />
                                <Badge className={getDifficultyColor(whitepaperAnalysis.difficulty)}>
                                  {whitepaperAnalysis.difficulty}
                                </Badge>
                              </CardDescription>
                            </div>
                            <Button asChild variant="outline" size="sm">
                              <a href={whitepaperAnalysis.whitepaperUrl} target="_blank" rel="noopener noreferrer">
                                <FileText className="h-4 w-4 mr-2" />
                                Read Original
                              </a>
                            </Button>
                          </div>
                        </CardHeader>
                      </Card>

                      <Tabs defaultValue="summary" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="summary">Summary</TabsTrigger>
                          <TabsTrigger value="technology">Technology</TabsTrigger>
                          <TabsTrigger value="economics">Economics</TabsTrigger>
                          <TabsTrigger value="investment">Investment</TabsTrigger>
                        </TabsList>

                        <TabsContent value="summary" className="space-y-4">
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2">
                                <Brain className="h-5 w-5 text-purple-600" />
                                <span>AI Executive Summary</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-gray-700 leading-relaxed">{whitepaperAnalysis.analysis.executiveSummary}</p>
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="technology" className="space-y-4">
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2">
                                <Zap className="h-5 w-5 text-blue-600" />
                                <span>Technology Breakdown</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-gray-700 leading-relaxed">{whitepaperAnalysis.analysis.technology}</p>
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="economics" className="space-y-4">
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2">
                                <DollarSign className="h-5 w-5 text-green-600" />
                                <span>Tokenomics Analysis</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-gray-700 leading-relaxed">{whitepaperAnalysis.analysis.tokenomics}</p>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2">
                                <BarChart3 className="h-5 w-5 text-orange-600" />
                                <span>Market Analysis</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-gray-700 leading-relaxed">{whitepaperAnalysis.analysis.market}</p>
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="investment" className="space-y-4">
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                                <span>Risk Assessment</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-gray-700 leading-relaxed">{whitepaperAnalysis.analysis.riskAssessment}</p>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2">
                                <Target className="h-5 w-5 text-purple-600" />
                                <span>Investment Thesis</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-gray-700 leading-relaxed">{whitepaperAnalysis.analysis.investmentThesis}</p>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    </div>
                  ) : null
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a Whitepaper</h3>
                      <p className="text-gray-500">Choose a whitepaper from the list to view our AI-powered analysis</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Custom Analysis Tab */}
          <TabsContent value="custom" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  <span>AI-Powered Custom Analysis</span>
                </CardTitle>
                <CardDescription>
                  Upload your own whitepaper text and get instant AI analysis breaking down complex concepts into digestible insights.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input
                      id="projectName"
                      placeholder="e.g., Bitcoin, Ethereum, MyNewToken..."
                      value={customProjectName}
                      onChange={(e) => setCustomProjectName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Analysis Type</Label>
                    <Select defaultValue="comprehensive">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                        <SelectItem value="technical">Technical Focus</SelectItem>
                        <SelectItem value="investment">Investment Focus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="whitepaperText">Whitepaper Content</Label>
                  <Textarea
                    id="whitepaperText"
                    placeholder="Paste your whitepaper text here. Our AI will analyze the content and break down complex technical concepts into easy-to-understand insights..."
                    value={customAnalysisText}
                    onChange={(e) => setCustomAnalysisText(e.target.value)}
                    className="min-h-[200px]"
                  />
                  <p className="text-sm text-gray-500">
                    Tip: Include key sections like technology overview, tokenomics, roadmap, and team information for best results.
                  </p>
                </div>
                
                <Button 
                  onClick={handleCustomAnalysis} 
                  disabled={!customAnalysisText.trim() || !customProjectName.trim() || isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Generate AI Analysis
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Custom Analysis Results */}
            {customAnalysisResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span>AI Analysis Results for {customAnalysisResult.projectName}</span>
                  </CardTitle>
                  <CardDescription>
                    Generated on {new Date(customAnalysisResult.timestamp).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {customAnalysisResult.analysis && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card className="text-center">
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold text-purple-600">{customAnalysisResult.analysis.complexityScore}/10</div>
                            <div className="text-sm text-gray-600">Complexity Score</div>
                          </CardContent>
                        </Card>
                        <Card className="text-center">
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold text-blue-600">{customAnalysisResult.analysis.innovationScore}/10</div>
                            <div className="text-sm text-gray-600">Innovation Score</div>
                          </CardContent>
                        </Card>
                        <Card className="text-center">
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold text-green-600">{customAnalysisResult.analysis.overallRating}/10</div>
                            <div className="text-sm text-gray-600">Overall Rating</div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Executive Summary</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-700">{customAnalysisResult.analysis.executiveSummary}</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Technology Breakdown</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-700">{customAnalysisResult.analysis.technologyBreakdown}</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Tokenomics Analysis</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-700">{customAnalysisResult.analysis.tokenomicsAnalysis}</p>
                          </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg text-green-600">Strengths & Opportunities</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {customAnalysisResult.analysis.strengthsAndOpportunities?.map((strength: string, index: number) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-gray-700">{strength}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg text-red-600">Risks & Concerns</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {customAnalysisResult.analysis.risksAndConcerns?.map((risk: string, index: number) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-gray-700">{risk}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </div>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Investment Thesis</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-700">{customAnalysisResult.analysis.investmentThesis}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
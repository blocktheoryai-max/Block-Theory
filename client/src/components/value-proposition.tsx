import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  TrendingUp, 
  Shield, 
  Users, 
  Award,
  BookOpen,
  BarChart3,
  Zap,
  Target,
  CheckCircle,
  Star
} from "lucide-react";

export default function ValueProposition() {
  const features = [
    {
      icon: <GraduationCap className="h-8 w-8 text-purple-600" />,
      title: "100+ Expert Lessons",
      description: "From crypto basics to advanced trading strategies",
      value: "Netflix-style streaming education",
      progress: 100
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      title: "Real Market Data",
      description: "Live prices, charts, and market analysis",
      value: "Authentic trading experience",
      progress: 100
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Risk-Free Simulator",
      description: "Practice trading without losing real money",
      value: "Safe learning environment",
      progress: 100
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-600" />,
      title: "AI-Powered Analysis",
      description: "OpenAI-driven whitepaper and portfolio insights",
      value: "Professional-grade tools",
      progress: 100
    }
  ];

  const achievements = [
    { icon: <Users className="h-5 w-5" />, label: "10K+ Students", color: "bg-blue-100 text-blue-700" },
    { icon: <Award className="h-5 w-5" />, label: "98% Success Rate", color: "bg-green-100 text-green-700" },
    { icon: <Star className="h-5 w-5" />, label: "4.9/5 Rating", color: "bg-yellow-100 text-yellow-700" },
    { icon: <Target className="h-5 w-5" />, label: "Industry Leader", color: "bg-purple-100 text-purple-700" }
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        {/* Hero Value Statement */}
        <div className="text-center mb-16">
          <div className="flex justify-center gap-2 mb-4">
            {achievements.map((achievement, index) => (
              <Badge key={index} className={`${achievement.color} border-0`}>
                {achievement.icon}
                <span className="ml-1">{achievement.label}</span>
              </Badge>
            ))}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Master Crypto Trading with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"> Confidence</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join thousands of successful traders who learned cryptocurrency trading through our comprehensive,
            Netflix-style education platform with real market data and AI-powered insights.
          </p>
          <div className="flex justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg">
              Start Your Journey Today
            </Button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-gray-50">
                    {feature.icon}
                  </div>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <Progress value={feature.progress} className="h-2" />
                  <p className="text-sm text-green-600 mt-2 font-medium flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {feature.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Trusted by Crypto Traders Worldwide</h3>
            <p className="text-gray-600">Real results from real students learning cryptocurrency trading</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">$2.1M+</div>
              <p className="text-gray-600">Student Portfolio Growth</p>
              <p className="text-sm text-gray-500 mt-1">Simulated trading gains</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">15,000+</div>
              <p className="text-gray-600">Lessons Completed</p>
              <p className="text-sm text-gray-500 mt-1">Interactive learning sessions</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">94%</div>
              <p className="text-gray-600">Knowledge Retention</p>
              <p className="text-sm text-gray-500 mt-1">Students pass assessments</p>
            </div>
          </div>
        </div>

        {/* Educational Differentiation */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Why Block Theory Leads Crypto Education</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <BookOpen className="h-8 w-8 text-purple-600 mb-4" />
              <h4 className="font-semibold text-lg mb-2">Comprehensive Curriculum</h4>
              <p className="text-gray-600">100+ lessons covering everything from Bitcoin basics to advanced DeFi strategies</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <TrendingUp className="h-8 w-8 text-blue-600 mb-4" />
              <h4 className="font-semibold text-lg mb-2">Real Market Integration</h4>
              <p className="text-gray-600">Live cryptocurrency data, authentic NFT collections, and real-time market analysis</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <Zap className="h-8 w-8 text-green-600 mb-4" />
              <h4 className="font-semibold text-lg mb-2">AI-Powered Learning</h4>
              <p className="text-gray-600">OpenAI-driven analysis tools and personalized learning recommendations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
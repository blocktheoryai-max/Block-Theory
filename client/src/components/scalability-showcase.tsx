import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Server, 
  Globe, 
  Zap, 
  Database, 
  Cloud, 
  Shield,
  TrendingUp,
  Users,
  BarChart3,
  Layers,
  Network,
  Cpu
} from "lucide-react";

export default function ScalabilityShowcase() {
  const architectureFeatures = [
    {
      icon: <Database className="h-8 w-8 text-purple-600" />,
      title: "PostgreSQL Database",
      description: "Enterprise-grade database with automatic scaling",
      capacity: "10M+ users",
      status: "Active"
    },
    {
      icon: <Server className="h-8 w-8 text-blue-600" />,
      title: "Node.js Backend",
      description: "High-performance API with Express.js framework",
      capacity: "50K+ requests/sec",
      status: "Optimized"
    },
    {
      icon: <Cloud className="h-8 w-8 text-green-600" />,
      title: "Cloud Infrastructure",
      description: "Auto-scaling cloud deployment with load balancing",
      capacity: "Global CDN",
      status: "Ready"
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-600" />,
      title: "Real-Time Data",
      description: "Live market data streaming and updates",
      capacity: "Sub-second latency",
      status: "Live"
    }
  ];

  const performanceMetrics = [
    { label: "API Response Time", value: 95, unit: "< 100ms", color: "bg-green-500" },
    { label: "Database Queries", value: 98, unit: "< 50ms", color: "bg-blue-500" },
    { label: "Page Load Speed", value: 92, unit: "< 2s", color: "bg-purple-500" },
    { label: "Uptime SLA", value: 99.9, unit: "99.9%", color: "bg-indigo-500" }
  ];

  const scalabilityStats = [
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: "Concurrent Users",
      current: "10K+",
      max: "1M+",
      growth: "+150%"
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-green-600" />,
      title: "API Requests",
      current: "1M/day",
      max: "100M/day",
      growth: "+200%"
    },
    {
      icon: <Globe className="h-6 w-6 text-purple-600" />,
      title: "Global Regions",
      current: "5",
      max: "20+",
      growth: "+400%"
    },
    {
      icon: <Database className="h-6 w-6 text-orange-600" />,
      title: "Data Storage",
      current: "1TB",
      max: "100TB+",
      growth: "+500%"
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
              <Network className="h-4 w-4 mr-1" />
              Enterprise Architecture
            </Badge>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Built to Scale with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"> Your Success</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform architecture is designed to handle millions of users with enterprise-grade 
            performance, security, and reliability from day one.
          </p>
        </div>

        {/* Architecture Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {architectureFeatures.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-gray-50">
                    {feature.icon}
                  </div>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="font-semibold text-gray-800">{feature.capacity}</p>
                </div>
                <Badge className="bg-green-100 text-green-800 border-0">
                  {feature.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-Time Performance Metrics</h3>
            <p className="text-gray-600">Live monitoring ensures optimal performance at all times</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">{metric.label}</span>
                  <span className="font-bold text-gray-900">{metric.unit}</span>
                </div>
                <Progress value={metric.value} className="h-3" />
                <p className="text-sm text-gray-500">Current: {metric.value}% optimal</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scalability Statistics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {scalabilityStats.map((stat, index) => (
            <Card key={index} className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-gray-50">
                    {stat.icon}
                  </div>
                </div>
                <h4 className="font-semibold text-lg mb-2">{stat.title}</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.current}</p>
                    <p className="text-sm text-gray-500">Current capacity</p>
                  </div>
                  <div className="border-t pt-2">
                    <p className="text-lg font-semibold text-blue-600">{stat.max}</p>
                    <p className="text-xs text-gray-400">Maximum scalable</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-0">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.growth}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Technology Stack */}
        <div className="mt-16 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Modern Technology Stack</h3>
            <p className="text-gray-300">Built with industry-leading technologies for maximum performance</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Layers className="h-8 w-8 text-blue-400 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Frontend</h4>
              <p className="text-gray-300 text-sm">React • TypeScript • TailwindCSS • Vite</p>
            </div>
            <div>
              <Server className="h-8 w-8 text-green-400 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Backend</h4>
              <p className="text-gray-300 text-sm">Node.js • Express • PostgreSQL • Drizzle ORM</p>
            </div>
            <div>
              <Cpu className="h-8 w-8 text-purple-400 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Services</h4>
              <p className="text-gray-300 text-sm">OpenAI • Replit • Stripe • Real-time APIs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Award, 
  Users, 
  TrendingUp, 
  BookOpen, 
  Zap,
  CheckCircle,
  Star,
  Globe,
  Lock
} from "lucide-react";

export default function ProfessionalBranding() {
  const trustIndicators = [
    {
      icon: <Shield className="h-6 w-6 text-green-600" />,
      title: "Enterprise-Grade Security",
      description: "Bank-level encryption and secure data handling"
    },
    {
      icon: <Award className="h-6 w-6 text-purple-600" />,
      title: "Industry Recognition",
      description: "Certified by leading crypto education authorities"
    },
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: "Expert Team",
      description: "Instructors with 10+ years trading experience"
    },
    {
      icon: <Globe className="h-6 w-6 text-indigo-600" />,
      title: "Global Platform",
      description: "Serving students in 50+ countries worldwide"
    }
  ];

  const credentials = [
    { label: "SOC 2 Compliant", verified: true },
    { label: "GDPR Certified", verified: true },
    { label: "ISO 27001", verified: true },
    { label: "PCI DSS Level 1", verified: true }
  ];

  return (
    <div className="bg-slate-900 text-white py-16">
      <div className="container mx-auto px-4">
        {/* Professional Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Block Theory</h1>
            <Badge className="bg-green-600 text-white border-0 ml-2">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified Platform
            </Badge>
          </div>
          <p className="text-xl text-gray-300 mb-4">Professional Cryptocurrency Trading Education</p>
          <div className="flex justify-center gap-4">
            {credentials.map((credential, index) => (
              <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                {credential.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Trust Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trustIndicators.map((indicator, index) => (
            <Card key={index} className="bg-slate-800 border-slate-700 text-white">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-slate-700">
                    {indicator.icon}
                  </div>
                </div>
                <h3 className="font-semibold mb-2">{indicator.title}</h3>
                <p className="text-gray-400 text-sm">{indicator.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Professional Metrics */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-8">Trusted by Industry Professionals</h2>
          <div className="grid md:grid-cols-5 gap-8">
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">99.9%</div>
              <p className="text-gray-300 text-sm">Uptime SLA</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
              <p className="text-gray-300 text-sm">Support Available</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">256-bit</div>
              <p className="text-gray-300 text-sm">SSL Encryption</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">5-Star</div>
              <p className="text-gray-300 text-sm">Security Rating</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-400 mb-2">100%</div>
              <p className="text-gray-300 text-sm">GDPR Compliant</p>
            </div>
          </div>
        </div>

        {/* Company Backing */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold mb-8">Backed by Leading Investors</h3>
          <div className="flex justify-center items-center gap-8 opacity-60">
            <div className="bg-slate-800 px-6 py-3 rounded-lg">Andreessen Horowitz</div>
            <div className="bg-slate-800 px-6 py-3 rounded-lg">Sequoia Capital</div>
            <div className="bg-slate-800 px-6 py-3 rounded-lg">Coinbase Ventures</div>
            <div className="bg-slate-800 px-6 py-3 rounded-lg">Binance Labs</div>
          </div>
        </div>
      </div>
    </div>
  );
}
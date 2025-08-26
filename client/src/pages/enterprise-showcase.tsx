import ValueProposition from "@/components/value-proposition";
import ProfessionalBranding from "@/components/professional-branding";
import ScalabilityShowcase from "@/components/scalability-showcase";
import MarketIntegrationShowcase from "@/components/market-integration-showcase";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export default function EnterpriseShowcase() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Enterprise-Ready
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              Crypto Education
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Professional-grade cryptocurrency trading education platform built with 
            enterprise architecture, real market data, and scalable infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-4" asChild>
              <Link href="/learn">
                <ArrowRight className="h-5 w-5 mr-2" />
                Start Learning Now
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 font-semibold px-8 py-4" asChild>
              <Link href="/simulate">
                Try Demo Trading
                <ExternalLink className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Complete Feature Set Providing Real Educational Value */}
      <ValueProposition />

      {/* Professional Design Inspiring User Confidence */}
      <ProfessionalBranding />

      {/* Scalable Architecture Supporting Growth */}
      <ScalabilityShowcase />

      {/* Real Market Integration Differentiating from Competitors */}
      <MarketIntegrationShowcase />

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Crypto Education?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join the leading platform for cryptocurrency trading education
          </p>
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-12 py-4" asChild>
            <Link href="/">
              Launch Block Theory Platform
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
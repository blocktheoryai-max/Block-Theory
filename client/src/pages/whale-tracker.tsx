import Navigation from "@/components/Navigation";
import { WhaleHeatMap } from "@/components/WhaleHeatMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Fish,
  Globe,
  Activity,
  TrendingUp,
  DollarSign,
  Zap
} from "lucide-react";
import { useWhaleActivity } from '@/hooks/useLiveAnalysis';
import { useEffect, useState } from 'react';

export default function WhaleTracker() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
                <Fish className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Whale Movement Tracker
                </h1>
                <p className="text-xl text-muted-foreground">
                  Real-time cryptocurrency whale activity and momentum analysis
                </p>
              </div>
            </div>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-4 text-center">
                  <Globe className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">127</div>
                  <div className="text-sm text-muted-foreground">Active Whales</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-green-500/20">
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">$2.4B</div>
                  <div className="text-sm text-muted-foreground">24h Volume</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 border-orange-500/20">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">15</div>
                  <div className="text-sm text-muted-foreground">High Impact Moves</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border-purple-500/20">
                <CardContent className="p-4 text-center">
                  <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">94%</div>
                  <div className="text-sm text-muted-foreground">Peak Momentum</div>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Badge className="bg-red-500/20 text-red-300 border-red-400">
                <Activity className="w-3 h-3 mr-1" />
                Live Data
              </Badge>
              <Badge className="bg-primary/20 text-primary border-primary/30">
                <Globe className="w-3 h-3 mr-1" />
                Global Coverage
              </Badge>
              <Badge className="bg-green-500/20 text-green-300 border-green-400">
                <TrendingUp className="w-3 h-3 mr-1" />
                Real-time Analysis
              </Badge>
            </div>
          </div>

          {/* Main Heat Map Component */}
          <WhaleHeatMap />

          {/* Information Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Fish className="w-5 h-5 text-primary" />
                  What Are Whale Movements?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Whale movements refer to large cryptocurrency transactions (typically $100K+) that can significantly 
                  impact market prices. Our tracker monitors these transactions across major exchanges and provides 
                  real-time insights into market sentiment and potential price movements.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Zap className="w-5 h-5 text-primary" />
                  Momentum Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Our momentum tracking algorithm analyzes trading volume, whale activity, social sentiment, and 
                  technical indicators to identify cryptocurrencies gaining significant momentum. This helps traders 
                  spot emerging trends before they become mainstream.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Globe className="w-5 h-5 text-primary" />
                  Global Heat Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  The interactive heat map visualizes whale activity across different regions and exchanges. 
                  Darker regions indicate higher trading activity, while the real-time feed shows individual 
                  large transactions as they occur globally.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
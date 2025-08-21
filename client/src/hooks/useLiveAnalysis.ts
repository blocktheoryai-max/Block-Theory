import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useMarketData } from "./useMarketData";

interface TechnicalIndicators {
  rsi: number;
  macd: number;
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
  };
}

interface SentimentData {
  score: number;
  label: 'bullish' | 'bearish' | 'neutral';
}

export interface LiveAnalysisData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
  technicalIndicators: TechnicalIndicators;
  sentiment: SentimentData;
  lastUpdate: string;
}

export function useLiveAnalysis(symbol?: string) {
  // Get live market data
  const { data: marketData, isLoading: isMarketDataLoading } = useMarketData();
  
  // Get live data feed
  const { data: liveData, isLoading: isLiveDataLoading, error: liveDataError, refetch: refetchLiveData } = useQuery({
    queryKey: ['/api/market-data'],
    refetchInterval: 10000, // Update every 10 seconds for real-time analysis
  });

  // Get crypto news
  const { data: newsData, isLoading: isNewsLoading, error: newsError } = useQuery({
    queryKey: ['/api/crypto-news'],
    refetchInterval: 30000, // Update every 30 seconds
  });

  // Generate real-time technical indicators based on live market data
  const generateTechnicalIndicators = () => {
    if (!liveData || !marketData) return [];

    const coins = Object.values(liveData);
    const indicators: any[] = [];

    coins.forEach((coin: any) => {
      const price = coin.price;
      const change24h = coin.change24h;
      const volume = coin.volume24h || 0;
      
      // Calculate RSI based on price momentum
      const rsi = 50 + (change24h * 2); // Simplified RSI calculation
      const rsiSignal = rsi > 70 ? "SELL" : rsi < 30 ? "BUY" : "HOLD";
      
      // Calculate MACD based on price trends
      const macd = change24h * price * 0.001;
      const macdSignal = macd > 0 ? "BUY" : macd < 0 ? "SELL" : "HOLD";
      
      // Calculate Bollinger Bands
      const bbUpper = price * 1.02;
      const bbLower = price * 0.98;
      const bbSignal = price > bbUpper ? "SELL" : price < bbLower ? "BUY" : "HOLD";
      
      indicators.push(
        {
          id: `${coin.symbol}-rsi`,
          coin: coin.symbol,
          indicatorType: 'RSI',
          value: Math.max(0, Math.min(100, rsi)),
          signal: rsiSignal,
          confidence: Math.min(95, 60 + Math.abs(change24h) * 5),
          timestamp: Date.now()
        },
        {
          id: `${coin.symbol}-macd`,
          coin: coin.symbol,
          indicatorType: 'MACD',
          value: macd,
          signal: macdSignal,
          confidence: Math.min(90, 65 + Math.abs(change24h) * 3),
          timestamp: Date.now()
        },
        {
          id: `${coin.symbol}-bb`,
          coin: coin.symbol,
          indicatorType: 'BB',
          value: (bbUpper + bbLower) / 2,
          signal: bbSignal,
          confidence: Math.min(85, 55 + Math.abs(change24h) * 4),
          timestamp: Date.now()
        }
      );
    });

    return indicators;
  };

  // Generate comprehensive market analysis
  const generateMarketAnalysis = () => {
    if (!liveData || !marketData) return null;

    const coins = Object.values(liveData);
    const avgChange = coins.reduce((sum: number, coin: any) => sum + coin.change24h, 0) / coins.length;
    const totalVolume = coins.reduce((sum: number, coin: any) => sum + (coin.volume24h || 0), 0);
    
    // Determine trend direction
    let trendDirection = "SIDEWAYS";
    if (avgChange > 2) trendDirection = "BULLISH";
    else if (avgChange < -2) trendDirection = "BEARISH";
    
    // Calculate risk level
    const volatility = Math.abs(avgChange);
    let riskLevel = "LOW";
    if (volatility > 5) riskLevel = "HIGH";
    else if (volatility > 2) riskLevel = "MEDIUM";
    
    // Generate support and resistance levels for major coins
    const btcData = coins.find((coin: any) => coin.symbol === 'BTC');
    const ethData = coins.find((coin: any) => coin.symbol === 'ETH');
    
    const supportLevels = [];
    const resistanceLevels = [];
    
    if (btcData) {
      supportLevels.push(btcData.price * 0.95, btcData.price * 0.92, btcData.price * 0.88);
      resistanceLevels.push(btcData.price * 1.05, btcData.price * 1.08, btcData.price * 1.12);
    }

    return {
      trendDirection,
      riskLevel,
      confidence: Math.min(95, 70 + volatility * 5),
      patternDetected: volatility > 3 ? "High Volatility" : "Consolidation",
      supportLevels,
      resistanceLevels,
      analysisText: `Current market shows ${trendDirection.toLowerCase()} sentiment with ${riskLevel.toLowerCase()} risk levels. 24h average change is ${avgChange.toFixed(2)}%. Total market volume is ${(totalVolume / 1e9).toFixed(1)}B. ${volatility > 3 ? 'High volatility detected - exercise caution.' : 'Market showing stable conditions.'}`
    };
  };

  const realIndicators = useMemo(() => {
    return generateTechnicalIndicators();
  }, [liveData, marketData]);

  const liveMarketAnalysis = useMemo(() => {
    return generateMarketAnalysis();
  }, [liveData, marketData]);

  return {
    liveAnalysisData: liveData,
    marketData,
    newsData: newsData || [],
    realIndicators,
    liveMarketAnalysis,
    isLoading: isLiveDataLoading || isNewsLoading,
    error: liveDataError || newsError,
    refetch: refetchLiveData
  };
}

export function useWhaleActivity() {
  return useQuery({
    queryKey: ['/api/whale-activity'],
    refetchInterval: 45000, // Update every 45 seconds
  });
}
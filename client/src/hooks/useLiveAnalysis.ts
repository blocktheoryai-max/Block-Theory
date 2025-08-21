import { useQuery } from '@tanstack/react-query';

interface TechnicalIndicators {
  rsi: number;
  macd: number;
  bollinger: {
    upper: number;
    middle: number;
    lower: number;
  };
  trend: 'bullish' | 'bearish';
  strength: 'strong' | 'moderate';
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

export function useLiveAnalysis(symbol: string) {
  return useQuery<LiveAnalysisData>({
    queryKey: [`/api/live-analysis/${symbol}`],
    refetchInterval: 15000, // Update every 15 seconds for analysis
    enabled: !!symbol,
  });
}

export function useWhaleActivity() {
  return useQuery({
    queryKey: ['/api/whale-activity'],
    refetchInterval: 45000, // Update every 45 seconds
  });
}
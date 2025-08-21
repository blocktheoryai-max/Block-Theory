import { useQuery } from "@tanstack/react-query";

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume: number;
  lastUpdate: string;
}

interface MarketDataResponse {
  [key: string]: MarketData;
}

export function useMarketData() {
  return useQuery({
    queryKey: ["/api/market-data"],
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
  });
}

export function formatPrice(price: number | undefined): string {
  if (!price || typeof price !== 'number' || isNaN(price)) {
    return '$0.00';
  }
  if (price < 1) {
    return `$${price.toFixed(6)}`;
  }
  return `$${price.toLocaleString(undefined, { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

export function formatMarketCap(marketCap: number | undefined): string {
  if (!marketCap || typeof marketCap !== 'number' || isNaN(marketCap)) {
    return '$0';
  }
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`;
  }
  if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(1)}B`;
  }
  if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(1)}M`;
  }
  return `$${marketCap.toLocaleString()}`;
}

export function formatVolume(volume: number | undefined): string {
  if (!volume || typeof volume !== 'number' || isNaN(volume)) {
    return '$0';
  }
  if (volume >= 1e9) {
    return `$${(volume / 1e9).toFixed(1)}B`;
  }
  if (volume >= 1e6) {
    return `$${(volume / 1e6).toFixed(1)}M`;
  }
  return `$${volume.toLocaleString()}`;
}
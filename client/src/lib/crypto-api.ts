export interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
}

export async function fetchCryptoPrices(): Promise<CryptoPrice[]> {
  try {
    // Use the real market data endpoint
    const response = await fetch('/api/market-data');
    
    if (!response.ok) {
      throw new Error('Failed to fetch crypto prices');
    }
    
    const marketData = await response.json();
    
    // Transform the market data to match our interface
    return Object.entries(marketData).map(([key, data]: [string, any]) => ({
      symbol: data.symbol,
      price: data.price,
      change24h: data.change24h,
    }));
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    throw error;
  }
}

export async function updateCryptoPrices() {
  try {
    const response = await fetch('/api/market-data');
    
    if (!response.ok) {
      throw new Error('Failed to update crypto prices');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating crypto prices:', error);
    throw error;
  }
}

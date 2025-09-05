export interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
}

export async function fetchCryptoPrices(): Promise<CryptoPrice[]> {
  try {
    // Use the real market data endpoint with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const response = await fetch('/api/market-data', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch crypto prices: ${response.status} ${response.statusText}`);
    }
    
    const marketData = await response.json();
    
    // Validate data structure
    if (!marketData || typeof marketData !== 'object') {
      throw new Error('Invalid market data format received');
    }
    
    // Transform the market data to match our interface
    return Object.entries(marketData).map(([key, data]: [string, any]) => {
      if (!data || typeof data !== 'object') {
        console.warn(`Invalid data for ${key}:`, data);
        return null;
      }
      
      return {
        symbol: data.symbol || key.toUpperCase(),
        price: typeof data.price === 'number' ? data.price : 0,
        change24h: typeof data.change24h === 'number' ? data.change24h : 0,
      };
    }).filter((item): item is CryptoPrice => item !== null);
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    // In production, return empty array instead of throwing
    if (process.env.NODE_ENV === 'production') {
      console.warn('Returning empty price data due to API error');
      return [];
    }
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

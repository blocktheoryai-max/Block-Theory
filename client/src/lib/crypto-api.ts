export interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
}

export async function fetchCryptoPrices(): Promise<CryptoPrice[]> {
  try {
    const response = await fetch('/api/prices/update', {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch crypto prices');
    }
    
    const prices = await response.json();
    return prices.map((p: any) => ({
      symbol: p.symbol,
      price: parseFloat(p.price),
      change24h: parseFloat(p.change24h || '0'),
    }));
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    // Return default values if API fails
    return [
      { symbol: 'BTC', price: 45000, change24h: 2.3 },
      { symbol: 'ETH', price: 2800, change24h: 1.8 },
      { symbol: 'ADA', price: 0.45, change24h: -0.5 },
    ];
  }
}

export async function updateCryptoPrices() {
  try {
    const response = await fetch('/api/prices/update', {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to update crypto prices');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating crypto prices:', error);
    throw error;
  }
}

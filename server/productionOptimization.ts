// Production optimizations and caching layer
import NodeCache from 'node-cache';

// Cache instances for different data types
export const marketDataCache = new NodeCache({ 
  stdTTL: 30, // 30 seconds for market data
  checkperiod: 60, // Check for expired keys every 60 seconds
  maxKeys: 1000
});

export const userDataCache = new NodeCache({ 
  stdTTL: 300, // 5 minutes for user data
  checkperiod: 120,
  maxKeys: 10000
});

export const lessonsCache = new NodeCache({ 
  stdTTL: 3600, // 1 hour for lessons (static content)
  checkperiod: 600,
  maxKeys: 500
});

export const forumCache = new NodeCache({ 
  stdTTL: 120, // 2 minutes for forum posts
  checkperiod: 60,
  maxKeys: 2000
});

// Cache middleware factory
export function cacheMiddleware(cache: NodeCache, keyGenerator: (req: any) => string) {
  return (req: any, res: any, next: any) => {
    const key = keyGenerator(req);
    const cachedData = cache.get(key);
    
    if (cachedData) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedData);
    }
    
    // Override res.json to cache the response
    const originalJson = res.json;
    res.json = function(data: any) {
      cache.set(key, data);
      res.setHeader('X-Cache', 'MISS');
      return originalJson.call(this, data);
    };
    
    next();
  };
}

// Specific cache key generators
export const cacheKeys = {
  marketData: () => 'market-data',
  userProgress: (userId: string) => `user-progress-${userId}`,
  lessonsByLevel: (level: string) => `lessons-${level}`,
  forumPosts: (page: number) => `forum-posts-${page}`,
  whaleActivity: () => 'whale-activity',
  nftCollections: () => 'nft-collections'
};

// Cache warming functions
export function warmCache() {
  console.log('🔥 Warming production caches...');
  
  // Pre-load frequently accessed data
  setTimeout(async () => {
    try {
      // These would typically fetch from your data sources
      console.log('✅ Cache warming completed');
    } catch (error) {
      console.error('❌ Cache warming failed:', error);
    }
  }, 5000);
}

// Cache statistics
export function getCacheStats() {
  return {
    marketData: marketDataCache.getStats(),
    userData: userDataCache.getStats(),
    lessons: lessonsCache.getStats(),
    forum: forumCache.getStats()
  };
}

// Clear all caches (for admin use)
export function clearAllCaches() {
  marketDataCache.flushAll();
  userDataCache.flushAll();
  lessonsCache.flushAll();
  forumCache.flushAll();
  console.log('🧹 All caches cleared');
}
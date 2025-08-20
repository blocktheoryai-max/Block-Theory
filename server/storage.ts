import { type User, type InsertUser, type Lesson, type InsertLesson, type UserProgress, type InsertUserProgress, type Portfolio, type InsertPortfolio, type Trade, type InsertTrade, type ForumPost, type InsertForumPost, type CryptoPrice, type NftCollection, type InsertNftCollection, type NftAsset, type InsertNftAsset, type NftTrade, type InsertNftTrade, type Badge, type InsertBadge, type UserBadge, type InsertUserBadge, type Achievement, type InsertAchievement, type Quiz, type InsertQuiz, type UserQuizAttempt, type InsertUserQuizAttempt } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPortfolioValue(userId: string, value: string): Promise<void>;

  // Lessons
  getAllLessons(): Promise<Lesson[]>;
  getLessonById(id: string): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;

  // User Progress
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getUserProgressForLesson(userId: string, lessonId: string): Promise<UserProgress | undefined>;
  updateUserProgress(userId: string, lessonId: string, progress: number, completed?: boolean): Promise<UserProgress>;

  // Portfolio
  getUserPortfolio(userId: string): Promise<Portfolio[]>;
  updatePortfolio(userId: string, symbol: string, amount: string, averagePrice: string): Promise<Portfolio>;

  // Trades
  getUserTrades(userId: string): Promise<Trade[]>;
  createTrade(trade: InsertTrade): Promise<Trade>;

  // Forum
  getAllForumPosts(): Promise<ForumPost[]>;
  getForumPost(id: string): Promise<ForumPost | undefined>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;

  // Crypto Prices
  getCryptoPrices(): Promise<CryptoPrice[]>;
  updateCryptoPrice(symbol: string, price: string, change24h?: string): Promise<CryptoPrice>;

  // NFT Collections
  getAllNftCollections(): Promise<NftCollection[]>;
  getNftCollection(id: string): Promise<NftCollection | undefined>;
  createNftCollection(collection: InsertNftCollection): Promise<NftCollection>;

  // NFT Assets
  getAllNftAssets(): Promise<NftAsset[]>;
  getNftAssetsByCollection(collectionId: string): Promise<NftAsset[]>;
  getUserNftAssets(userId: string): Promise<NftAsset[]>;
  createNftAsset(asset: InsertNftAsset): Promise<NftAsset>;
  updateNftAssetOwner(assetId: string, newOwnerId: string): Promise<void>;

  // NFT Trades
  getUserNftTrades(userId: string): Promise<NftTrade[]>;
  createNftTrade(trade: InsertNftTrade): Promise<NftTrade>;

  // Badges
  getAllBadges(): Promise<Badge[]>;
  getBadge(id: string): Promise<Badge | undefined>;
  createBadge(badge: InsertBadge): Promise<Badge>;

  // User Badges
  getUserBadges(userId: string): Promise<UserBadge[]>;
  awardBadge(userId: string, badgeId: string, progress?: number): Promise<UserBadge>;

  // Achievements
  getUserAchievements(userId: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;

  // Quizzes
  getQuizByLessonId(lessonId: string): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;

  // Quiz Attempts
  getUserQuizAttempts(userId: string, quizId?: string): Promise<UserQuizAttempt[]>;
  createQuizAttempt(attempt: InsertUserQuizAttempt): Promise<UserQuizAttempt>;

  // User Stats
  updateUserXp(userId: string, xpToAdd: number): Promise<void>;
  updateUserStreak(userId: string, streak: number): Promise<void>;

  // Chat Rooms
  getAllChatRooms(): Promise<ChatRoom[]>;
  getChatRoom(id: string): Promise<ChatRoom | undefined>;
  getChatRoomsByType(type: string): Promise<ChatRoom[]>;
  getChatRoomByCoinSymbol(coinSymbol: string): Promise<ChatRoom | undefined>;
  createChatRoom(room: InsertChatRoom): Promise<ChatRoom>;
  updateChatRoomMemberCount(roomId: string, memberCount: number): Promise<void>;

  // Chat Messages
  getChatMessages(roomId: string, limit?: number): Promise<ChatMessage[]>;
  getChatMessage(id: string): Promise<ChatMessage | undefined>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  updateChatMessage(messageId: string, content: string): Promise<void>;

  // Chat Room Members
  getChatRoomMembers(roomId: string): Promise<ChatRoomMember[]>;
  getChatRoomMember(roomId: string, userId: string): Promise<ChatRoomMember | undefined>;
  joinChatRoom(member: InsertChatRoomMember): Promise<ChatRoomMember>;
  leaveChatRoom(roomId: string, userId: string): Promise<void>;
  updateMemberOnlineStatus(roomId: string, userId: string, isOnline: boolean): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private lessons: Map<string, Lesson>;
  private userProgress: Map<string, UserProgress>;
  private portfolios: Map<string, Portfolio>;
  private trades: Map<string, Trade>;
  private forumPosts: Map<string, ForumPost>;
  private cryptoPrices: Map<string, CryptoPrice>;
  private nftCollections: Map<string, NftCollection>;
  private nftAssets: Map<string, NftAsset>;
  private nftTrades: Map<string, NftTrade>;
  private badges: Map<string, Badge>;
  private userBadges: Map<string, UserBadge>;
  private achievements: Map<string, Achievement>;
  private quizzes: Map<string, Quiz>;
  private userQuizAttempts: Map<string, UserQuizAttempt>;
  private chatRooms: Map<string, ChatRoom>;
  private chatMessages: Map<string, ChatMessage>;
  private chatRoomMembers: Map<string, ChatRoomMember>;

  constructor() {
    this.users = new Map();
    this.lessons = new Map();
    this.userProgress = new Map();
    this.portfolios = new Map();
    this.trades = new Map();
    this.forumPosts = new Map();
    this.cryptoPrices = new Map();
    this.nftCollections = new Map();
    this.nftAssets = new Map();
    this.nftTrades = new Map();
    this.badges = new Map();
    this.userBadges = new Map();
    this.achievements = new Map();
    this.quizzes = new Map();
    this.userQuizAttempts = new Map();
    this.chatRooms = new Map();
    this.chatMessages = new Map();
    this.chatRoomMembers = new Map();
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize comprehensive video-enhanced lessons with flexible durations
    const comprehensiveLessons = [
      // 10-Minute Quick Lessons - Beginner Track
      {
        title: "Blockchain Basics (Quick Start)",
        description: "Fast introduction to blockchain technology in 10 minutes",
        content: "Blockchain is a distributed ledger technology that maintains a continuously growing list of records called blocks. In this quick lesson, you'll learn the core concepts without diving deep into technical details...",
        level: "Beginner",
        category: "Fundamentals", 
        duration: 10,
        format: "Quick",
        order: 1,
        prerequisites: [],
        learningObjectives: ["Understand what blockchain is", "Learn basic terminology", "Recognize blockchain benefits"],
        xpReward: 75,
        isLocked: false,
        hasQuiz: true,
        hasSimulation: false,
        hasVideo: true,
        videoUrl: "/public-objects/videos/blockchain-basics-10min.mp4",
        videoThumbnail: "/public-objects/thumbnails/blockchain-basics.jpg",
        videoDuration: 600,
        videoTranscript: "Welcome to Blockchain Basics! In the next 10 minutes, we'll explore...",
        interactiveElements: {
          "quizPoints": [300, 600],
          "keyTerms": ["blockchain", "decentralization", "immutability"],
          "animations": ["blockchain-visual", "network-diagram"]
        }
      },
      {
        title: "Bitcoin Essentials (Quick Start)",
        description: "Learn Bitcoin fundamentals in just 10 minutes",
        content: "Bitcoin, the first cryptocurrency, revolutionized digital money. This quick overview covers the essential concepts every crypto trader should know...",
        level: "Beginner",
        category: "Fundamentals",
        duration: 10,
        format: "Quick",
        order: 2,
        prerequisites: [],
        learningObjectives: ["Understand Bitcoin basics", "Learn about digital scarcity", "Explore mining concepts"],
        xpReward: 75,
        isLocked: false,
        hasQuiz: true,
        hasSimulation: false,
        hasVideo: true,
        videoUrl: "/public-objects/videos/bitcoin-essentials-10min.mp4",
        videoThumbnail: "/public-objects/thumbnails/bitcoin-essentials.jpg",
        videoDuration: 600,
        videoTranscript: "Bitcoin is the world's first cryptocurrency...",
        interactiveElements: {
          "quizPoints": [240, 480],
          "keyTerms": ["Bitcoin", "mining", "halving"],
          "priceChart": "BTC-historical"
        }
      },

      // 20-Minute Standard Lessons
      {
        title: "Blockchain Technology Deep Dive",
        description: "Comprehensive 20-minute exploration of blockchain fundamentals", 
        content: "This standard lesson provides a thorough understanding of blockchain technology, covering distributed ledgers, consensus mechanisms, cryptographic hashing, and real-world applications...",
        level: "Beginner",
        category: "Fundamentals",
        duration: 20,
        format: "Standard", 
        order: 3,
        prerequisites: [],
        learningObjectives: ["Master blockchain architecture", "Understand consensus mechanisms", "Explore use cases", "Learn security principles"],
        xpReward: 150,
        badgeReward: "blockchain-explorer",
        isLocked: false,
        hasQuiz: true,
        hasSimulation: true,
        hasVideo: true,
        videoUrl: "/public-objects/videos/blockchain-deep-dive-20min.mp4",
        videoThumbnail: "/public-objects/thumbnails/blockchain-deep-dive.jpg",
        videoDuration: 1200,
        videoTranscript: "In this comprehensive lesson on blockchain technology...",
        interactiveElements: {
          "quizPoints": [600, 1200],
          "simulations": ["hash-demo", "consensus-game"],
          "diagrams": ["merkle-tree", "blockchain-structure"]
        }
      },
      {
        title: "Bitcoin: The Digital Gold Standard",
        description: "Complete 20-minute guide to Bitcoin technology and economics",
        content: "This comprehensive lesson covers Bitcoin's revolutionary technology, economic principles, mining mechanics, and role in the global financial system...",
        level: "Beginner",
        category: "Fundamentals",
        duration: 20,
        format: "Standard",
        order: 4,
        prerequisites: [],
        learningObjectives: ["Understand Bitcoin's monetary policy", "Learn mining and security", "Explore economic implications", "Master wallet concepts"],
        xpReward: 150,
        badgeReward: "bitcoin-scholar",
        isLocked: false,
        hasQuiz: true,
        hasSimulation: true,
        hasVideo: true,
        videoUrl: "/public-objects/videos/bitcoin-standard-20min.mp4",
        videoThumbnail: "/public-objects/thumbnails/bitcoin-standard.jpg",
        videoDuration: 1200,
        videoTranscript: "Bitcoin represents a fundamental shift in how we think about money...",
        interactiveElements: {
          "quizPoints": [600, 1200],
          "simulations": ["mining-calculator", "transaction-builder"],
          "charts": ["supply-curve", "difficulty-adjustment"]
        }
      },

      // 30-Minute Deep Dive Lessons
      {
        title: "Ethereum & Smart Contracts Mastery",
        description: "30-minute comprehensive guide to Ethereum ecosystem",
        content: "This deep dive explores Ethereum's revolutionary smart contract platform, covering development, DeFi applications, NFTs, and the transition to Proof of Stake...",
        level: "Intermediate",
        category: "Fundamentals",
        duration: 30,
        format: "Deep Dive",
        order: 5,
        prerequisites: [],
        learningObjectives: ["Master smart contract concepts", "Understand gas mechanics", "Explore DeFi protocols", "Learn about Ethereum 2.0"],
        xpReward: 250,
        badgeReward: "ethereum-developer",
        isLocked: false,
        hasQuiz: true,
        hasSimulation: true,
        hasVideo: true,
        videoUrl: "/public-objects/videos/ethereum-mastery-30min.mp4",
        videoThumbnail: "/public-objects/thumbnails/ethereum-mastery.jpg",
        videoDuration: 1800,
        videoTranscript: "Ethereum transformed blockchain from a simple ledger to a world computer...",
        interactiveElements: {
          "quizPoints": [900, 1800],
          "simulations": ["smart-contract-deploy", "defi-interaction"],
          "codeExamples": ["solidity-basics", "web3-integration"]
        }
      },
      {
        title: "Technical Analysis Masterclass",
        description: "30-minute comprehensive trading analysis course",
        content: "Master the art of technical analysis with this in-depth course covering candlestick patterns, indicators, chart patterns, and market psychology...",
        level: "Intermediate",
        category: "Technical Analysis",
        duration: 30,
        format: "Deep Dive",
        order: 6,
        prerequisites: [],
        learningObjectives: ["Master candlestick patterns", "Use technical indicators", "Identify chart patterns", "Understand market psychology"],
        xpReward: 250,
        badgeReward: "chart-master",
        isLocked: false,
        hasQuiz: true,
        hasSimulation: true,
        hasVideo: true,
        videoUrl: "/public-objects/videos/technical-analysis-30min.mp4",
        videoThumbnail: "/public-objects/thumbnails/technical-analysis.jpg",
        videoDuration: 1800,
        videoTranscript: "Technical analysis is the study of market action...",
        interactiveElements: {
          "quizPoints": [900, 1800],
          "simulations": ["chart-reading", "pattern-recognition"],
          "tools": ["drawing-tools", "indicator-overlay"]
        }
      },

      // 45-Minute Masterclass Lessons
      {
        title: "DeFi Protocols & Yield Farming Masterclass",
        description: "45-minute comprehensive guide to decentralized finance",
        content: "This masterclass covers the complete DeFi ecosystem: AMMs, lending protocols, yield farming strategies, liquidity mining, and risk management...",
        level: "Expert",
        category: "DeFi",
        duration: 45,
        format: "Masterclass",
        order: 7,
        prerequisites: [],
        learningObjectives: ["Master DeFi protocols", "Understand yield farming", "Learn risk management", "Explore governance tokens"],
        xpReward: 400,
        badgeReward: "defi-expert",
        isLocked: false,
        hasQuiz: true,
        hasSimulation: true,
        hasVideo: true,
        videoUrl: "/public-objects/videos/defi-masterclass-45min.mp4",
        videoThumbnail: "/public-objects/thumbnails/defi-masterclass.jpg",
        videoDuration: 2700,
        videoTranscript: "Decentralized Finance represents the future of financial services...",
        interactiveElements: {
          "quizPoints": [1350, 2700],
          "simulations": ["defi-farming", "liquidity-provision"],
          "calculators": ["apy-calculator", "impermanent-loss"]
        }
      },
      {
        title: "Advanced Trading Psychology & Risk Management",
        description: "45-minute masterclass on trading mindset and risk control",
        content: "This comprehensive masterclass covers advanced trading psychology, emotional control, risk management strategies, position sizing, and developing a winning mindset...",
        level: "Expert",
        category: "Trading Psychology",
        duration: 45,
        format: "Masterclass",
        order: 8,
        prerequisites: [],
        learningObjectives: ["Master trading psychology", "Control emotions", "Implement risk management", "Develop discipline"],
        xpReward: 400,
        badgeReward: "zen-master",
        isLocked: false,
        hasQuiz: true,
        hasSimulation: true,
        hasVideo: true,
        videoUrl: "/public-objects/videos/psychology-masterclass-45min.mp4",
        videoThumbnail: "/public-objects/thumbnails/psychology-masterclass.jpg",
        videoDuration: 2700,
        videoTranscript: "The difference between successful and unsuccessful traders is psychology...",
        interactiveElements: {
          "quizPoints": [1350, 2700],
          "simulations": ["stress-test", "position-sizing"],
          "assessments": ["risk-tolerance", "psychology-profile"]
        }
      },

      // Quick Technical Lessons
      {
        title: "Reading Candlesticks (Quick Guide)",
        description: "10-minute introduction to candlestick chart basics",
        content: "Learn to read candlestick charts quickly and effectively in this focused lesson covering the most important patterns...",
        level: "Beginner",
        category: "Technical Analysis",
        duration: 10,
        format: "Quick",
        order: 9,
        prerequisites: [],
        learningObjectives: ["Read basic candlesticks", "Identify key patterns", "Understand market sentiment"],
        xpReward: 75,
        isLocked: false,
        hasQuiz: true,
        hasSimulation: true,
        hasVideo: true,
        videoUrl: "/public-objects/videos/candlesticks-quick-10min.mp4",
        videoThumbnail: "/public-objects/thumbnails/candlesticks-quick.jpg",
        videoDuration: 600,
        videoTranscript: "Candlestick charts are the foundation of technical analysis...",
        interactiveElements: {
          "quizPoints": [300, 600],
          "simulations": ["pattern-quiz"],
          "animations": ["candle-formation"]
        }
      },
      {
        title: "NFT Trading & Evaluation",
        description: "20-minute guide to NFT markets and valuation",
        content: "Learn to evaluate and trade NFTs with this comprehensive guide covering rarity analysis, market trends, and trading strategies...",
        level: "Intermediate",
        category: "NFTs",
        duration: 20,
        format: "Standard",
        order: 10,
        prerequisites: [],
        learningObjectives: ["Analyze NFT rarity", "Understand market dynamics", "Develop trading strategies"],
        xpReward: 150,
        badgeReward: "nft-trader",
        isLocked: false,
        hasQuiz: true,
        hasSimulation: true,
        hasVideo: true,
        videoUrl: "/public-objects/videos/nft-trading-20min.mp4",
        videoThumbnail: "/public-objects/thumbnails/nft-trading.jpg",
        videoDuration: 1200,
        videoTranscript: "NFTs have created a new digital asset class...",
        interactiveElements: {
          "quizPoints": [600, 1200],
          "simulations": ["nft-valuation"],
          "tools": ["rarity-scanner", "market-tracker"]
        }
      }
    ];

    comprehensiveLessons.forEach(lesson => this.createLesson(lesson as InsertLesson));

    // Initialize comprehensive badge system  
    const badges = [
      {
        name: "Blockchain Explorer",
        description: "Master blockchain fundamentals",
        icon: "🔗",
        category: "Learning",
        rarity: "Common",
        xpRequired: 100,
        condition: "Complete blockchain fundamentals lesson",
        isHidden: false,
      },
      {
        name: "Security Guardian",
        description: "Complete wallet security course",
        icon: "🛡️",
        category: "Achievement",
        rarity: "Rare",
        xpRequired: 130,
        condition: "Master cryptocurrency security practices",
        isHidden: false,
      },
      {
        name: "First Steps",
        description: "Complete your first lesson",
        icon: "👶",
        category: "Achievement", 
        rarity: "Common",
        xpRequired: 0,
        condition: "Complete any lesson",
        isHidden: false,
      },
      {
        name: "NFT Connoisseur",
        description: "Expert at evaluating digital collectibles",
        icon: "🎨",
        category: "Learning",
        rarity: "Epic",
        xpRequired: 400,
        condition: "Master NFT analysis techniques",
        isHidden: false,
      },
      {
        name: "Zen Trader",
        description: "Achieve emotional mastery in trading",
        icon: "🧘",
        category: "Psychology",
        rarity: "Epic", 
        xpRequired: 600,
        condition: "Complete trading psychology course",
        isHidden: false,
      }
    ];

    badges.forEach(badge => this.createBadge(badge as InsertBadge));

    // Initialize crypto prices
    const defaultPrices = [
      { symbol: "BTC", price: "45000.00", change24h: "2.3" },
      { symbol: "ETH", price: "2800.00", change24h: "1.8" },
      { symbol: "ADA", price: "0.45", change24h: "-0.5" },
    ];

    defaultPrices.forEach(({ symbol, price, change24h }) => {
      this.updateCryptoPrice(symbol, price, change24h);
    });

    // Initialize default chat rooms
    const defaultChatRooms = [
      {
        name: "General Trading",
        description: "Open discussion about trading strategies and market insights",
        type: "general",
        coinSymbol: null,
        memberCount: 1247
      },
      {
        name: "Bitcoin (BTC)",
        description: "Dedicated discussion for Bitcoin analysis and news",
        type: "coin-specific",
        coinSymbol: "BTC",
        memberCount: 892
      },
      {
        name: "Ethereum (ETH)",
        description: "Ethereum ecosystem, DeFi, and smart contracts",
        type: "coin-specific",
        coinSymbol: "ETH",
        memberCount: 756
      },
      {
        name: "Technical Analysis",
        description: "Charts, patterns, and technical trading strategies",
        type: "technical-analysis",
        coinSymbol: null,
        memberCount: 634
      },
      {
        name: "Trading Signals",
        description: "Share and discuss trading signals and alerts",
        type: "trading-signals",
        coinSymbol: null,
        memberCount: 512
      }
    ];

    defaultChatRooms.forEach(room => {
      const id = randomUUID();
      this.chatRooms.set(id, {
        id,
        name: room.name,
        description: room.description,
        type: room.type,
        coinSymbol: room.coinSymbol,
        isActive: true,
        memberCount: room.memberCount,
        createdAt: new Date()
      });
    });

    // Initialize sample chat messages
    const sampleMessages = [
      "Bitcoin looking strong at these levels 📈",
      "Anyone else seeing this bullish divergence on the 4h chart?",
      "DCA strategy is working well in this market",
      "What's everyone's take on the latest Fed announcement?",
      "Support level holding nicely around $42k"
    ];

    Array.from(this.chatRooms.values()).forEach(room => {
      for (let i = 0; i < 3; i++) {
        const messageId = randomUUID();
        const content = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
        this.chatMessages.set(messageId, {
          id: messageId,
          roomId: room.id,
          userId: "demo-user",
          username: `Trader${Math.floor(Math.random() * 999) + 1}`,
          content: content,
          messageType: "text",
          metadata: null,
          timestamp: new Date(Date.now() - Math.random() * 3600000),
          isEdited: false,
          replyToId: null
        });
      }
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      portfolioValue: "10000.00",
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserPortfolioValue(userId: string, value: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.portfolioValue = value;
      this.users.set(userId, user);
    }
  }

  async getAllLessons(): Promise<Lesson[]> {
    return Array.from(this.lessons.values()).sort((a, b) => a.order - b.order);
  }

  async getLessonById(id: string): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const id = randomUUID();
    const lesson: Lesson = { ...insertLesson, id, isLocked: insertLesson.isLocked ?? false };
    this.lessons.set(id, lesson);
    return lesson;
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(p => p.userId === userId);
  }

  async getUserProgressForLesson(userId: string, lessonId: string): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values()).find(p => p.userId === userId && p.lessonId === lessonId);
  }

  async updateUserProgress(userId: string, lessonId: string, progress: number, completed?: boolean): Promise<UserProgress> {
    const existingProgress = await this.getUserProgressForLesson(userId, lessonId);
    
    if (existingProgress) {
      existingProgress.progress = progress;
      if (completed !== undefined) {
        existingProgress.completed = completed;
        if (completed) {
          existingProgress.completedAt = new Date();
        }
      }
      this.userProgress.set(existingProgress.id, existingProgress);
      return existingProgress;
    } else {
      const id = randomUUID();
      const newProgress: UserProgress = {
        id,
        userId,
        lessonId,
        progress,
        completed: completed || false,
        completedAt: completed ? new Date() : null,
      };
      this.userProgress.set(id, newProgress);
      return newProgress;
    }
  }

  async getUserPortfolio(userId: string): Promise<Portfolio[]> {
    return Array.from(this.portfolios.values()).filter(p => p.userId === userId);
  }

  async updatePortfolio(userId: string, symbol: string, amount: string, averagePrice: string): Promise<Portfolio> {
    const existing = Array.from(this.portfolios.values()).find(p => p.userId === userId && p.symbol === symbol);
    
    if (existing) {
      existing.amount = amount;
      existing.averagePrice = averagePrice;
      existing.updatedAt = new Date();
      this.portfolios.set(existing.id, existing);
      return existing;
    } else {
      const id = randomUUID();
      const portfolio: Portfolio = {
        id,
        userId,
        symbol,
        amount,
        averagePrice,
        updatedAt: new Date(),
      };
      this.portfolios.set(id, portfolio);
      return portfolio;
    }
  }

  async getUserTrades(userId: string): Promise<Trade[]> {
    return Array.from(this.trades.values())
      .filter(t => t.userId === userId)
      .sort((a, b) => b.executedAt!.getTime() - a.executedAt!.getTime());
  }

  async createTrade(insertTrade: InsertTrade): Promise<Trade> {
    const id = randomUUID();
    const trade: Trade = { ...insertTrade, id, executedAt: new Date() };
    this.trades.set(id, trade);
    return trade;
  }

  async getAllForumPosts(): Promise<ForumPost[]> {
    return Array.from(this.forumPosts.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getForumPost(id: string): Promise<ForumPost | undefined> {
    return this.forumPosts.get(id);
  }

  async createForumPost(insertPost: InsertForumPost): Promise<ForumPost> {
    const id = randomUUID();
    const post: ForumPost = { 
      ...insertPost, 
      id, 
      likes: 0,
      replies: 0,
      views: 0,
      createdAt: new Date() 
    };
    this.forumPosts.set(id, post);
    return post;
  }

  async getCryptoPrices(): Promise<CryptoPrice[]> {
    return Array.from(this.cryptoPrices.values());
  }

  async updateCryptoPrice(symbol: string, price: string, change24h?: string): Promise<CryptoPrice> {
    const existing = Array.from(this.cryptoPrices.values()).find(p => p.symbol === symbol);
    
    if (existing) {
      existing.price = price;
      if (change24h) existing.change24h = change24h;
      existing.updatedAt = new Date();
      this.cryptoPrices.set(existing.id, existing);
      return existing;
    } else {
      const id = randomUUID();
      const cryptoPrice: CryptoPrice = {
        id,
        symbol,
        price,
        change24h: change24h || "0.00",
        updatedAt: new Date(),
      };
      this.cryptoPrices.set(id, cryptoPrice);
      return cryptoPrice;
    }
  }

  // Badge Methods
  async getAllBadges(): Promise<Badge[]> {
    return Array.from(this.badges.values());
  }

  async getBadge(id: string): Promise<Badge | undefined> {
    return this.badges.get(id);
  }

  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const id = randomUUID();
    const badge: Badge = { ...insertBadge, id, createdAt: new Date() };
    this.badges.set(id, badge);
    return badge;
  }

  // User Badge Methods
  async getUserBadges(userId: string): Promise<UserBadge[]> {
    return Array.from(this.userBadges.values()).filter(ub => ub.userId === userId);
  }

  async awardBadge(userId: string, badgeId: string, progress: number = 0): Promise<UserBadge> {
    const id = randomUUID();
    const userBadge: UserBadge = {
      id,
      userId,
      badgeId,
      earnedAt: new Date(),
      progress
    };
    this.userBadges.set(id, userBadge);
    return userBadge;
  }

  // Achievement Methods
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(a => a.userId === userId);
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = randomUUID();
    const achievement: Achievement = { ...insertAchievement, id, createdAt: new Date() };
    this.achievements.set(id, achievement);
    return achievement;
  }

  // Quiz Methods
  async getQuizByLessonId(lessonId: string): Promise<Quiz | undefined> {
    return Array.from(this.quizzes.values()).find(q => q.lessonId === lessonId);
  }

  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const id = randomUUID();
    const quiz: Quiz = { ...insertQuiz, id };
    this.quizzes.set(id, quiz);
    return quiz;
  }

  // Quiz Attempt Methods
  async getUserQuizAttempts(userId: string, quizId?: string): Promise<UserQuizAttempt[]> {
    const attempts = Array.from(this.userQuizAttempts.values()).filter(a => a.userId === userId);
    return quizId ? attempts.filter(a => a.quizId === quizId) : attempts;
  }

  async createQuizAttempt(insertAttempt: InsertUserQuizAttempt): Promise<UserQuizAttempt> {
    const id = randomUUID();
    const attempt: UserQuizAttempt = { ...insertAttempt, id, completedAt: new Date() };
    this.userQuizAttempts.set(id, attempt);
    return attempt;
  }

  // User Stats Methods
  async updateUserXp(userId: string, xpToAdd: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      const newTotalXp = (user.totalXp || 0) + xpToAdd;
      const newLevel = Math.floor(newTotalXp / 500) + 1;
      const updatedUser = { 
        ...user, 
        totalXp: newTotalXp, 
        currentLevel: newLevel,
        lastActivityDate: new Date() 
      };
      this.users.set(userId, updatedUser);
    }
  }

  async updateUserStreak(userId: string, streak: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      const updatedUser = { 
        ...user, 
        streak,
        lastActivityDate: new Date() 
      };
      this.users.set(userId, updatedUser);
    }
  }

  // NFT Collection Methods
  async getAllNftCollections(): Promise<NftCollection[]> {
    return Array.from(this.nftCollections.values());
  }

  async getNftCollection(id: string): Promise<NftCollection | undefined> {
    return this.nftCollections.get(id);
  }

  async createNftCollection(insertCollection: InsertNftCollection): Promise<NftCollection> {
    const id = randomUUID();
    const collection: NftCollection = { ...insertCollection, id, createdAt: new Date() };
    this.nftCollections.set(id, collection);
    return collection;
  }

  // NFT Asset Methods
  async getAllNftAssets(): Promise<NftAsset[]> {
    return Array.from(this.nftAssets.values());
  }

  async getNftAssetsByCollection(collectionId: string): Promise<NftAsset[]> {
    return Array.from(this.nftAssets.values()).filter(a => a.collectionId === collectionId);
  }

  async getUserNftAssets(userId: string): Promise<NftAsset[]> {
    return Array.from(this.nftAssets.values()).filter(a => a.ownerId === userId);
  }

  async createNftAsset(insertAsset: InsertNftAsset): Promise<NftAsset> {
    const id = randomUUID();
    const asset: NftAsset = { ...insertAsset, id, createdAt: new Date() };
    this.nftAssets.set(id, asset);
    return asset;
  }

  async updateNftAssetOwner(assetId: string, newOwnerId: string): Promise<void> {
    const asset = this.nftAssets.get(assetId);
    if (asset) {
      const updatedAsset = { ...asset, ownerId: newOwnerId };
      this.nftAssets.set(assetId, updatedAsset);
    }
  }

  // NFT Trade Methods
  async getUserNftTrades(userId: string): Promise<NftTrade[]> {
    return Array.from(this.nftTrades.values()).filter(t => t.userId === userId);
  }

  async createNftTrade(insertTrade: InsertNftTrade): Promise<NftTrade> {
    const id = randomUUID();
    const trade: NftTrade = { ...insertTrade, id, executedAt: new Date() };
    this.nftTrades.set(id, trade);
    return trade;
  }

  // Chat Room Methods
  async getAllChatRooms(): Promise<ChatRoom[]> {
    return Array.from(this.chatRooms.values())
      .filter(room => room.isActive)
      .sort((a, b) => b.memberCount - a.memberCount);
  }

  async getChatRoom(id: string): Promise<ChatRoom | undefined> {
    return this.chatRooms.get(id);
  }

  async getChatRoomsByType(type: string): Promise<ChatRoom[]> {
    return Array.from(this.chatRooms.values())
      .filter(room => room.type === type && room.isActive)
      .sort((a, b) => b.memberCount - a.memberCount);
  }

  async getChatRoomByCoinSymbol(coinSymbol: string): Promise<ChatRoom | undefined> {
    return Array.from(this.chatRooms.values())
      .find(room => room.coinSymbol === coinSymbol && room.isActive);
  }

  async createChatRoom(insertRoom: InsertChatRoom): Promise<ChatRoom> {
    const id = randomUUID();
    const room: ChatRoom = { 
      ...insertRoom, 
      id, 
      isActive: true,
      memberCount: 0,
      createdAt: new Date() 
    };
    this.chatRooms.set(id, room);
    return room;
  }

  async updateChatRoomMemberCount(roomId: string, memberCount: number): Promise<void> {
    const room = this.chatRooms.get(roomId);
    if (room) {
      const updatedRoom = { ...room, memberCount };
      this.chatRooms.set(roomId, updatedRoom);
    }
  }

  // Chat Message Methods
  async getChatMessages(roomId: string, limit: number = 50): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.roomId === roomId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .slice(-limit);
  }

  async getChatMessage(id: string): Promise<ChatMessage | undefined> {
    return this.chatMessages.get(id);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = { 
      ...insertMessage, 
      id, 
      timestamp: new Date(),
      isEdited: false,
      replyToId: insertMessage.replyToId || null
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async updateChatMessage(messageId: string, content: string): Promise<void> {
    const message = this.chatMessages.get(messageId);
    if (message) {
      const updatedMessage = { ...message, content, isEdited: true };
      this.chatMessages.set(messageId, updatedMessage);
    }
  }

  // Chat Room Member Methods
  async getChatRoomMembers(roomId: string): Promise<ChatRoomMember[]> {
    return Array.from(this.chatRoomMembers.values())
      .filter(member => member.roomId === roomId);
  }

  async getChatRoomMember(roomId: string, userId: string): Promise<ChatRoomMember | undefined> {
    return Array.from(this.chatRoomMembers.values())
      .find(member => member.roomId === roomId && member.userId === userId);
  }

  async joinChatRoom(insertMember: InsertChatRoomMember): Promise<ChatRoomMember> {
    const id = randomUUID();
    const member: ChatRoomMember = { 
      ...insertMember, 
      id, 
      joinedAt: new Date(),
      lastSeen: new Date(),
      isOnline: true
    };
    this.chatRoomMembers.set(id, member);
    return member;
  }

  async leaveChatRoom(roomId: string, userId: string): Promise<void> {
    const memberToRemove = Array.from(this.chatRoomMembers.entries())
      .find(([_, member]) => member.roomId === roomId && member.userId === userId);
    
    if (memberToRemove) {
      this.chatRoomMembers.delete(memberToRemove[0]);
    }
  }

  async updateMemberOnlineStatus(roomId: string, userId: string, isOnline: boolean): Promise<void> {
    const member = Array.from(this.chatRoomMembers.values())
      .find(m => m.roomId === roomId && m.userId === userId);
    
    if (member) {
      const updatedMember = { 
        ...member, 
        isOnline, 
        lastSeen: new Date() 
      };
      this.chatRoomMembers.set(member.id, updatedMember);
    }
  }
}

export const storage = new MemStorage();

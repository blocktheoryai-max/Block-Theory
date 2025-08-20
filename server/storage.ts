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
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize comprehensive gamified lessons
    const comprehensiveLessons = [
      // Beginner - Fundamentals Track
      {
        title: "What is Blockchain?",
        description: "Understanding the foundation of cryptocurrency technology",
        content: "Blockchain is a distributed ledger technology that maintains a continuously growing list of records called blocks...",
        level: "Beginner",
        category: "Fundamentals",
        duration: 15,
        order: 1,
        prerequisites: [],
        learningObjectives: ["Understand distributed ledger technology", "Learn about decentralization", "Grasp immutability concepts"],
        xpReward: 100,
        badgeReward: "blockchain-basics",
        isLocked: false,
        hasQuiz: true,
        hasSimulation: false,
      },
      {
        title: "Bitcoin Fundamentals", 
        description: "Deep dive into the first cryptocurrency",
        content: "Bitcoin was created by Satoshi Nakamoto in 2009 as the world's first cryptocurrency...",
        level: "Beginner",
        category: "Fundamentals",
        duration: 20,
        order: 2,
        prerequisites: [],
        learningObjectives: ["Learn Bitcoin history", "Understand mining", "Study monetary policy"],
        xpReward: 120,
        isLocked: false,
        hasQuiz: true,
        hasSimulation: true,
      },
      {
        title: "Ethereum & Smart Contracts",
        description: "Explore programmable blockchain technology",
        content: "Ethereum introduced the concept of smart contracts to blockchain technology...",
        level: "Beginner",
        category: "Fundamentals", 
        duration: 25,
        order: 3,
        prerequisites: [],
        learningObjectives: ["Understand smart contracts", "Learn about gas fees", "Explore dApps"],
        xpReward: 150,
        isLocked: false,
        hasQuiz: true,
        hasSimulation: true,
      },
      {
        title: "Wallet Security Best Practices",
        description: "Keep your crypto assets safe and secure",
        content: "Cryptocurrency security is paramount in the digital asset space...",
        level: "Beginner",
        category: "Fundamentals",
        duration: 18,
        order: 4,
        prerequisites: [],
        learningObjectives: ["Master private key management", "Learn about hardware wallets", "Understand seed phrases"],
        xpReward: 130,
        badgeReward: "security-guardian",
        isLocked: false,
        hasQuiz: true,
        hasSimulation: false,
      },
      // Intermediate - Technical Analysis
      {
        title: "Reading Candlestick Charts",
        description: "Decode market psychology through price action",
        content: "Candlestick charts provide visual insight into market sentiment and price movements...",
        level: "Intermediate",
        category: "Technical Analysis",
        duration: 22,
        order: 5,
        prerequisites: [],
        learningObjectives: ["Identify candlestick patterns", "Understand market sentiment", "Apply pattern recognition"],
        xpReward: 180,
        isLocked: false,
        hasQuiz: true,
        hasSimulation: true,
      },
      {
        title: "Support & Resistance Levels",
        description: "Find key price levels that matter",
        content: "Support and resistance levels are fundamental concepts in technical analysis...",
        level: "Intermediate",
        category: "Technical Analysis",
        duration: 20,
        order: 6,
        prerequisites: [],
        learningObjectives: ["Draw support/resistance lines", "Identify breakouts", "Set stop losses"],
        xpReward: 170,
        isLocked: false,
        hasQuiz: true,
        hasSimulation: true,
      },
      // Expert Track
      {
        title: "Options Trading Strategies",
        description: "Advanced derivatives trading techniques",
        content: "Options trading in cryptocurrency markets requires sophisticated understanding of derivatives...",
        level: "Expert",
        category: "Advanced Trading",
        duration: 35,
        order: 7,
        prerequisites: [],
        learningObjectives: ["Master options Greeks", "Build complex strategies", "Manage risk effectively"],
        xpReward: 300,
        badgeReward: "options-expert",
        isLocked: true,
        hasQuiz: true,
        hasSimulation: true,
      },
      // DeFi Track
      {
        title: "Liquidity Pools & AMMs",
        description: "Understanding automated market makers",
        content: "Automated Market Makers (AMMs) revolutionized decentralized trading...",
        level: "Intermediate",
        category: "DeFi",
        duration: 30,
        order: 8,
        prerequisites: [],
        learningObjectives: ["Understand liquidity provision", "Learn about impermanent loss", "Use decentralized exchanges"],
        xpReward: 220,
        isLocked: false,
        hasQuiz: true,
        hasSimulation: true,
      },
      // NFT Track
      {
        title: "NFT Rarity Analysis",
        description: "Evaluate digital collectible value",
        content: "NFT rarity analysis involves understanding the traits and characteristics that make tokens valuable...",
        level: "Intermediate",
        category: "NFTs",
        duration: 25,
        order: 9,
        prerequisites: [],
        learningObjectives: ["Analyze rarity traits", "Value NFT collections", "Identify investment opportunities"],
        xpReward: 190,
        badgeReward: "nft-expert",
        isLocked: false,
        hasQuiz: true,
        hasSimulation: true,
      },
      // Trading Psychology
      {
        title: "Managing Trading Emotions",
        description: "Master your psychology for consistent profits",
        content: "Trading psychology is often the difference between successful and unsuccessful traders...",
        level: "Intermediate",
        category: "Trading Psychology",
        duration: 20,
        order: 10,
        prerequisites: [],
        learningObjectives: ["Control fear and greed", "Develop trading discipline", "Build emotional resilience"],
        xpReward: 160,
        badgeReward: "zen-trader",
        isLocked: false,
        hasQuiz: true,
        hasSimulation: false,
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
}

export const storage = new MemStorage();

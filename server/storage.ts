import { type User, type InsertUser, type Lesson, type InsertLesson, type UserProgress, type InsertUserProgress, type Portfolio, type InsertPortfolio, type Trade, type InsertTrade, type ForumPost, type InsertForumPost, type CryptoPrice } from "@shared/schema";
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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private lessons: Map<string, Lesson>;
  private userProgress: Map<string, UserProgress>;
  private portfolios: Map<string, Portfolio>;
  private trades: Map<string, Trade>;
  private forumPosts: Map<string, ForumPost>;
  private cryptoPrices: Map<string, CryptoPrice>;

  constructor() {
    this.users = new Map();
    this.lessons = new Map();
    this.userProgress = new Map();
    this.portfolios = new Map();
    this.trades = new Map();
    this.forumPosts = new Map();
    this.cryptoPrices = new Map();
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default lessons
    const defaultLessons: InsertLesson[] = [
      {
        title: "What is Blockchain?",
        description: "Understanding the fundamental technology behind cryptocurrencies",
        content: "Learn about distributed ledgers, consensus mechanisms, and how blockchain works.",
        level: "Beginner",
        duration: 15,
        order: 1,
        isLocked: false,
      },
      {
        title: "Reading Candlestick Charts",
        description: "Master the art of technical analysis with candlestick patterns",
        content: "Learn to read candlestick charts, identify patterns, and make informed trading decisions.",
        level: "Intermediate",
        duration: 25,
        order: 2,
        isLocked: false,
      },
      {
        title: "Risk Management Strategies",
        description: "Advanced risk management techniques for crypto trading",
        content: "Learn position sizing, stop-loss strategies, and portfolio management.",
        level: "Advanced",
        duration: 35,
        order: 3,
        isLocked: true,
      },
    ];

    defaultLessons.forEach(lesson => this.createLesson(lesson));

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
}

export const storage = new MemStorage();

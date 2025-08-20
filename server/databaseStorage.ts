import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  lessons,
  userProgress,
  portfolios,
  trades,
  cryptoPrices,
  forumPosts,
  nftCollections,
  nftAssets,
  nftTrades,
  chatRooms,
  chatMessages,
  chatRoomMembers,
  subscriptionPlans,
  paymentTransactions,
  tradingSignals,
  tradingConnections,
  achievements,
  premiumContent,
} from "@shared/schema";
import type {
  User,
  UpsertUser,
  Lesson,
  InsertLesson,
  UserProgress,
  InsertUserProgress,
  Portfolio,
  InsertPortfolio,
  Trade,
  InsertTrade,
  CryptoPrice,
  InsertCryptoPrice,
  ForumPost,
  InsertForumPost,
  NftCollection,
  InsertNftCollection,
  NftAsset,
  InsertNftAsset,
  NftTrade,
  InsertNftTrade,
  ChatRoom,
  InsertChatRoom,
  ChatMessage,
  InsertChatMessage,
  ChatRoomMember,
  InsertChatRoomMember,
  SubscriptionPlan,
  InsertSubscriptionPlan,
  PaymentTransaction,
  InsertPaymentTransaction,
  TradingSignal,
  InsertTradingSignal,
  TradingConnection,
  InsertTradingConnection,
} from "@shared/schema";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserSubscription(userId: string, tier: string, status: string, stripeSubscriptionId?: string): Promise<void>;
  updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<void>;
  
  // Lesson operations
  getAllLessons(): Promise<Lesson[]>;
  getLesson(id: string): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  getLessonsByTier(requiredTier: string): Promise<Lesson[]>;
  
  // User progress operations
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getUserProgressByLesson(userId: string, lessonId: string): Promise<UserProgress | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(id: string, updates: Partial<UserProgress>): Promise<void>;
  
  // Portfolio operations
  getUserPortfolio(userId: string): Promise<Portfolio[]>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(id: string, updates: Partial<Portfolio>): Promise<void>;
  
  // Trade operations
  getUserTrades(userId: string): Promise<Trade[]>;
  createTrade(trade: InsertTrade): Promise<Trade>;
  
  // Crypto price operations
  getCryptoPrices(): Promise<CryptoPrice[]>;
  getCryptoPrice(symbol: string): Promise<CryptoPrice | undefined>;
  updateCryptoPrice(symbol: string, price: string, change24h: string): Promise<void>;
  
  // Forum operations
  getAllForumPosts(): Promise<ForumPost[]>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  
  // NFT operations
  getAllNftCollections(): Promise<NftCollection[]>;
  getNftCollection(id: string): Promise<NftCollection | undefined>;
  createNftCollection(collection: InsertNftCollection): Promise<NftCollection>;
  getAllNftAssets(): Promise<NftAsset[]>;
  getNftAssetsByCollection(collectionId: string): Promise<NftAsset[]>;
  getUserNftAssets(userId: string): Promise<NftAsset[]>;
  createNftAsset(asset: InsertNftAsset): Promise<NftAsset>;
  updateNftAssetOwner(assetId: string, newOwnerId: string): Promise<void>;
  getUserNftTrades(userId: string): Promise<NftTrade[]>;
  createNftTrade(trade: InsertNftTrade): Promise<NftTrade>;
  
  // Chat operations
  getAllChatRooms(): Promise<ChatRoom[]>;
  getChatRoom(id: string): Promise<ChatRoom | undefined>;
  getChatRoomsByType(type: string): Promise<ChatRoom[]>;
  getChatRoomByCoinSymbol(coinSymbol: string): Promise<ChatRoom | undefined>;
  createChatRoom(room: InsertChatRoom): Promise<ChatRoom>;
  updateChatRoomMemberCount(roomId: string, memberCount: number): Promise<void>;
  getChatMessages(roomId: string, limit?: number): Promise<ChatMessage[]>;
  getChatMessage(id: string): Promise<ChatMessage | undefined>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  updateChatMessage(messageId: string, content: string): Promise<void>;
  getChatRoomMembers(roomId: string): Promise<ChatRoomMember[]>;
  getChatRoomMember(roomId: string, userId: string): Promise<ChatRoomMember | undefined>;
  joinChatRoom(member: InsertChatRoomMember): Promise<ChatRoomMember>;
  leaveChatRoom(roomId: string, userId: string): Promise<void>;
  updateMemberOnlineStatus(roomId: string, userId: string, isOnline: boolean): Promise<void>;
  
  // Subscription operations
  getAllSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  getSubscriptionPlan(id: string): Promise<SubscriptionPlan | undefined>;
  getSubscriptionPlanByTier(tier: string): Promise<SubscriptionPlan | undefined>;
  createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan>;
  
  // Payment operations
  getUserPayments(userId: string): Promise<PaymentTransaction[]>;
  createPayment(payment: InsertPaymentTransaction): Promise<PaymentTransaction>;
  updatePaymentStatus(id: string, status: string): Promise<void>;
  
  // Trading signals operations
  getTradingSignals(requiredTier?: string): Promise<TradingSignal[]>;
  createTradingSignal(signal: InsertTradingSignal): Promise<TradingSignal>;
  updateTradingSignalStatus(id: string, status: string): Promise<void>;
  
  // Trading connections operations
  getUserTradingConnections(userId: string): Promise<TradingConnection[]>;
  createTradingConnection(connection: InsertTradingConnection): Promise<TradingConnection>;
  updateTradingConnectionStatus(id: string, isActive: boolean): Promise<void>;

  // User analytics and achievement operations
  updateUserXp(userId: string, xp: number): Promise<void>;
  updateUserLevel(userId: string, level: number): Promise<void>;
  updateUserStreak(userId: string, streak: number): Promise<void>;

  // New monetization feature operations
  getAchievements(): Promise<any[]>;
  getPremiumContent(): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserSubscription(userId: string, tier: string, status: string, stripeSubscriptionId?: string): Promise<void> {
    await db
      .update(users)
      .set({
        subscriptionTier: tier,
        subscriptionStatus: status,
        stripeSubscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<void> {
    await db
      .update(users)
      .set({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  // Lesson operations
  async getAllLessons(): Promise<Lesson[]> {
    return await db.select().from(lessons).orderBy(lessons.order);
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson;
  }

  async createLesson(lessonData: InsertLesson): Promise<Lesson> {
    const [lesson] = await db.insert(lessons).values(lessonData).returning();
    return lesson;
  }

  async getLessonsByTier(requiredTier: string): Promise<Lesson[]> {
    const tierLevels = { free: 0, basic: 1, pro: 2, elite: 3 };
    const tierLevel = tierLevels[requiredTier as keyof typeof tierLevels] || 0;
    
    return await db
      .select()
      .from(lessons)
      .where(
        sql`CASE 
          WHEN ${lessons.requiredTier} = 'free' THEN 0
          WHEN ${lessons.requiredTier} = 'basic' THEN 1
          WHEN ${lessons.requiredTier} = 'pro' THEN 2
          WHEN ${lessons.requiredTier} = 'elite' THEN 3
          ELSE 0
        END <= ${tierLevel}`
      )
      .orderBy(lessons.order);
  }

  // User progress operations
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async getUserProgressByLesson(userId: string, lessonId: string): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)));
    return progress;
  }

  async createUserProgress(progressData: InsertUserProgress): Promise<UserProgress> {
    const [progress] = await db.insert(userProgress).values(progressData).returning();
    return progress;
  }

  async updateUserProgress(id: string, updates: Partial<UserProgress>): Promise<void> {
    await db.update(userProgress).set(updates).where(eq(userProgress.id, id));
  }

  // Portfolio operations
  async getUserPortfolio(userId: string): Promise<Portfolio[]> {
    return await db.select().from(portfolios).where(eq(portfolios.userId, userId));
  }

  async createPortfolio(portfolioData: InsertPortfolio): Promise<Portfolio> {
    const [portfolio] = await db.insert(portfolios).values(portfolioData).returning();
    return portfolio;
  }

  async updatePortfolio(id: string, updates: Partial<Portfolio>): Promise<void> {
    await db.update(portfolios).set({ ...updates, updatedAt: new Date() }).where(eq(portfolios.id, id));
  }

  // Trade operations
  async getUserTrades(userId: string): Promise<Trade[]> {
    return await db.select().from(trades).where(eq(trades.userId, userId)).orderBy(desc(trades.executedAt));
  }

  async createTrade(tradeData: InsertTrade): Promise<Trade> {
    const [trade] = await db.insert(trades).values(tradeData).returning();
    return trade;
  }

  // Crypto price operations
  async getCryptoPrices(): Promise<CryptoPrice[]> {
    return await db.select().from(cryptoPrices);
  }

  async getCryptoPrice(symbol: string): Promise<CryptoPrice | undefined> {
    const [price] = await db.select().from(cryptoPrices).where(eq(cryptoPrices.symbol, symbol));
    return price;
  }

  async updateCryptoPrice(symbol: string, price: string, change24h: string): Promise<void> {
    await db
      .update(cryptoPrices)
      .set({ price, change24h, lastUpdated: new Date() })
      .where(eq(cryptoPrices.symbol, symbol));
  }

  // Forum operations
  async getAllForumPosts(): Promise<ForumPost[]> {
    return await db.select().from(forumPosts).orderBy(desc(forumPosts.createdAt));
  }

  async createForumPost(postData: InsertForumPost): Promise<ForumPost> {
    const [post] = await db.insert(forumPosts).values(postData).returning();
    return post;
  }

  // NFT operations
  async getAllNftCollections(): Promise<NftCollection[]> {
    return await db.select().from(nftCollections);
  }

  async getNftCollection(id: string): Promise<NftCollection | undefined> {
    const [collection] = await db.select().from(nftCollections).where(eq(nftCollections.id, id));
    return collection;
  }

  async createNftCollection(collectionData: InsertNftCollection): Promise<NftCollection> {
    const [collection] = await db.insert(nftCollections).values(collectionData).returning();
    return collection;
  }

  async getAllNftAssets(): Promise<NftAsset[]> {
    return await db.select().from(nftAssets);
  }

  async getNftAssetsByCollection(collectionId: string): Promise<NftAsset[]> {
    return await db.select().from(nftAssets).where(eq(nftAssets.collectionId, collectionId));
  }

  async getUserNftAssets(userId: string): Promise<NftAsset[]> {
    return await db.select().from(nftAssets).where(eq(nftAssets.ownerId, userId));
  }

  async createNftAsset(assetData: InsertNftAsset): Promise<NftAsset> {
    const [asset] = await db.insert(nftAssets).values(assetData).returning();
    return asset;
  }

  async updateNftAssetOwner(assetId: string, newOwnerId: string): Promise<void> {
    await db.update(nftAssets).set({ ownerId: newOwnerId }).where(eq(nftAssets.id, assetId));
  }

  async getUserNftTrades(userId: string): Promise<NftTrade[]> {
    return await db.select().from(nftTrades).where(eq(nftTrades.userId, userId));
  }

  async createNftTrade(tradeData: InsertNftTrade): Promise<NftTrade> {
    const [trade] = await db.insert(nftTrades).values(tradeData).returning();
    return trade;
  }

  // Chat operations
  async getAllChatRooms(): Promise<ChatRoom[]> {
    return await db
      .select()
      .from(chatRooms)
      .where(eq(chatRooms.isActive, true))
      .orderBy(desc(chatRooms.memberCount));
  }

  async getChatRoom(id: string): Promise<ChatRoom | undefined> {
    const [room] = await db.select().from(chatRooms).where(eq(chatRooms.id, id));
    return room;
  }

  async getChatRoomsByType(type: string): Promise<ChatRoom[]> {
    return await db
      .select()
      .from(chatRooms)
      .where(and(eq(chatRooms.type, type), eq(chatRooms.isActive, true)))
      .orderBy(desc(chatRooms.memberCount));
  }

  async getChatRoomByCoinSymbol(coinSymbol: string): Promise<ChatRoom | undefined> {
    const [room] = await db
      .select()
      .from(chatRooms)
      .where(and(eq(chatRooms.coinSymbol, coinSymbol), eq(chatRooms.isActive, true)));
    return room;
  }

  async createChatRoom(roomData: InsertChatRoom): Promise<ChatRoom> {
    const [room] = await db.insert(chatRooms).values(roomData).returning();
    return room;
  }

  async updateChatRoomMemberCount(roomId: string, memberCount: number): Promise<void> {
    await db.update(chatRooms).set({ memberCount }).where(eq(chatRooms.id, roomId));
  }

  async getChatMessages(roomId: string, limit: number = 50): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.roomId, roomId))
      .orderBy(desc(chatMessages.timestamp))
      .limit(limit);
  }

  async getChatMessage(id: string): Promise<ChatMessage | undefined> {
    const [message] = await db.select().from(chatMessages).where(eq(chatMessages.id, id));
    return message;
  }

  async createChatMessage(messageData: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db.insert(chatMessages).values(messageData).returning();
    return message;
  }

  async updateChatMessage(messageId: string, content: string): Promise<void> {
    await db.update(chatMessages).set({ content, isEdited: true }).where(eq(chatMessages.id, messageId));
  }

  async getChatRoomMembers(roomId: string): Promise<ChatRoomMember[]> {
    return await db.select().from(chatRoomMembers).where(eq(chatRoomMembers.roomId, roomId));
  }

  async getChatRoomMember(roomId: string, userId: string): Promise<ChatRoomMember | undefined> {
    const [member] = await db
      .select()
      .from(chatRoomMembers)
      .where(and(eq(chatRoomMembers.roomId, roomId), eq(chatRoomMembers.userId, userId)));
    return member;
  }

  async joinChatRoom(memberData: InsertChatRoomMember): Promise<ChatRoomMember> {
    const [member] = await db.insert(chatRoomMembers).values(memberData).returning();
    return member;
  }

  async leaveChatRoom(roomId: string, userId: string): Promise<void> {
    await db
      .delete(chatRoomMembers)
      .where(and(eq(chatRoomMembers.roomId, roomId), eq(chatRoomMembers.userId, userId)));
  }

  async updateMemberOnlineStatus(roomId: string, userId: string, isOnline: boolean): Promise<void> {
    await db
      .update(chatRoomMembers)
      .set({ isOnline, lastSeen: new Date() })
      .where(and(eq(chatRoomMembers.roomId, roomId), eq(chatRoomMembers.userId, userId)));
  }

  // Subscription operations
  async getAllSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, true));
  }

  async getSubscriptionPlan(id: string): Promise<SubscriptionPlan | undefined> {
    const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id));
    return plan;
  }

  async getSubscriptionPlanByTier(tier: string): Promise<SubscriptionPlan | undefined> {
    const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.tier, tier));
    return plan;
  }

  async createSubscriptionPlan(planData: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const [plan] = await db.insert(subscriptionPlans).values(planData).returning();
    return plan;
  }

  // Payment operations
  async getUserPayments(userId: string): Promise<PaymentTransaction[]> {
    return await db.select().from(paymentTransactions).where(eq(paymentTransactions.userId, userId));
  }

  async createPayment(paymentData: InsertPaymentTransaction): Promise<PaymentTransaction> {
    const [payment] = await db.insert(paymentTransactions).values(paymentData).returning();
    return payment;
  }

  async updatePaymentStatus(id: string, status: string): Promise<void> {
    await db.update(paymentTransactions).set({ status }).where(eq(paymentTransactions.id, id));
  }

  // Trading signals operations
  async getTradingSignals(requiredTier?: string): Promise<TradingSignal[]> {
    let query = db.select().from(tradingSignals).where(eq(tradingSignals.status, "active"));
    
    if (requiredTier) {
      const tierLevels = { free: 0, basic: 1, pro: 2, elite: 3 };
      const tierLevel = tierLevels[requiredTier as keyof typeof tierLevels] || 0;
      
      query = query.where(
        sql`CASE 
          WHEN ${tradingSignals.requiredTier} = 'free' THEN 0
          WHEN ${tradingSignals.requiredTier} = 'basic' THEN 1
          WHEN ${tradingSignals.requiredTier} = 'pro' THEN 2
          WHEN ${tradingSignals.requiredTier} = 'elite' THEN 3
          ELSE 0
        END <= ${tierLevel}`
      );
    }
    
    return await query.orderBy(desc(tradingSignals.createdAt));
  }

  async createTradingSignal(signalData: InsertTradingSignal): Promise<TradingSignal> {
    const [signal] = await db.insert(tradingSignals).values(signalData).returning();
    return signal;
  }

  async updateTradingSignalStatus(id: string, status: string): Promise<void> {
    await db.update(tradingSignals).set({ status }).where(eq(tradingSignals.id, id));
  }

  // Trading connections operations
  async getUserTradingConnections(userId: string): Promise<TradingConnection[]> {
    return await db.select().from(tradingConnections).where(eq(tradingConnections.userId, userId));
  }

  async createTradingConnection(connectionData: InsertTradingConnection): Promise<TradingConnection> {
    const [connection] = await db.insert(tradingConnections).values(connectionData).returning();
    return connection;
  }

  async updateTradingConnectionStatus(id: string, isActive: boolean): Promise<void> {
    await db.update(tradingConnections).set({ isActive, lastUsed: new Date() }).where(eq(tradingConnections.id, id));
  }

  // Achievement operations
  async getAchievements(): Promise<any[]> {
    return await db.select().from(achievements);
  }

  // Premium content operations  
  async getPremiumContent(): Promise<any[]> {
    return await db.select().from(premiumContent);
  }

  // User analytics operations
  async updateUserXp(userId: string, xp: number): Promise<void> {
    await db
      .update(users)
      .set({ totalXp: xp, lastActivityDate: new Date(), updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async updateUserLevel(userId: string, level: number): Promise<void> {
    await db
      .update(users)
      .set({ currentLevel: level, lastActivityDate: new Date(), updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async updateUserStreak(userId: string, streak: number): Promise<void> {
    await db
      .update(users)
      .set({ streak, lastActivityDate: new Date(), updatedAt: new Date() })
      .where(eq(users.id, userId));
  }
}
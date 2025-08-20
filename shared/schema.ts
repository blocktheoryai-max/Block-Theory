import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  portfolioValue: decimal("portfolio_value", { precision: 10, scale: 2 }).default("10000.00"),
  totalXp: integer("total_xp").default(0),
  currentLevel: integer("current_level").default(1),
  streak: integer("streak").default(0),
  lastActivityDate: timestamp("last_activity_date"),
  // Subscription fields
  subscriptionTier: text("subscription_tier").default("free"), // "free", "basic", "pro", "elite"
  subscriptionStatus: text("subscription_status").default("active"), // "active", "canceled", "past_due"
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  // Trial and promotional
  trialEndDate: timestamp("trial_end_date"),
  referralCode: text("referral_code"),
  referredBy: text("referred_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  level: text("level").notNull(), // "Beginner", "Intermediate", "Expert"
  category: text("category").notNull(), // "Fundamentals", "Technical Analysis", "DeFi", "NFTs", "Trading Psychology"
  duration: integer("duration").notNull(), // in minutes: 10, 20, 30, 45
  format: text("format").notNull(), // "Quick", "Standard", "Deep Dive", "Masterclass"
  order: integer("order").notNull(),
  prerequisites: text("prerequisites").array().default([]),
  learningObjectives: text("learning_objectives").array().default([]),
  xpReward: integer("xp_reward").default(100),
  badgeReward: text("badge_reward"), // Optional badge ID awarded on completion
  isLocked: boolean("is_locked").default(false),
  hasQuiz: boolean("has_quiz").default(false),
  hasSimulation: boolean("has_simulation").default(false),
  hasVideo: boolean("has_video").default(false),
  videoUrl: text("video_url"), // URL for lesson video
  videoThumbnail: text("video_thumbnail"), // Video thumbnail image
  videoDuration: integer("video_duration"), // Video length in seconds
  videoTranscript: text("video_transcript"), // Video transcript for accessibility
  interactiveElements: jsonb("interactive_elements"), // Video overlays, timestamps, etc.
  // Premium content restrictions
  requiredTier: text("required_tier").default("free"), // "free", "basic", "pro", "elite"
  isPremium: boolean("is_premium").default(false),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  lessonId: varchar("lesson_id").references(() => lessons.id).notNull(),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  progress: integer("progress").default(0), // percentage
  quizScore: integer("quiz_score"), // percentage if quiz completed
  timeSpent: integer("time_spent").default(0), // in minutes
  attempts: integer("attempts").default(0),
});

export const portfolios = pgTable("portfolios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  symbol: text("symbol").notNull(), // "BTC", "ETH", etc.
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  averagePrice: decimal("average_price", { precision: 10, scale: 2 }).notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const trades = pgTable("trades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  symbol: text("symbol").notNull(),
  type: text("type").notNull(), // "buy" or "sell"
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  totalValue: decimal("total_value", { precision: 10, scale: 2 }).notNull(),
  executedAt: timestamp("executed_at").defaultNow(),
});

export const forumPosts = pgTable("forum_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  likes: integer("likes").default(0),
  replies: integer("replies").default(0),
  views: integer("views").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cryptoPrices = pgTable("crypto_prices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  change24h: decimal("change_24h", { precision: 5, scale: 2 }),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const nftCollections = pgTable("nft_collections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  floorPrice: decimal("floor_price", { precision: 10, scale: 4 }).notNull(),
  totalVolume: decimal("total_volume", { precision: 15, scale: 4 }).notNull(),
  owners: integer("owners").notNull(),
  totalSupply: integer("total_supply").notNull(),
  change24h: decimal("change_24h", { precision: 5, scale: 2 }),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const nftAssets = pgTable("nft_assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tokenId: text("token_id").notNull(),
  collectionId: varchar("collection_id").references(() => nftCollections.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  price: decimal("price", { precision: 10, scale: 4 }),
  rarity: text("rarity"), // "Common", "Rare", "Epic", "Legendary"
  attributes: jsonb("attributes"), // JSON array of traits
  ownerId: varchar("owner_id").references(() => users.id),
  listedForSale: boolean("listed_for_sale").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const nftTrades = pgTable("nft_trades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  nftAssetId: varchar("nft_asset_id").references(() => nftAssets.id).notNull(),
  type: text("type").notNull(), // "buy" or "sell"
  price: decimal("price", { precision: 10, scale: 4 }).notNull(),
  marketplace: text("marketplace").default("TradeTutor"), // "OpenSea", "TradeTutor", etc.
  executedAt: timestamp("executed_at").defaultNow(),
});

export const chatRooms = pgTable("chat_rooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // "general", "coin-specific", "trading-signals", "technical-analysis"
  coinSymbol: text("coin_symbol"), // For coin-specific rooms (BTC, ETH, etc.)
  isActive: boolean("is_active").default(true),
  memberCount: integer("member_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomId: varchar("room_id").references(() => chatRooms.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  username: text("username").notNull(),
  content: text("content").notNull(),
  messageType: text("message_type").default("text"), // "text", "trade-signal", "price-alert", "image"
  metadata: jsonb("metadata"), // For trade signals, price data, etc.
  timestamp: timestamp("timestamp").defaultNow(),
  isEdited: boolean("is_edited").default(false),
  replyToId: varchar("reply_to_id").references(() => chatMessages.id),
});

export const chatRoomMembers = pgTable("chat_room_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomId: varchar("room_id").references(() => chatRooms.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  role: text("role").default("member"), // "member", "moderator", "admin"
  joinedAt: timestamp("joined_at").defaultNow(),
  lastSeen: timestamp("last_seen").defaultNow(),
  isOnline: boolean("is_online").default(false),
});

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Subscription plans table
export const subscriptionPlans = pgTable("subscription_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // "Free", "Basic", "Pro", "Elite"
  tier: text("tier").notNull(), // "free", "basic", "pro", "elite"
  priceMonthly: decimal("price_monthly", { precision: 8, scale: 2 }).notNull(),
  priceYearly: decimal("price_yearly", { precision: 8, scale: 2 }),
  stripePriceIdMonthly: text("stripe_price_id_monthly"),
  stripePriceIdYearly: text("stripe_price_id_yearly"),
  features: jsonb("features").notNull(), // Array of feature descriptions
  maxLessons: integer("max_lessons"), // null = unlimited
  hasSimulator: boolean("has_simulator").default(false),
  hasCommunity: boolean("has_community").default(false),
  hasAnalytics: boolean("has_analytics").default(false),
  hasLiveTrading: boolean("has_live_trading").default(false),
  hasMentoring: boolean("has_mentoring").default(false),
  hasSignals: boolean("has_signals").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Payment transactions
export const paymentTransactions = pgTable("payment_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("usd"),
  status: text("status").notNull(), // "pending", "succeeded", "failed", "canceled"
  type: text("type").notNull(), // "subscription", "one_time", "upgrade", "downgrade"
  planId: varchar("plan_id").references(() => subscriptionPlans.id),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Trading signals for premium users
export const tradingSignals = pgTable("trading_signals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  symbol: text("symbol").notNull(), // "BTC", "ETH", etc.
  signalType: text("signal_type").notNull(), // "buy", "sell", "hold"
  entryPrice: decimal("entry_price", { precision: 15, scale: 8 }),
  targetPrice: decimal("target_price", { precision: 15, scale: 8 }),
  stopLoss: decimal("stop_loss", { precision: 15, scale: 8 }),
  confidence: integer("confidence"), // 1-100
  reasoning: text("reasoning"),
  status: text("status").default("active"), // "active", "hit_target", "hit_stop", "expired"
  requiredTier: text("required_tier").default("pro"), // Minimum tier to see signal
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Live trading API connections for advanced users
export const tradingConnections = pgTable("trading_connections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  exchangeName: text("exchange_name").notNull(), // "binance", "coinbase", "kraken"
  apiKeyEncrypted: text("api_key_encrypted").notNull(),
  apiSecretEncrypted: text("api_secret_encrypted").notNull(),
  permissions: text("permissions").array().default([]), // ["read", "trade", "withdraw"]
  isActive: boolean("is_active").default(true),
  lastUsed: timestamp("last_used"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  completedAt: true,
});

export const insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
  updatedAt: true,
});

export const insertTradeSchema = createInsertSchema(trades).omit({
  id: true,
  executedAt: true,
});

export const insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  createdAt: true,
});

export const insertNftCollectionSchema = createInsertSchema(nftCollections).omit({
  id: true,
  createdAt: true,
});

export const insertNftAssetSchema = createInsertSchema(nftAssets).omit({
  id: true,
  createdAt: true,
});

export const insertNftTradeSchema = createInsertSchema(nftTrades).omit({
  id: true,
  executedAt: true,
});

export const insertChatRoomSchema = createInsertSchema(chatRooms).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export const insertChatRoomMemberSchema = createInsertSchema(chatRoomMembers).omit({
  id: true,
  joinedAt: true,
  lastSeen: true,
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentTransactionSchema = createInsertSchema(paymentTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertTradingSignalSchema = createInsertSchema(tradingSignals).omit({
  id: true,
  createdAt: true,
});

export const insertTradingConnectionSchema = createInsertSchema(tradingConnections).omit({
  id: true,
  createdAt: true,
});

export const insertCryptoPriceSchema = createInsertSchema(cryptoPrices).omit({
  id: true,
  lastUpdated: true,
});

// Badge and Achievement System
export const badges = pgTable("badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(), // Icon name or URL
  category: text("category").notNull(), // "Learning", "Trading", "Community", "Achievement"
  rarity: text("rarity").notNull(), // "Common", "Rare", "Epic", "Legendary"
  xpRequired: integer("xp_required").default(0),
  condition: text("condition").notNull(), // Description of how to earn
  isHidden: boolean("is_hidden").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userBadges = pgTable("user_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  badgeId: varchar("badge_id").references(() => badges.id).notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
  progress: integer("progress").default(0), // For progressive badges
});

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // "lesson_complete", "streak", "trade_profit", etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  xpEarned: integer("xp_earned").default(0),
  metadata: jsonb("metadata"), // Additional data about the achievement
  createdAt: timestamp("created_at").defaultNow(),
});

export const quizzes = pgTable("quizzes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lessonId: varchar("lesson_id").references(() => lessons.id).notNull(),
  questions: jsonb("questions").notNull(), // Array of question objects
  passingScore: integer("passing_score").default(70),
  timeLimit: integer("time_limit").default(0), // in minutes, 0 = unlimited
});

export const userQuizAttempts = pgTable("user_quiz_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  quizId: varchar("quiz_id").references(() => quizzes.id).notNull(),
  score: integer("score").notNull(),
  answers: jsonb("answers").notNull(), // User's answers
  timeSpent: integer("time_spent").default(0), // in seconds
  completedAt: timestamp("completed_at").defaultNow(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessons.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type Portfolio = typeof portfolios.$inferSelect;
export type InsertTrade = z.infer<typeof insertTradeSchema>;
export type Trade = typeof trades.$inferSelect;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type ForumPost = typeof forumPosts.$inferSelect;
export type CryptoPrice = typeof cryptoPrices.$inferSelect;
export type InsertNftCollection = z.infer<typeof insertNftCollectionSchema>;
export type NftCollection = typeof nftCollections.$inferSelect;
export type InsertNftAsset = z.infer<typeof insertNftAssetSchema>;
export type NftAsset = typeof nftAssets.$inferSelect;
export type InsertNftTrade = z.infer<typeof insertNftTradeSchema>;
export type NftTrade = typeof nftTrades.$inferSelect;
export type InsertChatRoom = z.infer<typeof insertChatRoomSchema>;
export type ChatRoom = typeof chatRooms.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatRoomMember = z.infer<typeof insertChatRoomMemberSchema>;
export type ChatRoomMember = typeof chatRoomMembers.$inferSelect;
export type InsertCryptoPrice = z.infer<typeof insertCryptoPriceSchema>;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertPaymentTransaction = z.infer<typeof insertPaymentTransactionSchema>;
export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type InsertTradingSignal = z.infer<typeof insertTradingSignalSchema>;
export type TradingSignal = typeof tradingSignals.$inferSelect;
export type InsertTradingConnection = z.infer<typeof insertTradingConnectionSchema>;
export type TradingConnection = typeof tradingConnections.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;

export const insertBadgeSchema = createInsertSchema(badges).omit({
  id: true,
  createdAt: true,
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({
  id: true,
  earnedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
});

export const insertUserQuizAttemptSchema = createInsertSchema(userQuizAttempts).omit({
  id: true,
  completedAt: true,
});

export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type Badge = typeof badges.$inferSelect;
export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
export type UserBadge = typeof userBadges.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzes.$inferSelect;
export type InsertUserQuizAttempt = z.infer<typeof insertUserQuizAttemptSchema>;
export type UserQuizAttempt = typeof userQuizAttempts.$inferSelect;

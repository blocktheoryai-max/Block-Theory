import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
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
  // Web3 and rewards fields
  walletAddress: text("wallet_address"),
  totalEarnings: decimal("total_earnings", { precision: 20, scale: 8 }).default("0"),
  pendingRewards: decimal("pending_rewards", { precision: 20, scale: 8 }).default("0"),
  claimedRewards: decimal("claimed_rewards", { precision: 20, scale: 8 }).default("0"),
  nftCertificates: integer("nft_certificates").default(0),
  competitionWins: integer("competition_wins").default(0),
  affiliateEarnings: decimal("affiliate_earnings", { precision: 20, scale: 8 }).default("0"),
  learningStreak: integer("learning_streak").default(0),
  aiLearningPath: jsonb("ai_learning_path"),
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
  tags: text("tags").array().default([]),
});

// Quiz questions for interactive lessons
export const quizQuestions = pgTable("quiz_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lessonId: varchar("lesson_id").references(() => lessons.id).notNull(),
  question: text("question").notNull(),
  options: jsonb("options").notNull(), // Array of answer options
  correctAnswer: integer("correct_answer").notNull(), // Index of correct option
  explanation: text("explanation"), // Why this answer is correct
  points: integer("points").default(10),
  order: integer("order").notNull(),
});

// Knowledge check exercises
export const knowledgeChecks = pgTable("knowledge_checks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lessonId: varchar("lesson_id").references(() => lessons.id).notNull(),
  type: text("type").notNull(), // "multiple_choice", "drag_drop", "scenario", "calculation"
  title: text("title").notNull(),
  description: text("description"),
  content: jsonb("content").notNull(), // Exercise-specific data
  solution: jsonb("solution").notNull(), // Correct answer/approach
  hints: text("hints").array().default([]),
  points: integer("points").default(20),
  order: integer("order").notNull(),
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
  quizAnswers: jsonb("quiz_answers"), // User's quiz responses
  exerciseScores: jsonb("exercise_scores"), // Scores for knowledge checks
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

// Learn-to-Earn rewards tracking
export const rewards = pgTable("rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  lessonId: varchar("lesson_id").references(() => lessons.id),
  type: text("type").notNull(), // "lesson_completion", "quiz_perfect", "streak_bonus", "referral", "competition"
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  token: text("token").default("USDC"),
  status: text("status").default("pending"), // "pending", "claimed", "expired"
  transactionHash: text("transaction_hash"),
  claimedAt: timestamp("claimed_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Trading competitions
export const competitions = pgTable("competitions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // "daily", "weekly", "monthly", "sponsored"
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  prizePool: decimal("prize_pool", { precision: 20, scale: 8 }).notNull(),
  prizeToken: text("prize_token").default("USDC"),
  sponsorId: text("sponsor_id"),
  minParticipants: integer("min_participants").default(10),
  maxParticipants: integer("max_participants"),
  entryFee: decimal("entry_fee", { precision: 20, scale: 8 }).default("0"),
  rules: jsonb("rules"),
  status: text("status").default("upcoming"), // "upcoming", "active", "completed", "cancelled"
  createdAt: timestamp("created_at").defaultNow(),
});

// Competition participants
export const competitionParticipants = pgTable("competition_participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  competitionId: varchar("competition_id").references(() => competitions.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  portfolioValue: decimal("portfolio_value", { precision: 20, scale: 8 }).default("10000"),
  finalValue: decimal("final_value", { precision: 20, scale: 8 }),
  rank: integer("rank"),
  pnl: decimal("pnl", { precision: 20, scale: 8 }),
  pnlPercentage: decimal("pnl_percentage", { precision: 10, scale: 2 }),
  trades: integer("trades").default(0),
  winRate: decimal("win_rate", { precision: 10, scale: 2 }),
  prizeClaimed: boolean("prize_claimed").default(false),
  prizeAmount: decimal("prize_amount", { precision: 20, scale: 8 }),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// NFT certificates
export const nftCertificates = pgTable("nft_certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  lessonId: varchar("lesson_id").references(() => lessons.id),
  competitionId: varchar("competition_id").references(() => competitions.id),
  type: text("type").notNull(), // "course_completion", "achievement", "competition_winner", "skill_badge"
  title: text("title").notNull(),
  description: text("description"),
  metadata: jsonb("metadata"), // NFT metadata (image URL, attributes, etc.)
  tokenId: text("token_id"),
  contractAddress: text("contract_address"),
  chainId: integer("chain_id").default(137), // Polygon by default
  mintTransactionHash: text("mint_transaction_hash"),
  ipfsHash: text("ipfs_hash"),
  rarity: text("rarity").default("common"), // "common", "rare", "epic", "legendary"
  mintedAt: timestamp("minted_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Referral tracking
export const referrals = pgTable("referrals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referrerId: varchar("referrer_id").references(() => users.id).notNull(),
  referredUserId: varchar("referred_user_id").references(() => users.id).notNull(),
  status: text("status").default("pending"), // "pending", "active", "rewarded"
  rewardAmount: decimal("reward_amount", { precision: 20, scale: 8 }).default("5"),
  rewardToken: text("reward_token").default("USDC"),
  referredUserTier: text("referred_user_tier"),
  conversionDate: timestamp("conversion_date"),
  rewardPaidAt: timestamp("reward_paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI-powered learning paths
export const learningPaths = pgTable("learning_paths", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  goal: text("goal"), // "become_trader", "understand_defi", "master_nfts", etc.
  difficulty: text("difficulty").default("beginner"),
  lessons: text("lessons").array().default([]), // Array of lesson IDs
  completedLessons: text("completed_lessons").array().default([]),
  progress: integer("progress").default(0),
  estimatedHours: integer("estimated_hours"),
  aiGenerated: boolean("ai_generated").default(true),
  aiRecommendations: jsonb("ai_recommendations"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

// Export types for the interactive features
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = typeof quizQuestions.$inferInsert;
export type KnowledgeCheck = typeof knowledgeChecks.$inferSelect;
export type InsertKnowledgeCheck = typeof knowledgeChecks.$inferInsert;
export type Slideshow = typeof slideshows.$inferSelect;
export type InsertSlideshow = typeof slideshows.$inferInsert;
export type SlideshowProgress = typeof slideshowProgress.$inferSelect;
export type InsertSlideshowProgress = typeof slideshowProgress.$inferInsert;

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
  replyToId: varchar("reply_to_id"),
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

// Achievement system for gamification
export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // "learning", "trading", "community", "streak"
  iconName: text("icon_name").notNull(),
  pointsReward: integer("points_reward").default(100),
  requirements: jsonb("requirements").notNull(), // {"type": "lessons_completed", "count": 10}
  isHidden: boolean("is_hidden").default(false),
  requiredTier: text("required_tier").default("free"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User achievements tracking
export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  achievementId: varchar("achievement_id").references(() => achievements.id).notNull(),
  progress: integer("progress").default(0),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User referrals for growth
export const userReferrals = pgTable("user_referrals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referrerId: varchar("referrer_id").references(() => users.id).notNull(),
  referredId: varchar("referred_id").references(() => users.id).notNull(),
  referralCode: text("referral_code").notNull().unique(),
  status: text("status").default("pending"), // "pending", "completed", "expired"
  rewardType: text("reward_type").default("points"), // "points", "subscription_discount", "cash"
  rewardValue: decimal("reward_value", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Premium content for monetization
export const premiumContent = pgTable("premium_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  contentType: text("content_type").notNull(), // "video", "masterclass", "guide", "tool"
  category: text("category").notNull(),
  duration: integer("duration"), // in minutes
  requiredTier: text("required_tier").notNull(), // "basic", "pro", "elite"
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  isExclusive: boolean("is_exclusive").default(false),
  thumbnailUrl: text("thumbnail_url"),
  videoUrl: text("video_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Learning streaks for engagement
export const learningStreaks = pgTable("learning_streaks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastActivityDate: timestamp("last_activity_date"),
  streakRewards: jsonb("streak_rewards").default([]), // Track rewards claimed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Removed duplicate - using the first definition above

// Mentoring sessions for Elite tier

// Analytics for admin dashboard
export const userAnalytics = pgTable("user_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  date: timestamp("date").notNull(),
  sessionsCount: integer("sessions_count").default(0),
  timeSpentMinutes: integer("time_spent_minutes").default(0),
  lessonsCompleted: integer("lessons_completed").default(0),
  tradesExecuted: integer("trades_executed").default(0),
  forumPosts: integer("forum_posts").default(0),
  revenueGenerated: decimal("revenue_generated", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Support ticket system with priority based on subscription tier
export const supportTickets = pgTable("support_tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  category: text("category").default("general"), // "general", "technical", "billing", "feature"
  priority: text("priority").default("low"), // "low", "medium", "high", "urgent"
  status: text("status").default("open"), // "open", "in_progress", "resolved", "closed"
  assignedTo: varchar("assigned_to").references(() => users.id),
  resolvedAt: timestamp("resolved_at"),
  responseTime: integer("response_time"), // in minutes
  satisfaction: integer("satisfaction"), // 1-5 rating
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Feature flags for early access and gradual rollouts
export const featureFlags = pgTable("feature_flags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  enabledForTiers: text("enabled_for_tiers").array().default(["elite", "pro"]), // Tiers with access
  rolloutPercentage: integer("rollout_percentage").default(0), // 0-100 for gradual rollout
  isActive: boolean("is_active").default(false),
  metadata: jsonb("metadata"), // Additional configuration
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Live trading sessions schedule
export const liveSessions = pgTable("live_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hostId: varchar("host_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  sessionType: text("session_type").notNull(), // "webinar", "trading_room", "q&a", "analysis"
  requiredTier: text("required_tier").default("pro"), // Minimum tier to attend
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").default(60), // in minutes
  maxAttendees: integer("max_attendees").default(100),
  recordingUrl: text("recording_url"),
  streamUrl: text("stream_url"),
  status: text("status").default("scheduled"), // "scheduled", "live", "completed", "cancelled"
  attendeesCount: integer("attendees_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Weekly market reports
export const marketReports = pgTable("market_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(), // HTML content of the report
  summary: text("summary"),
  reportType: text("report_type").default("weekly"), // "weekly", "monthly", "special"
  reportDate: timestamp("report_date").notNull(),
  sentToSubscribers: boolean("sent_to_subscribers").default(false),
  subscribersSent: integer("subscribers_sent").default(0),
  openRate: decimal("open_rate", { precision: 5, scale: 2 }), // Email open rate percentage
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

export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFeatureFlagSchema = createInsertSchema(featureFlags).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLiveSessionSchema = createInsertSchema(liveSessions).omit({
  id: true,
  createdAt: true,
});

export const insertMarketReportSchema = createInsertSchema(marketReports).omit({
  id: true,
  createdAt: true,
});

export const insertTradingConnectionSchema = createInsertSchema(tradingConnections).omit({
  id: true,
  createdAt: true,
});

export const insertCryptoPriceSchema = createInsertSchema(cryptoPrices).omit({
  id: true,
  updatedAt: true,
});

// Interactive Slideshow Generator System
export const slideshows = pgTable("slideshows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // "Fundamentals", "Technical Analysis", "DeFi", "NFTs", "Trading Psychology"
  difficulty: text("difficulty").notNull(), // "Beginner", "Intermediate", "Expert"
  slides: jsonb("slides").notNull(), // Array of slide objects
  totalSlides: integer("total_slides").default(0),
  estimatedDuration: integer("estimated_duration").default(10), // in minutes
  tags: text("tags").array().default([]),
  isPublic: boolean("is_public").default(false),
  isPremium: boolean("is_premium").default(false),
  requiredTier: text("required_tier").default("free"), // "free", "basic", "pro", "elite"
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const slideshowProgress = pgTable("slideshow_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  slideshowId: varchar("slideshow_id").references(() => slideshows.id).notNull(),
  currentSlide: integer("current_slide").default(0),
  completed: boolean("completed").default(false),
  completedSlides: jsonb("completed_slides").default([]), // Array of completed slide IDs
  totalTimeSpent: integer("total_time_spent").default(0), // in seconds
  lastViewedAt: timestamp("last_viewed_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Whitepaper Analysis System
export const whitepapers = pgTable("whitepapers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectName: text("project_name").notNull(),
  symbol: text("symbol").notNull(), // BTC, ETH, MATIC, etc.
  whitepaperUrl: text("whitepaper_url").notNull(),
  summary: text("summary").notNull(),
  category: text("category").notNull(), // "DeFi", "Layer 1", "Layer 2", "NFT", "Gaming", etc.
  marketCap: decimal("market_cap", { precision: 15, scale: 2 }),
  launchDate: timestamp("launch_date"),
  difficulty: text("difficulty").notNull(), // "Beginner", "Intermediate", "Expert"
  // Analysis metadata
  technicalScore: integer("technical_score"), // 1-100
  teamScore: integer("team_score"), // 1-100
  useCaseScore: integer("use_case_score"), // 1-100
  tokenomicsScore: integer("tokenomics_score"), // 1-100
  overallRating: decimal("overall_rating", { precision: 3, scale: 1 }), // 1.0-10.0
  // Content structure
  keyPoints: jsonb("key_points"), // Array of main takeaways
  redFlags: jsonb("red_flags"), // Array of warning signs
  strengths: jsonb("strengths"), // Array of positive aspects
  risks: jsonb("risks"), // Array of identified risks
  competitiveAnalysis: text("competitive_analysis"),
  // Premium content tiers
  requiredTier: text("required_tier").default("free"), // "free", "basic", "pro", "elite"
  isPremium: boolean("is_premium").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const whitepaperAnalysis = pgTable("whitepaper_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  whitepaperId: varchar("whitepaper_id").references(() => whitepapers.id).notNull(),
  analysisType: text("analysis_type").notNull(), // "technology", "tokenomics", "team", "market", "risks"
  difficulty: text("difficulty").notNull(), // "Beginner", "Intermediate", "Expert"
  title: text("title").notNull(),
  content: text("content").notNull(),
  framework: text("framework"), // Analysis framework used (e.g., "SWOT", "Porter's Five Forces")
  templates: jsonb("templates"), // Analysis templates and checklists
  requiredTier: text("required_tier").default("free"),
  order: integer("order").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userWhitepaperProgress = pgTable("user_whitepaper_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  whitepaperId: varchar("whitepaper_id").references(() => whitepapers.id).notNull(),
  analysisId: varchar("analysis_id").references(() => whitepaperAnalysis.id),
  completed: boolean("completed").default(false),
  userRating: integer("user_rating"), // 1-10 user's own rating
  userNotes: text("user_notes"),
  timeSpent: integer("time_spent").default(0), // in minutes
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWhitepaperSchema = createInsertSchema(whitepapers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWhitepaperAnalysisSchema = createInsertSchema(whitepaperAnalysis).omit({
  id: true,
  createdAt: true,
});

export const insertUserWhitepaperProgressSchema = createInsertSchema(userWhitepaperProgress).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertSlideshowSchema = createInsertSchema(slideshows).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSlideshowProgressSchema = createInsertSchema(slideshowProgress).omit({
  id: true,
  createdAt: true,
  completedAt: true,
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

export const userAchievementLogs = pgTable("user_achievement_logs", {
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
export type Whitepaper = typeof whitepapers.$inferSelect;
export type WhitepaperAnalysis = typeof whitepaperAnalysis.$inferSelect;
export type UserWhitepaperProgress = typeof userWhitepaperProgress.$inferSelect;
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

// Technical Analysis Tables
export const technicalIndicators = pgTable("technical_indicators", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull(),
  timeframe: text("timeframe").notNull(), // "1h", "4h", "1d", "1w"
  indicatorType: text("indicator_type").notNull(), // "RSI", "MACD", "SMA", "EMA", "BB", "STOCH", "WILLIAMS_R", "CCI"
  value: decimal("value", { precision: 15, scale: 8 }),
  signal: text("signal"), // "BUY", "SELL", "HOLD"
  confidence: integer("confidence"), // 1-100
  parameters: jsonb("parameters"), // Indicator-specific parameters
  calculatedAt: timestamp("calculated_at").defaultNow(),
});

export const marketAnalysisResults = pgTable("market_analysis_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull(),
  timeframe: text("timeframe").notNull(),
  trendDirection: text("trend_direction"), // "BULLISH", "BEARISH", "SIDEWAYS"
  supportLevels: decimal("support_levels", { precision: 15, scale: 8 }).array(),
  resistanceLevels: decimal("resistance_levels", { precision: 15, scale: 8 }).array(),
  keyLevels: jsonb("key_levels"), // Important price levels with context
  patternDetected: text("pattern_detected"), // "HEAD_SHOULDERS", "TRIANGLE", "WEDGE", etc.
  volumeAnalysis: jsonb("volume_analysis"),
  riskLevel: text("risk_level"), // "LOW", "MEDIUM", "HIGH"
  analysisText: text("analysis_text"),
  confidence: integer("confidence"), // 1-100
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const priceAlerts = pgTable("price_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  symbol: text("symbol").notNull(),
  alertType: text("alert_type").notNull(), // "PRICE_ABOVE", "PRICE_BELOW", "CHANGE_PERCENT", "VOLUME_SPIKE"
  targetValue: decimal("target_value", { precision: 15, scale: 8 }).notNull(),
  currentValue: decimal("current_value", { precision: 15, scale: 8 }),
  isTriggered: boolean("is_triggered").default(false),
  triggeredAt: timestamp("triggered_at"),
  notificationSent: boolean("notification_sent").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTechnicalIndicatorSchema = createInsertSchema(technicalIndicators).omit({
  id: true,
  calculatedAt: true,
});

export const insertMarketAnalysisResultSchema = createInsertSchema(marketAnalysisResults).omit({
  id: true,
  updatedAt: true,
});

export const insertPriceAlertSchema = createInsertSchema(priceAlerts).omit({
  id: true,
  createdAt: true,
  triggeredAt: true,
});

export type TechnicalIndicator = typeof technicalIndicators.$inferSelect;
export type InsertTechnicalIndicator = z.infer<typeof insertTechnicalIndicatorSchema>;
export type MarketAnalysisResult = typeof marketAnalysisResults.$inferSelect;
export type InsertMarketAnalysisResult = z.infer<typeof insertMarketAnalysisResultSchema>;
export type PriceAlert = typeof priceAlerts.$inferSelect;
export type InsertPriceAlert = z.infer<typeof insertPriceAlertSchema>;

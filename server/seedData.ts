import { db } from "./db";
import { subscriptionPlans, lessons, cryptoPrices } from "@shared/schema";

export async function seedInitialData() {
  try {
    // Check if subscription plans already exist
    const existingPlans = await db.select().from(subscriptionPlans);
    
    if (existingPlans.length === 0) {
      // Create subscription plans
      await db.insert(subscriptionPlans).values([
        {
          name: "Free",
          tier: "free",
          priceMonthly: "0.00",
          features: [
            "15 foundation lessons",
            "Basic trading simulator", 
            "Community access",
            "Basic portfolio tracking",
            "14-day full trial"
          ],
          maxLessons: 15,
          hasSimulator: true,
          hasCommunity: true,
          hasAnalytics: false,
          hasLiveTrading: false,
          hasMentoring: false,
          hasSignals: false
        },
        {
          name: "Basic",
          tier: "basic", 
          priceMonthly: "19.99",
          priceYearly: "199.99",
          features: [
            "Complete lesson library (100+ lessons)",
            "Advanced trading simulator",
            "Priority community access", 
            "Advanced portfolio analytics",
            "NFT Academy access",
            "Quiz and certification system"
          ],
          hasSimulator: true,
          hasCommunity: true,
          hasAnalytics: true,
          hasLiveTrading: false,
          hasMentoring: false,
          hasSignals: false
        },
        {
          name: "Pro",
          tier: "pro",
          priceMonthly: "49.99", 
          priceYearly: "499.99",
          features: [
            "Everything in Basic",
            "Live trading sessions",
            "Trading signals & alerts",
            "Advanced analytics dashboard",
            "Exchange API connections",
            "Priority customer support"
          ],
          hasSimulator: true,
          hasCommunity: true,
          hasAnalytics: true,
          hasLiveTrading: true,
          hasMentoring: false,
          hasSignals: true
        },
        {
          name: "Elite",
          tier: "elite",
          priceMonthly: "99.99",
          priceYearly: "999.99", 
          features: [
            "Everything in Pro",
            "1-on-1 mentoring sessions",
            "Private Discord community",
            "Exclusive content & strategies", 
            "Custom trading bot development",
            "White-glove onboarding"
          ],
          hasSimulator: true,
          hasCommunity: true,
          hasAnalytics: true,
          hasLiveTrading: true,
          hasMentoring: true,
          hasSignals: true
        }
      ]);
      console.log("✅ Subscription plans created");
    }

    // Check if lessons exist
    const existingLessons = await db.select().from(lessons);
    
    if (existingLessons.length === 0) {
      // Create sample lessons
      await db.insert(lessons).values([
        {
          title: "Blockchain Basics (Quick Start)",
          description: "Learn the fundamentals of blockchain technology and how cryptocurrencies work.",
          content: "# Blockchain Basics\n\nBlockchain is a distributed ledger technology...",
          level: "Beginner",
          category: "Fundamentals",
          duration: 15,
          format: "video",
          order: 1,
          requiredTier: "free",
          prerequisites: [],
          learningObjectives: ["Understand blockchain basics", "Learn about cryptocurrencies"],
          tags: ["blockchain", "basics", "fundamentals"],
          isLocked: false,
          isPremium: false
        },
        {
          title: "Setting Up Your Crypto Wallet",
          description: "Step-by-step guide to creating and securing your cryptocurrency wallet.",
          content: "# Crypto Wallet Setup\n\nA crypto wallet is your gateway to the blockchain...",
          level: "Beginner",
          category: "Security",
          duration: 20,
          format: "video",
          order: 2,
          requiredTier: "free",
          prerequisites: [],
          learningObjectives: ["Create a secure wallet", "Understand private keys"],
          tags: ["wallet", "security", "setup"],
          isLocked: false,
          isPremium: false
        },
        {
          title: "Technical Analysis Masterclass",
          description: "Advanced charting techniques and pattern recognition for crypto trading.",
          content: "# Technical Analysis\n\nTechnical analysis is the study of price movements...",
          level: "Advanced",
          category: "Trading",
          duration: 45,
          format: "video",
          order: 3,
          requiredTier: "basic",
          prerequisites: ["Blockchain Basics"],
          learningObjectives: ["Read crypto charts", "Identify trading patterns"],
          tags: ["technical-analysis", "charts", "trading"],
          isLocked: false,
          isPremium: true
        },
        {
          title: "DeFi and Yield Farming Strategies",
          description: "Learn how to earn passive income through decentralized finance protocols.",
          content: "# DeFi Basics\n\nDecentralized Finance (DeFi) represents a paradigm shift...",
          level: "Intermediate", 
          category: "DeFi",
          duration: 35,
          format: "video",
          order: 4,
          requiredTier: "pro",
          prerequisites: ["Technical Analysis Masterclass"],
          learningObjectives: ["Understand DeFi protocols", "Learn yield farming"],
          tags: ["defi", "yield-farming", "protocols"],
          isLocked: false,
          isPremium: true
        }
      ]);
      console.log("✅ Sample lessons created");
    }

    // Check if crypto prices exist
    const existingPrices = await db.select().from(cryptoPrices);
    
    if (existingPrices.length === 0) {
      // Create sample crypto prices
      await db.insert(cryptoPrices).values([
        {
          symbol: "BTC",
          name: "Bitcoin",
          price: "45000.00",
          change24h: "2.5",
          marketCap: "875000000000",
          volume24h: "25000000000",
          lastUpdated: new Date()
        },
        {
          symbol: "ETH", 
          name: "Ethereum",
          price: "2800.00",
          change24h: "-1.2",
          marketCap: "336000000000",
          volume24h: "15000000000",
          lastUpdated: new Date()
        },
        {
          symbol: "SOL",
          name: "Solana", 
          price: "95.00",
          change24h: "5.8",
          marketCap: "42000000000",
          volume24h: "2000000000",
          lastUpdated: new Date()
        }
      ]);
      console.log("✅ Sample crypto prices created");
    }

    console.log("🎉 Database seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}
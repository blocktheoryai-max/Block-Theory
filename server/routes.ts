import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, requiresSubscription } from "./replitAuth";
import { insertTradeSchema, insertForumPostSchema } from "@shared/schema";
import Stripe from "stripe";
import OpenAI from "openai";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
});

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing required OpenAI API key: OPENAI_API_KEY');
}
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Subscription plans
  app.get('/api/subscription-plans', async (req, res) => {
    try {
      const plans = await storage.getAllSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      res.status(500).json({ message: "Failed to fetch subscription plans" });
    }
  });

  // Real-time market data from CoinGecko API
  app.get('/api/market-data', async (req, res) => {
    try {
      // Extended list of cryptocurrencies for comprehensive coverage
      const coins = 'bitcoin,ethereum,binancecoin,ripple,cardano,solana,polkadot,dogecoin,avalanche-2,chainlink,uniswap,matic-network';
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coins}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true&include_24hr_high_low=true`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'BlockTheory/1.0'
          }
        }
      );

      if (!response.ok) {
        console.error(`CoinGecko API error: ${response.status} ${response.statusText}`);
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('CoinGecko API Response:', JSON.stringify(data, null, 2));
      
      const formattedData = {
        bitcoin: {
          symbol: 'BTC',
          name: 'Bitcoin',
          currentPrice: data.bitcoin?.usd || 0,
          priceChangePercentage24h: data.bitcoin?.usd_24h_change || 0,
          priceChange24h: data.bitcoin ? (data.bitcoin.usd * data.bitcoin.usd_24h_change / 100) : 0,
          marketCap: data.bitcoin?.usd_market_cap || 0,
          volume24h: data.bitcoin?.usd_24h_vol || 0,
          high24h: data.bitcoin?.usd_24h_high || data.bitcoin?.usd || 0,
          low24h: data.bitcoin?.usd_24h_low || data.bitcoin?.usd || 0,
          lastUpdate: new Date().toISOString()
        },
        ethereum: {
          symbol: 'ETH',
          name: 'Ethereum',
          currentPrice: data.ethereum?.usd || 0,
          priceChangePercentage24h: data.ethereum?.usd_24h_change || 0,
          priceChange24h: data.ethereum ? (data.ethereum.usd * data.ethereum.usd_24h_change / 100) : 0,
          marketCap: data.ethereum?.usd_market_cap || 0,
          volume24h: data.ethereum?.usd_24h_vol || 0,
          high24h: data.ethereum?.usd_24h_high || data.ethereum?.usd || 0,
          low24h: data.ethereum?.usd_24h_low || data.ethereum?.usd || 0,
          lastUpdate: new Date().toISOString()
        },
        binancecoin: {
          symbol: 'BNB',
          name: 'BNB',
          currentPrice: data.binancecoin?.usd || 0,
          priceChangePercentage24h: data.binancecoin?.usd_24h_change || 0,
          priceChange24h: data.binancecoin ? (data.binancecoin.usd * data.binancecoin.usd_24h_change / 100) : 0,
          marketCap: data.binancecoin?.usd_market_cap || 0,
          volume24h: data.binancecoin?.usd_24h_vol || 0,
          high24h: data.binancecoin?.usd_24h_high || data.binancecoin?.usd || 0,
          low24h: data.binancecoin?.usd_24h_low || data.binancecoin?.usd || 0,
          lastUpdate: new Date().toISOString()
        },
        ripple: {
          symbol: 'XRP',
          name: 'XRP',
          currentPrice: data.ripple?.usd || 0,
          priceChangePercentage24h: data.ripple?.usd_24h_change || 0,
          priceChange24h: data.ripple ? (data.ripple.usd * data.ripple.usd_24h_change / 100) : 0,
          marketCap: data.ripple?.usd_market_cap || 0,
          volume24h: data.ripple?.usd_24h_vol || 0,
          high24h: data.ripple?.usd_24h_high || data.ripple?.usd || 0,
          low24h: data.ripple?.usd_24h_low || data.ripple?.usd || 0,
          lastUpdate: new Date().toISOString()
        },
        solana: {
          symbol: 'SOL',
          name: 'Solana',
          currentPrice: data.solana?.usd || 0,
          priceChangePercentage24h: data.solana?.usd_24h_change || 0,
          priceChange24h: data.solana ? (data.solana.usd * data.solana.usd_24h_change / 100) : 0,
          marketCap: data.solana?.usd_market_cap || 0,
          volume24h: data.solana?.usd_24h_vol || 0,
          high24h: data.solana?.usd_24h_high || data.solana?.usd || 0,
          low24h: data.solana?.usd_24h_low || data.solana?.usd || 0,
          lastUpdate: new Date().toISOString()
        },
        cardano: {
          symbol: 'ADA',
          name: 'Cardano',
          currentPrice: data.cardano?.usd || 0,
          priceChangePercentage24h: data.cardano?.usd_24h_change || 0,
          priceChange24h: data.cardano ? (data.cardano.usd * data.cardano.usd_24h_change / 100) : 0,
          marketCap: data.cardano?.usd_market_cap || 0,
          volume24h: data.cardano?.usd_24h_vol || 0,
          high24h: data.cardano?.usd_24h_high || data.cardano?.usd || 0,
          low24h: data.cardano?.usd_24h_low || data.cardano?.usd || 0,
          lastUpdate: new Date().toISOString()
        },
        polkadot: {
          symbol: 'DOT',
          name: 'Polkadot',
          currentPrice: data.polkadot?.usd || 0,
          priceChangePercentage24h: data.polkadot?.usd_24h_change || 0,
          priceChange24h: data.polkadot ? (data.polkadot.usd * data.polkadot.usd_24h_change / 100) : 0,
          marketCap: data.polkadot?.usd_market_cap || 0,
          volume24h: data.polkadot?.usd_24h_vol || 0,
          high24h: data.polkadot?.usd_24h_high || data.polkadot?.usd || 0,
          low24h: data.polkadot?.usd_24h_low || data.polkadot?.usd || 0,
          lastUpdate: new Date().toISOString()
        },
        dogecoin: {
          symbol: 'DOGE',
          name: 'Dogecoin',
          currentPrice: data.dogecoin?.usd || 0,
          priceChangePercentage24h: data.dogecoin?.usd_24h_change || 0,
          priceChange24h: data.dogecoin ? (data.dogecoin.usd * data.dogecoin.usd_24h_change / 100) : 0,
          marketCap: data.dogecoin?.usd_market_cap || 0,
          volume24h: data.dogecoin?.usd_24h_vol || 0,
          high24h: data.dogecoin?.usd_24h_high || data.dogecoin?.usd || 0,
          low24h: data.dogecoin?.usd_24h_low || data.dogecoin?.usd || 0,
          lastUpdate: new Date().toISOString()
        },
        avalanche: {
          symbol: 'AVAX',
          name: 'Avalanche',
          currentPrice: data['avalanche-2']?.usd || 0,
          priceChangePercentage24h: data['avalanche-2']?.usd_24h_change || 0,
          priceChange24h: data['avalanche-2'] ? (data['avalanche-2'].usd * data['avalanche-2'].usd_24h_change / 100) : 0,
          marketCap: data['avalanche-2']?.usd_market_cap || 0,
          volume24h: data['avalanche-2']?.usd_24h_vol || 0,
          high24h: data['avalanche-2']?.usd_24h_high || data['avalanche-2']?.usd || 0,
          low24h: data['avalanche-2']?.usd_24h_low || data['avalanche-2']?.usd || 0,
          lastUpdate: new Date().toISOString()
        },
        chainlink: {
          symbol: 'LINK',
          name: 'Chainlink',
          currentPrice: data.chainlink?.usd || 0,
          priceChangePercentage24h: data.chainlink?.usd_24h_change || 0,
          priceChange24h: data.chainlink ? (data.chainlink.usd * data.chainlink.usd_24h_change / 100) : 0,
          marketCap: data.chainlink?.usd_market_cap || 0,
          volume24h: data.chainlink?.usd_24h_vol || 0,
          high24h: data.chainlink?.usd_24h_high || data.chainlink?.usd || 0,
          low24h: data.chainlink?.usd_24h_low || data.chainlink?.usd || 0,
          lastUpdate: new Date().toISOString()
        },
        uniswap: {
          symbol: 'UNI',
          name: 'Uniswap',
          currentPrice: data.uniswap?.usd || 0,
          priceChangePercentage24h: data.uniswap?.usd_24h_change || 0,
          priceChange24h: data.uniswap ? (data.uniswap.usd * data.uniswap.usd_24h_change / 100) : 0,
          marketCap: data.uniswap?.usd_market_cap || 0,
          volume24h: data.uniswap?.usd_24h_vol || 0,
          high24h: data.uniswap?.usd_24h_high || data.uniswap?.usd || 0,
          low24h: data.uniswap?.usd_24h_low || data.uniswap?.usd || 0,
          lastUpdate: new Date().toISOString()
        },
        polygon: {
          symbol: 'MATIC',
          name: 'Polygon',
          currentPrice: data['matic-network']?.usd || 0,
          priceChangePercentage24h: data['matic-network']?.usd_24h_change || 0,
          priceChange24h: data['matic-network'] ? (data['matic-network'].usd * data['matic-network'].usd_24h_change / 100) : 0,
          marketCap: data['matic-network']?.usd_market_cap || 0,
          volume24h: data['matic-network']?.usd_24h_vol || 0,
          high24h: data['matic-network']?.usd_24h_high || data['matic-network']?.usd || 0,
          low24h: data['matic-network']?.usd_24h_low || data['matic-network']?.usd || 0,
          lastUpdate: new Date().toISOString()
        }
      };

      res.json(formattedData);
    } catch (error) {
      console.error('Error fetching market data:', error);
      res.status(500).json({ 
        message: 'Failed to fetch market data',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get user subscription status
  app.get('/api/subscription/status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const currentPlan = await storage.getSubscriptionPlanByTier(user.subscriptionTier || 'free');
      res.json({
        tier: user.subscriptionTier,
        status: user.subscriptionStatus,
        stripeSubscriptionId: user.stripeSubscriptionId,
        trialEndDate: user.trialEndDate,
        plan: currentPlan
      });
    } catch (error) {
      console.error("Error fetching subscription status:", error);
      res.status(500).json({ message: "Failed to fetch subscription status" });
    }
  });

  // Create Stripe payment intent for subscription
  app.post('/api/subscription/create-payment-intent', isAuthenticated, async (req: any, res) => {
    try {
      const { planId, isYearly = false } = req.body;
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get the plan details
      const plan = await storage.getSubscriptionPlan(planId);
      if (!plan) {
        return res.status(404).json({ message: "Plan not found" });
      }
      
      // Calculate amount (convert to cents)
      const price = isYearly && plan.priceYearly ? plan.priceYearly : plan.priceMonthly;
      const amount = Math.round(parseFloat(price) * 100);
      
      // Create or get Stripe customer
      let stripeCustomerId = user.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.email || '',
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : undefined,
          metadata: { userId }
        });
        stripeCustomerId = customer.id;
        await storage.updateUserStripeInfo(userId, stripeCustomerId, undefined);
      }
      
      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        customer: stripeCustomerId,
        metadata: {
          userId,
          planId,
          planTier: plan.tier,
          isYearly: isYearly.toString()
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        amount,
        planName: plan.name
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Failed to create payment intent" });
    }
  });

  // Stripe webhook for payment confirmation
  app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    try {
      // For now, we'll handle payment confirmation directly
      // In production, you'd set up webhook endpoints in Stripe dashboard
      res.status(200).send('OK');
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).send('Webhook Error');
    }
  });

  // Confirm payment and activate subscription
  app.post('/api/subscription/confirm-payment', isAuthenticated, async (req: any, res) => {
    try {
      const { paymentIntentId } = req.body;
      const userId = req.user.claims.sub;
      
      // Retrieve payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded' && paymentIntent.metadata.userId === userId) {
        const planTier = paymentIntent.metadata.planTier;
        const isYearly = paymentIntent.metadata.isYearly === 'true';
        
        // Activate subscription
        await storage.updateUserSubscription(userId, planTier, "active");
        
        res.json({ 
          message: "Subscription activated successfully",
          tier: planTier,
          isYearly
        });
      } else {
        res.status(400).json({ message: "Payment not completed" });
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      res.status(500).json({ message: "Failed to confirm payment" });
    }
  });

  // Start trial for authenticated users
  app.post('/api/subscription/start-trial', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Start 14-day trial if not already active
      if (!user.trialEndDate || new Date(user.trialEndDate) < new Date()) {
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 14);
        
        await storage.updateUserSubscription(userId, "pro", "trialing", trialEndDate.toISOString());
        
        res.json({ 
          message: "14-day Pro trial started",
          trialEndDate,
          tier: "pro"
        });
      } else {
        res.json({ 
          message: "Trial already active",
          trialEndDate: user.trialEndDate,
          tier: user.subscriptionTier
        });
      }
    } catch (error) {
      console.error("Error starting trial:", error);
      res.status(500).json({ message: "Failed to start trial" });
    }
  });
  // Protected lessons (require subscription for premium content)
  app.get("/api/lessons", async (req: any, res) => {
    try {
      let userTier = 'free';
      
      if (req.isAuthenticated && req.isAuthenticated()) {
        const userId = req.user.claims.sub;
        const user = await storage.getUser(userId);
        userTier = user?.subscriptionTier || 'free';
      }
      
      const lessons = await storage.getLessonsByTier(userTier);
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lessons" });
    }
  });

  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const lesson = await storage.getLesson(req.params.id);
      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lesson" });
    }
  });

  // User progress endpoints
  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const progress = await storage.getUserProgress(req.params.userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  app.put("/api/progress/:userId/:lessonId", async (req, res) => {
    try {
      const { userId, lessonId } = req.params;
      const { progress, completed } = req.body;
      
      const updatedProgress = await storage.updateUserProgress(
        userId, 
        lessonId
      );
      res.json(updatedProgress);
    } catch (error) {
      res.status(500).json({ error: "Failed to update progress" });
    }
  });

  // Portfolio endpoints
  app.get("/api/portfolio/:userId", async (req, res) => {
    try {
      const portfolio = await storage.getUserPortfolio(req.params.userId);
      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch portfolio" });
    }
  });

  // Trading endpoints
  app.post("/api/trades", async (req, res) => {
    try {
      const tradeData = insertTradeSchema.parse(req.body);
      const trade = await storage.createTrade(tradeData);
      
      // Update portfolio based on trade
      const { userId, symbol, type, amount, price } = trade;
      const currentPortfolio = await storage.getUserPortfolio(userId);
      const existingPosition = currentPortfolio.find(p => p.symbol === symbol);
      
      if (type === "buy") {
        const newAmount = existingPosition 
          ? (parseFloat(existingPosition.amount) + parseFloat(amount)).toString()
          : amount;
        await storage.updatePortfolio(userId, symbol, newAmount, price);
      } else if (type === "sell" && existingPosition) {
        const newAmount = (parseFloat(existingPosition.amount) - parseFloat(amount)).toString();
        if (parseFloat(newAmount) > 0) {
          await storage.updatePortfolio(userId, symbol, newAmount, existingPosition.averagePrice);
        }
      }
      
      res.json(trade);
    } catch (error) {
      console.error("Trade error:", error);
      res.status(400).json({ error: "Failed to execute trade" });
    }
  });

  app.get("/api/trades/:userId", async (req, res) => {
    try {
      const trades = await storage.getUserTrades(req.params.userId);
      res.json(trades);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trades" });
    }
  });

  // Crypto prices endpoints
  app.get("/api/prices", async (_req, res) => {
    try {
      const prices = await storage.getCryptoPrices();
      res.json(prices);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch prices" });
    }
  });

  // Update prices from external API
  app.post("/api/prices/update", async (_req, res) => {
    try {
      // Fetch from CoinGecko API
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano&vs_currencies=usd&include_24hr_change=true"
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch from CoinGecko");
      }
      
      const data = await response.json();
      
      const updates = [];
      if (data.bitcoin) {
        updates.push(storage.updateCryptoPrice("BTC", data.bitcoin.usd.toString(), data.bitcoin.usd_24h_change?.toFixed(2)));
      }
      if (data.ethereum) {
        updates.push(storage.updateCryptoPrice("ETH", data.ethereum.usd.toString(), data.ethereum.usd_24h_change?.toFixed(2)));
      }
      if (data.cardano) {
        updates.push(storage.updateCryptoPrice("ADA", data.cardano.usd.toString(), data.cardano.usd_24h_change?.toFixed(2)));
      }
      
      await Promise.all(updates);
      
      const updatedPrices = await storage.getCryptoPrices();
      res.json(updatedPrices);
    } catch (error) {
      console.error("Price update error:", error);
      res.status(500).json({ error: "Failed to update prices" });
    }
  });

  // Forum endpoints
  app.get("/api/forum", async (_req, res) => {
    try {
      const posts = await storage.getAllForumPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch forum posts" });
    }
  });

  app.post("/api/forum", async (req, res) => {
    try {
      const postData = insertForumPostSchema.parse(req.body);
      const post = await storage.createForumPost(postData);
      res.json(post);
    } catch (error) {
      res.status(400).json({ error: "Failed to create forum post" });
    }
  });

  // Chat Routes
  app.get("/api/chat/rooms", async (req, res) => {
    try {
      const { type, coinSymbol } = req.query;
      let rooms;
      
      if (coinSymbol) {
        const room = await storage.getChatRoomByCoinSymbol(coinSymbol as string);
        rooms = room ? [room] : [];
      } else if (type) {
        rooms = await storage.getChatRoomsByType(type as string);
      } else {
        rooms = await storage.getAllChatRooms();
      }
      
      res.json(rooms);
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      res.status(500).json({ error: "Failed to fetch chat rooms" });
    }
  });

  app.get("/api/chat/rooms/:roomId/messages", async (req, res) => {
    try {
      const { roomId } = req.params;
      const { limit } = req.query;
      const messages = await storage.getChatMessages(roomId, limit ? parseInt(limit as string) : 50);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/chat/rooms/:roomId/messages", async (req, res) => {
    try {
      const { roomId } = req.params;
      const { content, messageType = "text", metadata = null } = req.body;
      
      if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: "Message content is required" });
      }

      const message = await storage.createChatMessage({
        roomId,
        userId: "demo-user",
        username: "DemoUser",
        content: content.trim(),
        messageType,
        metadata,
        replyToId: null
      });

      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ error: "Failed to create message" });
    }
  });

  // Comprehensive Whitepaper Analysis Database - AI-Powered Analysis
  app.get("/api/whitepapers", async (req, res) => {
    try {
      const { category, difficulty, tier } = req.query;
      
      const whitepapers = [
        // Layer 1 Blockchains
        {
          id: "1",
          projectName: "Bitcoin",
          symbol: "BTC",
          category: "Layer 1",
          difficulty: "Beginner",
          overallRating: 9.5,
          technicalScore: 95,
          teamScore: 90,
          useCaseScore: 100,
          tokenomicsScore: 85,
          marketCap: "1200000000000",
          launchDate: "2009-01-03",
          summary: "The original cryptocurrency and digital gold standard. AI analysis reveals Bitcoin's elegant solution to the Byzantine Generals Problem through proof-of-work consensus.",
          keyPoints: ["First decentralized digital currency", "Fixed 21 million supply cap", "Proof-of-work mining consensus", "UTXO transaction model"],
          strengths: ["Network security through hashpower", "Decentralized governance", "Store of value properties", "Global settlement layer"],
          risks: ["Energy consumption concerns", "Limited transaction throughput", "Price volatility", "Regulatory challenges"],
          requiredTier: "free",
          tags: ["cryptocurrency", "digital-gold", "store-of-value", "pow"],
          whitepaperUrl: "https://bitcoin.org/bitcoin.pdf"
        },
        {
          id: "2", 
          projectName: "Ethereum",
          symbol: "ETH",
          category: "Layer 1",
          difficulty: "Intermediate",
          overallRating: 9.2,
          technicalScore: 98,
          teamScore: 95,
          useCaseScore: 95,
          tokenomicsScore: 80,
          marketCap: "400000000000",
          launchDate: "2015-07-30",
          summary: "The world computer enabling smart contracts and DeFi. AI breakdown shows Ethereum's transition from PoW to PoS represents the largest technological shift in crypto history.",
          keyPoints: ["Turing-complete smart contracts", "Ethereum Virtual Machine (EVM)", "Proof-of-stake consensus", "Gas fee mechanism"],
          strengths: ["Largest developer ecosystem", "DeFi infrastructure hub", "NFT marketplace standard", "Layer 2 scaling solutions"],
          risks: ["High transaction fees", "Network congestion", "MEV extraction", "Complexity and bugs"],
          requiredTier: "free",
          tags: ["smart-contracts", "defi", "nft", "pos"],
          whitepaperUrl: "https://ethereum.org/en/whitepaper/"
        },
        {
          id: "3",
          projectName: "Solana",
          symbol: "SOL",
          category: "Layer 1",
          difficulty: "Expert",
          overallRating: 8.7,
          technicalScore: 92,
          teamScore: 85,
          useCaseScore: 88,
          tokenomicsScore: 75,
          marketCap: "98000000000",
          launchDate: "2020-03-16",
          summary: "High-performance blockchain using Proof of History. AI analysis reveals innovative time-ordering mechanism enabling 65,000+ TPS throughput.",
          keyPoints: ["Proof of History consensus", "Single global state", "High throughput (65k+ TPS)", "Low transaction costs"],
          strengths: ["Fast transaction finality", "Growing ecosystem", "Developer-friendly tools", "Mobile integration"],
          risks: ["Network outages", "Centralization concerns", "Validator hardware requirements", "Competition from ETH L2s"],
          requiredTier: "basic",
          tags: ["high-performance", "poh", "web3", "mobile"],
          whitepaperUrl: "https://solana.com/solana-whitepaper.pdf"
        },
        {
          id: "4",
          projectName: "Cardano",
          symbol: "ADA",
          category: "Layer 1",
          difficulty: "Expert",
          overallRating: 8.3,
          technicalScore: 90,
          teamScore: 95,
          useCaseScore: 75,
          tokenomicsScore: 85,
          marketCap: "31000000000",
          launchDate: "2017-09-23",
          summary: "Research-driven blockchain with formal verification. AI analysis highlights unique peer-reviewed approach to protocol development and governance.",
          keyPoints: ["Ouroboros proof-of-stake", "Formal verification methods", "Layered architecture", "Academic research foundation"],
          strengths: ["Rigorous development process", "Energy efficient consensus", "Strong academic backing", "Interoperability focus"],
          risks: ["Slow development pace", "Limited DeFi ecosystem", "Complexity barriers", "Market adoption challenges"],
          requiredTier: "basic",
          tags: ["research", "formal-verification", "academic", "sustainability"],
          whitepaperUrl: "https://cardano.org/whitepaper/"
        },

        // Layer 2 Solutions
        {
          id: "5",
          projectName: "Polygon",
          symbol: "MATIC", 
          category: "Layer 2",
          difficulty: "Intermediate",
          overallRating: 8.1,
          technicalScore: 85,
          teamScore: 80,
          useCaseScore: 90,
          tokenomicsScore: 75,
          marketCap: "8500000000",
          launchDate: "2020-05-31",
          summary: "Ethereum's Internet of Blockchains. AI analysis reveals multi-chain approach combining sidechains, plasma, and zero-knowledge rollups for unlimited scalability.",
          keyPoints: ["Ethereum Layer 2 scaling", "Multi-chain architecture", "zkEVM technology", "Polygon SDK framework"],
          strengths: ["Low transaction costs", "Fast transaction finality", "Ethereum compatibility", "Developer ecosystem"],
          risks: ["Bridge security vulnerabilities", "Centralization of validators", "Token value capture", "Competition from native L2s"],
          requiredTier: "basic",
          tags: ["layer2", "scaling", "zkevm", "interoperability"],
          whitepaperUrl: "https://polygon.technology/lightpaper-polygon.pdf"
        },
        {
          id: "6",
          projectName: "Arbitrum",
          symbol: "ARB",
          category: "Layer 2",
          difficulty: "Expert",
          overallRating: 8.4,
          technicalScore: 88,
          teamScore: 85,
          useCaseScore: 85,
          tokenomicsScore: 80,
          marketCap: "6200000000",
          launchDate: "2021-05-28",
          summary: "Optimistic rollup scaling Ethereum. AI breakdown shows advanced fraud proof system and full EVM compatibility driving DeFi adoption.",
          keyPoints: ["Optimistic rollup technology", "Fraud proof system", "Full EVM compatibility", "Sequencer architecture"],
          strengths: ["Battle-tested security", "High EVM compatibility", "Growing DeFi ecosystem", "Developer experience"],
          risks: ["7-day withdrawal delays", "Sequencer centralization", "MEV on L2", "Governance token utility"],
          requiredTier: "pro",
          tags: ["optimistic-rollup", "fraud-proofs", "evm", "defi"],
          whitepaperUrl: "https://arbitrum.io/arbitrum-whitepaper.pdf"
        },

        // DeFi Protocols
        {
          id: "7",
          projectName: "Uniswap",
          symbol: "UNI",
          category: "DeFi",
          difficulty: "Intermediate",
          overallRating: 9.0,
          technicalScore: 95,
          teamScore: 90,
          useCaseScore: 95,
          tokenomicsScore: 80,
          marketCap: "6200000000",
          launchDate: "2020-09-17",
          summary: "Automated Market Maker revolutionizing trading. AI analysis reveals constant product formula innovation enabling permissionless liquidity provision.",
          keyPoints: ["Automated market maker", "Constant product formula", "Liquidity provider tokens", "Flash swaps"],
          strengths: ["First-mover advantage in AMM", "Highest liquidity", "Permissionless listing", "Strong community"],
          risks: ["Impermanent loss for LPs", "MEV exploitation", "Competition from newer AMMs", "Gas fee sensitivity"],
          requiredTier: "basic",
          tags: ["amm", "dex", "liquidity", "yield"],
          whitepaperUrl: "https://uniswap.org/whitepaper.pdf"
        },
        {
          id: "8",
          projectName: "Aave",
          symbol: "AAVE",
          category: "DeFi",
          difficulty: "Expert",
          overallRating: 8.8,
          technicalScore: 92,
          teamScore: 88,
          useCaseScore: 90,
          tokenomicsScore: 85,
          marketCap: "4800000000",
          launchDate: "2020-01-08",
          summary: "Decentralized lending protocol with innovation features. AI breakdown highlights flash loans, credit delegation, and rate switching mechanisms.",
          keyPoints: ["Decentralized lending/borrowing", "Flash loans", "Variable/stable interest rates", "aTokens for lending"],
          strengths: ["Lending market leader", "Flash loan innovation", "Multi-asset collateral", "Strong governance"],
          risks: ["Smart contract vulnerabilities", "Liquidation cascades", "Oracle manipulation", "Regulatory scrutiny"],
          requiredTier: "pro",
          tags: ["lending", "flash-loans", "yield", "governance"],
          whitepaperUrl: "https://github.com/aave/protocol-v2/blob/master/aave-v2-whitepaper.pdf"
        },

        // Privacy & Infrastructure
        {
          id: "9",
          projectName: "Chainlink",
          symbol: "LINK",
          category: "Infrastructure",
          difficulty: "Expert",
          overallRating: 8.9,
          technicalScore: 94,
          teamScore: 92,
          useCaseScore: 95,
          tokenomicsScore: 82,
          marketCap: "17100000000",
          launchDate: "2017-09-19",
          summary: "Decentralized oracle network connecting blockchains to real world. AI analysis reveals critical infrastructure role in DeFi and smart contract ecosystems.",
          keyPoints: ["Decentralized oracle network", "Off-chain computation", "Price feeds", "Cross-chain interoperability"],
          strengths: ["Market-leading oracle solution", "Extensive integrations", "Strong partnerships", "Continuous innovation"],
          risks: ["Oracle problem complexity", "Centralization of data sources", "Token value capture", "Competition emergence"],
          requiredTier: "pro",
          tags: ["oracle", "infrastructure", "cross-chain", "data"],
          whitepaperUrl: "https://research.chain.link/whitepaper-v1.pdf"
        },
        {
          id: "10",
          projectName: "Monero",
          symbol: "XMR",
          category: "Privacy",
          difficulty: "Expert",
          overallRating: 8.6,
          technicalScore: 90,
          teamScore: 80,
          useCaseScore: 85,
          tokenomicsScore: 90,
          marketCap: "2900000000",
          launchDate: "2014-04-18",
          summary: "Privacy-focused cryptocurrency with advanced cryptography. AI breakdown reveals ring signatures, stealth addresses, and RingCT for transaction privacy.",
          keyPoints: ["Ring signatures", "Stealth addresses", "RingCT transactions", "Dynamic block size"],
          strengths: ["Strong privacy guarantees", "Fungibility", "ASIC resistance", "Active development"],
          risks: ["Regulatory restrictions", "Exchange delistings", "Scalability challenges", "Quantum computing threats"],
          requiredTier: "pro",
          tags: ["privacy", "anonymity", "fungibility", "cryptography"],
          whitepaperUrl: "https://cryptonote.org/whitepaper.pdf"
        }
      ];

      // Filter by query parameters
      let filteredWhitepapers = whitepapers;
      
      if (category) {
        filteredWhitepapers = filteredWhitepapers.filter(w => 
          w.category.toLowerCase() === category.toString().toLowerCase()
        );
      }
      
      if (difficulty) {
        filteredWhitepapers = filteredWhitepapers.filter(w => 
          w.difficulty.toLowerCase() === difficulty.toString().toLowerCase()
        );
      }
      
      if (tier) {
        filteredWhitepapers = filteredWhitepapers.filter(w => 
          w.requiredTier === tier.toString()
        );
      }
      
      res.json(filteredWhitepapers);
    } catch (error) {
      console.error("Error fetching whitepapers:", error);
      res.status(500).json({ message: "Failed to fetch whitepapers" });
    }
  });

  // AI-powered whitepaper analysis endpoint
  app.get("/api/whitepapers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Enhanced whitepaper analysis data with AI-generated insights
      const whitepaperData = {
        "1": {
          id: "1",
          projectName: "Bitcoin",
          symbol: "BTC",
          whitepaperUrl: "https://bitcoin.org/bitcoin.pdf",
          category: "Layer 1",
          difficulty: "Beginner",
          analysis: {
            executiveSummary: "Bitcoin introduces a peer-to-peer electronic cash system without trusted third parties. The AI analysis reveals this solves the double-spending problem through proof-of-work consensus, creating the first successful digital currency.",
            technology: "Revolutionary proof-of-work consensus using SHA-256 hashing. Miners compete to validate transactions in blocks, creating an immutable chain. The UTXO model tracks coin ownership without central authority.",
            tokenomics: "Fixed supply cap of 21 million BTC with predictable halving schedule every 210,000 blocks (~4 years). This creates programmatic scarcity and deflationary monetary policy, distinguishing it from fiat currencies.",
            team: "Created by pseudonymous Satoshi Nakamoto who disappeared in 2011. Now maintained by Bitcoin Core developers including Wladimir van der Laan, Pieter Wuille, and others through open-source development.",
            market: "First-mover advantage with $1.2T market cap. Institutional adoption from MicroStrategy, Tesla, and Bitcoin ETFs. Functions as digital gold and store of value in inflationary environments.",
            riskAssessment: "High energy consumption criticism, regulatory uncertainty in some jurisdictions, scalability limitations (7 TPS), and potential quantum computing threats in distant future.",
            investmentThesis: "Long-term store of value with limited supply, increasing institutional adoption, and growing acceptance as legitimate asset class. Consider as portfolio diversification tool."
          }
        },
        "2": {
          id: "2",
          projectName: "Ethereum",
          symbol: "ETH",
          whitepaperUrl: "https://ethereum.org/en/whitepaper/",
          category: "Layer 1",
          difficulty: "Intermediate",
          analysis: {
            executiveSummary: "Ethereum creates a global, decentralized computer enabling smart contracts and decentralized applications. AI analysis shows this unlocked programmable money and sparked the DeFi revolution.",
            technology: "Ethereum Virtual Machine (EVM) executes Turing-complete smart contracts. The transition from proof-of-work to proof-of-stake (The Merge) reduced energy consumption by 99.9% while maintaining security.",
            tokenomics: "No fixed supply cap, but post-merge issuance is minimal. EIP-1559 introduced fee burning, making ETH potentially deflationary during high network usage. Staking yields ~4-6% annually.",
            team: "Founded by Vitalik Buterin with strong technical team. Ethereum Foundation provides funding and guidance. Decentralized development with multiple client implementations ensures resilience.",
            market: "Dominant smart contract platform with 60%+ DeFi TVL market share. Home to major DeFi protocols (Uniswap, Aave, Compound) and NFT marketplaces (OpenSea). Growing institutional adoption.",
            riskAssessment: "High gas fees during congestion, smart contract vulnerabilities, MEV extraction issues, and increasing competition from newer blockchains like Solana and layer-2 solutions.",
            investmentThesis: "Platform token benefiting from DeFi and NFT growth. Staking yields provide income opportunity. Layer-2 scaling solutions address current limitations while preserving network effects."
          }
        },
        "3": {
          id: "3",
          projectName: "Solana",
          symbol: "SOL",
          whitepaperUrl: "https://solana.com/solana-whitepaper.pdf",
          category: "Layer 1",
          difficulty: "Expert",
          analysis: {
            executiveSummary: "Solana achieves high throughput (65,000+ TPS) through innovative Proof of History consensus mechanism. AI analysis reveals this creates a verifiable, time-ordered sequence of events enabling unprecedented blockchain performance.",
            technology: "Proof of History (PoH) provides cryptographic timestamps, allowing parallel transaction processing. Combined with Tower BFT consensus, Turbine block propagation, and Gulf Stream mempool-less architecture.",
            tokenomics: "Inflationary supply with ~8% initial inflation decreasing to 1.5% long-term. SOL is used for transaction fees, staking, and governance. Staking yields currently ~7-9% annually with slashing risks.",
            team: "Founded by Anatoly Yakovenko (former Qualcomm engineer) with strong technical background in distributed systems. Well-funded with backing from Andreessen Horowitz, Polychain Capital, and others.",
            market: "High-performance blockchain attracting DeFi and NFT projects seeking low fees and fast finality. Growing ecosystem but smaller than Ethereum. Strong mobile and consumer application focus.",
            riskAssessment: "Network outages in 2022 raised reliability concerns. Centralization risks from high validator hardware requirements. Token unlock schedule could create selling pressure. Ethereum Layer-2 competition.",
            investmentThesis: "Performance advantages enable new use cases impossible on Ethereum. Growing ecosystem and developer adoption. Mobile integration could drive mainstream adoption if reliability improves."
          }
        },
        "4": {
          id: "4",
          projectName: "Cardano",
          symbol: "ADA",
          whitepaperUrl: "https://cardano.org/whitepaper/",
          category: "Layer 1",
          difficulty: "Expert",
          analysis: {
            executiveSummary: "Cardano takes a research-first approach to blockchain development with formal verification and peer-reviewed protocols. AI analysis shows this methodical approach prioritizes security and correctness over speed to market.",
            technology: "Ouroboros proof-of-stake consensus with mathematically proven security guarantees. Layered architecture separates settlement (CSL) from computation (CCL). Formal verification ensures code correctness.",
            tokenomics: "Fixed supply of 45 billion ADA with ~5% staking rewards. No slashing in current implementation. Transaction fees are low and predictable, funded through protocol treasury system.",
            team: "Led by Charles Hoskinson (Ethereum co-founder) and team of academics. Input Output Global (IOG) leads development with strong research partnerships including universities and government entities.",
            market: "Third-generation blockchain focusing on sustainability and scalability. Strong presence in Africa with government partnerships. Academic credibility but slower ecosystem development compared to competitors.",
            riskAssessment: "Slow development pace and feature rollout. Limited DeFi ecosystem compared to Ethereum/Solana. Market may not value academic rigor over practical utility. Execution risk on ambitious roadmap.",
            investmentThesis: "Long-term play on scientific approach to blockchain. Strong fundamentals and sustainability focus may attract institutional adoption. Geographic expansion in developing markets offers growth potential."
          }
        },
        "5": {
          id: "5",
          projectName: "Polygon",
          symbol: "MATIC",
          whitepaperUrl: "https://polygon.technology/lightpaper-polygon.pdf",
          category: "Layer 2",
          difficulty: "Intermediate",
          analysis: {
            executiveSummary: "Polygon creates Ethereum's Internet of Blockchains through multiple scaling solutions. AI analysis reveals a comprehensive approach combining sidechains, plasma, and zero-knowledge rollups for unlimited scalability.",
            technology: "Multi-pronged scaling approach: Polygon PoS (sidechain), Hermez (zkEVM), Miden (STARK-based), and Edge (modular blockchain). Each solution targets different use cases and performance requirements.",
            tokenomics: "MATIC used for gas fees, staking security, and governance. Inflationary supply with validator rewards but potential fee burning mechanisms. Strong utility across multiple Polygon solutions.",
            team: "Co-founded by Sandeep Nailwal, Jaynti Kanani, and Anurag Arjun. Experienced team with strong partnerships including Disney, Meta, and major DeFi protocols. Well-funded development.",
            market: "Leading Ethereum Layer-2 solution with massive DeFi adoption. Lower fees attract users from mainnet. Growing enterprise and gaming adoption through partnerships and dedicated solutions.",
            riskAssessment: "Bridge security vulnerabilities (historical hacks). Dependence on Ethereum's success. Competition from native Layer-2s like Arbitrum/Optimism. Token value capture concerns across multiple chains.",
            investmentThesis: "Scaling solution for Ethereum's success. Multiple technological approaches reduce single-point-of-failure risk. Strong partnerships and enterprise adoption provide growth catalysts."
          }
        }
      };
      
      const whitepaper = whitepaperData[id as keyof typeof whitepaperData];
      if (!whitepaper) {
        return res.status(404).json({ message: "Whitepaper not found" });
      }
      
      res.json(whitepaper);
    } catch (error) {
      console.error("Error fetching whitepaper:", error);
      res.status(500).json({ message: "Failed to fetch whitepaper" });
    }
  });

  // AI-powered custom whitepaper analysis endpoint
  app.post("/api/whitepapers/analyze", async (req, res) => {
    try {
      const { whitepaperText, projectName, analysisType = "comprehensive" } = req.body;
      
      if (!whitepaperText || !projectName) {
        return res.status(400).json({ 
          error: "Whitepaper text and project name are required" 
        });
      }

      // AI-powered analysis using OpenAI
      const analysisPrompt = `As a cryptocurrency and blockchain expert, analyze the following whitepaper for ${projectName}. Provide a comprehensive analysis that breaks down complex technical concepts into digestible insights for crypto traders and investors.

Whitepaper content: ${whitepaperText.substring(0, 8000)} // Limit for API

Please provide your analysis in the following JSON format:
{
  "executiveSummary": "3-4 sentence summary in simple terms",
  "technologyBreakdown": "Explain the core technology in accessible language",
  "tokenomicsAnalysis": "Break down the token economics and utility",
  "strengthsAndOpportunities": ["List 3-4 key strengths"],
  "risksAndConcerns": ["List 3-4 main risks"],
  "marketPosition": "Analysis of competitive position and market opportunity",
  "investmentThesis": "Key investment considerations",
  "complexityScore": "Rate 1-10 (1=beginner friendly, 10=expert level)",
  "innovationScore": "Rate 1-10 based on technological innovation",
  "overallRating": "Rate 1-10 overall project potential"
}

Focus on making complex blockchain concepts understandable for users learning about cryptocurrency investments.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { 
            role: "system", 
            content: "You are an expert cryptocurrency analyst who specializes in breaking down complex blockchain whitepapers into digestible insights for traders and investors. Always respond with valid JSON." 
          },
          { role: "user", content: analysisPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const analysis = JSON.parse(completion.choices[0].message.content || "{}");
      
      res.json({
        projectName,
        analysisType,
        aiGenerated: true,
        timestamp: new Date().toISOString(),
        analysis
      });

    } catch (error) {
      console.error("Error analyzing whitepaper with AI:", error);
      res.status(500).json({ 
        error: "Failed to analyze whitepaper",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Achievement endpoints
  app.get("/api/achievements", async (_req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch achievements" });
    }
  });

  // Premium content endpoints
  app.get("/api/premium-content", async (_req, res) => {
    try {
      const content = await storage.getPremiumContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch premium content" });
    }
  });

  // Trading signals endpoints
  app.get("/api/trading-signals", async (_req, res) => {
    try {
      const signals = await storage.getTradingSignals();
      res.json(signals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trading signals" });
    }
  });

  // Technical Analysis endpoints
  app.get('/api/technical-indicators', async (req, res) => {
    try {
      const { symbol = 'BTC', timeframe = '1d' } = req.query;
      
      // Mock data for now - in production, this would calculate real indicators
      const mockIndicators = [
        {
          id: '1',
          symbol,
          timeframe,
          indicatorType: 'RSI',
          value: 65.3 + Math.random() * 10,
          signal: Math.random() > 0.5 ? 'BUY' : Math.random() > 0.3 ? 'SELL' : 'HOLD',
          confidence: 70 + Math.random() * 25,
          parameters: { period: 14 },
          calculatedAt: new Date().toISOString()
        },
        {
          id: '2',
          symbol,
          timeframe,
          indicatorType: 'MACD',
          value: 1200 + Math.random() * 500,
          signal: Math.random() > 0.6 ? 'BUY' : 'HOLD',
          confidence: 75 + Math.random() * 20,
          parameters: { fast: 12, slow: 26, signal: 9 },
          calculatedAt: new Date().toISOString()
        },
        {
          id: '3',
          symbol,
          timeframe,
          indicatorType: 'BB',
          value: 0.8 + Math.random() * 0.4,
          signal: Math.random() > 0.7 ? 'SELL' : 'HOLD',
          confidence: 65 + Math.random() * 25,
          parameters: { period: 20, stdDev: 2 },
          calculatedAt: new Date().toISOString()
        }
      ];

      res.json(mockIndicators);
    } catch (error) {
      console.error('Technical indicators error:', error);
      res.status(500).json({ message: 'Failed to fetch technical indicators' });
    }
  });

  app.get('/api/market-analysis', async (req, res) => {
    try {
      const { symbol = 'BTC', timeframe = '1d' } = req.query;
      const currentPrice = marketData?.[symbol.toString().toLowerCase()]?.usd || 112000;
      
      // Mock analysis data
      const mockAnalysis = {
        id: '1',
        symbol,
        timeframe,
        trendDirection: Math.random() > 0.6 ? 'BULLISH' : Math.random() > 0.3 ? 'BEARISH' : 'SIDEWAYS',
        supportLevels: [
          currentPrice * 0.95,
          currentPrice * 0.92,
          currentPrice * 0.88
        ],
        resistanceLevels: [
          currentPrice * 1.05,
          currentPrice * 1.08,
          currentPrice * 1.12
        ],
        keyLevels: { 
          pivot: currentPrice,
          r1: currentPrice * 1.02,
          s1: currentPrice * 0.98
        },
        patternDetected: ['ASCENDING_TRIANGLE', 'HEAD_SHOULDERS', 'WEDGE', 'TRIANGLE'][Math.floor(Math.random() * 4)],
        volumeAnalysis: {
          trend: Math.random() > 0.5 ? 'INCREASING' : 'DECREASING',
          volume: Math.random() > 0.5 ? 'ABOVE_AVERAGE' : 'BELOW_AVERAGE'
        },
        riskLevel: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)],
        analysisText: `${symbol} is showing ${Math.random() > 0.5 ? 'strong' : 'moderate'} momentum with technical indicators suggesting ${Math.random() > 0.5 ? 'bullish' : 'bearish'} sentiment. Key levels to watch include support at $${Math.round(currentPrice * 0.95)} and resistance at $${Math.round(currentPrice * 1.05)}.`,
        confidence: 70 + Math.random() * 25,
        updatedAt: new Date().toISOString()
      };

      res.json(mockAnalysis);
    } catch (error) {
      console.error('Market analysis error:', error);
      res.status(500).json({ message: 'Failed to fetch market analysis' });
    }
  });

  app.get('/api/price-alerts', async (req, res) => {
    try {
      // Mock alerts data
      const mockAlerts = [
        {
          id: '1',
          symbol: 'BTC',
          alertType: 'PRICE_ABOVE',
          targetValue: 115000,
          currentValue: marketData?.bitcoin?.usd || 112000,
          isTriggered: false,
          isActive: true
        },
        {
          id: '2',
          symbol: 'ETH',
          alertType: 'PRICE_BELOW',
          targetValue: 4000,
          currentValue: marketData?.ethereum?.usd || 4200,
          isTriggered: false,
          isActive: true
        }
      ];

      res.json(mockAlerts);
    } catch (error) {
      console.error('Price alerts error:', error);
      res.status(500).json({ message: 'Failed to fetch price alerts' });
    }
  });

  app.post('/api/price-alerts', async (req, res) => {
    try {
      const { symbol, alertType, targetValue } = req.body;
      
      // Mock creation - in production this would save to database
      const newAlert = {
        id: Date.now().toString(),
        symbol,
        alertType,
        targetValue: parseFloat(targetValue),
        currentValue: marketData?.[symbol.toLowerCase()]?.usd || 0,
        isTriggered: false,
        isActive: true,
        createdAt: new Date().toISOString()
      };

      res.json(newAlert);
    } catch (error) {
      console.error('Create price alert error:', error);
      res.status(500).json({ message: 'Failed to create price alert' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

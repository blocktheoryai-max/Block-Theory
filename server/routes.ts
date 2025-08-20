import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, requiresSubscription } from "./replitAuth";
import { insertTradeSchema, insertForumPostSchema } from "@shared/schema";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
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
        
        await storage.updateUserSubscription(userId, "pro", "trialing", undefined, trialEndDate);
        
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
      const lesson = await storage.getLessonById(req.params.id);
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
        lessonId, 
        progress, 
        completed
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

  // Whitepaper Analysis routes
  app.get("/api/whitepapers", async (req, res) => {
    try {
      const whitepapers = [
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
          summary: "The original cryptocurrency and digital gold standard. Learn how Bitcoin's revolutionary proof-of-work consensus mechanism changed finance forever.",
          keyPoints: ["Decentralized peer-to-peer network", "Fixed supply of 21 million", "Proof-of-work consensus"],
          strengths: ["First mover advantage", "Network security", "Store of value"],
          risks: ["Energy consumption", "Scalability limits", "Regulatory uncertainty"],
          requiredTier: "free"
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
          summary: "The world computer that enabled smart contracts and DeFi. Analyze Ethereum's transition to proof-of-stake and its ecosystem dominance.",
          keyPoints: ["Smart contract platform", "EVM compatibility", "Proof-of-stake transition"],
          strengths: ["Developer ecosystem", "DeFi infrastructure", "Network effects"],
          risks: ["High gas fees", "Competition from L2s", "Complexity"],
          requiredTier: "basic"
        },
        {
          id: "3",
          projectName: "Polygon",
          symbol: "MATIC", 
          category: "Layer 2",
          difficulty: "Expert",
          overallRating: 8.1,
          technicalScore: 85,
          teamScore: 80,
          useCaseScore: 90,
          tokenomicsScore: 75,
          marketCap: "8500000000",
          launchDate: "2020-05-31",
          summary: "Ethereum's scaling solution with sidechains and rollups. Deep dive into Layer 2 architecture and multi-chain interoperability strategies.",
          keyPoints: ["Ethereum Layer 2", "Multi-chain approach", "zkEVM development"],
          strengths: ["Low transaction costs", "Fast finality", "Ethereum compatibility"],
          risks: ["Centralization concerns", "Bridge security", "Token utility"],
          requiredTier: "pro"
        }
      ];
      
      res.json(whitepapers);
    } catch (error) {
      console.error("Error fetching whitepapers:", error);
      res.status(500).json({ message: "Failed to fetch whitepapers" });
    }
  });

  app.get("/api/whitepapers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const mockData = {
        "1": {
          id: "1",
          projectName: "Bitcoin",
          symbol: "BTC",
          whitepaperUrl: "https://bitcoin.org/bitcoin.pdf",
          category: "Layer 1",
          difficulty: "Beginner",
          analysis: {
            technology: "Bitcoin uses proof-of-work consensus with SHA-256 hashing algorithm. The network maintains a distributed ledger through mining, ensuring security through computational work.",
            tokenomics: "Fixed supply of 21 million BTC with halving every 4 years. Deflationary monetary policy with predictable issuance schedule.",
            team: "Pseudonymous creator Satoshi Nakamoto, now maintained by core developers and Bitcoin Core team with transparent development process.",
            market: "First cryptocurrency with largest market cap and institutional adoption. Digital gold narrative with store of value proposition."
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
            technology: "Smart contract platform with Ethereum Virtual Machine (EVM). Transitioned from proof-of-work to proof-of-stake consensus for energy efficiency.",
            tokenomics: "No fixed supply cap, minimal issuance post-merge. EIP-1559 fee burning mechanism creates deflationary pressure during high network usage.",
            team: "Founded by Vitalik Buterin and core team. Strong developer community with Ethereum Foundation governance and funding ecosystem.",
            market: "Dominant smart contract platform powering DeFi, NFTs, and Web3 applications. Network effects and developer adoption create strong moat."
          }
        },
        "3": {
          id: "3",
          projectName: "Polygon",
          symbol: "MATIC",
          whitepaperUrl: "https://polygon.technology/lightpaper-polygon.pdf",
          category: "Layer 2",
          difficulty: "Expert",
          analysis: {
            technology: "Multi-chain scaling solution with sidechains, plasma, and zk-rollups. Ethereum-compatible with faster finality and lower costs.",
            tokenomics: "MATIC token used for staking, governance, and gas fees. Inflationary supply with validator rewards and potential fee burning.",
            team: "Experienced team with Sandeep Nailwal, Jaynti Kanani, and Anurag Arjun. Strong partnerships and institutional backing.",
            market: "Leading Ethereum Layer 2 solution with growing ecosystem. Competition from other L2s like Arbitrum, Optimism, and direct Ethereum scaling."
          }
        }
      };
      
      const whitepaper = mockData[id as keyof typeof mockData];
      if (!whitepaper) {
        return res.status(404).json({ message: "Whitepaper not found" });
      }
      
      res.json(whitepaper);
    } catch (error) {
      console.error("Error fetching whitepaper:", error);
      res.status(500).json({ message: "Failed to fetch whitepaper" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

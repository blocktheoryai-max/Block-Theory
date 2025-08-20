import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTradeSchema, insertForumPostSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Lessons endpoints
  app.get("/api/lessons", async (_req, res) => {
    try {
      const lessons = await storage.getAllLessons();
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

  const httpServer = createServer(app);

  return httpServer;
}

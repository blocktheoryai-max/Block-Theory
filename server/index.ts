import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./seedData";
import { adminAuth } from "./adminAuth";
import { 
  validateEnvironment,
  requestLogger,
  performanceMonitor,
  productionErrorHandler,
  setupGracefulShutdown,
  healthCheck
} from "./productionConfig";

const app = express();

// Validate environment on startup
validateEnvironment();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Apply production middleware
app.use(requestLogger);
app.use(performanceMonitor);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Seed initial data on startup
  await seedDatabase();
  
  // Initialize admin account
  await adminAuth.initializeAdminAccount();
  
  // Add health check endpoint
  app.get('/health', healthCheck);
  
  // Simple test route for debugging access issues
  app.get('/test', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html><head><title>Block Theory Test</title></head>
      <body style="font-family:Arial;background:#1a1a1a;color:white;text-align:center;padding:50px;">
        <h1 style="color:#9333ea;">🚀 Block Theory Server Working!</h1>
        <p>✅ Server is running and accessible on port 5000</p>
        <p>Your app is ready with 100+ lessons and real-time crypto data</p>
        <a href="/" style="color:#9333ea;text-decoration:none;border:1px solid #9333ea;padding:10px 20px;border-radius:5px;">Go to Full App</a>
      </body></html>
    `);
  });
  
  const server = await registerRoutes(app);

  // Use production error handler
  app.use(productionErrorHandler);

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  const httpServer = server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    console.log(`✅ Block Theory platform ready for launch!`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔒 Security: Enhanced with rate limiting and protection`);
    console.log(`📧 Email: SendGrid configured`);
    console.log(`👑 Admin: Accessible at /admin/login`);
  });
  
  // Setup graceful shutdown
  setupGracefulShutdown(httpServer);
})();

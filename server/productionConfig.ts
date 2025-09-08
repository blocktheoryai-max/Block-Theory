import { Request, Response, NextFunction } from 'express';

// Production environment validation
export const validateEnvironment = () => {
  // Critical variables that will cause app to exit if missing
  const required = [
    'DATABASE_URL',
    'SESSION_SECRET'
  ];

  // Optional variables that will only show warnings if missing
  const optional = [
    'SENDGRID_API_KEY', 
    'FROM_EMAIL',
    'OPENAI_API_KEY'
  ];

  // Check required variables
  const missingRequired = required.filter(key => !process.env[key]);
  
  if (missingRequired.length > 0) {
    console.error('Missing required environment variables:', missingRequired);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }

  // Check optional variables and warn
  const missingOptional = optional.filter(key => !process.env[key]);
  
  if (missingOptional.length > 0) {
    console.warn('⚠️  Missing optional environment variables:', missingOptional);
    console.warn('⚠️  Some features may be disabled without these variables:');
    
    if (missingOptional.includes('SENDGRID_API_KEY') || missingOptional.includes('FROM_EMAIL')) {
      console.warn('   - Email functionality will be disabled');
    }
    if (missingOptional.includes('OPENAI_API_KEY')) {
      console.warn('   - AI-powered features will be disabled');
    }
  }

  console.log('✅ Environment validation passed');
};

// Production middleware for request logging
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.ENABLE_REQUEST_LOGGING === 'true') {
    const start = Date.now();
    const method = req.method;
    const url = req.url;
    const userAgent = req.get('User-Agent') || 'Unknown';
    const ip = req.ip || req.connection.remoteAddress || 'Unknown';

    res.on('finish', () => {
      const duration = Date.now() - start;
      const status = res.statusCode;
      
      // Only log non-asset requests
      if (!url.includes('.css') && !url.includes('.js') && !url.includes('.png') && !url.includes('.ico')) {
        console.log(`${new Date().toISOString()} | ${method} ${url} | ${status} | ${duration}ms | ${ip} | ${userAgent.slice(0, 50)}...`);
      }
    });
  }
  
  next();
};

// Health check endpoint for production monitoring
export const healthCheck = (req: Request, res: Response) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  };

  res.status(200).json(health);
};

// Performance monitoring middleware
export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const milliseconds = seconds * 1000 + nanoseconds / 1e6;
    
    // Log slow requests (>1000ms)
    if (milliseconds > 1000) {
      console.warn(`Slow request detected: ${req.method} ${req.url} - ${milliseconds.toFixed(2)}ms`);
    }
  });

  next();
};

// Error handling for production
export const productionErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Production Error:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong. Please try again later.',
      requestId: Date.now().toString() // For support tracking
    });
  } else {
    // In development, show full error
    res.status(500).json({
      error: err.message,
      stack: err.stack
    });
  }
};

// Graceful shutdown handler
export const setupGracefulShutdown = (server: any) => {
  const shutdown = (signal: string) => {
    console.log(`${signal} received. Starting graceful shutdown...`);
    
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });

    // Force shutdown after 30 seconds
    setTimeout(() => {
      console.error('Forced shutdown due to timeout');
      process.exit(1);
    }, 30000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

// Configuration object for different environments
export const config = {
  development: {
    logLevel: 'debug',
    enableCors: true,
    enableRateLimit: false,
    enableAnalytics: false,
  },
  production: {
    logLevel: 'info',
    enableCors: true,
    enableRateLimit: true,
    enableAnalytics: true,
  }
};

export const getConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return config[env as keyof typeof config] || config.development;
};
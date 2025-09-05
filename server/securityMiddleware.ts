import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// General API rate limiting
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiting for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    error: 'Too many authentication attempts from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Payment endpoint protection
export const paymentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 payment requests per minute
  message: {
    error: 'Too many payment requests from this IP, please try again later.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Email sending rate limit
export const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 email requests per hour
  message: {
    error: 'Too many email requests from this IP, please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy (CSP)
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com https://www.google-analytics.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https: http:; " +
    "connect-src 'self' https://api.stripe.com https://www.google-analytics.com; " +
    "frame-src 'self' https://js.stripe.com https://www.youtube.com; " +
    "media-src 'self' https:;"
  );
  
  next();
};

// Request sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Basic XSS protection by removing dangerous characters from inputs
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '');
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitize(obj[key]);
      }
      return sanitized;
    }
    
    return obj;
  };
  
  if (req.body) {
    req.body = sanitize(req.body);
  }
  
  if (req.query) {
    req.query = sanitize(req.query);
  }
  
  if (req.params) {
    req.params = sanitize(req.params);
  }
  
  next();
};

// Validate request origin for sensitive operations
export const validateOrigin = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.get('Origin');
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5000',
    'https://localhost:5000'
  ];
  
  // Add Replit domains if available
  if (process.env.REPLIT_DOMAINS) {
    const replitDomains = process.env.REPLIT_DOMAINS.split(',').map(domain => `https://${domain}`);
    allowedOrigins.push(...replitDomains);
  }
  
  // Allow requests without origin (direct API calls, mobile apps)
  if (!origin || allowedOrigins.includes(origin)) {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: Invalid origin' });
  }
};

// IP tracking for suspicious activity
const suspiciousIPs = new Set<string>();
const ipAttempts = new Map<string, { count: number; lastAttempt: number }>();

export const trackSuspiciousActivity = (req: Request, res: Response, next: NextFunction) => {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  
  // Skip suspicious activity tracking in development
  if (process.env.NODE_ENV === 'development') {
    return next();
  }
  
  // Skip if IP is already marked as suspicious
  if (suspiciousIPs.has(clientIP)) {
    return res.status(429).json({ 
      error: 'IP blocked due to suspicious activity. Contact support if this is an error.' 
    });
  }
  
  // Track failed attempts
  const originalSend = res.send;
  res.send = function(data) {
    if (res.statusCode >= 400) {
      const attempts = ipAttempts.get(clientIP) || { count: 0, lastAttempt: 0 };
      attempts.count++;
      attempts.lastAttempt = Date.now();
      ipAttempts.set(clientIP, attempts);
      
      // Block IP after 50 failed requests in 1 hour
      if (attempts.count > 50 && Date.now() - attempts.lastAttempt < 3600000) {
        suspiciousIPs.add(clientIP);
        console.warn(`IP ${clientIP} blocked for suspicious activity`);
      }
    }
    return originalSend.call(this, data);
  };
  
  next();
};

// Clean up old IP tracking data every hour
setInterval(() => {
  const oneHourAgo = Date.now() - 3600000;
  const entries = Array.from(ipAttempts.entries());
  for (const [ip, data] of entries) {
    if (data.lastAttempt < oneHourAgo) {
      ipAttempts.delete(ip);
    }
  }
}, 3600000);
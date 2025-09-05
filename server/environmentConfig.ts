// Production environment configuration
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Required environment variables validation
export const requiredEnvVars = {
  DATABASE_URL: process.env.DATABASE_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  VITE_STRIPE_PUBLIC_KEY: process.env.VITE_STRIPE_PUBLIC_KEY
};

// Optional environment variables (development vs production)
export const optionalEnvVars = {
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  FROM_EMAIL: process.env.FROM_EMAIL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  REPLIT_DOMAINS: process.env.REPLIT_DOMAINS
};

// Validate required environment variables
export function validateEnvironment(): { isValid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      missing.push(key);
    }
  }
  
  return {
    isValid: missing.length === 0,
    missing
  };
}

// Production-safe error messages
export const errorMessages = {
  AUTHENTICATION_REQUIRED: "Please sign in to access this feature",
  UNAUTHORIZED_ACCESS: "You don't have permission to perform this action",
  INVALID_INPUT: "Please check your input and try again",
  SERVER_ERROR: "Something went wrong. Our team has been notified",
  RATE_LIMITED: "Too many requests. Please wait before trying again",
  PAYMENT_FAILED: "Payment could not be processed. Please try again",
  USER_NOT_FOUND: "Account not found. Please contact support",
  LESSON_UNAVAILABLE: "This lesson is not available. Please check your subscription",
  QUIZ_ERROR: "Unable to load quiz. Please refresh and try again"
};

// Content Security Policy for production
export const contentSecurityPolicy = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'", // Only for critical inline scripts
      "https://js.stripe.com",
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com"
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'", // Required for CSS-in-JS libraries
      "https://fonts.googleapis.com"
    ],
    fontSrc: [
      "'self'",
      "https://fonts.gstatic.com"
    ],
    imgSrc: [
      "'self'",
      "data:",
      "https:",
      "http:" // Only for development
    ],
    connectSrc: [
      "'self'",
      "https://api.stripe.com",
      "https://api.openai.com",
      "https://api.coingecko.com"
    ],
    frameSrc: [
      "'self'",
      "https://js.stripe.com",
      "https://www.youtube.com",
      "https://youtube.com"
    ],
    mediaSrc: [
      "'self'",
      "https:"
    ]
  }
};
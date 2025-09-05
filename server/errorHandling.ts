import { Request, Response, NextFunction } from 'express';
import { errorMessages } from './environmentConfig';

export interface ErrorResponse {
  message: string;
  code?: string;
  support?: string;
  timestamp: string;
  requestId?: string;
}

// Production-ready error handler
export const errorHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  // Log error details for debugging
  console.error(`Error ${req.method} ${req.path}:`, {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Generate unique request ID for tracking
  const requestId = req.headers['x-request-id'] as string || 
                   Math.random().toString(36).substring(2, 15);

  let statusCode = 500;
  let message = errorMessages.SERVER_ERROR;
  let code = 'INTERNAL_ERROR';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = errorMessages.INVALID_INPUT;
    code = 'VALIDATION_ERROR';
  } else if (err.name === 'UnauthorizedError' || err.message.includes('Unauthorized')) {
    statusCode = 401;
    message = errorMessages.AUTHENTICATION_REQUIRED;
    code = 'UNAUTHORIZED';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = errorMessages.UNAUTHORIZED_ACCESS;
    code = 'FORBIDDEN';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = "The requested resource was not found";
    code = 'NOT_FOUND';
  } else if (err.message.includes('Rate limit')) {
    statusCode = 429;
    message = errorMessages.RATE_LIMITED;
    code = 'RATE_LIMITED';
  }

  const errorResponse: ErrorResponse = {
    message,
    code,
    support: "Contact support@blocktheory.ai if this issue persists",
    timestamp: new Date().toISOString(),
    requestId
  };

  // In development, include more details
  if (process.env.NODE_ENV === 'development') {
    (errorResponse as any).details = {
      originalMessage: err.message,
      stack: err.stack
    };
  }

  res.status(statusCode).json(errorResponse);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response) => {
  const errorResponse: ErrorResponse = {
    message: `Route ${req.method} ${req.path} not found`,
    code: 'NOT_FOUND',
    support: "Check the API documentation for valid endpoints",
    timestamp: new Date().toISOString()
  };
  
  res.status(404).json(errorResponse);
};

// Health check endpoint
export const healthCheck = (req: Request, res: Response) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: Math.floor(process.uptime())
  };
  
  res.json(health);
};
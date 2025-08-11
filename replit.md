# Overview

TradeTutor is a comprehensive cryptocurrency trading education platform that combines interactive learning, risk-free simulation, and community engagement. The application serves as a complete trading education ecosystem where users can learn crypto trading fundamentals through structured lessons, practice their skills in a simulated trading environment, track their progress with detailed analytics, and engage with a community of fellow traders.

The platform is designed as a single-page application with a modern, responsive interface that guides users through four main sections: Learn (educational content), Simulate (trading practice), Analyze (performance tracking), and Community (social features).

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built using React with TypeScript, leveraging a component-based architecture for modularity and reusability. The application uses Vite as the build tool and development server, providing fast hot module replacement and optimized builds. 

The UI is constructed using shadcn/ui components built on top of Radix UI primitives, ensuring accessibility and consistent design patterns. Tailwind CSS provides utility-first styling with a custom design system that includes primary colors, spacing, and responsive breakpoints optimized for the trading education domain.

State management is handled through TanStack Query (React Query) for server state management, providing automatic caching, background updates, and optimistic updates for a smooth user experience. The routing is implemented using Wouter, a lightweight client-side router.

## Backend Architecture
The backend follows a RESTful API design using Express.js with TypeScript. The server implements a middleware-based architecture with request logging, error handling, and JSON parsing capabilities.

The application uses an in-memory storage pattern (MemStorage class) that implements a comprehensive IStorage interface. This design choice allows for easy testing and development while providing a clear contract for data operations. The storage layer manages six core entities: users, lessons, user progress, portfolios, trades, forum posts, and cryptocurrency prices.

## Database Design
The database schema is defined using Drizzle ORM with PostgreSQL as the target database. The schema includes:

- Users table with portfolio tracking capabilities
- Lessons table with hierarchical learning content
- User progress tracking with completion states
- Portfolio management with cryptocurrency holdings
- Trade history with buy/sell operations
- Forum posts for community interaction
- Real-time cryptocurrency price data

The schema uses UUID primary keys and includes proper foreign key relationships to maintain data integrity.

## API Structure
The REST API is organized around resource-based endpoints:

- `/api/lessons` - Educational content management
- `/api/progress` - User learning progress tracking
- `/api/portfolio` - Portfolio and holdings management
- `/api/trades` - Trading simulation operations
- `/api/forum` - Community discussion features
- `/api/prices` - Cryptocurrency price data

Each endpoint supports appropriate HTTP methods (GET, POST, PUT) with proper error handling and response formatting.

## Authentication and Data Flow
Currently implements a demo user system for development purposes. The application is designed to support user authentication and session management through the storage interface, with plans for proper user registration and login flows.

Data flows from the frontend through TanStack Query to the Express API endpoints, which interact with the storage layer to persist and retrieve data. Real-time features like price updates are handled through polling mechanisms with configurable intervals.

# External Dependencies

## UI and Styling Framework
- **Radix UI**: Provides unstyled, accessible UI primitives for building the component library
- **Tailwind CSS**: Utility-first CSS framework for responsive design and consistent styling
- **shadcn/ui**: Pre-built component library that combines Radix UI with Tailwind CSS
- **Lucide React**: Icon library providing consistent iconography throughout the application

## State Management and Data Fetching
- **TanStack Query**: Server state management with caching, synchronization, and background updates
- **React Hook Form**: Form state management and validation with TypeScript support
- **Zod**: Schema validation library used with Drizzle for type-safe data validation

## Database and ORM
- **Drizzle ORM**: TypeScript-first ORM for database schema definition and query building
- **PostgreSQL**: Primary database (configured via Neon serverless for cloud deployment)
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## Development and Build Tools
- **Vite**: Frontend build tool and development server with TypeScript support
- **Wouter**: Lightweight client-side routing library
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Integration**: Development environment integration for cloud-based coding

## Cryptocurrency Data
The application is designed to integrate with cryptocurrency price APIs for real-time market data, though currently uses simulated data for development purposes. The architecture supports easy integration with services like CoinGecko or CoinMarketCap APIs.

## Additional Libraries
- **date-fns**: Date manipulation and formatting utilities
- **class-variance-authority**: Utility for managing CSS class variants
- **clsx**: Conditional CSS class name utility
- **cmdk**: Command palette and search functionality
- **embla-carousel**: Carousel component for content display
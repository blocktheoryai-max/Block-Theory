# Overview
Block Theory is a comprehensive cryptocurrency trading education platform, envisioned as the "Netflix of crypto education." It offers interactive learning, risk-free simulation, and community engagement, serving as a complete ecosystem for learning crypto trading fundamentals. The platform provides structured video lessons, a simulated trading environment, progress tracking analytics, and community features for aspiring traders. The business vision is to provide accessible, high-quality crypto education, capitalizing on the growing EdTech market, particularly in the underserved crypto education segment.

## Recent Pre-Launch Optimizations (January 2025)
- **Navigation Consolidation**: Streamlined header navigation from 8 items to 6, removing crowded navigation elements
- **Page Consolidation**: Merged technical-analysis functionality into analyze page as tabbed content to reduce complexity
- **Interactive Chart Stabilization**: Fixed "going crazy" chart behavior with mathematical curves and reduced volatility (0.5%)
- **UI Improvements**: Removed dashed grid lines from charts for cleaner, professional appearance
- **Architecture Simplification**: Eliminated duplicate Navigation components and fixed double header issues

# User Preferences
Preferred communication style: Simple, everyday language.
Platform branding: Block Theory (rebranded from TradeTutor)
Color scheme: Purple, gray, and white throughout the application
Educational approach: Netflix-style video streaming with comprehensive curriculum (50+ lessons per level)
Layout priority: Learning content positioned prominently with subscription conversion focus

# System Architecture

## Frontend Architecture
The frontend is built using React with TypeScript, employing a component-based architecture. It utilizes Vite for fast development and optimized builds. UI components are built with shadcn/ui, based on Radix UI primitives, ensuring accessibility and consistent design. Tailwind CSS provides utility-first styling with a custom design system. State management uses TanStack Query for server state, offering caching and optimistic updates, while routing is handled by Wouter.

## Backend Architecture
The backend is a RESTful API developed with Express.js and TypeScript, following a middleware-based architecture for request handling and error management. It uses an in-memory storage pattern (MemStorage class) implementing an `IStorage` interface for managing core entities such as users, lessons, progress, portfolios, trades, forum posts, prices, subscription plans, and whitepaper analysis data.

## Database Design
The application targets PostgreSQL, with schema defined using Drizzle ORM. Key tables include Users, Lessons, User Progress, Portfolios, Trade History, Forum Posts, and real-time Cryptocurrency Price Data. UUIDs are used for primary keys, and foreign key relationships ensure data integrity.

## API Structure
The REST API is organized into resource-based endpoints, including:
- `/api/lessons`
- `/api/progress`
- `/api/portfolio`
- `/api/trades`
- `/api/forum`
- `/api/prices`
- `/api/whitepapers` (for AI-powered whitepaper analysis database)
- `/api/whitepapers/analyze` (for custom AI whitepaper analysis)
- `/api/subscription`
- `/api/whale-activity`
- `/api/market-data`
Each endpoint supports appropriate HTTP methods (GET, POST, PUT).

## Authentication and Data Flow
Currently, a demo user system is implemented for development. The architecture supports future integration of proper user authentication and session management via the storage interface. Data flows from the frontend (via TanStack Query) to Express API endpoints, which interact with the storage layer. Real-time features, like price updates, are managed through polling mechanisms.

## UI/UX Decisions
The platform features a modern, responsive single-page application design, utilizing a purple, gray, and white color scheme. The interface guides users through four main sections: Learn, Simulate, Analyze, and Community. Emphasis is placed on video-based learning to maintain a "Netflix-style" streaming education experience.

## Feature Specifications & System Design Choices
- **AI Whitepaper Analyzer**: Integrates OpenAI for transforming complex whitepapers into digestible insights, featuring a comprehensive database of major cryptocurrency whitepapers, smart filtering, multi-tab interface, and real-time processing with complexity scoring and risk assessment.
- **Learning Progression**: Structured progression from beginner to expert, with foundational, intermediate, advanced, and specialized tracks covering various crypto topics.
- **Monetization Strategy**: Multi-stream approach including subscription tiers (Free, Basic, Pro, Elite), partnership revenue (exchange referrals, sponsored content), a learn-and-earn ecosystem (token rewards, NFT certificates), premium services (coaching, signals), and enterprise sales.

# External Dependencies

## UI and Styling Framework
- **Radix UI**: Provides unstyled, accessible UI primitives.
- **Tailwind CSS**: Utility-first CSS framework.
- **shadcn/ui**: Pre-built component library combining Radix UI with Tailwind CSS.
- **Lucide React**: Icon library.

## State Management and Data Fetching
- **TanStack Query**: Server state management.
- **React Hook Form**: Form state management and validation.
- **Zod**: Schema validation library.

## Database and ORM
- **Drizzle ORM**: TypeScript-first ORM.
- **PostgreSQL**: Primary database.
- **connect-pg-simple**: PostgreSQL session store for Express.

## Development and Build Tools
- **Vite**: Frontend build tool and development server.
- **Wouter**: Lightweight client-side routing library.
- **ESBuild**: Fast JavaScript bundler.

## Cryptocurrency Data
- Designed for integration with cryptocurrency price APIs (e.g., CoinGecko, CoinMarketCap), currently using simulated data.

## AI and Analysis Libraries
- **OpenAI**: Used for AI-powered whitepaper analysis and content generation.

## Payment Processing
- **Stripe**: For subscription payment processing and billing management.

## Additional Libraries
- **date-fns**: Date manipulation.
- **class-variance-authority**: Utility for managing CSS class variants.
- **clsx**: Conditional CSS class name utility.
- **cmdk**: Command palette and search functionality.
- **embla-carousel**: Carousel component.
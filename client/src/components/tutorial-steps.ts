import { TutorialStep } from './ui/tutorial-overlay';

export const homeTutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to TradeTutor!',
    description: 'Your comprehensive crypto trading education platform. Let\'s take a quick tour of the key features that will help you master cryptocurrency trading.',
    position: 'center',
    action: 'none'
  },
  {
    id: 'navigation',
    title: 'Navigation Menu',
    description: 'Use the navigation bar to access different sections of the platform. Each section serves a unique purpose in your trading education journey.',
    targetElement: 'nav',
    position: 'bottom',
    action: 'hover',
    animation: 'pulse'
  },
  {
    id: 'learn-section',
    title: 'Learn Section',
    description: 'Start with interactive lessons covering everything from blockchain basics to advanced trading strategies. Progress through structured courses at your own pace.',
    targetElement: '[data-tutorial="learn-link"]',
    position: 'bottom',
    action: 'click',
    animation: 'bounce'
  },
  {
    id: 'simulate-section',
    title: 'Trading Simulator',
    description: 'Practice trading with $10,000 in virtual money using real market data. No risk, all the learning experience of actual trading.',
    targetElement: '[data-tutorial="simulate-link"]',
    position: 'bottom',
    action: 'hover',
    animation: 'pulse'
  },
  {
    id: 'analyze-section',
    title: 'Performance Analytics',
    description: 'Track your trading performance, analyze your strategies, and identify areas for improvement with detailed charts and statistics.',
    targetElement: '[data-tutorial="analyze-link"]',
    position: 'bottom',
    action: 'hover',
    animation: 'fade'
  },
  {
    id: 'community-section',
    title: 'Community Forum',
    description: 'Connect with fellow traders, share insights, ask questions, and learn from experienced community members.',
    targetElement: '[data-tutorial="community-link"]',
    position: 'bottom',
    action: 'hover',
    animation: 'pulse'
  },
  {
    id: 'dashboard-overview',
    title: 'Your Dashboard',
    description: 'This is your personal dashboard showing learning progress, portfolio performance, and quick access to all platform features.',
    position: 'center',
    action: 'scroll'
  }
];

export const learnTutorialSteps: TutorialStep[] = [
  {
    id: 'lesson-library',
    title: 'Lesson Library',
    description: 'Browse through our comprehensive collection of crypto trading lessons organized by difficulty and topic.',
    targetElement: '[data-tutorial="lesson-grid"]',
    position: 'top',
    action: 'scroll',
    animation: 'fade'
  },
  {
    id: 'lesson-filters',
    title: 'Filter & Search',
    description: 'Use filters to find lessons by level, category, or format. Search for specific topics you want to learn.',
    targetElement: '[data-tutorial="lesson-filters"]',
    position: 'bottom',
    action: 'click',
    animation: 'pulse'
  },
  {
    id: 'lesson-progress',
    title: 'Track Your Progress',
    description: 'Your learning progress is automatically saved. Complete lessons to unlock advanced content and earn XP.',
    targetElement: '[data-tutorial="progress-indicator"]',
    position: 'left',
    action: 'none',
    animation: 'bounce'
  },
  {
    id: 'premium-content',
    title: 'Premium Content',
    description: 'Unlock advanced lessons, masterclasses, and exclusive content with a premium subscription.',
    targetElement: '[data-tutorial="premium-badge"]',
    position: 'right',
    action: 'hover',
    animation: 'pulse'
  }
];

export const simulateTutorialSteps: TutorialStep[] = [
  {
    id: 'virtual-portfolio',
    title: 'Virtual Portfolio',
    description: 'Start with $10,000 in virtual money to practice trading without financial risk.',
    targetElement: '[data-tutorial="portfolio-value"]',
    position: 'bottom',
    action: 'none',
    animation: 'pulse'
  },
  {
    id: 'market-data',
    title: 'Real Market Data',
    description: 'All prices and market data are real and updated in real-time, giving you authentic trading experience.',
    targetElement: '[data-tutorial="price-chart"]',
    position: 'top',
    action: 'hover',
    animation: 'fade'
  },
  {
    id: 'place-trade',
    title: 'Place Your First Trade',
    description: 'Click on any cryptocurrency to open the trading interface and place buy or sell orders.',
    targetElement: '[data-tutorial="crypto-list"] .crypto-item:first-child',
    position: 'right',
    action: 'click',
    animation: 'bounce'
  },
  {
    id: 'trade-history',
    title: 'Trade History',
    description: 'Review all your past trades and analyze your trading performance over time.',
    targetElement: '[data-tutorial="trade-history"]',
    position: 'left',
    action: 'scroll',
    animation: 'pulse'
  }
];

export const communityTutorialSteps: TutorialStep[] = [
  {
    id: 'forum-posts',
    title: 'Community Discussions',
    description: 'Read posts from other traders sharing insights, strategies, and market analysis.',
    targetElement: '[data-tutorial="forum-posts"]',
    position: 'top',
    action: 'scroll',
    animation: 'fade'
  },
  {
    id: 'create-post',
    title: 'Share Your Thoughts',
    description: 'Click here to create your own post and contribute to the community discussions.',
    targetElement: '[data-tutorial="create-post-button"]',
    position: 'bottom',
    action: 'click',
    animation: 'bounce'
  },
  {
    id: 'post-engagement',
    title: 'Engage with Posts',
    description: 'Like, reply to, and engage with posts to build your reputation in the community.',
    targetElement: '[data-tutorial="post-engagement"]',
    position: 'right',
    action: 'hover',
    animation: 'pulse'
  },
  {
    id: 'trading-signals',
    title: 'Premium Trading Signals',
    description: 'Access expert trading signals and market analysis from experienced traders (Premium feature).',
    targetElement: '[data-tutorial="trading-signals"]',
    position: 'left',
    action: 'none',
    animation: 'pulse'
  }
];

export const analyzeTutorialSteps: TutorialStep[] = [
  {
    id: 'performance-overview',
    title: 'Performance Dashboard',
    description: 'Get a comprehensive view of your trading performance with detailed analytics and charts.',
    targetElement: '[data-tutorial="performance-chart"]',
    position: 'bottom',
    action: 'none',
    animation: 'fade'
  },
  {
    id: 'profit-loss',
    title: 'Profit & Loss Analysis',
    description: 'Track your gains and losses over different time periods to understand your trading patterns.',
    targetElement: '[data-tutorial="pnl-chart"]',
    position: 'top',
    action: 'hover',
    animation: 'pulse'
  },
  {
    id: 'success-metrics',
    title: 'Success Metrics',
    description: 'Monitor key performance indicators like win rate, average return, and risk-adjusted returns.',
    targetElement: '[data-tutorial="success-metrics"]',
    position: 'left',
    action: 'none',
    animation: 'bounce'
  },
  {
    id: 'learning-progress',
    title: 'Learning Progress',
    description: 'See how your education progress correlates with your trading performance.',
    targetElement: '[data-tutorial="learning-stats"]',
    position: 'right',
    action: 'none',
    animation: 'pulse'
  }
];
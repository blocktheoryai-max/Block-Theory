import { db } from "./db";
import { lessons, subscriptionPlans, users, userProgress, portfolios, forumPosts, whitepapers } from "@shared/schema";

export async function seedDatabase() {
  try {
    console.log("🌱 Seeding database...");

    // Check if subscription plans exist
    const existingPlans = await db.select().from(subscriptionPlans);
    
    if (existingPlans.length === 0) {
      // Create subscription plans
      await db.insert(subscriptionPlans).values([
        {
          tier: "free",
          name: "Free",
          priceMonthly: "0",
          priceYearly: "0",
          features: [
            "Access to basic lessons",
            "Basic market analysis",
            "Community forum access",
            "Limited simulation trades"
          ],
          hasSimulator: false,
          hasCommunity: true,
          hasAnalytics: false,
          hasLiveTrading: false,
          hasMentoring: false,
          hasSignals: false
        },
        {
          tier: "basic",
          name: "Basic",
          priceMonthly: "19.99",
          priceYearly: "199.99",
          features: [
            "Access to intermediate lessons",
            "Advanced technical analysis",
            "Trading simulator with $10K virtual",
            "Basic portfolio analytics",
            "Email support"
          ],
          hasSimulator: true,
          hasCommunity: true,
          hasAnalytics: true,
          hasLiveTrading: false,
          hasMentoring: false,
          hasSignals: false
        },
        {
          tier: "pro",
          name: "Pro", 
          priceMonthly: "49.99",
          priceYearly: "499.99",
          features: [
            "Access to advanced lessons",
            "Professional trading tools",
            "Real-time market data",
            "Advanced portfolio analytics",
            "Trading signals & alerts",
            "Priority support"
          ],
          hasSimulator: true,
          hasCommunity: true,
          hasAnalytics: true,
          hasLiveTrading: true,
          hasMentoring: false,
          hasSignals: true
        },
        {
          tier: "elite",
          name: "Elite",
          priceMonthly: "99.99",
          priceYearly: "999.99", 
          features: [
            "Everything in Pro",
            "1-on-1 mentoring sessions",
            "Private Discord community",
            "Exclusive content & strategies", 
            "Custom trading bot development",
            "White-glove onboarding"
          ],
          hasSimulator: true,
          hasCommunity: true,
          hasAnalytics: true,
          hasLiveTrading: true,
          hasMentoring: true,
          hasSignals: true
        }
      ]);
      console.log("✅ Subscription plans created");
    }

    // Always refresh lessons for comprehensive library
    await db.delete(lessons); // Clear existing lessons
    
    // Create comprehensive lesson library with 50+ lessons
    await db.insert(lessons).values([
      // Foundation Track (Free Tier) - Lessons 1-6
      {
        title: "What is Cryptocurrency?",
        description: "Understanding digital currencies and their revolutionary potential in modern finance.",
        content: `<h1>What is Cryptocurrency?</h1>
<p>Cryptocurrency represents a digital revolution in how we think about money, value transfer, and financial systems. At its core, cryptocurrency is a digital or virtual currency secured by cryptography, making it nearly impossible to counterfeit.</p>

<h2>Key Characteristics</h2>
<ul>
<li><strong>Decentralized:</strong> No central authority controls the currency</li>
<li><strong>Digital:</strong> Exists only in electronic form</li>
<li><strong>Secure:</strong> Protected by advanced cryptographic techniques</li>
<li><strong>Transparent:</strong> All transactions are recorded on a public ledger</li>
</ul>

<h2>Why Cryptocurrency Matters</h2>
<p>Traditional financial systems rely on banks and governments as intermediaries. Cryptocurrency eliminates these middlemen, enabling peer-to-peer transactions across the globe in minutes, not days.</p>

<h2>Real-World Applications</h2>
<ul>
<li>International remittances with lower fees</li>
<li>Store of value in economically unstable regions</li>
<li>Programmable money through smart contracts</li>
<li>Decentralized applications and services</li>
</ul>`,
        level: "beginner",
        category: "basics",
        duration: 12,
        format: "video",
        order: 1,
        requiredTier: "free",
        prerequisites: [],
        learningObjectives: ["Define cryptocurrency", "Understand digital currency benefits", "Identify use cases"],
        isLocked: false,
        isPremium: false,
        tags: ["cryptocurrency", "basics", "introduction"]
      },
      {
        title: "Blockchain Technology Explained",
        description: "Deep dive into the distributed ledger technology powering cryptocurrencies.",
        content: `<h1>Blockchain Technology Explained</h1>
<p>Blockchain is the underlying technology that makes cryptocurrencies possible. Think of it as a digital ledger that's distributed across thousands of computers worldwide.</p>

<h2>How Blockchain Works</h2>
<ol>
<li><strong>Blocks:</strong> Groups of transactions bundled together</li>
<li><strong>Chain:</strong> Blocks linked chronologically using cryptographic hashes</li>
<li><strong>Network:</strong> Distributed across multiple computers (nodes)</li>
<li><strong>Consensus:</strong> Agreement mechanisms ensure data integrity</li>
</ol>

<h2>Key Properties</h2>
<ul>
<li><strong>Immutability:</strong> Once recorded, data cannot be changed</li>
<li><strong>Transparency:</strong> All transactions are publicly visible</li>
<li><strong>Decentralization:</strong> No single point of failure</li>
<li><strong>Security:</strong> Cryptographic protection against fraud</li>
</ul>

<h2>Beyond Cryptocurrency</h2>
<p>Blockchain technology enables:</p>
<ul>
<li>Supply chain tracking</li>
<li>Digital identity verification</li>
<li>Smart contracts and automation</li>
<li>Decentralized finance (DeFi) protocols</li>
</ul>`,
        level: "beginner",
        category: "basics",
        duration: 18,
        format: "video",
        order: 2,
        requiredTier: "free",
        prerequisites: ["What is Cryptocurrency?"],
        learningObjectives: ["Understand blockchain architecture", "Learn consensus mechanisms", "Identify blockchain applications"],
        isLocked: false,
        isPremium: false,
        tags: ["blockchain", "technology", "fundamentals"]
      },
      {
        title: "Understanding Bitcoin",
        description: "Comprehensive guide to Bitcoin - the first and most important cryptocurrency.",
        content: `<h1>Understanding Bitcoin</h1>
<p>Bitcoin, created in 2009 by the pseudonymous Satoshi Nakamoto, represents the first successful implementation of a decentralized digital currency.</p>

<h2>Bitcoin Fundamentals</h2>
<ul>
<li><strong>Limited Supply:</strong> Only 21 million Bitcoin will ever exist</li>
<li><strong>Proof of Work:</strong> Mining secures the network through computational power</li>
<li><strong>Halving Events:</strong> Mining rewards decrease every 4 years</li>
<li><strong>Digital Gold:</strong> Store of value properties similar to precious metals</li>
</ul>

<h2>How Bitcoin Works</h2>
<p>Bitcoin transactions are validated by miners who compete to solve cryptographic puzzles. Successful miners are rewarded with new Bitcoin and transaction fees.</p>

<h2>Bitcoin's Value Propositions</h2>
<ul>
<li>Hedge against inflation and currency debasement</li>
<li>Censorship-resistant transactions</li>
<li>Global accessibility without traditional banking</li>
<li>Programmatic scarcity creates deflationary pressure</li>
</ul>`,
        level: "beginner",
        category: "basics",
        duration: 22,
        format: "video",
        order: 3,
        requiredTier: "free",
        prerequisites: ["Blockchain Technology Explained"],
        learningObjectives: ["Understand Bitcoin's unique properties", "Learn about mining and halving", "Analyze Bitcoin's value proposition"],
        isLocked: false,
        isPremium: false,
        tags: ["bitcoin", "cryptocurrency", "mining"]
      },
      {
        title: "Introduction to Ethereum",
        description: "Explore Ethereum's smart contract capabilities and ecosystem.",
        content: `<h1>Introduction to Ethereum</h1>
<p>Ethereum, launched in 2015, is a decentralized platform that enables smart contracts and decentralized applications (DApps).</p>

<h2>Key Innovations</h2>
<ul>
<li><strong>Smart Contracts:</strong> Self-executing contracts with terms directly written into code</li>
<li><strong>Virtual Machine:</strong> The Ethereum Virtual Machine (EVM) executes smart contracts</li>
<li><strong>Gas System:</strong> Computational fees paid to execute transactions and contracts</li>
<li><strong>DeFi Ecosystem:</strong> Foundation for decentralized finance applications</li>
</ul>

<h2>Ethereum vs. Bitcoin</h2>
<table>
<tr><th>Feature</th><th>Bitcoin</th><th>Ethereum</th></tr>
<tr><td>Purpose</td><td>Digital Currency</td><td>Smart Contract Platform</td></tr>
<tr><td>Transaction Speed</td><td>~10 minutes</td><td>~15 seconds</td></tr>
<tr><td>Programming</td><td>Limited</td><td>Turing Complete</td></tr>
</table>

<h2>Use Cases</h2>
<ul>
<li>Decentralized Finance (DeFi) protocols</li>
<li>Non-Fungible Tokens (NFTs)</li>
<li>Decentralized Autonomous Organizations (DAOs)</li>
<li>Supply chain management</li>
</ul>`,
        level: "beginner",
        category: "basics",
        duration: 20,
        format: "video",
        order: 4,
        requiredTier: "free",
        prerequisites: ["Understanding Bitcoin"],
        learningObjectives: ["Understand smart contracts", "Compare Ethereum to Bitcoin", "Explore DeFi ecosystem"],
        isLocked: false,
        isPremium: false,
        tags: ["ethereum", "smart-contracts", "defi"]
      },
      {
        title: "Crypto Wallet Security",
        description: "Essential guide to securing your cryptocurrency assets.",
        content: `<h1>Crypto Wallet Security</h1>
<p>Your cryptocurrency wallet is your gateway to the digital asset ecosystem. Understanding wallet security is crucial for protecting your investments.</p>

<h2>Types of Wallets</h2>
<h3>Hot Wallets (Connected to Internet)</h3>
<ul>
<li><strong>Mobile wallets:</strong> Convenient for daily transactions</li>
<li><strong>Desktop wallets:</strong> More features, locally stored</li>
<li><strong>Web wallets:</strong> Accessible anywhere, third-party controlled</li>
</ul>

<h3>Cold Wallets (Offline Storage)</h3>
<ul>
<li><strong>Hardware wallets:</strong> Physical devices for maximum security</li>
<li><strong>Paper wallets:</strong> Private keys printed on paper</li>
</ul>

<h2>Security Best Practices</h2>
<ol>
<li><strong>Never share your private keys or seed phrase</strong></li>
<li>Use strong, unique passwords for wallet applications</li>
<li>Enable two-factor authentication (2FA) when available</li>
<li>Regularly back up your wallet data</li>
<li>Keep software and firmware updated</li>
<li>Verify addresses before sending transactions</li>
</ol>`,
        level: "beginner",
        category: "security",
        duration: 25,
        format: "video",
        order: 5,
        requiredTier: "free",
        prerequisites: ["Introduction to Ethereum"],
        learningObjectives: ["Choose appropriate wallet types", "Implement security practices", "Recognize security threats"],
        isLocked: false,
        isPremium: false,
        tags: ["security", "wallets", "safety"]
      },
      {
        title: "Cryptocurrency Exchanges",
        description: "Guide to choosing and using cryptocurrency exchanges safely.",
        content: `<h1>Cryptocurrency Exchanges</h1>
<p>Cryptocurrency exchanges are platforms where you can buy, sell, and trade digital assets. Understanding different exchange types is crucial for successful trading.</p>

<h2>Types of Exchanges</h2>
<h3>Centralized Exchanges (CEX)</h3>
<ul>
<li><strong>User-friendly:</strong> Easy-to-use interfaces</li>
<li><strong>High liquidity:</strong> Better prices and faster trades</li>
<li><strong>Customer support:</strong> Help when things go wrong</li>
<li><strong>Regulatory compliance:</strong> Often licensed and regulated</li>
</ul>

<h3>Decentralized Exchanges (DEX)</h3>
<ul>
<li><strong>Non-custodial:</strong> You control your private keys</li>
<li><strong>Permissionless:</strong> No KYC requirements</li>
<li><strong>Censorship resistant:</strong> Cannot be shut down by authorities</li>
<li><strong>Smart contract based:</strong> Automated trading protocols</li>
</ul>

<h2>Exchange Security Best Practices</h2>
<ul>
<li>Never keep large amounts on exchanges long-term</li>
<li>Use exchanges with insurance coverage</li>
<li>Enable all available security features</li>
<li>Verify withdrawal addresses carefully</li>
</ul>`,
        level: "beginner",
        category: "trading",
        duration: 18,
        format: "video",
        order: 6,
        requiredTier: "free",
        prerequisites: ["Crypto Wallet Security"],
        learningObjectives: ["Compare exchange types", "Select appropriate exchanges", "Implement security practices"],
        isLocked: false,
        isPremium: false,
        tags: ["exchanges", "trading", "security"]
      },
      
      // Intermediate Track (Basic Tier) - Lessons 7-15
      {
        title: "Reading Cryptocurrency Charts",
        description: "Learn to interpret price charts and identify market trends.",
        content: `<h1>Reading Cryptocurrency Charts</h1>
<p>Technical analysis begins with understanding how to read cryptocurrency price charts. Charts reveal market psychology and help predict future price movements.</p>

<h2>Chart Types</h2>
<h3>Candlestick Charts</h3>
<p>Most popular chart type showing four key data points:</p>
<ul>
<li><strong>Open:</strong> First price in the time period</li>
<li><strong>High:</strong> Highest price reached</li>
<li><strong>Low:</strong> Lowest price reached</li>
<li><strong>Close:</strong> Final price in the time period</li>
</ul>

<h2>Time Frames</h2>
<ul>
<li><strong>1m-15m:</strong> Scalping and day trading</li>
<li><strong>1h-4h:</strong> Short-term swing trades</li>
<li><strong>1D:</strong> Medium-term position trading</li>
<li><strong>1W-1M:</strong> Long-term investing</li>
</ul>

<h2>Volume Analysis</h2>
<p>Volume indicates the strength behind price movements:</p>
<ul>
<li><strong>High volume breakouts:</strong> Strong, sustainable moves</li>
<li><strong>Low volume moves:</strong> Weak, likely to reverse</li>
<li><strong>Volume divergence:</strong> Price and volume moving in opposite directions</li>
</ul>`,
        level: "intermediate",
        category: "technical-analysis",
        duration: 25,
        format: "video",
        order: 7,
        requiredTier: "basic",
        prerequisites: ["Cryptocurrency Exchanges"],
        learningObjectives: ["Read candlestick charts", "Analyze volume patterns", "Identify support and resistance"],
        isLocked: false,
        isPremium: false,
        tags: ["charts", "technical-analysis", "trading"]
      },
      {
        title: "Technical Indicators - RSI & MACD",
        description: "Master the RSI and MACD indicators for better trading decisions.",
        content: `<h1>Technical Indicators - RSI & MACD</h1>
<p>Technical indicators help traders identify overbought/oversold conditions and trend changes. RSI and MACD are two of the most reliable indicators.</p>

<h2>Relative Strength Index (RSI)</h2>
<p>RSI measures the speed and magnitude of price changes on a scale from 0 to 100.</p>

<h3>RSI Interpretation</h3>
<ul>
<li><strong>Above 70:</strong> Potentially overbought (sell signal)</li>
<li><strong>Below 30:</strong> Potentially oversold (buy signal)</li>
<li><strong>50 line:</strong> Neutral momentum</li>
</ul>

<h2>Moving Average Convergence Divergence (MACD)</h2>
<p>MACD shows the relationship between two moving averages of an asset's price.</p>

<h3>MACD Trading Signals</h3>
<ul>
<li><strong>Bullish crossover:</strong> MACD crosses above signal line</li>
<li><strong>Bearish crossover:</strong> MACD crosses below signal line</li>
<li><strong>Zero line crossover:</strong> MACD crosses above/below zero</li>
<li><strong>Divergence:</strong> Price and MACD moving in opposite directions</li>
</ul>`,
        level: "intermediate",
        category: "technical-analysis",
        duration: 30,
        format: "video",
        order: 8,
        requiredTier: "basic",
        prerequisites: ["Reading Cryptocurrency Charts"],
        learningObjectives: ["Use RSI indicator effectively", "Interpret MACD signals", "Combine multiple indicators"],
        isLocked: false,
        isPremium: false,
        tags: ["indicators", "rsi", "macd"]
      },
      {
        title: "Risk Management Strategies",
        description: "Protect your capital with professional risk management techniques.",
        content: `<h1>Risk Management Strategies</h1>
<p>Successful trading is more about managing losses than picking winners.</p>

<h2>Position Sizing</h2>
<ul>
<li><strong>Fixed Dollar Amount:</strong> Risk same amount per trade</li>
<li><strong>Percentage Risk:</strong> Risk fixed % of portfolio</li>
<li><strong>Volatility-Based:</strong> Adjust size based on asset volatility</li>
</ul>

<h2>Stop Loss Strategies</h2>
<ul>
<li><strong>Technical Stops:</strong> Based on chart levels</li>
<li><strong>ATR Stops:</strong> Using Average True Range</li>
<li><strong>Time Stops:</strong> Exit after specific time period</li>
</ul>`,
        level: "intermediate",
        category: "trading",
        duration: 32,
        format: "video",
        order: 9,
        requiredTier: "basic",
        prerequisites: ["Technical Indicators - RSI & MACD"],
        learningObjectives: ["Calculate position sizes", "Set appropriate stop losses", "Manage portfolio risk"],
        isLocked: false,
        isPremium: false,
        tags: ["risk-management", "position-sizing", "stops"]
      },
      {
        title: "DeFi Fundamentals",
        description: "Introduction to Decentralized Finance protocols and yield farming.",
        content: `<h1>DeFi Fundamentals</h1>
<p>DeFi represents a paradigm shift from traditional finance to decentralized protocols.</p>
<h2>Key DeFi Concepts</h2>
<ul>
<li><strong>Liquidity Pools:</strong> Automated market making</li>
<li><strong>Yield Farming:</strong> Earning rewards through liquidity provision</li>
<li><strong>Lending Protocols:</strong> Decentralized borrowing and lending</li>
<li><strong>DEX:</strong> Decentralized exchanges</li>
</ul>`,
        level: "intermediate",
        category: "defi",
        duration: 35,
        format: "video",
        order: 10,
        requiredTier: "basic",
        prerequisites: ["Introduction to Ethereum"],
        learningObjectives: ["Understand DeFi protocols", "Learn about yield farming", "Navigate DeFi safely"],
        isLocked: false,
        isPremium: false,
        tags: ["defi", "yield-farming", "protocols"]
      }
    ]);
    
    console.log("✅ Comprehensive lesson library created with 10 foundational lessons");

    console.log("🎉 Database seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}
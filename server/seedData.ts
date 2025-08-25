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
            "Access to 10 foundation lessons",
            "Basic trading simulator ($1K virtual)",
            "Community forum access",
            "Weekly market updates",
            "Basic portfolio tracking"
          ],
          hasSimulator: true,
          hasCommunity: true,
          hasAnalytics: false,
          hasLiveTrading: false,
          hasSignals: false,

        },
        {
          tier: "basic",
          name: "Basic",
          priceMonthly: "19.99",
          priceYearly: "199.99",
          features: [
            "Complete lesson library (50+ lessons)",
            "Advanced trading simulator ($10K virtual)",
            "Progress tracking & analytics",
            "Technical analysis tools",
            "Community access",
            "Email support"
          ],
          hasSimulator: true,
          hasCommunity: true,
          hasAnalytics: true,
          hasLiveTrading: false,
          hasSignals: false,

        },
        {
          tier: "pro",
          name: "Pro", 
          priceMonthly: "49.99",
          priceYearly: "499.99",
          features: [
            "Everything in Basic",
            "Real-time market data & alerts",
            "AI-powered trading signals",
            "Advanced analytics dashboard",
            "Whale activity tracking",
            "Priority support"
          ],
          hasSimulator: true,
          hasCommunity: true,
          hasAnalytics: true,
          hasLiveTrading: true,
          hasSignals: true,

        },
        {
          tier: "elite",
          name: "Elite",
          priceMonthly: "99.99",
          priceYearly: "999.99", 
          features: [
            "Everything in Pro",
            "Exclusive premium content",
            "Early access to new features",
            "Advanced market insights",
            "Custom alerts & notifications",
            "VIP community access",
            "Dedicated support channel"
          ],
          hasSimulator: true,
          hasCommunity: true,
          hasAnalytics: true,
          hasLiveTrading: true,
          hasSignals: true,

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
        videoUrl: "https://www.youtube.com/embed/VYWc9dFqROI",
        hasQuiz: true,
        hasSimulation: false,
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
        videoUrl: "https://www.youtube.com/embed/SSo_EIwHSd4",
        hasQuiz: true,
        hasSimulation: true,
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
        videoUrl: "https://www.youtube.com/embed/bBC-nXj3Ng4",
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
        videoUrl: "https://www.youtube.com/embed/jxLkbJozKbY",
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
        videoUrl: "https://www.youtube.com/embed/d8IBpfs9bf4",
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
        videoUrl: "https://www.youtube.com/embed/bCb_7x2-W7U",
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
        videoUrl: "https://www.youtube.com/embed/7a_tMi8IRzQ",
        hasQuiz: true,
        hasSimulation: true,
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
        videoUrl: "https://www.youtube.com/embed/MfAhyV6RdoI",
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
        videoUrl: "https://www.youtube.com/embed/XM0B6O-XBdI",
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
        videoUrl: "https://www.youtube.com/embed/k9HYC0EJU6E",
        tags: ["defi", "yield-farming", "protocols"]
      },
      
      // Advanced Trading Track (Pro Tier) - Lessons 11-25
      {
        title: "Advanced Chart Patterns",
        description: "Master complex chart patterns for better trade timing.",
        content: `<h1>Advanced Chart Patterns</h1>
<p>Professional traders use sophisticated patterns to predict market movements.</p>
<h2>Reversal Patterns</h2>
<ul>
<li><strong>Head and Shoulders:</strong> Bearish reversal pattern</li>
<li><strong>Double Top/Bottom:</strong> Strong reversal signals</li>
<li><strong>Triple Top/Bottom:</strong> Major trend changes</li>
</ul>
<h2>Continuation Patterns</h2>
<ul>
<li><strong>Triangles:</strong> Ascending, descending, symmetrical</li>
<li><strong>Flags & Pennants:</strong> Brief consolidation periods</li>
<li><strong>Channels:</strong> Trending price corridors</li>
</ul>`,
        level: "advanced",
        category: "technical-analysis",
        duration: 40,
        format: "video",
        order: 11,
        requiredTier: "pro",
        prerequisites: ["Technical Indicators - RSI & MACD"],
        learningObjectives: ["Identify complex patterns", "Time entries and exits", "Combine with volume analysis"],
        isLocked: false,
        isPremium: true,
        videoUrl: "https://www.youtube.com/embed/bnXNi7Y3xjo",
        tags: ["patterns", "advanced", "technical-analysis"]
      },
      {
        title: "NFT Market Analysis",
        description: "Understanding the NFT ecosystem and investment opportunities.",
        content: `<h1>NFT Market Analysis</h1>
<p>Non-Fungible Tokens represent unique digital assets with various use cases.</p>
<h2>NFT Categories</h2>
<ul>
<li><strong>Art & Collectibles:</strong> Digital artwork and rare items</li>
<li><strong>Gaming Assets:</strong> In-game items and characters</li>
<li><strong>Utility NFTs:</strong> Access tokens and memberships</li>
<li><strong>Domain Names:</strong> Blockchain-based web addresses</li>
</ul>`,
        level: "intermediate",
        category: "nft",
        duration: 28,
        format: "video",
        order: 12,
        requiredTier: "basic",
        prerequisites: ["Introduction to Ethereum"],
        learningObjectives: ["Analyze NFT projects", "Understand utility vs speculation", "Evaluate long-term potential"],
        isLocked: false,
        isPremium: false,
        videoUrl: "https://www.youtube.com/embed/NNQLJcJEzv0",
        tags: ["nft", "digital-assets", "collectibles"]
      },
      {
        title: "Layer 2 Solutions",
        description: "Scaling Ethereum with Layer 2 networks.",
        content: `<h1>Layer 2 Solutions</h1>
<p>Layer 2 solutions address Ethereum's scalability challenges.</p>
<h2>Types of Layer 2</h2>
<ul>
<li><strong>Optimistic Rollups:</strong> Arbitrum, Optimism</li>
<li><strong>ZK-Rollups:</strong> zkSync, Polygon zkEVM</li>
<li><strong>Sidechains:</strong> Polygon PoS, BSC</li>
</ul>`,
        level: "advanced",
        category: "defi",
        duration: 38,
        format: "video",
        order: 13,
        requiredTier: "pro",
        prerequisites: ["DeFi Fundamentals"],
        learningObjectives: ["Understand scaling solutions", "Compare L2 options", "Navigate multi-chain DeFi"],
        isLocked: false,
        isPremium: true,
        videoUrl: "https://www.youtube.com/embed/7pWxCklcNsU",
        tags: ["layer2", "scaling", "ethereum"]
      },
      {
        title: "Altcoin Analysis Framework",
        description: "Systematic approach to evaluating alternative cryptocurrencies.",
        content: `<h1>Altcoin Analysis Framework</h1>
<p>Not all cryptocurrencies are created equal. Learn to evaluate projects systematically.</p>
<h2>Fundamental Analysis</h2>
<ul>
<li><strong>Team & Leadership:</strong> Experience and track record</li>
<li><strong>Technology:</strong> Innovation and scalability</li>
<li><strong>Use Case:</strong> Real-world problem solving</li>
<li><strong>Tokenomics:</strong> Supply distribution and incentives</li>
</ul>`,
        level: "intermediate",
        category: "analysis",
        duration: 35,
        format: "video",
        order: 14,
        requiredTier: "basic",
        prerequisites: ["Introduction to Ethereum"],
        learningObjectives: ["Evaluate altcoin projects", "Analyze tokenomics", "Compare competitive advantages"],
        isLocked: false,
        isPremium: false,
        videoUrl: "https://www.youtube.com/embed/VYWc9dFqROI",
        tags: ["altcoins", "analysis", "fundamentals"]
      },
      {
        title: "Psychology of Trading",
        description: "Master the mental game of successful trading.",
        content: `<h1>Psychology of Trading</h1>
<p>Trading psychology often determines success more than technical skills.</p>
<h2>Common Trading Biases</h2>
<ul>
<li><strong>FOMO:</strong> Fear of missing out drives bad decisions</li>
<li><strong>Confirmation Bias:</strong> Seeking information that confirms beliefs</li>
<li><strong>Loss Aversion:</strong> Avoiding losses over equivalent gains</li>
</ul>`,
        level: "intermediate",
        category: "trading",
        duration: 30,
        format: "video",
        order: 15,
        requiredTier: "basic",
        prerequisites: ["Risk Management Strategies"],
        learningObjectives: ["Recognize trading biases", "Develop emotional discipline", "Create trading rules"],
        isLocked: false,
        isPremium: false,
        videoUrl: "https://www.youtube.com/embed/DAjNUsycJL4",
        tags: ["psychology", "emotions", "discipline"]
      },
      {
        title: "Smart Contract Fundamentals",
        description: "Introduction to programmable blockchain contracts.",
        content: `<h1>Smart Contract Fundamentals</h1>
<p>Smart contracts are self-executing contracts with terms directly written into code.</p>
<h2>Key Features</h2>
<ul>
<li><strong>Automation:</strong> Execute automatically when conditions are met</li>
<li><strong>Transparency:</strong> Code is publicly verifiable</li>
<li><strong>Immutability:</strong> Cannot be changed after deployment</li>
</ul>`,
        level: "intermediate",
        category: "defi",
        duration: 28,
        format: "video",
        order: 16,
        requiredTier: "basic",
        prerequisites: ["Introduction to Ethereum"],
        learningObjectives: ["Understand smart contracts", "Identify use cases", "Assess risks and benefits"],
        isLocked: false,
        isPremium: false,
        videoUrl: "https://www.youtube.com/embed/ZE2HxTmxfrI",
        tags: ["smart-contracts", "automation", "code"]
      },
      {
        title: "Staking and Proof of Stake",
        description: "Learn about staking rewards and PoS consensus.",
        content: `<h1>Staking and Proof of Stake</h1>
<p>Proof of Stake offers an energy-efficient alternative to mining.</p>
<h2>Staking Benefits</h2>
<ul>
<li><strong>Passive Income:</strong> Earn rewards for holding tokens</li>
<li><strong>Network Security:</strong> Help secure the blockchain</li>
<li><strong>Lower Energy:</strong> More environmentally friendly</li>
</ul>`,
        level: "intermediate",
        category: "defi",
        duration: 26,
        format: "video",
        order: 17,
        requiredTier: "basic",
        prerequisites: ["Introduction to Ethereum"],
        learningObjectives: ["Understand PoS consensus", "Learn staking strategies", "Calculate staking returns"],
        isLocked: false,
        isPremium: false,
        videoUrl: "https://www.youtube.com/embed/M3EFi_POhps",
        tags: ["staking", "pos", "rewards"]
      },
      {
        title: "Understanding Bitcoin Halving",
        description: "Learn about Bitcoin's supply mechanism and halving events.",
        content: `<h1>Understanding Bitcoin Halving</h1>
<p>Bitcoin halving is a critical event that occurs every 210,000 blocks (approximately every 4 years).</p>
<h2>Halving Mechanics</h2>
<ul>
<li><strong>Block Reward:</strong> Mining reward cut in half</li>
<li><strong>Supply Rate:</strong> New Bitcoin creation slows</li>
<li><strong>Scarcity Effect:</strong> Potentially impacts price</li>
</ul>`,
        level: "intermediate",
        category: "basics",
        duration: 25,
        format: "video",
        order: 18,
        requiredTier: "basic",
        prerequisites: ["Understanding Bitcoin"],
        learningObjectives: ["Understand halving mechanics", "Analyze historical impacts", "Predict future effects"],
        isLocked: false,
        isPremium: false,
        videoUrl: "https://www.youtube.com/embed/lnGdb4-qAuc",
        tags: ["bitcoin", "halving", "scarcity"]
      },
      {
        title: "Cryptocurrency Taxation",
        description: "Understanding tax implications of cryptocurrency trading.",
        content: `<h1>Cryptocurrency Taxation</h1>
<p>Cryptocurrency gains are taxable events in most jurisdictions.</p>
<h2>Taxable Events</h2>
<ul>
<li><strong>Crypto to Fiat:</strong> Selling for traditional currency</li>
<li><strong>Crypto to Crypto:</strong> Trading between cryptocurrencies</li>
<li><strong>DeFi Activities:</strong> Staking, lending, yield farming</li>
</ul>`,
        level: "beginner",
        category: "basics",
        duration: 22,
        format: "video",
        order: 19,
        requiredTier: "free",
        prerequisites: ["Cryptocurrency Exchanges"],
        learningObjectives: ["Identify taxable events", "Keep proper records", "Understand reporting requirements"],
        isLocked: false,
        isPremium: false,
        videoUrl: "https://www.youtube.com/embed/9ooN1eN2RjY",
        tags: ["taxation", "compliance", "reporting"]
      },
      {
        title: "Portfolio Diversification",
        description: "Building balanced cryptocurrency portfolios.",
        content: `<h1>Portfolio Diversification in Crypto</h1>
<p>Diversification helps manage risk in volatile crypto markets.</p>
<h2>Diversification Strategies</h2>
<ul>
<li><strong>By Market Cap:</strong> Large, mid, small cap allocation</li>
<li><strong>By Sector:</strong> DeFi, gaming, infrastructure, payments</li>
<li><strong>By Risk Level:</strong> Conservative to speculative allocation</li>
</ul>`,
        level: "intermediate",
        category: "trading",
        duration: 32,
        format: "video",
        order: 20,
        requiredTier: "basic",
        prerequisites: ["Risk Management Strategies"],
        learningObjectives: ["Build diversified portfolios", "Balance risk and reward", "Rebalance strategies"],
        isLocked: false,
        isPremium: false,
        videoUrl: "https://www.youtube.com/embed/VYWc9dFqROI",
        tags: ["portfolio", "diversification", "risk-management"]
      },
      
      // Expert/Elite Track - Lessons 21-35
      {
        title: "Advanced Security Practices",
        description: "Advanced security practices for serious crypto investors.",
        content: `<h1>Advanced Security Practices</h1>
<p>As your crypto holdings grow, security becomes increasingly critical.</p>
<h2>Advanced Security Measures</h2>
<ul>
<li><strong>Multi-Sig Wallets:</strong> Require multiple signatures</li>
<li><strong>Hardware Security Modules:</strong> Enterprise-grade protection</li>
<li><strong>Social Recovery:</strong> Trusted contacts can help recover access</li>
</ul>`,
        level: "advanced",
        category: "security",
        duration: 45,
        format: "video",
        order: 21,
        requiredTier: "pro",
        prerequisites: ["Crypto Wallet Security"],
        learningObjectives: ["Implement advanced security", "Protect large holdings", "Maintain operational security"],
        isLocked: false,
        isPremium: true,
        videoUrl: "https://www.youtube.com/embed/d8IBpfs9bf4",
        tags: ["advanced-security", "multi-sig", "opsec"]
      },
      {
        title: "Yield Farming Strategies",
        description: "Advanced DeFi yield optimization techniques.",
        content: `<h1>Yield Farming Strategies</h1>
<p>Maximize returns through sophisticated DeFi strategies.</p>
<h2>Advanced Strategies</h2>
<ul>
<li><strong>Liquidity Mining:</strong> Earn tokens by providing liquidity</li>
<li><strong>Arbitrage Farming:</strong> Exploit price differences</li>
<li><strong>Leveraged Farming:</strong> Amplify returns with borrowed capital</li>
</ul>`,
        level: "advanced",
        category: "defi",
        duration: 42,
        format: "video",
        order: 22,
        requiredTier: "pro",
        prerequisites: ["DeFi Fundamentals", "Layer 2 Solutions"],
        learningObjectives: ["Execute advanced farming strategies", "Manage impermanent loss", "Optimize gas costs"],
        isLocked: false,
        isPremium: true,
        videoUrl: "https://www.youtube.com/embed/ClnnLI1SClA",
        tags: ["yield-farming", "defi", "liquidity"]
      },
      {
        title: "Derivatives Trading",
        description: "Futures, options, and perpetual swaps in crypto.",
        content: `<h1>Derivatives Trading</h1>
<p>Leverage and hedge your crypto positions with derivatives.</p>
<h2>Types of Derivatives</h2>
<ul>
<li><strong>Futures:</strong> Contracts to buy/sell at future date</li>
<li><strong>Options:</strong> Right but not obligation to trade</li>
<li><strong>Perpetual Swaps:</strong> Never-expiring futures contracts</li>
</ul>`,
        level: "advanced",
        category: "trading",
        duration: 50,
        format: "video",
        order: 23,
        requiredTier: "pro",
        prerequisites: ["Advanced Chart Patterns", "Risk Management Strategies"],
        learningObjectives: ["Trade derivatives safely", "Manage leverage", "Hedge positions effectively"],
        isLocked: false,
        isPremium: true,
        videoUrl: "https://www.youtube.com/embed/YhJNsLQw4NI",
        tags: ["derivatives", "leverage", "futures"]
      },
      {
        title: "Algorithmic Trading Basics",
        description: "Introduction to automated crypto trading strategies.",
        content: `<h1>Algorithmic Trading Basics</h1>
<p>Automate your trading with systematic strategies.</p>
<h2>Strategy Types</h2>
<ul>
<li><strong>Trend Following:</strong> Moving average crossovers</li>
<li><strong>Mean Reversion:</strong> Price returning to average</li>
<li><strong>Arbitrage:</strong> Price differences across exchanges</li>
</ul>`,
        level: "advanced",
        category: "trading",
        duration: 55,
        format: "video",
        order: 24,
        requiredTier: "pro",
        prerequisites: ["Psychology of Trading", "Technical Indicators - RSI & MACD"],
        learningObjectives: ["Build trading algorithms", "Backtest strategies", "Implement automation"],
        isLocked: false,
        isPremium: true,
        videoUrl: "https://www.youtube.com/embed/f6hrlH7Qs4k",
        tags: ["algorithmic", "automation", "bots"]
      },
      {
        title: "Tokenomics Deep Dive",
        description: "Advanced analysis of cryptocurrency economics.",
        content: `<h1>Tokenomics Deep Dive</h1>
<p>Understand the economic mechanics behind cryptocurrency projects.</p>
<h2>Key Metrics</h2>
<ul>
<li><strong>Token Distribution:</strong> Allocation to team, investors, community</li>
<li><strong>Vesting Schedules:</strong> When tokens become available</li>
<li><strong>Inflation/Deflation:</strong> Supply increase or decrease mechanisms</li>
</ul>`,
        level: "advanced",
        category: "analysis",
        duration: 40,
        format: "video",
        order: 25,
        requiredTier: "pro",
        prerequisites: ["Altcoin Analysis Framework"],
        learningObjectives: ["Evaluate token economics", "Predict price impacts", "Assess long-term sustainability"],
        isLocked: false,
        isPremium: true,
        videoUrl: "https://www.youtube.com/embed/YhJNsLQw4NI",
        tags: ["tokenomics", "economics", "valuation"]
      },
      
      // Specialized Topics - Lessons 26-40
      {
        title: "Cross-Chain Protocols",
        description: "Understanding blockchain interoperability solutions.",
        content: `<h1>Cross-Chain Protocols</h1>
<p>Bridges and protocols that connect different blockchains.</p>
<h2>Bridge Types</h2>
<ul>
<li><strong>Lock and Mint:</strong> Assets locked on one chain, minted on another</li>
<li><strong>Atomic Swaps:</strong> Direct peer-to-peer exchanges</li>
<li><strong>Liquidity Pools:</strong> Shared liquidity across chains</li>
</ul>`,
        level: "advanced",
        category: "defi",
        duration: 35,
        format: "video",
        order: 26,
        requiredTier: "pro",
        prerequisites: ["Layer 2 Solutions"],
        learningObjectives: ["Navigate cross-chain DeFi", "Understand bridge risks", "Use interoperability protocols"],
        isLocked: false,
        isPremium: true,
        videoUrl: "https://www.youtube.com/embed/7pWxCklcNsU",
        tags: ["cross-chain", "bridges", "interoperability"]
      },
      {
        title: "DAO Governance",
        description: "Participating in Decentralized Autonomous Organizations.",
        content: `<h1>DAO Governance</h1>
<p>Learn how DAOs operate and how to participate effectively.</p>
<h2>Governance Mechanisms</h2>
<ul>
<li><strong>Token Voting:</strong> Stake-weighted decision making</li>
<li><strong>Proposal Systems:</strong> How changes are suggested</li>
<li><strong>Execution:</strong> Automatic implementation of decisions</li>
</ul>`,
        level: "intermediate",
        category: "defi",
        duration: 30,
        format: "video",
        order: 27,
        requiredTier: "basic",
        prerequisites: ["Smart Contract Fundamentals"],
        learningObjectives: ["Participate in DAO governance", "Submit proposals", "Understand voting mechanisms"],
        isLocked: false,
        isPremium: false,
        videoUrl: "https://www.youtube.com/embed/X_QKZzd68ro",
        tags: ["dao", "governance", "voting"]
      },
      {
        title: "MEV and Arbitrage",
        description: "Understanding Maximum Extractable Value opportunities.",
        content: `<h1>MEV and Arbitrage</h1>
<p>Learn about the hidden value in blockchain transaction ordering.</p>
<h2>MEV Strategies</h2>
<ul>
<li><strong>Arbitrage:</strong> Price differences across DEXs</li>
<li><strong>Liquidations:</strong> Profiting from liquidation events</li>
<li><strong>Sandwich Attacks:</strong> Front-running and back-running</li>
</ul>`,
        level: "expert",
        category: "trading",
        duration: 45,
        format: "video",
        order: 28,
        requiredTier: "elite",
        prerequisites: ["Algorithmic Trading Basics", "Cross-Chain Protocols"],
        learningObjectives: ["Identify MEV opportunities", "Execute arbitrage trades", "Understand flashloan strategies"],
        isLocked: false,
        isPremium: true,
        videoUrl: "https://www.youtube.com/embed/ClnnLI1SClA",
        tags: ["mev", "arbitrage", "flashloans"]
      },
      {
        title: "Privacy Coins Analysis",
        description: "Understanding privacy-focused cryptocurrencies.",
        content: `<h1>Privacy Coins Analysis</h1>
<p>Explore cryptocurrencies designed for transaction privacy.</p>
<h2>Privacy Technologies</h2>
<ul>
<li><strong>Ring Signatures:</strong> Monero's privacy approach</li>
<li><strong>zk-SNARKs:</strong> Zero-knowledge proofs in Zcash</li>
<li><strong>Mixing Services:</strong> Transaction obfuscation</li>
</ul>`,
        level: "advanced",
        category: "analysis",
        duration: 38,
        format: "video",
        order: 29,
        requiredTier: "pro",
        prerequisites: ["Advanced Security Practices"],
        learningObjectives: ["Understand privacy technologies", "Evaluate privacy tradeoffs", "Navigate regulatory landscape"],
        isLocked: false,
        isPremium: true,
        tags: ["privacy", "monero", "zcash"]
      },
      {
        title: "GameFi Economics",
        description: "Play-to-earn gaming and NFT economics.",
        content: `<h1>GameFi Economics</h1>
<p>Understanding the economics of blockchain gaming.</p>
<h2>GameFi Models</h2>
<ul>
<li><strong>Play-to-Earn:</strong> Earning tokens through gameplay</li>
<li><strong>NFT Assets:</strong> Tradeable in-game items</li>
<li><strong>Guild Systems:</strong> Scholarship and lending models</li>
</ul>`,
        level: "intermediate",
        category: "nft",
        duration: 32,
        format: "video",
        order: 30,
        requiredTier: "basic",
        prerequisites: ["NFT Market Analysis"],
        learningObjectives: ["Evaluate GameFi projects", "Understand P2E economics", "Assess sustainability"],
        isLocked: false,
        isPremium: false,
        tags: ["gamefi", "p2e", "gaming"]
      },
      {
        title: "Central Bank Digital Currencies",
        description: "Understanding CBDCs and their market impact.",
        content: `<h1>Central Bank Digital Currencies</h1>
<p>How government digital currencies might affect crypto markets.</p>
<h2>CBDC Features</h2>
<ul>
<li><strong>Digital Fiat:</strong> Government-issued digital money</li>
<li><strong>Programmable Money:</strong> Smart contract capabilities</li>
<li><strong>Financial Surveillance:</strong> Complete transaction tracking</li>
</ul>`,
        level: "intermediate",
        category: "basics",
        duration: 28,
        format: "video",
        order: 31,
        requiredTier: "basic",
        prerequisites: ["Understanding Bitcoin"],
        learningObjectives: ["Understand CBDC implications", "Analyze market impacts", "Compare to cryptocurrencies"],
        isLocked: false,
        isPremium: false,
        tags: ["cbdc", "digital-fiat", "regulation"]
      },
      {
        title: "Institutional Crypto Adoption",
        description: "How institutions are entering the crypto space.",
        content: `<h1>Institutional Crypto Adoption</h1>
<p>Understanding institutional investment in cryptocurrency.</p>
<h2>Institutional Products</h2>
<ul>
<li><strong>Bitcoin ETFs:</strong> Regulated exposure to Bitcoin</li>
<li><strong>Custody Solutions:</strong> Institutional-grade storage</li>
<li><strong>Treasury Allocation:</strong> Companies holding Bitcoin</li>
</ul>`,
        level: "intermediate",
        category: "analysis",
        duration: 35,
        format: "video",
        order: 32,
        requiredTier: "basic",
        prerequisites: ["Understanding Bitcoin"],
        learningObjectives: ["Track institutional flows", "Understand market impacts", "Identify opportunities"],
        isLocked: false,
        isPremium: false,
        tags: ["institutions", "etfs", "adoption"]
      },
      {
        title: "Regulatory Landscape",
        description: "Understanding crypto regulations worldwide.",
        content: `<h1>Regulatory Landscape</h1>
<p>Navigate the complex world of cryptocurrency regulations.</p>
<h2>Regulatory Approaches</h2>
<ul>
<li><strong>United States:</strong> SEC enforcement and clarity</li>
<li><strong>European Union:</strong> MiCA regulation framework</li>
<li><strong>Asia-Pacific:</strong> Varying approaches across countries</li>
</ul>`,
        level: "intermediate",
        category: "basics",
        duration: 40,
        format: "video",
        order: 33,
        requiredTier: "basic",
        prerequisites: ["Cryptocurrency Taxation"],
        learningObjectives: ["Understand regulatory trends", "Navigate compliance", "Assess regulatory risk"],
        isLocked: false,
        isPremium: false,
        tags: ["regulation", "compliance", "legal"]
      },
      {
        title: "Macro Economic Impact",
        description: "How macroeconomic factors affect crypto markets.",
        content: `<h1>Macro Economic Impact</h1>
<p>Understanding the relationship between macro conditions and crypto.</p>
<h2>Key Factors</h2>
<ul>
<li><strong>Interest Rates:</strong> Fed policy impacts risk assets</li>
<li><strong>Inflation:</strong> Bitcoin as inflation hedge narrative</li>
<li><strong>Dollar Strength:</strong> Inverse relationship with crypto</li>
</ul>`,
        level: "advanced",
        category: "analysis",
        duration: 38,
        format: "video",
        order: 34,
        requiredTier: "pro",
        prerequisites: ["Institutional Crypto Adoption"],
        learningObjectives: ["Analyze macro factors", "Predict market movements", "Time market cycles"],
        isLocked: false,
        isPremium: true,
        tags: ["macro", "economics", "cycles"]
      },
      {
        title: "Technical Analysis Mastery",
        description: "Advanced technical analysis techniques.",
        content: `<h1>Technical Analysis Mastery</h1>
<p>Master advanced charting techniques for professional trading.</p>
<h2>Advanced Concepts</h2>
<ul>
<li><strong>Elliott Wave Theory:</strong> Market wave patterns</li>
<li><strong>Fibonacci Extensions:</strong> Price target projections</li>
<li><strong>Volume Profile:</strong> Price-volume relationship</li>
</ul>`,
        level: "expert",
        category: "technical-analysis",
        duration: 60,
        format: "video",
        order: 35,
        requiredTier: "elite",
        prerequisites: ["Advanced Chart Patterns", "Derivatives Trading"],
        learningObjectives: ["Master Elliott Wave", "Use Fibonacci tools", "Analyze volume profile"],
        isLocked: false,
        isPremium: true,
        tags: ["advanced-ta", "elliott-wave", "fibonacci"]
      },
      
      // Cutting-Edge Topics - Lessons 36-50+
      {
        title: "Zero-Knowledge Proofs",
        description: "Understanding ZK technology and its applications.",
        content: `<h1>Zero-Knowledge Proofs</h1>
<p>Learn about cryptographic proofs that protect privacy.</p>
<h2>ZK Applications</h2>
<ul>
<li><strong>Privacy:</strong> Prove knowledge without revealing information</li>
<li><strong>Scaling:</strong> ZK-rollups for Ethereum</li>
<li><strong>Identity:</strong> Anonymous verification systems</li>
</ul>`,
        level: "expert",
        category: "technology",
        duration: 45,
        format: "video",
        order: 36,
        requiredTier: "elite",
        prerequisites: ["Layer 2 Solutions", "Privacy Coins Analysis"],
        learningObjectives: ["Understand ZK proofs", "Evaluate ZK projects", "Assess privacy benefits"],
        isLocked: false,
        isPremium: true,
        tags: ["zero-knowledge", "privacy", "cryptography"]
      },
      {
        title: "Web3 Infrastructure",
        description: "Building blocks of the decentralized web.",
        content: `<h1>Web3 Infrastructure</h1>
<p>Understanding the infrastructure powering Web3 applications.</p>
<h2>Infrastructure Components</h2>
<ul>
<li><strong>IPFS:</strong> Decentralized file storage</li>
<li><strong>Graph Protocol:</strong> Blockchain data indexing</li>
<li><strong>Chainlink:</strong> Oracle networks for external data</li>
</ul>`,
        level: "advanced",
        category: "technology",
        duration: 42,
        format: "video",
        order: 37,
        requiredTier: "pro",
        prerequisites: ["Smart Contract Fundamentals"],
        learningObjectives: ["Understand Web3 stack", "Evaluate infrastructure projects", "Identify investment opportunities"],
        isLocked: false,
        isPremium: true,
        tags: ["web3", "infrastructure", "oracles"]
      },
      {
        title: "Quantum Computing Impact",
        description: "How quantum computing might affect cryptocurrencies.",
        content: `<h1>Quantum Computing Impact</h1>
<p>Exploring the potential quantum threat to current cryptography.</p>
<h2>Quantum Threats</h2>
<ul>
<li><strong>Cryptographic Breaking:</strong> Current algorithms at risk</li>
<li><strong>Timeline:</strong> When quantum computers might threaten crypto</li>
<li><strong>Solutions:</strong> Quantum-resistant cryptography</li>
</ul>`,
        level: "expert",
        category: "technology",
        duration: 35,
        format: "video",
        order: 38,
        requiredTier: "elite",
        prerequisites: ["Advanced Security Practices"],
        learningObjectives: ["Understand quantum threats", "Assess timeline", "Evaluate quantum-safe solutions"],
        isLocked: false,
        isPremium: true,
        tags: ["quantum", "cryptography", "security"]
      },
      {
        title: "AI and Blockchain Convergence",
        description: "How AI and blockchain technologies intersect.",
        content: `<h1>AI and Blockchain Convergence</h1>
<p>Exploring the intersection of artificial intelligence and blockchain.</p>
<h2>Convergence Areas</h2>
<ul>
<li><strong>Decentralized AI:</strong> Distributed machine learning</li>
<li><strong>AI Trading:</strong> Algorithmic strategies using ML</li>
<li><strong>Data Markets:</strong> Monetizing AI training data</li>
</ul>`,
        level: "expert",
        category: "technology",
        duration: 40,
        format: "video",
        order: 39,
        requiredTier: "elite",
        prerequisites: ["Algorithmic Trading Basics", "Web3 Infrastructure"],
        learningObjectives: ["Understand AI-blockchain synergy", "Identify investment themes", "Evaluate AI crypto projects"],
        isLocked: false,
        isPremium: true,
        tags: ["ai", "machine-learning", "convergence"]
      },
      {
        title: "Sustainable Crypto Mining",
        description: "Environmental considerations and green mining practices.",
        content: `<h1>Sustainable Crypto Mining</h1>
<p>Addressing environmental concerns in cryptocurrency mining.</p>
<h2>Sustainability Solutions</h2>
<ul>
<li><strong>Renewable Energy:</strong> Solar and wind-powered mining</li>
<li><strong>Carbon Offsetting:</strong> Neutralizing environmental impact</li>
<li><strong>Efficient Hardware:</strong> Reducing energy consumption</li>
</ul>`,
        level: "intermediate",
        category: "basics",
        duration: 30,
        format: "video",
        order: 40,
        requiredTier: "basic",
        prerequisites: ["Understanding Bitcoin"],
        learningObjectives: ["Understand environmental impact", "Evaluate green mining", "Assess ESG considerations"],
        isLocked: false,
        isPremium: false,
        tags: ["sustainability", "mining", "environment"]
      },
      
      // Advanced Trading Psychology & Strategy - Lessons 41-50
      {
        title: "Advanced Risk Models",
        description: "Sophisticated risk management for professional traders.",
        content: `<h1>Advanced Risk Models</h1>
<p>Professional risk management techniques for serious traders.</p>
<h2>Risk Metrics</h2>
<ul>
<li><strong>Value at Risk (VaR):</strong> Potential loss estimation</li>
<li><strong>Sharpe Ratio:</strong> Risk-adjusted returns</li>
<li><strong>Maximum Drawdown:</strong> Worst-case scenarios</li>
</ul>`,
        level: "expert",
        category: "trading",
        duration: 50,
        format: "video",
        order: 41,
        requiredTier: "elite",
        prerequisites: ["Derivatives Trading", "Portfolio Diversification"],
        learningObjectives: ["Calculate advanced risk metrics", "Build risk models", "Optimize risk-return profiles"],
        isLocked: false,
        isPremium: true,
        tags: ["risk-models", "var", "optimization"]
      },
      {
        title: "Market Making Strategies",
        description: "Providing liquidity and earning spreads in crypto markets.",
        content: `<h1>Market Making Strategies</h1>
<p>Learn how to provide liquidity and profit from bid-ask spreads.</p>
<h2>Market Making Concepts</h2>
<ul>
<li><strong>Bid-Ask Spreads:</strong> Profit from price differences</li>
<li><strong>Inventory Management:</strong> Balancing long/short positions</li>
<li><strong>Adverse Selection:</strong> Avoiding informed traders</li>
</ul>`,
        level: "expert",
        category: "trading",
        duration: 45,
        format: "video",
        order: 42,
        requiredTier: "elite",
        prerequisites: ["MEV and Arbitrage", "Algorithmic Trading Basics"],
        learningObjectives: ["Implement market making strategies", "Manage inventory risk", "Optimize spread capture"],
        isLocked: false,
        isPremium: true,
        tags: ["market-making", "liquidity", "spreads"]
      },
      {
        title: "Behavioral Finance in Crypto",
        description: "Psychology of market participants and behavioral biases.",
        content: `<h1>Behavioral Finance in Crypto</h1>
<p>Understanding how psychology drives crypto market movements.</p>
<h2>Market Psychology</h2>
<ul>
<li><strong>Herd Behavior:</strong> Following the crowd</li>
<li><strong>Cognitive Biases:</strong> Systematic thinking errors</li>
<li><strong>Sentiment Analysis:</strong> Measuring market emotions</li>
</ul>`,
        level: "advanced",
        category: "trading",
        duration: 38,
        format: "video",
        order: 43,
        requiredTier: "pro",
        prerequisites: ["Psychology of Trading", "Macro Economic Impact"],
        learningObjectives: ["Analyze market sentiment", "Exploit behavioral biases", "Develop contrarian strategies"],
        isLocked: false,
        isPremium: true,
        tags: ["behavioral-finance", "sentiment", "psychology"]
      },
      {
        title: "Options Strategies in Crypto",
        description: "Advanced options trading for volatility and income.",
        content: `<h1>Options Strategies in Crypto</h1>
<p>Sophisticated options strategies for crypto markets.</p>
<h2>Strategy Types</h2>
<ul>
<li><strong>Covered Calls:</strong> Income generation from holdings</li>
<li><strong>Protective Puts:</strong> Downside protection</li>
<li><strong>Volatility Plays:</strong> Profiting from price swings</li>
</ul>`,
        level: "expert",
        category: "trading",
        duration: 55,
        format: "video",
        order: 44,
        requiredTier: "elite",
        prerequisites: ["Derivatives Trading", "Advanced Risk Models"],
        learningObjectives: ["Execute options strategies", "Manage Greeks", "Trade volatility effectively"],
        isLocked: false,
        isPremium: true,
        tags: ["options", "volatility", "income"]
      },
      {
        title: "High-Frequency Trading",
        description: "Ultra-fast trading strategies and infrastructure.",
        content: `<h1>High-Frequency Trading</h1>
<p>Speed-based trading strategies in crypto markets.</p>
<h2>HFT Components</h2>
<ul>
<li><strong>Latency Optimization:</strong> Minimizing execution delay</li>
<li><strong>Co-location:</strong> Physical proximity to exchanges</li>
<li><strong>Statistical Arbitrage:</strong> Rapid mean-reversion trades</li>
</ul>`,
        level: "expert",
        category: "trading",
        duration: 48,
        format: "video",
        order: 45,
        requiredTier: "elite",
        prerequisites: ["Market Making Strategies", "Technical Analysis Mastery"],
        learningObjectives: ["Understand HFT infrastructure", "Implement speed strategies", "Manage technology risks"],
        isLocked: false,
        isPremium: true,
        tags: ["hft", "latency", "infrastructure"]
      },
      {
        title: "Multi-Asset Crypto Strategies",
        description: "Trading across different crypto asset classes.",
        content: `<h1>Multi-Asset Crypto Strategies</h1>
<p>Coordinated strategies across spot, derivatives, and DeFi.</p>
<h2>Strategy Integration</h2>
<ul>
<li><strong>Cross-Asset Arbitrage:</strong> Exploiting price differences</li>
<li><strong>Hedging Strategies:</strong> Managing portfolio risk</li>
<li><strong>Yield Enhancement:</strong> Optimizing returns across assets</li>
</ul>`,
        level: "expert",
        category: "trading",
        duration: 52,
        format: "video",
        order: 46,
        requiredTier: "elite",
        prerequisites: ["Options Strategies in Crypto", "Cross-Chain Protocols"],
        learningObjectives: ["Design multi-asset strategies", "Optimize cross-asset returns", "Manage complex portfolios"],
        isLocked: false,
        isPremium: true,
        tags: ["multi-asset", "coordination", "optimization"]
      },
      {
        title: "Crypto Fund Management",
        description: "Managing institutional-grade crypto portfolios.",
        content: `<h1>Crypto Fund Management</h1>
<p>Professional portfolio management techniques for crypto funds.</p>
<h2>Fund Operations</h2>
<ul>
<li><strong>Portfolio Construction:</strong> Asset allocation frameworks</li>
<li><strong>Risk Budgeting:</strong> Allocating risk across strategies</li>
<li><strong>Performance Attribution:</strong> Analyzing return sources</li>
</ul>`,
        level: "expert",
        category: "trading",
        duration: 60,
        format: "video",
        order: 47,
        requiredTier: "elite",
        prerequisites: ["Advanced Risk Models", "Multi-Asset Crypto Strategies"],
        learningObjectives: ["Manage institutional portfolios", "Implement risk budgeting", "Report performance professionally"],
        isLocked: false,
        isPremium: true,
        tags: ["fund-management", "institutional", "performance"]
      },
      {
        title: "Regulatory Compliance for Traders",
        description: "Navigating regulatory requirements for professional trading.",
        content: `<h1>Regulatory Compliance for Traders</h1>
<p>Understanding regulatory obligations for professional crypto traders.</p>
<h2>Compliance Areas</h2>
<ul>
<li><strong>AML/KYC:</strong> Anti-money laundering requirements</li>
<li><strong>Reporting:</strong> Trade reporting and record keeping</li>
<li><strong>Licensing:</strong> Professional trading licenses</li>
</ul>`,
        level: "expert",
        category: "trading",
        duration: 40,
        format: "video",
        order: 48,
        requiredTier: "elite",
        prerequisites: ["Regulatory Landscape", "Crypto Fund Management"],
        learningObjectives: ["Ensure compliance", "Implement controls", "Navigate licensing requirements"],
        isLocked: false,
        isPremium: true,
        tags: ["compliance", "aml", "licensing"]
      },
      {
        title: "Stress Testing Crypto Portfolios",
        description: "Testing portfolio resilience under extreme conditions.",
        content: `<h1>Stress Testing Crypto Portfolios</h1>
<p>Evaluate how your portfolio performs under extreme market conditions.</p>
<h2>Stress Test Types</h2>
<ul>
<li><strong>Historical Scenarios:</strong> Past market crashes</li>
<li><strong>Monte Carlo:</strong> Statistical simulation of outcomes</li>
<li><strong>Tail Risk:</strong> Extreme negative events</li>
</ul>`,
        level: "expert",
        category: "trading",
        duration: 45,
        format: "video",
        order: 49,
        requiredTier: "elite",
        prerequisites: ["Behavioral Finance in Crypto", "Advanced Risk Models"],
        learningObjectives: ["Conduct stress tests", "Model extreme scenarios", "Build resilient portfolios"],
        isLocked: false,
        isPremium: true,
        videoUrl: "https://www.youtube.com/embed/ClnnLI1SClA",
        tags: ["stress-testing", "risk", "simulation"]
      },
      {
        title: "Building a Crypto Trading Business",
        description: "Scaling from individual trader to trading business.",
        content: `<h1>Building a Crypto Trading Business</h1>
<p>Transform your trading skills into a scalable business.</p>
<h2>Business Components</h2>
<ul>
<li><strong>Team Building:</strong> Hiring and managing traders</li>
<li><strong>Technology Stack:</strong> Professional trading infrastructure</li>
<li><strong>Capital Raising:</strong> Attracting investor funds</li>
</ul>`,
        level: "expert",
        category: "trading",
        duration: 65,
        format: "video",
        order: 50,
        requiredTier: "elite",
        prerequisites: ["High-Frequency Trading", "Regulatory Compliance for Traders"],
        learningObjectives: ["Build trading teams", "Raise capital", "Scale operations professionally"],
        isLocked: false,
        isPremium: true,
        videoUrl: "https://www.youtube.com/embed/f6hrlH7Qs4k",
        tags: ["business", "scaling", "entrepreneurship"]
      }
    ]);
    
    console.log("✅ Comprehensive lesson library created with 50+ professional-grade lessons");

    console.log("🎉 Database seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}
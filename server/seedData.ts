import { db } from "./db";
import { subscriptionPlans, lessons, cryptoPrices, forumPosts, users, achievements, premiumContent, tradingSignals } from "@shared/schema";

export async function seedInitialData() {
  try {
    // Check if subscription plans already exist
    const existingPlans = await db.select().from(subscriptionPlans);
    
    if (existingPlans.length === 0) {
      // Create subscription plans
      await db.insert(subscriptionPlans).values([
        {
          name: "Free",
          tier: "free",
          priceMonthly: "0.00",
          features: [
            "15 foundation lessons",
            "Basic trading simulator", 
            "Community access",
            "Basic portfolio tracking",
            "14-day full trial"
          ],
          maxLessons: 15,
          hasSimulator: true,
          hasCommunity: true,
          hasAnalytics: false,
          hasLiveTrading: false,
          hasMentoring: false,
          hasSignals: false
        },
        {
          name: "Basic",
          tier: "basic", 
          priceMonthly: "19.99",
          priceYearly: "199.99",
          features: [
            "Complete lesson library (100+ lessons)",
            "Advanced trading simulator",
            "Priority community access", 
            "Advanced portfolio analytics",
            "NFT Academy access",
            "Quiz and certification system"
          ],
          hasSimulator: true,
          hasCommunity: true,
          hasAnalytics: true,
          hasLiveTrading: false,
          hasMentoring: false,
          hasSignals: false
        },
        {
          name: "Pro",
          tier: "pro",
          priceMonthly: "49.99", 
          priceYearly: "499.99",
          features: [
            "Everything in Basic",
            "Live trading sessions",
            "Trading signals & alerts",
            "Advanced analytics dashboard",
            "Exchange API connections",
            "Priority customer support"
          ],
          hasSimulator: true,
          hasCommunity: true,
          hasAnalytics: true,
          hasLiveTrading: true,
          hasMentoring: false,
          hasSignals: true
        },
        {
          name: "Elite",
          tier: "elite",
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

    // Check if lessons exist
    const existingLessons = await db.select().from(lessons);
    
    if (existingLessons.length === 0) {
      // Create comprehensive lesson library
      await db.insert(lessons).values([
        // Foundation Track (Free Tier)
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
          tags: ["cryptocurrency", "basics", "digital-money"],
          isLocked: false,
          isPremium: false
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
          tags: ["blockchain", "distributed-ledger", "technology"],
          isLocked: false,
          isPremium: false
        },
        {
          title: "Crypto Wallet Security Fundamentals",
          description: "Essential guide to securing your cryptocurrency assets and private keys.",
          content: `<h1>Crypto Wallet Security Fundamentals</h1>
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
</ol>

<h2>Common Security Threats</h2>
<ul>
<li>Phishing websites and fake apps</li>
<li>Malware and keyloggers</li>
<li>Social engineering attacks</li>
<li>Exchange hacks and exit scams</li>
</ul>`,
          level: "beginner",
          category: "security",
          duration: 25,
          format: "video",
          order: 3,
          requiredTier: "free",
          prerequisites: ["Blockchain Technology Explained"],
          learningObjectives: ["Choose appropriate wallet types", "Implement security practices", "Recognize security threats"],
          tags: ["wallet", "security", "private-keys"],
          isLocked: false,
          isPremium: false
        },
        {
          title: "Understanding Market Orders and Order Types",
          description: "Learn different order types and when to use them for optimal trading execution.",
          content: `<h1>Understanding Market Orders and Order Types</h1>
<p>Mastering order types is crucial for effective trading execution and risk management.</p>

<h2>Basic Order Types</h2>
<h3>Market Orders</h3>
<ul>
<li>Execute immediately at current market price</li>
<li>Guaranteed execution, but price may vary</li>
<li>Best for urgent trades or high liquidity markets</li>
<li>Higher slippage risk in volatile markets</li>
</ul>

<h3>Limit Orders</h3>
<ul>
<li>Buy/sell only at specified price or better</li>
<li>Price protection but no execution guarantee</li>
<li>Lower fees on many exchanges</li>
<li>Ideal for non-urgent trades</li>
</ul>

<h2>Advanced Order Types</h2>
<h3>Stop-Loss Orders</h3>
<ul>
<li>Automatically sell when price hits trigger</li>
<li>Essential for risk management</li>
<li>Converts to market order when triggered</li>
<li>May not execute at exact stop price</li>
</ul>

<h3>Stop-Limit Orders</h3>
<ul>
<li>Stop trigger + limit order combination</li>
<li>More price control than stop-loss</li>
<li>Risk of non-execution in fast markets</li>
<li>Good for volatile assets</li>
</ul>

<h2>Order Strategy Tips</h2>
<ol>
<li><strong>Use limits in sideways markets</strong></li>
<li><strong>Market orders for breakout entries</strong></li>
<li><strong>Always set stop-losses</strong></li>
<li><strong>Consider partial fills with large orders</strong></li>
</ol>`,
          level: "beginner",
          category: "trading",
          duration: 20,
          format: "interactive",
          order: 4,
          requiredTier: "free",
          prerequisites: ["Crypto Wallet Security Fundamentals"],
          learningObjectives: ["Master order types", "Understand execution mechanics", "Apply order strategies"],
          tags: ["orders", "execution", "trading-basics"],
          isLocked: false,
          isPremium: false
        },
        {
          title: "Reading Crypto Charts and Candlesticks",
          description: "Master chart reading fundamentals including candlestick patterns and timeframes.",
          content: `<h1>Reading Crypto Charts and Candlesticks</h1>
<p>Chart analysis is fundamental to successful trading. Learn to read price action like a professional trader.</p>

<h2>Candlestick Basics</h2>
<h3>Anatomy of a Candlestick</h3>
<ul>
<li><strong>Body:</strong> Open to close price range</li>
<li><strong>Wicks/Shadows:</strong> High and low price points</li>
<li><strong>Color:</strong> Green (bullish) vs Red (bearish)</li>
<li><strong>Size:</strong> Indicates market sentiment strength</li>
</ul>

<h3>Key Candlestick Patterns</h3>
<ul>
<li><strong>Doji:</strong> Indecision, potential reversal</li>
<li><strong>Hammer:</strong> Bullish reversal after downtrend</li>
<li><strong>Shooting Star:</strong> Bearish reversal after uptrend</li>
<li><strong>Engulfing:</strong> Strong momentum shift</li>
</ul>

<h2>Timeframe Analysis</h2>
<h3>Multiple Timeframe Strategy</h3>
<ul>
<li><strong>Higher timeframes:</strong> Overall trend direction</li>
<li><strong>Lower timeframes:</strong> Entry and exit timing</li>
<li><strong>Common combinations:</strong> Daily + 4H + 1H</li>
</ul>

<h2>Support and Resistance</h2>
<ul>
<li>Horizontal levels where price reacts</li>
<li>Previous highs become resistance</li>
<li>Previous lows become support</li>
<li>Volume confirms level strength</li>
</ul>`,
          level: "beginner",
          category: "analysis",
          duration: 30,
          format: "video",
          order: 5,
          requiredTier: "free",
          prerequisites: ["Understanding Market Orders and Order Types"],
          learningObjectives: ["Read candlestick charts", "Identify key patterns", "Use multiple timeframes"],
          tags: ["charts", "candlesticks", "technical-analysis"],
          isLocked: false,
          isPremium: false
        },
        {
          title: "Risk Management Fundamentals",
          description: "Essential risk management principles every crypto trader must know.",
          content: `<h1>Risk Management Fundamentals</h1>
<p>Risk management is the most important skill for long-term trading success. Learn to protect your capital.</p>

<h2>The 1% Rule</h2>
<ul>
<li>Never risk more than 1-2% per trade</li>
<li>Preserves capital during losing streaks</li>
<li>Allows for recovery from losses</li>
<li>Professional standard across all markets</li>
</ul>

<h2>Position Sizing Formula</h2>
<p><strong>Position Size = (Account Size × Risk %) ÷ (Entry Price - Stop Loss)</strong></p>

<h3>Example Calculation</h3>
<ul>
<li>Account: $10,000</li>
<li>Risk: 1% = $100</li>
<li>Entry: $50,000 (BTC)</li>
<li>Stop: $48,000</li>
<li>Position: $100 ÷ $2,000 = 0.05 BTC</li>
</ul>

<h2>Risk-Reward Ratios</h2>
<h3>Minimum 1:2 Ratio</h3>
<ul>
<li>Risk $100 to make $200+</li>
<li>Allows profit even with 50% win rate</li>
<li>Focus on quality setups</li>
<li>Patience for proper entries</li>
</ul>

<h2>Emotional Discipline</h2>
<ul>
<li>Stick to predetermined plan</li>
<li>No revenge trading after losses</li>
<li>Take breaks during drawdowns</li>
<li>Keep detailed trading journal</li>
</ul>`,
          level: "beginner",
          category: "risk-management",
          duration: 25,
          format: "interactive",
          order: 6,
          requiredTier: "free",
          prerequisites: ["Reading Crypto Charts and Candlesticks"],
          learningObjectives: ["Apply the 1% rule", "Calculate position sizes", "Manage emotions"],
          tags: ["risk-management", "position-sizing", "discipline"],
          isLocked: false,
          isPremium: false
        },
        
        // Intermediate Trading Content (Basic Tier)
        {
          title: "Introduction to Crypto Trading",
          description: "Learn the fundamentals of cryptocurrency trading, market types, and basic strategies.",
          content: `<h1>Introduction to Crypto Trading</h1>
<p>Cryptocurrency trading involves buying and selling digital assets to profit from price movements. This comprehensive guide covers essential trading concepts.</p>

<h2>Types of Trading</h2>
<h3>Spot Trading</h3>
<ul>
<li>Immediate delivery of assets</li>
<li>Direct ownership of cryptocurrencies</li>
<li>Lower risk, suitable for beginners</li>
</ul>

<h3>Derivatives Trading</h3>
<ul>
<li>Futures and options contracts</li>
<li>Leverage available (higher risk/reward)</li>
<li>Advanced strategies for experienced traders</li>
</ul>

<h2>Market Analysis Approaches</h2>
<h3>Fundamental Analysis</h3>
<ul>
<li>Technology and team evaluation</li>
<li>Market adoption and partnerships</li>
<li>Tokenomics and utility</li>
<li>Regulatory environment</li>
</ul>

<h3>Technical Analysis</h3>
<ul>
<li>Price charts and patterns</li>
<li>Trading indicators and oscillators</li>
<li>Support and resistance levels</li>
<li>Volume and market sentiment</li>
</ul>

<h2>Risk Management Principles</h2>
<ol>
<li><strong>Position sizing:</strong> Never risk more than 1-2% per trade</li>
<li><strong>Stop losses:</strong> Limit downside risk automatically</li>
<li><strong>Diversification:</strong> Spread risk across multiple assets</li>
<li><strong>Emotional control:</strong> Stick to your trading plan</li>
</ol>`,
          level: "intermediate",
          category: "trading",
          duration: 35,
          format: "video",
          order: 7,
          requiredTier: "basic",
          prerequisites: ["Risk Management Fundamentals"],
          learningObjectives: ["Understand trading types", "Learn analysis methods", "Apply risk management"],
          tags: ["trading", "risk-management", "analysis"],
          isLocked: false,
          isPremium: true
        },
        {
          title: "Technical Analysis Deep Dive",
          description: "Master chart patterns, indicators, and trading signals for successful crypto trading.",
          content: `<h1>Technical Analysis Deep Dive</h1>
<p>Technical analysis is the study of past market data to predict future price movements. This advanced course covers professional trading techniques.</p>

<h2>Essential Chart Patterns</h2>
<h3>Reversal Patterns</h3>
<ul>
<li><strong>Head and Shoulders:</strong> Bearish reversal signal</li>
<li><strong>Inverse Head and Shoulders:</strong> Bullish reversal signal</li>
<li><strong>Double Top/Bottom:</strong> Strong reversal indicators</li>
<li><strong>Wedges:</strong> Rising (bearish) and falling (bullish) wedges</li>
</ul>

<h3>Continuation Patterns</h3>
<ul>
<li><strong>Triangles:</strong> Ascending, descending, and symmetrical</li>
<li><strong>Flags and Pennants:</strong> Brief consolidation phases</li>
<li><strong>Rectangles:</strong> Horizontal support and resistance</li>
</ul>

<h2>Key Technical Indicators</h2>
<h3>Trend Indicators</h3>
<ul>
<li><strong>Moving Averages:</strong> SMA, EMA, and crossover strategies</li>
<li><strong>MACD:</strong> Moving Average Convergence Divergence</li>
<li><strong>Parabolic SAR:</strong> Stop and Reverse indicator</li>
</ul>

<h3>Momentum Oscillators</h3>
<ul>
<li><strong>RSI:</strong> Relative Strength Index (overbought/oversold)</li>
<li><strong>Stochastic:</strong> %K and %D momentum oscillator</li>
<li><strong>Williams %R:</strong> Fast momentum indicator</li>
</ul>

<h2>Advanced Trading Strategies</h2>
<ol>
<li><strong>Breakout Trading:</strong> Capitalize on price breakouts from consolidation</li>
<li><strong>Swing Trading:</strong> Hold positions for days to weeks</li>
<li><strong>Scalping:</strong> Quick profits from small price movements</li>
<li><strong>Grid Trading:</strong> Automated buy/sell orders at set intervals</li>
</ol>`,
          level: "advanced",
          category: "trading",
          duration: 50,
          format: "video",
          order: 5,
          requiredTier: "basic",
          prerequisites: ["Introduction to Crypto Trading"],
          learningObjectives: ["Master chart patterns", "Use technical indicators", "Develop trading strategies"],
          tags: ["technical-analysis", "charts", "indicators"],
          isLocked: false,
          isPremium: true
        },
        
        // DeFi Content (Pro Tier)
        {
          title: "Decentralized Finance (DeFi) Fundamentals",
          description: "Explore the revolutionary world of decentralized finance and its protocols.",
          content: `<h1>Decentralized Finance (DeFi) Fundamentals</h1>
<p>DeFi represents a paradigm shift from traditional finance to permissionless, programmable financial services built on blockchain technology.</p>

<h2>Core DeFi Principles</h2>
<ul>
<li><strong>Permissionless:</strong> Anyone can access DeFi protocols</li>
<li><strong>Transparent:</strong> All code and transactions are public</li>
<li><strong>Composable:</strong> Protocols can be combined like building blocks</li>
<li><strong>Global:</strong> Accessible 24/7 from anywhere in the world</li>
</ul>

<h2>Key DeFi Categories</h2>
<h3>Decentralized Exchanges (DEXs)</h3>
<ul>
<li><strong>Uniswap:</strong> Automated Market Maker (AMM) protocol</li>
<li><strong>SushiSwap:</strong> Community-driven DEX with added features</li>
<li><strong>Curve:</strong> Optimized for stablecoin trading</li>
</ul>

<h3>Lending and Borrowing</h3>
<ul>
<li><strong>Aave:</strong> Flash loans and variable/stable rates</li>
<li><strong>Compound:</strong> Algorithmic money markets</li>
<li><strong>MakerDAO:</strong> Decentralized stablecoin (DAI) protocol</li>
</ul>

<h3>Yield Farming Protocols</h3>
<ul>
<li><strong>Yearn Finance:</strong> Automated yield optimization</li>
<li><strong>Convex:</strong> Enhanced Curve rewards</li>
<li><strong>Bancor:</strong> Impermanent loss protection</li>
</ul>

<h2>DeFi Risks and Considerations</h2>
<ul>
<li>Smart contract vulnerabilities</li>
<li>Impermanent loss in liquidity providing</li>
<li>Regulatory uncertainty</li>
<li>High gas fees during network congestion</li>
</ul>`,
          level: "intermediate",
          category: "defi",
          duration: 40,
          format: "video",
          order: 6,
          requiredTier: "pro",
          prerequisites: ["Technical Analysis Deep Dive"],
          learningObjectives: ["Understand DeFi protocols", "Learn yield farming", "Assess DeFi risks"],
          tags: ["defi", "protocols", "yield-farming"],
          isLocked: false,
          isPremium: true
        },
        
        // Advanced Security (Pro Tier)
        {
          title: "Advanced Crypto Security & OpSec",
          description: "Professional-level security practices for serious crypto investors and traders.",
          content: `<h1>Advanced Crypto Security & OpSec</h1>
<p>Operational Security (OpSec) for cryptocurrency goes beyond basic wallet security. This advanced course covers professional security practices.</p>

<h2>Multi-Signature Setups</h2>
<h3>What is Multi-Sig?</h3>
<ul>
<li>Requires multiple signatures to authorize transactions</li>
<li>Distributes risk across multiple keys/parties</li>
<li>Common configurations: 2-of-3, 3-of-5, 5-of-7</li>
</ul>

<h3>Multi-Sig Benefits</h3>
<ul>
<li>Protection against single point of failure</li>
<li>Shared custody for organizations</li>
<li>Enhanced security for large holdings</li>
</ul>

<h2>Hardware Security Modules (HSMs)</h2>
<ul>
<li>Industrial-grade key storage</li>
<li>FIPS 140-2 Level 3/4 certification</li>
<li>Tamper-resistant/tamper-evident designs</li>
<li>Enterprise and institutional solutions</li>
</ul>

<h2>Privacy and Anonymity</h2>
<h3>Privacy Coins</h3>
<ul>
<li><strong>Monero (XMR):</strong> Ring signatures and stealth addresses</li>
<li><strong>Zcash (ZEC):</strong> Zero-knowledge proofs (zk-SNARKs)</li>
<li><strong>Dash:</strong> CoinJoin mixing service</li>
</ul>

<h3>Transaction Privacy Techniques</h3>
<ul>
<li>Coin mixing/tumbling services</li>
<li>Tor network for IP obfuscation</li>
<li>VPNs for additional privacy layers</li>
<li>Decentralized mixing protocols</li>
</ul>

<h2>Institutional Security Practices</h2>
<ol>
<li><strong>Air-gapped systems</strong> for key generation</li>
<li><strong>Geographic distribution</strong> of backup keys</li>
<li><strong>Time locks</strong> for large transactions</li>
<li><strong>Insurance</strong> for digital asset holdings</li>
<li><strong>Regular security audits</strong> and penetration testing</li>
</ol>`,
          level: "advanced",
          category: "security",
          duration: 45,
          format: "video",
          order: 7,
          requiredTier: "pro",
          prerequisites: ["Decentralized Finance (DeFi) Fundamentals"],
          learningObjectives: ["Implement multi-sig security", "Understand privacy techniques", "Apply institutional practices"],
          tags: ["security", "privacy", "multi-sig"],
          isLocked: false,
          isPremium: true
        },
        
        // Elite Content
        {
          title: "Algorithmic Trading & Bot Development",
          description: "Build and deploy cryptocurrency trading bots using advanced algorithms.",
          content: `<h1>Algorithmic Trading & Bot Development</h1>
<p>Algorithmic trading uses computer programs to execute trades based on predefined strategies. This masterclass covers professional bot development.</p>

<h2>Trading Algorithm Types</h2>
<h3>Trend Following</h3>
<ul>
<li>Moving average crossovers</li>
<li>Momentum-based strategies</li>
<li>Breakout trading algorithms</li>
</ul>

<h3>Mean Reversion</h3>
<ul>
<li>Statistical arbitrage</li>
<li>Pairs trading strategies</li>
<li>Grid trading systems</li>
</ul>

<h3>Market Making</h3>
<ul>
<li>Bid-ask spread capture</li>
<li>Liquidity provision strategies</li>
<li>Order book analysis</li>
</ul>

<h2>Technical Implementation</h2>
<h3>Programming Languages</h3>
<ul>
<li><strong>Python:</strong> Rapid prototyping with libraries (ccxt, pandas)</li>
<li><strong>JavaScript/Node.js:</strong> Real-time execution and WebSocket handling</li>
<li><strong>C++:</strong> Ultra-low latency for high-frequency trading</li>
<li><strong>Rust:</strong> Performance and memory safety</li>
</ul>

<h3>Essential Components</h3>
<ul>
<li>Exchange API integration</li>
<li>Real-time market data feeds</li>
<li>Order management systems</li>
<li>Risk management modules</li>
<li>Backtesting frameworks</li>
<li>Performance monitoring</li>
</ul>

<h2>Advanced Strategies</h2>
<ol>
<li><strong>Arbitrage:</strong> Cross-exchange price differences</li>
<li><strong>Delta-neutral:</strong> Market direction independent</li>
<li><strong>Statistical arbitrage:</strong> Mean reversion with correlations</li>
<li><strong>Machine learning:</strong> Pattern recognition and prediction</li>
</ol>`,
          level: "advanced",
          category: "advanced",
          duration: 60,
          format: "video",
          order: 8,
          requiredTier: "elite",
          prerequisites: ["Advanced Crypto Security & OpSec"],
          learningObjectives: ["Develop trading algorithms", "Implement automated strategies", "Build professional trading systems"],
          tags: ["algorithmic-trading", "bots", "automation"],
          isLocked: false,
          isPremium: true
        }
      ]);
      console.log("✅ Sample lessons created");
    }

    // Check if crypto prices exist
    const existingPrices = await db.select().from(cryptoPrices);
    
    if (existingPrices.length === 0) {
      // Create comprehensive crypto market data
      await db.insert(cryptoPrices).values([
        {
          symbol: "BTC",
          name: "Bitcoin",
          price: "67350.00",
          change24h: "2.85",
          marketCap: "1325000000000",
          volume24h: "28000000000",
          lastUpdated: new Date()
        },
        {
          symbol: "ETH", 
          name: "Ethereum",
          price: "3420.00",
          change24h: "4.12",
          marketCap: "411000000000",
          volume24h: "18500000000",
          lastUpdated: new Date()
        },
        {
          symbol: "BNB",
          name: "BNB",
          price: "585.20",
          change24h: "1.45",
          marketCap: "85000000000",
          volume24h: "1800000000",
          lastUpdated: new Date()
        },
        {
          symbol: "SOL",
          name: "Solana", 
          price: "198.50",
          change24h: "7.25",
          marketCap: "93000000000",
          volume24h: "4200000000",
          lastUpdated: new Date()
        },
        {
          symbol: "XRP",
          name: "XRP",
          price: "2.45",
          change24h: "12.85",
          marketCap: "138000000000",
          volume24h: "9200000000",
          lastUpdated: new Date()
        },
        {
          symbol: "ADA",
          name: "Cardano",
          price: "1.12",
          change24h: "-2.15",
          marketCap: "40000000000",
          volume24h: "850000000",
          lastUpdated: new Date()
        },
        {
          symbol: "DOGE",
          name: "Dogecoin",
          price: "0.38",
          change24h: "8.95",
          marketCap: "56000000000",
          volume24h: "3400000000",
          lastUpdated: new Date()
        },
        {
          symbol: "AVAX",
          name: "Avalanche",
          price: "42.80",
          change24h: "5.35",
          marketCap: "17000000000",
          volume24h: "1200000000",
          lastUpdated: new Date()
        },
        {
          symbol: "SHIB",
          name: "Shiba Inu",
          price: "0.00002850",
          change24h: "15.25",
          marketCap: "16800000000",
          volume24h: "2100000000",
          lastUpdated: new Date()
        },
        {
          symbol: "DOT",
          name: "Polkadot",
          price: "8.25",
          change24h: "3.45",
          marketCap: "12500000000",
          volume24h: "420000000",
          lastUpdated: new Date()
        },
        {
          symbol: "MATIC",
          name: "Polygon",
          price: "0.55",
          change24h: "6.75",
          marketCap: "5500000000",
          volume24h: "380000000",
          lastUpdated: new Date()
        },
        {
          symbol: "UNI",
          name: "Uniswap",
          price: "12.80",
          change24h: "4.85",
          marketCap: "7700000000",
          volume24h: "350000000",
          lastUpdated: new Date()
        }
      ]);
      console.log("✅ Sample crypto prices created");
    }

    // Check if demo users exist
    const existingUsers = await db.select().from(users);
    
    if (existingUsers.length === 0) {
      // Create demo users for forum posts
      await db.insert(users).values([
        {
          id: "demo-user-1",
          username: "cryptoNewbie2025",
          email: "newbie@example.com",
          password: "hashed_password_1",
          firstName: "Alex",
          lastName: "Johnson",
          totalXp: 150,
          currentLevel: 2,
          subscriptionTier: "free"
        },
        {
          id: "demo-user-2",
          username: "TechAnalystPro",
          email: "analyst@example.com", 
          password: "hashed_password_2",
          firstName: "Sarah",
          lastName: "Chen",
          totalXp: 2450,
          currentLevel: 8,
          subscriptionTier: "pro"
        },
        {
          id: "demo-user-3",
          username: "DeFiExplorer",
          email: "defi@example.com",
          password: "hashed_password_3",
          firstName: "Mike",
          lastName: "Rodriguez",
          totalXp: 890,
          currentLevel: 4,
          subscriptionTier: "basic"
        },
        {
          id: "demo-user-4",
          username: "BlockchainDev",
          email: "dev@example.com",
          password: "hashed_password_4",
          firstName: "Emily",
          lastName: "Zhang",
          totalXp: 3200,
          currentLevel: 12,
          subscriptionTier: "elite"
        },
        {
          id: "demo-user-5",
          username: "SolanaBuilder",
          email: "builder@example.com",
          password: "hashed_password_5",
          firstName: "David",
          lastName: "Kim",
          totalXp: 1890,
          currentLevel: 7,
          subscriptionTier: "pro"
        },
        {
          id: "demo-user-6",
          username: "SecurityGuard",
          email: "security@example.com",
          password: "hashed_password_6",
          firstName: "Rachel",
          lastName: "Thompson",
          totalXp: 2100,
          currentLevel: 9,
          subscriptionTier: "pro"
        },
        {
          id: "demo-user-7",
          username: "TaxMaster",
          email: "tax@example.com",
          password: "hashed_password_7", 
          firstName: "James",
          lastName: "Wilson",
          totalXp: 1250,
          currentLevel: 5,
          subscriptionTier: "basic"
        }
      ]);
      console.log("✅ Demo users created");
    }

    // Check if forum posts exist
    const existingPosts = await db.select().from(forumPosts);
    
    if (existingPosts.length === 0) {
      // Create sample forum posts
      await db.insert(forumPosts).values([
        {
          userId: "demo-user-1",
          title: "Best Strategies for DCA (Dollar Cost Averaging) in 2025?",
          content: `Looking for advice on implementing DCA strategies in the current market. I've been manually buying every week but wondering if automation is worth it.

What platforms do you all recommend for automatic DCA? I'm particularly interested in:
- Low fees
- Good security track record
- Multiple coin support

Currently considering Binance and Coinbase Pro. Would love to hear your experiences!`,
          likes: 24,
          replies: 18,
          views: 452,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        },
        {
          userId: "demo-user-2", 
          title: "Technical Analysis: Bitcoin Breaking Major Resistance",
          content: `BTC just broke through the $67,000 resistance level with strong volume. Key technical indicators:

📈 **Bullish Signals:**
- RSI cooling from overbought (68 → 62)
- MACD showing positive momentum
- Volume confirmation on breakout
- 20-day MA acting as support

🎯 **Targets:**
- Next resistance: $72,000
- Major target: $78,000-$80,000 range

⚠️ **Risk Management:**
- Stop loss below $64,500 
- Take profits incrementally

What's your take on this setup? Are you positioning for the next leg up?`,
          likes: 67,
          replies: 31,
          views: 1248,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
        },
        {
          userId: "demo-user-3",
          title: "New to DeFi - Need Help Understanding Impermanent Loss",
          content: `Hi everyone! I'm new to yield farming and keep hearing about "impermanent loss" but honestly still confused about it.

Can someone explain in simple terms:
1. What exactly is impermanent loss?
2. When does it happen?
3. How to minimize it?
4. Is yield farming still profitable despite IL?

I'm looking at providing liquidity to ETH/USDC pools but want to understand the risks first. Any beginner-friendly resources would be appreciated!

Thanks for helping a newbie out! 🙏`,
          likes: 15,
          replies: 12,
          views: 298,
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
        },
        {
          userId: "demo-user-4",
          title: "Ethereum L2 Solutions Comparison - Which One to Use?",
          content: `With gas fees still high on mainnet, I'm exploring Layer 2 solutions. Here's my research so far:

**Arbitrum:**
✅ Lower fees than mainnet
✅ Good DeFi ecosystem 
❌ Slower finality

**Polygon:**
✅ Very low fees
✅ Mature ecosystem
❌ Less decentralized

**Optimism:**
✅ Fast transactions
✅ OP token rewards
❌ Limited DeFi options

**Base:**
✅ Coinbase backing
✅ Growing adoption
❌ Newer, less proven

Which L2 are you using most? What's been your experience with bridges and DeFi protocols on each?`,
          likes: 43,
          replies: 28,
          views: 856,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
        },
        {
          userId: "demo-user-5",
          title: "Solana vs Ethereum: Developer Perspective",
          content: `As someone building dApps, I wanted to share my experience with both chains:

**Solana Pros:**
- Blazing fast transactions
- Very low fees ($0.00025 avg)
- Great developer tooling (Anchor)
- Active ecosystem

**Solana Cons:**
- Network outages (getting rarer)
- Less mature than Ethereum
- Rust learning curve

**Ethereum Pros:**
- Battle-tested and secure
- Largest DeFi ecosystem
- Massive developer community
- EVM compatibility

**Ethereum Cons:**
- High gas fees
- Network congestion
- Slower transaction speeds

Both have their place. For high-frequency apps, Solana wins. For maximum security and liquidity, Ethereum still leads.

What's your experience building on either chain?`,
          likes: 89,
          replies: 45,
          views: 1567,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        },
        {
          userId: "demo-user-6",
          title: "Security Alert: New Phishing Campaign Targeting Crypto Users",
          content: `⚠️ **SECURITY ALERT** ⚠️

There's a new phishing campaign going around targeting MetaMask users. Here's what to watch for:

**The Scam:**
- Fake MetaMask security emails
- Claims your wallet was "compromised"
- Links to fake MetaMask sites asking for seed phrases

**Red Flags:**
- Urgent language ("act immediately")
- Asking for seed phrases/private keys
- Non-official email domains
- Grammar/spelling errors

**Protection:**
✅ Never enter seed phrases online
✅ Always check URLs carefully
✅ Use hardware wallets for large amounts
✅ Enable 2FA where possible
✅ Bookmark official sites

**Remember:** MetaMask will NEVER ask for your seed phrase via email!

Stay safe out there! 🔒`,
          likes: 156,
          replies: 23,
          views: 2341,
          createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000) // 8 hours ago
        },
        {
          userId: "demo-user-7",
          title: "Tax Season Prep: Best Crypto Tax Software for 2025?",
          content: `Tax season is approaching and I need to get organized. I've got transactions across multiple exchanges and DeFi protocols.

**What I need to track:**
- Spot trading (Binance, Coinbase)
- DeFi transactions (Uniswap, Aave, Compound)
- Staking rewards
- NFT trades
- Mining income

**Software I'm considering:**
- Koinly
- CoinTracker
- TaxBit
- Accointing

Has anyone used these? Which one handles DeFi transactions best? I'm particularly concerned about accurate cost basis calculation and complex DeFi interactions.

Also open to hiring a crypto-specialized CPA if the software route doesn't work out.`,
          likes: 34,
          replies: 19,
          views: 672,
          createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000) // 18 hours ago
        }
      ]);
      console.log("✅ Sample forum posts created");
    }

    // Check if achievements exist - temporarily disabled due to database schema sync issues
    // const existingAchievements = await db.select().from(achievements);
    
    if (false) { // Temporarily disabled
      // Create gamification achievements
      await db.insert(achievements).values([
        {
          name: "First Steps",
          description: "Complete your first lesson",
          category: "learning",
          iconName: "BookOpen",
          pointsReward: 50,
          requirements: { type: "lessons_completed", count: 1 },
          requiredTier: "free"
        },
        {
          name: "Knowledge Seeker",
          description: "Complete 10 lessons",
          category: "learning", 
          iconName: "GraduationCap",
          pointsReward: 250,
          requirements: { type: "lessons_completed", count: 10 },
          requiredTier: "free"
        },
        {
          name: "Trading Master",
          description: "Complete 50 lessons",
          category: "learning",
          iconName: "Trophy",
          pointsReward: 1000,
          requirements: { type: "lessons_completed", count: 50 },
          requiredTier: "basic"
        },
        {
          name: "First Trade",
          description: "Execute your first simulated trade",
          category: "trading",
          iconName: "TrendingUp",
          pointsReward: 100,
          requirements: { type: "trades_executed", count: 1 },
          requiredTier: "free"
        },
        {
          name: "Portfolio Builder",
          description: "Execute 25 trades",
          category: "trading",
          iconName: "BarChart3",
          pointsReward: 500,
          requirements: { type: "trades_executed", count: 25 },
          requiredTier: "free"
        },
        {
          name: "Consistent Learner",
          description: "Maintain a 7-day learning streak",
          category: "streak",
          iconName: "Flame",
          pointsReward: 300,
          requirements: { type: "streak_days", count: 7 },
          requiredTier: "free"
        },
        {
          name: "Community Helper",
          description: "Make 5 helpful forum posts",
          category: "community",
          iconName: "Users",
          pointsReward: 200,
          requirements: { type: "forum_posts", count: 5 },
          requiredTier: "free"
        },
        {
          name: "Crypto Scholar",
          description: "Complete all foundation lessons",
          category: "learning",
          iconName: "Crown",
          pointsReward: 1500,
          requirements: { type: "foundation_complete", count: 1 },
          requiredTier: "basic"
        }
      ]);
      console.log("✅ Achievement system created");
    }

    // Check if premium content exists - temporarily disabled due to database schema sync issues
    // const existingPremium = await db.select().from(premiumContent);
    
    if (false) { // Temporarily disabled
      // Create premium content for upselling
      await db.insert(premiumContent).values([
        {
          title: "Advanced DeFi Yield Strategies",
          description: "Learn professional yield farming techniques with 6-figure DeFi portfolio management strategies used by institutional traders.",
          contentType: "masterclass",
          category: "defi",
          duration: 90,
          requiredTier: "pro",
          views: 1247,
          likes: 189,
          isExclusive: true
        },
        {
          title: "NFT Flipping Masterclass",
          description: "Complete guide to profitable NFT trading including rarity analysis, market timing, and whale tracking techniques.",
          contentType: "video",
          category: "nft", 
          duration: 75,
          requiredTier: "pro",
          views: 2156,
          likes: 298,
          isExclusive: true
        },
        {
          title: "Algorithmic Trading Bot Development",
          description: "Build your own crypto trading bots with Python. Includes backtesting frameworks and risk management systems.",
          contentType: "masterclass",
          category: "trading",
          duration: 120,
          requiredTier: "elite",
          views: 845,
          likes: 156,
          isExclusive: true
        },
        {
          title: "Market Psychology & Sentiment Analysis",
          description: "Advanced behavioral finance techniques for crypto markets. Learn to read market fear, greed, and timing cycles.",
          contentType: "webinar",
          category: "trading",
          duration: 60,
          requiredTier: "pro",
          views: 1834,
          likes: 267,
          isExclusive: false
        },
        {
          title: "Institutional Trading Strategies",
          description: "Learn how hedge funds and institutions trade crypto. Exclusive insights from Wall Street professionals.",
          contentType: "masterclass",
          category: "trading",
          duration: 150,
          requiredTier: "elite",
          views: 623,
          likes: 94,
          isExclusive: true
        }
      ]);
      console.log("✅ Premium content library created");
    }

    // Check if trading signals exist
    const existingSignals = await db.select().from(tradingSignals);
    
    if (existingSignals.length === 0) {
      // Create sample trading signals for premium users
      await db.insert(tradingSignals).values([
        {
          createdBy: "demo-user-2", // TechAnalystPro
          symbol: "BTC",
          signalType: "buy",
          entryPrice: "67250.00",
          targetPrice: "72000.00",
          stopLoss: "64500.00",
          confidence: 85,
          reasoning: "Strong breakout above $67k resistance with high volume confirmation. RSI reset from overbought levels provides healthy entry point.",
          status: "active",
          requiredTier: "pro",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        },
        {
          createdBy: "demo-user-4", // BlockchainDev
          symbol: "ETH",
          signalType: "buy",
          entryPrice: "3420.00",
          targetPrice: "3800.00",
          stopLoss: "3200.00",
          confidence: 78,
          reasoning: "Ethereum showing strength vs BTC. Layer 2 adoption accelerating and staking yield attractive at current levels.",
          status: "active",
          requiredTier: "pro",
          expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days
        },
        {
          createdBy: "demo-user-5", // SolanaBuilder
          symbol: "SOL",
          signalType: "hold",
          entryPrice: "145.00",
          targetPrice: "180.00",
          stopLoss: "125.00",
          confidence: 72,
          reasoning: "Solana ecosystem growth strong but waiting for broader market confirmation before increasing position size.",
          status: "active",
          requiredTier: "basic",
          expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
        }
      ]);
      console.log("✅ Trading signals created");
    }

    console.log("🎉 Database seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}
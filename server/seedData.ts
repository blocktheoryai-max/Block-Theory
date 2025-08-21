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
          
          isLocked: false,
          isPremium: true
        },
        {
          title: "Bitcoin Whitepaper Deep Dive",
          description: "Comprehensive analysis of Satoshi Nakamoto's revolutionary Bitcoin whitepaper and its implications.",
          content: `<h1>Bitcoin Whitepaper Deep Dive</h1>
<p>Satoshi Nakamoto's 2008 Bitcoin whitepaper introduced the world to peer-to-peer electronic cash. Let's analyze this foundational document.</p>

<h2>Key Innovations</h2>
<h3>Double-Spending Problem Solution</h3>
<ul>
<li><strong>Previous Attempts:</strong> DigiCash, e-gold, b-money</li>
<li><strong>Bitcoin's Solution:</strong> Proof-of-Work consensus mechanism</li>
<li><strong>Network Agreement:</strong> Longest chain rule</li>
<li><strong>Elimination of Trusted Third Parties</strong></li>
</ul>

<h3>Cryptographic Foundations</h3>
<ul>
<li><strong>SHA-256 Hashing:</strong> Immutable transaction records</li>
<li><strong>Merkle Trees:</strong> Efficient verification without full blockchain</li>
<li><strong>Digital Signatures:</strong> Ownership proof and transfer authorization</li>
<li><strong>Public-Private Key Cryptography:</strong> Secure wallet addresses</li>
</ul>

<h2>Economic Model Analysis</h2>
<h3>Monetary Policy</h3>
<ul>
<li><strong>Fixed Supply:</strong> 21 million bitcoin maximum</li>
<li><strong>Halving Mechanism:</strong> Block reward reduction every 210,000 blocks</li>
<li><strong>Deflationary Design:</strong> Scarcity drives value appreciation</li>
<li><strong>Mining Incentives:</strong> Block rewards + transaction fees</li>
</ul>

<h3>Game Theory</h3>
<ul>
<li><strong>Honest Majority Assumption:</strong> 51% honest node requirement</li>
<li><strong>Economic Incentives:</strong> Mining profitability vs attack costs</li>
<li><strong>Nash Equilibrium:</strong> Cooperation benefits all participants</li>
</ul>

<h2>Technical Implementation</h2>
<h3>Simplified Payment Verification (SPV)</h3>
<ul>
<li>Lightweight clients without full blockchain</li>
<li>Merkle proof verification</li>
<li>Trade-off: security vs efficiency</li>
<li>Foundation for mobile wallets</li>
</ul>

<h2>Historical Impact</h2>
<ul>
<li><strong>2009:</strong> Genesis block and first transaction</li>
<li><strong>2010:</strong> First commercial transaction (Pizza Day)</li>
<li><strong>2017:</strong> SegWit activation and scaling debate</li>
<li><strong>2021:</strong> El Salvador legal tender adoption</li>
<li><strong>2024:</strong> Bitcoin ETF approvals and institutional adoption</li>
</ul>

<h2>Limitations and Evolution</h2>
<ul>
<li>Scalability constraints (7 TPS limit)</li>
<li>Energy consumption concerns</li>
<li>Lightning Network development</li>
<li>Privacy enhancement proposals</li>
</ul>`,
          level: "intermediate",
          category: "research",
          duration: 60,
          format: "research",
          order: 21,
          requiredTier: "basic",
          prerequisites: ["Risk Management Fundamentals"],
          learningObjectives: ["Understand Bitcoin's technical foundation", "Analyze economic implications", "Evaluate historical significance"],
          
          isLocked: false,
          isPremium: true
        },
        {
          title: "Ethereum 2.0 and Proof of Stake Transition",
          description: "Technical analysis of Ethereum's transition to Proof of Stake and its implications for investors.",
          content: `<h1>Ethereum 2.0 and Proof of Stake Transition</h1>
<p>Ethereum's transition from Proof of Work to Proof of Stake represents the largest consensus mechanism change in crypto history.</p>

<h2>The Merge: Technical Overview</h2>
<h3>Consensus Layer Changes</h3>
<ul>
<li><strong>Beacon Chain:</strong> PoS coordination layer launched December 2020</li>
<li><strong>Execution Layer:</strong> Existing Ethereum mainnet with smart contracts</li>
<li><strong>Merge Event:</strong> September 15, 2022 - consensus unification</li>
<li><strong>Finality:</strong> Faster block confirmation (12 seconds vs 13.3 seconds)</li>
</ul>

<h3>Validator Economics</h3>
<ul>
<li><strong>32 ETH Minimum:</strong> Individual validator requirement</li>
<li><strong>Staking Rewards:</strong> 3-5% annual percentage rate</li>
<li><strong>Slashing Penalties:</strong> Punishment for malicious behavior</li>
<li><strong>Liquid Staking:</strong> Lido, Rocket Pool, Coinbase alternatives</li>
</ul>

<h2>Energy Efficiency Impact</h2>
<h3>Environmental Benefits</h3>
<ul>
<li><strong>99.95% Energy Reduction:</strong> From mining to validation</li>
<li><strong>Carbon Footprint:</strong> Equivalent to small country to household</li>
<li><strong>ESG Compliance:</strong> Institutional investment enabler</li>
<li><strong>Sustainability Narrative:</strong> Green blockchain positioning</li>
</ul>

<h2>Economic Implications</h2>
<h3>Supply Dynamics</h3>
<ul>
<li><strong>Issuance Reduction:</strong> 90% decrease in new ETH creation</li>
<li><strong>Fee Burning:</strong> EIP-1559 deflationary mechanism</li>
<li><strong>Net Negative Issuance:</strong> ETH becoming deflationary asset</li>
<li><strong>Staking Yield:</strong> Risk-free rate for ETH holders</li>
</ul>

<h3>Network Security</h3>
<ul>
<li><strong>Economic Security:</strong> $30+ billion staked value</li>
<li><strong>Decentralization:</strong> 500,000+ individual validators</li>
<li><strong>Attack Cost:</strong> Billions required for 33% attack</li>
<li><strong>Social Consensus:</strong> Community coordination mechanisms</li>
</ul>

<h2>Future Roadmap</h2>
<h3>The Surge: Sharding Implementation</h3>
<ul>
<li><strong>Data Availability:</strong> Proto-danksharding (EIP-4844)</li>
<li><strong>Execution Sharding:</strong> Multiple parallel chains</li>
<li><strong>Scalability Target:</strong> 100,000+ transactions per second</li>
<li><strong>Layer 2 Integration:</strong> Rollup-centric roadmap</li>
</ul>

<h3>The Scourge: MEV Resistance</h3>
<ul>
<li><strong>Proposer-Builder Separation:</strong> Block production decentralization</li>
<li><strong>Inclusion Lists:</strong> Censorship resistance mechanisms</li>
<li><strong>MEV Democratization:</strong> Fair value extraction</li>
</ul>

<h2>Investment Considerations</h2>
<ul>
<li>Reduced ETH issuance increasing scarcity</li>
<li>Staking yield providing income stream</li>
<li>Institutional adoption via ESG compliance</li>
<li>Layer 2 ecosystem growth acceleration</li>
<li>Smart contract platform dominance</li>
</ul>`,
          level: "advanced",
          category: "research",
          duration: 55,
          format: "research",
          order: 22,
          requiredTier: "pro",
          prerequisites: ["Bitcoin Whitepaper Deep Dive"],
          learningObjectives: ["Understand PoS transition", "Analyze economic impacts", "Evaluate investment implications"],
          
          isLocked: false,
          isPremium: true
        },
        {
          title: "Central Bank Digital Currencies (CBDCs) Analysis",
          description: "Comprehensive analysis of government digital currencies and their impact on the crypto ecosystem.",
          content: `<h1>Central Bank Digital Currencies (CBDCs) Analysis</h1>
<p>CBDCs represent government-issued digital currencies that could reshape the global monetary system and crypto landscape.</p>

<h2>CBDC Categories</h2>
<h3>Retail CBDCs</h3>
<ul>
<li><strong>Direct Access:</strong> Citizens hold accounts with central bank</li>
<li><strong>Indirect Access:</strong> Commercial banks manage user accounts</li>
<li><strong>Token-Based:</strong> Digital cash equivalents with privacy</li>
<li><strong>Account-Based:</strong> Traditional banking with digital interface</li>
</ul>

<h3>Wholesale CBDCs</h3>
<ul>
<li><strong>Interbank Settlement:</strong> Large value payment systems</li>
<li><strong>Cross-Border Payments:</strong> International transfer efficiency</li>
<li><strong>Trade Finance:</strong> Supply chain and commercial applications</li>
<li><strong>Securities Settlement:</strong> Instant delivery vs payment</li>
</ul>

<h2>Global CBDC Development</h2>
<h3>Launched Systems</h3>
<ul>
<li><strong>Digital Yuan (China):</strong> Pilot programs in major cities</li>
<li><strong>Sand Dollar (Bahamas):</strong> First fully launched retail CBDC</li>
<li><strong>eNaira (Nigeria):</strong> Africa's first digital currency</li>
<li><strong>DCash (Eastern Caribbean):</strong> Multi-country implementation</li>
</ul>

<h3>Development Stage</h3>
<ul>
<li><strong>Digital Euro:</strong> ECB investigation and prototyping</li>
<li><strong>Digital Dollar:</strong> Federal Reserve research and pilots</li>
<li><strong>Digital Rupee:</strong> India's staged rollout approach</li>
<li><strong>Digital Pound:</strong> Bank of England consultation</li>
</ul>

<h2>Technical Implementation</h2>
<h3>Technology Choices</h3>
<ul>
<li><strong>Distributed Ledger:</strong> Blockchain vs traditional databases</li>
<li><strong>Consensus Mechanisms:</strong> Permissioned vs public networks</li>
<li><strong>Privacy Features:</strong> Zero-knowledge proofs and encryption</li>
<li><strong>Offline Capability:</strong> Digital cash functionality</li>
</ul>

<h3>Infrastructure Requirements</h3>
<ul>
<li><strong>Payment Rails:</strong> Real-time gross settlement systems</li>
<li><strong>Identity Management:</strong> KYC/AML compliance frameworks</li>
<li><strong>Cybersecurity:</strong> National security and resilience</li>
<li><strong>Interoperability:</strong> Cross-border payment standards</li>
</ul>

<h2>Economic Implications</h2>
<h3>Monetary Policy Tools</h3>
<ul>
<li><strong>Direct Stimulus:</strong> Helicopter money distribution</li>
<li><strong>Negative Interest Rates:</strong> Programmable monetary policy</li>
<li><strong>Real-Time Economics:</strong> Instant data and policy responses</li>
<li><strong>Financial Inclusion:</strong> Banking the unbanked population</li>
</ul>

<h3>Banking System Impact</h3>
<ul>
<li><strong>Disintermediation Risk:</strong> Direct central bank relationships</li>
<li><strong>Deposit Migration:</strong> Flight to digital currency safety</li>
<li><strong>Credit Creation:</strong> Changes to fractional reserve banking</li>
<li><strong>Competition:</strong> Public vs private money systems</li>
</ul>

<h2>Crypto Ecosystem Effects</h2>
<h3>Competitive Dynamics</h3>
<ul>
<li><strong>Stablecoin Competition:</strong> Government-backed alternatives</li>
<li><strong>Payment Innovation:</strong> Faster, cheaper government solutions</li>
<li><strong>Regulatory Clarity:</strong> Defined roles for private crypto</li>
<li><strong>Institutional Adoption:</strong> Reduced settlement risk</li>
</ul>

<h3>Investment Considerations</h3>
<ul>
<li>CBDC infrastructure providers and technology companies</li>
<li>Privacy-focused cryptocurrencies as alternatives</li>
<li>DeFi protocols offering yield vs CBDC safety</li>
<li>Cross-border payment and remittance solutions</li>
</ul>`,
          level: "advanced",
          category: "research",
          duration: 50,
          format: "research",
          order: 23,
          requiredTier: "pro",
          prerequisites: ["Ethereum 2.0 and Proof of Stake Transition"],
          learningObjectives: ["Understand CBDC implications", "Analyze government strategies", "Evaluate market impacts"],
          
          isLocked: false,
          isPremium: true
        },
        {
          title: "Institutional Cryptocurrency Adoption Trends",
          description: "Analysis of corporate and institutional crypto adoption patterns and their market implications.",
          content: `<h1>Institutional Cryptocurrency Adoption Trends</h1>
<p>Institutional adoption represents a major crypto market maturation trend, bringing legitimacy and massive capital flows.</p>

<h2>Corporate Treasury Adoption</h2>
<h3>Pioneer Companies</h3>
<ul>
<li><strong>MicroStrategy:</strong> $5+ billion Bitcoin treasury strategy</li>
<li><strong>Tesla:</strong> $1.5 billion purchase and payment acceptance</li>
<li><strong>Square (Block):</strong> Bitcoin investment and services</li>
<li><strong>El Salvador:</strong> First country with Bitcoin legal tender</li>
</ul>

<h3>Adoption Drivers</h3>
<ul>
<li><strong>Inflation Hedge:</strong> Store of value vs fiat debasement</li>
<li><strong>Digital Transformation:</strong> Future-proofing treasury management</li>
<li><strong>Yield Generation:</strong> DeFi and staking opportunities</li>
<li><strong>Brand Positioning:</strong> Innovation leadership signaling</li>
</ul>

<h2>Financial Services Evolution</h2>
<h3>Traditional Banks</h3>
<ul>
<li><strong>JPMorgan:</strong> JPM Coin and blockchain initiatives</li>
<li><strong>Goldman Sachs:</strong> Crypto trading desk and custody</li>
<li><strong>Morgan Stanley:</strong> Bitcoin investment for wealth clients</li>
<li><strong>BNY Mellon:</strong> Digital asset custody services</li>
</ul>

<h3>Investment Management</h3>
<ul>
<li><strong>BlackRock:</strong> Bitcoin ETF and blockchain investment</li>
<li><strong>Fidelity:</strong> Crypto trading and custody platform</li>
<li><strong>Grayscale:</strong> Digital asset investment products</li>
<li><strong>ARK Invest:</strong> Innovation-focused crypto exposure</li>
</ul>

<h2>Regulatory Infrastructure</h2>
<h3>Custody Solutions</h3>
<ul>
<li><strong>Coinbase Custody:</strong> Institutional-grade security</li>
<li><strong>BitGo:</strong> Multi-signature wallet services</li>
<li><strong>Anchorage:</strong> First federally chartered crypto bank</li>
<li><strong>Fireblocks:</strong> Infrastructure for digital assets</li>
</ul>

<h3>Compliance Frameworks</h3>
<ul>
<li><strong>AML/KYC:</strong> Anti-money laundering procedures</li>
<li><strong>Risk Management:</strong> Volatility and custody controls</li>
<li><strong>Reporting Standards:</strong> Accounting and tax compliance</li>
<li><strong>Insurance Coverage:</strong> Digital asset protection</li>
</ul>

<h2>Market Structure Evolution</h2>
<h3>Trading Infrastructure</h3>
<ul>
<li><strong>Prime Brokerage:</strong> Institutional trading services</li>
<li><strong>Dark Pools:</strong> Large order execution without impact</li>
<li><strong>Algorithmic Trading:</strong> Systematic investment strategies</li>
<li><strong>Derivatives Markets:</strong> Futures, options, and structured products</li>
</ul>

<h3>Price Discovery</h3>
<ul>
<li><strong>Institutional Volume:</strong> 60%+ of daily trading</li>
<li><strong>Correlation Dynamics:</strong> Traditional asset relationships</li>
<li><strong>Volatility Patterns:</strong> Reduced intraday swings</li>
<li><strong>Market Efficiency:</strong> Arbitrage and price convergence</li>
</ul>

<h2>Sector-Specific Adoption</h2>
<h3>Technology Companies</h3>
<ul>
<li><strong>Payment Integration:</strong> PayPal, Square, Stripe</li>
<li><strong>Cloud Services:</strong> Amazon, Microsoft, Google partnerships</li>
<li><strong>Social Media:</strong> Meta, Twitter crypto initiatives</li>
<li><strong>Gaming:</strong> Steam, Epic Games NFT integration</li>
</ul>

<h3>Traditional Industries</h3>
<ul>
<li><strong>Retail:</strong> Walmart, Starbucks payment acceptance</li>
<li><strong>Real Estate:</strong> Property tokenization and transactions</li>
<li><strong>Supply Chain:</strong> Walmart, Nestle blockchain tracking</li>
<li><strong>Entertainment:</strong> NBA Top Shot, music NFTs</li>
</ul>

<h2>Investment Implications</h2>
<ul>
<li><strong>Reduced Volatility:</strong> Institutional stabilization effects</li>
<li><strong>Infrastructure Growth:</strong> Custody, trading, analytics platforms</li>
<li><strong>Regulatory Clarity:</strong> Compliance-driven market development</li>
<li><strong>Capital Flows:</strong> Pension funds, endowments entering market</li>
<li><strong>Professional Management:</strong> Active and passive crypto funds</li>
</ul>`,
          level: "advanced",
          category: "research",
          duration: 55,
          format: "research",
          order: 24,
          requiredTier: "pro",
          prerequisites: ["Central Bank Digital Currencies (CBDCs) Analysis"],
          learningObjectives: ["Track institutional trends", "Analyze adoption drivers", "Evaluate market implications"],
          
          isLocked: false,
          isPremium: true
        },
        {
          title: "Cryptocurrency Environmental Impact and Sustainability",
          description: "Comprehensive analysis of crypto's environmental footprint and sustainable blockchain solutions.",
          content: `<h1>Cryptocurrency Environmental Impact and Sustainability</h1>
<p>Environmental concerns about cryptocurrency energy consumption have sparked innovation in sustainable blockchain technologies.</p>

<h2>Energy Consumption Analysis</h2>
<h3>Proof of Work Networks</h3>
<ul>
<li><strong>Bitcoin Network:</strong> 110-150 TWh annually (Argentina equivalent)</li>
<li><strong>Ethereum (Pre-Merge):</strong> 78 TWh annually (Chile equivalent)</li>
<li><strong>Mining Efficiency:</strong> ASIC vs GPU power consumption</li>
<li><strong>Geographic Distribution:</strong> China, US, Kazakhstan, Russia</li>
</ul>

<h3>Energy Source Breakdown</h3>
<ul>
<li><strong>Renewable Energy:</strong> 39-73% depending on region</li>
<li><strong>Coal Power:</strong> Declining but still significant</li>
<li><strong>Natural Gas:</strong> Growing share in US operations</li>
<li><strong>Hydroelectric:</strong> Major source in China and Norway</li>
<li><strong>Nuclear:</strong> Growing adoption for consistent baseload</li>
</ul>

<h2>Sustainable Consensus Mechanisms</h2>
<h3>Proof of Stake Benefits</h3>
<ul>
<li><strong>Energy Reduction:</strong> 99.9% lower than Proof of Work</li>
<li><strong>Ethereum 2.0:</strong> From 78 TWh to 2.6 MWh annually</li>
<li><strong>Scalability:</strong> Higher throughput with lower impact</li>
<li><strong>Validator Economics:</strong> Capital vs energy security</li>
</ul>

<h3>Alternative Mechanisms</h3>
<ul>
<li><strong>Delegated Proof of Stake:</strong> EOS, Tron, Binance Smart Chain</li>
<li><strong>Proof of Authority:</strong> Permissioned networks for enterprises</li>
<li><strong>Proof of History:</strong> Solana's time-based consensus</li>
<li><strong>Directed Acyclic Graphs:</strong> IOTA, Hedera Hashgraph</li>
</ul>

<h2>Carbon Footprint Initiatives</h2>
<h3>Industry Responses</h3>
<ul>
<li><strong>Crypto Climate Accord:</strong> Net-zero emissions by 2030</li>
<li><strong>Sustainable Bitcoin Mining Council:</strong> Transparency and best practices</li>
<li><strong>Carbon Offsetting:</strong> Voluntary and mandatory programs</li>
<li><strong>Renewable Energy Investment:</strong> Mining operations going green</li>
</ul>

<h3>Corporate Commitments</h3>
<ul>
<li><strong>Tesla:</strong> Bitcoin payments suspended over energy concerns</li>
<li><strong>Coinbase:</strong> Carbon neutral operations by 2030</li>
<li><strong>Ripple:</strong> Carbon neutral by 2030 commitment</li>
<li><strong>Algorand:</strong> Carbon negative blockchain platform</li>
</ul>

<h2>Green Blockchain Projects</h2>
<h3>Energy-Efficient Networks</h3>
<ul>
<li><strong>Algorand:</strong> Pure Proof of Stake, carbon negative</li>
<li><strong>Cardano:</strong> Ouroboros PoS protocol, peer-reviewed</li>
<li><strong>Tezos:</strong> Liquid Proof of Stake, self-amending</li>
<li><strong>Avalanche:</strong> Snow consensus, sub-second finality</li>
</ul>

<h3>Environmental Focus Projects</h3>
<ul>
<li><strong>Power Ledger:</strong> Renewable energy trading platform</li>
<li><strong>Energy Web Chain:</strong> Utility-grade blockchain for energy</li>
<li><strong>Chia Network:</strong> Proof of Space and Time consensus</li>
<li><strong>Regen Network:</strong> Ecological regeneration verification</li>
</ul>

<h2>Regulatory and ESG Considerations</h2>
<h3>Government Responses</h3>
<ul>
<li><strong>China:</strong> Bitcoin mining ban citing environmental concerns</li>
<li><strong>European Union:</strong> Taxonomy regulation for sustainable investments</li>
<li><strong>New York:</strong> Moratorium on fossil fuel crypto mining</li>
<li><strong>Kazakhstan:</strong> Energy grid strain from crypto mining</li>
</ul>

<h3>ESG Investment Criteria</h3>
<ul>
<li><strong>Institutional Requirements:</strong> Environmental compliance mandates</li>
<li><strong>Green Bonds:</strong> Sustainable blockchain infrastructure financing</li>
<li><strong>Impact Investing:</strong> Positive environmental outcome focus</li>
<li><strong>Reporting Standards:</strong> Carbon footprint disclosure requirements</li>
</ul>

<h2>Future Outlook</h2>
<h3>Technology Trends</h3>
<ul>
<li><strong>Layer 2 Solutions:</strong> Reduced energy per transaction</li>
<li><strong>Quantum Computing:</strong> Potential efficiency breakthroughs</li>
<li><strong>Renewable Integration:</strong> Grid stabilization through mining</li>
<li><strong>Circular Economy:</strong> Waste heat utilization projects</li>
</ul>

<h2>Investment Strategies</h2>
<ul>
<li><strong>ESG-Compliant Cryptocurrencies:</strong> PoS networks and green projects</li>
<li><strong>Renewable Energy Infrastructure:</strong> Solar and wind mining operations</li>
<li><strong>Carbon Credit Tokenization:</strong> Blockchain-based offset markets</li>
<li><strong>Sustainable Mining Equipment:</strong> Energy-efficient hardware manufacturers</li>
</ul>`,
          level: "intermediate",
          category: "research",
          duration: 45,
          format: "research",
          order: 25,
          requiredTier: "basic",
          prerequisites: ["Institutional Cryptocurrency Adoption Trends"],
          learningObjectives: ["Understand environmental impacts", "Evaluate sustainable solutions", "Assess ESG implications"],
          
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
          price: "96875.00",
          change24h: "1.45"
        },
        {
          symbol: "ETH", 
          price: "3680.00",
          change24h: "2.85"
        },
        {
          symbol: "BNB",
          price: "695.40",
          change24h: "2.15"
        },
        {
          symbol: "SOL",
          price: "245.80",
          change24h: "3.45"
        },
        {
          symbol: "XRP",
          price: "2.15",
          change24h: "5.25"
        },
        {
          symbol: "ADA",
          price: "0.95",
          change24h: "-1.25"
        },
        {
          symbol: "DOGE",
          price: "0.42",
          change24h: "4.85"
        },
        {
          symbol: "AVAX",
          price: "42.80",
          change24h: "5.35"
        },
        {
          symbol: "SHIB",
          price: "0.000025",
          change24h: "6.85"
        },
        {
          symbol: "UNI",
          name: "Uniswap",
          price: "15.45",
          change24h: "6.25",
          marketCap: "9200000000",
          volume24h: "485000000",
          lastUpdated: new Date()
        },
        {
          symbol: "AVAX",
          name: "Avalanche",
          price: "42.80",
          change24h: "8.15",
          marketCap: "17500000000",
          volume24h: "1200000000",
          lastUpdated: new Date()
        },
        {
          symbol: "LINK",
          name: "Chainlink",
          price: "25.60",
          change24h: "5.35",
          marketCap: "15800000000",
          volume24h: "920000000",
          lastUpdated: new Date()
        },
        {
          symbol: "MATIC",
          name: "Polygon",
          price: "0.48",
          change24h: "3.25",
          marketCap: "4800000000",
          volume24h: "285000000",
          lastUpdated: new Date()
        },
        {
          symbol: "ATOM",
          name: "Cosmos",
          price: "8.95",
          change24h: "7.45",
          marketCap: "3500000000",
          volume24h: "195000000",
          lastUpdated: new Date()
        },
        {
          symbol: "DOT",
          name: "Polkadot",
          price: "7.85",
          change24h: "2.15",
          marketCap: "11200000000",
          volume24h: "385000000",
          lastUpdated: new Date()
        },
        {
          symbol: "ARB",
          name: "Arbitrum",
          price: "0.95",
          change24h: "12.85",
          marketCap: "3800000000",
          volume24h: "485000000",
          lastUpdated: new Date()
        },
        {
          symbol: "OP",
          name: "Optimism",
          price: "2.45",
          change24h: "9.25",
          marketCap: "2100000000",
          volume24h: "225000000",
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
          content: `BTC consolidating near $97,000 after breaking major resistance with institutional volume. Key technical indicators:

📈 **Bullish Signals:**
- RSI cooling from overbought (78 → 65) 
- MACD showing sustained momentum
- ETF inflow volume confirmation
- 50-day MA providing strong support at $92k

🎯 **Targets:**
- Immediate resistance: $102,000
- Major psychological level: $110,000-$115,000 range

⚠️ **Risk Management:**
- Stop loss below $94,500 
- Take profits incrementally above $100k

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
          userId: "demo-user-8",
          title: "Breaking: Major DeFi Protocol Announces V3 with Revolutionary Features",
          content: `🚀 **BREAKING NEWS** 🚀

One of the largest DeFi protocols just announced their V3 upgrade with game-changing features:

**New Features:**
✅ Cross-chain liquidity pools
✅ Concentrated liquidity (Uniswap V3 style)
✅ Automated position management
✅ Impermanent loss protection
✅ Native yield optimization

**Launch Timeline:**
- **Testnet:** Next week
- **Audit:** 4-6 weeks
- **Mainnet:** Q2 2025

**Token Economics:**
- 15% APY boost for early LPs
- Governance voting on fee structures  
- Revenue sharing with token holders
- Retroactive rewards for V2 users

**My Take:**
This could be huge for the space. The cross-chain functionality alone could capture significant TVL from other protocols. Planning to participate in the testnet and potentially ape into the launch.

What are your thoughts? Too good to be true or legitimate innovation?

*NFA - Do your own research!*`,
          likes: 267,
          replies: 89,
          views: 4521,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
          userId: "demo-user-9",
          title: "Deep Dive: Why I'm Bullish on Modular Blockchain Architecture",
          content: `The future of blockchain isn't monolithic chains - it's modular architecture. Here's why:

**The Modular Thesis:**

**1. Separation of Concerns**
- **Execution:** Where transactions are processed
- **Settlement:** Where disputes are resolved  
- **Consensus:** How agreement is reached
- **Data Availability:** Where transaction data is stored

**2. Specialized Optimization**
Each layer can be optimized for its specific function rather than trying to be good at everything.

**Key Projects to Watch:**

**Celestia ($TIA)** - Modular DA layer
- First dedicated data availability blockchain
- Enables sovereign rollups
- Growing ecosystem of projects building on top

**Dymension ($DYM)** - RollApp ecosystem  
- Internet of RollApps vision
- Easy deployment of custom chains
- Inter-blockchain communication built-in

**Polygon CDK** - Chain Development Kit
- Ethereum-secured custom chains
- Shared liquidity across chains
- Enterprise-grade infrastructure

**Investment Angle:**
I'm positioning for the modular future by:
- Accumulating DA layer tokens (TIA, AVAIL)
- Backing rollup infrastructure (ARB, OP, STRK)
- Early ecosystem bets on new rollups

**The Endgame:**
Thousands of specialized blockchains, each optimized for specific use cases, all interoperating seamlessly.

Thoughts on modular vs monolithic? Where are you placing your bets?`,
          likes: 198,
          replies: 67,
          views: 3214,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
        },
        {
          userId: "demo-user-10",
          title: "Real Yield vs Ponzi Yield: How to Spot Sustainable Protocols",
          content: `Not all yield is created equal. Here's how to distinguish between sustainable "real yield" and unsustainable "ponzi yield":

**Real Yield Characteristics:**
✅ Revenue from actual economic activity
✅ Fees from genuine users/usage
✅ Sustainable tokenomics
✅ Product-market fit evidence

**Red Flags (Ponzi Yield):**
❌ Yield only from token emissions
❌ No real revenue generation
❌ Unsustainable high APYs (>100%)
❌ Depends on constant new entrants

**Real Yield Examples:**

**GMX/GLP** - Perpetual trading fees
- Traders pay fees to LPs
- Sustainable business model
- Real demand from leverage traders

**Ethereum Staking** - Network security fees
- Validators earn from network fees
- Fundamental value accrual
- Deflationary when network busy

**Uniswap V3** - Trading fee collection
- LPs earn from actual trades
- Concentrated liquidity efficiency
- Revenue scales with volume

**Maker Protocol** - Stability fees
- Borrowers pay to mint DAI
- Real demand for stablecoin leverage
- Backed by over-collateralization

**Due Diligence Framework:**

1. **Revenue Source Analysis**
   - Where do the fees come from?
   - Is there genuine demand?
   - How sustainable is the model?

2. **Token Economics Review**
   - Emission schedules
   - Utility and value accrual
   - Governance and fee distribution

3. **Competitive Moats**
   - Network effects
   - Switching costs
   - Regulatory advantages

**Bottom Line:**
Focus on protocols with genuine revenue streams and avoid anything that looks like a yield farm ponzi. Sustainable yields might be lower, but they'll be there when the music stops.

What protocols do you consider "real yield"? Any red flags I missed?`,
          likes: 342,
          replies: 156,
          views: 5879,
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
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
        },
        {
          userId: "demo-user-11",
          title: "Web3 Gaming: The Next Billion-Dollar Opportunity?",
          content: `Gaming + crypto might be the killer app we've been waiting for. Here's my analysis:

**Market Size:**
- Gaming industry: $180B globally
- Only ~1% is blockchain-based currently
- Massive untapped potential

**Key Trends:**

**1. Play-to-Earn Evolution**
Beyond simple token rewards:
- Skill-based competitions
- Esports integration
- Creator economies
- Virtual job markets

**2. True Digital Ownership**
- NFT items that work across games
- Player-owned economies
- Resale and rental markets
- Cross-platform asset portability

**3. Infrastructure Maturing**
- Immutable X (gas-free trading)
- Polygon (fast, cheap transactions)
- Flow (built for gaming/NFTs)
- Solana (high-speed gaming chains)

**Top Projects I'm Watching:**

**Axie Infinity (AXS)** - Still the king
- 2.8M+ daily active users
- Proven sustainable economy
- Ronin sidechain for scalability

**The Sandbox (SAND)** - Virtual real estate
- $4M+ in weekly land sales
- Major brand partnerships (Adidas, Snoop Dogg)
- User-generated content focus

**Illuvium (ILV)** - AAA game coming
- $100M+ development budget
- Unreal Engine 4 graphics
- Auto-battler meets Pokemon

**Gala Games (GALA)** - Gaming platform
- 1.3M+ monthly players
- 20+ games in development
- Player-owned node network

**Investment Strategy:**
I'm splitting my gaming allocation:
- 40% established projects (AXS, SAND)
- 40% infrastructure plays (IMX, FLOW)
- 20% moonshots (new AAA games)

**Risks to Consider:**
- Regulatory uncertainty
- Game quality vs hype
- Token inflation issues
- Market saturation

The gaming industry is just getting started with crypto integration. The projects that nail fun gameplay + sustainable economics will be massive winners.

What gaming projects are you most excited about?`,
          likes: 278,
          replies: 94,
          views: 4867,
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
        },
        {
          userId: "demo-user-12",
          title: "Comprehensive Guide: Setting Up Your First DeFi Position",
          content: `New to DeFi? Here's a step-by-step guide to getting started safely:

**Step 1: Wallet Setup**
- Download MetaMask or similar wallet
- Backup your seed phrase SECURELY
- Start with small amounts ($50-100)
- Never share private keys with anyone

**Step 2: Get Some ETH**
- Buy on Coinbase, Binance, or Kraken
- Transfer to your wallet
- Keep some ETH for gas fees (always!)
- Consider Layer 2 options (Arbitrum, Polygon)

**Step 3: Your First DeFi Interaction**

**Conservative Option: Lending**
- Visit Aave or Compound
- Connect your wallet
- Deposit USDC or ETH
- Earn 2-5% APY safely

**Medium Risk: Liquidity Providing**
- Use Uniswap V3 or SushiSwap
- Provide liquidity to major pairs (ETH/USDC)
- Understand impermanent loss risks
- Start with stablecoin pairs

**Step 4: Risk Management**
✅ Only invest what you can afford to lose
✅ Diversify across protocols
✅ Check contract audits
✅ Understand the risks completely
✅ Start small and learn

**Common Beginner Mistakes:**
❌ Not keeping ETH for gas
❌ Falling for high APY scams
❌ Not reading contract risks
❌ Going all-in on one protocol
❌ Ignoring impermanent loss

**Recommended Starting Protocols:**
1. **Aave** - Battle-tested lending
2. **Uniswap** - Most liquid DEX
3. **Compound** - Original DeFi lending
4. **Curve** - Stablecoin efficiency
5. **1inch** - Best swap rates

**Gas Optimization Tips:**
- Check gas prices on GasNow
- Use DeFi Pulse for protocol info
- Consider Layer 2 solutions
- Batch transactions when possible
- Avoid peak network times

**Advanced Features (Later):**
- Yield farming strategies
- Leveraged positions
- Cross-chain protocols
- Governance participation

Remember: DeFi is powerful but risky. Take time to learn, start small, and never invest more than you can afford to lose.

Questions? Drop them below!`,
          likes: 445,
          replies: 187,
          views: 7234,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
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
          entryPrice: "96875.00",
          targetPrice: "102500.00",
          stopLoss: "94200.00",
          confidence: 85,
          reasoning: "Consolidation near $97k with institutional accumulation. ETF inflows driving sustained demand while RSI cooling provides entry opportunity.",
          status: "active",
          requiredTier: "pro",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        },
        {
          createdBy: "demo-user-4", // BlockchainDev
          symbol: "ETH",
          signalType: "buy",
          entryPrice: "3680.00",
          targetPrice: "4100.00",
          stopLoss: "3450.00",
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
          entryPrice: "245.80",
          targetPrice: "290.00",
          stopLoss: "220.00",
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
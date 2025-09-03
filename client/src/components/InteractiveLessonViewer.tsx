import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BookOpen, CheckCircle2, XCircle, ChevronRight, ChevronLeft,
  Brain, Code, Zap, Trophy, Target, AlertCircle, Lightbulb,
  Play, Lock, Star, Activity, DollarSign, TrendingUp, ArrowRight
} from "lucide-react";
import { triggerCelebration } from "@/lib/confetti";
// Code highlighting will use native pre/code elements with styled formatting

interface LessonSection {
  id: string;
  type: "content" | "checkpoint" | "exercise" | "simulation";
  title: string;
  content?: any;
  completed?: boolean;
}

interface Checkpoint {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

interface Exercise {
  type: "code" | "calculation" | "analysis";
  prompt: string;
  starterCode?: string;
  solution: string;
  hints: string[];
}

interface InteractiveLessonProps {
  lessonId: string;
  lessonTitle: string;
  onComplete: (score: number) => void;
}

// Real lesson content with actual educational value
const INTERACTIVE_LESSONS: Record<string, LessonSection[]> = {
  "crypto-fundamentals": [
    {
      id: "intro",
      type: "content",
      title: "What is Cryptocurrency?",
      content: {
        text: `Welcome to the world of cryptocurrency! Let's start with the basics.

Imagine you want to send money to a friend in another country. With traditional banking, this could take days and cost a lot in fees. Banks need to verify everything, and they're closed on weekends. Plus, someone in the middle (the bank) controls your money.

Cryptocurrency changes all of this. It's like digital cash that you can send directly to anyone, anywhere in the world, at any time - without needing a bank in the middle. But unlike regular digital payments (like Venmo or PayPal), no company controls it.

Here's what makes cryptocurrency special:

**It's Decentralized** - Instead of one bank controlling everything, thousands of computers around the world work together to run the system. It's like having a group project where everyone has a copy of the same notebook, so no one person can cheat.

**It's Secure** - Every transaction is locked using advanced math (cryptography). It's like having an unbreakable digital lock that only you have the key to.

**It's Transparent** - While your name stays private, all transactions are recorded in a public ledger that anyone can verify. Think of it as a receipt book that everyone can read, but with usernames instead of real names.

**It Works 24/7** - Unlike banks that close at 5 PM and on weekends, cryptocurrency never sleeps. You can send or receive money at 3 AM on Christmas if you want!

**It's Global** - Sending crypto to someone in Japan is as easy as sending it to your neighbor. No exchange rates, no international fees, no waiting.`,
        
        keyPoints: [
          "Bitcoin was the first cryptocurrency, created in 2009 by Satoshi Nakamoto",
          "There are now over 20,000 different cryptocurrencies",
          "Market cap exceeds $1.2 trillion globally",
          "Used for payments, investments, and smart contracts"
        ],
        
        visualization: {
          type: "comparison",
          title: "Traditional vs Crypto",
          traditional: ["Central control", "Slow transfers", "High fees", "Limited hours"],
          crypto: ["Decentralized", "Instant transfers", "Low fees", "24/7 operation"]
        }
      }
    },
    {
      id: "checkpoint1",
      type: "checkpoint",
      title: "Knowledge Check: Crypto Basics",
      content: {
        question: "Based on what you just learned, what makes cryptocurrency different from sending money through a bank?",
        options: [
          "A bank or company controls the transaction and can reverse it",
          "Thousands of computers verify each transaction using advanced cryptography, making it secure and permanent",
          "The government guarantees all cryptocurrency transactions",
          "Regular internet security like passwords protect the transactions"
        ],
        correctAnswer: 1,
        explanation: "Cryptographic hashing creates unique fingerprints for each transaction, while blockchain technology chains these together in an immutable ledger.",
        points: 10
      }
    },
    {
      id: "blockchain",
      type: "content",
      title: "Understanding Blockchain Technology",
      content: {
        text: `Now let's understand the technology behind cryptocurrency - the blockchain.

Think of a blockchain like a notebook that everyone in class shares. When someone writes something in it, everyone gets a copy of that page. Once something is written, it can never be erased - only new pages can be added.

Here's a simple way to understand how blockchain works:

Imagine you want to send $10 worth of Bitcoin to your friend Sarah:

**Step 1: You Announce It** - You tell the network "I'm sending $10 to Sarah." This message goes to thousands of computers around the world.

**Step 2: Computers Check It** - These computers check: "Does this person actually have $10 to send?" They look at the history of all transactions to verify this.

**Step 3: It Goes in Line** - Your transaction joins other pending transactions, like people waiting in line at a store.

**Step 4: Transactions Get Bundled** - About every 10 minutes, all waiting transactions get grouped together into a 'block' - like putting all the receipts from that time period into one envelope.

**Step 5: Securing the Block** - Special computers called 'miners' compete to solve a complex puzzle to seal this envelope. The first one to solve it gets a reward (this is how new Bitcoin is created!).

**Step 6: Everyone Gets a Copy** - Once sealed, this block is added to the chain of all previous blocks (hence 'blockchain'), and every computer updates their copy.

**Step 7: Sarah Gets Her Money** - The transaction is now permanent. Sarah can see the $10 in her wallet, and everyone can verify this transaction happened.

The beauty is that no single person or company controls this process - it's all automated and verified by thousands of independent computers!`,
        
        interactive: {
          type: "blockchain-simulator",
          description: "Click to simulate adding a transaction to the blockchain"
        }
      }
    },
    {
      id: "exercise1",
      type: "exercise",
      title: "Calculate Transaction Fees",
      content: {
        type: "calculation",
        prompt: "If you're sending 0.5 BTC with a network fee of 0.00015 BTC, and the current BTC price is $43,000, what is the total USD value of the transaction fee?",
        hints: [
          "First convert the fee from BTC to USD",
          "Multiply 0.00015 by the BTC price"
        ],
        solution: "$6.45",
        explanation: "0.00015 BTC × $43,000 = $6.45 in transaction fees"
      }
    },
    {
      id: "wallets",
      type: "content",
      title: "Crypto Wallets Explained",
      content: {
        text: `Let's talk about cryptocurrency wallets - your gateway to the crypto world.

First, here's something that might surprise you: a crypto wallet doesn't actually hold your cryptocurrency! Instead, think of it like this:

Your cryptocurrency lives on the blockchain (that shared notebook we talked about). Your wallet is like a special key that proves which entries in that notebook belong to you. Without this key, you can't access your crypto - even though it's recorded as yours on the blockchain.

**Understanding Your Wallet Keys:**

Every wallet has two important parts:
- **Public Key (Wallet Address)**: This is like your email address - you can share it with anyone who wants to send you crypto
- **Private Key**: This is like your email password - NEVER share this with anyone! Anyone who has it can take all your crypto

**Types of Wallets - From Convenient to Super Secure:**

**Hot Wallets (Always Online)** - Like keeping cash in your pocket:
- **Phone Apps** (like Coinbase Wallet, Trust Wallet) - Super convenient for daily use, but since your phone is online, there's some risk
- **Computer Programs** (like Exodus, Atomic Wallet) - Good for trading, but vulnerable if your computer gets hacked
- **Website Wallets** (like exchange wallets) - Most convenient but least secure, as the website controls your keys

**Cold Wallets (Offline Storage)** - Like keeping cash in a safe:
- **Hardware Wallets** (like Ledger, Trezor) - Physical devices that look like USB drives. They keep your keys offline, making them nearly impossible to hack. Perfect for large amounts!
- **Paper Wallets** - Your keys printed on paper. Free but risky if the paper gets damaged or lost

**Golden Rules for Wallet Security:**

1. **Your Seed Phrase is Everything** - When you create a wallet, you'll get 12-24 random words. These words can restore your entire wallet if you lose access. Write them down (never digitally!) and store them somewhere safe.

2. **Never Share Your Private Keys** - If someone asks for your private key or seed phrase, it's a scam. No legitimate service will ever ask for these.

3. **Double-Check Addresses** - Crypto transactions can't be reversed! Always verify you're sending to the right address.

4. **Use the Right Wallet for the Right Purpose** - Keep small amounts in hot wallets for convenience, large amounts in cold wallets for security.

5. **Test with Small Amounts First** - When using a new wallet or sending to a new address, always test with a tiny amount first.`,
        
        warning: "⚠️ If you lose your private keys, you lose access to your crypto forever. There's no 'forgot password' option!"
      }
    },
    {
      id: "checkpoint2",
      type: "checkpoint",
      title: "Wallet Security Check",
      content: {
        question: "Which of these is the MOST important to keep secret?",
        options: [
          "Your wallet address",
          "Your transaction history",
          "Your private key/seed phrase",
          "Your wallet balance"
        ],
        correctAnswer: 2,
        explanation: "Your private key or seed phrase gives complete control over your funds. Anyone with this information can steal all your cryptocurrency.",
        points: 15
      }
    },
    {
      id: "simulation",
      type: "simulation",
      title: "Practice: Send Your First Transaction",
      content: {
        type: "wallet-simulator",
        description: "Practice sending crypto in a safe simulation environment",
        steps: [
          "Enter recipient wallet address",
          "Specify amount to send",
          "Review gas fees",
          "Confirm transaction",
          "Wait for blockchain confirmation"
        ]
      }
    }
  ],
  
  "technical-analysis": [
    {
      id: "intro",
      type: "content",
      title: "Introduction to Technical Analysis",
      content: {
        text: `Technical Analysis (TA) is the study of historical price movements to identify patterns and predict future price direction. Unlike fundamental analysis which looks at intrinsic value, TA focuses purely on price action and volume.

Core Principles:
• **Price Discounts Everything**: All known information is reflected in price
• **Price Moves in Trends**: Prices tend to move in observable patterns
• **History Repeats**: Human psychology creates repetitive patterns

Essential Concepts:
• **Support**: Price level where buying pressure prevents further decline
• **Resistance**: Price level where selling pressure prevents further rise
• **Trend**: Overall direction of price movement (up, down, or sideways)
• **Volume**: Number of assets traded (confirms price movements)`,
        
        chart: {
          type: "candlestick",
          description: "Interactive candlestick chart showing support and resistance levels"
        }
      }
    },
    {
      id: "candlesticks",
      type: "content",
      title: "Reading Candlestick Charts",
      content: {
        text: `Candlestick charts display four price points for each time period: Open, High, Low, and Close (OHLC). Each candle tells a story about the battle between buyers and sellers.

Anatomy of a Candlestick:
• **Body**: The area between open and close prices
• **Wicks/Shadows**: Lines showing high and low prices
• **Green/White**: Close higher than open (bullish)
• **Red/Black**: Close lower than open (bearish)

Key Patterns:
• **Doji**: Indecision, open and close are nearly equal
• **Hammer**: Potential reversal at bottom of downtrend
• **Shooting Star**: Potential reversal at top of uptrend
• **Engulfing**: Strong reversal signal when candle engulfs previous`,
        
        interactive: {
          type: "pattern-identifier",
          description: "Identify candlestick patterns in real charts"
        }
      }
    },
    {
      id: "checkpoint1",
      type: "checkpoint",
      title: "Candlestick Pattern Recognition",
      content: {
        question: "A long green candle with almost no wicks indicates:",
        options: [
          "Strong selling pressure",
          "Market indecision",
          "Strong buying pressure",
          "Low trading volume"
        ],
        correctAnswer: 2,
        explanation: "A long green body with minimal wicks shows buyers were in complete control, pushing price up strongly with little resistance.",
        points: 10
      }
    },
    {
      id: "indicators",
      type: "content",
      title: "Essential Technical Indicators",
      content: {
        text: `Technical indicators are mathematical calculations based on price and volume that help identify trends, momentum, and potential reversals.

Moving Averages:
• **Simple MA (SMA)**: Average price over N periods
• **Exponential MA (EMA)**: Weighted average giving more importance to recent prices
• **Golden Cross**: 50-day MA crosses above 200-day MA (bullish)
• **Death Cross**: 50-day MA crosses below 200-day MA (bearish)

Momentum Indicators:
• **RSI (Relative Strength Index)**: Measures overbought/oversold (0-100)
  - Above 70 = Overbought (potential sell)
  - Below 30 = Oversold (potential buy)
  
• **MACD**: Shows relationship between two moving averages
  - Signal line crossover = trade signals
  - Histogram shows momentum strength`,
        
        formula: {
          title: "RSI Calculation",
          code: "RSI = 100 - [100 / (1 + RS)]\nRS = Average Gain / Average Loss"
        }
      }
    },
    {
      id: "exercise1",
      type: "exercise",
      title: "Calculate Moving Average",
      content: {
        type: "calculation",
        prompt: "Calculate the 5-day Simple Moving Average for BTC with these closing prices: Day 1: $42,000, Day 2: $42,500, Day 3: $43,000, Day 4: $42,800, Day 5: $43,200",
        hints: [
          "Add all five closing prices together",
          "Divide the sum by 5"
        ],
        solution: "$42,700",
        explanation: "(42,000 + 42,500 + 43,000 + 42,800 + 43,200) ÷ 5 = $42,700"
      }
    }
  ]
};

export function InteractiveLessonViewer({ lessonId, lessonTitle, onComplete }: InteractiveLessonProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sectionProgress, setSectionProgress] = useState<Record<string, boolean>>({});
  const [checkpointScores, setCheckpointScores] = useState<Record<string, number>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [exerciseAttempt, setExerciseAttempt] = useState("");
  const [showHint, setShowHint] = useState(false);

  // Get lesson content or generate default
  const lessonSections = INTERACTIVE_LESSONS[lessonId] || generateDefaultLesson(lessonId, lessonTitle);
  const currentSection = lessonSections[currentSectionIndex];
  const progress = (Object.keys(sectionProgress).length / lessonSections.length) * 100;

  const handleCheckpointSubmit = () => {
    if (selectedAnswer === null) return;
    
    const checkpoint = currentSection.content as Checkpoint;
    const correct = selectedAnswer === checkpoint.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      const points = checkpoint.points;
      setCheckpointScores({ ...checkpointScores, [currentSection.id]: points });
      setTotalScore(totalScore + points);
      setSectionProgress({ ...sectionProgress, [currentSection.id]: true });
      triggerCelebration('achievement');
    }
  };

  const handleExerciseSubmit = () => {
    const exercise = currentSection.content;
    const correct = exerciseAttempt.toLowerCase().includes(exercise.solution.toLowerCase());
    
    if (correct) {
      setSectionProgress({ ...sectionProgress, [currentSection.id]: true });
      setTotalScore(totalScore + 20);
      triggerCelebration('achievement');
      setShowFeedback(true);
      setIsCorrect(true);
    } else {
      setShowFeedback(true);
      setIsCorrect(false);
    }
  };

  const nextSection = () => {
    if (currentSectionIndex < lessonSections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setExerciseAttempt("");
      setShowHint(false);
    } else if (progress === 100) {
      onComplete(totalScore);
    }
  };

  const previousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const markSectionComplete = () => {
    setSectionProgress({ ...sectionProgress, [currentSection.id]: true });
    nextSection();
  };

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-white">{lessonTitle}</CardTitle>
            <Badge className="bg-purple-600">
              Score: {totalScore} points
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Section {currentSectionIndex + 1} of {lessonSections.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Section Indicators */}
          <div className="flex gap-2">
            {lessonSections.map((section, index) => (
              <div
                key={section.id}
                className={`h-2 flex-1 rounded ${
                  sectionProgress[section.id] 
                    ? 'bg-green-500' 
                    : index === currentSectionIndex
                    ? 'bg-blue-500'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Section Title */}
        <div className="flex items-center gap-3">
          {currentSection.type === 'content' && <BookOpen className="w-6 h-6 text-blue-400" />}
          {currentSection.type === 'checkpoint' && <Brain className="w-6 h-6 text-purple-400" />}
          {currentSection.type === 'exercise' && <Code className="w-6 h-6 text-green-400" />}
          {currentSection.type === 'simulation' && <Zap className="w-6 h-6 text-yellow-400" />}
          <h3 className="text-xl font-semibold text-white">{currentSection.title}</h3>
        </div>

        {/* Content Section */}
        {currentSection.type === 'content' && (
          <div className="space-y-4">
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-line text-gray-300">
                {currentSection.content.text}
              </div>
            </div>

            {currentSection.content.keyPoints && (
              <Card className="bg-blue-900/20 border-blue-500/30">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Key Takeaways
                  </h4>
                  <ul className="space-y-2">
                    {currentSection.content.keyPoints.map((point: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {currentSection.content.visualization && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">{currentSection.content.visualization.title}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Traditional System</p>
                      <ul className="space-y-1">
                        {currentSection.content.visualization.traditional.map((item: string, i: number) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-red-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Crypto System</p>
                      <ul className="space-y-1">
                        {currentSection.content.visualization.crypto.map((item: string, i: number) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentSection.content.warning && (
              <Alert className="border-yellow-500/50 bg-yellow-900/20">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <AlertDescription className="text-yellow-200">
                  {currentSection.content.warning}
                </AlertDescription>
              </Alert>
            )}

            {currentSection.content.formula && (
              <Card className="bg-black border-gray-700">
                <CardContent className="p-4">
                  <h4 className="font-mono text-sm text-gray-400 mb-2">
                    {currentSection.content.formula.title}
                  </h4>
                  <pre className="text-green-400 font-mono text-sm">
                    {currentSection.content.formula.code}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Checkpoint Section */}
        {currentSection.type === 'checkpoint' && (
          <div className="space-y-4">
            <Card className="bg-purple-900/20 border-purple-500/30">
              <CardContent className="p-6">
                <p className="text-lg mb-4 text-white">{currentSection.content.question}</p>
                
                <RadioGroup value={selectedAnswer?.toString()} onValueChange={(v) => setSelectedAnswer(parseInt(v))}>
                  <div className="space-y-3">
                    {currentSection.content.options.map((option: string, index: number) => (
                      <Card 
                        key={index}
                        className={`cursor-pointer transition-all ${
                          showFeedback && index === currentSection.content.correctAnswer
                            ? 'bg-green-900/30 border-green-500'
                            : showFeedback && index === selectedAnswer && !isCorrect
                            ? 'bg-red-900/30 border-red-500'
                            : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <RadioGroupItem 
                              value={index.toString()} 
                              disabled={showFeedback}
                            />
                            <Label className="cursor-pointer flex-1">{option}</Label>
                            {showFeedback && index === currentSection.content.correctAnswer && (
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                            )}
                            {showFeedback && index === selectedAnswer && !isCorrect && (
                              <XCircle className="w-5 h-5 text-red-400" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </RadioGroup>

                {!showFeedback && (
                  <div className="flex gap-2 mt-4">
                    <Button 
                      onClick={handleCheckpointSubmit}
                      disabled={selectedAnswer === null}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      Submit Answer
                    </Button>
                    <Button 
                      onClick={() => {
                        setSectionProgress({ ...sectionProgress, [currentSection.id]: true });
                        nextSection();
                      }}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      Skip <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {showFeedback && (
                  <Alert className={`mt-4 ${isCorrect ? 'border-green-500/50 bg-green-900/20' : 'border-red-500/50 bg-red-900/20'}`}>
                    <div className="flex items-start gap-2">
                      {isCorrect ? (
                        <Trophy className="w-5 h-5 text-green-400 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold mb-1">
                          {isCorrect ? `Correct! +${currentSection.content.points} points` : 'Not quite right'}
                        </p>
                        <p className="text-sm text-gray-300">{currentSection.content.explanation}</p>
                      </div>
                    </div>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Exercise Section */}
        {currentSection.type === 'exercise' && (
          <div className="space-y-4">
            <Card className="bg-green-900/20 border-green-500/30">
              <CardContent className="p-6">
                <p className="text-white mb-4">{currentSection.content.prompt}</p>
                
                {currentSection.content.type === 'code' && currentSection.content.starterCode && (
                  <div className="mb-4">
                    <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                      <code className="text-green-400 font-mono text-sm">
                        {currentSection.content.starterCode}
                      </code>
                    </pre>
                  </div>
                )}

                <div className="space-y-3">
                  <Alert className="border-blue-500/50 bg-blue-900/20">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Solution:</strong> {currentSection.content.solution}
                      <p className="mt-2 text-sm">{currentSection.content.explanation}</p>
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex gap-2">
                    {!showFeedback && (
                      <>
                        <Button 
                          onClick={() => {
                            setSectionProgress({ ...sectionProgress, [currentSection.id]: true });
                            setTotalScore(totalScore + 20);
                            triggerCelebration('achievement');
                            setShowFeedback(true);
                            setIsCorrect(true);
                          }}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          I Understand This Exercise
                        </Button>
                        <Button 
                          onClick={() => setShowHint(!showHint)}
                          variant="outline"
                        >
                          <Lightbulb className="w-4 h-4 mr-2" />
                          Hint
                        </Button>
                      </>
                    )}
                  </div>

                  {showHint && !showFeedback && (
                    <Alert className="border-yellow-500/50 bg-yellow-900/20">
                      <Lightbulb className="h-4 w-4" />
                      <AlertDescription>
                        {currentSection.content.hints[0]}
                      </AlertDescription>
                    </Alert>
                  )}

                  {showFeedback && (
                    <Alert className={isCorrect ? 'border-green-500/50 bg-green-900/20' : 'border-red-500/50 bg-red-900/20'}>
                      <AlertDescription>
                        {isCorrect ? (
                          <div>
                            <p className="font-semibold mb-2">Excellent work! +20 points</p>
                            <p className="text-sm">{currentSection.content.explanation}</p>
                          </div>
                        ) : (
                          <div>
                            <p className="font-semibold mb-2">Not quite. The answer is: {currentSection.content.solution}</p>
                            <p className="text-sm">{currentSection.content.explanation}</p>
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Simulation Section */}
        {currentSection.type === 'simulation' && (
          <div className="space-y-4">
            <Card className="bg-yellow-900/20 border-yellow-500/30">
              <CardContent className="p-6">
                <p className="text-white mb-4">{currentSection.content.description}</p>
                
                <div className="space-y-3">
                  {currentSection.content.steps.map((step: string, index: number) => (
                    <Card key={index} className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-300">{step}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button 
                  onClick={() => {
                    setSectionProgress({ ...sectionProgress, [currentSection.id]: true });
                    setTotalScore(totalScore + 25);
                    triggerCelebration('achievement');
                    setShowFeedback(true);
                    setIsCorrect(true);
                  }}
                  className="mt-4 w-full bg-yellow-600 hover:bg-yellow-700"
                  disabled={sectionProgress[currentSection.id]}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {sectionProgress[currentSection.id] ? 'Simulation Completed' : 'Start Simulation'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-700">
          <Button 
            onClick={previousSection}
            disabled={currentSectionIndex === 0}
            variant="outline"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {currentSection.type === 'content' && !sectionProgress[currentSection.id] && (
              <Button onClick={markSectionComplete} variant="outline">
                Mark as Read
              </Button>
            )}
          </div>

          <Button 
            onClick={nextSection}
            disabled={
              (currentSection.type !== 'content' && !sectionProgress[currentSection.id]) ||
              (currentSectionIndex === lessonSections.length - 1 && progress !== 100)
            }
            className={
              currentSectionIndex === lessonSections.length - 1 && progress === 100
                ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                : ''
            }
          >
            {currentSectionIndex === lessonSections.length - 1 && progress === 100 ? (
              <>
                Complete Lesson
                <Trophy className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Generate default lesson content for any lesson
function generateDefaultLesson(lessonId: string, title: string): LessonSection[] {
  return [
    {
      id: "intro",
      type: "content",
      title: `Introduction to ${title}`,
      content: {
        text: `Welcome to this comprehensive lesson on ${title}. This interactive module will guide you through the essential concepts, provide hands-on exercises, and test your understanding with knowledge checkpoints.

Learning Objectives:
• Understand the fundamental concepts
• Apply knowledge through practical exercises
• Test understanding with interactive checkpoints
• Complete simulations to reinforce learning`,
        keyPoints: [
          "Interactive content designed for maximum retention",
          "Real-world examples and applications",
          "Progressive difficulty to build confidence",
          "Immediate feedback on your progress"
        ]
      }
    },
    {
      id: "checkpoint1",
      type: "checkpoint", 
      title: "Quick Knowledge Check",
      content: {
        question: "What is the primary goal of this lesson?",
        options: [
          "To memorize facts without understanding",
          "To gain practical knowledge through interactive learning",
          "To complete it as fast as possible",
          "To skip to the next lesson"
        ],
        correctAnswer: 1,
        explanation: "Interactive learning with practical application ensures better understanding and retention.",
        points: 10
      }
    },
    {
      id: "exercise1",
      type: "exercise",
      title: "Practice Exercise",
      content: {
        type: "analysis",
        prompt: "Apply what you've learned to solve this problem...",
        hints: ["Think about the key concepts covered", "Consider real-world applications"],
        solution: "The solution involves applying the concepts systematically",
        explanation: "This exercise reinforces the practical application of the concepts"
      }
    }
  ];
}
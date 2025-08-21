import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: string;
  hash: string;
  value: number;
  fee: number;
  timestamp: number;
  confirmations: number;
}

interface Block {
  id: string;
  height: number;
  hash: string;
  timestamp: string;
  txCount: number;
  size: number;
  miner: string;
  transactions: Transaction[];
}

interface BlockchainNode {
  id: string;
  x: number;
  y: number;
  size: number;
  connections: string[];
  activity: number;
  pulse: number;
}

export function LiveBlockchain() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [nodes, setNodes] = useState<BlockchainNode[]>([]);
  const [newBlock, setNewBlock] = useState<Block | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Initialize blockchain network visualization
  useEffect(() => {
    const initialNodes: BlockchainNode[] = Array.from({ length: 15 }, (_, i) => ({
      id: `node-${i}`,
      x: Math.random() * 450 + 25,
      y: Math.random() * 200 + 25,
      size: Math.random() * 6 + 3,
      connections: [],
      activity: Math.random(),
      pulse: Math.random() * Math.PI * 2
    }));

    // Create realistic network connections
    initialNodes.forEach((node, i) => {
      const connectionCount = Math.floor(Math.random() * 4) + 2;
      const distances = initialNodes
        .map((other, j) => ({ index: j, distance: Math.hypot(node.x - other.x, node.y - other.y) }))
        .filter(item => item.index !== i)
        .sort((a, b) => a.distance - b.distance);
      
      for (let j = 0; j < Math.min(connectionCount, distances.length); j++) {
        const targetIndex = distances[j].index;
        if (!node.connections.includes(initialNodes[targetIndex].id)) {
          node.connections.push(initialNodes[targetIndex].id);
        }
      }
    });

    setNodes(initialNodes);

    // Initialize blocks
    const initialBlocks: Block[] = [
      {
        id: "1",
        height: 825847,
        hash: "000000000000000000012a1e3f4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
        timestamp: "2 minutes ago",
        txCount: 3247,
        size: 1.2,
        miner: "AntPool",
        transactions: []
      },
      {
        id: "2", 
        height: 825846,
        hash: "000000000000000000098765432109876543210987654321098765432109876",
        timestamp: "12 minutes ago",
        txCount: 2891,
        size: 1.1,
        miner: "F2Pool",
        transactions: []
      }
    ];
    
    setBlocks(initialBlocks);

    // Generate live transactions
    const generateTransaction = (): Transaction => ({
      id: Math.random().toString(36).substring(7),
      hash: `${Math.random().toString(16).substring(2, 18)}...`,
      value: Math.random() * 10,
      fee: Math.random() * 0.001,
      timestamp: Date.now(),
      confirmations: Math.floor(Math.random() * 6)
    });

    const initialTxs = Array.from({ length: 8 }, generateTransaction);
    setTransactions(initialTxs);

    // Add new transactions every 2-5 seconds
    const txInterval = setInterval(() => {
      const newTx = generateTransaction();
      setTransactions(prev => [newTx, ...prev.slice(0, 7)]);
      
      // Increase node activity when new transaction arrives
      setNodes(prev => prev.map(node => ({
        ...node,
        activity: Math.min(1, node.activity + Math.random() * 0.4)
      })));
    }, Math.random() * 3000 + 2000);

    // Generate new blocks every 15-25 seconds
    const blockInterval = setInterval(() => {
      const newBlockData: Block = {
        id: Date.now().toString(),
        height: Math.max(...blocks.map(b => b.height), 825847) + 1,
        hash: `000000000000000000${Math.random().toString(16).substring(2, 50)}`,
        timestamp: "Just mined",
        txCount: Math.floor(Math.random() * 1000) + 2000,
        size: Math.round((Math.random() * 0.5 + 0.8) * 100) / 100,
        miner: ["AntPool", "F2Pool", "Binance Pool", "ViaBTC", "Poolin", "Foundry USA"][Math.floor(Math.random() * 6)],
        transactions: []
      };
      
      setNewBlock(newBlockData);
      
      // Major network activity spike for new block
      setNodes(prev => prev.map(node => ({
        ...node,
        activity: 1.0 // Maximum activity for all nodes
      })));
      
      setTimeout(() => {
        setBlocks(prev => [newBlockData, ...prev.slice(0, 4)]);
        setNewBlock(null);
        setTransactions([]); // Clear mempool when block is mined
      }, 3000);
    }, Math.random() * 10000 + 15000);

    return () => {
      clearInterval(txInterval);
      clearInterval(blockInterval);
    };
  }, []);

  // Animate the network visualization with more sophisticated graphics
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 500;
    canvas.height = 300;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const time = Date.now() * 0.002;
      
      // Draw connections with data flow animation
      nodes.forEach(node => {
        node.connections.forEach((connectionId, connIndex) => {
          const connectedNode = nodes.find(n => n.id === connectionId);
          if (connectedNode) {
            // Connection line
            const opacity = 0.3 + node.activity * 0.4;
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
            ctx.lineWidth = 1 + node.activity * 2;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(connectedNode.x, connectedNode.y);
            ctx.stroke();
            
            // Animated data packets
            const flowTime = time + node.x * 0.01 + connIndex;
            const progress = (Math.sin(flowTime) + 1) / 2;
            const flowX = node.x + (connectedNode.x - node.x) * progress;
            const flowY = node.y + (connectedNode.y - node.y) * progress;
            
            // Data packet glow
            ctx.shadowColor = 'rgba(34, 197, 94, 0.8)';
            ctx.shadowBlur = 8;
            ctx.fillStyle = `rgba(34, 197, 94, ${0.8 + 0.2 * Math.sin(flowTime * 3)})`;
            ctx.beginPath();
            ctx.arc(flowX, flowY, 2 + Math.sin(flowTime * 4), 0, Math.PI * 2);
            ctx.fill();
            
            // Additional smaller packets
            const secondaryProgress = (Math.sin(flowTime + Math.PI) + 1) / 2;
            const secX = node.x + (connectedNode.x - node.x) * secondaryProgress;
            const secY = node.y + (connectedNode.y - node.y) * secondaryProgress;
            ctx.fillStyle = `rgba(34, 197, 94, ${0.4 + 0.2 * Math.sin(flowTime * 2)})`;
            ctx.beginPath();
            ctx.arc(secX, secY, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      });
      
      // Draw nodes with enhanced visualization
      nodes.forEach(node => {
        node.pulse += 0.05;
        const pulse = 0.7 + 0.3 * Math.sin(node.pulse);
        const glowIntensity = node.activity * pulse;
        
        // Outer glow ring
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.size * 3
        );
        gradient.addColorStop(0, `rgba(59, 130, 246, ${glowIntensity * 0.8})`);
        gradient.addColorStop(0.7, `rgba(59, 130, 246, ${glowIntensity * 0.3})`);
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Main node body
        ctx.shadowColor = `rgba(59, 130, 246, ${glowIntensity})`;
        ctx.shadowBlur = 15 * glowIntensity;
        ctx.fillStyle = `rgba(59, 130, 246, ${0.7 + 0.3 * glowIntensity})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner core with pulsing effect
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.9 + 0.1 * Math.sin(node.pulse * 2)})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        
        // Activity indicator rings
        if (node.activity > 0.5) {
          for (let i = 0; i < 2; i++) {
            const ringRadius = node.size * (2 + i * 0.5) * pulse;
            ctx.strokeStyle = `rgba(34, 197, 94, ${(node.activity - 0.5) * (1 - i * 0.3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(node.x, node.y, ringRadius, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
        
        // Gradually decay activity
        node.activity *= 0.995;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes]);

  return (
    <div className="space-y-6">
      {/* Enhanced Network Visualization */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
              <div className="w-3 h-3 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
              Bitcoin Network Activity
            </h3>
            <p className="text-sm text-gray-400">Real-time blockchain network with live transaction flow</p>
          </div>
          <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/60 rounded-lg p-4 overflow-hidden border border-slate-700">
            <canvas
              ref={canvasRef}
              className="w-full h-auto"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            <div className="absolute top-4 right-4 space-y-2">
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Network Nodes ({nodes.length})</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Data Packets</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>High Activity</span>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 text-xs text-gray-500">
              Network hash rate: ~600 EH/s
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Transaction Mempool */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Live Transaction Mempool</h3>
            <Badge className="bg-orange-900/50 text-orange-400">
              {transactions.length} pending
            </Badge>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {transactions.map((tx, index) => (
              <div 
                key={tx.id} 
                className={`flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600 transition-all duration-500 ${
                  index === 0 ? 'ring-1 ring-green-500/50 bg-green-900/20' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div>
                    <div className="text-white font-mono text-sm">{tx.hash}</div>
                    <div className="text-xs text-gray-400">
                      {tx.confirmations > 0 ? `${tx.confirmations} confirmations` : 'Unconfirmed'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{tx.value.toFixed(4)} BTC</div>
                  <div className="text-xs text-gray-400">Fee: {(tx.fee * 1000).toFixed(3)} mBTC</div>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <div className="text-2xl mb-2">⛏️</div>
                <p>Mempool cleared - transactions confirmed in last block</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* New Block Animation */}
      {newBlock && (
        <Card className="bg-gradient-to-r from-green-900/80 to-emerald-900/80 border-green-500 ring-2 ring-green-400/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-green-400 font-semibold text-lg flex items-center">
                  ⛏️ New Block Mined!
                  <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                </div>
                <div className="text-sm text-green-300">Block #{newBlock.height.toLocaleString()}</div>
                <div className="text-xs text-green-200">Mined by {newBlock.miner}</div>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-mono text-sm">{newBlock.hash.substring(0, 24)}...</div>
                <div className="text-xs text-green-300">{newBlock.txCount.toLocaleString()} transactions confirmed</div>
                <div className="text-xs text-green-200">{newBlock.size} MB</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Blocks */}
      <div className="space-y-3">
        {blocks.map((block, index) => (
          <Card key={block.id} className={`bg-slate-800/50 border-slate-700 transition-all duration-500 ${index === 0 ? 'ring-2 ring-blue-500/50' : ''}`}>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-blue-400 font-semibold">Block #{block.height.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">{block.timestamp}</div>
                  <div className="text-xs text-gray-400">Mined by {block.miner}</div>
                </div>
                <div>
                  <div className="text-white font-mono text-sm">{block.hash.substring(0, 30)}...</div>
                  <div className="text-xs text-gray-400">Block Hash</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{block.txCount.toLocaleString()} transactions</div>
                  <div className="text-xs text-gray-400">{block.size} MB</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
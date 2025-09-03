import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, LogOut, DollarSign, Award, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  showBalance?: boolean;
}

export function WalletConnect({ onConnect, showBalance = true }: WalletConnectProps) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0.00");
  const [pendingRewards, setPendingRewards] = useState<string>("0.00");
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkWalletConnection();
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", () => window.location.reload());
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          fetchBalance(accounts[0]);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setWalletAddress(null);
      setBalance("0.00");
    } else {
      setWalletAddress(accounts[0]);
      fetchBalance(accounts[0]);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask to use Web3 features",
        variant: "destructive",
      });
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ 
        method: "eth_requestAccounts" 
      });
      
      setWalletAddress(accounts[0]);
      fetchBalance(accounts[0]);
      
      // Save wallet to backend
      await saveWalletAddress(accounts[0]);
      
      toast({
        title: "Wallet Connected!",
        description: "You can now earn crypto rewards",
      });
      
      onConnect?.(accounts[0]);
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setBalance("0.00");
    setPendingRewards("0.00");
    toast({
      title: "Wallet Disconnected",
      description: "You've been disconnected from your wallet",
    });
  };

  const fetchBalance = async (address: string) => {
    try {
      const response = await fetch(`/api/rewards/balance?wallet=${address}`);
      if (response.ok) {
        const data = await response.json();
        setBalance(data.claimedBalance || "0.00");
        setPendingRewards(data.pendingRewards || "0.00");
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const saveWalletAddress = async (address: string) => {
    try {
      await fetch("/api/wallet/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: address }),
        credentials: "include",
      });
    } catch (error) {
      console.error("Error saving wallet address:", error);
    }
  };

  const claimRewards = async () => {
    if (!walletAddress || parseFloat(pendingRewards) === 0) return;
    
    toast({
      title: "Processing Claim...",
      description: "Please wait while we process your rewards",
    });

    try {
      const response = await fetch("/api/rewards/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Rewards Claimed!",
          description: `Successfully claimed ${data.amount} USDC`,
        });
        fetchBalance(walletAddress);
      } else {
        throw new Error("Failed to claim rewards");
      }
    } catch (error) {
      toast({
        title: "Claim Failed",
        description: "Unable to claim rewards at this time",
        variant: "destructive",
      });
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!walletAddress) {
    return (
      <Button
        onClick={connectWallet}
        disabled={isConnecting}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        <Wallet className="w-4 h-4 mr-2" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {showBalance && (
        <div className="flex items-center gap-6 mr-2">
          <div className="text-right">
            <p className="text-xs text-gray-500">Earned</p>
            <p className="font-semibold flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {balance} USDC
            </p>
          </div>
          {parseFloat(pendingRewards) > 0 && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Pending</p>
              <Button
                size="sm"
                variant="outline"
                onClick={claimRewards}
                className="h-7 px-2 text-xs font-semibold text-green-600 border-green-600 hover:bg-green-50"
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                Claim {pendingRewards} USDC
              </Button>
            </div>
          )}
        </div>
      )}
      
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-2 flex items-center gap-2">
          <Badge variant="outline" className="bg-white">
            <Wallet className="w-3 h-3 mr-1" />
            {formatAddress(walletAddress)}
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            onClick={disconnectWallet}
            className="h-7 w-7 p-0"
          >
            <LogOut className="w-3 h-3" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
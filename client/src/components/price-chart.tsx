import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

export default function PriceChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { data: prices } = useQuery({
    queryKey: ['/api/prices'],
    refetchInterval: 30000,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !prices) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    // Generate mock price data for demonstration
    const btcPrice = Array.isArray(prices) ? prices.find((p: any) => p.symbol === "BTC")?.price || "45000" : "45000";
    const basePrice = parseFloat(btcPrice);
    
    const dataPoints = 50;
    const priceData = [];
    
    for (let i = 0; i < dataPoints; i++) {
      const variation = (Math.random() - 0.5) * 0.02; // 2% variation
      const price = basePrice * (1 + variation * Math.sin(i * 0.3));
      priceData.push(price);
    }

    // Draw the chart
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const minPrice = Math.min(...priceData);
    const maxPrice = Math.max(...priceData);
    const priceRange = maxPrice - minPrice;

    // Draw background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * chartHeight) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw price line
    ctx.strokeStyle = '#00bfa5';
    ctx.lineWidth = 2;
    ctx.beginPath();

    priceData.forEach((price, index) => {
      const x = padding + (index * chartWidth) / (dataPoints - 1);
      const y = padding + chartHeight - ((price - minPrice) / priceRange) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw current price label
    ctx.fillStyle = '#00bfa5';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`$${basePrice.toLocaleString()}`, width - padding, padding + 20);

  }, [prices]);

  return (
    <div className="bg-slate-50 rounded-xl p-4 h-64 relative">
      <div className="absolute top-6 left-6 z-10">
        <h4 className="font-semibold text-slate-900">BTC/USD</h4>
        <p className="text-sm text-slate-600">Live Price Chart</p>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

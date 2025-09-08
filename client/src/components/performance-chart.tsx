import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef } from "react";

export default function PerformanceChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isAuthenticated } = useAuth();
  
  const { data: trades } = useQuery({
    queryKey: ['/api/trades'],
    enabled: isAuthenticated // Only fetch trades if user is authenticated
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    // Generate portfolio performance data
    const dataPoints = 30;
    const portfolioData = [];
    let currentValue = 10000; // Starting portfolio value

    for (let i = 0; i < dataPoints; i++) {
      // Simulate portfolio growth with some volatility
      const dailyReturn = (Math.random() - 0.48) * 0.05; // Slightly positive bias
      currentValue *= (1 + dailyReturn);
      portfolioData.push(currentValue);
    }

    // Draw the chart
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const minValue = Math.min(...portfolioData);
    const maxValue = Math.max(...portfolioData);
    const valueRange = maxValue - minValue;

    // Draw background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 4; i++) {
      const y = padding + (i * chartHeight) / 4;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw area under the curve
    ctx.fillStyle = 'rgba(0, 191, 165, 0.1)';
    ctx.beginPath();
    
    portfolioData.forEach((value, index) => {
      const x = padding + (index * chartWidth) / (dataPoints - 1);
      const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.lineTo(width - padding, padding + chartHeight);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.closePath();
    ctx.fill();

    // Draw portfolio line
    ctx.strokeStyle = '#00bfa5';
    ctx.lineWidth = 3;
    ctx.beginPath();

    portfolioData.forEach((value, index) => {
      const x = padding + (index * chartWidth) / (dataPoints - 1);
      const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw benchmark line (simpler growth)
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();

    const benchmarkGrowth = 0.001; // 0.1% daily growth
    portfolioData.forEach((_, index) => {
      const benchmarkValue = 10000 * Math.pow(1 + benchmarkGrowth, index);
      const x = padding + (index * chartWidth) / (dataPoints - 1);
      const y = padding + chartHeight - ((benchmarkValue - minValue) / valueRange) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
    ctx.setLineDash([]);

    // Draw current value label
    ctx.fillStyle = '#00bfa5';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'right';
    const currentPortfolioValue = portfolioData[portfolioData.length - 1];
    ctx.fillText(`$${currentPortfolioValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, width - padding, padding + 20);

    // Draw legend
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#00bfa5';
    ctx.textAlign = 'left';
    ctx.fillText('● Portfolio', padding, height - 10);
    
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('--- Market Benchmark', padding + 80, height - 10);

  }, [trades]);

  return (
    <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center relative">
      <div className="absolute top-4 left-4 z-10">
        <h4 className="font-semibold text-slate-900 text-sm">30-Day Performance</h4>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

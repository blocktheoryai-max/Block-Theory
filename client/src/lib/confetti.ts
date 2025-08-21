import confetti from "canvas-confetti";

// Celebration animation for achievements, successful trades, etc.
export const triggerCelebration = (type: 'achievement' | 'trade' | 'alert' | 'lesson' = 'achievement') => {
  const colors = {
    achievement: ['#9333ea', '#c084fc', '#e879f9'],
    trade: ['#10b981', '#34d399', '#6ee7b7'],
    alert: ['#f59e0b', '#fbbf24', '#fcd34d'],
    lesson: ['#3b82f6', '#60a5fa', '#93c5fd']
  };

  const particleCount = type === 'trade' ? 150 : 100;
  const spread = type === 'trade' ? 90 : 70;
  
  confetti({
    particleCount,
    spread,
    origin: { y: 0.6 },
    colors: colors[type],
    gravity: 1,
    drift: 0,
    scalar: 1.2
  });

  // Add a second burst for trade celebrations
  if (type === 'trade') {
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors[type]
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors[type]
      });
    }, 300);
  }
};

// Fireworks effect for major achievements
export const triggerFireworks = () => {
  const duration = 15 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: NodeJS.Timeout = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    confetti(Object.assign({}, defaults, { 
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#9333ea', '#c084fc', '#e879f9']
    }));
    confetti(Object.assign({}, defaults, { 
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#10b981', '#34d399', '#6ee7b7']
    }));
  }, 250);
};

// Snow effect for special events
export const triggerSnow = () => {
  const duration = 10 * 1000;
  const animationEnd = Date.now() + duration;

  const interval: NodeJS.Timeout = setInterval(function() {
    const timeLeft = animationEnd - Date.now();
    
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    confetti({
      particleCount: 1,
      startVelocity: 0,
      ticks: 200,
      origin: {
        x: Math.random(),
        y: 0
      },
      colors: ['#ffffff', '#f8fafc', '#e2e8f0'],
      shapes: ['circle'],
      gravity: 0.4,
      scalar: 0.4,
      drift: 0.1
    });
  }, 100);
};
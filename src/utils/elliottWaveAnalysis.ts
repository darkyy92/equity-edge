export interface WavePoint {
  price: number;
  index: number;
  type: 'high' | 'low';
}

export interface WavePattern {
  degree: 'Primary' | 'Intermediate' | 'Minor';
  position: number;
  startIndex: number;
  endIndex: number;
  startPrice: number;
  endPrice: number;
  confidence: number;
}

export interface WaveAnalysis {
  currentWave: string;
  confidence: number;
  nextTarget: number | null;
  patterns: WavePattern[];
  supportLevels: number[];
  resistanceLevels: number[];
}

const findSwingPoints = (prices: number[], threshold: number = 0.01): WavePoint[] => {
  const points: WavePoint[] = [];
  for (let i = 1; i < prices.length - 1; i++) {
    const prev = prices[i - 1];
    const curr = prices[i];
    const next = prices[i + 1];
    
    // Calculate percentage changes
    const changeFromPrev = Math.abs((curr - prev) / prev);
    const changeToNext = Math.abs((next - curr) / curr);
    
    if (changeFromPrev >= threshold || changeToNext >= threshold) {
      if (curr > prev && curr > next) {
        points.push({ price: curr, index: i, type: 'high' });
      } else if (curr < prev && curr < next) {
        points.push({ price: curr, index: i, type: 'low' });
      }
    }
  }
  return points;
};

const calculateFibonacciLevels = (high: number, low: number): number[] => {
  const diff = high - low;
  return [
    high,
    high - diff * 0.236,
    high - diff * 0.382,
    high - diff * 0.5,
    high - diff * 0.618,
    high - diff * 0.786,
    low
  ];
};

const identifyWavePattern = (points: WavePoint[], startIndex: number): WavePattern | null => {
  if (points.length < 5) return null;

  let confidence = 0;
  const priceMovements: number[] = [];
  
  // Calculate price movements between consecutive points
  for (let i = startIndex; i < Math.min(startIndex + 5, points.length - 1); i++) {
    priceMovements.push(points[i + 1].price - points[i].price);
  }

  // Check for alternation in wave 2 and 4
  if (priceMovements.length >= 4) {
    const wave2 = Math.abs(priceMovements[1]);
    const wave4 = Math.abs(priceMovements[3]);
    if (Math.abs(wave2 - wave4) / Math.max(wave2, wave4) > 0.3) {
      confidence += 20;
    }
  }

  // Check wave 3 is not the shortest
  if (priceMovements.length >= 3) {
    const wave3 = Math.abs(priceMovements[2]);
    const otherWaves = priceMovements.filter((_, i) => i !== 2);
    if (wave3 > Math.max(...otherWaves.map(Math.abs))) {
      confidence += 30;
    }
  }

  // Add basic pattern recognition confidence
  confidence += 50;

  return {
    degree: 'Intermediate',
    position: startIndex + 1,
    startIndex: points[startIndex].index,
    endIndex: points[startIndex + 4]?.index || points[points.length - 1].index,
    startPrice: points[startIndex].price,
    endPrice: points[startIndex + 4]?.price || points[points.length - 1].price,
    confidence: Math.min(confidence, 100)
  };
};

export const calculateElliottWave = (historicalData: any[]): WaveAnalysis => {
  if (!historicalData || historicalData.length < 20) {
    return {
      currentWave: "Insufficient data",
      confidence: 0,
      nextTarget: null,
      patterns: [],
      supportLevels: [],
      resistanceLevels: []
    };
  }

  const prices = historicalData.map(d => d.price);
  const swingPoints = findSwingPoints(prices);
  
  // Find the most recent complete wave pattern
  let currentPattern: WavePattern | null = null;
  for (let i = Math.max(0, swingPoints.length - 10); i < swingPoints.length - 4; i++) {
    const pattern = identifyWavePattern(swingPoints, i);
    if (pattern && (!currentPattern || pattern.confidence > currentPattern.confidence)) {
      currentPattern = pattern;
    }
  }

  // Calculate support and resistance levels using recent swing points
  const recentPoints = swingPoints.slice(-10);
  const highs = recentPoints.filter(p => p.type === 'high').map(p => p.price);
  const lows = recentPoints.filter(p => p.type === 'low').map(p => p.price);
  
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const fibLevels = calculateFibonacciLevels(maxPrice, minPrice);

  // Calculate next target based on Fibonacci extensions
  const lastPrice = prices[prices.length - 1];
  const nextTarget = currentPattern 
    ? lastPrice * (1 + (currentPattern.confidence / 100) * 0.618)
    : null;

  return {
    currentWave: currentPattern ? `Wave ${currentPattern.position}` : "Wave pattern unclear",
    confidence: currentPattern?.confidence || 0,
    nextTarget,
    patterns: currentPattern ? [currentPattern] : [],
    supportLevels: [...new Set([...lows, ...fibLevels.slice(4)])].sort((a, b) => a - b),
    resistanceLevels: [...new Set([...highs, ...fibLevels.slice(0, 3)])].sort((a, b) => a - b)
  };
};
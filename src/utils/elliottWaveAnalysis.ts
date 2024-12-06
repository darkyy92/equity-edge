interface WaveAnalysis {
  currentWave: string;
  confidence: number;
  nextTarget: number | null;
}

interface WavePattern {
  currentPosition: string;
  totalWaves: number;
  isImpulse: boolean;
}

const findPivots = (prices: number[]) => {
  const pivots = [];
  for (let i = 1; i < prices.length - 1; i++) {
    if ((prices[i] > prices[i-1] && prices[i] > prices[i+1]) || 
        (prices[i] < prices[i-1] && prices[i] < prices[i+1])) {
      pivots.push({ price: prices[i], index: i });
    }
  }
  return pivots;
};

const identifyWaves = (pivots: any[]): WavePattern => {
  const waveCount = pivots.length;
  const possiblePositions = ["1", "2", "3", "4", "5", "A", "B", "C"];
  const currentPosition = possiblePositions[waveCount % 8];
  
  return {
    currentPosition,
    totalWaves: waveCount,
    isImpulse: waveCount <= 5
  };
};

const calculateWaveConfidence = (waves: WavePattern): number => {
  const baseConfidence = waves.isImpulse ? 75 : 65;
  const waveAdjustment = Math.min(waves.totalWaves * 5, 20);
  return Math.min(baseConfidence + waveAdjustment, 95);
};

const calculateNextTarget = (waves: WavePattern, currentPrice: number): number => {
  const fibLevels = [1.618, 2.618, 4.236];
  const multiplier = fibLevels[waves.totalWaves % 3];
  return currentPrice * multiplier;
};

export const calculateElliottWave = (historicalData: any[]): WaveAnalysis => {
  if (!historicalData || historicalData.length < 20) {
    return {
      currentWave: "Insufficient data",
      confidence: 0,
      nextTarget: null
    };
  }

  const prices = historicalData.map(d => d.price);
  const pivots = findPivots(prices);
  const waves = identifyWaves(pivots);
  const confidence = calculateWaveConfidence(waves);
  const nextTarget = calculateNextTarget(waves, prices[prices.length - 1]);

  return {
    currentWave: waves.currentPosition,
    confidence,
    nextTarget
  };
};
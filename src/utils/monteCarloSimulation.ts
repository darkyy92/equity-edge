export const generateMonteCarlo = (historicalData: any[], iterations: number) => {
  return Array.from({ length: 100 }, (_, i) => ({
    date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lowerBound: 100 - Math.random() * 10,
    upperBound: 150 + Math.random() * 10,
    median: 125 + (Math.random() - 0.5) * 10,
  }));
};
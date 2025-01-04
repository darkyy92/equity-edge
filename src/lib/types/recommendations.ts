import { StockTicker } from "./stock";

export interface TimeframeAnalysis {
  potentialGrowth: number;
  reason: string;
  confidence: number;
  primaryDrivers: string[];
}

export interface StockWithAnalysis extends StockTicker {
  aiAnalysis?: TimeframeAnalysis;
}

export type TimeframeKey = "short" | "medium" | "long";
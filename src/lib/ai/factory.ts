import { AIProvider } from './providers/types';
import { PerplexityProvider } from './providers/perplexity';

export const createAIProvider = (): AIProvider => {
  return new PerplexityProvider();
};
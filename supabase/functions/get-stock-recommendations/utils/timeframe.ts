export type Timeframe = 'short' | 'medium' | 'long';

export const transformTimeframe = (timeframe: string): Timeframe => {
  console.log('Input timeframe:', timeframe);
  
  const validTransforms: Record<string, Timeframe> = {
    'short-term': 'short',
    'medium-term': 'medium',
    'long-term': 'long',
    'short': 'short',
    'medium': 'medium',
    'long': 'long'
  };

  const transformed = validTransforms[timeframe];
  if (!transformed) {
    throw new Error(`Invalid timeframe: ${timeframe}. Must be one of: short-term, medium-term, long-term`);
  }

  console.log('Transformed timeframe:', transformed);
  return transformed;
};
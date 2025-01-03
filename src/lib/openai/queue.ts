// Queue management for rate limiting
let requestQueue: Array<() => Promise<any>> = [];
let isProcessingQueue = false;

export const wait = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export const processQueue = async (): Promise<void> => {
  if (isProcessingQueue || requestQueue.length === 0) return;
  
  isProcessingQueue = true;
  while (requestQueue.length > 0) {
    const request = requestQueue.shift();
    if (request) {
      try {
        await request();
        await wait(2000); // Rate limiting delay
      } catch (error) {
        console.error('Error processing queued request:', error);
      }
    }
  }
  isProcessingQueue = false;
};

export const addToQueue = (request: () => Promise<any>): void => {
  requestQueue.push(request);
  processQueue();
};
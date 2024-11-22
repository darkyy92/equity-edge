import { toast } from "@/components/ui/use-toast";

const POLYGON_API_KEY = 's3Kgk9rqPEj4IBl3Bo8Aiv7y53slSpSc';
let ws: WebSocket | null = null;

export const connectWebSocket = (onMessage: (data: any) => void) => {
  if (ws) return;

  ws = new WebSocket('wss://delayed.polygon.io/stocks');

  ws.onopen = () => {
    console.log('Connected to Polygon WebSocket');
    if (ws) {
      ws.send(JSON.stringify({
        action: 'auth',
        params: POLYGON_API_KEY
      }));

      ws.send(JSON.stringify({
        action: 'subscribe',
        params: 'T.AAPL,T.MSFT,T.GOOGL'
      }));
    }
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    toast({
      title: "WebSocket Error",
      description: "Failed to connect to live updates",
      variant: "destructive",
    });
  };

  ws.onclose = () => {
    console.log('Disconnected from Polygon WebSocket');
    ws = null;
  };
};

export const disconnectWebSocket = () => {
  if (ws) {
    ws.close();
    ws = null;
  }
};
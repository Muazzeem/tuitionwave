
class WebSocketService {
  private static instance: WebSocketService | null = null;
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 3000; // 3 seconds
  private messageHandlers: ((message: any) => void)[] = [];
  
  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }
  
  connect(conversationId: string | number, onMessage?: (message: any) => void): Promise<boolean> {
    return new Promise((resolve) => {
      // Close existing connection if any
      if (this.socket) {
        this.socket.close();
      }
      
      // Add message handler if provided
      if (onMessage) {
        this.messageHandlers.push(onMessage);
      }
      
      // Create a new WebSocket connection
      const socketUrl = `ws://13.200.63.86:9000/ws/chat/${conversationId}/`;
      this.socket = new WebSocket(socketUrl);
      
      // Setup event handlers
      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        this.reconnectAttempts = 0;
        resolve(true);
      };
      
      this.socket.onclose = (event) => {
        console.log('WebSocket connection closed', event);
        
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
          
          setTimeout(() => {
            this.connect(conversationId, onMessage);
          }, this.reconnectTimeout);
        }
        
        resolve(false);
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        resolve(false);
      };
      
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        
        // Notify all registered handlers
        this.messageHandlers.forEach(handler => handler(data));
      };
    });
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.messageHandlers = [];
  }
  
  sendMessage(messageData: any) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return false;
    }
    
    this.socket.send(JSON.stringify(messageData));
    return true;
  }
  
  addMessageHandler(handler: (message: any) => void) {
    this.messageHandlers.push(handler);
  }
  
  removeMessageHandler(handler: (message: any) => void) {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }
  
  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }
}

export { WebSocketService };
export default WebSocketService;

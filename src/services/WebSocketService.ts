
class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 3000; // 3 seconds
  private messageHandlers: ((event: MessageEvent) => void)[] = [];
  
  connect(conversationId: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Close existing connection if any
      if (this.socket) {
        this.socket.close();
      }
      
      // Get user token from localStorage
      
      // Create a new WebSocket connection
      const socketUrl = `ws://13.200.63.86:9000/ws/chat/1/`;
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
            this.connect(conversationId);
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
        this.messageHandlers.forEach(handler => handler(event));
      };
    });
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
  
  sendMessage(message: string, userId: string) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return false;
    }
    
    const messageObj = {
      type: 'chat_message',
      message,
      user_id: userId
    };
    
    this.socket.send(JSON.stringify(messageObj));
    return true;
  }
  
  addMessageHandler(handler: (event: MessageEvent) => void) {
    this.messageHandlers.push(handler);
  }
  
  removeMessageHandler(handler: (event: MessageEvent) => void) {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }
  
  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }
}

export default new WebSocketService();

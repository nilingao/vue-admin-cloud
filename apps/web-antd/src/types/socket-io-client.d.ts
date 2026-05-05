declare module 'socket.io-client' {
  export interface Socket {
    close(): void;
    connect(): Socket;
    disconnect(): Socket;
    emit(event: string, ...args: any[]): Socket;
    on(event: string, callback: (...args: any[]) => void): Socket;
    off?(event: string, callback?: (...args: any[]) => void): Socket;
  }

  export interface SocketConstructor {
    (url?: string, options?: Record<string, any>): Socket;
    new (url?: string, options?: Record<string, any>): Socket;
  }

  const io: SocketConstructor;
  export default io;
}

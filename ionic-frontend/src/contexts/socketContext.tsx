import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

  interface SocketIOContextProps {
    socket: Socket | null;
    connect: () => void;
    disconnect: () => void;
  }

const SocketContext = createContext<SocketIOContextProps>({
  socket: null,
  connect: () => {},
  disconnect: () => {}
});

//const SOCKET_SERVER_URL = 'http://127.0.0.1:5000'; // Replace with your server URL
const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;


type SocketProviderProps = {
  children: React.ReactNode;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const connect = () => {
    if (!socket) {
      const newSocket = io(SOCKET_SERVER_URL);
      setSocket(newSocket);
    }
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};

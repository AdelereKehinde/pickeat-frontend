// src/context/ConnectionContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import NetInfo from '@react-native-community/netinfo';

// Create context with default value
interface ConnectionContextType {
  isConnected: boolean | null;
}

const defaultConnectionState: ConnectionContextType = {
  isConnected: true, // Default to "connected" when no provider is used
};

export const ConnectionContext = createContext<ConnectionContextType>(defaultConnectionState);

// Define the types for the children prop
interface ConnectionProviderProps {
  children: ReactNode;
}

// Create provider component
export const ConnectionProvider: React.FC<ConnectionProviderProps> = ({ children }) => {
  // Allow isConnected to be boolean or null
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected); // `state.isConnected` can be `null`, so it's handled
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <ConnectionContext.Provider value={{ isConnected }}>
      {children}
    </ConnectionContext.Provider>
  );
};

import { useState, useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export function useNetwork() {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected ?? true);
      setIsInternetReachable(state.isInternetReachable ?? true);
    });

    return () => unsubscribe();
  }, []);

  return { isConnected, isInternetReachable, isOffline: !isConnected || !isInternetReachable };
}

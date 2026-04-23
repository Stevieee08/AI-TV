import { useState, useEffect } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsOnline(state.isConnected ?? true);
      setIsInternetReachable(state.isInternetReachable ?? true);
    });

    NetInfo.fetch().then((state) => {
      setIsOnline(state.isConnected ?? true);
      setIsInternetReachable(state.isInternetReachable ?? true);
    });

    return unsubscribe;
  }, []);

  return { isOnline, isInternetReachable, isOffline: !isOnline || !isInternetReachable };
};

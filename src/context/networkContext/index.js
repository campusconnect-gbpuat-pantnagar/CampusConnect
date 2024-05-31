import { createContext, useEffect, useState } from "react";
import useNetwork from "../../hooks/useNetwork";

export const NetworkContext = createContext();

export const NetworkContextProvider = ({ children }) => {
  const networkState = useNetwork();
  const [isOfflineForLong, setIsOfflineForLong] = useState(false);

  useEffect(() => {
    let offlineTimer = null;

    const checkOfflineDuration = () => {
      if (!networkState.online) {
        offlineTimer = setTimeout(() => {
          setIsOfflineForLong(true);
          alert("You have been offline for more than 30 seconds");
        }, 30000); // 30 seconds
      } else {
        if (offlineTimer) {
          clearTimeout(offlineTimer);
          offlineTimer = null;
        }
        setIsOfflineForLong(false);
      }
    };

    const intervalId = setInterval(() => {
      checkOfflineDuration();
    }, 30000);

    return () => {
      clearInterval(intervalId);
      if (offlineTimer) {
        clearTimeout(offlineTimer);
      }
    };
  }, [networkState.online]);
  return (
    <NetworkContext.Provider value={{ networkState, isOfflineForLong }}>
      {children}
    </NetworkContext.Provider>
  );
};

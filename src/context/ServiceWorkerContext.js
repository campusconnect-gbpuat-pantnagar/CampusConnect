import React, { createContext, useState, useContext, useEffect } from 'react';

const ServiceWorkerContext = createContext();

export const useServiceWorker = () => useContext(ServiceWorkerContext);

export const ServiceWorkerProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const registerServiceWorkers = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const [reg, messagingReg] = await Promise.all([
            navigator.serviceWorker.register('/service-worker.js'),
            navigator.serviceWorker.register("/firebase-messaging-sw.js")
          ]);

          console.log('Service Workers registered');
          setIsReady(true);
        } catch (err) {
          console.error('Service Worker registration failed:', err);
          setIsReady(false);
        }
      }
    };

    registerServiceWorkers();
  }, []);

  return (
    <ServiceWorkerContext.Provider value={{ isReady }}>
      {children}
    </ServiceWorkerContext.Provider>
  );
};


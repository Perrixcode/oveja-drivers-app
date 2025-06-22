import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as Location from 'expo-location';

export interface Delivery {
  id: number;
  client: string;
  amount: number;
  address: string;
  photoUri?: string;
  location?: Location.LocationObjectCoords;
}

interface DeliveryContextType {
  deliveries: Delivery[];
  location: Location.LocationObjectCoords | null;
  addDelivery: (delivery: Omit<Delivery, 'id'>) => void;
  startTracking: () => Promise<void>;
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

export function DeliveryProvider({ children }: { children: ReactNode }) {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);

  const addDelivery = (delivery: Omit<Delivery, 'id'>) => {
    setDeliveries((prev) => [...prev, { ...delivery, id: prev.length + 1 }]);
  };

  const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Permission to access location was denied');
      return;
    }
    await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 10 },
      (loc) => setLocation(loc.coords)
    );
  };

  return (
    <DeliveryContext.Provider value={{ deliveries, location, addDelivery, startTracking }}>
      {children}
    </DeliveryContext.Provider>
  );
}

export function useDeliveries() {
  const ctx = useContext(DeliveryContext);
  if (!ctx) throw new Error('useDeliveries must be inside DeliveryProvider');
  return ctx;
}

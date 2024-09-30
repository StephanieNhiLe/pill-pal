// MedicationContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of your context
interface MedicationContextType {
  medications: Medication[];
  setMedications: React.Dispatch<React.SetStateAction<Medication[]>>;
}

// Define the shape of a Medication object
interface Medication {
  name: string;
  dosage: string;
  time: string;
}

// Create the context with an initial undefined value
const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

// Props type for the MedicationProvider
interface MedicationProviderProps {
  children: ReactNode;
}

export const MedicationProvider: React.FC<MedicationProviderProps> = ({ children }) => {
  const [medications, setMedications] = useState<Medication[]>([]);

  return (
    <MedicationContext.Provider value={{ medications, setMedications }}>
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedication = (): MedicationContextType => {
  const context = useContext(MedicationContext);
  if (context === undefined) {
    throw new Error('useMedication must be used within a MedicationProvider');
  }
  return context;
};

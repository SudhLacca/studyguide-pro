import { createContext, useState, useContext } from 'react';

// Create the context
const StudyContext = createContext();

// Create a provider component
export function StudyProvider({ children }) {
  const [globalDocumentName, setGlobalDocumentName] = useState('');

  return (
    <StudyContext.Provider value={{ globalDocumentName, setGlobalDocumentName }}>
      {children}
    </StudyContext.Provider>
  );
}

// Custom hook to use the context easily
export function useStudyContext() {
  return useContext(StudyContext);
}
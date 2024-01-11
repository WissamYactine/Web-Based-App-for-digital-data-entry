import { createContext, useState } from "react";

export const MorbidityFormContext = createContext();

// Provides a context for holding all state in a MorbidityForm
// Very compact and useful for sending forms around
export function MorbidityFormContextProvider({ children }) {
  // Object which holds all information filled in the form
  const [formState, setFormState] = useState({
    rows: [
      { index: 0, disease: {}, ageGroups: {}, referrals: {}, minimized: false },
    ],
  });

  // Keeps track of which diseases have already been filled in
  const [usedDiseases, setUsedDiseases] = useState({});

  // Shows a confirmation box when submitting the form
  const [hideConfirmation, setHideConfirmation] = useState(true);

  const context = {
    formState,
    setFormState,
    usedDiseases,
    setUsedDiseases,
    hideConfirmation,
    setHideConfirmation,
  };

  return (
    <MorbidityFormContext.Provider value={context}>
      {children}
    </MorbidityFormContext.Provider>
  );
}

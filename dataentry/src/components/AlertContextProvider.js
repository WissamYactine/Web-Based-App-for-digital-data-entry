import { createContext, useState } from "react";
import { countUnsubmittedForms } from "../utils/localstorage.js";

export const AlertContext = createContext();

// Provides a context which keeps track of different states used for displaying alerts
export function AlertContextProvider({ children }) {
  // If this number is above 0, show warning
  const [numUnsubmitted, setNumUnsubmitted] = useState(countUnsubmittedForms());

  // Shows a confirmation when submitting (and resubmitting forms)
  const [confirmAlert, setConfirmAlert] = useState(false);

  // Shows a failure alert when failing to submit
  const [failAlert, setFailAlert] = useState(false);

  // Shows a warning when the form is not validated
  const [validationAlert, setValidationAlert] = useState(false);

  const context = {
    numUnsubmitted,
    setNumUnsubmitted,
    confirmAlert,
    setConfirmAlert,
    failAlert,
    setFailAlert,
    validationAlert,
    setValidationAlert,
  };

  return (
    <AlertContext.Provider value={context}>{children}</AlertContext.Provider>
  );
}

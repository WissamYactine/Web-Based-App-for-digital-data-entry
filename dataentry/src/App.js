import React from "react";
import { AlertContextProvider } from "./components/AlertContextProvider";
import { Site } from "./components/Site";

// Renders the Site component with the AlertContextProvider, so that we can show alerts globally
function App() {
  return (
    <AlertContextProvider>
      <Site />
    </AlertContextProvider>
  );
}

export default App;

import { Box, Card } from "@dhis2/ui";
import React from "react";
import { MorbidityForm } from "./morbidityform/MorbidityForm";
import { MorbidityFormContextProvider } from "./morbidityform/MorbidityFormContextProvider";

// Displays the correct form depending on props.formType
export function DataEntry(props) {
  function getForm() {
    const forms = {
      Morbidity: (
        <MorbidityFormContextProvider>
          <MorbidityForm {...props} />
        </MorbidityFormContextProvider>
      ),
    };

    return forms[props.formType];
  }

  return (
    <Box>
      <Card>{getForm()}</Card>
    </Box>
  );
}

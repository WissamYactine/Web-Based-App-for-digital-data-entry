import { AlertBar, AlertStack } from "@dhis2/ui";
import { useContext, useState } from "react";
import classes from "../App.module.css";
import { AlertContext } from "./AlertContextProvider";
import { DataTemplate } from "./DataTemplate";
import { MyForms } from "./MyForms";
import { Navigation } from "./Navigation";

// Renders the different pages of the app
// Also shows alerts depending on AlertContextProvider state
export function Site() {
  const [activePage, setActivePage] = useState("DataEntry");
  const {
    numUnsubmitted,
    confirmAlert,
    setConfirmAlert,
    failAlert,
    setFailAlert,
    validationAlert,
    setValidationAlert,
  } = useContext(AlertContext);

  function activePageHandler(page) {
    setActivePage(page);
  }

  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <Navigation
          activePage={activePage}
          activePageHandler={activePageHandler}
        />
      </div>
      <div className={classes.right}>
        {activePage === "DataEntry" && <DataTemplate />}
        {activePage === "MyForms" && <MyForms />}
      </div>

      <AlertStack>
        {numUnsubmitted > 0 && (
          <AlertBar permanent warning>
            You have {numUnsubmitted} unsubmitted forms
          </AlertBar>
        )}
        {confirmAlert && (
          <AlertBar
            success
            duration={5000}
            onHidden={() => setConfirmAlert(false)}
          >
            Form successfully submitted
          </AlertBar>
        )}
        {failAlert && (
          <AlertBar critical onHidden={() => setFailAlert(false)}>
            Failed to submit form
          </AlertBar>
        )}
        {validationAlert && (
          <AlertBar
            warning
            duration={5000}
            onHidden={() => setValidationAlert(false)}
          >
            Please select an Organization Unit
          </AlertBar>
        )}
      </AlertStack>
    </div>
  );
}

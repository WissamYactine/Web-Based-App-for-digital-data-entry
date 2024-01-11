import { OrganisationUnitTree } from "@dhis2/ui";
import { useContext } from "react";
import { getRootPaths } from "../utils/queries";
import { AlertContext } from "./AlertContextProvider";

export function PathNavigation({
  selectedUnit: selectedUnit,
  setSelectedUnit: setSelectedUnit,
}) {
  const root = getRootPaths();

  const {
    setValidationAlert,
  } = useContext(AlertContext);

  if (root.length == 0) {
    return "Loading";
  }

  function onChangeUnit(e) {
    setValidationAlert(false);
    setSelectedUnit(e);
  }

  return (
    <div>
      <div
        style={{
          fontSize: "1.1em",
          margin: "0.3em",
          textDecoration: "underline",
        }}
      >
        Organization Unit:
      </div>
      <OrganisationUnitTree
        name="Root org unit"
        roots={root.map((e) => e.id)}
        singleSelection
        onChange={onChangeUnit}
        autoExpandLoadingError
        highlighted={selectedUnit.path != undefined ? [selectedUnit.path] : []}
        maxWidth="10em"
      />
    </div>
  );
}

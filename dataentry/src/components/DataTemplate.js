import { Box, Card, SingleSelect, SingleSelectOption } from "@dhis2/ui";
import React, { useState } from "react";
import classes from "../App.module.css";
import styles from "../styles/DataTemplate.module.css";
import { months } from "../utils/constants";
import { DataEntry } from "./DataEntry";
import { PathNavigation } from "./PathNavigation";

// A template which shows year, month, orgunit pickers, and also displays some DataEntry component (ie form)
export function DataTemplate(props) {
  // Determines which form will be displayed, ie. Morbidity
  const [formType, setFormType] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState(months[new Date().getMonth()]);

  const [selectedUnit, setSelectedUnit] = useState({});

  const headerFields = [
    {
      name: "Form type",
      options: ["Morbidity"],
      state: formType,
      handler: setFormType,
    },
    {
      name: "Year",
      options: Array.from(new Array(43), (x, i) =>
        (i + new Date().getFullYear() - 42).toString()
      ).reverse(),
      state: year,
      handler: setYear,
      default: new Date().getFullYear().toString(),
    },
    {
      name: "Month",
      options: months,
      state: month,
      handler: setMonth,
      default: new Date().getMonth(),
    },
  ];

  const handleSelection = (setState, e) => {
    setState(e.selected);
  };

  let entryProps = {
    selectedUnit: selectedUnit,
    formType: formType,
    year: year,
    month: month,
  };

  return (
    <Box height="match-content" width="match-content">
      <h3>
        {selectedUnit.displayName == undefined
          ? "Data entry"
          : "Data entry" + " for " + selectedUnit.displayName}
      </h3>
      <Box className={classes.headerFields}>
        <Card>
          {headerFields.map((field, key) => {
            return (
              <div
                className={classes.headerFieldContainer}
                label={field.name}
                key={key}
              >
                {field.name}:
                <SingleSelect
                  name={field.name}
                  selected={field.state}
                  onChange={(e) => {
                    handleSelection(field.handler, e);
                  }}
                >
                  {field.options.map((opt, key) => {
                    return (
                      <SingleSelectOption key={key} value={opt} label={opt} />
                    );
                  })}
                </SingleSelect>
              </div>
            );
          })}
        </Card>
      </Box>
      <Box
        height="match-content"
        width="match-content"
        className={classes.dataTemplateContainer}
      >
        <Box
          className={styles.pathNavContainer}
          minWidth="16vw"
          minHeight="70vh"
          maxHeight="70vh"
          overflow="scroll"
        >
          <PathNavigation
            selectedUnit={selectedUnit}
            setSelectedUnit={setSelectedUnit}
          />
        </Box>
        <Box>
          <DataEntry {...entryProps} />
        </Box>
      </Box>
    </Box>
  );
}

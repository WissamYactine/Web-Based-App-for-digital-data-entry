import { Menu, MenuItem } from "@dhis2/ui";
import React from "react";

export function Navigation(props) {
  return (
    <Menu>
      <MenuItem
        label="Data entry"
        active={props.activePage === "DataEntry"}
        onClick={() => props.activePageHandler("DataEntry")}
      />
      <MenuItem
        label="My forms"
        active={props.activePage === "MyForms"}
        onClick={() => props.activePageHandler("MyForms")}
      />
    </Menu>
  );
}

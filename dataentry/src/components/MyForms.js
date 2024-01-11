import {
  Box,
  Button,
  IconChevronLeft24,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableHead,
  TableRow,
  TableRowHead,
} from "@dhis2/ui";
import React, { useEffect, useState } from "react";

import styles from "../styles/MyForms.module.css";
import { myFormsTableHeaderFields, pageSizes } from "../utils/constants";
import { deleteForm, getStoredForms } from "../utils/localstorage";

import ConfirmationBox from "./ConfirmationBox";
import { DataEntry } from "./DataEntry";
import { Resubmit } from "./Resubmit";

// Displays a list of forms stored in localstorage
// Also shows buttons to view the form in an uneditable state
// or delete the form (only locally)
// Users get a warning confirmation box when they click delete
export function MyForms(props) {
  const [forms, setForms] = useState(getStoredForms());
  const [pageSize, setPageSize] = useState(pageSizes[0]);
  const [pageCount, setPageCount] = useState(
    Math.max(1, Math.ceil(forms.length / pageSize))
  );
  const [page, setPage] = useState(1);
  const [totalItems] = useState(forms.length);
  const [displayedRows, setDisplayedRows] = useState(forms.slice(0, pageSize));
  const [viewForm, setViewForm] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(false);


  useEffect(() => {
    const startItem = (page - 1) * pageSize;
    setDisplayedRows(forms.slice(startItem, startItem + pageSize));
    setPageCount(Math.max(1, Math.ceil(forms.length / pageSize)));
  }, [pageSize, page]);

  useEffect(() => {
    const startItem = (page - 1) * pageSize;
    setDisplayedRows(forms.slice(startItem, startItem + pageSize));
  }, [forms]);

  function updateForms() {
    setForms(getStoredForms());
  }

  function pageHandler(num) {
    setPage(num);
  }

  function pageSizeHandler(num) {
    setPage(1);

    setPageSize(num);
  }

  function prependZero(value) {
    return value > 10 ? value.toString() : "0" + value.toString();
  }

  function parseDateString(timestamp) {
    const date = new Date(timestamp);
    const day = prependZero(date.getDate());
    const month = prependZero(date.getMonth() + 1);
    const year = date.getFullYear().toString();
    const hour = prependZero(date.getHours());
    const minutes = prependZero(date.getMinutes());
    const display = day + "-" + month + "-" + year + " " + hour + ":" + minutes;

    return display;
  }

  function deleteHandler(index) {
    deleteForm(index);
    updateForms();
  }

  // If a form is selected (view button clicked), show the form in uneditable state
  // Also has back button to go back to my forms
  if (viewForm) {
    return (
      <>
        <Button onClick={() => setViewForm(false)}>
          <IconChevronLeft24 />
          Back
        </Button>
        <h3>
          {viewForm.dataSetName} - {viewForm.orgUnit.displayName} -{" "}
          {viewForm.year} - {viewForm.month}
        </h3>
        <DataEntry
          formType={viewForm.dataSetName}
          form={viewForm}
          disabled={true}
        />
      </>
    );
  }

  // Show list of forms
  return (
    <Box width="80vw">
      <ConfirmationBox
        hide={rowToDelete !== 0 && !rowToDelete}
        hideConfirm={() => setRowToDelete(false)}
        onSubmit={() => deleteHandler((page - 1) * pageSize + rowToDelete)}
      >
        Are you sure you want to delete this form? This will not delete
        submitted data.
      </ConfirmationBox>
      <Table className={styles.table}>
        <TableHead>
          <TableRowHead>
            {myFormsTableHeaderFields.map((field, key) => {
              return (
                <TableCellHead className={styles.tableCellHeadField} key={key}>
                  {field}
                </TableCellHead>
              );
            })}
          </TableRowHead>
        </TableHead>
        <TableBody>
          {" "}
          {displayedRows.map((row, key) => {
            return (
              <TableRow key={key}>
                <TableCell className={styles.tableCell}>
                  {row.dataSetName}
                </TableCell>
                <TableCell className={styles.tableCell}>
                  {row.orgUnit.displayName}
                </TableCell>
                <TableCell className={styles.tableCell}>
                  {parseDateString(row.timestamp)}
                </TableCell>
                <TableCell className={styles.tableCell}>{row.year}</TableCell>
                <TableCell className={styles.tableCell}>{row.month}</TableCell>
                <TableCell className={styles.tableCell}>
                  <Resubmit
                    form={row}
                    index={(page - 1) * pageSize + key}
                    updateForms={updateForms}
                  />
                </TableCell>
                <TableCell className={styles.tableCell}>
                  <Button
                    className={styles.tableButton}
                    onClick={() => setViewForm(row)}
                  >
                    View form
                  </Button>
                  <Button
                    destructive
                    className={styles.tableButton}
                    onClick={() => setRowToDelete(key)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Box height="2em">
        <Pagination
          page={page}
          pageCount={pageCount}
          pageSizes={pageSizes}
          pageSize={pageSize}
          total={totalItems}
          onPageChange={(value) => {
            pageHandler(value);
          }}
          onPageSizeChange={(value) => {
            pageSizeHandler(value);
          }}
        />
      </Box>
    </Box>
  );
}

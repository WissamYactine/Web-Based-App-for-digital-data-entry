import { useDataMutation } from "@dhis2/app-runtime";
import { Box, Button } from "@dhis2/ui";
import { useContext } from "react";
import styles from "../../styles/MorbidityForm.module.css";
import { addFormToStorage } from "../../utils/localstorage";
import {
  getDataElements,
  getSubmitParameters,
  submitQuery,
} from "../../utils/queries";
import { AlertContext } from "../AlertContextProvider";
import ConfirmationBox from "../ConfirmationBox";
import { MorbidityFormContext } from "./MorbidityFormContextProvider";
import { MorbidityRow } from "./MorbidityRow";

// A MorbidityForm. Renders and keeps track of multiple MorbidityRow (Min/Max) components 
// which hold form data
export function MorbidityForm(props) {
  const {
    formState,
    setFormState,
    setUsedDiseases,
    hideConfirmation,
    setHideConfirmation,
  } = useContext(MorbidityFormContext);

  if (props.form) {
    setFormState(props.form);
  }

  const {
    setNumUnsubmitted,
    setConfirmAlert,
    setFailAlert,
    setValidationAlert,
  } = useContext(AlertContext);

  // Query which submits the form
  const [mutate, { loading, error }] = useDataMutation(submitQuery, {
    onComplete: submitOnComplete,
    onError: submitOnError,
  });

  const dataSet = getDataElements("Morbidity");
  // Since new,referral,followup is separate dataElements in API,
  // we get all of them and aggregate them so we can have one row per disease
  function getDiseases() {
    let diseases = dataSet.dataSetElements || [];
    diseases.sort((a, b) => a.dataElement.name > b.dataElement.name);

    const diseasesAggregated = {};

    diseases.forEach((e) => {
      const name = e.dataElement.name;
      const key = name.substring(0, name.lastIndexOf(" "));
      const type = name.substring(name.lastIndexOf(" ") + 1, name.length);
      diseasesAggregated[key] = diseasesAggregated[key] || {};
      diseasesAggregated[key][type] = e.dataElement;
      diseasesAggregated[key]["diseaseName"] = key;
    });

    return diseasesAggregated;
  }

  let diseasesAggregated = getDiseases();

  // Functionality for minimizing and maximizing all rows
  function minimizeAll() {
    const formStateNew = formState.rows;
    formStateNew.forEach((e) => (e.minimized = true));
    setFormState({ rows: formStateNew });
  }

  function maximizeAll() {
    const formStateNew = formState.rows;
    formStateNew.forEach((e) => (e.minimized = false));
    setFormState({ rows: formStateNew });
  }

  function addRow() {
    setFormState((prevForm) => {
      return {
        ...prevForm,
        rows: [
          ...prevForm.rows,
          {
            index: prevForm.rows.length,
            disease: {},
            ageGroups: {},
            referrals: {},
            minimized: false,
          },
        ],
      };
    });
  }

  // Deletes a row. When deleting we need to make sure that the disease is then usable again
  // We also don't want to remove all rows, if there are 0 rows, we create a new empty one
  function deleteRow(index) {
    const selectedDisease = formState.rows[index].disease.diseaseName;
    if (selectedDisease) {
      setUsedDiseases((prevState) => {
        delete prevState[selectedDisease];
        return prevState;
      });
    }
    const newForm = { ...formState };
    newForm.rows.splice(index, 1);
    newForm.rows.forEach((e, index) => {
      e.index = index;
    });

    if (newForm.rows.length == 0) {
      newForm.rows.push({
        index: 0,
        disease: {},
        ageGroups: {},
        referrals: {},
        minimized: false,
      });
    }

    setFormState(newForm);

    if (newForm.rows.length == 0) {
      updateRowState(0, {
        index: 0,
        ageGroups: {},
        referrals: {},
        minimized: false,
        disease: {},
      });
    }

  }

  // Used by MorbidityRow to set its own state
  function updateRowState(index, values) {
    setFormState((prevForm) => {
      const newForm = { ...prevForm };
      newForm.rows[index] = values;
      return newForm;
    });
  }

  // Submits the form, onComplete and onError stores them in localstorage
  function onSubmit() {
    if (!validateForm()) {
      setValidationAlert(true);
      return;
    }
    const formState = getFormState();
    const [orgUnit, period, dataValues] = getSubmitParameters(formState);


    mutate({
      orgUnit: orgUnit,
      period: period,
      dataValues: dataValues,
    });

    emptyForm()
  }

  // Bundles together state and props which we need to submit
  function getFormState() {
    return {
      ...formState,
      dataSetId: dataSet.id,
      dataSetName: "Morbidity",
      timestamp: Date(),
      orgUnit: props.selectedUnit,
      year: props.year,
      month: props.month,
    };
  }


  // Validates the form. Only makes sure that an orgUnit is
  // selected. Should probably be extended
  function validateForm() {
    const formState = getFormState();
    return formState.orgUnit.displayName ? true : false;
  }

  // Empties the form after submission
  function emptyForm() {
    // Empty form
    setFormState({
      rows: [
        {
          index: 0,
          disease: {},
          ageGroups: {},
          referrals: {},
          minimized: false,
        },
      ],
    });

    setUsedDiseases({})
  }

  // After submitting, add form to localstorage
  // and show confirmation alert
  function submitOnComplete() {
    const formState = getFormState();
    formState.submitted = true;
    setConfirmAlert(true);
    addFormToStorage(formState);
  }

  // After submitting, add form to localstorage
  // and show error alert (not submitted)
  function submitOnError() {
    const formState = getFormState();
    formState.submitted = false;
    setNumUnsubmitted((oldValue) => oldValue + 1);
    setFailAlert(true);
    addFormToStorage(formState);
  }

  // Confirmation Box
  function showConfirm() {
    setHideConfirmation(false);
  }

  function hideConfirm() {
    setHideConfirmation(true);
  }

  return (
    <Box>
      <ConfirmationBox
        hideConfirm={hideConfirm}
        hide={hideConfirmation}
        onSubmit={onSubmit}>
        Are you sure you want to submit this form?
    </ConfirmationBox>
      <Box className={"header"}>
        <Button className={styles.button} primary onClick={maximizeAll}>
          Maximize all
        </Button>
        <Button className={styles.button} primary onClick={minimizeAll}>
          Minimize all
        </Button>
      </Box>

      <Box>
        {" "}
        {formState.rows.map((e) => {
          return (
            <MorbidityRow
              key={e.index}
              index={e.index}
              diseases={diseasesAggregated}
              updateState={updateRowState}
              deleteFunction={deleteRow}
              disabled={props.disabled}
            />
          );
        })}
      </Box>
      {!props.disabled && (
        <Box className={styles.formButtonBox}>
            <Button secondary className={styles.button} onClick={addRow}>
              + New row
            </Button>
            <Button
              primary
              className={styles.button}
              type="submit"
              onClick={showConfirm}
            >
              Submit
            </Button>
        </Box>
      )}
    </Box>
  );
}

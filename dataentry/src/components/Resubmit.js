import { useDataMutation } from "@dhis2/app-runtime";
import { Button, colors, IconCheckmark24, IconWarning24 } from "@dhis2/ui";
import { useContext } from "react";
import styles from "../styles/MyForms.module.css";
import { setSubmitted } from "../utils/localstorage";
import { getSubmitParameters, submitQuery } from "../utils/queries";
import { AlertContext } from "./AlertContextProvider";

export function Resubmit({ form, index, updateForms }) {

  const [mutate, { loading, error }] = useDataMutation(submitQuery, {
    onComplete: checkOnComplete,
    onError: checkOnError,
  });

  const { setNumUnsubmitted, setConfirmAlert, setFailAlert } =
    useContext(AlertContext);

  function resubmit() {

    const [orgUnit, period, dataValues] = getSubmitParameters(form);

    mutate({
      orgUnit: orgUnit,
      period: period,
      dataValues: dataValues,
    });
  }

  function checkOnComplete() {
    setSubmitted(index);
    setConfirmAlert(true);
    setNumUnsubmitted((oldValue) => oldValue - 1);
    updateForms();
  }

  function checkOnError() {
    setFailAlert(true);
  }

  return (
    <>
      {form.submitted ? (
        <>
          <span className={styles.statusCell}>Submitted</span>{" "}
          <IconCheckmark24 color={colors.green700} />{" "}
        </>
      ) : (
        <>
          <Button
            className={styles.statusCell}
            onClick={() => {
              resubmit(index);
            }}
          >
            Resubmit
          </Button>
          <IconWarning24 color={colors.yellow400} />
        </>
      )}
    </>
  );
}

import { Button } from "@dhis2/ui";
import { useContext } from "react";
import styles from "../../styles/MorbidityRow.module.css";
import { MorbidityFormContext } from "./MorbidityFormContextProvider";

// Shows a minimized MorbidityRow
// Displays aggregated data from the maximized row
export function MorbidityRowMin({
  index,
  deleteHandler,
  minimizedHandler,
  disabled,
}) {
  const { formState } = useContext(MorbidityFormContext);
  const rowState = formState.rows[index];

  function extractDeaths() {
    let totalDeaths = 0;

    if (rowState.ageGroups) {
      const ageGroups = rowState.ageGroups;
      for (const key of Object.keys(ageGroups)) {
        const ageGroup = ageGroups[key];

        for (const key of Object.keys(ageGroup)) {
          const value = ageGroup[key];
          totalDeaths += parseInt(value);
        }
      }
    }
    return totalDeaths;
  }

  function extractRefs() {
    let totalRefs = 0;

    if (rowState.referrals) {
      const referrals = rowState.referrals;
      for (const key of Object.keys(referrals)) {
        const ageGroup = referrals[key];
        totalRefs += parseInt(ageGroup);
      }
    }

    return totalRefs;
  }

  return (
    <div className={styles.minimisedRow}>
      <p className={styles.chosenDiseaseContainer}>
        {rowState.disease.diseaseName || "No disease chosen"}
      </p>
      <p className={styles.deathsContainer}>Total deaths: {extractDeaths()}</p>
      <p className={styles.chosenReferralsContainer}>
        Referrals: {extractRefs()}
      </p>
      <div className={styles.minButtonContainer}>
        <div>
          {!disabled && (
            <Button
              className={styles.button}
              destructive
              onClick={deleteHandler}
            >
              Delete
            </Button>
          )}
        </div>
        <div>
          <Button
            className={styles.button}
            secondary
            onClick={minimizedHandler}
          >
            Maximize
          </Button>
        </div>
      </div>
    </div>
  );
}

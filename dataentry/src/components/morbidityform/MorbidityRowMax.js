import { Button, Input, SingleSelect, SingleSelectOption } from "@dhis2/ui";
import { useContext } from "react";
import classes from "../../App.module.css";
import styles from "../../styles/MorbidityRow.module.css";
import { MorbidityFormContext } from "./MorbidityFormContextProvider";

// Shows a maximied MorbitidyRow
// Has many input fields which is connected to formstate
// This can be uneditable if props.disabled is true
export function MorbidityRowMax({
  index,
  diseases,
  deleteHandler,
  minimizedHandler,
  updateState,
  disabled,
}) {
  const { formState, usedDiseases, setUsedDiseases } =
    useContext(MorbidityFormContext);
  const rowState = formState.rows[index];

  const ageGroups = [
    { name: "0-11m", cssClass: styles.ageGroup1Container },
    { name: "12-59m", cssClass: styles.ageGroup2Container },
    { name: "5-14y", cssClass: styles.ageGroup3Container },
    { name: "15y+", cssClass: styles.ageGroup4Container },
  ];

  function diseaseHandler(name) {
    const oldDisease = rowState.disease.diseaseName;
    const newState = { ...rowState, disease: diseases[name] };

    updateState(rowState.index, newState);
    setUsedDiseases((oldState) => {
      const newState = { ...oldState };
      newState[name] = true;
      if (oldDisease) {
        newState[oldDisease] = false;
      }
      return newState;
    });
  }

  function ageGroupHandler(ageGroup, nf, num) {
    let groups = rowState.ageGroups || {};
    groups[ageGroup] = groups[ageGroup] || {};

    groups[ageGroup][nf] = num;
    const newState = { ...rowState, ageGroups: groups };
    updateState(rowState.index, newState);
  }

  function referralsHandler(title, nf, num) {
    let referralsObject = rowState.referrals || {};

    referralsObject[nf] = num;

    const newState = { ...rowState, referrals: referralsObject };
    updateState(rowState.index, newState);
  }

  // Renders two number inputs next to each other.
  // For example one age group
  function getNumberInputs(
    changeHandler,
    group,
    leftName,
    rightName,
    values,
    placeholderLeft,
    placeholderRight
  ) {
    return (
      <div>
        {group.name}
        <div className={styles.numberInputPair}>
          <Input
            className={classes.numberInput}
            type="number"
            min="0"
            type={disabled ? "text" : "number"}
            placeholder={placeholderLeft}
            onChange={(e) => {
              changeHandler(group.name, leftName, e.value);
            }}
            readOnly={disabled}
            value={values.left}
          />
          <Input
            className={classes.numberInput}
            type={disabled ? "text" : "number"}
            min="0"
            placeholder={placeholderRight}
            onChange={(e) => {
              changeHandler(group.name, rightName, e.value);
            }}
            readOnly={disabled}
            value={values.right}
          />
        </div>
      </div>
    );
  }

  function getAgeGroupValues(age) {
    const ageGroup = rowState.ageGroups[age] || {};
    const values = {
      left: ageGroup["new"] || "",
      right: ageGroup["follow-up"] || "",
    };
    return values;
  }

  function getReferralValues() {
    return {
      left: rowState.referrals["0-4y"] || "",
      right: rowState.referrals["5y+"] || "",
    };
  }

  function getUneditableDisease() {
    return (
      <div style={{ textAlign: "center" }}>
        {rowState.disease.diseaseName || ""}
      </div>
    );
  }

  function getEditableDisease() {
    return (
      <SingleSelect
        name="disease"
        selected={rowState.disease.diseaseName || ""}
        onChange={(obj) => {
          diseaseHandler(obj.selected);
        }}
        disabled={disabled}
      >
        {Object.keys(diseases).map((e) => {
          const selected = rowState.disease.diseaseName || "";
          if (e != selected && usedDiseases[e]) {
            return null;
          }
          return <SingleSelectOption label={e} key={e} value={e} />;
        })}
      </SingleSelect>
    );
  }

  return (
    <div className={styles.maximisedRow}>
      <h3 className={styles.diseaseTitle}>Disease</h3>
      <div className={styles.diseaseContainer}>
        {disabled && getUneditableDisease()}
        {!disabled && getEditableDisease()}
      </div>
      <h3 className={styles.ageGroupsTitle}>Age groups</h3>
      {ageGroups.map((group, key) => {
        return (
          <span key={key} className={group.cssClass}>
            {getNumberInputs(
              ageGroupHandler,
              group,
              "new",
              "follow-up",
              getAgeGroupValues(group.name),
              "N",
              "F"
            )}
          </span>
        );
      })}
      <h3 className={styles.referralsTitle}>Referrals</h3>
      <div className={styles.referralsContainer}>
        {getNumberInputs(
          referralsHandler,
          "",
          "0-4y",
          "5y+",
          getReferralValues(),
          "0-4y",
          "5y+"
        )}
      </div>
      <div className={styles.buttonContainer}>
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
            Minimize
          </Button>
        </div>
      </div>
    </div>
  );
}

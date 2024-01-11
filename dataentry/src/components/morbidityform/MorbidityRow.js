import { useContext } from "react";
import { MorbidityFormContext } from "./MorbidityFormContextProvider";
import { MorbidityRowMax } from "./MorbidityRowMax";
import { MorbidityRowMin } from "./MorbidityRowMin";

// Shows a row in the MorbidityRow form
// This could be either minimized or maximized
export function MorbidityRow({
  index,
  diseases,
  updateState,
  deleteFunction,
  disabled,
}) {
  const { formState } = useContext(MorbidityFormContext);
  const rowState = formState.rows[index];

  function deleteHandler() {
    const deleteRow = deleteFunction;
    deleteRow(rowState.index);
  }

  function minimizedHandler() {
    let minimizedVal = rowState.minimized;
    minimizedVal = !minimizedVal;
    const newState = { ...rowState, minimized: minimizedVal };
    updateState(rowState.index, newState);
  }

  if (rowState.minimized) {
    return (
      <MorbidityRowMin
        index={index}
        deleteHandler={deleteHandler}
        minimizedHandler={minimizedHandler}
        disabled={disabled}
      />
    );
  }

  return (
    <MorbidityRowMax
      index={index}
      diseases={diseases}
      updateState={updateState}
      deleteHandler={deleteHandler}
      minimizedHandler={minimizedHandler}
      disabled={disabled}
    />
  );
}

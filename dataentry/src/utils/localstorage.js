import { localStorageMax } from "./constants";

export function addFormToStorage(form) {
  const forms = JSON.parse(window.localStorage.getItem("localForms") || "[]");

  let indToRemove = 0;
  if (forms.length >= localStorageMax) {
    for (let i = 0; i < forms.length; i++) {
      if (forms[i].submitted) {
        indToRemove = i;
        break;
      }
    }
    forms.splice(indToRemove, 1);
  }

  forms.unshift(form);

  window.localStorage.setItem("localForms", JSON.stringify(forms));
}

export function getStoredForms() {
  const forms = JSON.parse(window.localStorage.getItem("localForms") || "[]");

  return forms;
}

export function setSubmitted(index) {
  const forms = JSON.parse(window.localStorage.getItem("localForms") || "[]");
  if (index >= 0 && index < forms.length) forms[index].submitted = true;

  window.localStorage.setItem("localForms", JSON.stringify(forms));
}

export function countUnsubmittedForms() {
  const forms = JSON.parse(window.localStorage.getItem("localForms") || "[]");
  let numUnsubmitted = 0;
  forms.forEach((e) => {
    if (!e.submitted) {
      numUnsubmitted++;
    }
  });
  return numUnsubmitted;
}

export function deleteForm(index) {
  const forms = JSON.parse(window.localStorage.getItem("localForms") || "[]");

  if (index >= 0 && index < forms.length) forms.splice(index, 1);

  window.localStorage.setItem("localForms", JSON.stringify(forms));
}

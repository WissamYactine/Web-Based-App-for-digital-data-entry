import { useDataQuery, useDataMutation } from "@dhis2/app-runtime";
import { monthNumber } from "./constants";

const rootUnitsQuery = {
  results: {
    resource: "me",
    params: {
      fields: ["path, organisationUnits[id, name]"],
    },
  },
};

export function getRootPaths() {
  const object = useDataQuery(rootUnitsQuery);
  const { loading, error, data, refetch } = object;

  if (loading) {
    return [];
  }

  if (error) {
    return [];
  }

  return data.results.organisationUnits;
}

export function getDataSetId(formType) {
  const { loading, error, data } = useDataQuery(dataSetsIdQuery, {
    variables: { displayName: formType },
  });

  if (loading || error) {
    return null;
  }

  return data.results.dataSets[0].id;
}

const dataElementsQuery = {
  results: {
    resource: "dataSets",
    params: ({ displayName }) => ({
      fields:
        "name,id,dataSetElements[dataElement[name,id,categoryCombo[name,id,categoryOptionCombos[name,id]]]",
      filter: "displayName:eq:" + displayName,
      paging: false,
    }),
  },
};

export function getDataElements(displayName) {
  const { loading, error, data } = useDataQuery(dataElementsQuery, {
    variables: { displayName: displayName },
  });

  if (loading) {
    return {};
  }

  if (error) {
    return {};
  }

  return data.results.dataSets[0];
}

// Submit form
export const submitQuery = {
  resource: "dataValueSets",
  type: "create",
  data: ({ orgUnit, period, dataValues }) => ({
    orgUnit: orgUnit,
    period: period,
    dataValues: dataValues,
  }),
};

export function getSubmitParameters(formData) {
  const orgUnit = formData.orgUnit.id;
  const period = (formData.year + monthNumber[formData.month]).toString();

  const dataValues = buildDataValues(formData);

  return [orgUnit, period, dataValues];
}

function buildDataValues(formData) {
  let dataValues = [];

  formData.rows.forEach((row) => {
    const valueFields = ["follow-up", "new", "referrals"];

    valueFields.forEach((type) => {
      if (row.disease[type]) {
        dataValues = dataValues.concat(processRow(row, type));
      }
    });
  });
  return dataValues;
}

function processRow(row, type) {
  if (type != "referrals") {
    return processAgeGroup(row, type);
  } else {
    return processReferrals(row, type);
  }
}

function processAgeGroup(row, type) {
  const ageGroups = row.ageGroups;
  const id = row.disease[type].id;
  const typeObject = row.disease[type].categoryCombo;
  const combos = typeObject.categoryOptionCombos;
  const dataValues = [];

  combos.forEach((combo) => {
    if (ageGroups[combo.name]) {
      const ageGroupId = combo.id;
      const value = ageGroups[combo.name][type];

      if (value) {
        const dataValue = {
          dataElement: id,
          categoryOptionCombo: ageGroupId,
          value: value,
        };
        dataValues.push(dataValue);
      }
    }
  });

  return dataValues;
}

function processReferrals(row, type) {
  const referrals = row.referrals;
  const id = row.disease[type].id;
  const typeObject = row.disease[type].categoryCombo;
  const combos = typeObject.categoryOptionCombos;
  const dataValues = [];

  combos.forEach((combo) => {
    if (referrals[combo.name]) {
      const referallId = combo.id;
      const value = referrals[combo.name];

      const dataValue = {
        dataElement: id,
        categoryOptionCombo: referallId,
        value: value,
      };
      dataValues.push(dataValue);
    }
  });
  return dataValues;
}

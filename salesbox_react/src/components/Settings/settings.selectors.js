//@flow
import { createSelector } from 'reselect';

const emptySetting = {};

export const makeGetDisplaySetting = () =>
  createSelector(
    (state) => state.settings.display || emptySetting,
    (state, name) => name,
    (display, name) => {
      return display[name] || emptySetting;
    }
  );

export const isRightDTOList = createSelector(
  (state) => (state.settings.rights ? state.settings.rights.rightDTOList : []),
  (rightDTOList) => {
    return rightDTOList;
  }
);

export const isUnitDTOList = createSelector(
  (state) => (state.settings.rights ? state.settings.rights.unitDTOList : []),
  (unitDTOList) => {
    return unitDTOList;
  }
);

export const isRevenueDTOList = createSelector(
  (state) => (state.settings.targets ? state.settings.targets.listByYear.budgetDTOList : []),
  (isRevenueDTOList) => isRevenueDTOList
);

export const isUnitDTOListListByYear = createSelector(
  (state) => (state.settings.targets ? state.settings.targets.listByYear.unitDTOList : []),
  (isUnitDTOList) => isUnitDTOList
);

export const isBudgetActivityDTOList = createSelector(
  (state) => (state.settings.targets ? state.settings.targets.activity.budgetActivityDTOList : []),
  (isBudgetActivityDTOList) => isBudgetActivityDTOList
);

export const isCustomFieldDTOList = createSelector(
  (state) =>
    !!state.settings.customField && !!state.settings.customField.customFieldDTOList
      ? state.settings.customField.customFieldDTOList
      : [],
  (isCustomFieldDTOList) => isCustomFieldDTOList
);

export const isDateTimeFormatDTOList = createSelector(
  (state) =>
    !!state.settings.customField && !!state.settings.customField.dateTimeFormatDTOList
      ? state.settings.customField.dateTimeFormatDTOList
      : [],
  (isDateTimeFormatDTOList) => isDateTimeFormatDTOList
);

export const isUnitDTOListOrganisation = createSelector(
  (state) =>
    state.settings.organisation && state.settings.organisation.unitDTOList
      ? state.settings.organisation.unitDTOList
      : [],
  (isDateTimeFormatDTOList) => isDateTimeFormatDTOList
);

export const isCompanyOrganisation = createSelector(
  (state) =>
    state.settings.organisation && state.settings.organisation.company ? state.settings.organisation.company : {},
  (isCompanyOrganisation) => isCompanyOrganisation
);

export const isCountryDTOList = createSelector(
  (state) =>
    state.settings.organisation && state.settings.organisation.countryDTOList
      ? state.settings.organisation.countryDTOList
      : [],
  (isCountryDTOList) => isCountryDTOList
);

export const getProductGroups = createSelector(
  (state) => (state.settings.products ? state.settings.products.lineOfBusinessDTOList : []),
  (lineOfBusinessDTOList) => lineOfBusinessDTOList
);

export const getProductTypes = createSelector(
  (state) => (state.settings.products ? state.settings.products.measurementTypeDTOList : []),
  (measurementTypeDTOList) => measurementTypeDTOList
);

export const getProducts = createSelector(
  (state) => state.settings.products,
  (products) =>
    (products ? products.productDTOList : []).filter(
      (p) =>
        hasSome(
          products.selectedProductGroups,
          products.selectedProductGroups.some((pp) => pp.uuid === p.lineOfBusinessId)
        ) &&
        hasSome(
          products.selectedProductTypes,
          products.selectedProductTypes.some((pp) => pp.uuid === p.measurementTypeId)
        )
    )
);

function hasSome(arr, condition) {
  if (!arr || arr.length === 0) return true;
  return condition;
}


export const getTotalUserPending = createSelector(
  (state) => state.settings.organisation,
  (organisation) => {
    const unitDTOList = organisation?.unitDTOList
    let total = 0;
    unitDTOList?.map(unit => {
      total += calculateTotalPending(unit?.userDTOList);
    })
    return total;
  }
)

const calculateTotalPending = (userDTOList) => {
  return userDTOList?.filter(e => e.pendingId !== null).length;
}

export default makeGetDisplaySetting;

//@flow
import { createSelector } from 'reselect';

const emptyCustomField = {};


export const isFetching = createSelector(
  (state, objectType) => state.ui.customField.fetching[objectType],
  (state, objectType, objectId) => objectId,
  (state, objectType, objectId) => {
    return state.entities.customField
  },
  (fetching, objectId, customField) => {
    if (!fetching) {
      return false;
    }
    const { objects } = customField;

    if (fetching[objectId] === undefined) {
      return true;
    }
    return (fetching[objectId] && objects && objects[objectId] === undefined);
  }
);

export const getLastFetch = createSelector(
  (state, objectType) => state.ui.customField.lastFetch[objectType],
  (state, objectType, objectId) => objectId,
  (lastFetch, objectId) => {
    if (!lastFetch) {
      return 0;
    }
    return lastFetch[objectId] || 0;
  }
);

export const getCustomFieldValues = createSelector(
  (state, objectId) => {
    return state.entities.customField['objects'] ? state.entities.customField['objects'][objectId] : null;
  },
  (customFields) => {
    const keys = Object.keys(customFields ? customFields : {});
    const customFieldList = keys.map(key => {
      return customFields[key];
    })

    return customFieldList.sort((value1, value2) => value1.position < value2.position);
  }
);

export const getCustomFieldsObject = createSelector(
  (state) => {
    return state.ui.customField
  },
  (customField) => {

    const keys = Object.keys((customField && customField.customFieldsModel) || {});
    const customFieldList = keys.map(key => {
      return customField.customFieldsModel[key];
    });
    return customFieldList.sort((value1, value2) => value1.position < value2.position);
  }
);

export const makeGetCustomField = () =>
  createSelector(
    (state, customFieldId) => {

      return state.entities.customField[customFieldId]
    },
    (customField) => customField || emptyCustomField
  );

export const makeGetCustomFieldForUpdate = () =>
  createSelector(
    (state, customFieldId, objectId) => {

      return state.entities.customField.objects
    },
    (state, customFieldId, objectId) => {

      return customFieldId
    },
    (state, customFieldId, objectId) => {

      return objectId
    },
    (customFields, customFieldId, objectId) => {
      return customFields[objectId][customFieldId] || emptyCustomField
    },
  );
// @flow
import createReducer, { createConsumeEntities } from 'store/createReducer';
import AuthActionTypes from 'components/Auth/auth.actions';
import CustomFieldActionTypes from 'components/CustomField/custom-field.actions';

const { isArray } = Array;

export const initialState = {
  objects: {},
};

const consumeEntities = createConsumeEntities('customField');

export default createReducer(initialState, {
  [AuthActionTypes.LOGOUT]: (draft) => {
    Object.keys(draft).forEach((id) => delete draft[id]);
  },
  [CustomFieldActionTypes.UPDATE]: (draft, { customFieldId, updateData }) => {
    draft[customFieldId] = draft[customFieldId] || {};
    Object.keys(updateData).forEach((key) => {
      draft[customFieldId][key] = updateData[key];
    });
  },
  [CustomFieldActionTypes.UPDATE_VALUE]: (draft, { customFieldId, updateData, objectId }) => {
    draft.objects = draft.objects || {};
    draft.objects[objectId] = draft.objects[objectId] || {};

    draft.objects[objectId][customFieldId] = draft.objects[objectId][customFieldId] || {};

    draft.objects[objectId][customFieldId].customFieldValueDTOList =
      draft.objects[objectId][customFieldId].customFieldValueDTOList || [];

    if (draft.objects[objectId][customFieldId].customFieldValueDTOList.length < 1) {
      draft.objects[objectId][customFieldId].customFieldValueDTOList.push({});
    }
    Object.keys(updateData).forEach((key) => {
      draft.objects[objectId][customFieldId].customFieldValueDTOList[0][key] = updateData[key];
    });
  },

  [CustomFieldActionTypes.UPDATE_PRODUCT_TAG]: (draft, { customFieldId, value, typeAction, objectId }) => {
    draft.objects = draft.objects || {};
    draft.objects[objectId] = draft.objects[objectId] || {};

    draft.objects[objectId][customFieldId] = draft.objects[objectId][customFieldId] || {};

    draft.objects[objectId][customFieldId].customFieldValueDTOList =
      draft.objects[objectId][customFieldId].customFieldValueDTOList || [];

    if (isArray(value)) {
      if (typeAction === 'REMOVE') {
        draft.objects[objectId][customFieldId].customFieldValueDTOList = draft.objects[objectId][
          customFieldId
        ].customFieldValueDTOList.filter((tag) => {
          const findIndex = value.findIndex((newValue) => newValue.productId === tag.productId);
          return findIndex === -1;
        });
      } else {
        draft.objects[objectId][customFieldId].customFieldValueDTOList = value;
      }
    } else {
      if (typeAction === 'REMOVE') {
        draft.objects[objectId][customFieldId].customFieldValueDTOList = draft.objects[objectId][
          customFieldId
        ].customFieldValueDTOList.filter((tag) => {
          return tag.productId !== value.productId;
        });
      } else {
        const findIndex = draft.objects[objectId][customFieldId].customFieldValueDTOList.findIndex(
          (tag) => tag.productId === value.productId
        );
        if (findIndex === -1) {
          draft.objects[objectId][customFieldId].customFieldValueDTOList = draft.objects[objectId][
            customFieldId
          ].customFieldValueDTOList.concat(value);
        }
      }
    }
  },

  [CustomFieldActionTypes.UPDATE_DROPDOWN]: (draft, { customFieldId, value, objectId }) => {
    draft.objects = draft.objects || {};
    draft.objects[objectId] = draft.objects[objectId] || {};

    draft.objects[objectId][customFieldId] = draft.objects[objectId][customFieldId] || {};

    draft.objects[objectId][customFieldId].customFieldValueDTOList =
      draft.objects[objectId][customFieldId].customFieldValueDTOList || [];

    if (isArray(value)) {
      draft.objects[objectId][customFieldId].customFieldValueDTOList.forEach((dropdownValue) => {
        if (value.indexOf(dropdownValue.customFieldOptionValueUuid) > -1) {
          dropdownValue.isChecked = true;
        } else {
          dropdownValue.isChecked = false;
        }
      });
    } else {
      draft.objects[objectId][customFieldId].customFieldValueDTOList.forEach((dropdownValue) => {
        if (dropdownValue.customFieldOptionValueUuid === value) {
          dropdownValue.isChecked = true;
        } else {
          dropdownValue.isChecked = false;
        }
      });
    }
  },

  [CustomFieldActionTypes.UPDATE_CHECKBOX]: (draft, { customFieldId, optionId, checked, objectId }) => {
    draft.objects = draft.objects || {};
    draft.objects[objectId] = draft.objects[objectId] || {};

    draft.objects[objectId][customFieldId] = draft.objects[objectId][customFieldId] || {};

    draft.objects[objectId][customFieldId].customFieldValueDTOList =
      draft.objects[objectId][customFieldId].customFieldValueDTOList || [];

    if (draft.objects[objectId][customFieldId].customFieldOptionDTO.multiChoice) {
      draft.objects[objectId][customFieldId].customFieldValueDTOList.forEach((value) => {
        if (optionId === value.customFieldOptionValueUuid) {
          value.isChecked = checked;
        }
      });
    } else {
      draft.objects[objectId][customFieldId].customFieldValueDTOList.forEach((value) => {
        if (optionId === value.customFieldOptionValueUuid) {
          value.isChecked = checked;
        } else {
          value.isChecked = false;
        }
      });
    }
  },

  [CustomFieldActionTypes.FETCH_SUCCESS]: (draft, { objectId, entities }) => {
    // Object.keys(draft).forEach((id) => delete draft[id]);
    if (entities) {
      draft.objects = {
        ...draft.objects,
        [objectId]: entities.customField,
      };
    }
  },

  // [CustomFieldActionTypes.FETCH_START]: (draft, { objectId, entities }) => {

  // },
  default: consumeEntities,
});

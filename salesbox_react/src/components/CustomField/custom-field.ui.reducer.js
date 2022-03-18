// @flow
/* eslint-disable no-param-reassign */
import createReducer from 'store/createReducer';
import CustomFieldActionTypes from './custom-field.actions';
const { isArray } = Array;
export const initialState = {
  fetching: {},
  lastFetch: {},
  dropdownFetching: false,
  dropdownFetchingById: {},
  customFieldOptionList: {},
  customFieldsModel: {},
  listProductTag: [],
  customFieldOptionDTO: {}
};

export default createReducer(initialState, {
  [CustomFieldActionTypes.FETCH_START]: (draft, { objectType, objectId }) => {
    draft.fetching[objectType] = draft.fetching[objectType] || {};
    draft.fetching[objectType][objectId] = true;
  },
  [CustomFieldActionTypes.FETCH_SUCCESS]: (draft, { objectType, objectId }) => {
    draft.fetching[objectType] = draft.fetching[objectType] || {};
    draft.lastFetch[objectType] = draft.lastFetch[objectType] || {};
    draft.fetching[objectType][objectId] = false;
    draft.lastFetch[objectType][objectId] = Date.now();
  },
  [CustomFieldActionTypes.FETCH_FAIL]: (draft, { objectType, objectId }) => {
    draft.fetching[objectType] = draft.fetching[objectType] || {};
    draft.fetching[objectType][objectId] = false;
  },
  [CustomFieldActionTypes.UPDATE_FETCHING_STATUS_DROPDOWN_AS] : (draft, {status}) => {
    draft.dropdownFetching = status
  },
  [CustomFieldActionTypes.UPDATE_STATUS_LOADING_BY_CF_ID]: (draft, {customFieldId, status}) => {
    draft.dropdownFetchingById = {
      ...draft.dropdownFetchingById,
      [customFieldId]: status
    }
  },
  [CustomFieldActionTypes.SET_CUSTOM_FIELD_OPTION]: (draft, {data}) => {
    if(data && data.customFieldOptionDTO && data.customFieldOptionDTO.customFieldOptionValueDTOList)
    draft.customFieldOptionList = {
      ...draft.customFieldOptionList,
      [data.uuid] : data.customFieldOptionDTO.customFieldOptionValueDTOList 
    }    
  },
  [CustomFieldActionTypes.SET_LIST_PRODUCT_TAG] : (draft, {data}) => {
    draft.listProductTag = data;
  },


  [CustomFieldActionTypes.FEED_UI_CUSTOM_FIELDS_OBJECT]: (draft, { data }) => {
    if(draft.customFieldsModel) {
      Object.keys(draft.customFieldsModel).forEach((id) => delete draft.customFieldsModel[id]);
    }
    draft.customFieldsModel = data ? data : {};
    draft.customFieldOptionDTO = data ? data : {};
  },


  [CustomFieldActionTypes.UPDATE_CHECKBOX_MUTIL_OBJECT]: (draft, { customFieldId, optionId, checked }) => {
    draft.customFieldsModel[customFieldId] = draft.customFieldsModel[customFieldId] ? draft.customFieldsModel[customFieldId] : {};

    draft.customFieldsModel[customFieldId].customFieldValueDTOList = 
      draft.customFieldsModel[customFieldId].customFieldValueDTOList && draft.customFieldsModel[customFieldId].customFieldValueDTOList.length >0 ?
      draft.customFieldsModel[customFieldId].customFieldValueDTOList :
      (draft.customFieldsModel[customFieldId].customFieldOptionDTO ?
        draft.customFieldsModel[customFieldId].customFieldOptionDTO.customFieldOptionValueDTOList.map(opt => {
          return {
            customFieldOptionValueUuid: opt.uuid,
            value: opt.value,
            isChecked: false
          }
        }) : []);

    if (draft.customFieldsModel[customFieldId].customFieldOptionDTO.multiChoice) {
     
      draft.customFieldsModel[customFieldId].customFieldValueDTOList.forEach((value) => {
        if (optionId === value.customFieldOptionValueUuid) {
          value.isChecked = checked;
        }
      });
    } else {
      draft.customFieldsModel[customFieldId].customFieldValueDTOList.forEach((value) => {
      
        if (optionId === value.customFieldOptionValueUuid) {
          value.isChecked = checked;
        } else {
          value.isChecked = false;
        }
      });
    }
  },

  [CustomFieldActionTypes.UPDATE_VALUE_MUTIL_OBJECT]: (draft, { customFieldId, updateData }) => {

    draft.customFieldsModel[customFieldId] = draft.customFieldsModel[customFieldId] || {};
    draft.customFieldsModel[customFieldId].customFieldValueDTOList = draft.customFieldsModel[customFieldId].customFieldValueDTOList || [];
    if (draft.customFieldsModel[customFieldId].customFieldValueDTOList.length < 1) {
      draft.customFieldsModel[customFieldId].customFieldValueDTOList.push({});
    }
    Object.keys(updateData).forEach((key) => {
      draft.customFieldsModel[customFieldId].customFieldValueDTOList[0][key] = updateData[key];
    });
  },

  [CustomFieldActionTypes.UPDATE_DROPDOWN_MUTIL_OBJECT]: (draft, { customFieldId, value }) => {
    draft.customFieldsModel[customFieldId] = draft.customFieldsModel[customFieldId] || {};

    draft.customFieldsModel[customFieldId].customFieldValueDTOList = draft.customFieldsModel[customFieldId].customFieldValueDTOList || [];
    if (isArray(value)) {
      draft.customFieldsModel[customFieldId].customFieldValueDTOList.forEach((dropdownValue) => {
  
        if (value.indexOf(dropdownValue.customFieldOptionValueUuid) > -1) {
          dropdownValue.isChecked = true;
        } else {
          dropdownValue.isChecked = false;
        }
      });
    } else {
      draft.customFieldsModel[customFieldId].customFieldValueDTOList.forEach((dropdownValue) => {
        if (dropdownValue.customFieldOptionValueUuid === value) {
          dropdownValue.isChecked = true;
        } else {
          dropdownValue.isChecked = false;
        }
      });
    }
  },

  [CustomFieldActionTypes.UPDATE_PRODUCT_TAG_MUTIL_OBJECT]: (draft, { customFieldId, value, typeAction }) => {
    draft.customFieldsModel[customFieldId] = draft.customFieldsModel[customFieldId] || {};

    draft.customFieldsModel[customFieldId].customFieldValueDTOList = draft.customFieldsModel[customFieldId].customFieldValueDTOList || [];
    if (isArray(value)) {
      if (typeAction === 'REMOVE') {
        draft.customFieldsModel[customFieldId].customFieldValueDTOList = draft.customFieldsModel[customFieldId].customFieldValueDTOList.filter(tag => {
          const findIndex = value.findIndex(newValue => newValue.productId === tag.productId);
          return findIndex === -1;
        });
      } else {
        draft.customFieldsModel[customFieldId].customFieldValueDTOList = value;
      }
    } else {
      if (typeAction === 'REMOVE') {
        draft.customFieldsModel[customFieldId].customFieldValueDTOList = draft.customFieldsModel[customFieldId].customFieldValueDTOList.filter(tag => {
          return tag.productId !== value.productId;
        });
      } else {

        const findIndex = draft.customFieldsModel[customFieldId].customFieldValueDTOList.findIndex(tag => tag.productId === value.productId);
   
        if (findIndex === -1) {
          draft.customFieldsModel[customFieldId].customFieldValueDTOList = draft.customFieldsModel[customFieldId].customFieldValueDTOList.concat(value);
        }

      }
    }
  },
});

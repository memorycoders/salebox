// @flow
const ActionTypes = {
  FETCH_REQUEST: 'customField/requestFetch',
  RESET_CUSTOM_FIELDS: 'customField/reset',
  FETCH_START: 'customField/startFetch',
  FETCH_SUCCESS: 'customField/succeedFetch',
  FETCH_FAIL: 'customField/failFetch',
  FEED_ENTITIES: 'customField/feedEntities',
  UPDATE: 'customField/update',
  UPDATE_VALUE: 'customField/updateValue',
  UPDATE_DROPDOWN: 'customField/updateDropdown',
  UPDATE_CHECKBOX: 'customField/updateCheckbox',
  UPDATE_PRODUCT_TAG: 'customField/updateProductTag',
  UPDATE_FETCHING_STATUS_DROPDOWN_AS: 'customField/updatefetchingStatusDropdownAs',
  FETCH_DATA_DROPDOWN_AS: 'customField/fetchDataDropdownAS',
  SET_CUSTOM_FIELD_OPTION: 'customField/setCustomFieldOption',
  FETCH_TAG_CUSTOM_FIELD: 'customField/fetchTagCustomField',
  SET_LIST_PRODUCT_TAG: 'customField/setListProductTag',
  CONNECT_SAGA_UPDATE: 'customField/connectSagaUpdate',


  FETCH_REQUEST_CUSTOM_FIELDS_OBJECT: 'customField/requestFetchCustomFieldsObject',
  FETCH_CUSTOM_FIELDS_OBJECT_SUCCESS: 'customField/succeedCustomFieldsObjectFetch',
  FETCH_CUSTOM_FIELDS_OBJECT_FAIL: 'customField/failCustomFieldsObjectFetch',
  FEED_UI_CUSTOM_FIELDS_OBJECT: 'customField/feedUICustomFieldsObject',

  // UPDATE CUSTOM FIELD FOR MUTIL OBJECT

  UPDATE_VALUE_MUTIL_OBJECT: 'customField/updateValueMutilObject',
  UPDATE_DROPDOWN_MUTIL_OBJECT: 'customField/updateDropdownMutilObject',
  UPDATE_CHECKBOX_MUTIL_OBJECT: 'customField/updateCheckboxMutilObject',
  CONNECT_SAGA_UPDATE_MUTIL_OBJECT: 'customField/connectSagaUpdateMutilObject',
  UPDATE_PRODUCT_TAG_MUTIL_OBJECT: 'customField/updateProductTagMutilObject',
  UPDATE_STATUS_LOADING_BY_CF_ID: 'customField/updateStatusLoadingByCFId'
};


// Mutil object func

export const updateProductTagMutilObject = (customFieldId: string, value, typeAction) => ({
  type: ActionTypes.UPDATE_PRODUCT_TAG_MUTIL_OBJECT,
  customFieldId,
  value,
  typeAction
});

export const updateValueMutilObject = (customFieldId: string, updateData: {}) => ({
  type: ActionTypes.UPDATE_VALUE_MUTIL_OBJECT,
  customFieldId,
  updateData,
});

export const updateDropdownMutilObject = (customFieldId: string, value: string) => ({
  type: ActionTypes.UPDATE_DROPDOWN_MUTIL_OBJECT,
  customFieldId,
  value,
});

export const updateCheckboxMutilObject = (customFieldId: string, optionId: string, checked: boolean) => ({
  type: ActionTypes.UPDATE_CHECKBOX_MUTIL_OBJECT,
  customFieldId,
  optionId,
  checked
});



export const fetchCustomFieldsObjectSuccess = (objectType) => ({
  type: ActionTypes.FETCH_CUSTOM_FIELDS_OBJECT_SUCCESS,
  objectType
});

export const fetchFailCustomFieldsObject = (objectType) => ({
  type: ActionTypes.FETCH_CUSTOM_FIELDS_OBJECT_FAIL,
  objectType
});

export const feedUICustomFieldsObject = (data) => ({
  type: ActionTypes.FEED_UI_CUSTOM_FIELDS_OBJECT,
  data
});

export const fetchRequestCustomFieldsObject = (objectType) => ({
  type: ActionTypes.FETCH_REQUEST_CUSTOM_FIELDS_OBJECT,
  objectType
});

//UPDATE_PRODUCT_TAG

export const updateProductTag = (customFieldId: string, objectId: string, value, typeAction, isUpdateAll) => ({
  type: ActionTypes.UPDATE_PRODUCT_TAG,
  customFieldId,
  objectId,
  value, 
  typeAction,
  isUpdateAll
});

//connectSagaUpdate

export const connectSagaUpdate = (customFieldId: string, objectId: string, isUpdateAll, disableToast: Boolean) => ({
  type: ActionTypes.CONNECT_SAGA_UPDATE,
  customFieldId,
  objectId,
  isUpdateAll,
  disableToast
});

export const requestFetch = (objectType: string, objectId: string) => ({
  type: ActionTypes.FETCH_REQUEST,
  objectType,
  objectId,
});

export const startFetch = (objectType: string, objectId: string) => ({
  type: ActionTypes.FETCH_START,
  objectType,
  objectId,
});

export const succeedFetch = (objectType: string, objectId: string, data: {}) => ({
  type: ActionTypes.FETCH_SUCCESS,
  ...data,
  objectType,
  objectId,
});

export const feedEntities = (objectType: string, objectId: string, data: {}) => ({
  type: ActionTypes.FEED_ENTITIES,
  ...data,
  objectType,
  objectId,
});

export const failFetch = (objectType: string, objectId: string, error: string) => ({
  type: ActionTypes.FETCH_FAIL,
  error,
  objectType,
  objectId,
});

export const update = (customFieldId: string, updateData: any) => ({
  type: ActionTypes.UPDATE,
  customFieldId,
  updateData,
});

export const updateValue = (customFieldId: string, updateData: {}, objectId) => ({
  type: ActionTypes.UPDATE_VALUE,
  customFieldId,
  updateData,
  objectId
});

export const updateDropdown = (customFieldId: string, value: string, objectId, isUpdateAll) => ({
  type: ActionTypes.UPDATE_DROPDOWN,
  customFieldId,
  value,
  objectId,
  isUpdateAll
});

export const updateCheckbox = (customFieldId: string, optionId: string, checked: boolean, objectId, isUpdateAll) => ({
  type: ActionTypes.UPDATE_CHECKBOX,
  customFieldId,
  optionId,
  checked,
  objectId,
  isUpdateAll
});

export const updateFetchingDropdownStatusAs = (status: Boolean) => ({
  type: ActionTypes.UPDATE_FETCHING_STATUS_DROPDOWN_AS,
  status
})

export const fetchDataDropdownAs = (customFieldId: string) => ({
  type: ActionTypes.FETCH_DATA_DROPDOWN_AS,
  customFieldId
})

export const setCustomFieldOption = (data: Object) => ({
  type: ActionTypes.SET_CUSTOM_FIELD_OPTION,
  data
})

export const fetchTagCustomField = (customFieldId: string, searchText: string) => ({
  type: ActionTypes.FETCH_TAG_CUSTOM_FIELD,
  customFieldId,
  searchText
})

export const setListProductTag = (data: Object) => ({
  type: ActionTypes.SET_LIST_PRODUCT_TAG,
  data
})
export const updateStatusLoadingByCFId=(customFieldId, status) => ({
  type: ActionTypes.UPDATE_STATUS_LOADING_BY_CF_ID,
  customFieldId,
  status
})
export default ActionTypes;

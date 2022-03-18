// @flow

const ActionTypes = {
  FETCH_DISPLAY_SETTINGS_REQUEST: 'settings/fetchDisplaySettings/request',
  FETCH_DISPLAY_SETTINGS_FAIL: 'settings/fetchDisplaySettings/fail',
  FETCH_DISPLAY_SETTINGS: 'settings/fetchDisplaySettings',
  UPDATE_SETTING: 'settings/update',
  UPDATE_DISPLAY_SETTING: 'settings/updateDisplaySetting',
  UPDATE_PERIOD_FILTER: 'settings/updatePeriodFilter',
  REQUEST_UPDATE_DISPLAY_SETTING: 'setting/requestUpdateDisplaySetting',
  UPDATE_DISPLAY_COLUMN_ORDER_ROW: 'setting/updateDisplayColumnOrderRow',
  UPDATE_REMEMBER_LANGUAGE: 'setting/updateRememberLanguage',
  IMAGE_ON_CROP_ENABLED: 'setting/upload/image/crop/enabled',
  IMAGE_ON_CROP_CHANGE: 'setting/upload/image/crop/change',
  IMAGE_CANCEL_UPLOAD_CROP: 'setting/upload/image/cancel/crop',
  IMAGE_SAVE_UPLOAD_CROP: 'setting/upload/image/save/crop',
  CHANGE_PASSWORD: 'setting/chagePassword',
  FETCH_TARGETS_SETTINGS_REQUEST: 'settings/fetchTargetsSettings/request',
  FETCH_TARGETS_SETTINGS: 'settings/fetchTargetsSettings',
  UPDATE_TARGETS_LISTBYYEAR_SETTINGS: 'settings/updateTargetsListByYeaerSettings',
  UPDATE_TARGETS_ACTIVITY_SETTINGS: 'settings/updateTargetsActivitySettings',
  UPDATE_SETTINGS_TARGETS_LISTBYYEAR_REQUEST: 'settings/updateSettingsTargetsListByYear/request',
  UPDATE_SETTINGS_TARGETS_ACTIVITY_REQUEST: 'settings/updateSettingsTargetsActivity/request',
  FETCH_SETTINGS_RIGHTS_REQUEST: 'settings/fetchSettingsRights/request',
  FETCH_SETTINGS_RIGHTS_FAIL: 'settings/fetchSettingsRights/fail',
  FETCH_SETTINGS_RIGHTS: 'settings/fetchSettingsRights',
  UPDATE_SETTINGS_RIGHTS: 'settings/updateSettingsRights',
  UPDATE_SETTINGS_RIGHTS_REQUEST: 'settings/updateSettingsRights/request',
  FETCH_SETTINGS_PRODUCTS_REQUEST: 'settings/fetchSettingsProducts/request',
  FETCH_SETTINGS_PRODUCTS: 'settings/fetchSettingsProducts',
  DELETE_SETTINGS_PRODUCT_GROUP: 'settings/deteleSettingsProductGroup',
  DELETE_SETTINGS_PRODUCT_TYPE: 'settings/deteleSettingsProductType',
  DELETE_SETTINGS_PRODUCT_ITEM: 'settings/deteleSettingsProductItem',
  SET_SELECTED_PRODUCT_GROUPS: 'settings/setSelectedProductGroups',
  SET_SELECTED_PRODUCT_TYPES: 'settings/setSelectedProductTypes',
  FETCH_CUSTOM_FIELDS_SETTINGS_REQUEST: 'settings/fetchCustomFieldsSettings/request',
  FETCH_CUSTOM_FIELDS_SETTINGS: 'settings/fetchCustomFieldsSettings',
  UPDATE_CUSTOM_FIELDS_SETTINGS: 'setting/updateCustomFieldsSettings',
  DELETE_ITEM_CUSTOM_FIELDS_SETTINGS_REQUEST: 'settings/deleteItemCustomFieldsSettings/request',
  UPDATE_OBJECT_TYPE_CUSTOM_FIELDS_SETTING: 'settings/updateObjectTypeCustomFieldsSettings',
  UPDATE_POSITION_CUSTOM_FIELS_SETTING_REQUEST: 'settings/updatePositionCustomFieldsSettings/request',
  ADD_CUSTOM_FIELD_SETTING_REQUEST: 'settings/addCustomFieldsSettings/request',
  ADD_CF_SETTING_LOCAL: 'setting/addCFSettingLocal', // after add success, add new CF to list manually, not call api fetch list
  COPY_ITEM_CUSTOM_FIELDS_SETTINGS_REQUEST: 'settings/copyItemCustomFieldsSettings/request',
  EDIT_MULTI_CHOOSE_CUSTOM_FIELD_REQUEST: 'settings/editMultiChooseCustomField/request',
  EDIT_REQUIED_CUSTOM_FIELD_REQUEST: 'settings/editRequiedCustomField/request',
  EDIT_ACTIVE_CUSTOM_FIELD_REQUEST: 'settings/editActiveCustomField/request',
  UPDATE_FIELD_NAME_CUSTOM_FIELD: 'settings/updateFieldNameCustomField',
  UPDATE_ITEM_CUSTOM_FIELD_REQUEST: 'settings/updateItemCustomField/request',
  UPDATE_ITEM_CUSTOM_FIELD: 'settings/updateItemCustomField',
  FETCH_ORGANISATION_SETTINGS_REQUEST: 'settings/fetchOrganisationSettings/request',
  FETCH_ORGANISATION_SETTINGS: 'settings/fetchOrganisationSettings',
  UPDATE_LIST_ORGANISATION_SETTINGS_REQUEST: 'settings/updateListOrganisationSettings',
  UPDATE_LIST_ORGANISATION_SETTINGS: 'settings/updateListOrganisationSettings/request',
  UPDATE_ITEM_UNIT_ORGANISATION_SETTING_REQUEST: 'settings/updateItemUnitOrganisationSettings/request',
  DELETE_ITEM_UNIT_ORGANISATION_SETTING_REQUEST: 'settings/deleteItemUnitOrganisationSettings/request',
  ADD_NEW_UNIT_ORGANISATION_SETTINGS_REQUEST: 'settings/addNewUnitOranisationSettings/request',
  UPDATE_STATUS_USER_ORGANISATION_SETTINGS_REQUEST: 'settings/updateStatusUserOrganisationSettings/request',
  ADD_USER_ORGANISATION_SETTINGS_REQUEST: 'settings/addUserOrganisationSettings/request',
  DELETE_USER_PEDING_ORGANISATION_SETTINGS_REQUEST: 'settings/deleteUserPendingOranisationSettings/request',
  UPDATE_USER_ORGANISATION_SETTINGS_REQUEST: 'settings/updateUserOrganisationSettings/request',
  UPDATE_AVATAR_ORGANISATION_SETTINGS_REQUEST: 'settings/updateAvatarOrganisationSettings/request',
  UPDATE_USER_AVATAR_ORGANISATION_SETTINGS_REQUEST: 'settings/updateUserAvatarOrganisationSettings/request',
  FETCH_COMPANY_INFO_REQUEST: 'settings/fetchCompanyInfoRequest',
  FETCH_COMPANY_INFO_SUCCESS: 'settings/fetchCompanyInfoSuccess',
  REQUEST_UPDATE_COMPANY_INFO: 'setting/requestUpdateCompanyInfo',
  UPDATE_COMPANY_INFO: 'setting/updateCompanyInfo',
  REQUEST_UPDATE_MAIN_CONTACT: 'setting/requestUpdateMainContact',
  // add, update, remove phone & email
  ADD_PHONE: 'setting/addPhone',
  REMOVE_PHONE: 'setting/removePhone',
  UPDATE_PHONE: 'setting/updatePhone',
  MAKE_PHONE_MAIN: 'setting/makePhoneMain',

  ADD_EMAIL: 'setting/addEmail',
  REMOVE_EMAIL: 'setting/removeEmail',
  UPDATE_EMAIL: 'setting/updateEmail',
  MAKE_EMAIL_MAIN: 'setting/makeEmailMain',
  UPDATE_SELECTED_CASE_IN_RECRUITMENT: 'setting/updateSelectedCaseInRecruitment'
};

export const updateSelectedCaseInRecruitment = (screen, value) => {
  return {
    type: ActionTypes.UPDATE_SELECTED_CASE_IN_RECRUITMENT,
    screen,
    value

  }
}
export const requestOrganisationSettings = () => ({
  type: ActionTypes.FETCH_ORGANISATION_SETTINGS_REQUEST,
});

export const updateUserAvatarOrganisationSettings = (uuid, avatar) => ({
  type: ActionTypes.UPDATE_USER_AVATAR_ORGANISATION_SETTINGS_REQUEST,
  uuid,
  avatar,
});

export const updateAvatarOrganisationSettings = (uuid, avatar) => ({
  type: ActionTypes.UPDATE_AVATAR_ORGANISATION_SETTINGS_REQUEST,
  uuid,
  avatar,
});

export const updateUserOrganisationSettings = (data) => ({
  type: ActionTypes.UPDATE_USER_ORGANISATION_SETTINGS_REQUEST,
  data,
});

export const deleteUserPendingOranisationSettings = (pendingId) => ({
  type: ActionTypes.DELETE_USER_PEDING_ORGANISATION_SETTINGS_REQUEST,
  pendingId,
});

export const addUserOrganisationSettings = (data) => ({
  type: ActionTypes.ADD_USER_ORGANISATION_SETTINGS_REQUEST,
  data,
});

export const updateStatusUserOrganisationSettings = (uuid, active) => ({
  type: ActionTypes.UPDATE_STATUS_USER_ORGANISATION_SETTINGS_REQUEST,
  uuid,
  active,
});

export const addNewUnitOranisationSettings = (description, name) => ({
  type: ActionTypes.ADD_NEW_UNIT_ORGANISATION_SETTINGS_REQUEST,
  description,
  name,
});

export const deleteItemUnitOrganisationSettings = (unitId) => ({
  type: ActionTypes.DELETE_ITEM_UNIT_ORGANISATION_SETTING_REQUEST,
  unitId,
});

export const updateItemUnitOrganisationSettings = (itemUnit) => ({
  type: ActionTypes.UPDATE_ITEM_UNIT_ORGANISATION_SETTING_REQUEST,
  itemUnit,
});

export const fetchOrganisationSettings = () => ({
  type: ActionTypes.FETCH_ORGANISATION_SETTINGS_REQUEST,
});

export const updateItemCustomField = (customFieldId, value) => ({
  type: ActionTypes.UPDATE_ITEM_CUSTOM_FIELD,
  customFieldId,
  value,
});

export const updateItemCustomFieldRequest = (itemCustomField) => ({
  type: ActionTypes.UPDATE_ITEM_CUSTOM_FIELD_REQUEST,
  itemCustomField,
});

export const updateFieldNameCustomField = (customFieldId, value) => ({
  type: ActionTypes.UPDATE_FIELD_NAME_CUSTOM_FIELD,
  customFieldId,
  value,
});

export const editRequiedCustomField = (customFieldId, required) => ({
  type: ActionTypes.EDIT_REQUIED_CUSTOM_FIELD_REQUEST,
  customFieldId,
  required,
});

export const editActiveCustomField = (customFieldId, active) => ({
  type: ActionTypes.EDIT_ACTIVE_CUSTOM_FIELD_REQUEST,
  customFieldId,
  active,
});
export const editMultiChooseCustomField = (customFieldId, multiChoice) => ({
  type: ActionTypes.EDIT_MULTI_CHOOSE_CUSTOM_FIELD_REQUEST,
  customFieldId,
  multiChoice,
});
export const copyItemCustomFieldsSettings = (itemCustomField, objectTypes) => ({
  type: ActionTypes.COPY_ITEM_CUSTOM_FIELDS_SETTINGS_REQUEST,
  itemCustomField,
  objectTypes,
});

export const addCustomFieldsSettings = (title, fieldType) => ({
  type: ActionTypes.ADD_CUSTOM_FIELD_SETTING_REQUEST,
  title,
  fieldType,
});

export const addCustomFieldSettingsLocal = (data) => ({
  type: ActionTypes.ADD_CF_SETTING_LOCAL,
  data
})
export const updatePositionCustomFieldsSettings = () => ({
  type: ActionTypes.UPDATE_POSITION_CUSTOM_FIELS_SETTING_REQUEST,
});

export const updateObjectTypeCustomFieldsSettings = (objectType) => ({
  type: ActionTypes.UPDATE_OBJECT_TYPE_CUSTOM_FIELDS_SETTING,
  objectType,
});

export const deleteItemCustomFieldsSettings = (customFieldId) => ({
  type: ActionTypes.DELETE_ITEM_CUSTOM_FIELDS_SETTINGS_REQUEST,
  customFieldId,
});

export const updateCustomFieldsSettings = (value) => ({
  type: ActionTypes.UPDATE_CUSTOM_FIELDS_SETTINGS,
  value,
});

export const requestFetchDisplaySettings = () => ({
  type: ActionTypes.FETCH_DISPLAY_SETTINGS_REQUEST,
});

export const requestFetchTargetsSettings = (year) => ({
  type: ActionTypes.FETCH_TARGETS_SETTINGS_REQUEST,
  year,
});

export const fetchCustomFieldsSettings = (objectType) => ({
  type: ActionTypes.FETCH_CUSTOM_FIELDS_SETTINGS_REQUEST,
  objectType,
});

export const updateTargetsListByYearSettings = (userId, value) => ({
  type: ActionTypes.UPDATE_TARGETS_LISTBYYEAR_SETTINGS,
  userId,
  value,
});

export const updateTargetsActivitySettings = (userId, value) => ({
  type: ActionTypes.UPDATE_TARGETS_ACTIVITY_SETTINGS,
  userId,
  value,
});

export const updateSettingsTargetsListByYear = () => ({
  type: ActionTypes.UPDATE_SETTINGS_TARGETS_LISTBYYEAR_REQUEST,
});

export const updateSettingsTargetsActivity = () => ({
  type: ActionTypes.UPDATE_SETTINGS_TARGETS_ACTIVITY_REQUEST,
});

export const updateSettingsRightsRequest = () => ({
  type: ActionTypes.UPDATE_SETTINGS_RIGHTS_REQUEST,
});

export const requestFetchRightsSettings = () => ({
  type: ActionTypes.FETCH_SETTINGS_RIGHTS_REQUEST,
});

export const updateSettingsRights = (uuid, value) => ({
  type: ActionTypes.UPDATE_SETTINGS_RIGHTS,
  uuid,
  value,
});

export const requestFetchProductsSettings = () => ({
  type: ActionTypes.FETCH_SETTINGS_PRODUCTS_REQUEST,
});

export const setSelectedProductGroups = (data) => ({
  type: ActionTypes.SET_SELECTED_PRODUCT_GROUPS,
  data,
});

export const deleteProductGroup = (data) => ({
  type: ActionTypes.DELETE_SETTINGS_PRODUCT_GROUP,
  data,
});

export const deleteProductType = (data) => ({
  type: ActionTypes.DELETE_SETTINGS_PRODUCT_TYPE,
  data,
});

export const deleteProductItem = (data) => ({
  type: ActionTypes.DELETE_SETTINGS_PRODUCT_ITEM,
  data,
});

export const setSelectedProductTypes = (data) => ({
  type: ActionTypes.SET_SELECTED_PRODUCT_TYPES,
  data,
});

export const updateSetting = (name, values) => ({
  type: ActionTypes.UPDATE_SETTING,
  name,
  values,
});

export const updateDisplaySetting = (name, values) => ({
  type: ActionTypes.UPDATE_DISPLAY_SETTING,
  name,
  values,
});

export const updatePeriodFilter = (overviewType, value) => ({
  type: ActionTypes.UPDATE_PERIOD_FILTER,
  overviewType,
  value,
});

export const requestUpdateDisplaySetting = () => ({
  type: ActionTypes.REQUEST_UPDATE_DISPLAY_SETTING,
});

export const updateDisplayColumnOrderRow = (name, value) => ({
  type: ActionTypes.UPDATE_DISPLAY_COLUMN_ORDER_ROW,
  name,
  value,
});

export const updateRememberLanguage = (value) => ({
  type: ActionTypes.UPDATE_REMEMBER_LANGUAGE,
  value,
});

export const imageOnCropEnabled = (fakePath, fileData) => {
  return {
    type: ActionTypes.IMAGE_ON_CROP_ENABLED,
    fakePath,
    fileData,
  };
};

export const requestChangePassword = (oldPass, newPass) => ({
  type: ActionTypes.CHANGE_PASSWORD,
  oldPass,
  newPass,
});
export const imageCancelUploadCrop = () => {
  return {
    type: ActionTypes.IMAGE_CANCEL_UPLOAD_CROP,
  };
};

export const imageOnCropChange = (imageData) => {
  return {
    type: ActionTypes.IMAGE_ON_CROP_CHANGE,
    imageData,
  };
};

export const imageSaveUploadCrop = (imageData) => {
  return {
    type: ActionTypes.IMAGE_SAVE_UPLOAD_CROP,
    imageData,
  };
};

export const fetchCompanyInfoRequest = () => {
  return {
    type: ActionTypes.FETCH_COMPANY_INFO_REQUEST,
  };
};
export const fetchCompanyInfoSuccess = (companyInfo) => {
  return {
    type: ActionTypes.FETCH_COMPANY_INFO_SUCCESS,
    companyInfo,
  };
};
export const requestUpdateCompanyInfo = () => {
  return {
    type: ActionTypes.REQUEST_UPDATE_COMPANY_INFO,
  };
};
export const updateCompanyInfo = ({ key, value }) => {
  return {
    type: ActionTypes.UPDATE_COMPANY_INFO,
    key,
    value,
  };
};

// add, update, remove phone & email

export const addPhone = (organisationId, dial) => ({
  type: ActionTypes.ADD_PHONE,
  organisationId,
  dial,
});
export const removePhone = (organisationId, phoneId) => ({
  type: ActionTypes.REMOVE_PHONE,
  organisationId,
  phoneId,
});
export const updatePhone = (organisationId, phoneId, values) => ({
  type: ActionTypes.UPDATE_PHONE,
  organisationId,
  phoneId,
  values,
});
export const addEmail = (organisationId) => ({
  type: ActionTypes.ADD_EMAIL,
  organisationId,
});
export const removeEmail = (organisationId, emailId) => ({
  type: ActionTypes.REMOVE_EMAIL,
  organisationId,
  emailId,
});
export const updateEmail = (organisationId, emailId, values) => ({
  type: ActionTypes.UPDATE_EMAIL,
  organisationId,
  emailId,
  values,
});
export const makePhoneMain = (organisationId, phoneId) => ({
  type: ActionTypes.MAKE_PHONE_MAIN,
  organisationId,
  phoneId,
});
export const makeEmailMain = (organisationId, emailId) => ({
  type: ActionTypes.MAKE_EMAIL_MAIN,
  organisationId,
  emailId,
});
export const requestUpdateMainContact = ({ userId }) => ({
  type: ActionTypes.REQUEST_UPDATE_MAIN_CONTACT,
  userId,
});
export default ActionTypes;

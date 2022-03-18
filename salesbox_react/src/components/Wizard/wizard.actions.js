// @flow

const ActionTypes = {
  // Common
  START: 'wizard/start',

  // Flow 1
  // UI: Stages
  CORP_INFO: 'wizard/corp/info',
  CORP_INFO_PRODUCT: 'wizard/corp/info/product',
  CORP_INFO_LEAD_CLIPPER: 'wizard/corp/info/lead/clipper',
  CORP_FINISH: 'wizard/corp/finish',
  CORP_SAVE_EXIT: 'wizard/corp/save/exit',

  // 1. Your Info (Part 1)
  COMPANY_GET_REQUEST: 'wizard/company/get/request',
  COMPANY_GET_SUCCESS: 'wizard/company/get/success',
  COMPANY_GET_FAIL: 'wizard/company/get/fail',
  COMPANY_UPDATE_REQUEST: 'wizard/company/update/request',
  COMPANY_UPDATE_SUCCESS: 'wizard/company/update/success',
  COMPANY_UPDATE_FAIL: 'wizard/company/update/fail',

  // 1. Your Info (Part 2)
  // Line of Business
  LINE_OF_BUSINESS_GET_REQUEST: 'wizard/lob/get/request',
  LINE_OF_BUSINESS_GET_SUCCESS: 'wizard/lob/get/success',
  LINE_OF_BUSINESS_GET_FAIL: 'wizard/lob/get/fail',
  LINE_OF_BUSINESS_UPDATE_REQUEST: 'wizard/lob/update/request',
  LINE_OF_BUSINESS_UPDATE_SUCCESS: 'wizard/lob/update/success',
  LINE_OF_BUSINESS_UPDATE_FAIL: 'wizard/lob/update/fail',

  // Measurement
  MEASUREMENT_GET_REQUEST: 'wizard/measurement/get/request',
  MEASUREMENT_GET_SUCCESS: 'wizard/measurement/get/success',
  MEASUREMENT_GET_FAIL: 'wizard/measurement/get/fail',
  MEASUREMENT_UPDATE_REQUEST: 'wizard/measurement/update/request',
  MEASUREMENT_UPDATE_SUCCESS: 'wizard/measurement/update/success',
  MEASUREMENT_UPDATE_FAIL: 'wizard/measurement/update/fail',

  // Avatar by Id (Corp)
  USER_UPDATE_AVATAR_ID_REQUEST: 'wizard/user/update/avatar/id/request',
  USER_UPDATE_AVATAR_ID_SUCCESS: 'wizard/user/update/avatar/id/success',
  USER_UPDATE_AVATAR_ID_FAIL: 'wizard/user/update/avatar/id/fail',

  // Product
  PRODUCT_GET_REQUEST: 'wizard/product/get/request',
  PRODUCT_GET_SUCCESS: 'wizard/product/get/success',
  PRODUCT_GET_FAIL: 'wizard/product/get/fail',
  PRODUCT_UPDATE_REQUEST: 'wizard/product/update/request',
  PRODUCT_UPDATE_SUCCESS: 'wizard/product/update/success',
  PRODUCT_UPDATE_FAIL: 'wizard/product/update/fail',

  // Install LeadClipper
  // Blank

  // Great Job (Final Step)
  UPDATE_FINISHED_REQUEST: 'wizard/updateFinished/request',
  UPDATE_FINISHED_SUCCESS: 'wizard/updateFinished/success',
  UPDATE_FINISHED_FAIL: 'wizard/updateFinished/fail',

  PERSONAL_UPDATE_FINISHED_REQUEST: 'wizard/personal/updateFinished/request',
  PERSONAL_UPDATE_FINISHED_SUCCESS: 'wizard/personal/updateFinished/success',
  PERSONAL_UPDATE_FINISHED_FAIL: 'wizard/personal/updateFinished/fail',

  // Image Upload.
  // UI & Crop
  IMAGE_ON_CROP_ENABLED: 'wizard/upload/image/crop/enabled',
  IMAGE_ON_SCALE: 'wizard/upload/image/scale',
  IMAGE_ON_CROP_CHANGE: 'wizard/upload/image/crop/change',
  IMAGE_CANCEL_UPLOAD_CROP: 'wizard/upload/image/cancel/crop',
  IMAGE_SAVE_UPLOAD_CROP: 'wizard/upload/image/save/crop',

  // API
  CORP_IMAGE_UPDATE_PHOTO_AVATAR_REQUEST: 'wizard/corp/upload/photo/avatar/request',
  CORP_IMAGE_UPDATE_PHOTO_AVATAR_SUCCESS: 'wizard/corp/upload/photo/avatar/success',
  CORP_IMAGE_UPDATE_PHOTO_AVATAR_FAIL: 'wizard/corp/upload/photo/avatar/fail',

  CORP_2_IMAGE_UPDATE_PHOTO_AVATAR_REQUEST: 'wizard/corp/2/upload/photo/avatar/request',
  CORP_2_IMAGE_UPDATE_PHOTO_AVATAR_SUCCESS: 'wizard/corp/2/upload/photo/avatar/success',
  CORP_2_IMAGE_UPDATE_PHOTO_AVATAR_FAIL: 'wizard/corp/2/upload/photo/avatar/fail',

  PERSONAL_IMAGE_UPDATE_PHOTO_AVATAR_REQUEST: 'wizard/personal/upload/photo/avatar/request',
  PERSONAL_IMAGE_UPDATE_PHOTO_AVATAR_SUCCESS: 'wizard/personal/upload/photo/avatar/success',
  PERSONAL_IMAGE_UPDATE_PHOTO_AVATAR_FAIL: 'wizard/personal/upload/photo/avatar/fail',

  // Avatar by Id (Personal)
  USER_2_UPDATE_AVATAR_ID_REQUEST: 'wizard/user/2/update/avatar/id/request',
  USER_2_UPDATE_AVATAR_ID_SUCCESS: 'wizard/user/2/update/avatar/id/success',
  USER_2_UPDATE_AVATAR_ID_FAIL: 'wizard/user/2/update/avatar/id/fail',

  // Flow 2
  // UI: Stages
  PERSONAL_INFO_PASS: 'wizard/personal/info/pass',
  PERSONAL_INFO_LEAD_CLIPPER: 'wizard/personal/info/lead/clipper',
  PERSONAL_FINISH: 'wizard/personal/finish',

  // Change Password
  CHANGE_PASSWORD_NEW_REQUEST: 'wizard/change/password/new/request',
  CHANGE_PASSWORD_NEW_SUCCESS: 'wizard/change/password/new/success',
  CHANGE_PASSWORD_NEW_FAIL: 'wizard/change/password/new/fail',

  // Common
  ENABLE_FORCE_LOGOUT: 'wizard/force/logout/enable',
};

// Common
export const welcomeStart = (isMainContact: boolean) => ({
  type: ActionTypes.START,
  isMainContact,
});
export const enableForceLogout = () => ({
  type: ActionTypes.ENABLE_FORCE_LOGOUT,
});

// Flow 1 - Corporation
// UI: Stages
export const welcomeCorpInfo = () => ({
  type: ActionTypes.CORP_INFO,
});
export const welcomeCorpInfoProduct = () => ({
  type: ActionTypes.CORP_INFO_PRODUCT,
});
export const welcomeCorpInfoLeadClipper = () => ({
  type: ActionTypes.CORP_INFO_LEAD_CLIPPER,
});
export const welcomeCorpFinish = () => ({
  type: ActionTypes.CORP_FINISH,
});

// 1. Your Info (Part 1)
export const companyGetRequest = () => ({
  type: ActionTypes.COMPANY_GET_REQUEST,
});
export const companyGetSuccess = (values: {}) => ({
  type: ActionTypes.COMPANY_GET_SUCCESS,
  values,
});
export const companyUpdateRequest = (name: string, size: string) => ({
  type: ActionTypes.COMPANY_UPDATE_REQUEST,
  name,
  size,
});
export const companyUpdateSuccess = (values: {}) => ({
  type: ActionTypes.COMPANY_UPDATE_SUCCESS,
  values,
});

// 1. Your Info (Part 2)
export const lineOfBusinessGetRequest = () => ({
  type: ActionTypes.LINE_OF_BUSINESS_GET_REQUEST,
});
export const lineOfBusinessGetSuccess = (values: {}) => ({
  type: ActionTypes.LINE_OF_BUSINESS_GET_SUCCESS,
  values,
});
export const measurementGetRequest = () => ({
  type: ActionTypes.MEASUREMENT_GET_REQUEST,
});
export const productGetRequest = () => ({
  type: ActionTypes.PRODUCT_GET_REQUEST,
});
export const lineOfBusinessUpdateRequest = (name: string) => ({
  type: ActionTypes.LINE_OF_BUSINESS_UPDATE_REQUEST,
  name,
});
export const lineOfBusinessUpdateSuccess = (values: {}) => ({
  type: ActionTypes.LINE_OF_BUSINESS_UPDATE_SUCCESS,
  values,
});
export const measurementUpdateRequest = (name: string) => ({
  type: ActionTypes.MEASUREMENT_UPDATE_REQUEST,
  name,
});
export const measurementUpdateSuccess = (values: {}) => ({
  type: ActionTypes.MEASUREMENT_UPDATE_SUCCESS,
  values,
});
export const userUpdateAvatarIdRequest = () => ({
  type: ActionTypes.USER_UPDATE_AVATAR_ID_REQUEST,
});
export const userUpdateAvatarIdSuccess = () => ({
  type: ActionTypes.USER_UPDATE_AVATAR_ID_SUCCESS,
});
export const productUpdateRequest = (name: string) => ({
  type: ActionTypes.PRODUCT_UPDATE_REQUEST,
  name,
});
export const productUpdateSuccess = (values: {}) => ({
  type: ActionTypes.PRODUCT_UPDATE_SUCCESS,
  values,
});

// 2. Install LeadClipper

// Great Job
export const updateFinishedRequest = () => ({
  type: ActionTypes.UPDATE_FINISHED_REQUEST,
});

// Image Upload.
export const imageOnCropEnabled = (fakePath: string, fileData: any) => ({
  type: ActionTypes.IMAGE_ON_CROP_ENABLED,
  fakePath,
  fileData,
});
export const imageOnScale = (scale: number) => ({
  type: ActionTypes.IMAGE_ON_SCALE,
  scale,
});
export const imageOnCropChange = (imageData: any) => ({
  type: ActionTypes.IMAGE_ON_CROP_CHANGE,
  imageData,
});
export const imageCancelUploadCrop = () => ({
  type: ActionTypes.IMAGE_CANCEL_UPLOAD_CROP,
});
export const imageSaveUploadCrop = () => ({
  type: ActionTypes.IMAGE_SAVE_UPLOAD_CROP,
});
export const corpImageUpdatePhotoAvatarRequest = (name: string, size: string) => ({
  type: ActionTypes.CORP_IMAGE_UPDATE_PHOTO_AVATAR_REQUEST,
  name,
  size,
});
export const corpImageUpdatePhotoAvatarSuccess = (values: any) => ({
  type: ActionTypes.CORP_IMAGE_UPDATE_PHOTO_AVATAR_SUCCESS,
  values,
});

// Corp: Personal Image
export const corp2ImageUpdatePhotoAvatarRequest = (name: string) => ({
  type: ActionTypes.CORP_2_IMAGE_UPDATE_PHOTO_AVATAR_REQUEST,
  name,
});
export const corp2ImageUpdatePhotoAvatarSuccess = (values: any) => ({
  type: ActionTypes.CORP_2_IMAGE_UPDATE_PHOTO_AVATAR_SUCCESS,
  values,
});

export const personalImageUpdatePhotoAvatarRequest = (password: string) => ({
  type: ActionTypes.PERSONAL_IMAGE_UPDATE_PHOTO_AVATAR_REQUEST,
  password,
});
export const personalImageUpdatePhotoAvatarSuccess = () => ({
  type: ActionTypes.PERSONAL_IMAGE_UPDATE_PHOTO_AVATAR_SUCCESS,
});
export const user2UpdateAvatarIdRequest = () => ({
  type: ActionTypes.USER_2_UPDATE_AVATAR_ID_REQUEST,
});
export const user2UpdateAvatarIdSuccess = () => ({
  type: ActionTypes.USER_2_UPDATE_AVATAR_ID_SUCCESS,
});

// Flow 2 - Personal
// UI: Stages
export const welcomePersonalInfo = () => ({
  type: ActionTypes.PERSONAL_INFO_PASS,
});
export const welcomePersonalInfoLeadClipper = () => ({
  type: ActionTypes.PERSONAL_INFO_LEAD_CLIPPER,
});
export const welcomePersonalFinish = () => ({
  type: ActionTypes.PERSONAL_FINISH,
});

// Change Password
export const changePasswordNewRequest = (password: string) => ({
  type: ActionTypes.CHANGE_PASSWORD_NEW_REQUEST,
  password,
});
export const changePasswordNewSuccess = () => ({
  type: ActionTypes.CHANGE_PASSWORD_NEW_SUCCESS,
});

// Great Job
export const personalUpdateFinishedRequest = () => ({
  type: ActionTypes.PERSONAL_UPDATE_FINISHED_REQUEST,
});

export default ActionTypes;

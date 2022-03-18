// @flow
import createReducer from 'store/createReducer';
import WizardActionTypes from './wizard.actions';

export const initialState = {
  corporation: {
    step: 1, // 1. Welcome, 2: Company, 3: Great Job
    tab: 0, // 0. Your Info, 1. Install LeadClipper
    info: 1, // Company: 1. Name + Size, 2. Product Name
    company: {},
    inWizard: {
      lineOfBusiness: {},
      measurement: {},
      product: {},
    },
    avatarId: null,
    personalAvatarId: null,
  },
  personal: {
    step: 1, // 1. Welcome, 2: Personal, 3: Great Job
    tab: 0, // 0. Your Info, 1. Install LeadClipper
    avatarId: null,
  },
  __UPLOAD: {
    imageCropScale: 1.2,
    cropEnabled: false,
    fileFakePath: '',
    fileData: null, // Originally.
    dataURL: null, // Binary after crop.
  },
  forceLogout: false,
};

// Flow 1: Corporation
const handleCompanyGetSuccess = (draft, action) => {
  draft.corporation.company = action.values;
};
const handleCompanyUpdateSuccess = (draft, action) => {
  draft.corporation.company = action.values;
};
const handleLineOfBusinessGetSuccess = (draft, action) => {
  draft.corporation.inWizard.lineOfBusiness = action.values;
};
const handleLineOfBusinessUpdateSuccess = (draft, action) => {
  draft.corporation.inWizard.lineOfBusiness = action.values;
};
const handleMeasurementGetSuccess = (draft, action) => {
  draft.corporation.inWizard.measurement = action.values;
};
const handleMeasurementUpdateSuccess = (draft, action) => {
  draft.corporation.inWizard.measurement = action.values;
};
const handleProductGetSuccess = (draft, action) => {
  draft.corporation.inWizard.product = action.values;
};
const handleProductUpdateSuccess = (draft, action) => {
  draft.corporation.inWizard.product = action.values;
};

// Image Crop
const handleImageOnCropEnabled = (draft, action) => {
  draft.__UPLOAD.cropEnabled = true;
  draft.__UPLOAD.fileFakePath = action.fakePath;
  draft.__UPLOAD.fileData = action.fileData;
};
const handleImageOnCropChange = (draft, action) => {
  draft.__UPLOAD.dataURL = action.imageData;
};
const handleImageOnScale = (draft, action) => {
  draft.__UPLOAD.imageCropScale = action.scale;
};
const handleImageCancelUploadCrop = (draft, action) => {
  draft.__UPLOAD.cropEnabled = false;
  draft.__UPLOAD.fileFakePath = '';
  draft.__UPLOAD.fileData = null;
  draft.__UPLOAD.imageData = null;
  draft.__UPLOAD.dataURL = null;
};
const handleImageSaveUploadCrop = (draft, action) => {
  draft.__UPLOAD.cropEnabled = false;
};

// Corp: Step - Save Name
const handleImageUpdatePhotoAvatarSuccess = (draft, action) => {
  draft.__UPLOAD.cropEnabled = false;
  draft.__UPLOAD.fileFakePath = '';
  draft.__UPLOAD.fileData = null;
  draft.__UPLOAD.imageData = null;
  draft.__UPLOAD.dataURL = null;
  draft.corporation.avatarId = action.values.avatar;
};

const handle2ImageUpdatePhotoAvatarSuccess = (draft, action) => {
  draft.corporation.personalAvatarId = action.values.avatar;
};

const handlePersonalImageUpdatePhotoAvatarSuccess = (draft, action) => {
  draft.personal.avatarId = action.values.avatar;
};

// Common
const enableForceLogout = (draft, action) => {
  draft.forceLogout = true;
};

// Flow 2: Personal
export default createReducer(initialState, {
  // Common
  [WizardActionTypes.START]: (draft, action) => {
    draft.forceLogout = false;

    // Corp
    if (action.isMainContact) {
      draft.corporation.step = 1;
      draft.corporation.tab = 0;
      draft.corporation.info = 1;
      // Personal
    } else {
      draft.personal.step = 1;
      draft.personal.tab = 0;
    }
  },
  [WizardActionTypes.ENABLE_FORCE_LOGOUT]: enableForceLogout,

  // Flow 1: Corporation
  // UI: Stages
  [WizardActionTypes.CORP_INFO]: (draft, action) => {
    draft.corporation.step = 2;
    draft.corporation.tab = 0;
    draft.corporation.info = 1;
  },
  [WizardActionTypes.CORP_INFO_PRODUCT]: (draft, action) => {
    draft.corporation.tab = 0;
    draft.corporation.info = 2;
  },
  [WizardActionTypes.CORP_INFO_LEAD_CLIPPER]: (draft, action) => {
    draft.corporation.tab = 1;
    draft.corporation.info = 0;
  },
  [WizardActionTypes.CORP_FINISH]: (draft, action) => {
    draft.corporation.step = 3;
  },
  [WizardActionTypes.CORP_SAVE_EXIT]: (draft, action) => {
    draft.corporation.step = 0;
  },

  // 1. Your Info
  [WizardActionTypes.COMPANY_GET_SUCCESS]: handleCompanyGetSuccess,
  [WizardActionTypes.COMPANY_UPDATE_SUCCESS]: handleCompanyUpdateSuccess,
  [WizardActionTypes.LINE_OF_BUSINESS_GET_SUCCESS]: handleLineOfBusinessGetSuccess,
  [WizardActionTypes.LINE_OF_BUSINESS_UPDATE_SUCCESS]: handleLineOfBusinessUpdateSuccess,
  [WizardActionTypes.MEASUREMENT_GET_SUCCESS]: handleMeasurementGetSuccess,
  [WizardActionTypes.MEASUREMENT_UPDATE_SUCCESS]: handleMeasurementUpdateSuccess,
  [WizardActionTypes.PRODUCT_GET_SUCCESS]: handleProductGetSuccess,
  [WizardActionTypes.PRODUCT_UPDATE_SUCCESS]: handleProductUpdateSuccess,

  // Image Upload
  [WizardActionTypes.IMAGE_ON_SCALE]: handleImageOnScale,
  [WizardActionTypes.IMAGE_ON_CROP_ENABLED]: handleImageOnCropEnabled,
  [WizardActionTypes.IMAGE_ON_CROP_CHANGE]: handleImageOnCropChange,
  [WizardActionTypes.IMAGE_CANCEL_UPLOAD_CROP]: handleImageCancelUploadCrop,
  [WizardActionTypes.IMAGE_SAVE_UPLOAD_CROP]: handleImageSaveUploadCrop,

  [WizardActionTypes.CORP_IMAGE_UPDATE_PHOTO_AVATAR_SUCCESS]: handleImageUpdatePhotoAvatarSuccess,
  [WizardActionTypes.CORP_2_IMAGE_UPDATE_PHOTO_AVATAR_SUCCESS]: handle2ImageUpdatePhotoAvatarSuccess,
  [WizardActionTypes.PERSONAL_IMAGE_UPDATE_PHOTO_AVATAR_SUCCESS]: handlePersonalImageUpdatePhotoAvatarSuccess,

  // Flow 2: Personal
  // UI: Stages
  [WizardActionTypes.PERSONAL_INFO_PASS]: (draft, action) => {
    draft.personal.step = 2;
    draft.personal.tab = 0;
  },
  [WizardActionTypes.PERSONAL_INFO_LEAD_CLIPPER]: (draft, action) => {
    draft.personal.tab = 1;
  },
  [WizardActionTypes.PERSONAL_FINISH]: (draft, action) => {
    draft.personal.step = 3;
  },
  [WizardActionTypes.PERSONAL_SAVE_EXIT]: (draft, action) => {
    draft.personal.step = 0;
  },
});

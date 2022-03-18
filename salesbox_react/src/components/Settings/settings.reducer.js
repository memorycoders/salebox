// @flow
import createReducer from 'store/createReducer';
import SettingsActions from 'components/Settings/settings.actions';
import { ObjectTypes, PhoneContactTypes, EmailContactTypes } from '../../Constants';
import AuthActionTypes from '../Auth/auth.actions';

export const initialState = {
  display: {},
  targets: {
    listByYear: { budgetDTOList: [], unitDTOList: [] },
    activity: { budgetActivityDTOList: [] },
    listTargetByYear: { revenueDTOList: [], unitDTOList: [] },
  },
  rights: { productDTOList: [] },
  products: {
    productDTOList: [],
    lineOfBusinessDTOList: [],
    measurementTypeDTOList: [],
    selectedProductGroups: [],
    selectedProductTypes: [],
  },
  customField: { customFieldDTOList: [], objectType: 'ACCOUNT' },
  __UPLOAD: {
    imageCropScale: 1.2,
    cropEnabled: false,
    fileFakePath: '',
    fileData: null,
    dataURL: null,
  },
  companyInfo: {},
};

export default createReducer(initialState, {
  [AuthActionTypes.LOGOUT]: (draft) => {
    Object.keys(draft).forEach((id) => delete draft[id]);
  },
  [SettingsActions.FETCH_DISPLAY_SETTINGS]: (draft, { data }) => {
    draft.display = draft.display || {};
    Object.keys(data).forEach((name) => {
      draft.display[name] = data[name];

      if (name === 'recruitment' && data[name] === null) {
        draft.display[name] = {
          collapseMenu: null,
          defaultView: 'CandidateActive',
          display: true,
          endDate: null,
          startDate: null,
          timeFilterType: 'ALL',
          viewList: [
            {
              name:'CandidateActive',
              selected: true
            },
            {
              name:'CandidateClosed',
              selected: false
            }
          ]
        };
      } else if((name === 'candidateActive' || name === 'candidateClose') && data[name] === null) {
        draft.display[name] = {
          collapseMenu: null,
          defaultView: null,
          display: true,
          endDate: null,
          startDate: null,
          timeFilterType: 'ALL',
        }

      } else if (name !== 'recruitment' && data[name] === null) {
        draft.display[name] = {
          collapseMenu: null,
          defaultView: 'Details',
          display: true,
          endDate: null,
          startDate: null,
          timeFilterType: 'ALL',
        };
      }
    });
  },
  [SettingsActions.UPDATE]: (draft, { name, values }) => {
    draft[name] = {
      ...draft[name],
      ...values,
    };
  },
  [SettingsActions.UPDATE_DISPLAY_SETTING]: (draft, { name, values }) => {
    draft.display = draft.display || {};
    Object.keys(values).forEach((key) => {
      draft.display[name][key] = values[key];
    });
  },
  [SettingsActions.UPDATE_PERIOD_FILTER]: (draft, { overviewType, value }) => {
    console.log('-----------', overviewType, value);
    let key = '';
    switch (overviewType) {
      case ObjectTypes.Task:
        key = 'tasks';
        break;
      case ObjectTypes.Appointment:
        key = 'appointments';
        break;
      case ObjectTypes.PipelineLead:
        key = 'leads';
        break;
      case ObjectTypes.PipelineQualified:
        key = 'pipeline';
        break;
      // case ObjectTypes.PipelineOrder:
      //   key = ''
      case ObjectTypes.Insight.Activity:
        key = 'insights';
        break;
      case ObjectTypes.Delegation:
        key = 'delegation';
        break;
      case ObjectTypes.DelegationLead:
        key = 'delegationLead';
        break;
      case ObjectTypes.PipelineOrder:
        key = 'pipelineOrder';
        break;
      case ObjectTypes.RecruitmentClosed:
        key = 'candidateClose';
        break;
    }
    if (key !== '') {
      draft.display[key] = draft.display[key] || {};
      draft.display[key].timeFilterType = value.toUpperCase();
    }
  },
  [SettingsActions.IMAGE_ON_CROP_ENABLED]: (draft, action) => {
    if (!draft.__UPLOAD) {
      draft.__UPLOAD = {
        imageCropScale: 1.2,
        cropEnabled: false,
        fileFakePath: '',
        fileData: null,
        dataURL: null,
      };
    }
    draft.__UPLOAD.cropEnabled = true;
    draft.__UPLOAD.fileFakePath = action.fakePath;
    draft.__UPLOAD.fileData = action.fileData;
  },
  [SettingsActions.IMAGE_CANCEL_UPLOAD_CROP]: (draft) => {
    draft.__UPLOAD.cropEnabled = false;
    draft.__UPLOAD.fileFakePath = '';
    draft.__UPLOAD.fileData = null;
    draft.__UPLOAD.imageData = null;
    draft.__UPLOAD.dataURL = null;
  },
  [SettingsActions.IMAGE_ON_CROP_CHANGE]: (draft, action) => {
    draft.__UPLOAD.dataURL = action.imageData;
  },
  [SettingsActions.IMAGE_SAVE_UPLOAD_CROP]: (draft, action) => {
    draft.__UPLOAD.dataURL = action.imageData;
    draft.__UPLOAD.cropEnabled = false;
  },
  [SettingsActions.FETCH_TARGETS_SETTINGS]: (draft, { data }) => {
    draft.targets = data;
  },
  [SettingsActions.UPDATE_TARGETS_LISTBYYEAR_SETTINGS]: (draft, { userId, value }) => {
    const findIndex = draft.targets.listByYear.budgetDTOList.findIndex((i) => i.userId === userId);
    if (findIndex !== -1) draft.targets.listByYear.budgetDTOList[findIndex] = value;
  },
  [SettingsActions.UPDATE_TARGETS_ACTIVITY_SETTINGS]: (draft, { userId, value }) => {
    const findIndex = draft.targets.activity.budgetActivityDTOList.findIndex((i) => i.userId === userId);
    if (findIndex !== -1) draft.targets.activity.budgetActivityDTOList[findIndex] = value;
  },
  [SettingsActions.FETCH_SETTINGS_RIGHTS]: (draft, { data }) => {
    draft.rights = data;
  },
  [SettingsActions.FETCH_SETTINGS_PRODUCTS]: (draft, { data }) => {
    draft.products = {
      productDTOList: data.products.productDTOList,
      lineOfBusinessDTOList: data.productGroups.lineOfBusinessDTOList,
      measurementTypeDTOList: data.productTypes.measurementTypeDTOList,
      selectedProductGroups: [],
      selectedProductTypes: [],
    };
  },
  [SettingsActions.SET_SELECTED_PRODUCT_GROUPS]: (draft, { data }) => {
    draft.products.selectedProductGroups = data;
  },
  [SettingsActions.SET_SELECTED_PRODUCT_TYPES]: (draft, { data }) => {
    draft.products.selectedProductTypes = data;
  },
  [SettingsActions.UPDATE_SETTINGS_RIGHTS]: (draft, { uuid, value }) => {
    const findIndex = draft.rights.rightDTOList.findIndex((i) => i.uuid === uuid);
    if (findIndex !== -1) draft.rights.rightDTOList[findIndex] = value;
  },
  [SettingsActions.FETCH_CUSTOM_FIELDS_SETTINGS]: (draft, { data }) => {
    if (draft.customField) {
      draft.customField.customFieldDTOList = data.customFieldDTOList;
      draft.customField.dateTimeFormatDTOList = data.dateTimeFormatDTOList;
    } else {
      draft.customField = data;
    }
  },
  [SettingsActions.UPDATE_CUSTOM_FIELDS_SETTINGS]: (draft, { value }) => {
    draft.customField.customFieldDTOList = value;
  },
  [SettingsActions.UPDATE_OBJECT_TYPE_CUSTOM_FIELDS_SETTING]: (draft, { objectType }) => {
    if (draft.customField) {
      draft.customField.objectType = objectType;
    } else {
      draft.customField = { objectType };
    }
  },
  [SettingsActions.UPDATE_FIELD_NAME_CUSTOM_FIELD]: (draft, { customFieldId, value }) => {
    const findIndex = draft.customField.customFieldDTOList.findIndex((i) => i.uuid === customFieldId);
    if (findIndex !== -1) draft.customField.customFieldDTOList[findIndex].title = value;
  },
  [SettingsActions.UPDATE_ITEM_CUSTOM_FIELD]: (draft, { customFieldId, value }) => {
    const findIndex = draft.customField.customFieldDTOList.findIndex((i) => i.uuid === customFieldId);
    if (findIndex !== -1) draft.customField.customFieldDTOList[findIndex] = value;
  },
  [SettingsActions.FETCH_ORGANISATION_SETTINGS]: (draft, { value }) => {
    draft.organisation = value;
  },
  [SettingsActions.UPDATE_LIST_ORGANISATION_SETTINGS]: (draft, { value }) => {
    draft.organisation.unitDTOList = value;
  },
  [SettingsActions.FETCH_COMPANY_INFO_SUCCESS]: (draft, { companyInfo }) => {
    if (!draft.companyInfo) {
      draft.companyInfo = {};
    }
    draft.companyInfo = companyInfo;
  },
  [SettingsActions.UPDATE_COMPANY_INFO]: (draft, { key, value }) => {
    draft.companyInfo[key] = value;
  },
  [SettingsActions.ADD_PHONE]: (draft, { organisationId, dial }) => {
    draft[organisationId] = draft[organisationId] || {};
    draft[organisationId].additionalPhoneList = draft[organisationId].additionalPhoneList || [];
    draft[organisationId].additionalPhoneList.push({
      main: draft[organisationId].additionalPhoneList.length === 0,
      value: dial ? `+${dial}` : '',
      type: PhoneContactTypes.Subsidiary,
    });
  },
  [SettingsActions.REMOVE_PHONE]: (draft, { organisationId, phoneId }) => {
    let wasMain;
    draft[organisationId].additionalPhoneList = draft[organisationId].additionalPhoneList.filter((phone) => {
      if (phone.main) wasMain = true;
      return phone.uuid !== phoneId;
    });
    if (wasMain && draft[organisationId].additionalPhoneList[0]) {
      draft[organisationId].additionalPhoneList[0].main = true;
    }
  },
  [SettingsActions.MAKE_PHONE_MAIN]: (draft, { organisationId, phoneId }) => {
    draft[organisationId].additionalPhoneList = draft[organisationId].additionalPhoneList.map((phone) => {
      if (phone.uuid === phoneId) {
        return {
          ...phone,
          main: true,
        };
      } else if (phone.main) {
        return {
          ...phone,
          main: false,
        };
      }
      return phone;
    });
  },
  [SettingsActions.UPDATE_PHONE]: (draft, { organisationId, phoneId, values }) => {
    draft[organisationId].additionalPhoneList = draft[organisationId].additionalPhoneList.map((phone) => {
      if (phone.uuid === phoneId) {
        return {
          ...phone,
          ...values,
        };
      }
      return phone;
    });
  },
  [SettingsActions.ADD_EMAIL]: (draft, { organisationId }) => {
    draft[organisationId] = draft[organisationId] || {};
    draft[organisationId].additionalEmailList = draft[organisationId].additionalEmailList || [];
    draft[organisationId].additionalEmailList.push({
      main: draft[organisationId].additionalEmailList.length === 0,
      value: '',
      type: EmailContactTypes.Subsidiary,
    });
  },
  [SettingsActions.REMOVE_EMAIL]: (draft, { organisationId, emailId }) => {
    let wasMain;
    draft[organisationId].additionalEmailList = draft[organisationId].additionalEmailList.filter((email) => {
      if (email.main) wasMain = true;
      return email.uuid !== emailId;
    });
    if (wasMain && draft[organisationId].additionalEmailList[0]) {
      draft[organisationId].additionalEmailList[0].main = true;
    }
  },
  [SettingsActions.MAKE_EMAIL_MAIN]: (draft, { organisationId, emailId }) => {
    draft[organisationId].additionalEmailList = draft[organisationId].additionalEmailList.map((email) => {
      if (email.uuid === emailId) {
        return {
          ...email,
          main: true,
        };
      } else if (email.main) {
        return {
          ...email,
          main: false,
        };
      }
      return email;
    });
  },
  [SettingsActions.UPDATE_EMAIL]: (draft, { organisationId, emailId, values }) => {
    const oldObject = draft[organisationId].additionalEmailList.find((value) => value.uuid === emailId);
    draft[organisationId].additionalEmailList = draft[organisationId].additionalEmailList.map((email) => {
      if (email.uuid === emailId) {
        return {
          ...email,
          ...values,
        };
      }
      return email;
    });
  },
  [SettingsActions.ADD_CF_SETTING_LOCAL]: (draft, { res }) => {
    console.log('----------------------------', res);
    draft.customField?.customFieldDTOList?.push(res);
  },
  [SettingsActions.UPDATE_SELECTED_CASE_IN_RECRUITMENT]: (draft, {screen, value}) => {
    draft.display[screen].defaultView = value;
  }
});

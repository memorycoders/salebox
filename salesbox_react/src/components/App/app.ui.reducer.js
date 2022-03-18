// @flow
/* eslint-disable no-param-reassign */
import createReducer from 'store/createReducer';
import AppActionTypes from 'components/App/app.actions';
import AuthActionTypes from 'components/Auth/auth.actions';
import OverviewActionTypes from 'components/Overview/overview.actions';
//reload new lang
import {selectNone} from '../../lib/addNone'
import _l from 'lib/i18n';
import { iconMoney } from '../../Constants';

export const defaultSections = {
  taskSections: ["FocusPane", "CustomFieldPane", "CreateNotePane", "ProspectPane", "CreatorPane"],
  appointmentSections: ["CustomFieldPane", "FocusPane", "CreateNotePane", "InviteeList", "ProspectPane", "CreatorPane"],

  qualifiedSections: ["CustomFieldsPane", "CreatorQualifiedPane", "ContactQualifiedPane"],
  leadSections: ["CustomFieldsPane", "InterestInPane", "ContentPaneGlobal", "CreatorPane", "CreatorMailChimp"],

  accountSections: ["CustomFieldsPane", "LatestCommunicationPane", "SalesPane", "AccountTargetPane", "CallListPane", "MultiRelationsPane", "ContactTeamPane"],
  contactSections: ["CustomFieldsPane", "LatestCommunicationPane", "SalesPane", "CallListPane", "MultiRelationsPane", "ContactTeamPane"],
}

export const initialState = {
  drawerShown: false,
  loading: true,
  helpMode: 'OFF',
  locale: 'en',
  seed: Math.random(),
  averageValuesFetched: false,
  averageValues: {
    closeMargin: 0,
    closedProfit: 0,
    closedSales: 0,
    medianDealSize: 0,
    medianDealTime: 0,
  },
  roleTab: 'person',
  roleType: 'Person',
  activeRole: null,
  activeOverview: null,
  currency: null,
  detailSectionsDisplay: defaultSections
};

export default createReducer(initialState, {
  [AuthActionTypes.LOGOUT]: (draft) => {
    Object.keys(initialState).forEach((key) => {
      if(key!='locale')
      draft[key] = initialState[key];
    });
    draft.loading = false;
  },
  [OverviewActionTypes.FETCH_SUCCESS]: (draft, { overviewType }) => {
    draft.activeOverview = overviewType;
  },
  [AppActionTypes.SHOW_DRAWER]: (draft) => {
    draft.drawerShown = true;
  },
  [AppActionTypes.REDRAW]: (draft) => {
    draft.seed = Math.random();
  },
  [AppActionTypes.FINISH_LOADING]: (draft) => {
    draft.loading = false;
  },
  [AppActionTypes.SET_HELP_MODE]: (draft, { helpMode }) => {
    draft.helpMode = helpMode;
  },
  [AppActionTypes.SET_LOCALE]: (draft, { locale }) => {
    draft.locale = locale;
  },
  [AppActionTypes.HIDE_DRAWER]: (draft) => {
    draft.drawerShown = false;
  },
  [AppActionTypes.TOGGLE_DRAWER]: (draft) => {
    draft.drawerShown = !draft.drawerShown;
  },
  [AppActionTypes.FETCH_AVERAGE_VALUES]: (draft, { averageValues }) => {
    if(averageValues)
    Object.keys(averageValues).forEach((key) => {
      draft.averageValues[key] = averageValues[key];
    });
    draft.averageValuesFetched = true;
  },
  [AppActionTypes.SET_ROLE_TAB]: (draft, { roleTab }) => {
    draft.roleTab = roleTab;
  },
  [AppActionTypes.SET_ACTIVE_ROLE]: (draft, { activeRole, roleType }) => {
    draft.activeRole = activeRole;
    draft.roleType = roleType;
  },
  [AppActionTypes.UPDATE_CURRENCY]: (draft, { currency }) => {
    draft.currency = iconMoney[currency];
  },
  [AppActionTypes.RULE_PACKAGE]: (draft, {enterprisePackageType}) => {
    if (enterprisePackageType != null) {
      let res = enterprisePackageType.split('_');
      draft.rulePackage = res[0];
    }
  },

  //UPDATE_DETAIL_SECTIONS
  [AppActionTypes.UPDATE_DETAIL_SECTIONS]: (draft, { data }) => {
    draft.detailSectionsDisplay = data;
  },

  [AppActionTypes.UPDATE_CATEGORY_DETAIL_SECTIONS]: (draft, { detailType, data }) => {
    draft.detailSectionsDisplay = draft.detailSectionsDisplay || {};
    draft.detailSectionsDisplay[detailType] = data;
  },
  [AppActionTypes.UPDATE_LOCALIZATION_CONST]: (draft) => {
    //reload lang
    selectNone.text = _l`None`;
  },
  [AppActionTypes.UPDATE_LAST_TIME_USED]: (draft) => {
    draft.lastTimeUsed = new Date().getTime();
  },
});

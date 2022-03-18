//@flow
import { call, put, fork, take, cancel, all, select, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import createOverviewSagas from 'components/Overview/overview.saga';
import uuid from 'uuid/v4';
import { organisationList, organisationSchema } from './organisation.schema';
import { organisationDropdownList } from '../OrganisationDropdown/organisationDropdown.schema';
import { contactList, contactSchema } from 'components/Contact/contact.schema';
import { taskList, taskSchem } from 'components/Task/task.schema';

import OrganisationActionTypes, * as OrganisationActions from './organisation.actions';
import OverviewActionsTypes, * as OverviewActions from '../Overview/overview.actions';
import DropdownActionTypes, * as DropdownActions from 'components/Dropdown/dropdown.actions';
import * as NotificationActions from 'components/Notification/notification.actions';

import { getSearch, getSearchForSave } from 'components/AdvancedSearch/advanced-search.selectors';
import { makeGetOrganisation } from 'components/Organisation/organisation.selector';
import { getHighlighted } from 'components/Overview/overview.selectors';

// import type { FetchDropdownT } from './organisation.types';
import { filterLastestComminicationContactSuccess } from '../Contact/contact.actions';
import { debounceTime } from 'config';
import { ObjectTypes, OverviewTypes, Endpoints } from 'Constants';
import { makeGetUser } from '../User/user.selector';
import api from 'lib/apiClient';
import {
  refeshTasks,
  requestFetchNotes,
  updateAppointmentTargetSuccess,
  updateSaleTargetSuccess,
  updateResponsibleOneDealSuccess,
} from './organisation.actions';
import _l from 'lib/i18n';
import { getOverview } from '../Overview/overview.selectors';
import generateUuid from 'uuid/v4';
import { getCustomFieldsObject, getCustomFieldValues } from '../CustomField/custom-field.selectors';
import ActionTypes from '../PipeLineQualifiedDeals/qualifiedDeal.actions';
import { getCurrentTimeZone } from '../../lib/dateTimeService';
import * as CalllistAccountActions from '../../components/CallListAccount/callListAccount.actions';
import { updateDocumentObjectId } from '../Common/common.actions';
import { PAGE_SIZE_SUBLIST } from '../../Constants';
import * as TaskActions from '../Task/task.actions';
import * as QualifiedDealActions from '../PipeLineQualifiedDeals/qualifiedDeal.actions';
import * as UnqualifiedDealActions from '../PipeLineUnqualifiedDeals/unqualifiedDeal.actions';

const organisationEndPoints = 'organisation-v3.0';
const callListEndPoints = 'call-lists-v3.0';
const documentEndPoints = 'document-v3.0';

addTranslations({
  'en-US': {
    Added: 'Added',
    Updated: 'Updated',
  },
});

function* fetchDropdown(name, filter = null): Generator<*, *, *> {
  yield delay(debounceTime);
  try {
    yield put(DropdownActions.startFetch(ObjectTypes.OrganisationDropdown, name));
    const data = yield call(api.post, {
      resource: `${organisationEndPoints}/searchLocal`,
      data: {
        name,
      },
      query: {
        pageIndex: filter && filter.pageIndex ? filter.pageIndex : 0,
        pageSize: 10,
      },
      schema: organisationDropdownList,
    });
    yield put(DropdownActions.succeedFetch(ObjectTypes.OrganisationDropdown, data.entities));
  } catch (e) {
    yield put(DropdownActions.failFetch(ObjectTypes.Account, e.message));
  }
}

// Favourites
function* toggleFavoriteRequest(values: any): Generator<*, *, *> {
  const { organisationId, flag } = values;

  try {
    const data = yield call(api.post, {
      resource: `${organisationEndPoints}/updateFavorite`,
      data: {
        organisationId,
        favorite: flag,
      },
    });

    if (data.organisationId) {
      yield put({
        type: OrganisationActionTypes.FETCH_ORGANISATION_REQUEST,
        organisationId: data.organisationId,
      });

      yield put(OverviewActions.requestFetch(OverviewTypes.Account));
    }
  } catch (e) {
    console.log(e);
  }
}

// DropDown
function* queueDropdownFetch() {
  let task;
  while (true) {
    const { searchTerm, objectType, filter } = yield take(DropdownActionTypes.FETCH_REQUEST);
    if (objectType === ObjectTypes.OrganisationDropdown) {
      if (task) {
        yield cancel(task);
      }
      task = yield fork(fetchDropdown, searchTerm, filter);
    }
  }
}

function* updateCustomField(overviewType, accountId) {
  const state = yield select();
  let overviewT = overviewType;
  let objectT = ObjectTypes.Account;
  let customFilterDeault = 'active';

  const overview = getOverview(state, overviewT);
  const search = getSearch(state, objectT);
  // const period = getPeriod(state, objectT);
  const { searchFieldDTOList } = getSearchForSave(state, objectT);
  // const isFilterAll = period.period === 'all';
  const { roleType } = state.ui.app;
  let ownerId = state.ui.app.activeRole;
  let roleValue = state.ui.app.activeRole;
  if (roleType === 'Person' && !ownerId) {
    ownerId = state.auth.userId;
  } else if (roleType === 'Company') {
    ownerId = undefined;
  }
  if (roleType === 'Person' && !roleValue) {
    roleValue = state.auth.userId;
  } else if (roleType === 'Company') {
    roleValue = undefined;
  }
  const filterDTO = {
    roleFilterType: roleType,
    roleFilterValue: roleValue,
    customFilter: search.filter ? search.filter : customFilterDeault,
    orderBy: search.orderBy ? search.orderBy : 'closedSales',
    // isRequiredOwner: true,
    ftsTerms: search.term,
    searchFieldDTOList: search.shown ? searchFieldDTOList : [],
    // salesProcessIds: [],
    // selectedMark: search.tag,
  };
  let payload = {
    filterDTO,
    isSelectedAll: false,
    organisationIds: [accountId],
    unSelectedIds: [],
    // isProspectActive: isProspectActive,
  };

  try {
    let updatedCustomFieldDTOList = [];
    const customFields = getCustomFieldsObject(state);
    customFields.forEach((customField) => {
      const { customFieldValueDTOList } = customField;
      if (customFieldValueDTOList.length > 0) {
        if (customField.fieldType === 'DROPDOWN') {
          const checkForValueSelected = customFieldValueDTOList.filter((value) => {
            return value.isChecked === true;
          });
          if (checkForValueSelected.length > 0) {
            updatedCustomFieldDTOList.push(customField);
          }
        } else {
          updatedCustomFieldDTOList.push(customField);
        }
      }
    });

    yield call(api.post, {
      resource: `${Endpoints.Organisation}/updateDataField`,
      data: {
        ...payload,
        updatedCustomFieldDTOList: updatedCustomFieldDTOList,
        updatedStandardFieldDTO: {},
      },
      query: {
        timeZone: getCurrentTimeZone(),
      },
    });
  } catch (error) {}
}

// Create - Manual
function* requestCreate({ avatar, acceptAddDuplicate }): Generator<*, *, *> {
  const state = yield select();

  const getOrganisation = makeGetOrganisation();
  const __CREATE = getOrganisation(state, '__CREATE');
  // const __CREATE = state.entities.organisation.__CREATE;
  try {
    const addressType = __CREATE.addressType;
    const payload = {
      // [Company]
      name: __CREATE.name,
      formalName: __CREATE.formalName ? __CREATE.formalName : '',
      vatNumber: __CREATE.vatNumber ? __CREATE.vatNumber : '',
      web: __CREATE.web ? __CREATE.web : '',

      // [General]
      type: __CREATE.type && __CREATE.type.uuid ? __CREATE.type : null,
      industry: __CREATE.industry && __CREATE.industry.uuid ? __CREATE.industry : null,
      size: __CREATE.size && __CREATE.size.uuid ? __CREATE.size : null,

      // [Address]
      // Visiting
      // TODO: Shipping
      // TODO: Billing
      // [Email]
      email: null,
      mainEmailType: null,
      additionalEmailList: (__CREATE.additionalEmailList ? __CREATE.additionalEmailList : []).map((value) => {
        return {
          ...value,
          uuid: uuid(),
        };
      }),

      // [Phone]
      phone: null,
      mainPhoneType: null,
      additionalPhoneList: (__CREATE.additionalPhoneList ? __CREATE.additionalPhoneList : []).map((value) => {
        return {
          ...value,
          uuid: uuid(),
        };
      }),

      // [Others]
      mediaType: 'MANUAL',
      isPrivate: false,
      isChanged: false,
      participantList: (__CREATE.participants ? __CREATE.participants : []).map((v) => {
        const user = state.entities.user[v] || {};
        return {
          sharedPercent: user.sharedPercent,
          lastName: user.lastName,
          discProfile: user.discProfile,
          avatar: user.avatar,
          uuid: user.uuid,
          email: user.email,
          phone: user.phone,
          firstName: user.firstName,
        };
      }),
      numberGoalsMeeting: 0,
      // owner?
    };
    payload.street = __CREATE.street ? __CREATE.street : null;
    payload.zipCode = __CREATE.zipCode ? __CREATE.zipCode : null;
    payload.city = __CREATE.city ? __CREATE.city : null;
    payload.country = __CREATE.country ? __CREATE.country : null;
    payload.state = __CREATE.state ? __CREATE.state : null;
    payload.billingAddress = __CREATE.billingAddress || null;
    payload.shippingAddress = __CREATE.shippingAddress || null;

    if (avatar) {
      payload.avatar = avatar;
    }

    if (__CREATE.additionalEmailList && __CREATE.additionalEmailList.length > 0) {
      const mainEmail = __CREATE.additionalEmailList.find((x) => x.main === true);
      if (mainEmail) {
        payload.email = mainEmail.value;
        payload.mainEmailType = mainEmail.type;
      }
    }

    if (__CREATE.additionalPhoneList && __CREATE.additionalPhoneList.length > 0) {
      const mainPhone = __CREATE.additionalPhoneList.find((x) => x.main === true);
      if (mainPhone) {
        payload.phone = mainPhone.value;
        payload.mainPhoneType = mainPhone.type;
      }
    }
    payload.acceptUpdateDuplicate = acceptAddDuplicate;
    const organisation = yield call(api.post, {
      resource: `${organisationEndPoints}/add`,
      schema: organisationSchema,
      data: payload,
    });
    if (organisation) {
      yield updateCustomField(OverviewTypes.Account, organisation.result);
      yield put(OverviewActions.clearHighlightAction(OverviewTypes.Account));
      yield put(OverviewActions.clearHighlightAction('ACCOUNTS_TEMP'));
      yield put(OrganisationActions.succeedCreate());
      yield put(
        OrganisationActions.succeedFetchOrganisation(organisation.organisationId, { entities: organisation.entities })
      );
      yield put(OverviewActions.requestFetch(OverviewTypes.Account, true));

      yield put(NotificationActions.success(_l`Added`, '', 2000));
      //auto fill to form

      yield put(OrganisationActions.organisationItem({ uuid: organisation.result, name: __CREATE.name }));
      yield put(TaskActions.updateCreateEditEntityAfterAddCompany(organisation.result));
      yield put(QualifiedDealActions.updateCreateEditEntityAfterAddCompany(organisation.result));
      yield put(UnqualifiedDealActions.updateCreateEditEntityAfterAddCompany(organisation.result));
    }
  } catch (e) {
    // yield put(NotificationActions.error(e.message));
    if (e?.errorMessage === 'EXISTED') {
      yield put(OverviewActions.highlight('ACCOUNTS_TEMP', e.additionInfo, 'confirmAddDuplicateAccount'));
      return;
    }
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
    // yield put(OrganisationActions.failFetchOrganisation(organisationId, e.message));
  }
}

// Create - By Search

// Update
function* requestUpdate({ avatar }): Generator<*, *, *> {
  const state = yield select();
  const getOrganisation = makeGetOrganisation();
  const __EDIT = getOrganisation(state, '__EDIT');

  try {
    const addressType = __EDIT.addressType;
    const payload = {
      uuid: __EDIT.uuid,
      // [Company]
      name: __EDIT.name,
      formalName: __EDIT.formalName ? __EDIT.formalName : '',
      vatNumber: __EDIT.vatNumber ? __EDIT.vatNumber : '',
      web: __EDIT.web ? __EDIT.web : '',

      // [General]
      type: __EDIT.type && __EDIT.type.uuid ? __EDIT.type : null,
      industry: __EDIT.industry && __EDIT.industry.uuid ? __EDIT.industry : null,
      size: __EDIT.size && __EDIT.size.uuid ? __EDIT.size : null,

      // [Address]
      // Visiting
      // TODO: Shipping
      // TODO: Billing
      // [Email]
      email: null,
      mainEmailType: null,
      additionalEmailList: (__EDIT.additionalEmailList ? __EDIT.additionalEmailList : []).map((value) => {
        return {
          ...value,
          uuid: uuid(),
        };
      }),

      // [Phone]
      phone: null,
      mainPhoneType: null,
      additionalPhoneList: (__EDIT.additionalPhoneList ? __EDIT.additionalPhoneList : []).map((value) => {
        return {
          ...value,
          uuid: uuid(),
        };
      }),

      // [Others]
      mediaType: 'MANUAL',
      isPrivate: false,
      isChanged: false,
      participantList: __EDIT.participants.map((v) => {
        const user = state.entities.user[v] || {};
        return {
          sharedPercent: user.sharedPercent,
          lastName: user.lastName,
          discProfile: user.discProfile,
          avatar: user.avatar,
          uuid: user.uuid,
          email: user.email,
          phone: user.phone,
          firstName: user.firstName,
        };
      }),
      numberGoalsMeeting: __EDIT.numberGoalsMeeting,
      // owner?
    };
    payload.billingAddress = __EDIT.billingAddress || null;

    payload.street = __EDIT.street ? __EDIT.street : null;
    payload.zipCode = __EDIT.zipCode ? __EDIT.zipCode : null;
    payload.city = __EDIT.city ? __EDIT.city : null;
    payload.country = __EDIT.country ? __EDIT.country : null;
    payload.state = __EDIT.state ? __EDIT.state : null;

    payload.shippingAddress = __EDIT.shippingAddress || null;

    if (avatar) {
      payload.avatar = avatar;
    }

    if (__EDIT.additionalEmailList && __EDIT.additionalEmailList.length > 0) {
      const mainEmail = __EDIT.additionalEmailList.find((x) => x.main === true);
      if (mainEmail) {
        payload.email = mainEmail.value;
        payload.mainEmailType = mainEmail.type;
      }
    }

    if (__EDIT.additionalPhoneList && __EDIT.additionalPhoneList.length > 0) {
      const mainPhone = __EDIT.additionalPhoneList.find((x) => x.main === true);
      if (mainPhone) {
        payload.phone = mainPhone.value;
        payload.mainPhoneType = mainPhone.type;
      }
    }
    const organisation = yield call(api.post, {
      resource: `${organisationEndPoints}/update`,
      schema: organisationSchema,
      data: payload,
    });

    if (organisation) {
      yield put(OverviewActions.clearHighlightAction(OverviewTypes.Account));
      yield put(OverviewActions.clearHighlightAction(OverviewTypes.CallList.SubAccount));
      yield put(OrganisationActions.succeedUpdate());
      const __DETAIL = state.entities.organisation.__DETAIL;
      if (__DETAIL && __DETAIL.uuid === __EDIT.uuid) {
        yield put(OrganisationActions.refreshOrganisation(__EDIT.uuid));
      }
      yield put(OverviewActions.requestFetch(OverviewTypes.Account, true));
      yield put(NotificationActions.success(_l`Updated`, '', 2000));
    }

    yield delay(1000);
    const customFieldValues = getCustomFieldValues(state, __EDIT.uuid);
    yield call(api.post, {
      resource: `enterprise-v3.0/customFieldValue/editList`,
      query: {
        objectId: __EDIT.uuid,
      },
      data: {
        customFieldDTOList: customFieldValues,
      },
    });
  } catch (e) {
    console.log(e);
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
    // yield put(OrganisationActions.failFetchOrganisation(organisationId, e.message));
  }
}

// Deactivate
function* requestDeactivate({ accountId, name }): Generator<*, *, *> {
  try {
    const response = yield call(api.get, {
      resource: `${organisationEndPoints}/deactivate/${accountId}`,
      schema: organisationSchema,
    });

    if (response) {
      yield put(OrganisationActions.succeedDeactivate());
      yield put(OverviewActions.clearHighlightAction(OverviewTypes.Account));
      yield put(OverviewActions.requestFetch(OverviewTypes.Account, true));
      yield put(NotificationActions.success('Account: ' + name + ' was deactivated successfully'));
    }
  } catch (e) {
    console.log(e);
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}

// Get Detail
function* fetchOrganisation({ organisationId }: FetchTaskT): Generator<*, *, *> {
  const state = yield select();
  try {
    const lastFetch = state.ui.delegation.lastFetch[organisationId] || 0;
    const languageCode = state.ui.app.locale;
    if (lastFetch < Date.now() - 1000) {
      yield put(OrganisationActions.startFetchOrganisation(organisationId));
      const organisation = yield call(api.get, {
        resource: `${organisationEndPoints}/getDetails/${organisationId}`,
        query: {
          languageCode,
        },
      });
      yield put(updateDocumentObjectId(organisationId));
      yield put(OrganisationActions.succeedFetchOrganisation(organisationId, organisation));
    }
    // fetch number document of Deal
    const res = yield call(api.get, {
      resource: `${Endpoints.Document}/document/countByObject`,
      query: {
        objectType: 'ACCOUNT',
        objectId: organisationId,
      },
    });
    yield put(OrganisationActions.updateNumberDocumentDetail(res));
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
    if (e && e.message === 'ORGANISATION_DELETED') {
      yield put(OverviewActions.deleteRowSuccess(OverviewTypes.Account, organisationId));
      yield put(OrganisationActions.failFetchOrganisation(organisationId, e.message));
    }
  }
}
// Get Detail
function* fetchOrganisationToEdit({ organisationId }: FetchTaskT): Generator<*, *, *> {
  const state = yield select();
  try {
    const lastFetch = state.ui.delegation.lastFetch[organisationId] || 0;
    const languageCode = state.ui.app.locale;
    if (lastFetch < Date.now() - 1000) {
      yield put(OrganisationActions.startFetchOrganisation(organisationId));
      const organisation = yield call(api.get, {
        resource: `${organisationEndPoints}/getDetails/${organisationId}`,
        query: {
          languageCode,
        },
      });
      yield put(OrganisationActions.fetchAccountDetailToEditSuccess(organisationId, organisation));
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
    if (e && e.message === 'ORGANISATION_DELETED') {
      yield put(OverviewActions.deleteRowSuccess(OverviewTypes.Account, organisationId));
      yield put(OrganisationActions.failFetchOrganisation(organisationId, e.message));
    }
  }
}
// Card: Contacts
function* fetchContacts({ accountId, orderBy, pageIndex }): Generator<*, *, *> {
  try {
    // yield put(OverviewActions.startFetch(OverviewTypes.Account));

    if (accountId) {
      const state = yield select();
      const search = getSearch(state, ObjectTypes.Account);

      let query = {
        organisationId: accountId,
        customFilter: 'active',
        orderBy,
      };
      console.log('fetchContacts pageIndex: ', pageIndex);
      if (pageIndex != null) {
        query = {
          ...query,
          pageIndex,
          pageSize: PAGE_SIZE_SUBLIST,
        };
      }
      const data = yield call(api.get, {
        resource: `${Endpoints.Contact}/listByOrganisation`,
        schema: contactList,
        query: query,
      });
      yield put(
        OrganisationActions.succeedFetchContacts(accountId, {
          entities: data.entities,
          pageIndex,
        })
      );
    }

    // yield put(OverviewActions.succeedFetch(OverviewTypes.Account, [], false, 0));
  } catch (e) {
    yield put(OrganisationActions.failFetchContacts(accountId, e.message));
  }
}

// Card: Tasks
function* fetchTasks({ accountId, history, tag, orderBy }): Generator<*, *, *> {
  try {
    // yield put(OverviewActions.startFetch(OverviewTypes.Account));
    let query = {
      accountId: accountId,
      orderBy: orderBy, // FIXME: Impl - dateAndTime
      pageIndex: 0,
      pageSize: 45,
      showHistory: history,
    };
    if (tag) {
      query.selectedMark = tag;
    }
    const data = yield call(api.get, {
      resource: `${Endpoints.Task}/listByAccount`,
      schema: taskList,
      query,
    });
    yield put(
      OrganisationActions.succeedFetchTasks(accountId, {
        entities: data.entities,
      })
    );
    // yield put(OverviewActions.succeedFetch(OverviewTypes.Account, [], false, 0));
  } catch (e) {
    console.log(e);
  }
}

//fetchAppointment
function* fetchAppointment({ accountId, history, orderBy }): Generator<*, *, *> {
  try {
    // yield put(OverviewActions.startFetch(OverviewTypes.Account));

    let query = {
      organisationId: accountId, // FIXME: Impl - dateAndTime
      pageIndex: 0,
      pageSize: 45,
      showHistory: history,
      updatedDate: 0,
      orderBy: orderBy,
    };

    const data = yield call(api.get, {
      resource: `appointment-v3.0/syncByOrganisation`,
      query,
    });
    const { appointmentDTOList } = data;
    yield put(OrganisationActions.succeedFetchAppointments(accountId, appointmentDTOList));
    // yield put(OverviewActions.succeedFetch(OverviewTypes.Account, [], false, 0));
  } catch (e) {
    console.log(e);
  }
}

function* fetchUnqualified({ accountId, orderBy }): Generator<*, *, *> {
  try {
    // yield put(OverviewActions.startFetch(OverviewTypes.Account));

    let query = {
      organisationId: accountId,
      orderBy: orderBy,
    };

    const data = yield call(api.get, {
      resource: `lead-v3.0/listByOrganisationAndYear`,
      query,
    });
    const { leadDTOList } = data;
    yield put(OrganisationActions.successFetchAccountUnqualified(accountId, leadDTOList));
    // yield put(OverviewActions.succeedFetch(OverviewTypes.Account, [], false, 0));
  } catch (e) {
    console.log(e);
  }
}
//fetchQualified
function* fetchQualified({ accountId, orderBy }): Generator<*, *, *> {
  try {
    // yield put(OverviewActions.startFetch(OverviewTypes.Account));

    let query = {
      orderBy: orderBy,
    };
    const data = yield call(api.get, {
      resource: `prospect-v3.0/listByOrganisationFull/${accountId}`,
      query,
    });
    const { prospectDTOList } = data;
    yield put(OrganisationActions.successFetchAccountQualified(accountId, prospectDTOList));
    // yield put(OverviewActions.succeedFetch(OverviewTypes.Account, [], false, 0));
  } catch (e) {
    console.log(e);
  }
}

//fetchPhotos
function* fetchPhotosSaga({ accountId }) {
  try {
    // yield put(OverviewActions.startFetch(OverviewTypes.Account));

    const data = yield call(api.get, {
      resource: `${documentEndPoints}/photo/listByOrganisation/${accountId}`,
    });
    if (data) {
      const { uploadDTOList } = data;
      yield put(OrganisationActions.successFetchPhotos(accountId, uploadDTOList));
    }
    // yield put(OverviewActions.succeedFetch(OverviewTypes.Account, [], false, 0));
  } catch (error) {
    yield put(NotificationActions.error(error.message));
  }
}

//fetchOrder
function* fetchOrder({ accountId }): Generator<*, *, *> {
  try {
    // yield put(OverviewActions.startFetch(OverviewTypes.Account));

    const data = yield call(api.get, {
      resource: `prospect-v3.0/listClosedByOrganisationFull/${accountId}`,
    });
    const orderRowDataCount = yield call(api.get, {
      resource: `prospect-v3.0/orderRow/countListByAccount/${accountId}`,
      query: {
        won: true,
      },
    });
    const orderRowData = yield call(api.get, {
      resource: `prospect-v3.0/orderRow/listByAccount/${accountId}`,
      query: {
        won: true,
        pageIndex: 0,
        pageSize: 10,
      },
    });
    const { prospectDTOList } = data;
    const { orderRowDTOList } = orderRowData;
    yield put(
      OrganisationActions.successFetchAccountOrder(accountId, prospectDTOList, orderRowDTOList, orderRowDataCount)
    );
    // yield put(OverviewActions.succeedFetch(OverviewTypes.Account, [], false, 0));
  } catch (e) {
    console.log(e);
  }
}

//loadmoreOrderRows
function* loadmoreOrderRows({ accountId, pageIndex }): Generator<*, *, *> {
  try {
    const orderRowData = yield call(api.get, {
      resource: `prospect-v3.0/orderRow/listByAccount/${accountId}`,
      query: {
        won: true,
        pageIndex,
        pageSize: 10,
      },
    });

    const { orderRowDTOList } = orderRowData;
    yield put(OrganisationActions.loadMoreOrderRowsSuccess(accountId, orderRowDTOList));
  } catch (e) {
    console.log(e);
  }
}

//fetchNotes
function* fetchNotes({ accountId }): Generator<*, *, *> {
  try {
    // yield put(OverviewActions.startFetch(OverviewTypes.Account));

    let query = {
      pageIndex: 0,
      pageSize: 45,
    };

    const data = yield call(api.get, {
      resource: `document-v3.0/note/listByOrganisationFull/${accountId}`,
      query,
    });
    const { noteDTOList } = data;
    yield put(OrganisationActions.successFetchNotes(accountId, noteDTOList));
    // yield put(OverviewActions.succeedFetch(OverviewTypes.Account, [], false, 0));
  } catch (e) {
    console.log(e);
  }
}
const timezone = new Date().getTimezoneOffset() / -60;

const overviewSagas = createOverviewSagas(
  {
    list: `${organisationEndPoints}/organisationFtsES`,
    count: `${organisationEndPoints}/countOrganisationRecordsES`,
  },
  OverviewTypes.Account,
  ObjectTypes.Account,
  'organisation',
  organisationList,
  (requestData) => {
    const { customFilter, roleFilterType, roleFilterValue, searchFieldDTOList, orderBy, ftsTerms } = requestData;
    return {
      customFilter,
      roleFilterType,
      roleFilterValue,
      orderBy,
      searchFieldDTOList,
      ftsTerms,
    };
  },
  (query) => ({
    ...query,
    timeZone: getCurrentTimeZone(),
    excludeLeadType: true,
  })
);
//REFESH QUALIFIED DETAIL WHEN TASK, NOTE, APPOINTMENT EDIT CHANGE
export function* refreshOrganisation({ actionType, overviewType }): Generator<*, *, *> {
  const state = yield select();

  if (actionType === 'note') {
    yield put(OverviewActions.clearHighlightAction(OverviewTypes.Account_Note));
    yield put(OverviewActions.clearHighlightAction(OverviewTypes.Account_Order));
    yield put(OverviewActions.clearHighlightAction(OverviewTypes.CallList.SubAccount));
    yield put(NotificationActions.success(_l`Updated`, '', 2000));
  } else if (actionType === 'task') {
    yield put(refeshTasks());
  } else if (actionType === 'photo') {
    yield put(OverviewActions.clearHighlightAction(OverviewTypes.Account_Photo));
    yield put(NotificationActions.success(_l`Updated`, '', 2000));
  }
  try {
    const languageCode = state.ui.app.locale;
    const account = state.entities.organisation.__DETAIL;
    yield put(OrganisationActions.startFetchOrganisation(account.uuid));
    const organisation = yield call(api.get, {
      resource: `${organisationEndPoints}/getDetails/${account.uuid}`,
      query: {
        languageCode,
      },
    });
    if (actionType === 'note') {
      yield put(OrganisationActions.requestFetchNotes(account.uuid));
    } else if (actionType === 'photo') {
      yield put(OrganisationActions.requestFetchAccountPhotos(account.uuid));
    }
    yield put(OrganisationActions.succeedFetchOrganisation(account.uuid, organisation));
    if (actionType === 'unqualified') {
      yield put({ type: OrganisationActionTypes.FETCH_UNQUALIFIED_REQUEST, accountId: account.uuid });
    } else if (actionType === 'qualified') {
      yield put({ type: OrganisationActionTypes.FETCH_QUALIFIED_REQUEST, accountId: account.uuid });
    } else if (actionType === 'contact') {
      yield put({ type: OrganisationActionTypes.FETCH_CONTACTS_REQUEST, accountId: account.uuid });
    } else if (actionType === 'order') {
      yield put({ type: OrganisationActionTypes.FETCH_ORDER_REQUEST, accountId: account.uuid });
    } else if (actionType === 'appointment') {
      yield put({ type: OrganisationActionTypes.FETCH_APPOINTMENT, accountId: account.uuid, history: false });
    }
  } catch (e) {
    console.log(e);
    // yield put(OrganisationActions.failFetchOrganisation(account.uuid, e.message));
  }
}

//removeCallListInAccount
export function* removeCallListInAccount({ accountId, callListAccountId }): Generator<*, *, *> {
  try {
    const result = yield call(api.get, {
      resource: `${callListEndPoints}/callListAccount/removeFromList`,
      query: {
        accountId,
        callListAccountId,
      },
    });
    yield put(OverviewActions.clearHighlightAction(OverviewTypes.Account));
    yield put(OrganisationActions.removeCallListInAccountSuccess(accountId, callListAccountId));
  } catch (e) {}
}
export function* deactivateOrganisation({ itemId, overviewType }): Generator<*, *, *> {
  try {
    // if (OverviewTypes.Pipeline.Lead === overviewType) {
    const data = yield call(api.get, {
      resource: `${Endpoints.Organisation}/deactivate/${itemId}`,
    });

    if (data.objectId != null) {
      const state = yield select();
      let highlightedId = null;
      if (overviewType == OverviewTypes.CallList.SubAccount) {
        highlightedId = getHighlighted(state, OverviewTypes.CallList.Account);
      }
      yield put(OverviewActions.clearHighlight(overviewType, itemId));
      yield put(NotificationActions.success(_l`Deleted`, '', 2000));
      yield put(OverviewActions.deleteRowSuccess(overviewType, itemId));
      if (overviewType == OverviewTypes.CallList.SubAccount) {
        // const state = yield select();
        // const highlightedId = getHighlighted(state, OverviewTypes.CallList.Contact);
        yield put(CalllistAccountActions.deleteRowSuccessContactOnSubList(highlightedId, itemId));
        yield put(OverviewActions.clearHighlight(OverviewTypes.Account, itemId));
      }
      if (data.haveActiveObject && data.moreUserConnected) {
        yield put(OverviewActions.highlight(overviewType, itemId, 'deactivate_all'));
      }
    }
    // }
  } catch (e) {
    yield put(NotificationActions.error(e.message, '', 2000));
  }
}

export function* updateAppointmentTarget({ accountId, value }): Generator<*, *, *> {
  try {
    const result = yield call(api.post, {
      resource: `${organisationEndPoints}/updateNumberGoalsMeeting/${accountId}`,
      query: {
        numberGoalsMeeting: value,
      },
    });
    yield put(OverviewActions.clearHighlightAction(OverviewTypes.Account));
    yield put(OrganisationActions.updateAppointmentTargetSuccess(accountId, value));
  } catch (e) {}
}

export function* updateSaleTarget({ accountId, value }): Generator<*, *, *> {
  try {
    const result = yield call(api.post, {
      resource: `${organisationEndPoints}/updateBudget/${accountId}`,
      query: {
        budget: value,
      },
    });
    yield put(OverviewActions.clearHighlightAction(OverviewTypes.Account));
    yield put(OrganisationActions.updateSaleTargetSuccess(accountId, value));
  } catch (e) {}
}

export function* deactivateAll({ itemId, overviewType }): Generator<*, *, *> {
  try {
    // if (OverviewTypes.Pipeline.Lead === overviewType) {
    const data = yield call(api.get, {
      resource: `${Endpoints.Organisation}/confirmDeactivateAll/${itemId}`,
    });

    if (data === 'SUCCESS') {
      yield put(OverviewActions.clearHighlight(overviewType, itemId));
      yield put(NotificationActions.success(_l`Deleted`, '', 2000));
    }
    // }
  } catch (e) {
    yield put(NotificationActions.error(e.message, '', 2000));
  }
}

function* changeOnMultiMenu({ option, optionValue, overviewType }) {
  const state = yield select();
  let overviewT = overviewType;
  let objectT = ObjectTypes.Account;
  let customFilterDeault = 'active';
  // let isProspectActive = true;
  // if (overviewType === OverviewTypes.Pipeline.Qualified) {
  //   overviewT = OverviewTypes.Pipeline.Qualified;
  //   objectT = ObjectTypes.PipelineQualified;
  // } else if (overviewType === OverviewTypes.Pipeline.Order) {
  //   overviewT = OverviewTypes.Pipeline.Order;
  //   objectT = ObjectTypes.PipelineOrder;
  //   customFilterDeault = 'history';
  //   isProspectActive = false;
  // }
  // if (overviewType === OverviewTypes.Delegation.Lead) {
  //   overviewT = OverviewTypes.Delegation.Lead;
  //   objectT = ObjectTypes.DelegationLead;
  // }

  try {
    const overview = getOverview(state, overviewT);
    const search = getSearch(state, objectT);
    // const period = getPeriod(state, objectT);
    const { searchFieldDTOList } = getSearchForSave(state, objectT);
    // const isFilterAll = period.period === 'all';
    const { roleType } = state.ui.app;
    let ownerId = state.ui.app.activeRole;
    let roleValue = state.ui.app.activeRole;
    if (roleType === 'Person' && !ownerId) {
      ownerId = state.auth.userId;
    } else if (roleType === 'Company') {
      ownerId = undefined;
    }
    if (roleType === 'Person' && !roleValue) {
      roleValue = state.auth.userId;
    } else if (roleType === 'Company') {
      roleValue = undefined;
    }
    const filterDTO = {
      // startDate: isFilterAll ? null : new Date(period.startDate).getTime(),
      // endDate: isFilterAll ? null : new Date(period.endDate).getTime(),
      // isFilterAll,
      roleFilterType: roleType,
      roleFilterValue: roleValue,
      customFilter: search.filter ? search.filter : customFilterDeault,
      orderBy: search.orderBy ? search.orderBy : 'closedSales',
      // isRequiredOwner: true,
      ftsTerms: search.term,
      searchFieldDTOList: search.shown ? searchFieldDTOList : [],
      // salesProcessIds: [],
      // selectedMark: search.tag,
    };

    const { selectAll, selected } = overview;
    const isSelectedAll = selectAll;
    let organisationIds = [];
    let unSelectedIds = [];
    const keys = Object.keys(selected);
    if (isSelectedAll) {
      organisationIds = [];
      unSelectedIds = keys.filter((key) => selected[key] === false);
    } else {
      organisationIds = keys.filter((key) => selected[key] === true);
    }
    let request = null;
    let payload = {
      filterDTO,
      isSelectedAll,
      organisationIds,
      unSelectedIds,
      // isProspectActive: isProspectActive,
    };
    if (option === 'change_reponsible') {
      let userIDS = optionValue.map((optionValue) => {
        return optionValue.uuid;
      });
      request = call(api.post, {
        resource: `${Endpoints.Organisation}/changeTeamInBatch`,
        data: {
          ...payload,
          userIds: userIDS,
        },
        query: {
          timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'add_to_mailchimp_list') {
      request = call(api.post, {
        resource: `${Endpoints.Organisation}/sendMailChimpInBatch`,
        data: {
          ...payload,
          mailChimp: {
            apikey: optionValue.apikey,
            listId: optionValue.value,
          },
        },
        query: {
          sessionKey: generateUuid(),
          timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'delete_multi') {
      request = call(api.post, {
        resource: `${Endpoints.Organisation}/deleteInBatch`,
        data: {
          ...payload,
        },
        query: {
          sessionKey: generateUuid(),
          timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'export_to_excel') {
      let filterDTOCus0 = { ...filterDTO, listIds: organisationIds };
      let filterDTOCus = { ...payload, filterDTO: filterDTOCus0 };
      filterDTOCus.isRequiredOwner = false;
      filterDTOCus.isShowHistory = filterDTO.customFilter == 'history';
      request = call(api.get, {
        resource: `${Endpoints.Organisation}/exportAdvancedSearchBySelected`,
        query: {
          filterDTO: JSON.stringify(filterDTOCus),
          // leadFrom: overviewType === OverviewTypes.Pipeline.Qualified ? 'lead_delegation' : 'lead',
          // timeZone: new Date().getTimezoneOffset() / -60,
          timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'set_done_multi') {
      request = call(api.post, {
        resource: `${Endpoints.Organisation}/setDoneInBatch`,
        data: {
          ...payload,
        },
        query: {
          sessionKey: generateUuid(),
          timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'update_data_fields') {
      let updatedCustomFieldDTOList = [];
      const customFields = getCustomFieldsObject(state);
      customFields.forEach((customField) => {
        const { customFieldValueDTOList } = customField;
        if (customFieldValueDTOList.length > 0) {
          if (customField.fieldType === 'DROPDOWN') {
            const checkForValueSelected = customFieldValueDTOList.filter((value) => {
              return value.isChecked === true;
            });
            if (checkForValueSelected.length > 0) {
              updatedCustomFieldDTOList.push(customField);
            }
          } else {
            updatedCustomFieldDTOList.push(customField);
          }
        }
      });

      request = call(api.post, {
        resource: `${Endpoints.Organisation}/updateDataField`,
        data: {
          ...payload,
          updatedCustomFieldDTOList: updatedCustomFieldDTOList,
          updatedStandardFieldDTO: {
            ...optionValue,
          },
        },
        query: {
          timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'add_to_call_list') {
      request = call(api.post, {
        resource: `${Endpoints.Organisation}/sendCallListInBatch`,
        query: {
          sessionKey: generateUuid(),
          timeZone: getCurrentTimeZone(),
        },
        data: {
          filterDTO,
          isSelectedAll,
          organisationIds,
          sendCallList: {
            ...optionValue,
          },
        },
      });
    } else if (option === 'assign_multi_unqualified_to_me') {
      request = call(api.post, {
        resource: `${Endpoints.Organisation}/assignToMeInBatch`,
        query: {
          sessionKey: uuid(),
          timeZone: getCurrentTimeZone(),
        },
        data: {
          ...payload,
        },
      });
    } else if (option === 'assign_multi_unqualified') {
      request = call(api.post, {
        resource: `${Endpoints.Organisation}/assignInBatch`,
        query: {
          sessionKey: uuid(),
          timeZone: getCurrentTimeZone(),
        },
        data: {
          ...payload,
        },
      });
    }
    const data = yield request;
    let message = '';

    if (option === 'export_to_excel') {
      if (data) {
        const { fileUrl, sendEmail } = data;
        if (sendEmail) {
          message = `${_l`You will receive an email when the export file is ready for download`}`;
          return yield put(NotificationActions.success(_l`${message}`));
        } else {
          return yield put({ type: 'DOWNLOAD', downloadUrl: fileUrl });
        }
      }
    }

    // let message = '';
    switch (option) {
      case 'change_reponsible':
        message = `${_l`Updated`}`;
        break;
      case 'add_to_mailchimp_list':
        message = `${_l`Total contacts added to the Mailchimp list:`} ${data.result ? data.result.countSuccess : 0}`;
        break;
      case 'delete_multi':
        // if (data.indexOf('TASK_EXECUTION_IN_BACKGROUND') > -1) {
        message = `${_l`Updated`}`;
        // }else {
        //   message = _l`Mass updates may take time to be available for search and in lists.`;
        //
        // }
        break;
      case 'set_done_multi':
        message = `${_l`Updated`}`;
        break;
      case 'update_data_fields':
        message = `${_l`Updated`}`;
        break;
      case 'add_to_call_list':
        message = `${_l`Updated`}`;
        break;
      default:
        break;
    }

    if (data.message === 'SUCCESS' || data.isSuccess || data === 'SUCCESS') {
      yield put(OverviewActions.requestFetch(overviewT, true));
      yield put(OverviewActions.clearHighlightAction(overviewT));
      switch (option) {
        case 'delete_multi':
        case 'set_done_multi':
          yield put(OverviewActions.setSelectAll(overviewT, false));
          break;
        case 'assign_multi_unqualified':
          yield put(OverviewActions.setSelectAll(overviewT, false));
          break;
        default:
          break;
      }
      // if (option === 'add_to_call_list') {
      //   // return yield put(NotificationActions.success(_l`Added`, '', 2000));
      //   return yield put(NotificationActions.success(_l`${message}`));
      // }
      if (
        option == 'change_reponsible' ||
        option == 'add_to_call_list' ||
        option == 'update_data_fields' ||
        option == 'set_done_multi' ||
        option == 'delete_multi'
      ) {
        return yield put(NotificationActions.success(_l`Updated`, '', 2000));
      }
      if (option === 'add_to_mailchimp_list') {
        return yield put(NotificationActions.success(message, null, null, true));
      }
      // return yield put(NotificationActions.success(_l`${message}`));
    }
    // else {
    //   if (option === 'add_to_mailchimp_list') {
    //     yield put(OverviewActions.clearHighlightAction(overviewT));
    //     return yield put(NotificationActions.success(message, null, null, true));
    //   }
    // }
  } catch (e) {
    if (option === 'add_to_mailchimp_list') {
      // return yield put(NotificationActions.success(message, null, null, true));
      yield put(OverviewActions.clearHighlightAction(overviewT));
    }
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}

export function* filterCommunication({
  objectId,
  objectType,
  pageIndex,
  startDate,
  endDate,
  content,
  tag,
}): Generator<*, *, *> {
  try {
    // if (OverviewTypes.Pipeline.Lead === overviewType) {
    let query = {
      objectId,
      objectType,
      pageIndex,
      pageSize: 10,
    };

    if (startDate) {
      query = {
        ...query,
        startDate,
        endDate,
      };
    }

    if (content) {
      query.content = content;
    }
    if (tag !== null) {
      query.type = tag;
    }
    const data = yield call(api.get, {
      resource: `contact-v3.0/listLatestCommunicationFromSecondTime`,
      query,
    });
    if (objectType === 'CONTACT') {
      return yield put(filterLastestComminicationContactSuccess(objectId, data, pageIndex));
    }
    yield put(OrganisationActions.filterLastestComminicationSuccess(objectId, data, pageIndex));
  } catch (e) {
    yield put(NotificationActions.error(e.message, '', 2000));
  }
}
function* setFavoriteDeal({ organisationId, favorite, overviewType }): Generator<*, *, *> {
  const dataDTO = {
    organisationId: organisationId,
    favorite: favorite,
  };
  try {
    const data = yield call(api.post, {
      resource: `${Endpoints.Organisation}/updateFavorite`,
      data: dataDTO,
    });
    if (data) {
      yield put(
        OrganisationActions.updateQualifiedDeal({ organisationId: data.organisationId, favorite: data.favorite })
      );
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}

function* updateResponsible({ organisationId, userDTOList, overviewType, actionType }): Generator<*, *, *> {
  let userIds = userDTOList.map((userDTOList) => {
    return userDTOList.uuid;
  });
  try {
    const state = yield select();
    const data = yield call(api.post, {
      resource: `${Endpoints.Organisation}/${organisationId}/participant/update`,
      query: {
        userIds: userIds.toString(),
      },
    });
    const user = makeGetUser()(state, userDTOList[0].uuid);
    if (user) {
      yield put(OrganisationActions.updateResponsibleOneDealSuccess(organisationId, user.avatar));
    }
    if (data) {
      yield put(OverviewActions.requestFetch(overviewType, true));
    }
    const __DETAIL = state.entities.organisation.__DETAIL;
    if (__DETAIL && __DETAIL.uuid === organisationId) {
      yield put(OrganisationActions.refreshOrganisation(organisationId));
    }
    yield put(OverviewActions.clearHighlightAction(overviewType));
  } catch (error) {
    yield put(NotificationActions.error(error.message));
  }
}

function* addAccountToCalllist({ callListAccountId, overviewType, accountIds }): Generator<*, *, *> {
  const dataDTO = {
    accountIds: accountIds, //accountIds is an array
    callListAccountId: callListAccountId,
    removeAccountIds: [],
  };
  const data = yield call(api.post, {
    resource: `${Endpoints.CallList}/callListAccount/addAccountsToCallList`,
    data: dataDTO,
  });
  if (data.isSuccess) {
    yield put(OrganisationActions.updateCalllistInAccount(data.result.callListAccount));
    yield put(OverviewActions.clearHighlight(overviewType));
    yield put(NotificationActions.success(_l`Added`, '', 2000));
    if (overviewType === OverviewTypes.CallList.SubAccount && data.result.addedCallListAccountAccounts) {
      yield put(
        CalllistAccountActions.addAccountToCalllist(data.result.addedCallListAccountAccounts[0].callListAccountId, 1)
      );
    }
    if (overviewType === OverviewTypes.CallList.Account) {
      if (data.result.addedCallListAccountAccounts)
        yield put(
          CalllistAccountActions.addAccountToCalllist(
            data.result.addedCallListAccountAccounts[0].callListAccountId,
            data.result.addedCallListAccountAccounts.length
          )
        );
      yield put(CalllistAccountActions.fetchAccountOnCallList(callListAccountId, 'name', 0));
    }
  }
}

function* createContactRequest({ overviewType }) {
  const state = yield select();
  const contacts = state.entities.contactDropdown;
  const create = state.entities.organisation.__CREATE_CONTACT;
  const contactDTOList = create.contactDTOList.map((c) => {
    const right = contacts[c];
    return {
      lastName: right.lastName || null,
      discProfile: right.discProfile || null,
      sharedContactId: right.sharedContactId || null,
      relationship: right.relationship || null,
      avatar: right.avatar || null,
      uuid: right.uuid,
      email: right.email || null,
      phone: right.email || null,
      firstName: right.firstName || null,
    };
  });
  const dataDTO = {
    currentTime: new Date().getTime(),
    contactDTOList,
  };
  try {
    const data = yield call(api.post, {
      resource: `prospect-v3.0/${create.uuid}/sponsor/update`,
      data: dataDTO,
    });
    if (data) {
      yield put(OverviewActions.clearHighlight(overviewType));
      yield put(NotificationActions.success(_l`Added`, '', 2000));
      yield put(OrganisationActions.update('__CREATE_CONTACT', { contactDTOList: [] }));
      if (overviewType === OverviewTypes.Account_Qualified_Contact) {
        yield put(refreshOrganisation('qualified'));
      } else if (overviewType === OverviewTypes.Account_Order_Contact) {
        yield put(refreshOrganisation('order'));
      }
    }
  } catch (error) {
    yield put(NotificationActions.error(error.message));
  }
}
export default function* saga(): Generator<*, *, *> {
  // DropDown
  yield fork(queueDropdownFetch);

  // Actions
  yield takeLatest(OrganisationActionTypes.TOGGLE_FAVORITE_REQUEST, toggleFavoriteRequest);
  yield takeLatest(OrganisationActionTypes.CREATE_REQUEST, requestCreate);
  yield takeLatest(OrganisationActionTypes.UPDATE_REQUEST, requestUpdate);
  yield takeLatest(OrganisationActionTypes.DEACTIVATE_REQUEST, requestDeactivate);

  // Get Detail
  yield takeLatest(OrganisationActionTypes.FETCH_ORGANISATION_REQUEST, fetchOrganisation);

  // Cards
  yield takeLatest(OrganisationActionTypes.FETCH_CONTACTS_REQUEST, fetchContacts);
  yield takeLatest(OrganisationActionTypes.FETCH_TASKS_REQUEST, fetchTasks);
  yield takeLatest(OrganisationActionTypes.FETCH_APPOINTMENT, fetchAppointment);
  yield takeLatest(OrganisationActionTypes.FETCH_NOTES_REQUEST, fetchNotes);
  yield takeLatest(OrganisationActionTypes.FETCH_UNQUALIFIED_REQUEST, fetchUnqualified);
  yield takeLatest(OrganisationActionTypes.FETCH_QUALIFIED_REQUEST, fetchQualified);
  yield takeLatest(OrganisationActionTypes.FETCH_ORDER_REQUEST, fetchOrder);
  yield takeLatest(OrganisationActionTypes.LOAD_MORE_ORDER_ROWS, loadmoreOrderRows);
  //LOAD_MORE_ORDER_ROWS
  yield takeLatest(OrganisationActionTypes.FETCH_PHOTOS_REQUEST, fetchPhotosSaga);
  //

  //TASK
  yield takeLatest(OrganisationActionTypes.REFRESH_ORGANISATION, refreshOrganisation);

  yield takeLatest(OrganisationActionTypes.DELETE_ROW, deactivateOrganisation);
  yield takeLatest(OrganisationActionTypes.DEACTIVATE_ALL, deactivateAll);

  //REMOVE_CALL_LIST_IN_ACCOUNT
  yield takeLatest(OrganisationActionTypes.REMOVE_CALL_LIST_IN_ACCOUNT, removeCallListInAccount);

  //UPDATE_APPOINTMENT_TARGET
  yield takeLatest(OrganisationActionTypes.UPDATE_APPOINTMENT_TARGET, updateAppointmentTarget);
  //SALE TARGET
  yield takeLatest(OrganisationActionTypes.UPDATE_SALE_TARGET, updateSaleTarget);
  //updateSaleTarget
  yield takeLatest(OrganisationActionTypes.CHANGE_ON_MULTI_ORGANISATION_MENU, changeOnMultiMenu);
  yield takeLatest(OrganisationActionTypes.SET_FAVORITE_DEAL, setFavoriteDeal);
  yield takeLatest(OrganisationActionTypes.UPDATE_RESPONSIBLE_ONE_DEAL, updateResponsible);

  yield takeLatest(OrganisationActionTypes.ADD_ACCOUNT_TO_CALL_LIST, addAccountToCalllist);
  //FILTER_LASTEST_COMMUNICATION
  yield takeLatest(OrganisationActionTypes.FILTER_LASTEST_COMMUNICATION, filterCommunication);

  //
  yield takeLatest(OrganisationActionTypes.CREATE_CONTACT_REQUEST, createContactRequest);
  yield takeLatest(OrganisationActionTypes.FETCH_ORGANISATION_REQUEST_TO_EDIT, fetchOrganisationToEdit);
  yield all(overviewSagas);
}

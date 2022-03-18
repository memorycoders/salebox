//@flow
import { call, put, all, select, takeLatest } from 'redux-saga/effects';
import api from 'lib/apiClient';
import _l from 'lib/i18n';
import * as NotificationActions from '../../components/Notification/notification.actions';
import createOverviewSagas from 'components/Overview/overview.saga';
import { ObjectTypes, OverviewTypes, Endpoints } from 'Constants';
import { contactList } from './callListContact.schema';
import ContactActionTypes, * as CallListContactActions from './callListContact.actions';
import { callSubListContact } from './callSubListContact.schema';
import { getAuth } from 'components/Auth/auth.selector';
import { FORM_KEY, CALL_LIST_TYPE } from '../../Constants';
import { clearHighlight, requestFetch, deleteRowSuccess, delegateTaskSuccess,clearHighlightAction } from '../Overview/overview.actions';
import { updateSuggestCallList } from '../CallList/callList.actions';
import { getOverview } from '../../components/Overview/overview.selectors';
import { getSearch, getSearchForSave } from 'components/AdvancedSearch/advanced-search.selectors';
import { getPeriod } from 'components/PeriodSelector/period-selector.selectors';
import * as OverviewActions from '../../components/Overview/overview.actions';
import * as CallListAccountActions from "../CallListAccount/callListAccount.actions";
//
import { isHighlightAction } from 'components/Overview/overview.selectors';
import {getCurrentTimeZone} from "../../lib/dateTimeService";

function* getContactOnCallList({ callListContactId, pageIndex, orderBy }): Generator<*, *, *> {
  const state = yield select();
  const auth = getAuth(state);
  try {
    const requestData = {
      callListId: callListContactId,
      pageIndex: pageIndex,
      pageSize: 25,
      enterpriseId: auth.enterpriseID,
      orderBeans: [
        { orderBy: orderBy, order: orderBy === 'firstName' ? 'asc' : 'desc' },
        { orderBy: 'fullName', order: 'asc' },
      ],
    };
    const data = yield call(api.post, {
      data: requestData,
      query: {
        calls: 'null',
        dials: 'null',
      },
      resource: `${Endpoints.CallList}/callListContact/getContactOnCallList`,
      schema: callSubListContact,
    });
    if(data){
      yield put(
        CallListContactActions.getContactOnCallListSuccess(callListContactId, { entities: data.entities, pageIndex })
      );
    }

  } catch (e) {
    yield put(CallListContactActions.getContactOnCallListFailure(callListContactId, e.message));
  }
}

const overviewSagas = createOverviewSagas(
  {
    list: `${Endpoints.CallList}/callListContact/list_new`,
  },
  OverviewTypes.CallList.Contact,
  ObjectTypes.CallListContact,
  'callListContact',
  contactList,
  (requestData) => {
    const { showHistory, orderBy, roleFilterType, roleFilterValue, searchFieldDTOList, ftsTerms } = requestData;
    return {
      orderBy: orderBy === 'dateAndTime' ? 'deadlineDate' : orderBy,
      roleFilterType,
      roleFilterValue,
      searchFieldDTOList,
      searchText: ftsTerms,
      showHistory,
    };
  },
  (query) => ({
    ...query,
    excludeLeadType: true,
  })
);
function* addContactCallList({ isCreate , overviewType}): Generator<*, *, *> {
  const common = yield select((state) => state.common);
  const entities = yield select((state) => state.entities);

  try {
    if (isCreate) {
      const auth = yield select((state) => state.auth);
      const callListContact = entities.callListContact[FORM_KEY.CREATE];
      let callListDTO = {
        name: callListContact.name,
        ownerId: callListContact.ownerId,
        deadlineDate: callListContact.deadlineDate? new Date(callListContact.deadlineDate) : null,
      };
      let { result } = yield call(api.post, {
        resource: `${Endpoints.CallList}/callListContact/add`,
        data: callListDTO,
        query: callListContact.callListAccountId ? {
          callListAccountId:callListContact.callListAccountId
        }:null
      });
      if(callListContact.callListAccountId) {
        yield put(clearHighlight(OverviewTypes.CallList.List, callListContact.callListAccountId));
      } else {
        yield put(clearHighlight(OverviewTypes.CallList.List));
      }
      yield put(clearHighlightAction(OverviewTypes.CallList.Contact));
      const state = yield select();
      const visible = isHighlightAction(state, OverviewTypes.Activity.Appointment, 'add_to_call_list')
        || isHighlightAction(state, OverviewTypes.Pipeline.Lead, 'add_to_call_list')
        || isHighlightAction(state, OverviewTypes.Activity.Task, 'add_to_call_list')
        || isHighlightAction(state, OverviewTypes.Delegation.Task, 'add_to_call_list')
        || isHighlightAction(state, OverviewTypes.Delegation.Lead, 'add_to_call_list')
        || isHighlightAction(state, OverviewTypes.Pipeline.Qualified, 'add_to_call_list')
        || isHighlightAction(state, OverviewTypes.Pipeline.Order, 'add_to_call_list')
        || isHighlightAction(state, OverviewTypes.Account, 'add_to_call_list')
        || isHighlightAction(state, OverviewTypes.Contact, 'add_to_call_list')

      ;
      const importCsv = state.common.currentOverviewType === 'IMPORT_CSV' ? true : false;
      if(!visible && !importCsv)
      yield put(
        updateSuggestCallList({
          status: true,
          type: CALL_LIST_TYPE.CONTACT,
        })
      );
      if (common.currentOverviewType === OverviewTypes.CallList.Contact) {
        yield put(requestFetch(common.currentOverviewType, true));
      }
      yield put(CallListContactActions.clearCreateEntity(auth.userId));
      if(result!= null && result.callList!=null){
        let valueNew = { value: result.callList.uuid, text: result.callList.name, type: CALL_LIST_TYPE.CONTACT };
        yield put(CallListContactActions.storeNewValue(valueNew));

      }
    } else {
      const callListContact = entities.callListContact[FORM_KEY.EDIT];
      let callListDTO = {
        callListId: callListContact.uuid,
        name: callListContact.name,
        ownerId: callListContact.ownerId,
        deadlineDate: callListContact.deadlineDate ? new Date(callListContact.deadlineDate) : null,
      };
      const res = yield call(api.post, {
        resource: `${Endpoints.CallList}/callListContact/update`,
        data: callListDTO,
      });
      yield put(clearHighlight(OverviewTypes.CallList.Contact));
      yield put(NotificationActions.success(_l`Updated`, '', 2000));
      if(res && res.result && res.result.callList) {
        yield put(CallListContactActions.updateCallListContactById(res.result.callList))
      }
    }

  } catch (ex) {
    yield put(NotificationActions.error(ex.message));
  }
}

function* fetchContactCallistByFilter({ callListContactId, tagFilter }): Generator<*, *, *> {
  const state = yield select();
  const auth = getAuth(state);
  try {
    const requestData = {
      callListId: callListContactId,
      pageIndex: 0,
      pageSize: 25,
      enterpriseId: auth.enterpriseID,
      orderBeans: [
        { orderBy: 'fullName', order: 'asc' },
        { orderBy: 'fullName', order: 'asc' },
      ],
    };
    const data = yield call(api.post, {
      data: requestData,
      query: {
        calls:
          tagFilter === 'CALLS'
            ? true
            : tagFilter === 'NO_DIALS_AND_CALLS' || tagFilter === 'NO_CALLS'
            ? false
            : 'null',
        dials:
          tagFilter === 'DIALS'
            ? true
            : tagFilter === 'NO_DIALS_AND_CALLS' || tagFilter === 'NO_DIALS'
            ? false
            : 'null',
      },
      resource: `${Endpoints.CallList}/callListContact/getContactOnCallList`,
      schema: callSubListContact,
    });


    yield put(
      CallListContactActions.getContactOnCallListSuccess(callListContactId, { entities: data.entities, pageIndex: 0 })
    );
  } catch (e) {
    yield put(CallListContactActions.getContactOnCallListFailure(callListContactId, e.message));
  }
}
function* changeOnMultiCallListContact({ option, optionValue, overviewType }) {
  const state = yield select();
  let overviewT = OverviewTypes.CallList.Contact;
  let objectT = ObjectTypes.CallListContact;

  try {
    const overview = getOverview(state, overviewT);
    const search = getSearch(state, objectT);
    const period = getPeriod(state, objectT);
    const { searchFieldDTOList } = getSearchForSave(state, objectT);
    const isFilterAll = period.period === 'all';
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
      roleFilterType: roleType,
      roleFilterValue: roleValue,
      orderBy: search.orderBy ? search.orderBy : 'deadlineDate',
      searchFieldDTOList: search.shown ? searchFieldDTOList : [],
      showHistory: search.filter === 'history',
      searchText: search.term,
    };

    const { selectAll, selected } = overview;
    const isSelectedAll = selectAll;
    let callListIds = [];
    let unSelectedIds = [];
    const keys = Object.keys(selected);
    if (isSelectedAll) {
      callListIds = [];
      unSelectedIds = keys.filter((key) => selected[key] === false);
    } else {
      callListIds = keys.filter((key) => selected[key] === true);
    }
    let request = null;
    let payload = {
      filterDTO,
      isSelectedAll,
      callListIds,
      callListType: 'contact',
      // assignTaskDTO,
    };
    if (option === 'change_reponsible') {
      let ownerID = optionValue.map((value) => {
        return value;
      });
      request = call(api.post, {
        resource: `${Endpoints.CallList}/changeOwnerInBatch`,
        data: {
          ownerId: ownerID.toString(),
          ...payload,
        },
        query: {
          timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'add_to_mailchimp_list') {
      request = call(api.post, {
        resource: `${Endpoints.CallList}/sendMailChimpInBatch`,
        data: {
          ...payload,
          sendMailChimpDTO: {
            apikey: optionValue.apikey,
            listId: optionValue.value,
          },
        },
        query: {
          timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'delete_multi') {
      request = call(api.post, {
        resource: `${Endpoints.CallList}/deleteInBatch`,
        data: {
          ...payload,
        },
        query: {
          timeZone: getCurrentTimeZone(),
        },
      });
    }
    const data = yield request;

    let message = '';
    switch (option) {
      case 'change_reponsible':
        message = `${_l`Updated`}`;
        break;
      case 'add_to_mailchimp_list':
        message = `${_l`Total contacts added to the Mailchimp list:`} ${data.result ? data.result.countSuccess : 0}`;
        break;
      case 'delete_multi':
        message = `${_l`Updated`}`;
        break;
      default:
        break;
    }

    if (data.message === 'SUCCESS' || data.isSuccess) {
      yield put(OverviewActions.requestFetch(overviewT, true));
      yield put(OverviewActions.clearHighlightAction(overviewT));
      return yield put(NotificationActions.success(_l`Updated`, '', 2000));
    } else if (option == 'change_reponsible' || option == 'delete_multi') {
      yield put(OverviewActions.clearHighlightAction(overviewT));
      return yield put(NotificationActions.success(_l`Updated`, '', 2000));
    }
  } catch (e) {
    if (option === 'add_to_mailchimp_list') {
      // return yield put(NotificationActions.success(message, null, null, true));
      yield put(OverviewActions.clearHighlightAction(overviewT));
    }
    yield put(NotificationActions.error(e.message));
    if( e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}
function* deleteContactCallList({ callListId, overviewType }): Generator<*, *, *> {
  try {
    const res = yield call(api.get, {
      resource: `${Endpoints.CallList}/delete/${callListId}`,
    });
    if (res === 'SUCCESS') {
      yield put(NotificationActions.success(_l`Deleted`, '', 2000));
      yield put(deleteRowSuccess(overviewType, callListId));
      yield put(clearHighlight(overviewType));
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if( e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}
export function* setContact({ itemId, overviewType }): Generator<*, *, *> {
  try {
      const data = yield call(api.post, {
        resource: `${Endpoints.CallList}/setDone/${itemId}`,
      });
      if (data === 'SUCCESS') {
        yield put(NotificationActions.success(_l`Updated`, '', 2000));
        yield put(delegateTaskSuccess(overviewType, itemId));
        yield put(clearHighlight(overviewType));
      }
        // if (overviewType === OverviewTypes.Pipeline.Lead_Task) {
        //   const state = yield select();
        //   const unqualifiedDeal = state.entities.unqualifiedDeal.__DETAIL;
        //   yield put(fetchUnqualifiedDetail(unqualifiedDeal.uuid, false));
        // } else if (overviewType === OverviewTypes.Pipeline.Qualified_Task) {
        //   yield put(refeshQualifiedDeal('task'));
        // } else if (overviewType === OverviewTypes.Account_Task) {
        //   yield put(refreshOrganisation('task'));
        // } else if (overviewType === OverviewTypes.Contact_Task) {
        //   yield put(refreshContact('task'))
        // }
  } catch (e) {
    yield put(NotificationActions.error(e.message, '', 2000));
  }
}
function* removeContactFromCallListContact({contactId, callListContactId, overviewType}): Generator<*, *, *>{
  try {
    const res = yield call(api.get, {
      resource: `${Endpoints.CallList}/callListContact/removeFromList`,
      query: {
        contactId: contactId,
        callListContactId: callListContactId
      }
    })
    if(res === 'SUCCESS') {
      yield put(NotificationActions.success(_l`Updated`, '', 2000));
      yield put(clearHighlight(OverviewTypes.CallList.SubContact));
      yield put(CallListContactActions.removeContactFromCallListContactSuccess(contactId, callListContactId));
    }

  } catch(e) {
    yield put(NotificationActions.error(e.message));
    if( e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
    }
}
export default function* saga(): Generator<*, *, *> {
  // yield takeLatest(ContactActionTypes.FETCH_CALL_LIST_CONTACT_REQUEST, fetchCallListCallListContact);
  yield takeLatest(ContactActionTypes.GET_CONTACT_ON_CALL_LIST, getContactOnCallList);
  yield takeLatest(ContactActionTypes.ADD_EDIT_CONTACT_CALLLIST, addContactCallList);
  yield takeLatest(ContactActionTypes.FILTER_CONTACT_CALLLIST_SUBLIST, fetchContactCallistByFilter);
  yield takeLatest(ContactActionTypes.CHANGE_ON_MULTI_CALLLIST_CONTACT, changeOnMultiCallListContact);
  yield takeLatest(ContactActionTypes.DELETE_CONTACT_CALLLIST, deleteContactCallList);
  yield takeLatest(ContactActionTypes.SET_CONTACT, setContact);
  yield takeLatest(ContactActionTypes.REMOVE_CONTACT_FROM_CALLLIST_CONTACT, removeContactFromCallListContact);

  // yield takeLatest(ContactActionTypes.FETCH_COLLEAGUE_REQUEST, fetchColleague);
  // yield takeLatest(ContactActionTypes.CREATE_COLLEAGUE, createColleague);
  // yield takeLatest(ContactActionTypes.EDIT_CONTACT, editContact);
  // yield fork(queueFetchDropdownForOrganisation);
  yield all(overviewSagas);
}

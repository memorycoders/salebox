//@flow
import { call, put, take, cancel, fork, all, select, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import api from 'lib/apiClient';
import * as NotificationActions from '../../components/Notification/notification.actions';
import createOverviewSagas from 'components/Overview/overview.saga';
import { getCallListAccount } from './callListAccount.selector';
import { ObjectTypes, OverviewTypes, Endpoints } from 'Constants';
import { callListAccount } from './callListAccount.schema';
import { callSubListAccount } from './callSubListAccount.schema';
import CallListAccountActionTypes, * as CallListAccountActions from './callListAccount.actions';
import { FORM_KEY, CALL_LIST_TYPE } from '../../Constants';
import {
  clearHighlight,
  deleteRowSuccess,
  delegateTaskSuccess,
  clearHighlightAction,
} from '../Overview/overview.actions';
import _l from 'lib/i18n';
import * as OverviewActions from '../Overview/overview.actions';
import { getOverview } from '../../components/Overview/overview.selectors';
import { getSearch, getSearchForSave } from 'components/AdvancedSearch/advanced-search.selectors';
import { getPeriod } from 'components/PeriodSelector/period-selector.selectors';
import { updateSuggestCallList } from '../CallList/callList.actions';
import OverviewActionTypes from 'components/Overview/overview.actions';
//
import { isHighlightAction } from 'components/Overview/overview.selectors';
import { getCurrentTimeZone } from '../../lib/dateTimeService';

function* requestCreate({ createData }): Generator<*, *, *> {
  const state = yield select();
  try {
    const payload = {
      name: createData.name,
      type: null,
      industry: null,
      size: null,
      mediaType: 'MANUAL',
      email: null,
      mainEmailType: null,
      phone: null,
      mainPhoneType: null,
      additionalEmailList: [],
      additionalPhoneList: [],
      isPrivate: false,
      isChanged: false,
      participantList: [],
      numberGoalsMeeting: 0,
    };

    const organisation = yield call(api.post, {
      resource: `${organisationEndPoints}/add`,
      schema: organisationSchema,
      data: payload,
    });

    if (organisation) {
      yield put(OverviewActions.clearHighlightAction(OverviewTypes.Account));
      yield put(NotificationActions.success('Account was added successfully', '', 2000));
    }
  } catch (e) {
    // yield put(NotificationActions.error(e.message));
    // yield put(OrganisationActions.failFetchOrganisation(organisationId, e.message));
  }
}

function* fetchAccountOnCallList({ callListAccountId, orderBy, pageIndex }): Generator<*, *, *> {
  const state = yield select();
  const callListAccount = getCallListAccount(state, callListAccountId);
  try {
    const requestData = {
      callListAccountId: callListAccountId,
      pageIndex,
      pageSize: 25,
      userIds: [callListAccount.ownerId],
      unitIds: [callListAccount.unitId],
      orderBeans: [
        { orderBy: orderBy, order: orderBy === 'name' ? 'asc' : 'desc' },
        { orderBy: 'name', order: 'asc' },
      ],
    };
    const data = yield call(api.post, {
      data: requestData,
      query: {
        callListAccountId,
        calls: 'null',
        dials: 'null',
      },
      resource: `${Endpoints.CallList}/callListAccount/getAccountOnCallList`,
      schema: callSubListAccount,
    });

    if (data) {
      yield put(
        CallListAccountActions.fetchAccountOnCallListSuccess(callListAccountId, { entities: data.entities, pageIndex })
      );
    }
  } catch (e) {
    yield put(CallListAccountActions.fetchAccountOnCallListFailure(callListAccountId, e.message));
  }
}

function* fetchCallListAccountByHistory(): Generator<*, *, *> {
  try {
    const requestData = {
      orderBy: 'deadlineDate',
      roleFilterType: 'Person',
      roleFilterValue: 'd43cc38a-883b-44df-a8ec-2ff707859bca',
      searchFieldDTOList: [],
      searchText: '',
      showHistory: true,
    };
    const data = yield call(api.post, {
      data: requestData,
      query: {
        pageIndex: 0,
        pageSize: 30,
      },
      resource: `${Endpoints.CallList}/callListAccount/list_new`,
      schema: callListAccount,
    });

    yield put(CallListAccountActions.fetchCallListAccountByHistorySuccess({ entities: data.entities }));
  } catch (e) {
    yield put(CallListAccountActions.fetchCallListAccountByHistoryFailure(e.message));
  }
}

const overviewSagas = createOverviewSagas(
  {
    list: `${Endpoints.CallList}/callListAccount/list_new`,
  },
  OverviewTypes.CallList.Account,
  ObjectTypes.CallListAccount,
  'callListAccount',
  callListAccount,
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
  (query) => {
    return {
      ...query,
      excludeLeadType: true,
    };
  }
);

function* fetchAccountCallistByFilter({ callListAccountId, tagFilter }): Generator<*, *, *> {
  const state = yield select();
  const callListAccount = getCallListAccount(state, callListAccountId);
  try {
    const requestData = {
      callListAccountId: callListAccountId,
    };
    let query = {
      callListAccountId: callListAccountId,
      calls:
        tagFilter === 'CALLS' ? true : tagFilter === 'NO_DIALS_AND_CALLS' || tagFilter === 'NO_CALLS' ? false : 'null',
      dials:
        tagFilter === 'DIALS' ? true : tagFilter === 'NO_DIALS_AND_CALLS' || tagFilter === 'NO_DIALS' ? false : 'null',
    };
    const res = yield call(api.post, {
      resource: `${Endpoints.CallList}/callListAccount/getAccountOnCallList`,
      query: query,
      data: requestData,
      schema: callSubListAccount,
    });
    yield put(
      CallListAccountActions.fetchAccountOnCallListSuccess(callListAccountId, { entities: res.entities, pageIndex: 0 })
    );
  } catch (e) {
    yield put(CallListAccountActions.fetchAccountOnCallListFailure(callListAccountId, e.message));
  }
}

function* addAccountCallList({ isCreate }): Generator<*, *, *> {
  try {
    const common = yield select((state) => state.common);
    const entities = yield select((state) => state.entities);

    if (isCreate) {
      const auth = yield select((state) => state.auth);
      const callListAccount = entities.callListAccount[FORM_KEY.CREATE];
      let callListDTO = {
        name: callListAccount.name,
        ownerId: auth.userId,
        deadlineDate: callListAccount.deadlineDate ? new Date(callListAccount.deadlineDate) : null,
      };
      let { result } = yield call(api.post, {
        resource: `${Endpoints.CallList}/callListAccount/add`,
        data: callListDTO,
      });
      yield put(clearHighlight(OverviewTypes.CallList.List));

      const state = yield select();
      const visible =
        isHighlightAction(state, OverviewTypes.Activity.Appointment, 'add_to_call_list') ||
        isHighlightAction(state, OverviewTypes.Pipeline.Lead, 'add_to_call_list') ||
        isHighlightAction(state, OverviewTypes.Activity.Task, 'add_to_call_list') ||
        isHighlightAction(state, OverviewTypes.Delegation.Task, 'add_to_call_list') ||
        isHighlightAction(state, OverviewTypes.Delegation.Lead, 'add_to_call_list') ||
        isHighlightAction(state, OverviewTypes.Pipeline.Qualified, 'add_to_call_list') ||
        isHighlightAction(state, OverviewTypes.Pipeline.Order, 'add_to_call_list') ||
        isHighlightAction(state, OverviewTypes.Account, 'add_to_call_list') ||
        isHighlightAction(state, OverviewTypes.Contact, 'add_to_call_list');
      const importCsv = state.common.currentOverviewType === 'IMPORT_CSV' ? true : false;
      if (!visible && !importCsv)
        yield put(
          updateSuggestCallList({
            status: true,
            type: CALL_LIST_TYPE.ACCOUNT,
          })
        );
      if (common.currentOverviewType === OverviewTypes.CallList.Account) {
        yield put(OverviewActions.requestFetch(common.currentOverviewType, true));
      }
      yield put(clearHighlightAction(OverviewTypes.CallList.Account));
      yield put(CallListAccountActions.clearCreateEntity(auth.userId));
      if (result != null && result.callListAccount != null) {
        let valueNew = {
          value: result.callListAccount.uuid,
          text: result.callListAccount.name,
          type: CALL_LIST_TYPE.ACCOUNT,
        };
        yield put(CallListAccountActions.storeNewValue(valueNew));
      }
    } else {
      let callListAccount = entities.callListAccount[FORM_KEY.EDIT];
      let callListDTO = {
        callListAccountId: callListAccount.uuid,
        name: callListAccount.name,
        ownerId: callListAccount.ownerId,
        deadlineDate: callListAccount.deadlineDate ? new Date(callListAccount.deadlineDate) : null,
      };
      const res = yield call(api.post, {
        resource: `${Endpoints.CallList}/callListAccount/update`,
        data: callListDTO,
      });
      yield put(clearHighlight(OverviewTypes.CallList.Account));
      yield put(NotificationActions.success(_l`Updated`, '', 2000));
      if (res && res.result && res.result.callListAccount) {
        yield put(CallListAccountActions.updateCallListAccountById(res.result.callListAccount));
      }
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}
function* deleteAccountCallList({ callListId, overviewType }): Generator<*, *, *> {
  try {
    const res = yield call(api.post, {
      resource: `${Endpoints.CallList}/callListAccount/delete`,
      query: {
        uuid: callListId,
      },
    });
    if (res.isSuccess) {
      yield put(NotificationActions.success(_l`Deleted`, '', 2000));
      yield put(deleteRowSuccess(overviewType, callListId));
      yield put(clearHighlight(overviewType));
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}

function* changeOnMultiCallListAccount({ option, optionValue, overviewType }) {
  const state = yield select();
  let overviewT = OverviewTypes.CallList.Account;
  let objectT = ObjectTypes.CallListAccount;
  let ownerIDS = [];
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
    let unSelectedIds = [];
    const { selectAll, selected } = overview;
    const isSelectedAll = selectAll;
    let callListIds = [];
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
      callListType: 'account',
      // assignTaskDTO,
    };
    if (option === 'change_reponsible') {
      if (overviewType !== OverviewTypes.CallList.Account) {
        ownerIDS = optionValue.map((value) => {
          return value.uuid;
        });
      }

      request = call(api.post, {
        resource: `${Endpoints.CallList}/changeOwnerInBatch`,
        data: {
          ownerId: overviewType === OverviewTypes.CallList.Account ? optionValue : ownerIDS.toString(),
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
        message = `${_l`Total contacts added to the Mailchimp list`} ${data.result ? data.result.countSuccess : 0}`;
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
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}
function* removeAccountFromCallListAccount({ accountId, callListAccountId, overviewType }): Generator<*, *, *> {
  try {
    const res = yield call(api.get, {
      resource: `${Endpoints.CallList}/callListAccount/removeFromList`,
      query: {
        accountId: accountId,
        callListAccountId: callListAccountId,
      },
    });
    if (res === 'SUCCESS') {
      yield put(NotificationActions.success(_l`Updated`, '', 2000));
      yield put(clearHighlight(OverviewTypes.CallList.SubAccount));
      yield put(CallListAccountActions.removeAccountFromCallListAccountSuccess(accountId, callListAccountId));
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}
export function* setAccount({ itemId, overviewType }): Generator<*, *, *> {
  try {
    const data = yield call(api.post, {
      resource: `${Endpoints.CallList}/callListAccount/finish`,
      query: {
        uuid: itemId,
      },
    });
    if (data.isSuccess) {
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
export default function* saga(): Generator<*, *, *> {
  yield takeLatest(CallListAccountActionTypes.FETCH_CALL_LIST_ACCOUNT_BY_HISTORY, fetchCallListAccountByHistory);
  yield takeLatest(CallListAccountActionTypes.FETCH_ACCOUNT_ON_CALL_LIST, fetchAccountOnCallList);
  yield takeLatest(CallListAccountActionTypes.FILTER_ACCOUNT_CALLLIST_SUBLIST, fetchAccountCallistByFilter);
  yield takeLatest(CallListAccountActionTypes.ADD_EDIT_ACCOUNT_CALLLIST, addAccountCallList);
  yield takeLatest(CallListAccountActionTypes.DELETE_ACCOUNT_CALLLIST, deleteAccountCallList);
  yield takeLatest(CallListAccountActionTypes.CHANGE_ON_MULTI_CALLLIST_ACCOUNT, changeOnMultiCallListAccount);
  yield takeLatest(CallListAccountActionTypes.REMOVE_ACCOUNT_FROM_CALLLIST_ACCOUNT, removeAccountFromCallListAccount);
  yield takeLatest(CallListAccountActionTypes.SET_ACCOUNT, setAccount);
  yield all(overviewSagas);
}

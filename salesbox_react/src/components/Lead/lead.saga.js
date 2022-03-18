//@flow
import { all, call, put, takeLatest, select } from 'redux-saga/effects';
import { Endpoints, ObjectTypes, OverviewTypes } from 'Constants';
import createOverviewSagas from 'components/Overview/overview.saga';
import { leadList } from 'components/Lead/lead.schema';
import * as NotificationActions from 'components/Notification/notification.actions';
import api from 'lib/apiClient';
import ActionTypes from './lead.actions';
import _l from 'lib/i18n';
import * as OverviewActions from 'components/Overview/overview.actions';
import { push } from 'react-router-redux';
import {refreshOrganisation} from "../Organisation/organisation.actions";
import {refreshContact} from "../Contact/contact.actions";

addTranslations({
  'en-US': {
    'Deleted': 'Deleted',
    'Assigned': 'Assigned',
    'Updated': 'Updated',
  },
});

const delegateLeadOverviewSagas = createOverviewSagas(
  {
    list: `${Endpoints.Lead}/list`,
    count: `${Endpoints.Lead}/countRecords`,
  },
  OverviewTypes.Delegation.Lead,
  ObjectTypes.DelegationLead,
  'lead',
  leadList,
  // eslint-disable-next-line no-unused-vars
  ({
    selectedMark,
    showHistory,
    orderBy,
    roleFilterType,
    roleFilterValue,
    searchFieldDTOList,
    startDate,
    ftsTerms,
    customFilter,
    endDate,
    isFilterAll,
    isRequiredOwner,
  }) => {
    return {
      showHistory,
      orderBy,
      roleFilterType,
      roleFilterValue,
      searchFieldDTOList,
      startDate,
      ftsTerms,
      customFilter,
      endDate,
      isFilterAll,
      isRequiredOwner,
      isDelegateLead: true,
      statusSearchValue: selectedMark,
    };
  }
);

export function* deleteLead({ overviewType, leadId }): Generator<*, *, *> {
  try {
    const data = yield call(api.get, {
      resource: `${Endpoints.Lead}/delete/${leadId}`,
    });
    if (data === 'SUCCESS') {
      yield put(OverviewActions.clearHighlight(overviewType, leadId));
      yield put(NotificationActions.success(_l`Deleted`, '', 2000));
      yield put(OverviewActions.deleteRowSuccess(overviewType, leadId));
      yield put(push('/delegation/leads'));
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message, '', 2000));
  }
}

export function* updateLead({lead}) {
  const res = yield call(api.post, {
    resource: `${Endpoints.Lead}/update`,
    data: lead
  });
  return res;
}

export function* setDoneLead({leadId}) {
  const res = yield call(api.post, {
    resource: `${Endpoints.Lead}/finish/${leadId}`,
    query: {
      finished: true
    }
  });
  return res;
}

export function* assignLead({ overviewType, data, leadId }): Generator<*, *, *> {
  try {
    const res = yield call(api.post, {
      resource: `${Endpoints.Lead}/assign/${leadId}`,
      query: {
        note: data.note,
        userId: data.userId,
      },
    });
    if (res === 'SUCCESS') {
      yield put(OverviewActions.clearHighlight(overviewType, leadId));
      yield put(NotificationActions.success(_l`Updated`, '', 2000));
      yield put(OverviewActions.requestFetch(overviewType, true));
      if (overviewType == OverviewTypes.Account_Unqualified){
        yield put(refreshOrganisation('unqualified'));
      }
      else if (overviewType == OverviewTypes.Contact_Unqualified){
        yield put(refreshContact('unqualified'))
      }
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if( e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}
export function* assignToMe({ leadId , overviewType }): Generator<*, *, *> {
  try {
    const state = yield select();
    const data = yield call(api.post, {
      resource: `${Endpoints.Lead}/decide/${leadId}`,
      query: {
        userId: state.auth.userId,
        accepted: true,
      },
    });
    if (data === 'SUCCESS') {
      yield put(OverviewActions.clearHighlight(overviewType, leadId));
      yield put(NotificationActions.success(_l`Updated`, '', 2000));
      yield put(OverviewActions.requestFetch(overviewType, true));
      if (overviewType == OverviewTypes.Account_Unqualified){
        yield put(refreshOrganisation('unqualified'));
      }
      else if (overviewType == OverviewTypes.Contact_Unqualified){
        yield put(refreshContact('unqualified'))
      }
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if( e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}

function* fetchUnqualifiedDeal({ unqualifiedDealId, isRefesh }): Generator<*, *, *> {
  try {
    yield put({ type: ActionTypes.START_FETCH_DETAIL });

    if (isRefesh) {
      yield put(OverviewActions.setPanelAction(OverviewTypes.Delegation.Lead, null));
    }

    const unqualified = yield call(api.get, {
      resource: `${Endpoints.Lead}/getDetails/${unqualifiedDealId}`,
    });

    yield put({
      type: ActionTypes.FETCH_SUCCESS,
      unqualifiedDealId,
      unqualified,
    });
  } catch (e) {
    // yield put({ type: DelegationActions.FETCH_LEAD_FOR_TASK_FAIL, taskId, message: e.message });
  }
}

export default function* saga(): Generator<*, *, *> {
  yield all(delegateLeadOverviewSagas);
  yield takeLatest(ActionTypes.DELEGATION_LEAD_DELETE, deleteLead);
  yield takeLatest(ActionTypes.DELEGATION_LEAD_ASSIGN, assignLead);
  yield takeLatest(ActionTypes.ASSIGN_TO_ME, assignToMe);
  yield takeLatest(ActionTypes.FETCH_LEAD_DETAIL, fetchUnqualifiedDeal);
}

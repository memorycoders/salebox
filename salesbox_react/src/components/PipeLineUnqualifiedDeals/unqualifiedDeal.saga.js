//@flow
import { call, put, take, cancel, fork, all, select, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import api from 'lib/apiClient';
import createOverviewSagas from 'components/Overview/overview.saga';
import { getCallListAccount, getCreateUnqualifiedDeal, getUpdateUnqualifiedDeal } from './unqualifiedDeal.selector';
import { ObjectTypes, OverviewTypes, Endpoints } from 'Constants';
import { unqualifiedDealSchema, unqualifiedDeal } from './unqualifiedDeal.schema';
import ActionTypes, {
  succeedFetchTasks,
  clearCreateEntity,
  succeedFetchNotes,
  fetchUnqualifiedDetail,
  clearUpdateEntity,
  requestFetchNotes,
  succeedFetchAppointments,
  requestFetchAppointments,
} from './unqualifiedDeal.actions';
import OverviewActionTypes, * as OverviewActions from 'components/Overview/overview.actions';
import * as NotificationActions from 'components/Notification/notification.actions';
import _l from 'lib/i18n';
import { taskList } from '../Task/task.schema';
import { getOverview, getHighlighted } from '../Overview/overview.selectors';
import { getCustomFieldsObject, getCustomFieldValues } from '../CustomField/custom-field.selectors';
import { getSearch, getSearchForSave } from 'components/AdvancedSearch/advanced-search.selectors';
import { getPeriod } from 'components/PeriodSelector/period-selector.selectors';
import uuid from 'uuid/v4';
import generateUuid from 'uuid/v4';
import OrganisationActionTypes, * as OrganisationActions from '../Organisation/organisation.actions';
import { refreshOrganisation } from '../Organisation/organisation.actions';
import { showHideSuggestForm } from '../Common/common.actions';
import { refreshContact } from '../Contact/contact.actions';
import { getCurrentTimeZone } from '../../lib/dateTimeService';
import * as TaskActions from '../Task/task.actions';
import * as AppointmentActions from '../Appointment/appointment.actions';

const documentEndPoints = 'document-v3.0';

addTranslations({
  'en-US': {
    Added: 'Added',
    Updated: 'Updated',
    'There is already an active reminder with this focus': 'There is already an active reminder with this focus',
    'You will receive an email when the import is done': 'You will receive an email when the import is done',
  },
});

const overviewSagas = createOverviewSagas(
  {
    list: `${Endpoints.Lead}/list`,
    count: `${Endpoints.Lead}/countRecords`,
  },
  OverviewTypes.Pipeline.Lead,
  ObjectTypes.PipelineLead,
  'unqualifiedDeal',
  unqualifiedDeal,
  (requestData) => {
    const {
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
      isDelegateLead,
      selectedMark,
    } = requestData;
    return {
      showHistory,
      customFilter,
      endDate,
      ftsTerms,
      isDelegateLead,
      isFilterAll,
      isRequiredOwner,
      orderBy,
      roleFilterType,
      roleFilterValue,
      searchFieldDTOList,
      startDate,
      statusSearchValue: selectedMark,
    };
  },
  (query) => ({
    ...query,
    excludeLeadType: true,
  })
);

function* fetchUnqualifiedDeal({ unqualifiedDealId, isRefesh }): Generator<*, *, *> {
  try {
    yield put({ type: ActionTypes.START_FETCH_DETAIL });

    // if (isRefesh) {
    //   yield put(OverviewActions.setPanelAction(OverviewTypes.Pipeline.Lead, null))
    // }

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
export function* deleteUnqualifiedDeal({ itemId, overviewType }): Generator<*, *, *> {
  try {
    // if (OverviewTypes.Pipeline.Lead === overviewType) {
    const data = yield call(api.get, {
      resource: `${Endpoints.Lead}/delete/${itemId}`,
    });
    if (data === 'SUCCESS') {
      yield put(OverviewActions.clearHighlight(overviewType, itemId));
      yield put(NotificationActions.success(_l`Deleted`, '', 2000));
      yield put(OverviewActions.deleteRowSuccess(overviewType, itemId));
      if (overviewType == OverviewTypes.Account_Unqualified) {
        yield put(refreshOrganisation('unqualified'));
      } else if (overviewType === OverviewTypes.Contact_Unqualified) {
        yield put(refreshContact('unqualified'));
      }
    }
    // }
  } catch (e) {
    yield put(NotificationActions.error(e.message, '', 2000));
  }
}
export function* delegateUnqualified({ userId, uuid, overviewType }): Generator<*, *, *> {
  try {
    const query = userId ? { userId } : null;
    const data = yield call(api.post, {
      resource: `${Endpoints.Lead}/distribute/${uuid}`,
      query: query,
    });
    if (data === 'SUCCESS') {
      yield put(OverviewActions.clearHighlight(overviewType, uuid));
      yield put(NotificationActions.success(_l`Updated`, '', 2000));
      yield put(OverviewActions.delegateTaskSuccess(overviewType, uuid));
      // yield put(OverviewActions.requestFetch(overviewType));
      if (overviewType == OverviewTypes.Account_Unqualified) {
        yield put(refreshOrganisation('unqualified'));
      } else if (overviewType === OverviewTypes.Contact_Unqualified) {
        yield put(refreshContact('unqualified'));
      }
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message, '', 2000));
  }
}

function* updateCustomField(overviewType, leadId) {
  const state = yield select();
  let overviewT = OverviewTypes.Pipeline.Lead;
  let objectT = ObjectTypes.PipelineLead;
  if (overviewType === OverviewTypes.Delegation.Lead) {
    overviewT = OverviewTypes.Delegation.Lead;
    objectT = ObjectTypes.DelegationLead;
  }
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
    startDate: isFilterAll ? null : new Date(period.startDate).getTime(),
    endDate: isFilterAll ? null : new Date(period.endDate).getTime(),
    isFilterAll,
    roleFilterType: roleType,
    roleFilterValue: roleValue,
    customFilter: search.filter ? search.filter : 'active',
    orderBy: search.orderBy ? search.orderBy : 'dateAndTime',
    isRequiredOwner: true,
    ftsTerms: search.term,
    searchFieldDTOList: search.shown ? searchFieldDTOList : [],
    // selectedMark: search.tag,
    statusSearchValue: search.tag,
    showHistory: true,
    isDelegateLead: overviewType === OverviewTypes.Delegation.Lead ? true : false,
  };

  let payload = {
    filterDTO,
    isSelectedAll: false,
    leadIds: [leadId],
    unSelectedIds: [],
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
      resource: `${Endpoints.Lead}/updateDataField`,
      data: {
        ...payload,
        updatedCustomFieldDTOList,
        updatedStandardFieldDTO: {},
      },
      query: {
        timeZone: getCurrentTimeZone(),
      },
    });
  } catch (error) {}
}

export function* addUnqualified({ overviewType }): Generator<*, *, *> {
  if (overviewType == OverviewTypes.Account_Unqualified_Multi) {
    yield addUnqualifiedMultiple({ overviewType });
    return;
  }
  // if (overviewType == OverviewTypes.Contact_Unqualified_Multi) {
  //   // yield addUnqualifiedAccount({overviewType});
  //   // return;
  // }
  const state = yield select();
  try {
    const _CREATE = getCreateUnqualifiedDeal(state);
    if (_CREATE.productList === null) delete _CREATE.productList;
    const data = yield call(api.post, {
      resource: `${Endpoints.Lead}/add`,
      query: {
        forcedAdd: true,
      },
      data: {
        ..._CREATE,
        ownerId: _CREATE.ownerId ? _CREATE.ownerId : state.auth.userId,
      },
    });
    if (data) {
      yield updateCustomField(overviewType, data.uuid);
      yield put(OverviewActions.clearHighlight(overviewType));
      // yield put(NotificationActions.success(_l`Added`, '', 2000));
      yield put(showHideSuggestForm(true, data));
      yield put(OverviewActions.requestFetch(overviewType, true));
      // auto fill for add form reminder
      if (overviewType == OverviewTypes.Pipeline.Lead) {
        let contactIds = _CREATE.contactId != null ? [_CREATE.contactId] : [];
        yield put(TaskActions.updateCreateEditEntityAfterAddDeal(null, data.uuid, _CREATE.organisationId, contactIds));
        yield put(
          AppointmentActions.updateCreateEditEntityAfterAddDeal(null, data.uuid, _CREATE.organisationId, contactIds)
        );
      }
      yield put(clearCreateEntity());
      if (
        overviewType === OverviewTypes.Account_Unqualified ||
        overviewType === OverviewTypes.CallList.SubAccount_Unqualified
      ) {
        yield put(refreshOrganisation('unqualified'));
      } else if (
        overviewType === OverviewTypes.Contact_Unqualified ||
        overviewType === OverviewTypes.CallList.SubContact_Unqualified
      ) {
        yield put(refreshContact('unqualified'));
      }
      if (overviewType === OverviewTypes.Contact_Quick_Unqualified) {
        yield put(refreshContact('unqualified'));
      }
      yield put(NotificationActions.success('Added', '', 2000));
    }
  } catch (error) {
    yield put(NotificationActions.error(error.message));
  }
}
export function* addUnqualifiedMultiple({ overviewType }): Generator<*, *, *> {
  const state = yield select();
  try {
    let overviewT = OverviewTypes.Account;
    let objectT = ObjectTypes.Account;
    let customFilterDeault = 'active';
    //
    // switch (overviewType) {
    //   case OverviewTypes.Contact_Unqualified_Multi:
    //     overviewT = OverviewTypes.Contact;
    //     objectT = ObjectTypes.Contact;
    //     break;
    //
    // }

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

    const { selectAll, selected, itemCount } = overview;

    const isSelectedAll = selectAll;
    let organisationIds = [];
    let unSelectedIds = [];
    const keys = Object.keys(selected);
    let numItemSelect = 0;
    if (isSelectedAll) {
      organisationIds = [];
      unSelectedIds = keys.filter((key) => selected[key] === false);
      numItemSelect = itemCount - unSelectedIds.length;
    } else {
      organisationIds = keys.filter((key) => selected[key] === true);
      numItemSelect = organisationIds.length;
    }
    let payload = {
      filterDTO,
      isSelectedAll,
      organisationIds,
      unSelectedIds,
    };
    const _CREATE = getCreateUnqualifiedDeal(state);
    if (_CREATE.productList === null) delete _CREATE.productList;
    let getData = call(api.post, {
      resource: `${Endpoints.Organisation}/addLeadInBatch`,
      data: {
        ...payload,
        addedLeadDTO: {
          ..._CREATE,
          ownerId: _CREATE.ownerId ? _CREATE.ownerId : state.auth.userId,
        },
      },
      query: {
        timeZone: getCurrentTimeZone(),
      },
    });

    // if (OverviewTypes.Contact_Unqualified_Multi == overviewType) {
    //   payload.contactIds = payload.organisationIds;
    //   delete payload.organisationIds;
    //   getData = call(api.post, {
    //     resource: `${Endpoints.Contact}/addLeadInBatch`,
    //     data: {
    //       ...payload,
    //       addedLeadDTO: {
    //         ..._CREATE,
    //         ownerId: _CREATE.ownerId ? _CREATE.ownerId : state.auth.userId,
    //       },
    //     },
    //     query: {
    //       timeZone: getCurrentTimeZone()
    //     },
    //   });
    // }

    const data = yield getData;
    let message = '';

    if (data.message === 'SUCCESS' || data.isSuccess || data === 'SUCCESS' || data.code == 200) {
      // if ((!isSelectedAll && payload.organisationIds.length > 30) || (isSelectedAll && itemCount > 30)) {
      if (numItemSelect > 30) {
        message = 'You will get an email when your deals are added.';
      } else {
        message = 'Update';
      }
      yield put(OverviewActions.clearHighlight(overviewType));
      yield put(clearCreateEntity());

      /*      const highlightedId = getHighlighted(state, overviewT);
      if (highlightedId != null) {
        yield put(OrganisationActions.requestFetchOrganisation(highlightedId));
      }*/
      // const organisation = state.entities.organisation.__DETAIL;
      // if (organisation && organisation.uuid) {
      //   // yield put(OrganisationActions.requestFetchOrganisation(organisation.uuid));
      // }
      if (OverviewTypes.Contact_Unqualified_Multi == overviewType) {
        yield put(refreshContact('unqualified'));
      } else {
        yield put(refreshOrganisation('unqualified'));
      }

      // requestFetchOrganisation()
      return yield put(NotificationActions.success(_l`Updated`, '', 2000));
    }

    /*      if (data) {
      yield put(OverviewActions.clearHighlight(overviewType));
      yield put(NotificationActions.success(_l`Added`, '', 2000));
      // yield put(OverviewActions.requestFetch(OverviewTypes.Pipeline.Lead, true));
      // yield put(clearCreateEntity());
    }*/
  } catch (error) {
    yield put(NotificationActions.error(error.message));
  }
}

export function* updateUnqualified({ overviewType }): Generator<*, *, *> {
  const state = yield select();
  try {
    const __EDIT = getUpdateUnqualifiedDeal(state);
    if (__EDIT.productList === null) delete __EDIT.productList;
    if (__EDIT.organisation) delete __EDIT.organisation;
    if (__EDIT.contact) delete __EDIT.contact;
    const data = yield call(api.post, {
      resource: `${Endpoints.Lead}/update`,
      data: {
        ...__EDIT,
        ownerId:
          OverviewTypes.Delegation.Lead === overviewType || overviewType == OverviewTypes.Account_Unqualified
            ? __EDIT.ownerId
            : __EDIT.ownerId
            ? __EDIT.ownerId
            : state.auth.userId,
      },
    });
    const customFieldValues = getCustomFieldValues(state, __EDIT.uuid);

    if (data) {
      yield put(OverviewActions.clearHighlight(overviewType));
      yield put(clearUpdateEntity());
      yield put(NotificationActions.success(_l`Updated`, '', 2000));
      yield put(OverviewActions.requestFetch(overviewType, true));
      const state = yield select();
      const unqualifiedDeal = state.entities.unqualifiedDeal.__DETAIL;
      if (unqualifiedDeal && unqualifiedDeal.uuid) {
        yield put(fetchUnqualifiedDetail(unqualifiedDeal.uuid, false));
      }
      if (overviewType == OverviewTypes.Account_Unqualified) {
        yield put(refreshOrganisation('unqualified'));
      } else if (overviewType === OverviewTypes.Contact_Unqualified) {
        yield put(refreshContact('unqualified'));
      }
    }

    yield delay(1000);
    yield call(api.post, {
      resource: `enterprise-v3.0/customFieldValue/editList`,
      query: {
        objectId: __EDIT.uuid,
      },
      data: {
        customFieldDTOList: customFieldValues,
      },
    });
  } catch (error) {
    yield put(NotificationActions.error(error.message));
  }
}

//Card: Appointments
export function* fetchAppointments({ unqualifiedDealId, history, orderBy }): Generator<*, *, *> {
  try {
    // yield put(OverviewActions.startFetch(OverviewTypes.Pipeline.Lead));

    const data = yield call(api.post, {
      resource: `${Endpoints.Appointment}/fts`,
      query: {
        pageIndex: 0,
        pageSize: 10000,
        sessionKey: generateUuid(),
      },
      data: {
        customFilter: 'active',
        isShowHistory: history,
        leadId: unqualifiedDealId,
        roleFilterType: '',
        roleFilterValue: '',
        searchFieldDTOList: [],
        searchText: '',
        orderBy,
      },
    });

    const appointments = data.appointmentDTOList;
    yield put(succeedFetchAppointments(unqualifiedDealId, appointments));
    // yield put(OverviewActions.succeedFetch(OverviewTypes.Pipeline.Lead, [], false, 0));
  } catch (e) {
    console.log(e);
  }
}

// Card: Tasks
export function* fetchTasks({ unqualifiedDealId, history, tag, orderBy }): Generator<*, *, *> {
  try {
    // yield put(OverviewActions.startFetch(OverviewTypes.Pipeline.Lead));
    const data = yield call(api.post, {
      resource: `${Endpoints.Task}/listTaskOnLead/${unqualifiedDealId}`,
      schema: taskList,
      query: {
        pageIndex: 0,
        pageSize: 45,
      },
      data: {
        orderBy, // FIXME: Impl - dateAndTime
        showHistory: history, // FIXME: Impl - showHistory
        selectedMark: tag,
      },
    });

    yield put(
      succeedFetchTasks(unqualifiedDealId, {
        entities: data.entities,
      })
    );
    // yield put(OverviewActions.succeedFetch(OverviewTypes.Pipeline.Lead, [], false, 0));
  } catch (e) {
    console.log(e);
  }
}

// Card: notes
export function* fetchNotes({ unqualifiedDealId }): Generator<*, *, *> {
  try {
    // yield put(OverviewActions.startFetch(OverviewTypes.Pipeline.Lead));

    const data = yield call(api.get, {
      resource: `${documentEndPoints}/note/listByLeadFull/${unqualifiedDealId}`,
      query: {
        pageIndex: 0,
        pageSize: 45,
      },
    });

    const notes = data.noteDTOList;
    yield put(succeedFetchNotes(unqualifiedDealId, notes));
    // yield put(OverviewActions.succeedFetch(OverviewTypes.Pipeline.Lead, [], false, 0));
  } catch (e) {
    console.log(e);
  }
}

export function* updateNoteOnLead({ noteId, note, subject }): Generator<*, *, *> {
  try {
    const data = yield call(api.post, {
      resource: `${documentEndPoints}/note/listByLeadFull/${unqualifiedDealId}`,
      data: {
        uuid: noteId,
        note,
        subject,
      },
    });
    const state = yield select();
    const unqualifiedDeal = state.entities.unqualifiedDeal.__DETAIL;
    yield put(fetchUnqualifiedDetail(unqualifiedDeal.uuid, false));
  } catch (e) {
    console.log(e);
  }
}

export function* deleteNoteOnLead({ noteId }): Generator<*, *, *> {
  try {
    const data = yield call(api.post, {
      resource: `${documentEndPoints}/note/listByLeadFull/${unqualifiedDealId}`,
      data: {
        uuid: noteId,
        note,
        subject,
      },
    });
    const state = yield select();
    const unqualifiedDeal = state.entities.unqualifiedDeal.__DETAIL;
    yield put(fetchUnqualifiedDetail(unqualifiedDeal.uuid, false));
  } catch (e) {
    console.log(e);
  }
}

export function* refeshUnqualifiedDeal({ actionType }): Generator<*, *, *> {
  try {
    yield put(OverviewActions.clearHighlightAction(OverviewTypes.Pipeline.Lead_Note));
    yield put(NotificationActions.success(_l`Updated`, '', 2000));
    const state = yield select();
    const unqualifiedDeal = state.entities.unqualifiedDeal.__DETAIL;
    try {
      const unqualified = yield call(api.get, {
        resource: `${Endpoints.Lead}/getDetails/${unqualifiedDeal.uuid}`,
      });
      yield put({
        type: ActionTypes.FETCH_SUCCESS,
        unqualifiedDealId: unqualifiedDeal.uuid,
        unqualified,
      });
      if (actionType === 'note') {
        yield put(requestFetchNotes(unqualifiedDeal.uuid));
      } else if (actionType === 'task') {
        yield put({
          type: ActionTypes.FETCH_TASKS,
          unqualifiedDealId: unqualifiedDeal.uuid,
          history: false,
          orderBy: 'dateAndTime',
        });
      } else if (actionType === 'appointment') {
        yield put({
          type: ActionTypes.FETCH_APPOINTMENTS,
          unqualifiedDealId: unqualifiedDeal.uuid,
          history: false,
          tag: null,
          orderBy: 'dateAndTime',
        });
      }
    } catch (e) {}
  } catch (e) {
    console.log(e);
  }
}

function* changeOnMultiMenu({ option, optionValue, overviewType }) {
  const state = yield select();
  let overviewT = OverviewTypes.Pipeline.Lead;
  let objectT = ObjectTypes.PipelineLead;
  if (overviewType === OverviewTypes.Delegation.Lead) {
    overviewT = OverviewTypes.Delegation.Lead;
    objectT = ObjectTypes.DelegationLead;
  }

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
      startDate: isFilterAll ? null : new Date(period.startDate).getTime(),
      endDate: isFilterAll ? null : new Date(period.endDate).getTime(),
      isFilterAll,
      roleFilterType: roleType,
      roleFilterValue: roleValue,
      customFilter: search.filter ? search.filter : 'active',
      orderBy: search.orderBy ? search.orderBy : 'dateAndTime',
      isRequiredOwner: true,
      ftsTerms: search.term,
      searchFieldDTOList: search.shown ? searchFieldDTOList : [],
      // selectedMark: search.tag,
      statusSearchValue: search.tag,
      showHistory: true,
      isDelegateLead: overviewType === OverviewTypes.Delegation.Lead ? true : false,
    };
    const assignLeadDTO = {
      note: optionValue ? optionValue.note : '',
      userId: state.auth.userId,
    };
    const { selectAll, selected } = overview;
    const isSelectedAll = selectAll;
    let leadIds = [];
    let unSelectedIds = [];
    const keys = Object.keys(selected);
    if (isSelectedAll) {
      leadIds = [];
      unSelectedIds = keys.filter((key) => selected[key] === false);
    } else {
      leadIds = keys.filter((key) => selected[key] === true);
    }
    let request = null;
    let payload = {
      filterDTO,
      isSelectedAll,
      leadIds,
      unSelectedIds,
      assignLeadDTO,
    };
    if (option === 'change_reponsible') {
      request = call(api.post, {
        resource: `${Endpoints.Lead}/changeOwnerInBatch`,
        data: {
          ownerId: optionValue,
          ...payload,
        },
        query: {
          sessionKey: generateUuid(),
          timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'add_to_mailchimp_list') {
      request = call(api.post, {
        resource: `${Endpoints.Lead}/sendMailChimpInBatch`,
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
        resource: `${Endpoints.Lead}/deleteInBatch`,
        data: {
          ...payload,
        },
        query: {
          sessionKey: generateUuid(),
          timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'export_to_excel') {
      let filterDTOCus0 = { ...filterDTO, listIds: leadIds };
      let filterDTOCus = { ...payload, filterDTO: filterDTOCus0 };
      // filterDTOCus.isRequiredOwner = false;
      // filterDTOCus.isShowHistory = filterDTO.customFilter == 'history';
      request = call(api.get, {
        resource: `${Endpoints.Lead}/exportAdvancedSearchBySelected`,
        query: {
          sessionKey: generateUuid(),
          filterDTO: JSON.stringify(filterDTOCus),
          leadFrom: overviewType === OverviewTypes.Delegation.Lead ? 'lead_delegation' : 'lead',
          timeZone: new Date().getTimezoneOffset() / -60,
          // timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'set_done_multi') {
      request = call(api.post, {
        resource: `${Endpoints.Lead}/setDoneInBatch`,
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
        resource: `${Endpoints.Lead}/updateDataField`,
        data: {
          ...payload,
          updatedCustomFieldDTOList,
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
        resource: `${Endpoints.Lead}/sendCallListInBatch`,
        query: {
          sessionKey: generateUuid(),
          timeZone: getCurrentTimeZone(),
        },
        data: {
          ...payload,
          sendCallList: {
            ...optionValue,
          },
        },
      });
    } else if (option === 'assign_multi_unqualified_to_me') {
      request = call(api.post, {
        resource: `${Endpoints.Lead}/assignToMeInBatch`,
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
        resource: `${Endpoints.Lead}/assignInBatch`,
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
        message = `${_l`Updated`}`;
        break;
      case 'set_done_multi':
        message = `${_l`Updated`}`;
        break;
      case 'update_data_fields':
        message = `${_l`Updated`}`;
        break;
      case 'add_to_call_list':
        message = _l`Added`;
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

export function* setToDone({ overviewType, uuid }): Generator<*, *, *> {
  try {
    if (
      OverviewTypes.Pipeline.Lead === overviewType ||
      overviewType == OverviewTypes.Account_Unqualified ||
      overviewType == OverviewTypes.Contact_Unqualified
    ) {
      yield put(OverviewActions.clearHighlight(overviewType, uuid));
      const data = yield call(api.post, {
        resource: `${Endpoints.Lead}/finish/${uuid}`,
        query: {
          finished: true,
        },
      });
      if (data === 'SUCCESS') {
        yield put(NotificationActions.success(_l`Updated`, '', 2000));
        if (overviewType == OverviewTypes.Account_Unqualified) {
          const state = yield select();
          const organisation = state.entities.organisation.__DETAIL;
          if (organisation && organisation.uuid) {
            yield put(OrganisationActions.requestFetchOrganisation(organisation.uuid));
            yield put(refreshOrganisation('unqualified'));
          }
        } else if (overviewType == OverviewTypes.Contact_Unqualified) {
          yield put(refreshContact('unqualified'));
        } else {
          yield put(OverviewActions.setTask(overviewType, uuid));
        }
      }
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}
export function* delegateAccept({ userId, uuid, overviewType, accepted }): Generator<*, *, *> {
  try {
    const data = yield call(api.post, {
      resource: `${Endpoints.Lead}/decide/${uuid}`,
      query: {
        userId: userId,
        accepted,
        gmt: new Date().getTimezoneOffset() / -60,
      },
    });
    if (data === 'SUCCESS') {
      yield put(OverviewActions.clearHighlight(overviewType, uuid));
      yield put(NotificationActions.success(_l`Updated`, '', 2000));
      yield put(OverviewActions.requestFetch(overviewType, true));
      if (overviewType == OverviewTypes.Account_Unqualified) {
        yield put(refreshOrganisation('unqualified'));
      } else if (overviewType === OverviewTypes.Contact_Unqualified) {
        yield put(refreshContact('unqualified'));
      }
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}
export function* delegateDecline({ userId, uuid, overviewType, accepted }): Generator<*, *, *> {
  try {
    const data = yield call(api.post, {
      resource: `${Endpoints.Lead}/decide/${uuid}`,
      query: {
        userId: userId,
        accepted,
        gmt: new Date().getTimezoneOffset() / -60,
      },
    });
    if (data === 'SUCCESS') {
      yield put(OverviewActions.clearHighlight(overviewType, uuid));
      yield put(NotificationActions.success(_l`Updated`, '', 2000));
      yield put(OverviewActions.requestFetch(overviewType, true));
      if (overviewType == OverviewTypes.Account_Unqualified) {
        yield put(refreshOrganisation('unqualified'));
      } else if (overviewType === OverviewTypes.Contact_Unqualified) {
        yield put(refreshContact('unqualified'));
      }
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}

export function* updateStatusUnqualified({ overviewType, uuid, status }): Generator<*, *, *> {
  try {
    yield put(OverviewActions.clearHighlight(overviewType, uuid));
    if (status !== 'None' && status !== null) {
      const data = yield call(api.post, {
        resource: `${Endpoints.Lead}/updateLeadStatus/${uuid}`,
        query: {
          status: status,
        },
      });
      if (data === 'SUCCESS') {
        yield put(NotificationActions.success(_l`Updated`, '', 2000));
      }
    } else {
      const data = yield call(api.post, {
        resource: `${Endpoints.Lead}/updateLeadStatus/${uuid}`,
      });
      if (data === 'SUCCESS') {
        yield put(NotificationActions.success(_l`Updated`, '', 2000));
      }
    }

    yield put(OverviewActions.requestFetch(overviewType, true));
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}
export default function* saga(): Generator<*, *, *> {
  yield all(overviewSagas);
  yield takeLatest(ActionTypes.FETCH_UNQUALIFIED_DETAIL, fetchUnqualifiedDeal);
  yield takeLatest(ActionTypes.REFESH_UNQUALIFIED_DETAIL, refeshUnqualifiedDeal);
  //REFESH_UNQUALIFIED_DETAIL
  yield takeLatest(ActionTypes.DELETE_ROW, deleteUnqualifiedDeal);
  yield takeLatest(ActionTypes.FETCH_TASKS, fetchTasks);
  //fetchNotes
  yield takeLatest(ActionTypes.FETCH_NOTES, fetchNotes);
  yield takeLatest(ActionTypes.UPDATE_NOTE_ON_LEAD, updateNoteOnLead);
  yield takeLatest(ActionTypes.DELETE_NOTE_ON_LEAD, deleteNoteOnLead);

  //fet appointment
  yield takeLatest(ActionTypes.FETCH_APPOINTMENTS, fetchAppointments);

  yield takeLatest(ActionTypes.DELEGATE_UNQUALIFIED, delegateUnqualified);
  yield takeLatest(ActionTypes.CREATE_ENTITY_FETCH, addUnqualified);
  yield takeLatest(ActionTypes.UPDATE_ENTITY_FETCH, updateUnqualified);
  yield takeLatest(ActionTypes.CHANGE_ON_MULTI_UNQUALIFIED_MENU, changeOnMultiMenu);
  yield takeLatest(ActionTypes.UPDATE_STATUS_UNQUALIFIED, updateStatusUnqualified);
  yield takeLatest(ActionTypes.SET_UNQUALIFIED_DONE, setToDone);

  yield takeLatest(ActionTypes.DELEGATE_ACCEPT, delegateAccept);
  yield takeLatest(ActionTypes.DELEGATE_DECLINE, delegateDecline);
}

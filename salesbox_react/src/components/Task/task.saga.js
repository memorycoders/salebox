//@flow
import { all, takeLatest, call, put, select, fork } from 'redux-saga/effects';
import { Endpoints, ObjectTypes, OverviewTypes } from 'Constants';
import createOverviewSagas from 'components/Overview/overview.saga';
import uuid from 'uuid/v4';
import api from 'lib/apiClient';
import { taskList } from 'components/Task/task.schema';
import {
  ActionTypes,
  clearCreateEntity,
  createError,
  updateEdit,
  updateTaskLead,
  updateAddQualifi,
  setCurrentSpecialTask,
  fillFormCreateTask,
} from './task.actions';
import ActionTypesNote, { requestFetchTask } from '../Delegation/delegation.actions';
import { getSearch, getSearchForSave } from 'components/AdvancedSearch/advanced-search.selectors';
import { getOverview } from '../../components/Overview/overview.selectors';
import { getPeriod } from 'components/PeriodSelector/period-selector.selectors';
import { getCreateTask, getUpdateTask } from 'components/Task/task.selector';
import OverviewActionTypes, * as OverviewActions from 'components/Overview/overview.actions';
import * as NotificationActions from 'components/Notification/notification.actions';
import AdvancedSearchActions, { enableHistory, blockHistory } from '../AdvancedSearch/advanced-search.actions';
import { startSubmit, stopSubmit } from 'redux-form';
import { leadSchema } from '../Lead/lead.schema';
import { getCustomFieldsObject, getCustomFieldValues } from '../CustomField/custom-field.selectors';
// !!!:
import { getAuth } from 'components/Auth/auth.selector';
import { fetchUnqualifiedDetail, refeshUnqualifiedDetail } from '../PipeLineUnqualifiedDeals/unqualifiedDeal.actions';
import { refeshQualifiedDeal, autoFillForm } from '../PipeLineQualifiedDeals/qualifiedDeal.actions';
import { refreshOrganisation } from '../Organisation/organisation.actions';
import { refreshContact } from '../Contact/contact.actions';
import _l from 'lib/i18n';
import { SPECIAL_TASK, FORM_ACTION } from '../../Constants';
import { getSpecialTask } from '../Common/common.saga';
import { setActionForHighlight } from '../Overview/overview.actions';
import { updateLead, setDoneLead } from '../Lead/lead.saga';
import { forEach } from 'lodash';
import { createAndUpdateData, createAndUpdateOrderRow } from '../OrderRow/order-row.actions';
import { timeoutNotification } from '../Appointment/appointment.saga';
import { getCurrentTimeZone } from '../../lib/dateTimeService';
import { delay } from 'redux-saga';

addTranslations({
  'en-US': {
    Updated: 'Updated',
    Deleted: 'Deleted',
    'Reminder accepted': 'Reminder accepted',
    'Reminder marked': 'Reminder marked',
    Added: 'Added',
    'There is already an active reminder with this focus': 'There is already an active reminder with this focus',
    'Reminder updated': 'Reminder updated',
    'Do you want to:': 'Do you want to:',
  },
});

const activitiesTaskOverviewSagas = createOverviewSagas(
  {
    list: `${Endpoints.Task}/list`,
    count: `${Endpoints.Task}/countRecords`,
  },
  OverviewTypes.Activity.Task,
  ObjectTypes.Task,
  'task',
  taskList,
  (requestData) => {
    return {
      ...requestData,
      isDelegateTask: false,
    };
  }
);

const delegateTaskOverviewSagas = createOverviewSagas(
  {
    list: `${Endpoints.Task}/list`,
    count: `${Endpoints.Task}/countRecords`,
  },
  OverviewTypes.Delegation.Task,
  ObjectTypes.Delegation,
  'task',
  taskList,
  (requestData) => {
    return {
      ...requestData,
      isDelegateTask: true,
    };
  }
);

export function* updateNote({ taskId, note }): Generator<*, *, *> {
  try {
    const data = yield call(api.post, {
      resource: `${Endpoints.Task}/updateNote`,
      data: {
        note,
        uuid: taskId,
      },
    });
    yield put({ type: ActionTypes.CHANGE_NOTE, taskId, note });
    yield put({ type: ActionTypesNote.HIDE_ADDNOTE_FORM });
  } catch (e) {
    console.log(e);
  }
}

export function* sortByDate({ sortValue }): Generator<*, *, *> {
  const state = yield select();
  try {
    const search = getSearch(state, 'TASK');
    const period = getPeriod(state, 'TASK');
    const { searchFieldDTOList } = getSearchForSave(state, 'TASK');
    const isFilterAll = period.period === 'all';
    const { roleType } = state.ui.app;
    let roleValue = state.ui.app.activeRole;
    if (roleType === 'Person' && !roleValue) {
      roleValue = state.auth.userId;
    } else if (roleType === 'Company') {
      roleValue = undefined;
    }
    const requestData = {
      startDate: isFilterAll ? null : new Date(period.startDate).getTime(),
      endDate: isFilterAll ? null : new Date(period.endDate).getTime(),
      isFilterAll,
      roleFilterType: roleType,
      roleFilterValue: roleValue,
      customFilter: search.filter ? search.filter : 'active',
      orderBy: sortValue,
      isRequiredOwner: false,
      ftsTerms: search.term,
      searchFieldDTOList: search.shown ? searchFieldDTOList : [],
      selectedMark: search.tag,
      showHistory: search.history,
    };

    const data = yield call(api.post, {
      resource: `${Endpoints.Task}/list`,
      query: {
        pageIndex: 0,
        pageSize: 12,
        sessionKey: uuid(),
      },
      data: requestData,
      schema: taskList,
    });
    if (data.entities) {
      if (data.entities.task) {
        const items = Object.keys(data.entities.task);
        yield put(OverviewActions.succeedFetch(OverviewTypes.Activity.Task, items, true, items.length));
        yield put(OverviewActions.setOrderBy(OverviewTypes.Activity.Task, sortValue));
      } else {
        yield put(OverviewActions.succeedFetch(OverviewTypes.Activity.Task, [], true, items.length));
      }
      yield put(OverviewActions.feedEntities(data.entities));
    }
  } catch (e) {
    console.log(e);
  }
}

export function* filterByTag({ filterValue }): Generator<*, *, *> {
  const state = yield select();
  try {
    const search = getSearch(state, 'TASK');
    const period = getPeriod(state, 'TASK');
    const overview = getOverview(state, 'ACTIVITIES_TASK');
    const { searchFieldDTOList } = getSearchForSave(state, 'TASK');
    const isFilterAll = period.period === 'all';
    const { roleType } = state.ui.app;
    let roleValue = state.ui.app.activeRole;
    if (roleType === 'Person' && !roleValue) {
      roleValue = state.auth.userId;
    } else if (roleType === 'Company') {
      roleValue = undefined;
    }
    const requestData = {
      startDate: isFilterAll ? null : new Date(period.startDate).getTime(),
      endDate: isFilterAll ? null : new Date(period.endDate).getTime(),
      isFilterAll,
      roleFilterType: roleType,
      roleFilterValue: roleValue,
      customFilter: search.filter ? search.filter : 'active',
      orderBy: overview.orderBy,
      isRequiredOwner: false,
      ftsTerms: search.term,
      searchFieldDTOList: search.shown ? searchFieldDTOList : [],
      selectedMark: filterValue,
      showHistory: search.history,
    };

    const data = yield call(api.post, {
      resource: `${Endpoints.Task}/list`,
      query: {
        pageIndex: 0,
        pageSize: 12,
        sessionKey: uuid(),
      },
      data: requestData,
      schema: taskList,
    });
    if (data.entities) {
      if (data.entities.task) {
        const items = Object.keys(data.entities.task);
        yield put(OverviewActions.succeedFetch(OverviewTypes.Activity.Task, items, true, items.length));
        // yield put(OverviewActions.setOrderBy(OverviewTypes.Activity.Task, sortValue));
      } else {
        yield put(OverviewActions.succeedFetch(OverviewTypes.Activity.Task, [], true, items.length));
      }
      yield put(OverviewActions.feedEntities(data.entities));
    }
  } catch (e) {
    console.log(e);
  }
}

export function* handleShowHistoryTask({ showHistory }): Generator<*, *, *> {
  const state = yield select();
  try {
    const search = getSearch(state, 'TASK');
    const period = getPeriod(state, 'TASK');
    const { searchFieldDTOList } = getSearchForSave(state, 'TASK');
    const isFilterAll = period.period === 'all';
    const { roleType } = state.ui.app;
    let roleValue = state.ui.app.activeRole;
    if (roleType === 'Person' && !roleValue) {
      roleValue = state.auth.userId;
    } else if (roleType === 'Company') {
      roleValue = undefined;
    }
    const requestData = {
      startDate: isFilterAll ? null : new Date(period.startDate).getTime(),
      endDate: isFilterAll ? null : new Date(period.endDate).getTime(),
      isFilterAll,
      roleFilterType: roleType,
      roleFilterValue: roleValue,
      customFilter: showHistory ? 'history' : 'active',
      orderBy: 'dateAndTime',
      isRequiredOwner: false,
      ftsTerms: search.term,
      searchFieldDTOList: search.shown ? searchFieldDTOList : [],
      selectedMark: search.tag,
      showHistory: true,
    };
    const data = yield call(api.post, {
      resource: `${Endpoints.Task}/list`,
      query: {
        pageIndex: 0,
        pageSize: 12,
        sessionKey: uuid(),
      },
      data: requestData,
      schema: taskList,
    });
    if (data.entities) {
      if (data.entities.task) {
        const items = Object.keys(data.entities.task);

        yield put(OverviewActions.succeedFetch(OverviewTypes.Activity.Task, items, true, items.length));
        if (showHistory) {
          yield put(enableHistory(OverviewTypes.Activity.Task));
        } else {
          yield put(blockHistory(OverviewTypes.Activity.Task));
        }
      } else {
        yield put(OverviewActions.succeedFetch(OverviewTypes.Activity.Task, [], true, items.length));
      }
      yield put(OverviewActions.feedEntities(data.entities));
    }
  } catch (e) {
    console.log(e);
  }
}

export function* deleteTask({ itemId, overviewType, objectId }): Generator<*, *, *> {
  try {
    const data = yield call(api.get, {
      resource: `${Endpoints.Task}/delete/${itemId}`,
    });
    if (data === 'SUCCESS') {
      if (overviewType === OverviewTypes.Pipeline.Lead_Task) {
        const state = yield select();
        const unqualifiedDeal = state.entities.unqualifiedDeal.__DETAIL;
        yield put(fetchUnqualifiedDetail(unqualifiedDeal.uuid, false));
      } else if (overviewType === OverviewTypes.Pipeline.Qualified_Task) {
        yield put(refeshQualifiedDeal('task'));
      } else if (overviewType === OverviewTypes.Account_Task) {
        yield put(refreshOrganisation('task'));
      } else if (overviewType === OverviewTypes.Contact_Task) {
        yield put(refreshContact('task'));
      }

      yield put(OverviewActions.clearHighlight(overviewType, itemId));
      yield put(NotificationActions.success(_l`Deleted`, '', 2000));
      yield put(OverviewActions.deleteRowSuccess(overviewType, itemId));
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message, '', 2000));
  }
}
export function* setTask({ itemId, overviewType }): Generator<*, *, *> {
  /*let _keyCode = SPECIAL_TASK.QUALIFY_LEAD
    yield put(OverviewActions.clearHighlight(overviewType, itemId));
    switch(_keyCode) {//switch(_keyCode) {
      case SPECIAL_TASK.IDENTIFY_LEAD_CONTACT:
        yield put(setCurrentSpecialTask(true, SPECIAL_TASK.IDENTIFY_LEAD_CONTACT , _l`Want to create a qualify prospect reminder?`, itemId))
        break;
      case SPECIAL_TASK.QUALIFY_LEAD:
        yield put(setCurrentSpecialTask(true, SPECIAL_TASK.QUALIFY_LEAD , _l`Do you want to:`, itemId,[
          {
              "value": _l`Set prospect as lost`,
              "option": "done",
              "choose": false
          },
          {
              "value": _l`Follow up prospect later`,
              "option": "follow",
              "choose": false
          },
          {
              "value": _l`Convert prospect to deal/order`,
              "option": "convert",
              "choose": false
          }
        ]))
        break;
      case SPECIAL_TASK.FOLLOW_UP_LEAD:
        yield put(setCurrentSpecialTask(true, SPECIAL_TASK.FOLLOW_UP_LEAD , _l`Do you want to:`, itemId,[
          {
              "value": _l`Identify contact`,
              "option": "done",
              "choose": false
          },
          {
              "value": _l`Qualify prospect`,
              "option": "follow",
              "choose": false
          },
          {
              "value": _l`Follow up prospect`,
              "option": "convert",
              "choose": false
          }
        ]))
        break;
    }
    return;
    */

  const state = yield select();
  if (state.entities.task[itemId]) {
    try {
      const data = yield call(api.post, {
        resource: `${Endpoints.Task}/finish/${itemId}`,
      });

      if (data === 'SUCCESS') {
        const state = yield select();
        yield put(OverviewActions.clearHighlight(overviewType, itemId));
        yield put(NotificationActions.success(_l`Updated`, '', 2000));
        if (overviewType === OverviewTypes.Pipeline.Lead_Task) {
          const unqualifiedDeal = state.entities.unqualifiedDeal.__DETAIL;
          yield put(fetchUnqualifiedDetail(unqualifiedDeal.uuid, false));
        } else if (overviewType === OverviewTypes.Pipeline.Qualified_Task) {
          yield put(refeshQualifiedDeal('task'));
        } else if (overviewType === OverviewTypes.Account_Task) {
          yield put(refreshOrganisation('task'));
        } else if (overviewType === OverviewTypes.Contact_Task) {
          yield put(refreshContact('task'));
        }

        if (state.entities.task[itemId]) {
          let _task = state.entities.task[itemId];
          // let _keyCode = SPECIAL_TASK.IDENTIFY_LEAD_CONTACT
          switch (
            _task.focusWorkData.keyCode //switch(_keyCode) {
          ) {
            case SPECIAL_TASK.IDENTIFY_LEAD_CONTACT:
              yield put(
                setCurrentSpecialTask(
                  true,
                  SPECIAL_TASK.IDENTIFY_LEAD_CONTACT,
                  `Want to create a qualify prospect reminder?`,
                  itemId
                )
              );
              break;
            case SPECIAL_TASK.QUALIFY_LEAD:
              yield put(
                setCurrentSpecialTask(true, SPECIAL_TASK.QUALIFY_LEAD, `Do you want to:`, itemId, [
                  {
                    value: _l`Set prospect as lost`,
                    option: 'done',
                    choose: false,
                  },
                  {
                    value: _l`Follow up prospect later`,
                    option: 'follow',
                    choose: false,
                  },
                  {
                    value: _l`Convert prospect to deal/order`,
                    option: 'convert',
                    choose: false,
                  },
                ])
              );
              break;
            case SPECIAL_TASK.FOLLOW_UP_LEAD:
              yield put(
                setCurrentSpecialTask(true, SPECIAL_TASK.FOLLOW_UP_LEAD, _l`Do you want to:`, itemId, [
                  {
                    value: _l`Identify contact`,
                    option: 'done',
                    choose: false,
                  },
                  {
                    value: _l`Qualify prospect`,
                    option: 'follow',
                    choose: false,
                  },
                  {
                    value: _l`Follow up prospect`,
                    option: 'convert',
                    choose: false,
                  },
                ])
              );
              break;
          }
        }
      }
    } catch (e) {
      yield put(NotificationActions.error(e.message, '', 2000));
    }
  }
}
export function* delegateTask({ userId, taskId, overviewType }): Generator<*, *, *> {
  try {
    const query = userId ? { userId } : null;
    const data = yield call(api.post, {
      resource: `${Endpoints.Task}/distribute/${taskId}`,
      query: query,
    });
    if (data === 'SUCCESS') {
      if (overviewType === OverviewTypes.Pipeline.Lead_Task) {
        const state = yield select();
        const unqualifiedDeal = state.entities.unqualifiedDeal.__DETAIL;
        yield put(fetchUnqualifiedDetail(unqualifiedDeal.uuid, false));
      } else if (overviewType === OverviewTypes.Pipeline.Qualified_Task) {
        yield put(refeshQualifiedDeal('task'));
      } else if (overviewType === OverviewTypes.Account_Task) {
        yield put(refreshOrganisation('task'));
      } else if (overviewType === OverviewTypes.Contact_Task) {
        yield put(refreshContact('task'));
      }
      yield put(OverviewActions.clearHighlight(overviewType, taskId));
      yield put(NotificationActions.success(_l`Updated`, '', 2000));
      yield put(OverviewActions.delegateTaskSuccess(overviewType, taskId));
      yield put(OverviewActions.requestFetch(overviewType));
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message, '', 2000));
  }
}
export function* delegateAccept({ userId, taskId, overviewType, accepted }): Generator<*, *, *> {
  try {
    const data = yield call(api.post, {
      resource: `${Endpoints.Task}/decide/${taskId}`,
      query: {
        userId: userId,
        accepted,
      },
    });
    if (data === 'SUCCESS') {
      //SET FOR FEATURES # TASK
      if (overviewType === OverviewTypes.Pipeline.Lead_Task) {
        const state = yield select();
        const unqualifiedDeal = state.entities.unqualifiedDeal.__DETAIL;
        yield put(fetchUnqualifiedDetail(unqualifiedDeal.uuid, false));
      } else if (overviewType === OverviewTypes.Pipeline.Qualified_Task) {
        yield put(refeshQualifiedDeal('task'));
      } else if (overviewType === OverviewTypes.Account_Task) {
        yield put(refreshOrganisation('task'));
      } else if (overviewType === OverviewTypes.Contact_Task) {
        yield put(refreshContact('task'));
      }

      yield put(OverviewActions.clearHighlight(overviewType, taskId));
      yield put(NotificationActions.success(_l`Reminder accepted`, '', 2000));
      yield put(OverviewActions.requestFetch(overviewType, true));
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}
export function* delegateDecline({ userId, taskId, overviewType, accepted, objectId }): Generator<*, *, *> {
  try {
    const data = yield call(api.post, {
      resource: `${Endpoints.Task}/decide/${taskId}`,
      query: {
        userId: userId,
        accepted,
      },
    });
    if (data === 'SUCCESS') {
      if (overviewType === OverviewTypes.Pipeline.Lead_Task) {
        const state = yield select();
        const unqualifiedDeal = state.entities.unqualifiedDeal.__DETAIL;
        yield put(fetchUnqualifiedDetail(unqualifiedDeal.uuid, false));
      } else if (overviewType === OverviewTypes.Pipeline.Qualified_Task) {
        yield put(refeshQualifiedDeal('task'));
      } else if (overviewType === OverviewTypes.Account_Task) {
        yield put(refreshOrganisation('task'));
      } else if (overviewType === OverviewTypes.Contact_Task) {
        yield put(refreshContact('task'));
      }

      yield put(OverviewActions.clearHighlight(overviewType, taskId));
      yield put(NotificationActions.success(_l`Task declined`, '', 2000));
      yield put(OverviewActions.requestFetch(overviewType, true));
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}
export function* assignToMe({ taskId, overviewType }): Generator<*, *, *> {
  try {
    const state = yield select();
    const data = yield call(api.post, {
      resource: `${Endpoints.Task}/decide/${taskId}`,
      query: {
        userId: state.auth.userId,
        accepted: true,
      },
    });
    if (data === 'SUCCESS') {
      yield put(OverviewActions.clearHighlight(overviewType, taskId));
      yield put(NotificationActions.success(_l`Updated`, '', 2000));
      yield put(OverviewActions.requestFetch(overviewType, true));
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}
export function* changeTagTask({ enterpriseID, token, taskId, tagId, overviewType }): Generator<*, *, *> {
  yield put(OverviewActions.clearHighlight(overviewType, taskId));
  try {
    const data = yield call(api.post, {
      resource: `${Endpoints.Task}/tag`,
      query: {
        enterpriseID: enterpriseID,
        token: token,
        taskId: taskId,
        tagId: tagId,
      },
    });
    if (data === 'SUCCESS') {
      if (overviewType === OverviewTypes.Pipeline.Lead_Task) {
        const state = yield select();
        const unqualifiedDeal = state.entities.unqualifiedDeal.__DETAIL;
        yield put(fetchUnqualifiedDetail(unqualifiedDeal.uuid, false));
      } else if (overviewType === OverviewTypes.Pipeline.Qualified_Task) {
        yield put(refeshQualifiedDeal('task'));
      } else if (overviewType === OverviewTypes.Account_Task) {
        yield put(refreshOrganisation('task'));
      } else if (overviewType === OverviewTypes.Contact_Task) {
        yield put(refreshContact('task'));
      }
      yield put(NotificationActions.success(_l`Updated`, '', 2000));
      yield put(OverviewActions.requestFetch(overviewType, true));
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message, '', 2000));
  }
}

function* changeOnMutilTaskMenu({ option, optionValue, overviewType }) {
  const state = yield select();
  let overviewT = OverviewTypes.Activity.Task;
  let objectT = ObjectTypes.Task;
  if (overviewType === OverviewTypes.Delegation.Task) {
    overviewT = OverviewTypes.Delegation.Task;
    objectT = ObjectTypes.Delegation;
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
      isRequiredOwner: false,
      ftsTerms: search.term,
      searchFieldDTOList: search.shown ? searchFieldDTOList : [],
      selectedMark: search.tag,
      showHistory: true,
      isDelegateTask: overviewType === OverviewTypes.Delegation.Task ? true : false,
    };
    const assignTaskDTO = {
      note: optionValue ? optionValue.note : '',
      userId: state.auth.userId,
    };
    const { selectAll, selected } = overview;
    const isSelectedAll = selectAll;
    let taskIds = [];
    let unSelectedIds = [];
    const keys = Object.keys(selected);
    if (isSelectedAll) {
      taskIds = [];
      unSelectedIds = keys.filter((key) => selected[key] === false);
    } else {
      taskIds = keys.filter((key) => selected[key] === true);
    }
    let request = null;
    let payload = {
      filterDTO,
      isSelectedAll,
      taskIds,
      unSelectedIds,
      assignTaskDTO,
    };
    if (option === 'change_reponsible') {
      request = call(api.post, {
        resource: `${Endpoints.Task}/changeOwnerInBatch`,
        data: {
          ownerId: optionValue,
          ...payload,
        },
        query: {
          timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'add_to_mailchimp_list') {
      request = call(api.post, {
        resource: `${Endpoints.Task}/sendMailChimpInBatch`,
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
    } else if (option === 'delete_tasks') {
      request = call(api.post, {
        resource: `${Endpoints.Task}/deleteInBatch`,
        data: {
          ...payload,
        },
        query: {
          timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'export_to_excel') {
      let filterDTOCus0 = { ...filterDTO, listIds: taskIds };
      let filterDTOCus = { ...payload, filterDTO: filterDTOCus0 };
      // filterDTOCus.isRequiredOwner = false;
      // filterDTOCus.isShowHistory = filterDTO.customFilter == 'history';
      request = call(api.get, {
        resource: `${Endpoints.Task}/exportAdvancedSearchBySelected`,
        query: {
          filterDTO: JSON.stringify(filterDTOCus),
          taskFrom: overviewType === OverviewTypes.Delegation.Task ? 'task_delegation' : 'task',
          timeZone: new Date().getTimezoneOffset() / -60,
          // timeZone: getCurrentTimeZone(),

        },
      });
    } else if (option === 'set_done_tasks') {
      request = call(api.post, {
        resource: `${Endpoints.Task}/setDoneInBatch`,
        data: {
          ...payload,
        },
        query: {
          timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'update_data_fields') {
      let customFieldDTOList = [];
      const customFields = getCustomFieldsObject(state);
      customFields.forEach((customField) => {
        const { customFieldValueDTOList } = customField;
        if (customFieldValueDTOList.length > 0) {
          if (customField.fieldType === 'DROPDOWN') {
            const checkForValueSelected = customFieldValueDTOList.filter((value) => {
              return value.isChecked === true;
            });
            if (checkForValueSelected.length > 0) {
              customFieldDTOList.push(customField);
            }
          } else {
            customFieldDTOList.push(customField);
          }
        }
      });

      request = call(api.post, {
        resource: `${Endpoints.Task}/customFieldValue/updateAll`,
        data: {
          ...payload,
          customFieldDTOList,
          standardFieldDTO: {
            ...optionValue,
          },
        },
        query: {
          timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'add_to_call_list') {
      request = call(api.post, {
        resource: `${Endpoints.Task}/sendCallListInBatch`,
        data: {
          ...payload,
          sendCallListDTO: {
            ...optionValue,
          },
        },
        query: {
          timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'assign_multi_task_to_me') {
      request = call(api.post, {
        resource: `${Endpoints.Task}/assignToMeInBatch`,
        query: {
          sessionKey: uuid(),
          timeZone: getCurrentTimeZone(),
        },
        data: {
          ...payload,
        },
      });
    } else if (option === 'assign_multi_task') {
      request = call(api.post, {
        resource: `${Endpoints.Task}/assignInBatch`,
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
      case 'delete_tasks':
        message = `${_l`Updated`}`;
        break;
      case 'set_done_tasks':
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

    if (data.message === 'SUCCESS' || data.isSuccess) {
      yield put(OverviewActions.requestFetch(overviewT, true));
      yield put(OverviewActions.clearHighlightAction(overviewT));

      switch (option) {
        case 'assign_multi_task':
          yield put(OverviewActions.setSelectAll(overviewT, false));
          break;
        default:
          break;
      }
      if (
        option == 'change_reponsible' ||
        option == 'add_to_call_list' ||
        option == 'update_data_fields' ||
        option == 'set_done_tasks' ||
        option == 'delete_tasks' ||
        option == 'add_to_call_list'
      ) {
        return yield put(NotificationActions.success(_l`Updated`, '', 2000));
      }
      // else if (option === 'assign_multi_task_to_me' || option === 'assign_multi_task') {
      //   return yield put(NotificationActions.success(_l`Updated`, '', 2000));
      // }
      if (option === 'add_to_mailchimp_list') {
        return yield put(NotificationActions.success(message, null, null, true));
      }
    }
  } catch (e) {
    if (option === 'add_to_mailchimp_list') {
      // return yield put(NotificationActions.success(message, null, null, true));
      yield put(OverviewActions.clearHighlightAction(overviewT));
    }
    yield console.log('>>>>>>>>>>>>>>', e, e.message);
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}

export function* addTask({ overviewType }): Generator<*, *, *> {
  const state = yield select();

  let overviewT = OverviewTypes.Activity.Task;
  let objectT = ObjectTypes.Task;
  if (overviewType === OverviewTypes.Delegation.Task) {
    overviewT = OverviewTypes.Delegation.Task;
    objectT = ObjectTypes.Delegation;
  }

  try {
    const _CREATE = getCreateTask(state);
    if (_CREATE.organisationDTO || _CREATE.organisationDTO === null) delete _CREATE.organisationDTO;
    if (_CREATE.contactDTO || _CREATE.contactDTO === null) delete _CREATE.contactDTO;
    const data = yield call(api.post, {
      resource: `${Endpoints.Task}/add`,
      data: {
        ..._CREATE,
        ownerId: _CREATE.ownerId ? _CREATE.ownerId : state.auth.userId,
      },
    });
    if (data) {
      //new feature
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
        // customFilter: search.filter ? search.filter : 'active',
        customFilter: 'active',
        orderBy: search.orderBy ? search.orderBy : 'dateAndTime',
        isRequiredOwner: false,
        ftsTerms: search.term,
        searchFieldDTOList: search.shown ? searchFieldDTOList : [],
        selectedMark: search.tag,
        showHistory: true,
        isDelegateTask: overviewType === OverviewTypes.Delegation.Task ? true : false,
      };

      let payload = {
        filterDTO,
        isSelectedAll: false,
        taskIds: [data.uuid],
        unSelectedIds: [],
      };

      let customFieldDTOList = [];
      const customFields = getCustomFieldsObject(state);
      customFields.forEach((customField) => {
        const { customFieldValueDTOList } = customField;
        if (customFieldValueDTOList.length > 0) {
          if (customField.fieldType === 'DROPDOWN') {
            const checkForValueSelected = customFieldValueDTOList.filter((value) => {
              return value.isChecked === true;
            });
            if (checkForValueSelected.length > 0) {
              customFieldDTOList.push(customField);
            }
          } else {
            customFieldDTOList.push(customField);
          }
        }
      });

      yield call(api.post, {
        resource: `${Endpoints.Task}/customFieldValue/updateAll`,
        data: {
          ...payload,
          customFieldDTOList,
          standardFieldDTO: {},
        },
        query: {
          timeZone: getCurrentTimeZone(),
        },
      });

      yield put(OverviewActions.clearHighlight(overviewType));
      yield put(NotificationActions.success(_l`Added`, '', 2000));
      yield put(OverviewActions.requestFetch(OverviewTypes.Activity.Task, true));
      yield call(fetchTaskNotification);
      if (overviewType === OverviewTypes.Pipeline.Lead_Task) {
        // const state = yield select();
        // const unqualifiedDeal = state.entities.unqualifiedDeal.__DETAIL;
        // yield put(fetchUnqualifiedDetail(unqualifiedDeal.uuid, false));
        yield put(refeshUnqualifiedDetail('task'));
      } else if (overviewType === OverviewTypes.Pipeline.Qualified_Task) {
        yield put(refeshQualifiedDeal('task'));
      } else if (overviewType === OverviewTypes.Pipeline.Order_Task) {
        yield put(refeshQualifiedDeal('task'));
      } else if (
        overviewType === OverviewTypes.Account_Task ||
        overviewType === OverviewTypes.Account_Qualified_Task ||
        overviewType === OverviewTypes.Account_Order_Task ||
        overviewType === OverviewTypes.CallList.SubAccount
      ) {
        yield put(refreshOrganisation('task'));
      } else if (
        overviewType === OverviewTypes.Contact_Task ||
        overviewType === OverviewTypes.Contact_Qualified_Task ||
        overviewType === OverviewTypes.Contact_Order_Task ||
        overviewType === OverviewTypes.Contact_Contact_Task ||
        overviewType === OverviewTypes.CallList.SubContact
      ) {
        yield put(refreshContact('task'));
      }
      yield put(clearCreateEntity());
    }
  } catch (error) {
    if (error.message === 'ALREADY_HAS_A_TASK_WITH_SAME_FOCUS') {
      yield put(NotificationActions.error(_l`There is already an active reminder with this focus`));
    } else {
      yield put(NotificationActions.error(error.message));
    }
  }
}

export function* updateTask({ overviewType }): Generator<*, *, *> {
  const state = yield select();
  const auth = getAuth(state);
  try {
    const __EDIT = getUpdateTask(state);
    if (__EDIT.organisationDTO || __EDIT.organisationDTO === null) delete __EDIT.organisationDTO;
    if (__EDIT.contactDTO || __EDIT.contactDTO === null) delete __EDIT.contactDTO;
    const data = yield call(api.post, {
      resource: `${Endpoints.Task}/update`,
      data: __EDIT,
    });
    yield call(fetchTaskNotification);
    const customFieldValues = getCustomFieldValues(state, __EDIT.uuid);

    if (data) {
      if (overviewType === OverviewTypes.Pipeline.Lead_Task) {
        const state = yield select();
        const unqualifiedDeal = state.entities.unqualifiedDeal.__DETAIL;
        yield put(fetchUnqualifiedDetail(unqualifiedDeal.uuid, false));
      } else if (overviewType === OverviewTypes.Pipeline.Qualified_Task) {
        yield put(refeshQualifiedDeal('task'));
      } else if (overviewType === OverviewTypes.Account_Task || overviewType === OverviewTypes.CallList.SubAccount) {
        yield put(refreshOrganisation('task'));
      } else if (overviewType === OverviewTypes.Contact_Task || overviewType === OverviewTypes.CallList.SubContact) {
        yield put(refreshContact('task'));
      }
      yield put(OverviewActions.clearHighlight(overviewType));
      yield put(NotificationActions.success(_l`Updated`, '', 2000));
      yield put(requestFetchTask(__EDIT.uuid));
      yield put(OverviewActions.requestFetch(overviewType, true));
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
    if (error.message === 'ALREADY_HAS_A_TASK_WITH_SAME_FOCUS') {
      yield put(NotificationActions.error(_l`There is already an active reminder with this focus`));
    } else {
      yield put(NotificationActions.error(error.message));
    }
  }
}

export function* fetchLead({ taskId }): Generator<*, *, *> {
  try {
    const data = yield call(api.get, {
      query: {
        taskId,
      },
      resource: `${Endpoints.Lead}/getLeadOnTask`,
      schema: leadSchema,
    });
    if (data) {
      yield put(updateTaskLead(data.result));
      return data;
    }
  } catch (error) {
    console.log(error.message);
  }
}

export function* updateTaskConnectToOpportunity({ form, taskDTO }): Generator<*, *, *> {
  yield put(startSubmit(form));

  try {
    const data = yield call(api.post, {
      resource: `${Endpoints.Task}/update`,
      data: taskDTO,
    });

    if (data) {
      yield put(NotificationActions.success(_l`Updated`, '', 2000));
      yield put(requestFetchTask(taskDTO.uuid));
    }
  } catch (error) {
    yield put(NotificationActions.error(_l`Updated`, 'error', 2000));
    yield put(createError({ response: error.message }));
    yield put(stopSubmit(form, { _error: e.message }));
  }
}

export function* addMailchimp({ data }): Generator<*, *, *> {
  try {
    const dataResult = yield call(api.post, {
      resource: `${Endpoints.Campaign}/mailChimp/addMailChimpList`,
      data: data,
    });
    if (dataResult && dataResult.isSuccess) {
      yield put(NotificationActions.success('Added', '', 3000));
      // TODO: add handle success case!
    } else if (dataResult && !dataResult.isSuccess && dataResult.result[0] === 'MAILCHIMP_ERROR') {
      yield put(NotificationActions.error('User does not have access to the requested operation'));
    } else {
      // yield put(NotificationActions.error('Add mailchimp error'));
      yield put(NotificationActions.error('You need to connect Mailchimp account to Salesbox first'));
    }
  } catch (e) {
    yield put(NotificationActions.error('Add mailchimp error'));
  }
}

function* convertTaskDto(qualifyLeadDTO, tagDTO, leadOnTask) {
  const __auth = yield select((state) => state.auth);
  const __time = yield call(api.get, {
    resource: `${Endpoints.Task}/getOwnerFreeDateForTask`,
    query: {
      ownerId: __auth && __auth.userId ? __auth.userId : '',
      timeZone: new Date().getTimezoneOffset() / -60,
    },
  });
  return {
    organisationId: leadOnTask.organisationId,
    contactId: leadOnTask.contactId,
    focusWorkData: qualifyLeadDTO,
    tagDTO: tagDTO,
    dateAndTime: __time,
  };
}

function generateLeadDTO(lead) {
  let leadDTO = {
    contactId: lead.contactId ? lead.contactId : null,
    note: lead.note,
    ownerId: lead.ownerId ? lead.ownerId : null,
    lineOfBusiness: lead.lineOfBusiness ? { uuid: lead.lineOfBusiness.uuid } : null,
    type: 'MANUAL',
    priority: lead.priority,
  };

  if (lead.uuid) {
    leadDTO.uuid = lead.uuid;
  }
  if (lead.status) {
    leadDTO.status = lead.status;
  }
  if (lead.organisationId) {
    leadDTO.organisationId = lead.organisationId;
  }

  if (lead.productList.length > 0) {
    let productIds = [];
    lead.productList.forEach(function(object) {
      productIds.push({ uuid: object.uuid });
    });
    leadDTO.productList = productIds;
  }

  return leadDTO;
}

function* convertToDeal(lead) {
  // console.log("function*convertToDeal -> lead", lead)
  // lead.productList = [{"uuid":"58cf7d8f-d43c-42ac-b0c9-f5a64beb7273","name":"Apple","price":1.0E8,"active":true,"quantity":2.0,"margin":2.0,"lineOfBusinessId":"ffd43d75-6f8c-4ce3-814a-dca9b41ddb95","measurementTypeId":"3e6a139a-57c2-41f3-9538-a5c0454addef","measurementTypeName":"Sản phẩm","lineOfBusinessName":null,"costUnit":9.8E7,"description":"apple.com"},{"uuid":"1549d605-7ba0-4c67-84e4-a443815e2eb8","name":"check","price":3454563.0,"active":true,"quantity":23.0,"margin":100.0,"lineOfBusinessId":"ffd43d75-6f8c-4ce3-814a-dca9b41ddb95","measurementTypeId":"3e6a139a-57c2-41f3-9538-a5c0454addef","measurementTypeName":"Sản phẩm","lineOfBusinessName":null,"costUnit":3.0,"description":"https://www.apple.com/iphone/?cid=oas-us-domains-iphone.com"},{"uuid":"d57246ad-d672-4ae2-b981-962eb4c17602","name":"dfdf","price":6777.777,"active":true,"quantity":3.5,"margin":16.41,"lineOfBusinessId":"ffd43d75-6f8c-4ce3-814a-dca9b41ddb95","measurementTypeId":"1a7187cf-b08a-42a1-a3bc-c61439e66b46","measurementTypeName":"mac","lineOfBusinessName":null,"costUnit":5665.6546,"description":null},{"uuid":"5eaa95f8-e31f-4b8b-9105-ca5c0c16782e","name":"ExecutiveAssistant","price":1.0,"active":true,"quantity":2.0,"margin":-200.0,"lineOfBusinessId":"ffd43d75-6f8c-4ce3-814a-dca9b41ddb95","measurementTypeId":"3e6a139a-57c2-41f3-9538-a5c0454addef","measurementTypeName":"Sản phẩm","lineOfBusinessName":null,"costUnit":3.0,"description":"gmail.vn"},{"uuid":"c663258c-8589-4640-98fd-2665a6847dc8","name":"HRChef","price":1.312432435E9,"active":true,"quantity":2.0,"margin":100.0,"lineOfBusinessId":"ffd43d75-6f8c-4ce3-814a-dca9b41ddb95","measurementTypeId":"3e6a139a-57c2-41f3-9538-a5c0454addef","measurementTypeName":"Sản phẩm","lineOfBusinessName":null,"costUnit":2.0,"description":"iphone.com"},{"uuid":"27c667fb-346a-468c-91ea-b98d53aa73d6","name":"iPad","price":1.2E8,"active":true,"quantity":1.0,"margin":100.0,"lineOfBusinessId":"ffd43d75-6f8c-4ce3-814a-dca9b41ddb95","measurementTypeId":"3e6a139a-57c2-41f3-9538-a5c0454addef","measurementTypeName":"Sản phẩm","lineOfBusinessName":null,"costUnit":3.0,"description":"ipad.com"},{"uuid":"7e0110c6-2c0f-4341-9a0a-52f7a8c66926","name":"iPhone","price":100000.0,"active":true,"quantity":5.0,"margin":5.0,"lineOfBusinessId":"ffd43d75-6f8c-4ce3-814a-dca9b41ddb95","measurementTypeId":"3e6a139a-57c2-41f3-9538-a5c0454addef","measurementTypeName":"Sản phẩm","lineOfBusinessName":null,"costUnit":95000.0,"description":"iphone.com"},{"uuid":"84d34ac0-6b86-4e0b-842f-fb8e0fea8356","name":"macbook","price":235345.0,"active":true,"quantity":6.0,"margin":8.0,"lineOfBusinessId":"ffd43d75-6f8c-4ce3-814a-dca9b41ddb95","measurementTypeId":"1a7187cf-b08a-42a1-a3bc-c61439e66b46","measurementTypeName":"mac","lineOfBusinessName":null,"costUnit":216517.4,"description":"mac.com"},{"uuid":"f5085923-b81c-44d2-9f28-848d30703340","name":"product1","price":1.0E7,"active":true,"quantity":1.0,"margin":100.0,"lineOfBusinessId":"ffd43d75-6f8c-4ce3-814a-dca9b41ddb95","measurementTypeId":"3e6a139a-57c2-41f3-9538-a5c0454addef","measurementTypeName":"Sản phẩm","lineOfBusinessName":null,"costUnit":7.0,"description":"abc.com"}]
  let _deal = {};
  if (lead.organisationId != null) {
    _deal.organisation = { uuid: lead.organisationId, name: lead.organisationName };
  }
  if (lead.contactId) {
    _deal.sponsorList = [{ uuid: lead.contactId }];
  }
  if (lead.lineOfBusiness && lead.lineOfBusiness.salesMethodDTO && lead.lineOfBusiness.salesMethodDTO.name) {
    _deal.salesMethod = {
      name: lead.lineOfBusiness.salesMethodDTO.name,
      uuid: lead.lineOfBusiness.salesMethodDTO.uuid,
    };
  }
  let data = [];
  for (let i = 0; i < lead.productList.length; i++) {
    let product = lead.productList[i];
    data.push({
      id: product.uuid,
      margin: product.margin,
      quantity: product.quantity,
      measurementTypeId: product.measurementTypeId,
      price: product.price,
      product: product.uuid,
      lineOfBusinessId: product.lineOfBusinessId,
      productDTO: product,
    });
  }
  if (data.length > 0) yield put(createAndUpdateOrderRow(data));
  yield put(autoFillForm(_deal));
  yield put(setActionForHighlight(OverviewTypes.Pipeline.Qualified, FORM_ACTION.CREATE));
}

function* addQualifyLead({ typeTask, mode }) {
  const __common = yield select((state) => state.common);
  const __entities = yield select((state) => state.entities);
  let _taskId = __entities.task && __entities.task.currentSpecialTask.taskId;
  let _specialTask;
  if (Object.keys(__common.specialTask).length === 0) {
    _specialTask = yield call(getSpecialTask);
  } else {
    _specialTask = __common.specialTask;
  }
  let _leadOnTask = yield call(fetchLead, { taskId: _taskId });
  let _lead = _leadOnTask.entities.lead[_leadOnTask.result];
  // console.log("function*addQualifyLead -> _lead", _lead)
  // let _lead = JSON.parse('{"uuid":"59ff57cd-4e13-43b5-b191-4ae87d4c5ca5","contactId":"1dd20ecf-5782-41cc-bc3f-f7cbbe58a9a1","organisationId":"6e71e9d5-0e7d-4b7f-b876-34399a3d255a","ownerId":"15421e5d-9f46-4d46-916a-73f440c09cc7","note":null,"sharedContactId":"73d62e90-2ad0-4618-900e-2aed3abf1c3b","contactFirstName":"VU Van Hoc","contactLastName":"001","contactEmail":null,"contactPhone":null,"contactAvatar":null,"contactDiscProfile":"BLUE","organisationName":"trung test 15","organisationEmail":null,"organisationPhone":null,"productList":[],"leadBoxerId":null,"visitMore":false,"lineOfBusiness":null,"ownerFirstName":"[QA]","ownerLastName":"Dao Vo","ownerAvatar":"a7147902-ce21-4fa7-b570-f80bb579b54e","ownerDiscProfile":"BLUE","ownerMedianLeadTime":8339882009,"creatorId":"15421e5d-9f46-4d46-916a-73f440c09cc7","creatorFirstName":"[QA]","creatorLastName":"Dao Vo","creatorAvatar":"a7147902-ce21-4fa7-b570-f80bb579b54e","creatorDiscProfile":"BLUE","priority":60.0,"finished":false,"deleted":false,"accepted":null,"type":"MANUAL","prospectId":null,"source":"NONE","updatedDate":1594092890875,"createdDate":1594090328719,"finishedDate":null,"deadlineDate":1593882000000,"campaignId":null,"facebookId":null,"linkedInId":null,"mailChimpId":null,"mailChimpTotalClick":0,"mailChimpTotalOpen":0,"tempEmail":null,"tempFirstName":null,"tempLastName":null,"tempCompanyName":null,"status":"unqualified","gmt":null,"distributionDate":null,"countOfActiveTask":null,"countOfActiveAppointment":0,"lastSyncTime":1594090328719}')
  switch (typeTask) {
    case SPECIAL_TASK.IDENTIFY_LEAD_CONTACT:
      if (_lead) {
        let __taskDTO = yield call(convertTaskDto, _specialTask.QUALIFY_LEAD, _specialTask.EXTERNAL_FOLLOW_UP, _lead);
        yield put(fillFormCreateTask(__taskDTO));
        yield put(setActionForHighlight(OverviewTypes.Activity.Task, FORM_ACTION.CREATE));
      }
      break;
    case SPECIAL_TASK.FOLLOW_UP_LEAD:
    case SPECIAL_TASK.QUALIFY_LEAD:
      if (_lead) {
        let _leadDTO = generateLeadDTO(_lead);
        _lead.status = 'qualified';
        let responseLead = yield call(updateLead, { lead: _leadDTO });
        // console.log("function*addQualifyLead -> responseLead", responseLead)
        yield put(setCurrentSpecialTask(false));
        switch (mode) {
          case 'done':
            yield call(setDoneLead, { leadId: responseLead.uuid });
            break;
          case 'follow':
            if (_lead) {
              let __taskDTO = yield call(
                convertTaskDto,
                _specialTask.FOLLOW_UP_LEAD,
                _specialTask.EXTERNAL_FOLLOW_UP,
                _lead
              );
              yield put(fillFormCreateTask(__taskDTO));
              yield put(setActionForHighlight(OverviewTypes.Activity.Task, FORM_ACTION.CREATE));
            }
            break;
          case 'convert':
            yield call(convertToDeal, responseLead);
            break;
        }
      }
      break;
  }
}

let listTaskNoti = [];
export function* fetchTaskNotification() {
  try {
    const auth = yield select((state) => state.auth);
    let res = yield call(api.get, {
      resource: `${Endpoints.Task}/getListActiveTaskWithOwnerInNextOneWeek`,
      query: {
        ownerId: auth.userId,
      },
    });
    let _lengthTask = listTaskNoti.length;
    if (_lengthTask > 0) {
      for (let j = 0; j < _lengthTask; j++) {
        yield cancel(listTaskNoti[j]);
      }
    }
    if (res && res.taskDTOList.length > 0) {
      for (let i = 0; i < res.taskDTOList.length; i++) {
        let task = res.taskDTOList[i];
        let noti = {
          timeOut: task.dateAndTime - new Date().getTime(),
          content: '',
          notificationDate: task.dateAndTime,
        };
        let displayText = 'Your reminder';
        if ((task.focusWorkData && task.focusWorkData.name) || (task.focusActivity && task.focusActivity.name)) {
          let focusName = task.focusWorkData ? task.focusWorkData.name : task.focusActivity.name;
          displayText += ` with focus to <span class="text-bold">${focusName}</span>`;
        }

        if (task.organisationName) {
          displayText += ` on <span class="text-bold">${task.organisationName}</span>`;
        } else {
          if (task.contactName) {
            displayText += ` on <span class="text-bold">${task.contactName}</span>`;
          }
        }
        displayText += ' is up!';
        noti.content = displayText;
        const _noti = yield fork(timeoutNotification, noti);
        listTaskNoti.push(_noti);
      }
    }
  } catch (Ex) {}
}

export default function* saga(): Generator<*, *, *> {
  yield all(activitiesTaskOverviewSagas);
  yield all(delegateTaskOverviewSagas);
  yield takeLatest(ActionTypes.CHANGE_NOTE_SAGA, updateNote);
  yield takeLatest(ActionTypes.SORT_BY_DATE, sortByDate);
  // yield takeLatest(ActionTypes.HANDLE_SHOW_HISTORY, handleShowHistoryTask);
  yield takeLatest(OverviewActionTypes.DELETE_ROW, deleteTask);
  yield takeLatest(OverviewActionTypes.SET_TASK, setTask);
  yield takeLatest(ActionTypes.DELEGATE_TASK, delegateTask);
  yield takeLatest(ActionTypes.DELEGATE_ACCEPT, delegateAccept);
  yield takeLatest(ActionTypes.DELEGATE_DECLINE, delegateDecline);
  yield takeLatest(ActionTypes.CHANEG_TAG_TASK, changeTagTask);
  yield takeLatest(ActionTypes.CHANGE_ON_MUTIL_TASK_MENU, changeOnMutilTaskMenu);
  yield takeLatest(ActionTypes.CREATE_ENTITY_FETCH, addTask);
  yield takeLatest(ActionTypes.UPDATE_ENTITY_FETCH, updateTask);
  yield takeLatest(ActionTypes.FETCH_LEAD_BY_TASK, fetchLead);
  yield takeLatest(ActionTypes.UPDATE_CONNECT_QUALIFIED_DEAL, updateTaskConnectToOpportunity);
  yield takeLatest(ActionTypes.ADD_MAILCHIMP, addMailchimp);
  yield takeLatest(ActionTypes.ASSIGN_TO_ME, assignToMe);
  yield takeLatest(ActionTypes.ADD_QUALIFY_LEAD, addQualifyLead);
}

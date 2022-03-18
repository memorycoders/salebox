//@flow
import { all, takeLatest, call, put, select, fork } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { ObjectTypes, OverviewTypes, Endpoints } from 'Constants';
import api from 'lib/apiClient';
import {
  getCreateQualifiedDeal,
  getSaleProcessActive,
  getSaleProcessActiveMode,
  isListShowQualified,
  getSaleMethodActive,
  getSaleProcessInOrderActive,
} from './qualifiedDeal.selector';
import * as NotificationActions from 'components/Notification/notification.actions';
import * as OverviewActions from 'components/Overview/overview.actions';
import _l from 'lib/i18n';
import createOverviewSagas from 'components/Overview/overview.saga';
import { getSearch, getSearchForSave } from 'components/AdvancedSearch/advanced-search.selectors';
import { getPeriod } from 'components/PeriodSelector/period-selector.selectors';
import { qualifiedDeal } from './qualifiedDeal.schema';
import { getOverview } from '../Overview/overview.selectors';
import { makeGetUser } from '../User/user.selector';
import * as QualifiedActions from './qualifiedDeal.actions';
import { getCustomFieldsObject, getCustomFieldValues } from '../CustomField/custom-field.selectors';
import { PERFORM_SEARCH, HIDE_SEARCH, SELECT_SAVED } from '../AdvancedSearch/advanced-search.actions';
import * as TrelloActions from '../PipeLineQualifiedDeals/TaskSteps/TrelloElement/trello-action';
import { setResourceForAddDealInListResource, setAddMultiDealResource } from '../Resources/resources.actions';

// import { fetch } from '../Lead/lead.actions';

import ActionTypes, {
  succeedFetchNotes,
  succeedFetchAppointments,
  refeshTasks,
  succeedFetchTasks,
  clearCreateEntity,
  fetchCountByStepsSuccess,
  fetchQualifiedDataSuccess,
  fetchListSaleProcessSuccess,
  updateListActivity,
  fetchListSaleProcess,
  requestFetchNotes,
  succeedFetchActionPlan,
  succeedFetchProducts,
  fetchPhotos,
  fetchDocumentsStorageSuccess,
  fetchGetRootFolderSuccess,
  fetchDocumentsByFileIdSuccess,
  fetchDocumentsByFileIdFail,
} from './qualifiedDeal.actions';
import { clear, create, copyEntity } from '../OrderRow/order-row.actions';
import { contactItem, refreshContact } from '../Contact/contact.actions';
import { organisationItem, refreshOrganisation } from '../Organisation/organisation.actions';
import uuid from 'uuid/v4';
import generateUuid from 'uuid/v4';
import { taskList } from '../Task/task.schema';
import { collectOtherParamInList, succeedFetch, collectOtherResultFilter } from '../Overview/overview.actions';
import { fetchQualifiedDetail } from './qualifiedDeal.actions';
import * as OrganisationActions from '../Organisation/organisation.actions';
import OrganisationActionTypes from '../Organisation/organisation.actions';
import { updateDocumentObjectId } from '../Common/common.actions';
import * as TaskActions from '../Task/task.actions';
import * as AppointmentActions from '../Appointment/appointment.actions';
const SALE_METHOR_ENPOINT = 'administration-v3.0/salesMethod';
const documentEndPoints = 'document-v3.0';
import { getCurrentTimeZone } from 'lib/dateTimeService';
import { getDealInTrelloById } from '../PipeLineQualifiedDeals/TaskSteps/TrelloElement/trello-selectors';
import * as ResourcesActionsTypes from '../Resources/resources.actions';

addTranslations({
  'en-US': {
    Added: 'Added',
    'Cannot add order without products': 'Cannot add order without products',
  },
});
// const timezone = new Date().getTimezoneOffset() / -60;
let timeZone = getCurrentTimeZone();

const overviewSagas = createOverviewSagas(
  {
    list: `${Endpoints.Prospect}/listES`,
    count: `${Endpoints.Prospect}/countProspectBySalesProcessES`,
  },
  OverviewTypes.Pipeline.Qualified,
  ObjectTypes.PipelineQualified,
  'qualifiedDeal',
  qualifiedDeal,
  (requestData) => {
    const {
      showHistory,
      roleFilterType,
      roleFilterValue,
      searchFieldDTOList,
      startDate,
      ftsTerms,
      customFilter,
      endDate,
      isFilterAll,
      isRequiredOwner,
      selectedMark,
      orderBy,
      salesProcessIds,
    } = requestData;
    return {
      showHistory,
      customFilter,
      endDate,
      ftsTerms,
      isFilterAll,
      isRequiredOwner,
      orderBy,
      roleFilterType,
      roleFilterValue,
      searchFieldDTOList,
      startDate,
      salesProcessIds,
    };
  },
  (query) => {
    return {
      ...query,
      timeZone: getCurrentTimeZone(),
    };
  }
);

export const getUserId = (state) => state.auth.userId;

const OrderoverviewSagas = createOverviewSagas(
  {
    list: `${Endpoints.Prospect}/listES`,
    count: `${Endpoints.Prospect}/countProspectBySalesProcessES`,
  },
  OverviewTypes.Pipeline.Order,
  ObjectTypes.PipelineOrder,
  'qualifiedDeal',
  qualifiedDeal,
  (requestData) => {
    const {
      showHistory,
      roleFilterType,
      roleFilterValue,
      searchFieldDTOList,
      startDate,
      ftsTerms,
      customFilter,
      endDate,
      isFilterAll,
      isRequiredOwner,
      selectedMark,
      orderBy,
    } = requestData;
    return {
      startDate,
      endDate,
      isFilterAll,
      roleFilterType,
      roleFilterValue,
      customFilter: 'history',
      orderBy,
      isRequiredOwner: false,
      ftsTerms,
      searchFieldDTOList,
      isShowHistory: true,
      wonLossFilter: selectedMark,
    };
  },
  (query) => {
    return {
      ...query,
    };
  }
);
//
export function* fetchCountBySteps({ salesProcessId }): Generator<*, *, *> {
  const state = yield select();
  const search = getSearch(state, ObjectTypes.PipelineQualified);
  const period = getPeriod(state, ObjectTypes.PipelineQualified);
  const { searchFieldDTOList } = getSearchForSave(state, ObjectTypes.PipelineQualified);
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
    orderBy: 'contractDate', //search.orderBy ? search.orderBy :
    isRequiredOwner: false,
    ftsTerms: search.term,
    searchFieldDTOList: search.shown ? searchFieldDTOList : [],
    isShowHistory: search.history,
    isDeleted: false,
  };

  try {
    const countData = yield call(api.post, {
      resource: `${Endpoints.Prospect}/countProspectBySalesProcessES`,
      query: {
        sessionKey: generateUuid(),
        timeZone: getCurrentTimeZone(),
      },
      data: {
        ...filterDTO,
      },
    });

    const countDetailBySteps = call(api.post, {
      resource: `${Endpoints.Prospect}/countDetailByStepsES`,
      query: {
        timeZone: getCurrentTimeZone(),
        sessionKey: generateUuid(),
        salesProcessId,
      },
      data: {
        ...filterDTO,
      },
    });

    const {
      __COMMON_DATA: { salesMethodUsing },
    } = state.entities.qualifiedDeal;
    let steps =
      salesMethodUsing && salesMethodUsing.find((value) => value.isActive)
        ? salesMethodUsing.find((value) => value.isActive).activityDTOList
        : [];
    const requests = steps.map((step, idx) => {
      return call(api.post, {
        resource: `${Endpoints.Prospect}/getQualifiedByStepES`,
        query: {
          lastStep: idx === steps.length - 1 ? true : false,
          pageIndex: 0,
          pageSize: 24,
          stepId: step.uuid,
          timeZone: getCurrentTimeZone(),
          sessionKey: generateUuid(),
          salesProcessId,
        },
        data: {
          ...filterDTO,
        },
      });
    });

    const detailSteps = yield all(requests.concat(countDetailBySteps));

    let stepsCount = detailSteps[detailSteps.length - 1].stepDTOS;
    let _totalItem = 0;
    steps = steps.map((step, index) => {
      const stepCount = stepsCount.find((stepCount) => stepCount.activityId === step.uuid);
      _totalItem += stepCount ? stepCount.count : 0;
      const stepCountMerge = stepCount
        ? stepCount
        : {
            count: 0,
            grossValue: 0,
            index: 1,
          };
      return {
        ...step,
        ...stepCountMerge,
        prospectDTOList: detailSteps[index].prospectDTOList,
      };
    });
    yield put(fetchCountByStepsSuccess(salesProcessId, steps));
    yield put(succeedFetch(state.common.currentOverviewType, [], true, countData.count));
  } catch (e) {
    console.log(e);
  }
}

export function* fetchQualifiedData(): Generator<*, *, *> {
  try {
    const state = yield select();
    const search = getSearch(state, ObjectTypes.PipelineQualified);
    const period = getPeriod(state, ObjectTypes.PipelineQualified);
    const { searchFieldDTOList } = getSearchForSave(state, ObjectTypes.PipelineQualified);
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

    // lấy ra cái sale method cũ
    const oldQualifiedDeal = state.entities.qualifiedDeal || {};
    const oldSalesMethodUsing =
      oldQualifiedDeal.__COMMON_DATA && oldQualifiedDeal.__COMMON_DATA.salesMethodUsing
        ? oldQualifiedDeal.__COMMON_DATA.salesMethodUsing
        : [];
    const saleMethodActive = oldSalesMethodUsing.find((value) => value.isActive);

    const filterDTO = {
      startDate: isFilterAll ? null : new Date(period.startDate).getTime(),
      endDate: isFilterAll ? null : new Date(period.endDate).getTime(),
      isFilterAll,
      roleFilterType: roleType,
      roleFilterValue: roleValue,
      customFilter: search.filter ? search.filter : 'active',
      orderBy: 'contractDate', //search.orderBy ? search.orderBy :
      isRequiredOwner: false,
      ftsTerms: search.term,
      searchFieldDTOList: search.shown ? searchFieldDTOList : [],
      isShowHistory: search.history,
      isDeleted: false,
    };

    const countData = yield call(api.post, {
      resource: `${Endpoints.Prospect}/countProspectBySalesProcessES`,
      query: {
        sessionKey: generateUuid(),
        timeZone: getCurrentTimeZone(),
      },
      data: {
        ...filterDTO,
      },
    });

    const {
      totalGrossValue,
      totalNetValue,
      totalProfit,
      totalWeight,
      countProspectBySalesProcessDTOs,
      count,
    } = countData;
    //yield put(OverviewActions.collectOtherParamInList(overviewType, { totalGrossValue, totalNetValue, totalProfit, totalWeight, countProspectBySalesProcessDTOs }));
    yield put(
      collectOtherParamInList(OverviewTypes.Pipeline.Qualified, {
        totalGrossValue,
        totalNetValue,
        totalProfit,
        totalWeight,
        countProspectBySalesProcessDTOs,
        count,
      })
    );

    const data = yield call(api.get, {
      resource: `${SALE_METHOR_ENPOINT}/listOurAndActivityList`,
    });
    let salesMethodDTOList = data.salesMethodDTOList;
    const salesMethodUsing = data.salesMethodDTOList
      .filter((value) => {
        const checkInCountProspectBySalesProcessDTOs = countProspectBySalesProcessDTOs.findIndex((prospect) => {
          return prospect.salesProcessId === value.uuid;
        });
        return (value.using && !value.deleted) || checkInCountProspectBySalesProcessDTOs !== -1;
      })
      .map((val, index) => {
        const sortIndex = countProspectBySalesProcessDTOs.findIndex((prospect) => {
          return prospect.salesProcessId === val.uuid;
        });
        return {
          ...val,
          sortIndex: sortIndex !== -1 ? sortIndex : null,
          grossValue: sortIndex !== -1 ? countProspectBySalesProcessDTOs[sortIndex].grossValue : 0,
        };
      })
      .sort((value1, value2) => {
        if (value1.sortIndex === value2.sortIndex) {
          return 0;
        } else if (value1.sortIndex === null) {
          return 1;
        } else if (value2.sortIndex === null) {
          return -1;
        } else if (true) {
          return value1.sortIndex < value2.sortIndex ? -1 : 1;
        }
      })
      .map((value, index) => ({
        ...value,
        isActive: saleMethodActive ? value.uuid === saleMethodActive.uuid : index === 0 ? true : false,
      }));

    yield put(fetchQualifiedDataSuccess(salesMethodDTOList, salesMethodUsing));
  } catch (e) {
    console.log(e);
  }
}

function* fetchQualifiedDeal({ qualifiedDealId }): Generator<*, *, *> {
  try {
    const qualified = yield call(api.get, {
      resource: `${Endpoints.Prospect}/getDetails/${qualifiedDealId}`,
    });

    yield put({
      type: ActionTypes.FETCH_QUALIFIED_DETAIL_SUCCESS,
      qualified,
    });
    yield put({
      type: ActionTypes.FETCH_QUALIFIED_DETAIL_TO_EDIT_SUCCESS,
      qualified,
    });
    yield put(updateDocumentObjectId(qualifiedDealId));
    // fetch number document of Deal
    const res = yield call(api.get, {
      resource: `${Endpoints.Document}/document/countByObject`,
      query: {
        objectType: 'OPPORTUNITY',
        objectId: qualifiedDealId,
      },
    });
    yield put(QualifiedActions.updateNumberDocumentDetail(res));
  } catch (e) {
    console.log(e);
  }
}
function* fetchQualifiedDealToEdit({ qualifiedDealId }): Generator<*, *, *> {
  try {
    const qualified = yield call(api.get, {
      resource: `${Endpoints.Prospect}/getDetails/${qualifiedDealId}`,
    });

    yield put({
      type: ActionTypes.FETCH_QUALIFIED_DETAIL_TO_EDIT_SUCCESS,
      qualified,
    });
  } catch (e) {
    console.log(e);
  }
}
export function* fetListSaleProcess({ salesProcessId }): Generator<*, *, *> {
  const state = yield select();

  const search = getSearch(state, ObjectTypes.PipelineQualified);
  const period = getPeriod(state, ObjectTypes.PipelineQualified);
  const { searchFieldDTOList } = getSearchForSave(state, ObjectTypes.PipelineQualified);
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

  //__SEARCH_PROGRESS_LIST
  const { orderBy } = state.entities.qualifiedDeal.__SEARCH_PROGRESS_LIST;

  const filterDTO = {
    startDate: isFilterAll ? null : new Date(period.startDate).getTime(),
    endDate: isFilterAll ? null : new Date(period.endDate).getTime(),
    isFilterAll,
    roleFilterType: roleType,
    roleFilterValue: roleValue,
    customFilter: search.filter ? search.filter : 'active',
    orderBy: orderBy ? orderBy : 'contractDate', //search.orderBy ? search.orderBy :
    isRequiredOwner: false,
    ftsTerms: search.term,
    searchFieldDTOList: search.shown ? searchFieldDTOList : [],
    isShowHistory: search.history,
    isDeleted: false,
  };

  try {
    const data = yield call(api.post, {
      resource: `${Endpoints.Prospect}/listBySalesProcessES`,
      query: {
        timeZone: getCurrentTimeZone(),
        sessionKey: generateUuid(),
        salesProcessId,
        pageIndex: 0,
        pageSize: 10000,
      },
      data: {
        ...filterDTO,
      },
    });
    const { prospectDTOList } = data;

    yield put(fetchListSaleProcessSuccess(salesProcessId, prospectDTOList));
  } catch (e) {
    console.log(e);
  }
}

function* updateCustomField(overviewType, prospectId) {
  const state = yield select();
  let overviewT;
  let objectT;
  let customFilterDeault = 'active';
  let isProspectActive = true;
  if (overviewType === OverviewTypes.Pipeline.Qualified) {
    overviewT = OverviewTypes.Pipeline.Qualified;
    objectT = ObjectTypes.PipelineQualified;
  } else if (overviewType === OverviewTypes.Pipeline.Order || overviewType === OverviewTypes.Order) {
    overviewT = OverviewTypes.Pipeline.Order;
    objectT = ObjectTypes.PipelineOrder;
    customFilterDeault = 'history';
    isProspectActive = false;
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
    customFilter: search.filter ? search.filter : customFilterDeault,
    orderBy: search.orderBy ? search.orderBy : 'dateAndTime',
    isRequiredOwner: true,
    ftsTerms: search.term,
    searchFieldDTOList: search.shown ? searchFieldDTOList : [],
    salesProcessIds: [],
    // selectedMark: search.tag,
  };

  let payload = {
    filterDTO,
    isSelectedAll: false,
    prospectIds: [prospectId],
    unSelectedIds: [],
    isProspectActive: isProspectActive,
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
      resource: `${Endpoints.Prospect}/customFieldValue/updateAll`,
      data: {
        ...payload,
        customFieldDTOList: updatedCustomFieldDTOList,
        standardFieldDTO: {},
      },
      query: {
        timeZone: getCurrentTimeZone(),
      },
    });
  } catch (error) {}
}

function* addQualified({ overviewType }): Generator<*, *, *> {
  const state = yield select();
  try {
    const _CREATE = getCreateQualifiedDeal(state);

    const data = yield call(api.post, {
      resource: `${Endpoints.Prospect}/add`,
      data: {
        ..._CREATE,
        organisation: _CREATE.organisation != null && _CREATE.organisation.uuid != null ? _CREATE.organisation : null,
      },
    });
    if (data) {
      yield updateCustomField(overviewType, data.uuid);
      yield put(OverviewActions.clearHighlight(overviewType));
      yield put(NotificationActions.success(_l`Added`, '', 2000));

      const isAddDealResource =
        state.entities?.resources?.isAddDealResource && !state.entities?.resources?.resourceAddDealInList;
      if (isAddDealResource) {
        yield put(ResourcesActionsTypes.setOpenSavedAfterAddDeal(true));
        yield put(
          ResourcesActionsTypes.setInfoAfterAddDeal({
            contact: _CREATE.sponsorList,
            company: _CREATE.organisation,
          })
        );
      }

      yield put(OverviewActions.requestFetch(OverviewTypes.Pipeline.Qualified, true));

      // auto fill for add form reminder appointment
      if (overviewType == OverviewTypes.Pipeline.Qualified && _CREATE.organisation != null) {
        let contactIds = _CREATE.sponsorList != null ? _CREATE.sponsorList.map((c) => c.uuid) : [];
        yield put(
          TaskActions.updateCreateEditEntityAfterAddDeal(data.uuid, null, _CREATE.organisation.uuid, contactIds)
        );
        yield put(
          AppointmentActions.updateCreateEditEntityAfterAddDeal(data.uuid, null, _CREATE.organisation.uuid, contactIds)
        );
      }

      yield put(clearCreateEntity());
      yield put(clearCreateEntity('__ORDER_CREATE'));
      yield put(clear());
      yield put(create());
      if (
        overviewType == OverviewTypes.CallList.SubAccount_Qualified ||
        ((overviewType == OverviewTypes.Account_Qualified || overviewType == OverviewTypes.Account_Qualified_Copy) &&
          _CREATE.organisation != null &&
          _CREATE.organisation.uuid != null)
      ) {
        // yield put(OrganisationActions.requestFetchOrganisation(_CREATE.organisation.uuid));
        yield put(refreshOrganisation('qualified'));
      }
      if (overviewType == OverviewTypes.Account_Unqualified_Qualified) {
        yield put(refreshOrganisation('unqualified'));
      } else if (
        overviewType === OverviewTypes.Contact_Qualified ||
        overviewType === OverviewTypes.Contact_Qualified_Copy
      ) {
        yield put(refreshContact('qualified'));
      } else if (overviewType === OverviewTypes.Contact_Unqualified_Qualified) {
        yield put(refreshContact('unqualified'));
      }
      if (overviewType === OverviewTypes.Contact_Contact_Qualified) {
        yield put(refreshContact('contact'));
      }
      if (overviewType === OverviewTypes.Contact_Quick_Qualified) {
        yield put(refreshContact('qualified'));
      }
      yield call(fetchQualifiedData);

      // yield put(OverviewActions.requestFetch(ove))
      if (_CREATE.leadId) {
        yield put(OverviewActions.deleteRowSuccess(OverviewTypes.Pipeline.Lead, _CREATE.leadId));
        yield put(OverviewActions.requestFetch(OverviewTypes.Pipeline.Lead, true));
      }
      yield put(setResourceForAddDealInListResource(null));
      yield put(setAddMultiDealResource(false));
    }
  } catch (error) {
    console.log(error);
    yield put(NotificationActions.error(error.message));
  }
}

function* setFavoriteDeal({ prospecId, favorite, overviewType }): Generator<*, *, *> {
  const dataDTO = {
    prospectId: prospecId,
    favorite: favorite,
  };
  try {
    const data = yield call(api.post, {
      resource: `${Endpoints.Prospect}/updateFavorite`,
      data: dataDTO,
    });

    if (data) {
      yield put(QualifiedActions.updateQualifiedDeal({ prospectId: data.prospectId, favorite: data.favorite }));
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}
//REFESH QUALIFIED DETAIL WHEN TASK, NOTE, APPOINTMENT EDIT CHANGE
export function* refeshQualifiedDeal({ actionType, overviewType }): Generator<*, *, *> {
  try {
    if (actionType === 'note') {
      yield put(OverviewActions.clearHighlightAction(OverviewTypes.Pipeline.Qualified_Note));
      yield put(NotificationActions.success(_l`Updated`, '', 2000));
    } else if (actionType === 'task') {
      yield put(refeshTasks());
    } else if (actionType === 'photo') {
      yield put(OverviewActions.clearHighlightAction(OverviewTypes.Pipeline.Qualified_Photo));
    }

    const state = yield select();
    const qualifiedDeal = state.entities.qualifiedDeal.__DETAIL;
    try {
      const qualified = yield call(api.get, {
        resource: `${Endpoints.Prospect}/getDetails/${qualifiedDeal.uuid}`,
      });
      yield put({
        type: ActionTypes.FETCH_QUALIFIED_DETAIL_SUCCESS,
        qualified,
      });
      if (actionType === 'note') {
        yield put(requestFetchNotes(qualifiedDeal.uuid));
      } else if (actionType === 'task') {
        // yield put(requestFetchTasks(unqualifiedDeal.uuid));
      } else if (actionType === 'photo') {
        yield put(fetchPhotos(qualifiedDeal.uuid));
      }
      if (actionType === 'appointment') {
        yield put({ type: ActionTypes.FETCH_APPOINTMENTS, qualifiedDealId: qualified.uuid, history: false });
      }
    } catch (e) {}
  } catch (e) {
    console.log(e);
  }
}

export function* refeshOrderDeal({ actionType }): Generator<*, *, *> {
  try {
    if (actionType === 'note') {
      yield put(OverviewActions.clearHighlightAction(OverviewTypes.Pipeline.Order));
      yield put(NotificationActions.success(_l`Updated`, '', 2000));
      yield put(requestFetchNotes(qualifiedDeal.uuid));
    } else if (actionType === 'task') {
      yield put(refeshTasks());
    }

    const state = yield select();
    const qualifiedDeal = state.entities.qualifiedDeal.__DETAIL;
    try {
      const qualified = yield call(api.get, {
        resource: `${Endpoints.Prospect}/getDetails/${qualifiedDeal.uuid}`,
      });
      yield put({
        type: ActionTypes.FETCH_QUALIFIED_DETAIL_SUCCESS,
        qualified,
      });
      if (actionType === 'note') {
        yield put(requestFetchNotes(qualifiedDeal.uuid));
      } else if (actionType === 'task') {
        // yield put(requestFetchTasks(unqualifiedDeal.uuid));
      }
    } catch (e) {}
  } catch (e) {
    console.log(e);
  }
}

// Card: Tasks
export function* fetchTasks({ qualifiedDealId, history, tag, orderBy }): Generator<*, *, *> {
  try {
    // yield put(OverviewActions.startFetch(OverviewTypes.Pipeline.Qualified));

    let query = {
      pageIndex: 0,
      pageSize: 45,
      prospectId: qualifiedDealId,
      showHistory: history, // FIXME: Impl - showHistory
      orderBy, // FIXME: Impl - dateAndTime
    };
    if (tag) {
      query.selectedMark = tag;
    }
    const data = yield call(api.get, {
      resource: `${Endpoints.Task}/listByProspect`,
      schema: taskList,
      query: query,
    });

    yield put(
      succeedFetchTasks(qualifiedDealId, {
        entities: data.entities,
      })
    );
    // yield put(OverviewActions.succeedFetch(OverviewTypes.Pipeline.Qualified, [], false, 0));
  } catch (e) {
    console.log(e);
  }
}

// Card: Action Product
export function* fetchProducts({ qualifiedDealId }): Generator<*, *, *> {
  try {
    // yield put(OverviewActions.startFetch(OverviewTypes.Pipeline.Qualified));

    const data = yield call(api.get, {
      resource: `${Endpoints.Prospect}/orderRow/listByProspect/${qualifiedDealId}`,
    });

    const { orderRowDTOList } = data;
    yield put(succeedFetchProducts(qualifiedDealId, orderRowDTOList));
    // yield put(OverviewActions.succeedFetch(OverviewTypes.Pipeline.Qualified, [], false, 0));
  } catch (e) {
    console.log(e);
  }
}

// Card: Action Plan
export function* fetchActionPlan({ qualifiedDealId }): Generator<*, *, *> {
  try {
    // yield put(OverviewActions.startFetch(OverviewTypes.Pipeline.Qualified));
    const data = yield call(api.get, {
      resource: `${Endpoints.Prospect}/prospectProgress/listByProspect/${qualifiedDealId}`,
    });

    yield put(succeedFetchActionPlan(qualifiedDealId, data));
    // yield put(OverviewActions.succeedFetch(OverviewTypes.Pipeline.Qualified, [], false, 0));
  } catch (e) {
    console.log(e);
  }
}

export function* moveStepActionPlanRequest({ stepId, salesProcessId, qualifiedId }): Generator<*, *, *> {
  try {
    const state = yield select();

    const qualifiedDeal = state.entities.qualifiedDeal;

    const __DETAIL = qualifiedDeal.__DETAIL || {};
    const { actionPlan } = __DETAIL;
    const prospectProgressDTOList =
      actionPlan && actionPlan.prospectProgressDTOList ? actionPlan.prospectProgressDTOList : [];
    let targgetId = stepId;
    let firstNextStep = '',
      secondNextStep = '';
    prospectProgressDTOList.forEach((value, idx) => {
      if (value.finished) {
        targgetId = value.uuid;
        if (idx < prospectProgressDTOList.length - 1) {
          firstNextStep = prospectProgressDTOList[idx + 1].name;
        } else {
          firstNextStep = '';
        }
        if (idx < prospectProgressDTOList.length - 2) {
          secondNextStep = prospectProgressDTOList[idx + 2].name;
        } else {
          secondNextStep = '';
        }
      }
    });

    const data = yield call(api.post, {
      resource: `${Endpoints.Prospect}/prospectProgress/move`,
      data: {
        prospectId: qualifiedId,
        targetId: targgetId,
      },
    });

    //QualifiedActions
    // if (__DETAIL.salesMethodManualProgress === 'ON') {

    //   return;
    // }
    yield put(QualifiedActions.listChangeNexStep(qualifiedId, firstNextStep, secondNextStep));

    yield delay(300);
    yield put(QualifiedActions.fetchCountBySteps(salesProcessId));
  } catch (e) {
    console.log(e);
  }
}

//Card: Appointments
export function* fetchAppointments({ qualifiedDealId, history, orderBy }): Generator<*, *, *> {
  try {
    // yield put(OverviewActions.startFetch(OverviewTypes.Pipeline.Qualified));

    const data = yield call(api.get, {
      resource: `${Endpoints.Appointment}/syncByProspect`,
      query: {
        pageIndex: 0,
        pageSize: 10000,
        showHistory: history,
        prospectId: qualifiedDealId,
        updatedDate: 0,
        orderBy,
      },
    });

    const appointments = data.appointmentDTOList;
    yield put(succeedFetchAppointments(qualifiedDealId, appointments));

    // yield put(OverviewActions.succeedFetch(OverviewTypes.Pipeline.Qualified, [], false, 0));
  } catch (e) {
    console.log(e);
  }
}

// Card: notes
export function* fetchNotes({ qualifiedDealId }): Generator<*, *, *> {
  try {
    // yield put(OverviewActions.startFetch(OverviewTypes.Pipeline.Qualified));

    const data = yield call(api.get, {
      resource: `${documentEndPoints}/note/listByProspectFull/${qualifiedDealId}`,
      query: {
        pageIndex: 0,
        pageSize: 45,
      },
    });

    const notes = data.noteDTOList;
    yield put(succeedFetchNotes(qualifiedDealId, notes));
    // yield put(OverviewActions.succeedFetch(OverviewTypes.Pipeline.Qualified, [], false, 0));
  } catch (e) {
    console.log(e);
  }
}

function* setLostDeal({ overviewType, data }): Generator<*, *, *> {
  try {
    const userId = yield select(getUserId);
    const body = {
      won: data.won,
      userId: userId,
      uuid: data.uuid,
    };
    const dataRespone = yield call(api.post, {
      resource: `${Endpoints.Prospect}/updateWon`,
      query: {
        isUseToday: data.isUseToday,
      },
      data: body,
    });

    if (dataRespone) {
      if (data.isOrder != true) yield put(OverviewActions.deleteRowSuccess(overviewType, dataRespone.uuid));
      yield put(NotificationActions.success(_l`Updated`, '', 2000));
      // yield put(QualifiedActions.fetchQualifiedData());
      if (overviewType === OverviewTypes.Account_Qualified) {
        yield put(refreshOrganisation('qualified'));
      } else if (overviewType === OverviewTypes.Contact_Qualified) {
        yield put(refreshContact('qualified'));
      } else {
        yield refreshQualifiedDealView(data.isOrder ? OverviewTypes.Pipeline.Order : overviewType, dataRespone.uuid);
      }
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}

function* fetchNumberOrderRow({ prospecId, overviewType }): Generator<*, *, *> {
  try {
    const data = yield call(api.get, {
      resource: `${Endpoints.Prospect}/getNumberOrderRow/${prospecId}`,
    });

    if (data && data.numberOrderRow > 0) {
      yield put(OverviewActions.highlight(overviewType, prospecId, 'set_won_qualified_deal'));
    } else if (data.numberOrderRow <= 0) {
      yield put(NotificationActions.error(_l`Cannot set a deal without products as won`));
    }
  } catch (error) {
    yield put(NotificationActions.error(error.message));
  }
}

function* changeOnMultiMenu({ option, optionValue, overviewType }) {
  const state = yield select();
  let overviewT;
  let objectT;
  let customFilterDeault = 'active';
  let isProspectActive = true;
  if (overviewType === OverviewTypes.Pipeline.Qualified) {
    overviewT = OverviewTypes.Pipeline.Qualified;
    objectT = ObjectTypes.PipelineQualified;
  } else if (overviewType === OverviewTypes.Pipeline.Order) {
    overviewT = OverviewTypes.Pipeline.Order;
    objectT = ObjectTypes.PipelineOrder;
    customFilterDeault = 'history';
    isProspectActive = false;
  }
  // if (overviewType === OverviewTypes.Delegation.Lead) {
  //   overviewT = OverviewTypes.Delegation.Lead;
  //   objectT = ObjectTypes.DelegationLead;
  // }

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

    const salesProcessId =
      overviewT === OverviewTypes.Pipeline.Qualified ? getSaleProcessActive(state) : getSaleProcessInOrderActive(state);

    const filterDTO = {
      startDate: isFilterAll ? null : new Date(period.startDate).getTime(),
      endDate: isFilterAll ? null : new Date(period.endDate).getTime(),
      isFilterAll,
      roleFilterType: roleType,
      roleFilterValue: roleValue,
      customFilter: search.filter ? search.filter : customFilterDeault,
      orderBy: search.orderBy ? search.orderBy : 'dateAndTime',
      isRequiredOwner: true,
      ftsTerms: search.term,
      searchFieldDTOList: search.shown ? searchFieldDTOList : [],
      salesProcessIds: salesProcessId ? [salesProcessId] : [],
      // selectedMark: search.tag,
    };

    const { selectAll, selected } = overview;
    const isSelectedAll = selectAll;
    let prospectIds = [];
    let unSelectedIds = [];
    const keys = Object.keys(selected);
    if (isSelectedAll) {
      prospectIds = [];
      unSelectedIds = keys.filter((key) => selected[key] === false);
    } else {
      prospectIds = keys.filter((key) => selected[key] === true);
    }
    let request = null;
    let payload = {
      filterDTO,
      isSelectedAll,
      prospectIds,
      unSelectedIds,
      isProspectActive: isProspectActive,
    };
    if (option === 'change_reponsible') {
      request = call(api.post, {
        resource: `${Endpoints.Prospect}/changeTeamInbatch`,
        data: {
          userDTOList: optionValue,
          ...payload,
        },
        query: {
          timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'add_to_mailchimp_list') {
      request = call(api.post, {
        resource: `${Endpoints.Prospect}/sendMailChimpInBatch`,
        data: {
          ...payload,
          sendMailChimpDTO: {
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
        resource: `${Endpoints.Prospect}/deleteInBatch`,
        data: {
          ...payload,
        },
        query: {
          sessionKey: generateUuid(),
          timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'export_to_excel') {
      let filterDTOCus0 = { ...filterDTO, listIds: prospectIds };
      let filterDTOCus = { ...payload, filterDTO: filterDTOCus0 };
      // filterDTOCus.isRequiredOwner = false;
      // filterDTOCus.isShowHistory = filterDTO.customFilter == 'history';
      request = call(api.get, {
        resource: `${Endpoints.Prospect}/exportAdvancedSearchBySelected`,
        query: {
          filterDTO: JSON.stringify(filterDTOCus),
          // leadFrom: overviewType === OverviewTypes.Pipeline.Qualified ? 'lead_delegation' : 'lead',
          timeZone: getCurrentTimeZone(),
          // timeZone: new Date().getTimezoneOffset() / -60,
        },
      });
    } else if (option === 'set_done_multi') {
      request = call(api.post, {
        resource: `${Endpoints.Prospect}/setDoneInBatch`,
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
        resource: `${Endpoints.Prospect}/customFieldValue/updateAll`,
        data: {
          ...payload,
          customFieldDTOList: updatedCustomFieldDTOList,
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
        resource: `${Endpoints.Prospect}/sendCallListInBatch`,
        query: {
          sessionKey: generateUuid(),
          timeZone: getCurrentTimeZone(),
        },
        data: {
          ...payload,
          sendCallListDTO: {
            ...optionValue,
          },
        },
      });
    } else if (option === 'assign_multi_unqualified_to_me') {
      request = call(api.post, {
        resource: `${Endpoints.Prospect}/assignToMeInBatch`,
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
        resource: `${Endpoints.Prospect}/assignInBatch`,
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
        message = `${_l`Updated`}`;
        break;
      default:
        break;
    }

    if (data?.message === 'SUCCESS' || data?.isSuccess || data === 'SUCCESS') {
      // yield put(OverviewActions.requestFetch(overviewT, true));

      if (overviewT === OverviewTypes.Pipeline.Qualified) {
        const salesMethodId = getSaleMethodActive(state);
        if (salesMethodId != null) {
          yield put(QualifiedActions.fetchListBysale(salesMethodId, ObjectTypes.PipelineQualified));
        }
      } else if (overviewT === OverviewTypes.Pipeline.Order) {
        const salesMethodId = state.entities?.qualifiedDeal?.__ORDER_SALE?.saleId;
        if (salesMethodId) {
          yield put(QualifiedActions.fetchListBysale(salesMethodId, ObjectTypes.PipelineOrder));
        }
      }

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
/*
export function* refreshQualifiedDetail({ actionType, overviewType }): Generator<*, *, *> {
  try {
    if (actionType === 'note') {
      yield put(OverviewActions.clearHighlightAction(OverviewTypes.Pipeline.Qualified_Note));
      yield put(NotificationActions.success(_l`Updated`, '', 2000));
    } else if (actionType === 'photo') {
      yield put(OverviewActions.clearHighlightAction(OverviewTypes.Pipeline.Qualified_Photo));
    }

    const state = yield select();
    const qualifiedDeal = state.entities.qualifiedDeal.__DETAIL;
    try {
      const qualified = yield call(api.get, {
        resource: `${Endpoints.Prospect}/getDetails/${qualifiedDeal.uuid}`,
      });
      yield put({
        type: ActionTypes.FETCH_QUALIFIED_DETAIL_SUCCESS,
        qualified,
      });
      if (actionType === 'note') {
        yield put(requestFetchNotes(qualifiedDeal.uuid));
      } else if (actionType === 'photo') {
        yield put(fetchPhotos(qualifiedDeal.uuid));
      }
    } catch (e) {}
  } catch (e) {
    alert(e.message);
  }
}
*/

export function* fetListActivity(): Generator<*, *, *> {
  try {
    const data = yield call(api.get, {
      resource: `${SALE_METHOR_ENPOINT}/listOurAndActivityList`,
    });
    yield put(updateListActivity(data.salesMethodDTOList));
  } catch (e) {
    console.log(e);
  }
}

export function* fetListBySale({ saleId, objectTypes }): Generator<*, *, *> {
  const state = yield select();
  const search = getSearch(state, objectTypes);
  const period = getPeriod(state, objectTypes);
  const { searchFieldDTOList } = getSearchForSave(state, objectTypes);
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
    customFilter: objectTypes === 'PIPELINE_ORDER' ? 'history' : 'active',
    orderBy: search.orderBy ? search.orderBy : 'contractDate',
    isRequiredOwner: false,
    ftsTerms: search.term,
    searchFieldDTOList: search.shown ? searchFieldDTOList : [],
    isShowHistory: search.history,
    isDeleted: false,
    salesProcessIds: saleId ? [saleId] : [],
  };

  try {
    const countData = yield call(api.post, {
      resource: `${Endpoints.Prospect}/countProspectBySalesProcessES`,
      query: {
        sessionKey: generateUuid(),
        timeZone: getCurrentTimeZone(),
      },
      data: {
        ...filterDTO,
      },
    });

    const {
      totalGrossValue,
      totalNetValue,
      totalProfit,
      totalWeight,
      countProspectBySalesProcessDTOs,
      count,
    } = countData;
    yield put(
      collectOtherResultFilter(objectTypes, {
        totalGrossValue,
        totalNetValue,
        totalProfit,
        totalWeight,
        countProspectBySalesProcessDTOs,
        count,
      })
    );

    const data = yield call(api.post, {
      resource: `${Endpoints.Prospect}/listES`,
      query: {
        timeZone: getCurrentTimeZone(),
        sessionKey: generateUuid(),
        pageIndex: 0,
        pageSize: 10000,
      },
      data: {
        ...filterDTO,
      },
      schema: qualifiedDeal,
    });

    if (data.entities) {
      if (data.entities['qualifiedDeal']) {
        const items = Object.keys(data.entities['qualifiedDeal']);
        yield put(OverviewActions.succeedFetch(objectTypes, items, true, count || 0));
      } else {
        yield put(OverviewActions.succeedFetch(objectTypes, [], true, 0));
      }
      yield put(OverviewActions.feedEntities(data.entities));
    }
  } catch (e) {
    console.log(e);
  }
}

function* progressUpdate({ uuid, finished, salesProcessId, prospectId }): Generator<*, *, *> {
  let timeout = null;
  try {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    const state = yield select();
    const userId = state.auth.userId;
    const progressUpdated = yield call(api.post, {
      resource: `${Endpoints.Prospect}/prospectProgress/update`,
      data: {
        uuid,
        finished,
        name: '',
        numberActiveMeeting: null,
        userId,
      },
    });
    const qualifiedDeal = state.entities.qualifiedDeal || {};
    const __DETAIL = qualifiedDeal.__DETAIL;
    if (__DETAIL) {
      if (__DETAIL.salesMethodManualProgress === 'OFF') {
        const { actionPlan } = __DETAIL;
        const prospectProgressDTOList =
          actionPlan && actionPlan.prospectProgressDTOList ? actionPlan.prospectProgressDTOList : [];
        let firstNextStep = '',
          secondNextStep = '';
        if (prospectProgressDTOList.length > 0) {
          firstNextStep = prospectProgressDTOList[0].name;
        }
        prospectProgressDTOList.forEach((value, idx) => {
          if (value.finished) {
            if (idx < prospectProgressDTOList.length - 1) {
              firstNextStep = prospectProgressDTOList[idx + 1].name;
            } else {
              firstNextStep = '';
            }
            if (idx < prospectProgressDTOList.length - 2) {
              secondNextStep = prospectProgressDTOList[idx + 2].name;
            } else {
              secondNextStep = '';
            }
          }
        });

        yield put(QualifiedActions.listChangeNexStep(prospectId, firstNextStep, secondNextStep));
      }
      if (__DETAIL.uuid === prospectId) {
        yield put({
          type: ActionTypes.FETCH_QUALIFIED_DETAIL_SUCCESS,
          qualified: {
            ...__DETAIL,
            realProspectProgress: progressUpdated.totalAllProgress,
          },
        });
      }
    }
    function* fetchData() {
      yield put(fetchListSaleProcess(salesProcessId));
    }
    timeout = setTimeout(fetchData, 300);
  } catch (e) {
    console.log(e);
  }
}

export function* deleteRow({ overviewType, itemId, isRemoveUserFromOppTeam }): Generator<*, *, *> {
  try {
    // if (OverviewTypes.Pipeline.Lead === overviewType) {

    const data = yield call(api.get, {
      resource: `${Endpoints.Prospect}/delete/${itemId}`,
    });
    if (data === 'SUCCESS') {
      yield put(OverviewActions.clearHighlight(overviewType, itemId));
      yield put(NotificationActions.success(_l`Deleted`, '', 2000));
    }
    if (isRemoveUserFromOppTeam) {
      // openDeleteConnectedObject
      /*
      yield put(OverviewActions.highlight(overviewType, itemId, 'delete_connect_object'));
*/
      // yield put(QualifiedActions.removeConnectedObject(overviewType, itemId));
    } else {
      yield put(OverviewActions.deleteRowSuccess(overviewType, itemId));
      // yield put({ type: ActionTypes.FETCH_QUALIFIED_DATA });
      // yield put(QualifiedActions.fetchQualifiedData());
      yield refreshQualifiedDealView(overviewType);
      if (overviewType == OverviewTypes.Account_Qualified) {
        yield put(refreshOrganisation('qualified'));
      } else if (overviewType == OverviewTypes.Account_Order) {
        yield put(refreshOrganisation('order'));
      } else if (overviewType === OverviewTypes.Contact_Qualified) {
        yield put(refreshContact('qualified'));
      } else if (overviewType === OverviewTypes.Contact_Order) {
        yield put(refreshContact('order'));
      }
    }
    // }
  } catch (e) {
    yield put(NotificationActions.error(e.message, '', 2000));
  }
}
export function* initDeleteRow({ overviewType, itemId }): Generator<*, *, *> {
  try {
    // if (OverviewTypes.Pipeline.Lead === overviewType) {
    const data = yield call(api.get, {
      resource: `${Endpoints.Prospect}/${itemId}/participant/list`,
    });

    let participantList = data.userDTOList;
    if (participantList != null && participantList.length === 1) {
      yield put(OverviewActions.highlight(overviewType, itemId, 'delete'));
    } else {
      yield put(OverviewActions.highlight(overviewType, itemId, 'delete_with_many_user'));

      // yield put(QualifiedActions.removeConnectedObject(overviewType, itemId));
    }

    /*    if (data === 'SUCCESS') {
          yield put(OverviewActions.clearHighlight(overviewType, itemId));
          yield put(NotificationActions.success(_l`Deleted`, '', 2000));
          yield put(OverviewActions.deleteRowSuccess(overviewType, itemId));
        }*/
    // }
  } catch (e) {
    yield put(NotificationActions.error(e.message, '', 2000));
  }
}
export function* deleteConnectObject({ overviewType, itemId }): Generator<*, *, *> {
  try {
    // if (OverviewTypes.Pipeline.Lead === overviewType) {
    const data = yield call(api.get, {
      resource: `${Endpoints.Prospect}/deleteActiveObject/${itemId}`,
    });
    if (data === 'SUCCESS') {
      yield put(OverviewActions.clearHighlight(overviewType, itemId));
      yield put(NotificationActions.success(_l`Deleted`, '', 2000));
      yield put(OverviewActions.deleteRowSuccess(overviewType, itemId));

      // yield put(QualifiedActions.fetchQualifiedData());
      yield refreshQualifiedDealView(overviewType);
      if (overviewType == OverviewTypes.Account_Qualified) {
        yield put(refreshOrganisation('qualified'));
      } else if (overviewType === OverviewTypes.Contact_Qualified) {
        yield put(refreshContact('qualified'));
      }
    }

    // }
  } catch (e) {
    //todo: last check
    yield put(OverviewActions.clearHighlight(overviewType, itemId));
    // yield put(NotificationActions.error(e.message, '', 2000));
  }
}

export function* refreshQualifiedDealView(overviewType, prospectId) {
  let objectT =
    overviewType === OverviewTypes.Pipeline.Qualified ? ObjectTypes.PipelineQualified : ObjectTypes.PipelineOrder;

  yield delay(500);
  const state = yield select();
  if (overviewType === OverviewTypes.Pipeline.Order) {
    // yield put(OverviewActions.requestFetch(overviewType, true));
    if (prospectId != null) yield put(fetchQualifiedDetail(prospectId));
    const orderSale = state.entities.qualifiedDeal.__ORDER_SALE ? state.entities.qualifiedDeal.__ORDER_SALE : {};
    yield fetListBySale({ saleId: orderSale.saleId, objectTypes: overviewType });
    return;
  }

  yield call(fetchQualifiedData);
  const salesProcessId = getSaleProcessActive(state);
  const mode = getSaleProcessActiveMode(state);
  const listShow = isListShowQualified(state);

  if (!listShow && salesProcessId != null) {
    /*    yield put({
          type: ActionTypes.FETCH_LIST_SALE_PROCESS,
          saleProcessActive,
        });*/
    if (mode === 'SEQUENTIAL') {
      yield put(QualifiedActions.fetchCountBySteps(salesProcessId));
    } else if (mode === 'DYNAMIC') {
      yield put(fetchListSaleProcess(salesProcessId));
    }
    /*    yield put({
          type: ActionTypes.FETCH_COUNT_BY_STEPS,
          salesProcessId,
        });
        yield put({
          type: ActionTypes.FETCH_LIST_SALE_PROCESS,
          salesProcessId,
        });*/
  } else {
    //fetchListBysale
    const salesMethodId = getSaleMethodActive(state);

    if (salesMethodId != null) {
      yield put(QualifiedActions.fetchListBysale(salesMethodId, objectT));
    }
  }
}

function* addOrder({ overviewType }): Generator<*, *, *> {
  const state = yield select();
  const orderSale = state.entities.qualifiedDeal.__ORDER_SALE ? state.entities.qualifiedDeal.__ORDER_SALE : {};
  try {
    const _CREATE = state.entities.qualifiedDeal.__ORDER_CREATE;
    if (_CREATE.orderRowCustomFieldDTOList && _CREATE.orderRowCustomFieldDTOList.length > 0) {
      const data = yield call(api.post, {
        resource: `${Endpoints.Prospect}/addOrder`,
        data: {
          ..._CREATE,
        },
      });
      if (data) {
        yield updateCustomField(overviewType, data.uuid);
        yield put(OverviewActions.clearHighlight(overviewType));
        yield put(NotificationActions.success(_l`Added`, '', 2000));
        // yield put(OverviewActions.highlight(overviewType, data.uuid, 'select_suggest_actions'));
        yield put(clearCreateEntity());
        yield put(clearCreateEntity('__ORDER_CREATE'));
        yield put(clear());
        yield put(create());
        if (overviewType == OverviewTypes.Account_Unqualified_Order) {
          yield put(refreshOrganisation('unqualified'));
        } else if (overviewType == OverviewTypes.Account_Qualified) {
          yield put(refreshOrganisation('qualified'));
        } else if (overviewType == OverviewTypes.Account_Order) {
          yield put(refreshOrganisation('order'));
        } else if (overviewType === OverviewTypes.Contact_Order) {
          yield put(refreshContact('order'));
        } else if (overviewType === OverviewTypes.Contact_Unqualified_Order) {
          yield put(refreshContact('unqualified'));
        } else if (overviewType === OverviewTypes.Contact_Order_Copy) {
          yield put(refreshContact('order'));
        }
        // if (overviewType === 'PIPELINE_ORDER') {
        yield fetListBySale({ saleId: orderSale.saleId, objectTypes: 'PIPELINE_ORDER' });
        // }
        if (_CREATE.leadId) {
          yield put(OverviewActions.deleteRowSuccess(OverviewTypes.Pipeline.Lead, _CREATE.leadId));
          yield put(OverviewActions.requestFetch(OverviewTypes.Pipeline.Lead, true));
        }
      }
    } else {
      yield put(NotificationActions.error(_l`Cannot add order without products`));
    }
  } catch (error) {
    yield put(NotificationActions.error(error.message));
  }
}

function* getProspectLite({ uuid, overviewType }): Generator<*, *, *> {
  try {
    const data = yield call(api.get, {
      resource: `${Endpoints.Prospect}/getProspectLite/${uuid}`,
    });
    if (
      overviewType === 'PIPELINE_QUALIFIED' ||
      overviewType == OverviewTypes.Pipeline.Qualified_Copy ||
      overviewType == OverviewTypes.Account_Qualified ||
      overviewType == OverviewTypes.Account_Qualified_Copy ||
      overviewType === OverviewTypes.Contact_Qualified_Copy
    ) {
      yield put(OverviewActions.highlight(overviewType, uuid, 'copy'));
    }
    if (
      overviewType === 'PIPELINE_ORDER' ||
      overviewType == OverviewTypes.Account_Order ||
      overviewType === OverviewTypes.Contact_Order_Copy
    ) {
      yield put(OverviewActions.highlight(overviewType, uuid, 'copyOrder'));
    }
    if (data) {
      yield put(contactItem(data.sponsorList));
      yield put(organisationItem(data.organisation));
      if (
        overviewType === 'PIPELINE_QUALIFIED' ||
        overviewType == OverviewTypes.Pipeline.Qualified_Copy ||
        overviewType == OverviewTypes.Account_Qualified ||
        overviewType == OverviewTypes.Account_Qualified_Copy ||
        overviewType === OverviewTypes.Contact_Qualified_Copy
      ) {
        yield put(QualifiedActions.copyEntityQualified(data));
      }
      if (
        overviewType === 'PIPELINE_ORDER' ||
        overviewType == OverviewTypes.Account_Order ||
        overviewType === OverviewTypes.Contact_Order_Copy
      ) {
        yield put(QualifiedActions.copyEntityOrder(data));
      }
      yield put(copyEntity(data.orderRowCustomFieldDTOList));
    }
  } catch (error) {
    yield put(NotificationActions.error(error.message));
  }
}

function* updateResponsible({ qualifiedDealId, userDTOList, overviewType }): Generator<*, *, *> {
  try {
    const state = yield select();
    const data = yield call(api.post, {
      resource: `${Endpoints.Prospect}/${qualifiedDealId}/participant/update`,
      data: {
        userDTOList,
      },
    });
    const user = makeGetUser()(state, userDTOList[0].uuid);

    if (user) {
      yield put(QualifiedActions.updateResponsibleOneDealSuccess(qualifiedDealId, user.avatar));
    }
    const __DETAIL = state.entities.qualifiedDeal.__DETAIL;
    if (__DETAIL && __DETAIL.uuid === qualifiedDealId) {
      yield put(QualifiedActions.fetchQualifiedDetail(qualifiedDealId));
    }
    if (data) {
      if (overviewType == OverviewTypes.Account_Order) {
        yield put(refreshOrganisation('order'));
      } else if (overviewType == OverviewTypes.Account_Qualified) {
        yield put(refreshOrganisation('qualified'));
      } else if (overviewType == OverviewTypes.Contact_Qualified) {
        yield put(refreshContact('qualified'));
      } else if (overviewType == OverviewTypes.Contact_Order) {
        yield put(refreshContact('order'));
      }
    }
    yield put(OverviewActions.clearHighlightAction(overviewType));
  } catch (error) {
    yield put(NotificationActions.error(error.message));
  }
}

function* getOpportunityReportInfo(): Generator<*, *, *> {
  try {
    const state = yield select();
    const period = getPeriod(state, OverviewTypes.Pipeline.Qualified);
    const isFilterAll = period.period === 'all';
    const { roleType } = state.ui.app;
    let userId = state.ui.app.activeRole;
    if (roleType === 'Person' && !userId) {
      userId = state.auth.userId;
    } else if (roleType === 'Company') {
      userId = null;
    }

    const filterDTO = {
      startDate: isFilterAll ? null : new Date(period.startDate).getTime(),
      endDate: isFilterAll ? null : new Date(period.endDate).getTime(),
      isFilterAll,
      unitId: null,
      periodType: period.period.toUpperCase(),
      userId: userId,
    };

    const data = yield call(api.post, {
      resource: `${Endpoints.Report}/getOpportunityReportInfo`,
      data: {
        ...filterDTO,
      },
    });
    yield put(QualifiedActions.getOpportunityReportInfoSuccess(data));
  } catch (error) {
    yield put(NotificationActions.error(_l`Oh, something went wrong`));
  }
}

function* fetchSearch() {
  const state = yield select();
  if (state.common.currentOverviewType === OverviewTypes.Pipeline.Qualified) {
    let _mode = state.search[state.common.currentObjectType] ? state.search[state.common.currentObjectType].mode : null;
    if (_mode === 'SEQUENTIAL') {
      yield call(fetchCountBySteps, { salesProcessId: state.search[state.common.currentObjectType].salesProcessId });
    }

    if (_mode === 'DYNAMIC') {
      yield call(fetchListSaleProcess, { salesProcessId: state.search[state.common.currentObjectType].salesProcessId });
    }
    yield call(fetchQualifiedData);
  }
}

// //exportNewOpportunity
// function* exportNewOpportunity() {
//   const state = yield select();
//   try {
//     const __DETAIL = state.entities.qualifiedDeal.__DETAIL;
//     const data = yield call(api.get, {
//       resource: `${Endpoints.Prospect}/exportNewOpportunity?uuid=${__DETAIL.uuid}`
//     });
//   } catch (error) {

//   }
// }

function* updateQualified({ overviewType }) {
  const state = yield select();
  try {
    const __EDIT = state.entities.qualifiedDeal.__EDIT;
    const data = yield call(api.post, {
      resource: `${Endpoints.Prospect}/update`,
      data: {
        ...__EDIT,
      },
    });

    const customFieldValues = getCustomFieldValues(state, __EDIT.uuid);

    const listShow = isListShowQualified(state);

    let qualifiedTrello = null;
    if (!listShow) {
      qualifiedTrello = getDealInTrelloById(state, __EDIT.uuid);
      console.log('===================================', qualifiedTrello);
    }
    if (data) {
      yield put(TrelloActions.updateCardManualyAfterUpdate(data));
      yield put(OverviewActions.clearHighlight(overviewType));
      yield put(NotificationActions.success(_l`Updated`, '', 2000));
      // yield put(OverviewActions.requestFetch(OverviewTypes.Pipeline.Qualified, true));
      if (!listShow && qualifiedTrello?.salesMethod?.uuid !== data.salesMethod.uuid) {
        yield refreshQualifiedDealView(overviewType, __EDIT.uuid);
      } else {
        yield put(QualifiedActions.updateEntityListViewManually(data));
      }
      yield put(QualifiedActions.fetchQualifiedDetail(data.uuid));
      yield put(QualifiedActions.clearDetailToEdit());
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

//fetchPhotos
function* fetchPhotosSaga({ qualifiedDealId }) {
  try {
    // yield put(OverviewActions.startFetch(OverviewTypes.Pipeline.Qualified));

    const data = yield call(api.get, {
      resource: `${documentEndPoints}/photo/listByProspect/${qualifiedDealId}`,
    });
    if (data) {
      const { uploadDTOList } = data;
      yield put(QualifiedActions.fetchPhotosSuccess(qualifiedDealId, uploadDTOList));
    }
    // yield put(OverviewActions.succeedFetch(OverviewTypes.Pipeline.Qualified, [], false, 0));
  } catch (error) {
    yield put(NotificationActions.error(error.message));
  }
}

//Fetch document Storage
function* fetchDocumentsStorage() {
  try {
    const res = yield call(api.get, {
      resource: `${Endpoints.Enterprise}/storage/list`,
    });
    const data = yield call(api.get, {
      resource: `${Endpoints.Enterprise}/storage/listPersonalStorage`,
    });
    yield put(
      fetchDocumentsStorageSuccess({
        storageDTOList: res.storageDTOList,
        userStorageIntegrationDTOList: data.userStorageIntegrationDTOList,
      })
    );
  } catch (error) {
    yield put(NotificationActions.error(error.message));
  }
}

function* fetchGetRootFolder({ uuid }) {
  try {
    const res = yield call(api.get, {
      resource: `${Endpoints.Prospect}/getRootFolder/${uuid}`,
    });
    const data = yield call(api.get, {
      resource: `${documentEndPoints}/document/listByProspectIdAndFolder/${uuid}`,
      query: {
        folderId: res.fileId,
      },
    });
    yield put(
      fetchGetRootFolderSuccess({
        documentDTOList: data.documentDTOList,
        numberDocument: data.numberDocument,
        rootFolder: { ...res },
      })
    );
  } catch (error) {
    yield put(NotificationActions.error(error.message));
  }
}

function* fetchDocumentsByFileId({ uuid, fileId }) {
  try {
    const data = yield call(api.get, {
      resource: `${documentEndPoints}/document/listByProspectIdAndFolder/${uuid}`,
      query: {
        folderId: fileId,
      },
    });
    if (data) {
      yield put(fetchDocumentsByFileIdSuccess({ documentDTOList: data.documentDTOList }, true));
    }
  } catch (error) {
    yield put(fetchDocumentsByFileIdFail());
    yield put(NotificationActions.error(error.message));
  }
}

export default function* saga(): Generator<*, *, *> {
  yield all(overviewSagas);
  yield all(OrderoverviewSagas);
  //FETCH_QUALIFIED_DATA
  yield takeLatest(PERFORM_SEARCH, fetchSearch);
  yield takeLatest(ActionTypes.FETCH_QUALIFIED_DATA, fetchQualifiedData);
  yield takeLatest(ActionTypes.FETCH_COUNT_BY_STEPS, fetchCountBySteps);
  yield takeLatest(ActionTypes.FETCH_QUALIFIED_DETAIL, fetchQualifiedDeal);
  yield takeLatest(ActionTypes.CREATE_ENTITY_FETCH, addQualified);
  yield takeLatest(ActionTypes.FETCH_QUALIFIED_DETAIL_TO_EDIT, fetchQualifiedDealToEdit);

  yield takeLatest(ActionTypes.FETCH_LIST_SALE_PROCESS, fetListSaleProcess);
  yield takeLatest(ActionTypes.SORT_ORDER_BY, fetListSaleProcess);
  //SORT_ORDER_BY

  yield takeLatest(ActionTypes.SET_FAVORITE_DEAL, setFavoriteDeal);
  yield takeLatest(ActionTypes.SET_LOST_DEAL, setLostDeal);
  yield takeLatest(ActionTypes.FETCH_ORDER_ROW_QUALIFIED_DEAL, fetchNumberOrderRow);
  //TASK
  yield takeLatest(ActionTypes.FETCH_TASKS, fetchTasks);
  yield takeLatest(ActionTypes.REFESH_QUALIFIED_DEAL, refeshQualifiedDeal);
  yield takeLatest(ActionTypes.REFESH_ORDER_DEAL, refeshOrderDeal);

  //refeshQualifiedDeal

  //fet appointment
  yield takeLatest(ActionTypes.FETCH_APPOINTMENTS, fetchAppointments);

  //fetchNotes
  yield takeLatest(ActionTypes.FETCH_NOTES, fetchNotes);

  yield takeLatest(ActionTypes.CHANGE_ON_MULTI_QUALIFIED_MENU, changeOnMultiMenu);
  yield takeLatest(ActionTypes.REFESH_QUALIFIED_DETAIL, refeshQualifiedDeal);
  yield takeLatest(ActionTypes.FETCH_LIST_ACTIVITY, fetListActivity);
  yield takeLatest(ActionTypes.FETCH_LIST_BY_SALE, fetListBySale);
  yield takeLatest(ActionTypes.INIT_DELETE_ROW, initDeleteRow);
  yield takeLatest(ActionTypes.DELETE_ROW, deleteRow);
  yield takeLatest(ActionTypes.DELETE_CONNECT_OBJECT, deleteConnectObject);
  //PROGRESS_UPDATE
  yield takeLatest(ActionTypes.PROGRESS_UPDATE, progressUpdate);

  //add order
  yield takeLatest(ActionTypes.ADD_ORDER, addOrder);

  //action plan
  yield takeLatest(ActionTypes.FETCH_ACTION_PLAN, fetchActionPlan);
  yield takeLatest(ActionTypes.MOVE_STEP_ACTION_PLAN, moveStepActionPlanRequest);

  //products
  yield takeLatest(ActionTypes.FETCH_PRODUCTS, fetchProducts);
  yield takeLatest(ActionTypes.FETCH_PROSPECT_LITE, getProspectLite);

  //update responsible
  yield takeLatest(ActionTypes.UPDATE_RESPONSIBLE_ONE_DEAL, updateResponsible);

  //get overview
  yield takeLatest(ActionTypes.GET_OPPORT_UNITY_REPORT_INFO, getOpportunityReportInfo);
  //update qualified
  yield takeLatest(ActionTypes.UPDATE_QUALIFIED_FETCH, updateQualified);

  //FETCH_PHOTOS
  yield takeLatest(ActionTypes.FETCH_PHOTOS, fetchPhotosSaga);

  //DOCUMENTS
  yield takeLatest(ActionTypes.FETCH_DOCUMENTS_STORAGE, fetchDocumentsStorage);
  yield takeLatest(ActionTypes.FETCH_DOCUMENTS_ROOT_FOLDER, fetchGetRootFolder);
  yield takeLatest(ActionTypes.FETCH_DOCUMENTS_BY_FILEID, fetchDocumentsByFileId);
  yield takeLatest(HIDE_SEARCH, fetchSearch);
  yield takeLatest(SELECT_SAVED, fetchSearch);
}

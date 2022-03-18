import { all, takeLatest, call, put, select, fork } from 'redux-saga/effects';
import { Endpoints, ObjectTypes, OverviewTypes } from '../../Constants';
import api from 'lib/apiClient';
import ActionTypes from './recruitment.actions';
import * as RecruitmentActions from './recruitment.actions';
import { getSearch, getSearchForSave } from 'components/AdvancedSearch/advanced-search.selectors';
import { getPeriod } from 'components/PeriodSelector/period-selector.selectors';
import { getCurrentTimeZone } from 'lib/dateTimeService';
import generateUuid from 'uuid/v4';
import AdvancedSearchActionTypes from 'components/AdvancedSearch/advanced-search.actions';
import OverviewActionTypes from 'components/Overview/overview.actions';
import * as OverviewActions from '../Overview/overview.actions';
import createOverviewSagas from '../../components/Overview/overview.saga';
import { recruitment } from './recruitment.schema';
import { getOverview } from '../Overview/overview.selectors';
import * as NotificationActions from '../Notification/notification.actions';
import _l from 'lib/i18n';
import { getCustomFieldsObject, getCustomFieldValues } from '../CustomField/custom-field.selectors';
import { updatePeriodFilter, requestUpdateDisplaySetting, updateSelectedCaseInRecruitment } from '../Settings/settings.actions';

const recruitmentOverviewSagas = createOverviewSagas(
  {
    list: `${Endpoints.Recruitment}/recruitment/list`,
    // count: `${Endpoints.Recruitment}/recruitment/countRCByProcess`,
  },
  OverviewTypes.RecruitmentClosed,
  ObjectTypes.RecruitmentClosed,
  'recruitment',
  recruitment,
  (requestData) => {
    const {
      searchFieldDTOList,
      ftsTerms,
      customFilter,
      roleFilterType,
      roleFilterValue,
      isDeleted,
      startDate,
      endDate,
      orderBy,
      isRequiredOwner,
      isFilterAll,
    } = requestData;

    return {
      searchFieldDTOList: searchFieldDTOList,
      ftsTerms: ftsTerms,
      roleFilterType: roleFilterType,
      roleFilterValue: roleFilterValue,
      isDeleted: isDeleted,
      startDate: startDate,
      endDate: endDate,
      isFilterAll: isFilterAll,
      orderBy: 'wonLostDate',
      isRequiredOwner: isRequiredOwner,
      customFilter: customFilter,
      // resourceType:
    };
  }
);

function* fetchCloseDataByCaseId({ recruitmentCaseId }) {
  const state = yield select();
  const search = getSearch(state, state?.common?.currentObjectType);
  const period = getPeriod(state, state?.common?.currentObjectType);
  const { searchFieldDTOList } = getSearchForSave(state, state?.common?.currentObjectType);
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
    searchFieldDTOList: searchFieldDTOList,
    ftsTerms: search.term,
    roleFilterType: roleType,
    roleFilterValue: roleValue,
    isDeleted: false,
    isFilterAll: isFilterAll,
    orderBy: 'wonLostDate', //search.orderBy ? search.orderBy :
    isRequiredOwner: false,
    customFilter: search.filter ? search.filter : 'active',
  };

  try {
    // if(recruitmentCaseId === 'ALL') return;
    if(!recruitmentCaseId) return;
    const rcDetail = yield call(api.get, {
      resource: `${Endpoints.Recruitment}/recruitment/getDetailRC/${recruitmentCaseId}`,
    });
    if (rcDetail) {
      const requests = rcDetail.activityDTOList?.map((e, index) => {
        return call(api.post, {
          resource: `${Endpoints.Recruitment}/recruitment/list`,
          query: {
            lastStep: index === rcDetail.activityDTOList.length - 1 ? true : false,
            pageIndex: 0,
            pageSize: 24,
            stepId: e.uuid,
            timeZone: getCurrentTimeZone(),
            sessionKey: generateUuid(),
            recruitmentCaseId: recruitmentCaseId,
          },
          data: {
            ...filterDTO,
          },
        });
      });
      const detailSteps = yield all(requests);
      yield console.log('==============>Detail:', detailSteps);
    }
  } catch (error) {}
}

function* fetchRCActiveDataByCaseId({ recruitmentCaseId }) {
  const state = yield select();
  const search = getSearch(state, state?.common?.currentObjectType);
  const period = getPeriod(state, state?.common?.currentObjectType);
  const { searchFieldDTOList } = getSearchForSave(state, state?.common?.currentObjectType);
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
    isFilterAll,
    roleFilterType: roleType,
    roleFilterValue: roleValue,
    customFilter: search.filter ? search.filter : 'active',
    orderBy: 'contractDate', //search.orderBy ? search.orderBy :
    ftsTerms: search.term,
    searchFieldDTOList: search.shown ? searchFieldDTOList : [],
    // isShowHistory: search.history,
    isDeleted: false,
    isRequiredOwner: false,
  };

  try {
    if (recruitmentCaseId === 'ALL') return;
    if (!recruitmentCaseId) return;
    const rcDetail = yield call(api.get, {
      resource: `${Endpoints.Recruitment}/recruitment/getDetailRC/${recruitmentCaseId}`,
    });

    // yield call(countCandidateByRCId, {
    //   recruitmentCaseId: recruitmentCaseId,
    // });
    if (rcDetail) {
      const requests = rcDetail.activityDTOList?.map((e, index) => {
        return call(api.post, {
          resource: `${Endpoints.Recruitment}/recruitment/getCandidateByStep`,
          query: {
            lastStep: index === rcDetail.activityDTOList.length - 1 ? true : false,
            pageIndex: 0,
            pageSize: 24,
            stepId: e.uuid,
            timeZone: getCurrentTimeZone(),
            sessionKey: generateUuid(),
            recruitmentCaseId: recruitmentCaseId,
          },
          data: {
            ...filterDTO,
          },
        });
      });
      const detailSteps = yield all(requests);
      yield console.log('==============>Detail:', detailSteps);
      yield put(RecruitmentActions.fetchRCActiveDataSuccess(rcDetail));
      yield put(RecruitmentActions.fetchDataCandidateToTrelloBoardSuccess(detailSteps));
      if (detailSteps) {
        let total = 0;
        detailSteps.map((e) => {
          total += e.total;
        });
        yield put(OverviewActions.succeedFetch(OverviewTypes.RecruitmentActive, [], true, total || 0));
      }
      yield put(updateSelectedCaseInRecruitment('candidateActive', recruitmentCaseId));
      yield put(requestUpdateDisplaySetting());
    }
  } catch (error) {}
}

function* fetchListCandidateByStep({ stepId, lastStep }) {
  try {
    const state = yield select();
    const search = getSearch(state, state?.common?.currentObjectType);
    const period = getPeriod(state, state?.common?.currentObjectType);
    const { searchFieldDTOList } = getSearchForSave(state, state?.common?.currentObjectType);
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
      isFilterAll,
      roleFilterType: roleType,
      roleFilterValue: roleValue,
      customFilter: search.filter ? search.filter : 'active',
      orderBy: 'contractDate', //search.orderBy ? search.orderBy :
      isRequiredOwner: false,
      ftsTerms: search.term,
      searchFieldDTOList: search.shown ? searchFieldDTOList : [],
      // isShowHistory: search.history,
      isDeleted: false,
    };
    const res = yield call(api.post, {
      resource: `${Endpoints.Recruitment}/recruitment/getCandidateByStep`,
      query: {
        lastStep: lastStep,
        pageIndex: 0,
        pageSize: 24,
        stepId: stepId,
        timeZone: getCurrentTimeZone(),
        sessionKey: generateUuid(),
        salesProcessId,
      },
      data: {
        ...filterDTO,
      },
    });
    if (res) {
      yield put(RecruitmentActions.fetchListCandidateByStepSuccess(stepId, res));
    }
  } catch (error) {}
}
function* countCandidateByRCId({ recruitmentCaseId }) {
  const state = yield select();
  const search = getSearch(state, state?.common?.currentObjectType);
  const period = getPeriod(state, state?.common?.currentObjectType);
  const { searchFieldDTOList } = getSearchForSave(state, state?.common?.currentObjectType);
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
    isFilterAll,
    roleFilterType: roleType,
    roleFilterValue: roleValue,
    customFilter: search.filter ? search.filter : 'active',
    orderBy: 'contractDate', //search.orderBy ? search.orderBy :
    isRequiredOwner: false,
    ftsTerms: search.term,
    searchFieldDTOList: search.shown ? searchFieldDTOList : [],
    // isShowHistory: search.history,
    isDeleted: false,
  };
  try {
    const res = yield call(api.post, {
      resource: `${Endpoints.Recruitment}/recruitment/countCandidateByProcess`,
      query: { recruitmentCaseId },
      data: {
        ...filterDTO,
      },
    });
    if (res) {
      console.log('res COUNTTTTT:', res);
      yield put(OverviewActions.succeedFetch(OverviewTypes.RecruitmentActive, [], true, res.total || 0));
    }
  } catch (error) {}
}
function* fetchListRC({ isDropdownInForm }) {
  try {
    const state = yield select();
    const savedRC =
      state?.common?.currentObjectType === ObjectTypes.RecruitmentClosed
        ? state.settings.display.candidateClose.defaultView
        : state.settings.display.candidateActive.defaultView;
    let res = null;
    state?.common?.currentObjectType === ObjectTypes.RecruitmentClosed
      ? (res = yield call(api.get, {
          resource: `${Endpoints.Recruitment}/recruitment/listRecruitmentCase`,
          query: {
            isClose: true,
          },
        }))
      : (res = yield call(api.get, {
          resource: `${Endpoints.Recruitment}/recruitment/listRecruitmentCase`,
        }));
    if (res) {
      if (!isDropdownInForm) {
        // let currentRC = state.entities?.recruitment?.__COMMON_DATA?.currentRecruitmentCase;
        // if (!currentRC) {
        //   yield put(RecruitmentActions.fetchRCActiveDataByCaseId(res.recruitmentCaseItemDTOList[0].uuid));
        //   yield put(RecruitmentActions.selectRecruitmentCase(res.recruitmentCaseItemDTOList[0].uuid));
        // } else {
        //   yield put(RecruitmentActions.fetchRCActiveDataByCaseId(currentRC));
        //   yield put(RecruitmentActions.selectRecruitmentCase(currentRC));
        // }
        if (state?.common?.currentObjectType === ObjectTypes.RecruitmentClosed) {
          yield put(RecruitmentActions.fetchListRecruitmentClosedByCaseId(savedRC || 'ALL'));
          yield put(RecruitmentActions.selectRecruitmentCase(savedRC || 'ALL'));
        } else if (state?.common?.currentObjectType === ObjectTypes.RecruitmentActive) {
          if (res.recruitmentCaseItemDTOList.length === 0) {
            yield put(RecruitmentActions.clearDataRecruitmentBoard());
            yield put(RecruitmentActions.fetchListRCSuccess(res.recruitmentCaseItemDTOList));
            return;
          }
          yield put(RecruitmentActions.fetchRCActiveDataByCaseId(savedRC || res.recruitmentCaseItemDTOList[0].uuid));
          yield put(RecruitmentActions.selectRecruitmentCase(savedRC || res.recruitmentCaseItemDTOList[0].uuid));
        }
      }
      yield put(RecruitmentActions.fetchListRCSuccess(res.recruitmentCaseItemDTOList));
    }
  } catch (error) {}
}
function* fetchListRecruitmentClosedByCaseId({ recruitmentCaseId }) {
  const state = yield select();
  const search = getSearch(state, state?.common?.currentObjectType);
  const period = getPeriod(state, state?.common?.currentObjectType);
  const { searchFieldDTOList } = getSearchForSave(state, state?.common?.currentObjectType);
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
    orderBy: 'wonLostDate',
    isRequiredOwner: false,
    ftsTerms: search.term,
    searchFieldDTOList: search.shown ? searchFieldDTOList : [],
    // isShowHistory: search.history,
    isDeleted: false,
    wonLossFilter: search?.tag === 'YES' ? 'WON' : search?.tag === 'NO' ? 'LOSS' : 'ALL',
    recruitmentCaseIds: recruitmentCaseId === 'ALL' ? [] : [recruitmentCaseId],
  };
  try {
    if (recruitmentCaseId !== null) {
      const res = yield call(api.post, {
        resource: `${Endpoints.Recruitment}/recruitment/list`,
        query: {
          pageIndex: 0,
          pageSize: 24,
          timeZone: getCurrentTimeZone(),
          sessionKey: generateUuid(),
        },
        data: {
          ...filterDTO,
        },
      });
      if (res) {
        yield put(
          OverviewActions.succeedFetch(
            OverviewTypes.RecruitmentClosed,
            res.recruitmentDTOList || [],
            true,
            res.total || 0
          )
        );
      }
    }
    yield put(updateSelectedCaseInRecruitment('candidateClose', recruitmentCaseId));
    yield put(requestUpdateDisplaySetting());
  } catch (e) {}
}
function* fetch({ objectType, overviewType }) {
  let state = yield select((state) => state);
  if (objectType === state.common?.currentObjectType || overviewType === state.common?.currentObjectType) {
    yield call(fetchRCActiveDataByCaseId, {
      recruitmentCaseId: state.entities?.recruitment?.__COMMON_DATA?.currentRecruitmentCase,
    });
  }
}

function* changeOnMultiMenu({ option, optionValue, overviewType }) {
  const state = yield select();
  let overviewT = OverviewTypes.RecruitmentClosed;
  let objectT = ObjectTypes.RecruitmentClosed;
  let customFilterDeault = 'active';
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
      roleFilterType: roleType,
      roleFilterValue: roleValue,
      customFilter: search.filter ? search.filter : customFilterDeault,
      orderBy: search.orderBy ? search.orderBy : 'contactName',
      searchFieldDTOList: search.shown ? searchFieldDTOList : [],
    };

    const { selectAll, selected, itemCount } = overview;
    const isSelectedAll = selectAll;
    let contactIds = [];
    let unSelectedIds = [];
    const keys = Object.keys(selected);
    let numItemSelect = 0;

    let a = state.overview?.[OverviewTypes.RecruitmentClosed]?.selected;
    let b = state.overview?.[OverviewTypes.RecruitmentClosed]?.items;
    let c = b.filter((e) => e.uuid && a[e.uuid]).map((e) => e.contactId);
    if (isSelectedAll) {
      contactIds = [];
      unSelectedIds = b.filter((e) => e.uuid && a[e.uuid] === false).map((e) => e.contactId);
      numItemSelect = itemCount && itemCount - unSelectedIds.length;
    } else {
      contactIds = c;
      numItemSelect = contactIds.length;
    }
    let request = null;
    let payload = {
      filterDTO,
      isSelectedAll,
      contactIds,
      unSelectedIds,
      // isProspectActive: isProspectActive,
    };
    if (option === 'change_reponsible') {
      let userIDS = optionValue.map((optionValue) => {
        return optionValue.uuid;
      });
      request = call(api.post, {
        resource: `${Endpoints.Contact}/changeTeamInBatch`,
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
        resource: `${Endpoints.Contact}/sendMailChimpInBatch`,
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
    } else if (option === 'export_to_excel') {
      let filterDTOCus0 = { ...filterDTO, listIds: contactIds, searchText: search.term };
      let filterDTOCus = { ...payload, filterDTO: filterDTOCus0 };
      filterDTOCus.isRequiredOwner = false;
      filterDTOCus.isShowHistory = filterDTO.customFilter == 'history';
      request = call(api.get, {
        resource: `${Endpoints.Contact}/exportAdvancedSearchBySelected`,
        query: {
          filterDTO: JSON.stringify(filterDTOCus),
          // leadFrom: overviewType === OverviewTypes.Pipeline.Qualified ? 'lead_delegation' : 'lead',
          timeZone: new Date().getTimezoneOffset() / -60,
          // timeZone: getCurrentTimeZone(),

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

      const timezone = new Date().getTimezoneOffset() / -60;
      request = call(api.post, {
        resource: `${Endpoints.Contact}/updateDataField`,
        query: {
          timeZone: getCurrentTimeZone(),
        },
        data: {
          ...payload,
          updatedCustomFieldDTOList: updatedCustomFieldDTOList,
          updatedStandardFieldDTO: {
            ...optionValue,
          },
        },
      });
    } else if (option === 'add_to_call_list') {
      request = call(api.post, {
        resource: `${Endpoints.Contact}/sendCallListInBatch`,
        query: {
          sessionKey: generateUuid(),
          timeZone: getCurrentTimeZone(),
        },
        data: {
          filterDTO,
          isSelectedAll,
          contactIds,
          sendCallList: {
            ...optionValue,
          },
        },
      });
    } else if (option === 'delete_multi') {
      let selectedObj = state.overview?.[OverviewTypes.RecruitmentClosed]?.selected;
      let candiateList = Object.keys(selectedObj).map((e) => {
        if (selectedObj[e]) return e;
      });
      request = call(api.post, {
        resource: `${Endpoints.Recruitment}/recruitment/deleteInBatch`,
        data: {
          filterDTO,
          isSelectedAll,
          userDTOList: [],
          candidateList: candiateList,
        },
      });
    } else if (option === 'change_responsible_multi') {
      let selectedObj = state.overview?.[OverviewTypes.RecruitmentClosed]?.selected;
      let candiateList = Object.keys(selectedObj).map((e) => {
        if (selectedObj[e]) return e;
      });
      request = call(api.post, {
        resource: `${Endpoints.Recruitment}/recruitment/changeTeamInbatch`,
        data: {
          filterDTO,
          isSelectedAll,
          userDTOList: optionValue?.map((e) => ({ uuid: e })),
          candidateList: candiateList,
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
      case 'change_responsible_multi':
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
      case 'add_multi_unqualified':
        // message = `${_l`Updated`}`;
        if (numItemSelect > 30) {
          message = 'You will get an email when your deals are added.';
        } else {
          message = 'You will receive an email after the update is done';
        }
        break;
      case 'contact_qualified_multi':
        message = `${_l`Updated`}`;
        break;
      case 'contact_order_multi':
        message = `${_l`Updated`}`;
        break;
      default:
        break;
    }

    if (data.message === 'SUCCESS' || data.isSuccess || data === 'SUCCESS' || data.code == 200) {
      yield put(OverviewActions.requestFetch(overviewT, true));
      yield put(OverviewActions.clearHighlightAction(overviewT));
      switch (option) {
        case 'delete_multi':
        case 'change_responsible_multi':
        case 'set_done_multi':
          yield put(OverviewActions.setSelectAll(overviewT, false));
          break;
        case 'assign_multi_unqualified':
          yield put(OverviewActions.setSelectAll(overviewT, false));
          break;
        case 'add_multi_unqualified':
          yield put(OverviewActions.clearHighlightAction(overviewType));
          yield put(ContactActions.refreshContact('unqualified'));
          yield put(UnqualifiedDealActions.clearCreateEntity());
          break;
        default:
          break;
      }
      if (
        option === 'assign_multi_unqualified_to_me' ||
        option == 'assign_multi_unqualified' ||
        option == 'change_reponsible' ||
        option == 'add_to_call_list' ||
        option == 'update_data_fields' ||
        option == 'set_done_multi' ||
        option == 'delete_multi' ||
        option == 'change_responsible_multi'
      ) {
        return yield put(NotificationActions.success(_l`Updated`, '', 2000));
      }

      if (option === 'contact_qualified_multi') {
        yield put(OverviewActions.clearHighlightAction('CONTACT_QUALIFIED_MULTI'));
        yield put(clearQualified());
        yield put(clear());
        yield put(create());
      }

      if (option === 'contact_order_multi') {
        yield put(OverviewActions.clearHighlightAction('CONTACT_ORDER_MULTI'));
        yield put(clearQualified('__ORDER_CREATE'));
        yield put(clear());
        yield put(create());
        // return yield put(NotificationActions.success(_l`Updated`, '', 2000));
      }
      if (option === 'add_to_mailchimp_list') {
        return yield put(NotificationActions.success(message, null, null, true));
      }
      // return yield put(NotificationActions.success(_l`${message}`));
      return yield put(NotificationActions.success(_l`Updated`, '', 2000));
    } else {
      if (option === 'add_to_mailchimp_list') {
        yield put(OverviewActions.clearHighlightAction(overviewT));
        return yield put(NotificationActions.success(message, null, null, true));
      }
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

function* loadMoreCandidateByStep({ pageIndex, stepId, lastStep, recruitmentCaseId }) {
  try {
    const state = yield select();
    const search = getSearch(state, state?.common?.currentObjectType);
    const period = getPeriod(state, state?.common?.currentObjectType);
    const { searchFieldDTOList } = getSearchForSave(state, state?.common?.currentObjectType);
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
      isFilterAll,
      roleFilterType: roleType,
      roleFilterValue: roleValue,
      customFilter: search.filter ? search.filter : 'active',
      orderBy: 'contractDate', //search.orderBy ? search.orderBy :
      ftsTerms: search.term,
      searchFieldDTOList: search.shown ? searchFieldDTOList : [],
      // isShowHistory: search.history,
      isDeleted: false,
      isRequiredOwner: false,
    };
    const res = yield call(api.post, {
      resource: `${Endpoints.Recruitment}/recruitment/getCandidateByStep`,
      query: {
        lastStep: lastStep,
        pageIndex: pageIndex,
        pageSize: 24,
        stepId: stepId,
        timeZone: getCurrentTimeZone(),
        sessionKey: generateUuid(),
        recruitmentCaseId: recruitmentCaseId,
      },
      data: {
        ...filterDTO,
      },
    });

    if (res) {
      console.log('Data loadmore:', res);
      yield put(RecruitmentActions.loadMoreCandidateSuccess(res));
    }
  } catch (error) {}
}
export default function* saga() {
  yield all(recruitmentOverviewSagas);
  yield takeLatest(AdvancedSearchActionTypes.PERFORM_SEARCH, fetch);
  yield takeLatest(AdvancedSearchActionTypes.HIDE, fetch);
  yield takeLatest(AdvancedSearchActionTypes.SELECT_SAVED, fetch);
  yield takeLatest(OverviewActionTypes.FETCH_REQUEST, fetch);
  yield takeLatest(ActionTypes.FETCH_LIST_RECRUITMENT_CASE, fetchListRC);
  yield takeLatest(ActionTypes.FETCH_RECRUITMENT_ACTIVE_DATA, fetchRCActiveDataByCaseId);
  yield takeLatest(ActionTypes.FETCH_RECRUITMENT_CLOSED_DATA, fetchCloseDataByCaseId);
  yield takeLatest(ActionTypes.FETCH_LIST_CANDIDATE_BY_SETP, fetchListCandidateByStep);
  yield takeLatest(ActionTypes.FETCH_LIST_CANDIDATE_CLOSED_BY_CASEID, fetchListRecruitmentClosedByCaseId);
  yield takeLatest(ActionTypes.CHANGE_ON_MULTI_MENU, changeOnMultiMenu);
  yield takeLatest(ActionTypes.LOAD_MORE_CANDIADATE_BY_STEP, loadMoreCandidateByStep);
}

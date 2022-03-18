//@flow
import { all, takeLatest, call, put, select, fork } from 'redux-saga/effects';
import createOverviewSagas from '../../components/Overview/overview.saga';
import { Endpoints, ObjectTypes, OverviewTypes } from '../../Constants';
import { resourceList } from './resource.schema';
import * as ResourceActions from './resources.actions';
import ResourceActionTypes from './resources.actions';
import api from 'lib/apiClient';
import { forEach } from 'lodash';
import * as NotificationActions from 'components/Notification/notification.actions';
import _l from 'lib/i18n';
import * as OverviewActions from '../Overview/overview.actions';
import { getSearch, getSearchForSave } from 'components/AdvancedSearch/advanced-search.selectors';
import { getPeriod } from 'components/PeriodSelector/period-selector.selectors';
import { getCurrentTimeZone } from 'lib/dateTimeService';
import { getOverview } from '../Overview/overview.selectors';
import * as OrderRowActions from '../OrderRow/order-row.actions';
import generateUuid from 'uuid/v4';

const resourcesOverviewSagas = createOverviewSagas(
  {
    list: `${Endpoints.Resource}/resource/list`,
    // count: `${Endpoints.Resource}/countRecords`,
  },
  OverviewTypes.Resource,
  ObjectTypes.Resource,
  'resources',
  resourceList,
  (requestData) => {
    const {
      searchFieldDTOList,
      ftsTerms,
      selectedMark,
      orderBy,
      customFilter,
      roleFilterType,
      roleFilterValue,
    } = requestData;

    let orderByValue = orderBy;
    if (orderBy === 'dateAndTime') orderByValue = 'occupancy';
    return {
      searchFieldList: searchFieldDTOList,
      searchText: ftsTerms,
      resourceType: selectedMark,
      orderBy: orderByValue,
      favorite: customFilter === 'active' ? false : true,
      roleFilterType: roleFilterType,
      roleFilterValue: roleFilterValue,
      // resourceType:
    };
  }
);

// Favourites
function* toggleFavoriteRequest(values) {
  const { resourceId, flag } = values;

  try {
    const data = yield call(api.put, {
      resource: `${Endpoints.Resource}/resource/updateResourceFavorite`,
      data: {
        resourceId,
        favorite: flag,
      },
    });

    if (data === 'SUCCESS') {
      yield put(ResourceActions.updateFavoriteResourceSuccess(resourceId, flag));
    }
  } catch (e) {}
}

function* fetchCompetence({ resourceId }) {
  try {
    const state = yield select();
    const data = yield call(api.get, {
      resource: `${Endpoints.Resource}/resource/listCompetence`,
      query: {
        resourceId: resourceId,
        languageVersion: state.entities?.resources?.LANGUAGE_RESOURCE_DETAIL || state?.ui?.app?.locale,
      },
    });
    if (data) {
      yield put(ResourceActions.setCompetence(data));
    }
  } catch (e) {}
}

function* getAllCompetence({ lang }) {
  try {
    const data = yield call(api.get, {
      resource: `${Endpoints.Resource}/competence/listAll`,
      query: {
        languageVersion: lang,
      },
    });
    if (data) {
      let _data = [];
      forEach(data.data, (item) => {
        item['value'] = item.uuid;
        item['text'] = item.name;
        if (item.name.trim().length > 0) _data.push(item);
      });
      yield put(ResourceActions.setCompetenceName(_data));
      yield put(ResourceActions.sortCompetenceList('competence'));
    }
  } catch (e) {
    console.log('EEE:', e);
  }
}

function* createCompetenceName({ name, lang }) {
  try {
    const state = yield select();
    yield put(ResourceActions.setCompetenceNameExist(null));
    const data = yield call(api.post, {
      resource: `${Endpoints.Resource}/competence/create`,
      data: {
        name: name,
        languageVersion: state.entities?.resources?.LANGUAGE_RESOURCE_DETAIL || state?.ui?.app?.locale,
      },
    });

    if (data) {
      yield put(ResourceActions.getAllCompetence(lang));
      let _competenceItem = yield select((state) => state.entities.resources.competenceItem);
      yield put(
        ResourceActions.updateCompetenceItem({
          ..._competenceItem,
          competenceId: data.uuid,
        })
      );
      yield put(ResourceActions.setCompetenceNameExist(false));
    } else {
      yield put(ResourceActions.setCompetenceNameExist(true));
    }
  } catch (e) {
    console.log('function*createCompetenceName -> e', e);
  }
}

function* updateProfile({ resourceId, field, data }) {
  console.log('function*updateProfile -> resourceId', resourceId, field, data);
  return;
  let DTO = {
    resourceId: resourceId,
    [field]: data,
  };
  try {
    const data = yield call(api.put, {
      resource: `${Endpoints.Resource}/resource/updateDetailProfile`,
      data: DTO,
    });
    console.log('function*updateProfile -> data', data);
  } catch (e) {}
}

function* fetchResourceDetail(values) {
  const { resourceId, languageVersion } = values;
  try {
    if (resourceId && languageVersion) {
      const data = yield call(api.get, {
        resource: `${Endpoints.Resource}/resource/detailProfile`,
        query: {
          resourceId,
          languageVersion,
        },
      });
      if (data) {
        yield put(ResourceActions.fetchDetailSuccess({ ...data }));
      }
    }
  } catch (e) {}
}

function* fetchExperience({ resourceId }) {
  try {
    const { experienceDTOList } = yield call(api.get, {
      resource: `${Endpoints.Resource}/resource/experience/getAll`,
      query: {
        ...resourceId,
      },
    });

    if (experienceDTOList) {
      yield put(ResourceActions.setExperience(experienceDTOList));
    }
  } catch (e) {}
}

function* addExperience({ data }) {
  try {
    const response = yield call(api.put, {
      resource: `${Endpoints.Resource}/resource/experience/add`,
      data,
    });

    if (response) {
      // yield put(ResourceActions.setAddExperience(response));
      yield put(NotificationActions.success(`Added`, '', 2000));
      yield put(ResourceActions.fetchExperience({resourceId: data.resourceId}));
    }
  } catch (e) {}
}

function* updateExperience({ data }) {
  try {
    const response = yield call(api.put, {
      resource: `${Endpoints.Resource}/resource/experience/update`,
      data,
    });

    if (response) {
      yield put(ResourceActions.changeItemExperience(response));
      yield put(ResourceActions.setUpdateExperience(null));
      yield put(NotificationActions.success(_l`Updated`, '', 2000));
    }
  } catch (e) {}
}

function* removeItemExperience({ resourceExperienceId }) {
  try {
    const response = yield call(api.delete, {
      resource: `${Endpoints.Resource}/resource/experience/delete`,
      query: { resourceExperienceId },
    });

    if (response) {
      yield put(ResourceActions.removeItemExperienceState(response));
      yield put(NotificationActions.success(`Deleted`, '', 2000));
    }
  } catch (e) {}
}

function* addSingleCompetence({ data }) {
  try {
    const response = yield call(api.put, {
      resource: `${Endpoints.Resource}/resource/addSingleCompetence`,
      data: data,
    });
    if (response) {
      yield call(fetchCompetence, { resourceId: data.resourceId });
      yield put(NotificationActions.success(_l`Added`, '', 2000));
      yield put(
        ResourceActions.updateCompetenceItem({
          competenceLevel: null,
          competenceId: null,
          lastUsed: '',
        })
      );
    }
  } catch (e) {}
}

function* deleteSingleCompetence({ data }) {
  try {
    const response = yield call(api.delete, {
      resource: `${Endpoints.Resource}/resource/deleteSingleCompetence`,
      options: {
        data: data,
      },
    });
    if (response) {
      yield call(fetchCompetence, { resourceId: data.resourceId });
      yield put(NotificationActions.success(_l`Deleted`, '', 2000));
    }
  } catch (e) {}
}

function* updateSingleCompetence({ datas, resourceId }) {
  try {
    let _listRq = [];
    if (datas) {
      forEach(datas, (item) => {
        let _obj = {
          competenceLevel: item.competenceLevel || 1,
          resourceId: resourceId,
          resourceCompetenceId: item.uuid,
          lastUsed: item.lastUsed,
          order: item.order,
          competenceId: item.competenceId,
        };
        _listRq.push(
          call(api.put, {
            resource: `${Endpoints.Resource}/resource/updateSingleCompetence`,
            data: _obj,
          })
        );
      });
    }
    yield all(_listRq);
    yield call(fetchCompetence, { resourceId: resourceId });
  } catch (ex) {}
}

function* updateMultipleCompetence({ datas, resourceId }) {
  const state = yield select();

  if (!resourceId) {
    resourceId = state.entities?.resources?.__DETAIL?.uuid;
  }
  try {
    if (datas) {
      let dto = {
        resourceId: resourceId,
        updateResourceCompetenceSet: [],
      };
      forEach(datas, (item) => {
        let _obj = {
          competenceLevel: item.competenceLevel || 1,
          resourceCompetenceId: item.uuid,
          lastUsed: item.lastUsed,
          order: item.order,
          competenceId: item.competenceId,
        };
        dto.updateResourceCompetenceSet.push(_obj);
      });
      const response = yield call(api.put, {
        resource: `${Endpoints.Resource}/resource/updateMultipleCompetence`,
        data: dto,
      });
      if (response) yield call(fetchCompetence, { resourceId: resourceId });
    }
  } catch (ex) {}
}

function* updateMultipleExperience({ data }) {
  try {
    const response = yield call(api.put, {
      resource: `${Endpoints.Resource}/resource/experience/updateMultiple`,
      data: data,
    });
    if (response) {
      yield put(NotificationActions.success(`Updated`, '', 2000));
    }
  } catch (e) {}
}

function* changeOnMultiMenu({ option, optionValue, overviewType }) {
  const state = yield select();
  let overviewT = OverviewTypes.Resource;
  let objectT = ObjectTypes.Resource;
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

    const { selectAll, selected, itemCount } = overview;
    const isSelectedAll = selectAll;
    let resourceIds = [];
    let unSelectedIds = [];
    const keys = Object.keys(selected);
    let numItemSelect = 0;

    let a = state.overview?.[OverviewTypes.Resource]?.selected;
    let b = state.overview?.[OverviewTypes.Resource]?.items;
    // let c = b.filter((e) => e.uuid && a[e.uuid]).map((e) => e.uuid);
    if (isSelectedAll) {
      resourceIds = [];
      unSelectedIds = b.filter((e) => e.uuid && a[e.uuid] === false).map((e) => e.uuid);
      numItemSelect = itemCount && itemCount - unSelectedIds.length;
    } else {
      resourceIds = keys?.filter((e) => e && a?.[e]);
      numItemSelect = resourceIds.length;
    }
    const filterDTO = {
      roleFilterType: roleType,
      roleFilterValue: roleValue,
      orderBy: search.orderBy ? search.orderBy : 'Alphabetical',
      searchFieldList: search.shown ? searchFieldDTOList : [],
      searchText: search.term,
      resourceType: search.tag,
      orderBy: search.orderBy,
      favorite: false,
    };
    let request = null;
    let payload = {
      isSelectedAll,
      resourceIds: resourceIds,
      // isProspectActive: isProspectActive,
    };
    if (option === 'add_to_mailchimp_list') {
      request = call(api.post, {
        resource: `${Endpoints.Resource}/sendMailChimpInBatch`,
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
      let filterDTOCus0 = { ...filterDTO };
      let filterDTOCus = { ...payload, filterDTO: filterDTOCus0 };
      request = call(api.get, {
        resource: `${Endpoints.Resource}/exportAdvancedSearchBySelected`,
        query: {
          filterDTO: JSON.stringify(filterDTOCus),
          // leadFrom: overviewType === OverviewTypes.Pipeline.Qualified ? 'lead_delegation' : 'lead',
          timeZone: new Date().getTimezoneOffset() / -60,
          // timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'change_responsible_multi') {
      let selectedObj = state.overview?.[OverviewTypes.Resource]?.selected;
      let resourceIds = Object.keys(selectedObj).map((e) => {
        if (selectedObj[e]) return e;
      });
      request = call(api.post, {
        resource: `${Endpoints.Resource}/resource/changeManagerInBatch`,
        data: {
          filterDTO,
          isSelectedAll,
          managerId: optionValue ? optionValue : '',
          resourceIds: resourceIds,
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
      case 'change_responsible_multi':
        message = `${_l`Updated`}`;
        break;
      case 'add_to_mailchimp_list':
        message = `${_l`Total contacts added to the Mailchimp list:`} ${data.result ? data.result.countSuccess : 0}`;
        break;
      default:
        break;
    }

    if (data.message === 'SUCCESS' || data.isSuccess || data === 'SUCCESS' || data.code == 200) {
      yield put(OverviewActions.requestFetch(overviewT, true));
      yield put(OverviewActions.clearHighlightAction(overviewT));
      switch (option) {
        case 'change_responsible_multi':
          yield put(OverviewActions.setSelectAll(overviewT, false));
          break;
      }
      if (option == 'change_responsible_multi') {
        return yield put(NotificationActions.success(_l`Updated`, '', 2000));
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

function* fetchListProductByResources() {
  const state = yield select();

  const overview = getOverview(state, OverviewTypes.Resource);
  const search = getSearch(state, ObjectTypes.Resource);
  // const period = getPeriod(state, objectT);
  const { searchFieldDTOList } = getSearchForSave(state, ObjectTypes.Resource);
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
    orderBy: search.orderBy ? search.orderBy : 'closedSales',
    searchFieldList: search.shown ? searchFieldDTOList : [],
  };

  let uuids = Object.keys(state.overview?.RESOURCE?.selected)?.map((e) => {
    if (state.overview?.RESOURCE?.selected[e]) return e;
  });
  let payload = {
    filterDTO,
    isSelectedAll: state.overview?.RESOURCE?.selectAll,
    resourceIds: state.overview?.RESOURCE?.selectAll ? [] : uuids.filter((e) => e),
    unSelectedIds: [],
    emailAddList: [],
    managerId: null,
  };

  try {
    const res = yield call(api.post, {
      resource: `${Endpoints.Resource}/resource/getListProductAndGroup`,
      data: payload,
    });
    if (res) {
      yield put(
        OrderRowActions.editEntity(
          res.data?.map((e) => {
            return {
              uuid: generateUuid(),
              lineOfBusinessName: e.lineOfBusinessDTO?.name,
              lineOfBusinessId: e.lineOfBusinessDTO?.uuid,
              measurementTypeId: e.productDTO?.measurementTypeId,
              measurementTypeName: e.productDTO?.measurementTypeName,
              discountPercent: 0,
              discountedPrice: 0,
              margin: 0,
              deliveryEndDate: new Date().getTime(),
              deliveryStartDate: new Date().getTime(),
              occupied: null,
              price: 0,
              numberOfUnit: 0,
              productDTO: {
                lineOfBusinessId: e.lineOfBusinessDTO?.uuid,
                lineOfBusinessName: e.lineOfBusinessDTO?.name,
                uuid: e.productDTO?.uuid,
                name: e.productDTO?.name,
                costUnit: 0,
                measurementTypeId: e.productDTO?.measurementTypeId,
                measurementTypeName: e.productDTO?.measurementTypeName,
                price: e.productDTO?.price || 0,
                quantity: e.productDTO?.quantity || 0,
                resourceId: e.productDTO?.resourceId,
              },
            };
          }),
          null
        )
      );
    }
  } catch (error) {
    console.log(error);
  }
}

export default function* saga() {
  yield all(resourcesOverviewSagas);
  yield takeLatest(ResourceActionTypes.TOGGLE_FAVORITE_REQUEST, toggleFavoriteRequest);
  yield takeLatest(ResourceActionTypes.FETCH_COMPETENCE, fetchCompetence);
  yield takeLatest(ResourceActionTypes.CREATE_COMPETENCE_NAME, createCompetenceName);
  yield takeLatest(ResourceActionTypes.GET_ALL_COMPETENCE, getAllCompetence);
  yield takeLatest(ResourceActionTypes.UPDATE_PROFILE, updateProfile);
  yield takeLatest(ResourceActionTypes.FETCH_RESOURCE_DETAIL, fetchResourceDetail);
  yield takeLatest(ResourceActionTypes.FETCH_LIST_EXPERIENCE, fetchExperience);
  yield takeLatest(ResourceActionTypes.ADD_EXPERIENCE, addExperience);
  yield takeLatest(ResourceActionTypes.UPDATE_EXPERIENCE, updateExperience);
  yield takeLatest(ResourceActionTypes.REMOVE_ITEM_EXPERIENCE, removeItemExperience);
  yield takeLatest(ResourceActionTypes.ADD_SINGLE_COMPETENCE, addSingleCompetence);
  yield takeLatest(ResourceActionTypes.DELETE_SINGLE_COMPETENCE, deleteSingleCompetence);
  yield takeLatest(ResourceActionTypes.UPDATE_SINGLE_COMPETENCE, updateSingleCompetence);
  yield takeLatest(ResourceActionTypes.UPDATE_MULTIPLE_COMPETENCE, updateMultipleCompetence);
  yield takeLatest(ResourceActionTypes.UPDATE_MULTIPLE_EXPERIENCE, updateMultipleExperience);
  yield takeLatest(ResourceActionTypes.CHANGE_ON_MULTI_MENU, changeOnMultiMenu);
  yield takeLatest(ResourceActionTypes.FETCH_LIST_PRODUCT_BY_RESOURCES, fetchListProductByResources);
}

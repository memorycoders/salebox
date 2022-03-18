//@flow
import { call, put, takeLatest, all, select } from 'redux-saga/effects';
import api from 'lib/apiClient';
import { getSearch, getSearchForSave, getSelected } from './advanced-search.selectors';
import { getPeriod } from 'components/PeriodSelector/period-selector.selectors';
import AdvancedSearchActionTypes, * as AdvancedSearchActions from './advanced-search.actions';
import * as NotificationActions from 'components/Notification/notification.actions';
const advancedSearchEndpoints = 'advance-search-v3.0';
import {
  CUSTOM_FIELD,
  ObjectTypes,
  AdSearchFieldTypeHaveDropdownValue,
  ver,
  OverviewTypes,
  CALL_LIST_TYPE,
} from '../../Constants';
import _l from 'lib/i18n';
import { showHideMassPersonalMail } from '../Common/common.actions';
import { getCurrentTimeZone } from '../../lib/dateTimeService';
addTranslations({
  'en-US': {
    'Name already exist.': 'Name already exist.',
    'You will receive an email when all emails have been sent':
      'You will receive an email when all emails have been sent',
    'According to {{mailServices}} you can only send 1500 emails per day':
      'According to {{mailServices}} you can only send 1500 emails per day',
  },
});
const getDropdown = (fieldList) => {
  // fieldList.sort(function(a, b){return a.title < b.title ? -1 : 1})
  return fieldList.map((field) => ({
    value: field.value,
    key: field.value,
    text: field.title,
    type: field.type,
    customFieldId: field.isCustomField ? field.uuid : null,
    operators: (field.operatorList || []).map((operator) => ({
      key: operator.value,
      value: operator.value,
      text: operator.title,
    })),
  }));
};

const getAdTypeForObjectType = (objectType) => {
  switch (objectType) {
    case ObjectTypes.DelegationLead:
      return ObjectTypes.Lead;
    case ObjectTypes.Delegation:
      return ObjectTypes.Task;
    case OverviewTypes.Pipeline.Order:
    case OverviewTypes.Pipeline.Qualified:
      return OverviewTypes.OPPORTUNITY;
    case ObjectTypes.Resource:
      return OverviewTypes.LIST_RESOURCE;
    default:
      return objectType;
  }
};

function* getSearchInfo({ objectType }): Generator<*, *, *> {
  try {
    yield put(AdvancedSearchActions.setup(objectType));
    let query = getAdTypeForObjectType(objectType);
    const [fields, saved] = yield all([
      call(api.get, {
        resource: `${advancedSearchEndpoints}/listObjectSearchTemplateByType`,
        query: { type: query },
      }),
      call(api.get, {
        resource: `${advancedSearchEndpoints}/listAdvanceSearch`,
        query: { type: query },
      }),
    ]);
    let _fields = fields.fieldList;
    //change name
    if (_fields != null) {
      for (let i = 0; i < _fields.length; i++) {
        let f = _fields[i];
        f.title = f.title
          .replace('Accounts', 'Companies')
          .replace('Account', 'Company')
          .replace('accounts', 'companies')
          .replace('account', 'company')
          .replace('Tasks', 'Reminders')
          .replace('Task', 'Reminder')
          .replace('tasks', 'reminders')
          .replace('task', 'reminder')
          .replace('Appointments', 'Meetings')
          .replace('Appointment', 'Meeting')
          .replace('appointments', 'meetings')
          .replace('appointment', 'meeting')
          .replace('Unqualifieds', 'Prospects')
          .replace('Unqualified', 'Prospect')
          .replace('unqualifieds', 'prospects')
          .replace('unqualified', 'prospect')
          .replace('Qualifieds', 'Deals')
          .replace('Qualified', 'Deal')
          .replace('qualifieds', 'deals')
          .replace('qualified', 'deal');
      }
    }
    let _lengthCustomField = fields.customFieldList ? fields.customFieldList.length : 0;
    if (_lengthCustomField) {
      for (let i = 0; i < _lengthCustomField; i++) {
        fields.customFieldList[i]['isCustomField'] = true;
        fields.customFieldList[i]['value'] = `${CUSTOM_FIELD}_${fields.customFieldList[i].title.toUpperCase()}_${
          fields.customFieldList[i].uuid
        }`;
      }
      _fields = _fields.concat(fields.customFieldList);
    }
    const dropdown = getDropdown(_fields);
    yield put(AdvancedSearchActions.getSearchInfo(objectType, dropdown, saved.advanceSearchDTOList));
  } catch (e) {
    yield put(AdvancedSearchActions.getSearchInfoFail(objectType, e.message));
  }
}

function* save({ objectType }): Generator<*, *, *> {
  try {
    const state = yield select();
    const { update, ...data } = yield getSearchForSave(state, objectType);
    data.objectType = getAdTypeForObjectType(objectType);
    const saved = yield call(api.post, {
      resource: `${advancedSearchEndpoints}/${update ? 'update' : 'add'}`,
      data,
    });
    yield put(AdvancedSearchActions.setAction(objectType, null));
    yield put(AdvancedSearchActions.save(objectType, saved, update));
    yield put(AdvancedSearchActions.selectSaved(objectType, saved.uuid));
    yield put(NotificationActions.success(_l`Success`, '', 2000));
    return data;
  } catch (e) {
    yield put(NotificationActions.error(_l`Name already exist.`));
    yield put(AdvancedSearchActions.saveFail(objectType, e.message));
  }
}

function* copy({ objectType }): Generator<*, *, *> {
  try {
    const state = yield select();
    const { update, ...data } = yield getSearchForSave(state, objectType);
    data.objectType = getAdTypeForObjectType(objectType);
    const saved = yield call(api.post, {
      resource: `${advancedSearchEndpoints}/add`,
      data,
    });
    yield put(AdvancedSearchActions.setAction(objectType, null));
    yield put(AdvancedSearchActions.copy(objectType, saved));
    yield put(AdvancedSearchActions.selectSaved(objectType, saved.uuid));
    yield put(NotificationActions.success(_l`Success`, '', 2000));

    return data;
  } catch (e) {
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
    yield put(NotificationActions.error(e.message));
    yield put(AdvancedSearchActions.copyFail(objectType, e.message));
  }
}

function* share({ objectType }): Generator<*, *, *> {
  try {
    const data = yield call(save, { objectType });
    const state = yield select();
    const { sharedWith } = yield getSearch(state, objectType);
    if (sharedWith.selected === 'company') {
      yield call(api.post, {
        resource: `${advancedSearchEndpoints}/shareAdvancedSearch`,
        data,
      });
    } else if (sharedWith.selected === 'unit') {
      yield all(
        sharedWith.unit.map((unitId) => {
          return call(api.post, {
            resource: `${advancedSearchEndpoints}/shareAdvancedSearch`,
            query: { unitId },
            data,
          });
        })
      );
    }
    yield put(NotificationActions.success(_l`Success`, '', 2000));
    yield put(AdvancedSearchActions.share(objectType, data));
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
    yield put(AdvancedSearchActions.shareFail(objectType, e.message));
  }
}

function* remove({ objectType }): Generator<*, *, *> {
  try {
    const selected = yield select(getSelected, objectType);
    yield call(api.post, {
      resource: `${advancedSearchEndpoints}/delete/${selected}`,
    });
    yield put(AdvancedSearchActions.setAction(objectType, null));
    yield put(AdvancedSearchActions.selectSaved(objectType, null));
    yield put(AdvancedSearchActions.remove(objectType, selected));
    yield put(NotificationActions.success(_l`Success`, '', 2000));
    yield put(AdvancedSearchActions.show(objectType));
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
    yield put(AdvancedSearchActions.removeFail(objectType, e.message));
  }
}

function* fetchFieldValueDropdown({rowId, objectType, fieldType }) {
  yield put(AdvancedSearchActions.updateStatusFetchingDropdownValue(objectType, true, rowId));
  let _url = null;
  let _dto,
    _options = [];
  let _method = 'get';
  switch (fieldType) {
    case AdSearchFieldTypeHaveDropdownValue.GOT_PRODUCT:
    case AdSearchFieldTypeHaveDropdownValue.COMING_PRODUCT:
    case AdSearchFieldTypeHaveDropdownValue.PRODUCT:
      _url = `administration-${ver}/product/listByCompany`;
      _dto = 'productDTOList';
      break;
    case AdSearchFieldTypeHaveDropdownValue.GOT_PRODUCT_TYPE:
    case AdSearchFieldTypeHaveDropdownValue.COMING_PRODUCT_TYPE:
    case AdSearchFieldTypeHaveDropdownValue.PRODUCT_TYPE:
      _url = `administration-${ver}/measurement/list`;
      _dto = 'measurementTypeDTOList';
      break;
    case AdSearchFieldTypeHaveDropdownValue.SOURCE:
      _options = [
        {
          name: 'Manual',
          uuid: 'NONE',
        },
        {
          name: 'Facebook',
          uuid: 'FACEBOOK',
        },
        {
          name: 'Mail Chimp',
          uuid: 'MAIL_CHIMP',
        },
        {
          name: 'LinkedIn',
          uuid: 'LINKED_IN',
        },
        {
          name: 'Website',
          uuid: 'LEADBOXER',
        },
      ];
      break;
    case AdSearchFieldTypeHaveDropdownValue.PRIORITY:
      _options = [
        {
          name: 'Lowest',
          uuid: 'LOWEST',
        },
        {
          name: 'Low',
          uuid: 'LOW',
        },
        {
          name: 'Medium',
          uuid: 'MEDIUM',
        },
        {
          name: 'High',
          uuid: 'HIGH',
        },
        {
          name: 'Highest',
          uuid: 'HIGHEST',
        },
      ];
      break;
    case AdSearchFieldTypeHaveDropdownValue.BEHAVIOR_COLOR:
      _options = [
        { name: 'Blue', uuid: 'BLUE' },
        { name: 'Green', uuid: 'GREEN' },
        { name: 'Red', uuid: 'RED' },
        { name: 'Yellow', uuid: 'YELLOW' },
      ];
      break;
    case AdSearchFieldTypeHaveDropdownValue.SEQUENTIAL_ACTIVITY:
      _url = `prospect-${ver}/getListActivitySequential`;
      _method = 'post';
      break;
    case AdSearchFieldTypeHaveDropdownValue.WON:
    case AdSearchFieldTypeHaveDropdownValue.LOST:
      _options = [
        {
          name: objectType === ObjectTypes.RecruitmentClosed ? 'True' : 'True',
          uuid: 'TRUE',
        },
        {
          name: objectType === ObjectTypes.RecruitmentClosed ? 'False' : 'False',
          uuid: 'FALSE',
        },
      ];
      break;
    case AdSearchFieldTypeHaveDropdownValue.CALL_LIST:
      _url =
        objectType == 'CONTACT'
          ? `call-lists-${ver}/callListContact/forAdvancedSearch`
          : `call-lists-${ver}/callListAccount/forAdvancedSearch`;
      break;
    case AdSearchFieldTypeHaveDropdownValue.PRODUCT_GROUP:
    case AdSearchFieldTypeHaveDropdownValue.GOT_PRODUCT_GROUP:
    case AdSearchFieldTypeHaveDropdownValue.COMING_PRODUCT_GROUP:
      _url = `administration-${ver}/lineOfBusiness/list`;
      _dto = 'lineOfBusinessDTOList';
      break;
    case AdSearchFieldTypeHaveDropdownValue.RELATION:
    case AdSearchFieldTypeHaveDropdownValue.CONTACT_RELATION:
      _url = `administration-${ver}/workData/organisations`;
      _dto = 'workDataOrganisationDTOList';
      break;
    case AdSearchFieldTypeHaveDropdownValue.UNIT:
      _url = `enterprise-${ver}/unit/list`;
      _dto = 'unitDTOList';
      break;
    case AdSearchFieldTypeHaveDropdownValue.USER:
      _url = `enterprise-${ver}/user/listUserLite`;
      _dto = 'userLiteDTOList';
      break;
    case AdSearchFieldTypeHaveDropdownValue.STATUS:
      _options = [
        { name: 'preparing', uuid: 'PREPARING' },
        { name: 'Not ready', uuid: 'NOT_READY' },
        { name: 'Ready', uuid: 'READY' },
        { name: 'Activated', uuid: 'ACTIVATED' },
        { name: 'Sending', uuid: 'SENDING' },
        { name: 'Sent done', uuid: 'SENT_DONE' },
      ];
      break;
  }
  if (_url) {
    try {
      let response = yield call(api[_method], {
        resource: _url,
      });
      yield put(AdvancedSearchActions.updateDropdownValue(objectType, _dto ? response[_dto] : response, rowId));
      yield put(AdvancedSearchActions.updateStatusFetchingDropdownValue(objectType, false, rowId));
    } catch (ex) {
      yield put(AdvancedSearchActions.updateStatusFetchingDropdownValue(objectType, false));
    }
  } else {
    yield put(AdvancedSearchActions.updateDropdownValue(objectType, _options, rowId));
    yield put(AdvancedSearchActions.updateStatusFetchingDropdownValue(objectType, false, rowId));
  }
}
const listTypeNotIncludeFilterAll = [
  OverviewTypes.Account,
  OverviewTypes.Contact,
  OverviewTypes.CallList.Contact,
  OverviewTypes.CallList.Account,
  OverviewTypes.RecruitmentClosed,
  OverviewTypes.Resource
];
function* sendEmailInBatch({ data }) {
  const _state = yield select();

  try {
    let _url;
    const { searchFieldDTOList } = getSearchForSave(_state, _state.common.currentObjectType);
    const _period = getPeriod(_state, _state.common.currentObjectType);
    const isFilterAll = _period.period === 'all';
    let filter = {
      isSelectedAll: _state.overview[_state.common.currentOverviewType].selectAll,
      filterDTO: {
        roleFilterType: _state.ui.app.roleType,
        roleFilterValue: _state.ui.app.activeRole ? _state.ui.app.activeRole : _state.auth.userId,
        customFilter:
          _state.common.currentObjectType && _state.search[_state.common.currentObjectType].filter
            ? _state.search[_state.common.currentObjectType].filter
            : 'active',
        orderBy: _state.common.currentObjectType ? _state.search[_state.common.currentObjectType].orderBy : null,
        searchFieldDTOList: _state.search[_state.common.currentObjectType].shown ? searchFieldDTOList : [],
        ftsTerms: _state.common.currentObjectType ? _state.search[_state.common.currentObjectType].term.trim() : null,
      },
    };

    if (listTypeNotIncludeFilterAll.indexOf(_state.common.currentOverviewType) === -1) {
      filter.filterDTO.isFilterAll = isFilterAll;
      filter.filterDTO.startDate = isFilterAll ? null : new Date(_period.startDate).getTime();
      filter.filterDTO.endDate = isFilterAll ? null : new Date(_period.endDate).getTime();
    }
    if (_state.common.currentOverviewType) {
      let _selected = _state.overview[_state.common.currentOverviewType].selected;
      let _result = [];
      if (_selected) {
        Object.keys(_selected).map((key) => {
          if (key && _selected[key]) _result.push(key);
        });
      }

      switch (_state.common.currentOverviewType) {
        case OverviewTypes.Activity.Task:
        case OverviewTypes.Delegation.Task:
          _url = `task-${ver}/sendMailInBatch`;
          if (!filter.isSelectedAll) {
            filter['taskIds'] = _result;
          }
          filter.filterDTO['isRequiredOwner'] = true;
          filter.filterDTO['isDelegateTask'] =
            _state.common.currentOverviewType === OverviewTypes.Delegation.Task ? true : false;
          break;
        case OverviewTypes.Pipeline.Lead:
        case OverviewTypes.Pipeline.Lead_Note:
        case OverviewTypes.Delegation.Lead:
          _url = `lead-${ver}/sendMailInBatch`;
          filter['leadIds'] = _result;
          break;
        case OverviewTypes.Pipeline.Qualified:
        case OverviewTypes.Pipeline.Order:
          _url = `prospect-${ver}/sendMailInBatch`;
          filter['prospectIds'] = _result;
          filter.filterDTO.customFilter =
            _state.common.currentObjectType && _state.search[_state.common.currentObjectType].filter
              ? _state.search[_state.common.currentObjectType].filter
              : 'active';
          filter['isProspectActive'] = filter.filterDTO.customFilter !== 'history';
          break;
        case OverviewTypes.Account:
          _url = `organisation-${ver}/sendMailInBatch`;
          filter['organisationIds'] = _result;
          break;
        case OverviewTypes.Contact:
          _url = `contact-${ver}/sendMailInBatch`;
          filter['contactIds'] = _result;
          filter.filterDTO['searchText'] = filter.filterDTO.ftsTerms;
          delete filter.filterDTO.ftsTerms;
          break;
        case OverviewTypes.Activity.Appointment:
          _url = `appointment-${ver}/sendMailInBatch`;
          filter['appointmentIds'] = _result;
          filter.filterDTO['isShowHistory'] =
            _state.common.currentObjectType && _state.search[_state.common.currentObjectType].filter == 'listView'
              ? false
              : true;
          filter.filterDTO['searchText'] = filter.filterDTO.ftsTerms;
          delete filter.filterDTO.ftsTerms;
          break;
        case OverviewTypes.CallList.Account:
          _url = `call-lists-${ver}/sendMailInBatch`;
          filter['callListIds'] = _result;
          filter['callListType'] = CALL_LIST_TYPE.ACCOUNT;
          filter.filterDTO['searchText'] = filter.filterDTO.ftsTerms;
          delete filter.filterDTO.ftsTerms;
          break;
        case OverviewTypes.CallList.Contact:
          _url = `call-lists-${ver}/sendMailInBatch`;
          filter['callListIds'] = _result;
          filter['callListType'] = CALL_LIST_TYPE.CONTACT;
          filter.filterDTO['searchText'] = filter.filterDTO.ftsTerms;
          delete filter.filterDTO.ftsTerms;
          break;
        case OverviewTypes.RecruitmentClosed:
          _url = `contact-${ver}/sendMailInBatch`;
          let a = _state.overview?.[OverviewTypes.RecruitmentClosed]?.selected;
          let b = _state.overview?.[OverviewTypes.RecruitmentClosed]?.items;
          let c = b.filter((e) => e.uuid && a[e.uuid]).map((e) => e.contactId);
          filter['contactIds'] = c;
          delete filter.filterDTO.ftsTerms;
          break;
        case OverviewTypes.Resource:
          _url = `consultant-${ver}/sendMailInBatch`;
          filter['resourceIds'] = _result;
          filter.filterDTO['searchFieldList'] = filter.filterDTO.searchFieldDTOList;
          filter['emailAddList'] = [];
          delete filter.filterDTO.ftsTerms;
          delete filter.filterDTO.customFilter;
          delete filter.filterDTO.searchFieldDTOList;
          break;
      }
    }
    data['filterDTO'] = JSON.stringify(filter);
    let fd = new FormData();
    for (let key in data) {
      if (key === 'attachments' && data['attachments'].length > 0) {
        for (let i = 0; i < data['attachments'].length; i++) {
          fd.append('attachments', data['attachments'][i]);
        }
      } else {
        fd.append(key, data[key]);
      }
    }
    yield call(api.post, {
      query: {
        timeZone: getCurrentTimeZone(),
      },
      resource: _url,
      data: fd,
    });
    yield put(showHideMassPersonalMail(false));
    yield put(NotificationActions.success(_l`Updated`, '', 2000));
  } catch (e) {
    switch (e.message) {
      case 'UNSPECIFIED_ERROR':
        yield put(NotificationActions.error(_l`Oh, something went wrong`));
        break;
      case 'OVER_MAXIMUM_PER_24HOURS':
        yield put(
          NotificationActions.error(
            _l`According to ${_state.common.mailServices} you can only send 1500 emails per day`
          )
        );
        break;
      case 'OVER_MAXIMUM_PER_BATCH':
        if(_state.common.mailServices === 'Microsoft')
        yield put(
          NotificationActions.error(`Microsoft only allow to send to 300 receivers in one batch.`)
        );
        else {
          yield put(
            NotificationActions.error(`Google only allow to send to 300 receivers in one batch.`)
          );
        }
        break;
      default:
        yield put(NotificationActions.error(e.message));
        break;
    }
    yield put(showHideMassPersonalMail(false));
  }
}

export default function* saga(): Generator<*, *, *> {
  yield takeLatest(AdvancedSearchActionTypes.SHOW, getSearchInfo);
  yield takeLatest(AdvancedSearchActionTypes.SAVE_REQUEST, save);
  yield takeLatest(AdvancedSearchActionTypes.COPY_REQUEST, copy);
  yield takeLatest(AdvancedSearchActionTypes.SHARE_REQUEST, share);
  yield takeLatest(AdvancedSearchActionTypes.REMOVE_REQUEST, remove);
  yield takeLatest(AdvancedSearchActionTypes.FETCH_FIELD_VALUE_DROPDOWN, fetchFieldValueDropdown),
    yield takeLatest(AdvancedSearchActionTypes.SEND_EMAIL_IN_BATCH, sendEmailInBatch);
}

//@flow
import { call, put, select, takeLatest } from 'redux-saga/effects';
import api from 'lib/apiClient';
import { customFieldList } from './custom-field.schema';
import CustomFieldActionTypes, * as CustomFieldActions from './custom-field.actions';
import * as NotificationActions from 'components/Notification/notification.actions';
import { getLastFetch, makeGetCustomField, makeGetCustomFieldForUpdate } from './custom-field.selectors';
const enterpriseEndpoints = 'enterprise-v3.0';
import _l from 'lib/i18n';
import { Endpoints } from '../../Constants';

//https://production-qa.salesbox.com/enterprise-v3.0/customFieldValue/listByObject?token=01a90e0a-249b-4d8f-8e19-840908a4182d&objectId=e878b3cb-b33e-425f-b152-627b16df696a&objectType=CONTACT&enterpriseID=ed00b3e4-ecbe-4f01-9585-3ccc2dc693b7

function* fetch({ objectType, objectId }): Generator<*, *, *> {
  const state = yield select();
  try {
    const lastFetch = getLastFetch(state, objectType, objectId);
    // yield put({ type: CustomFieldActionTypes.RESET_CUSTOM_FIELDS})
    yield put(CustomFieldActions.startFetch(objectType, objectId));
    const data = yield call(api.get, {
      resource: `${enterpriseEndpoints}/customFieldValue/listByObject`,
      schema: customFieldList,
      query: { objectType, objectId },
    });
    yield put(CustomFieldActions.succeedFetch(objectType, objectId, data));
    // yield put(CustomFieldActions.feedEntities(objectType, objectId, data));
  } catch (e) {
    //yield put(CustomFieldActions.failFetch(objectType, objectId, e.message));
  }
}

function* fetchDataDropdownAs({ customFieldId }) {
  yield put(CustomFieldActions.updateStatusLoadingByCFId(customFieldId, true));
  const data = yield call(api.get, {
    resource: `${enterpriseEndpoints}/customField/${customFieldId}`,
  });
  if (data) {
    yield put(CustomFieldActions.setCustomFieldOption(data));
  }
  yield put(CustomFieldActions.updateStatusLoadingByCFId(customFieldId, false));
}

function* fetchTagCustomField({ customFieldId, searchText }) {
  const state = yield select();
  yield put(CustomFieldActions.updateFetchingDropdownStatusAs(true));
  if (customFieldId?.toLowerCase() === 'competence') {
    const data = yield call(api.get, {
      resource: `${Endpoints.Resource}/competence/listAll`,
      query: {
        languageVersion: state?.ui?.app?.locale || 'en'
      }
      // query: { searchText, customFieldId },
    });
    if (data) {
      const options = data
        ? data.data
            .filter((e) => e?.name?.toLowerCase().includes(searchText.toLowerCase()))
            .map((option) => ({
              key: option.uuid,
              value: option.uuid,
              title: option.name,
              productId: option.uuid,
            }))
        : [];
      yield put(CustomFieldActions.setListProductTag(options));
    } else {
      yield put(CustomFieldActions.setListProductTag([]));
    }
    yield put(CustomFieldActions.updateFetchingDropdownStatusAs(false));
  } else if (customFieldId?.toLowerCase() === 'language') {
    const data = yield call(api.get, {
      resource: `${Endpoints.Resource}/language/listAll`,
      query: {
        languageVersion: state?.ui?.app?.locale || 'en'
      }
      // query: { searchText, customFieldId },
    });
    if (data) {
      const options = data
        ? data.data
            .filter((e) => e?.name?.toLowerCase().includes(searchText.toLowerCase()))
            .map((option) => ({
              key: option.uuid,
              value: option.uuid,
              title: option.name,
              productId: option.uuid,
            }))
        : [];
      yield put(CustomFieldActions.setListProductTag(options));
    } else {
      yield put(CustomFieldActions.setListProductTag([]));
    }
    yield put(CustomFieldActions.updateFetchingDropdownStatusAs(false));
  } else if (customFieldId?.toLowerCase() === 'certificate') {
    const data = yield call(api.get, {
      resource: `${Endpoints.Resource}/certificate/listAll`,
      query: {
        languageVersion: state?.ui?.app?.locale || 'en'
      }
      // query: { searchText, customFieldId },
    });
    if (data) {
      const options = data
        ? data.data
            .filter((e) => e?.name?.toLowerCase().includes(searchText.toLowerCase()))
            .map((option) => ({
              key: option.uuid,
              value: option.uuid,
              title: option.name,
              productId: option.uuid,
            }))
        : [];
      yield put(CustomFieldActions.setListProductTag(options));
    } else {
      yield put(CustomFieldActions.setListProductTag([]));
    }
    yield put(CustomFieldActions.updateFetchingDropdownStatusAs(false));
  } else if (customFieldId?.toLowerCase() === 'employer') {
    const data = yield call(api.get, {
      resource: `${Endpoints.Resource}/employer/listAll`,
      query: {
        languageVersion: state?.ui?.app?.locale || 'en'
      }
      // query: { searchText, customFieldId },
    });
    if (data) {
      const options = data
        ? data.data
            .filter((e) => e?.name?.toLowerCase().includes(searchText.toLowerCase()))
            .map((option) => ({
              key: option.uuid,
              value: option.uuid,
              title: option.name,
              productId: option.uuid,
            }))
        : [];
      yield put(CustomFieldActions.setListProductTag(options));
    } else {
      yield put(CustomFieldActions.setListProductTag([]));
    }
    yield put(CustomFieldActions.updateFetchingDropdownStatusAs(false));
  } else if (customFieldId?.toLowerCase() === 'education') {
    const data = yield call(api.get, {
      resource: `${Endpoints.Resource}/education/listAll`,
      query: {
        languageVersion: state?.ui?.app?.locale || 'en'
      }
      // query: { searchText, customFieldId },
    });
    if (data) {
      const options = data
        ? data.data
            .filter((e) => e?.name?.toLowerCase().includes(searchText.toLowerCase()))
            .map((option) => ({
              key: option.uuid,
              value: option.uuid,
              title: option.name,
              productId: option.uuid,
            }))
        : [];
      yield put(CustomFieldActions.setListProductTag(options));
    } else {
      yield put(CustomFieldActions.setListProductTag([]));
    }
    yield put(CustomFieldActions.updateFetchingDropdownStatusAs(false));
  } else if (customFieldId?.toLowerCase() === 'industry') {
    const data = yield call(api.get, {
      resource: `${Endpoints.Resource}/industry/listAll`,
      query: {
        languageVersion: state?.ui?.app?.locale || 'en'
      }
      // query: { searchText, customFieldId },
    });
    if (data) {
      const options = data
        ? data.data
            .filter((e) => e?.name?.toLowerCase().includes(searchText.toLowerCase()))
            .map((option) => ({
              key: option.uuid,
              value: option.uuid,
              title: option.name,
              productId: option.uuid,
            }))
        : [];
      yield put(CustomFieldActions.setListProductTag(options));
    } else {
      yield put(CustomFieldActions.setListProductTag([]));
    }
    yield put(CustomFieldActions.updateFetchingDropdownStatusAs(false));
  } else {
    const data = yield call(api.get, {
      resource: `administration-v3.0/product/productTagOptions`,
      query: { searchText, customFieldId },
    });
    if (data) {
      const options = data
        ? data.map((option) => ({
            key: option.uuid,
            value: option.uuid,
            title: option.name,
            productId: option.uuid,
          }))
        : [];
      yield put(CustomFieldActions.setListProductTag(options));
    } else {
      yield put(CustomFieldActions.setListProductTag([]));
    }
    yield put(CustomFieldActions.updateFetchingDropdownStatusAs(false));
  }
}

function* updateCustomFieldObject({ customFieldId, objectId, isUpdateAll, disableToast }) {
  if (isUpdateAll) {
    return;
  }
  try {
    const state = yield select();
    const customFieldSelected = makeGetCustomFieldForUpdate()(state, customFieldId, objectId);

    const data = yield call(api.post, {
      resource: `${enterpriseEndpoints}/customFieldValue/addOrEdit`,
      query: {
        objectId,
      },
      data: {
        ...customFieldSelected,
      },
    });
    if (data && !disableToast) {
      yield put(NotificationActions.success(_l`Updated`, '', 2000));
    }
  } catch (error) {
    yield put(NotificationActions.error(error.message));
  }
}

function* fetchCustomFieldsObject({ objectType }): Generator<*, *, *> {
  try {
    const data = yield call(api.get, {
      resource: `${enterpriseEndpoints}/customField/listByObject`,
      schema: customFieldList,
      query: { objectType },
    });

    const { entities } = data;

    const { customField } = entities;
    if (!customField) {
      return yield put(CustomFieldActions.feedUICustomFieldsObject({}));
    }
    let valueSaved = customField
      ? {
          ...customField,
        }
      : {};
    if (customField) {
      const keys = Object.keys(customField);
      keys.forEach((key) => {
        if (customField[key].fieldType === 'DROPDOWN') {
          valueSaved[key].customFieldValueDTOList = customField[
            key
          ].customFieldOptionDTO.customFieldOptionValueDTOList.map((val) => {
            return {
              value: val.value,
              customFieldOptionValueUuid: val.uuid,
            };
          });
        }
      });

      yield put(CustomFieldActions.feedUICustomFieldsObject(customField ? customField : {}));
    }
    // yield put(CustomFieldActions.feedEntities(objectType, data));
  } catch (e) {
    yield put(CustomFieldActions.failFetch(objectType, e.message));
  }
}

export default function* saga(): Generator<*, *, *> {
  yield takeLatest(CustomFieldActionTypes.FETCH_REQUEST, fetch);
  yield takeLatest(CustomFieldActionTypes.FETCH_DATA_DROPDOWN_AS, fetchDataDropdownAs);
  yield takeLatest(CustomFieldActionTypes.FETCH_TAG_CUSTOM_FIELD, fetchTagCustomField);

  //Update oject value custom field
  yield takeLatest(CustomFieldActionTypes.UPDATE_CHECKBOX, updateCustomFieldObject);
  yield takeLatest(CustomFieldActionTypes.CONNECT_SAGA_UPDATE, updateCustomFieldObject);

  yield takeLatest(CustomFieldActionTypes.UPDATE_PRODUCT_TAG, updateCustomFieldObject);

  yield takeLatest(CustomFieldActionTypes.FETCH_REQUEST_CUSTOM_FIELDS_OBJECT, fetchCustomFieldsObject);
}

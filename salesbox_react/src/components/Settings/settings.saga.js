//@flow
import { call, put, takeLatest, select, takeEvery, all } from 'redux-saga/effects';
import api from 'lib/apiClient';
import SettingsActions from './settings.actions';
import * as NotificationActions from '../Notification/notification.actions';
import { updateFromSetting } from '../PeriodSelector/period-selector.actions';
import { select as selectOverviewType, updateColumnOrderRowFromSetting } from '../Overview/overview.actions';
import { fromPairs } from 'lodash';
import { OverviewTypes } from '../../Constants';
import md5 from 'browser-md5';
import { fetchCompanyInfoSuccess, updateCompanyInfo } from './settings.actions';
import _l from 'lib/i18n';

const enterpriseEndpoints = 'enterprise-v3.0';

const mapKeys = {
  product: 'product',
  productGroup: 'productGroup',
  productType: 'productType',
  startDate: 'deliveryStartDate',
  endDate: 'deliveryEndDate',
  unitAmount: 'unitAmount',
  unitCost: 'costUnit',
  unitPrice: 'unitPrice',
  discountAmount: 'discountAmount',
  discountPercent: 'discountPercent',
  discountedPrice: 'discountedPrice',
  cost: 'cost',
  value: 'value',
  currency: 'currency',
  margin: 'margin',
  profit: 'profit',
  description: 'description',
  occupied: 'occupied'
};
function* fetchDisplaySettings(): Generator<*, *, *> {
  try {
    const state = yield select();
    // if (!state.settings.display || !state.settings.display.mySettings) {
    let data = yield call(api.get, {
      resource: `${enterpriseEndpoints}/user/getDisplayOptions`,
    });
    let arrayFiltered = null;
    if (data && data.orderRows && data.orderRows.viewList) {
      let tempData = data.orderRows.viewList;
      arrayFiltered = data.orderRows.viewList.find((e) => e.name === 'product');
      if (arrayFiltered === undefined) {
        tempData.push({ name: 'product', selected: true });
      }
      arrayFiltered = data.orderRows.viewList.find((e) => e.name === 'productGroup');
      if (arrayFiltered === undefined) {
        tempData.push({ name: 'productGroup', selected: true });
      }
      arrayFiltered = data.orderRows.viewList.find((e) => e.name === 'productType');
      if (arrayFiltered === undefined) {
        tempData.push({ name: 'productType', selected: true });
      }
      arrayFiltered = data.orderRows.viewList.find((e) => e.name === 'currency');
      if (arrayFiltered === undefined) {
        tempData.push({ name: 'currency', selected: true });
      }
      arrayFiltered = data.orderRows.viewList.find((e) => e.name === 'occupied');
      if (arrayFiltered === undefined) {
        tempData.push({ name: 'occupied', selected: true });
      }
      data.orderRows.viewList = tempData;
    }
    yield put({ type: SettingsActions.FETCH_DISPLAY_SETTINGS, data });
    yield put(updateFromSetting(data));
    // yield put(selectOverviewType(OverviewTypes.CommonOrderRow, null));
    yield put(updateColumnOrderRowFromSetting(data));
    // ?    }
  } catch (e) {
    yield put({ type: SettingsActions.FETCH_DISPLAY_SETTINGS_FAIL, message: e.message });
  }
}

function* updateDisplaySetting(): Generator<*, *, *> {
  try {
    const state = yield select();
    const __SETTING = state.settings.display;
    const res = yield call(api.post, {
      resource: `${enterpriseEndpoints}/user/updateDisplayOptions`,
      data: __SETTING,
    });
    // TODO: Add action after update display setting here!
  } catch (e) {
    yield put(NotificationActions.error(e));
  }
}

function* updateDisplayColumnOrderRow({ name, value }): Generator<*, *, *> {
  try {
    const state = yield select();
    let __SETTING = state.settings.display;
    let arrayColumns = __SETTING.orderRows.viewList;
    for (let i = 0; i < arrayColumns.length; i++) {
      if (arrayColumns[i].name === mapKeys[name]) {
        arrayColumns[i].selected = value;
        break;
      }
    }
    // if (name === 'product' || name === 'productGroup' || name === 'productType' || name === 'currency') {
    //   arrayColumns.push({ name, selected: value });
    // }
    __SETTING.orderRows.viewList = arrayColumns;
    const res = yield call(api.post, {
      resource: `${enterpriseEndpoints}/user/updateDisplayOptions`,
      data: __SETTING,
    });
    if (res) {
      yield put({ type: SettingsActions.FETCH_DISPLAY_SETTINGS, data: res });
    }
  } catch (error) {
    // yield put(NotificationActions.error(error.message, '', 2000));
    console.log(error);
  }
}

function* changePassword({ oldPass, newPass }): Generator<*, *, *> {
  try {
    const state = yield select();

    yield console.log('----------------', oldPass, newPass);
    const res = yield call(api.post, {
      resource: `${enterpriseEndpoints}/user/changePassword`,
      query: {
        uuid: state.auth.userId,
        oldPassword: md5(oldPass),
        newPassword: md5(newPass),
      },
    });
    if (res) {
      yield put(NotificationActions.success('Updated', '', 2000));
    }
  } catch (error) {
    yield put(NotificationActions.error(error.message));
  }
}

function* updateRememberLanguage(value): Generator<*, *, *> {
  yield put({ type: 'REMEMBER_UPDATE_DATA', action: { languageCode: value } });
}

function* fetchTargetsSettings({ year }) {
  try {
    const [listByYear, listTargetByYear, activity] = yield all([
      call(api.get, {
        resource: `${enterpriseEndpoints}/budget/listByYear`,
        query: { year },
      }),
      call(api.get, {
        resource: `${enterpriseEndpoints}/revenue/listTargetByYear`,
        query: { year },
      }),
      call(api.get, {
        resource: `${enterpriseEndpoints}/budget/activity/get`,
      }),
    ]);

    yield put({ type: SettingsActions.FETCH_TARGETS_SETTINGS, data: { listByYear, activity, listTargetByYear } });
  } catch (error) {
    yield put(NotificationActions.error(error.message, '', 2000));
  }
}

function* updateSettingsTargetsListByYear() {
  const state = yield select();
  const budgetDTOList = state.settings.targets.listByYear.budgetDTOList;

  try {
    yield call(api.post, {
      resource: `${enterpriseEndpoints}/budget/updateList`,
      data: { budgetDTOList },
    });

    yield put(NotificationActions.success('Updated', '', 2000));
  } catch (error) {
    yield put(NotificationActions.error(error.message, '', 2000));
  }
}

function* fetchSettingsRight() {
  try {
    const data = yield call(api.get, {
      resource: `${enterpriseEndpoints}/right/web/list`,
    });

    yield put({ type: SettingsActions.FETCH_SETTINGS_RIGHTS, data });
  } catch (error) {
    yield put(NotificationActions.error(error.message, '', 2000));
  }
}

function* updateSettingsRights() {
  const state = yield select();
  const rightDTOList = state.settings.rights.rightDTOList;

  try {
    yield call(api.post, {
      resource: `${enterpriseEndpoints}/right/web/update`,
      data: { rightDTOList },
    });

    yield put(NotificationActions.success('Updated', '', 2000));
  } catch (error) {
    yield put(NotificationActions.error(error.message, '', 2000));
  }
}

function* fetchSettingsProducts() {
  try {
    const { productGroups, productTypes, products } = yield all({
      productGroups: call(api.get, {
        resource: 'administration-v3.0/lineOfBusiness/list',
      }),
      productTypes: call(api.get, {
        resource: 'administration-v3.0/measurement/list',
      }),
      products: call(api.get, {
        resource: 'administration-v3.0/product/listByCompany',
      }),
    });
    yield put({ type: SettingsActions.FETCH_SETTINGS_PRODUCTS, data: { productGroups, productTypes, products } });
  } catch (error) {
    yield put(NotificationActions.error(error.message, '', 2000));
  }
}

function* deleteProductGroup({ data }) {
  try {
    yield call(api.get, {
      resource: `administration-v3.0/lineOfBusiness/delete/${data.uuid}`,
    });
    yield put({
      type: SettingsActions.FETCH_SETTINGS_PRODUCTS_REQUEST,
    });
    yield put(NotificationActions.success(`Deleted`, '', 2000));
  } catch (error) {
    yield put(NotificationActions.error(error.message, '', 2000));
  }
}

function* deleteProductType({ data }) {
  try {
    yield call(api.get, {
      resource: `administration-v3.0/measurement/delete/${data.uuid}`,
    });
    yield put({
      type: SettingsActions.FETCH_SETTINGS_PRODUCTS_REQUEST,
    });
    yield put(NotificationActions.success(`Deleted`, '', 2000));
  } catch (error) {
    yield put(NotificationActions.error(error.message, '', 2000));
  }
}

function* deleteProductItem({ data }) {
  try {
    yield call(api.get, {
      resource: `administration-v3.0/product/delete/${data.uuid}`,
    });
    yield put({
      type: SettingsActions.FETCH_SETTINGS_PRODUCTS_REQUEST,
    });
    yield put(NotificationActions.success(`Deleted`, '', 2000));
  } catch (error) {
    yield put(NotificationActions.error(error.message, '', 2000));
  }
}

function* updateSettingsTargetsActivity() {
  const state = yield select();
  const budgetActivityDTOList = state.settings.targets.activity.budgetActivityDTOList;

  try {
    yield call(api.post, {
      resource: `${enterpriseEndpoints}/budget/activity/update`,
      data: { budgetActivityDTOList },
    });

    yield put(NotificationActions.success('Updated', '', 2000));
  } catch (error) {
    yield put(NotificationActions.error(error.message, '', 2000));
  }
}

function* fetchCustomFieldsSettings({ objectType }) {
  try {
    const [customField, dateTimeFormat] = yield all([
      call(api.get, {
        resource: `${enterpriseEndpoints}/customField/listByObject`,
        query: { objectType },
      }),
      call(api.get, {
        resource: `${enterpriseEndpoints}/dateTimeFormat/list`,
      }),
    ]);

    yield put({ type: SettingsActions.FETCH_CUSTOM_FIELDS_SETTINGS, data: { ...customField, ...dateTimeFormat } });
  } catch (error) {
    yield put(NotificationActions.error(error.message, '', 2000));
  }
}

function* deleteItemCustomFieldsSettings({ customFieldId }) {
  const state = yield select();
  const objectType = state.settings.customField.objectType;

  try {
    yield call(api.get, {
      resource: `${enterpriseEndpoints}/customField/delete`,
      query: { customFieldId },
    });
    yield put({
      type: SettingsActions.FETCH_CUSTOM_FIELDS_SETTINGS_REQUEST,
      objectType,
    });
    yield put(NotificationActions.success(`Deleted`, '', 2000));
  } catch (error) {
    yield put(NotificationActions.error(error.message, '', 2000));
  }
}

function* updatePositionCustomFieldsSettings() {
  const state = yield select();
  const { customFieldDTOList, objectType } = state.settings.customField;

  try {
    yield call(api.post, {
      resource: `${enterpriseEndpoints}/customField/reorder`,
      data: { customFieldDTOList },
    });
    yield put({
      type: SettingsActions.FETCH_CUSTOM_FIELDS_SETTINGS_REQUEST,
      objectType,
    });
    yield put(NotificationActions.success(`Updated`, '', 2000));
  } catch (error) {
    yield put(NotificationActions.error(error.message, '', 2000));
  }
}

function* addCustomFieldsSettings({ fieldType, title }) {
  const state = yield select();
  const { customFieldDTOList, objectType } = state.settings.customField;

  try {
    const res = yield call(api.post, {
      resource: `${enterpriseEndpoints}/customField/add`,
      data: { fieldType, title, objectType, active: true, required: false, position: customFieldDTOList.length },
    });
    // yield put({
    //   type: SettingsActions.FETCH_CUSTOM_FIELDS_SETTINGS_REQUEST,
    //   objectType,
    // });
    if(res) {
      yield put({
        type: SettingsActions.ADD_CF_SETTING_LOCAL,
        res

      })
    }
    yield put(NotificationActions.success(`Added`, '', 2000));
  } catch (error) {
    yield put(NotificationActions.error(error.message, '', 2000));
  }
}

function* copyItemCustomFieldsSettings({ itemCustomField, objectTypes }) {
  const state = yield select();
  const { objectType } = state.settings.customField;

  try {
    yield all(
      objectTypes.map((item) =>
        call(api.post, {
          resource: `${enterpriseEndpoints}/customField/add`,
          data: { ...itemCustomField, uuid: null, objectType: item },
        })
      )
    );

    yield put({
      type: SettingsActions.FETCH_CUSTOM_FIELDS_SETTINGS_REQUEST,
      objectType,
    });
    yield put(NotificationActions.success(`Updated`, '', 2000));
  } catch (error) {
    yield put(NotificationActions.error(error.message, '', 2000));
  }
}

function* editRequiedCustomField({ customFieldId, required }) {
  const state = yield select();
  const { objectType } = state.settings.customField;

  try {
    yield call(api.post, {
      resource: `${enterpriseEndpoints}/customField/editRequired`,
      query: { customFieldId, required },
    });

    yield put({
      type: SettingsActions.FETCH_CUSTOM_FIELDS_SETTINGS_REQUEST,
      objectType,
    });
    yield put(NotificationActions.success(`Updated`, '', 2000));
  } catch (error) {
    yield put(NotificationActions.error(error.message, '', 2000));
  }
}

function* editActiveCustomField({ customFieldId, active }) {
  const state = yield select();
  const { objectType } = state.settings.customField;

  try {
    yield call(api.post, {
      resource: `${enterpriseEndpoints}/customField/editActive`,
      query: { customFieldId, active },
    });

    yield put({
      type: SettingsActions.FETCH_CUSTOM_FIELDS_SETTINGS_REQUEST,
      objectType,
    });
    yield put(NotificationActions.success(`Updated`, '', 2000));
  } catch (error) {
    yield put(NotificationActions.error(error.message, '', 2000));
  }
}

function* editMultiChooseCustomField({ customFieldId, multiChoice }) {
  const state = yield select();
  const { objectType } = state.settings.customField;

  try {
    yield call(api.post, {
      resource: `${enterpriseEndpoints}/customField/editMultiChoice`,
      query: { customFieldId, multiChoice: multiChoice },
    });

    yield put({
      type: SettingsActions.FETCH_CUSTOM_FIELDS_SETTINGS_REQUEST,
      objectType,
    });
    yield put(NotificationActions.success(`Updated`, '', 2000));
  } catch (error) {
    yield put(NotificationActions.error(error.message, '', 2000));
  }
}
function* updateItemCustomField({ itemCustomField }) {
  const state = yield select();
  const { objectType } = state.settings.customField;

  try {
    yield call(api.post, {
      resource: `${enterpriseEndpoints}/customField/edit`,
      data: itemCustomField,
    });

    yield put({
      type: SettingsActions.FETCH_CUSTOM_FIELDS_SETTINGS_REQUEST,
      objectType,
    });
    yield put(NotificationActions.success(`Updated`, '', 2000));
  } catch (error) {
    yield put(NotificationActions.error(error.message, '', 2000));
  }
}

function* updateListOrganisationSettings() {
  try {
    const { unitDTOList } = yield call(api.get, {
      resource: `${enterpriseEndpoints}/unit/listAll`,
    });

    yield put({
      type: SettingsActions.UPDATE_LIST_ORGANISATION_SETTINGS,
      value: unitDTOList,
    });
  } catch (error) {
    yield put(NotificationActions.error(error.message, '', 2000));
  }
}

function* fetchOrganisationSettings() {
  try {
    const [company, listAll] = yield all([
      call(api.get, {
        resource: `${enterpriseEndpoints}/company/get`,
      }),
      call(api.get, {
        resource: `${enterpriseEndpoints}/unit/listAll`,
      }),
    ]);

    yield put({
      type: SettingsActions.FETCH_ORGANISATION_SETTINGS,
      value: { company, ...listAll },
    });
  } catch (error) {
    yield put(NotificationActions.error(error.message, '', 2000));
  }
}

function* updateItemUnitOrganisationSettings({ itemUnit }) {
  try {
    yield call(api.post, {
      resource: `${enterpriseEndpoints}/unit/update`,
      data: itemUnit,
    });

    yield put({
      type: SettingsActions.UPDATE_LIST_ORGANISATION_SETTINGS_REQUEST,
    });

    yield put(NotificationActions.success(`Updated`, '', 2000));
  } catch (error) {
    yield put(NotificationActions.error(error.message, '', 2000));
  }
}

function* deleteItemUnitOrganisationSettings({ unitId }) {
  try {
    yield call(api.get, {
      resource: `${enterpriseEndpoints}/unit/delete/${unitId}`,
    });

    yield put({
      type: SettingsActions.UPDATE_LIST_ORGANISATION_SETTINGS_REQUEST,
    });

    yield put(NotificationActions.success(`Deleted`, '', 2000));
  } catch (error) {
    yield put(NotificationActions.error(error.message, '', 2000));
  }
}

function* addNewUnitOranisationSettings({ description, name }) {
  try {
    yield call(api.post, {
      resource: `${enterpriseEndpoints}/unit/add`,
      data: { description, name },
    });

    yield put({
      type: SettingsActions.UPDATE_LIST_ORGANISATION_SETTINGS_REQUEST,
    });

    yield put(NotificationActions.success(`Added`, '', 2000));
  } catch (error) {
    yield put(NotificationActions.error(error.message, '', 2000));
  }
}

function* updateStatusUserOrganisationSettings({ uuid, active }) {
  try {
    yield call(api.post, {
      resource: `${enterpriseEndpoints}/user/updateActiveStatus`,
      query: { uuid, active },
    });

    yield put({
      type: SettingsActions.UPDATE_LIST_ORGANISATION_SETTINGS_REQUEST,
    });

    yield put(NotificationActions.success(`Updated`, '', 2000));
  } catch (error) {
    yield put(NotificationActions.error(error.message, ''));
  }
}

function* addUserOrganisationSettings({ data }) {
  try {
    yield call(api.post, {
      resource: `${enterpriseEndpoints}/user/requestAddUser`,
      data,
    });

    yield put({
      type: SettingsActions.UPDATE_LIST_ORGANISATION_SETTINGS_REQUEST,
    });

    yield put(NotificationActions.success(`Added`, '', 2000));
  } catch (error) {
    yield put(NotificationActions.error(error.message));
  }
}

function* deleteUserPendingOranisationSettings({ pendingId }) {
  try {
    yield call(api.get, {
      resource: `${enterpriseEndpoints}/user/deletePending/${pendingId}`,
    });

    yield put({
      type: SettingsActions.UPDATE_LIST_ORGANISATION_SETTINGS_REQUEST,
    });

    yield put(NotificationActions.success(`Deleted`, '', 2000));
  } catch (error) {
    yield put(NotificationActions.error(error.message, '', 2000));
  }
}

function* updateUserOrganisationSettings({ data }) {
  try {
    yield call(api.post, {
      resource: `${enterpriseEndpoints}/user/update`,
      data,
    });

    yield put({
      type: SettingsActions.UPDATE_LIST_ORGANISATION_SETTINGS_REQUEST,
    });

    yield put(NotificationActions.success(`Updated`, '', 2000));
  } catch (error) {
    yield put(NotificationActions.error(error.message, '', 2000));
  }
}

function* updateAvatarOrganisationSettings({ uuid, avatar }) {
  const formData = new FormData();

  formData.append('uuid', uuid);
  formData.append('avatar', avatar);

  try {
    yield call(api.post, {
      resource: `${enterpriseEndpoints}/unit/updateAvatar`,
      data: formData,
      options: {
        headers: {
          'content-type': 'multipart/form-data',
        },
      },
    });

    yield put({
      type: SettingsActions.UPDATE_LIST_ORGANISATION_SETTINGS_REQUEST,
    });

    yield put(NotificationActions.success(`Updated`, '', 2000));
  } catch (error) {
    yield put(NotificationActions.error(error.message, '', 2000));
  }
}

function* updateUserAvatarOrganisationSettings({ uuid, avatar }) {
  const formData = new FormData();

  formData.append('uuid', uuid);
  formData.append('avatar', avatar);

  try {
    yield call(api.post, {
      resource: `${enterpriseEndpoints}/user/updateAvatar`,
      data: formData,
      options: {
        headers: {
          'content-type': 'multipart/form-data',
        },
      },
    });

    yield put({
      type: SettingsActions.UPDATE_LIST_ORGANISATION_SETTINGS_REQUEST,
    });

    yield put(NotificationActions.success(`Updated`, '', 2000));
  } catch (error) {
    yield put(NotificationActions.error(error.message, '', 2000));
  }
}

function* fetchCompanyInfoRequest() {
  try {
    const res = yield call(api.get, {
      resource: `${enterpriseEndpoints}/company/get`,
    });
    if (res) {
      yield put(fetchCompanyInfoSuccess(res));
    }
  } catch (error) {}
}

function* requestUpdateCompanyInfo() {
  try {
    const state = yield select();

    const body = state.settings.companyInfo;
    const res = yield call(api.post, {
      resource: `${enterpriseEndpoints}/company/update`,
      data: body,
    });
    if (res) {
      yield put(NotificationActions.success(`Updated`, '', 2000));
      yield put(fetchCompanyInfoSuccess(res));
    }
  } catch (error) {}
}

function* requestUpdateMainContact({ userId }) {
  try {
    const res = yield call(api.post, {
      resource: `${enterpriseEndpoints}/user/main/update/${userId}`,
    });
    if (res === 'SUCCESS') {
      yield put(updateCompanyInfo({ key: 'mainContactId', value: userId }));
      yield put(NotificationActions.success('Updated', '', 2000));
    }
  } catch (error) {
    yield put(NotificationActions.error('Oh, something went wrong'));
  }
}
export default function* saga(): Generator<*, *, *> {
  yield takeLatest(SettingsActions.FETCH_DISPLAY_SETTINGS_REQUEST, fetchDisplaySettings);
  yield takeLatest(SettingsActions.FETCH_TARGETS_SETTINGS_REQUEST, fetchTargetsSettings);
  yield takeLatest(SettingsActions.FETCH_CUSTOM_FIELDS_SETTINGS_REQUEST, fetchCustomFieldsSettings);
  yield takeLatest(SettingsActions.DELETE_ITEM_CUSTOM_FIELDS_SETTINGS_REQUEST, deleteItemCustomFieldsSettings);
  yield takeLatest(SettingsActions.UPDATE_POSITION_CUSTOM_FIELS_SETTING_REQUEST, updatePositionCustomFieldsSettings);
  yield takeLatest(SettingsActions.ADD_CUSTOM_FIELD_SETTING_REQUEST, addCustomFieldsSettings);
  yield takeLatest(SettingsActions.COPY_ITEM_CUSTOM_FIELDS_SETTINGS_REQUEST, copyItemCustomFieldsSettings);
  yield takeLatest(SettingsActions.EDIT_REQUIED_CUSTOM_FIELD_REQUEST, editRequiedCustomField);
  yield takeLatest(SettingsActions.EDIT_ACTIVE_CUSTOM_FIELD_REQUEST, editActiveCustomField);
  yield takeLatest(SettingsActions.EDIT_MULTI_CHOOSE_CUSTOM_FIELD_REQUEST, editMultiChooseCustomField);
  yield takeLatest(SettingsActions.UPDATE_ITEM_CUSTOM_FIELD_REQUEST, updateItemCustomField);
  yield takeLatest(SettingsActions.FETCH_ORGANISATION_SETTINGS_REQUEST, fetchOrganisationSettings);
  yield takeLatest(SettingsActions.UPDATE_LIST_ORGANISATION_SETTINGS_REQUEST, updateListOrganisationSettings);
  yield takeLatest(SettingsActions.UPDATE_ITEM_UNIT_ORGANISATION_SETTING_REQUEST, updateItemUnitOrganisationSettings);
  yield takeLatest(SettingsActions.DELETE_ITEM_UNIT_ORGANISATION_SETTING_REQUEST, deleteItemUnitOrganisationSettings);
  yield takeLatest(SettingsActions.ADD_NEW_UNIT_ORGANISATION_SETTINGS_REQUEST, addNewUnitOranisationSettings);
  yield takeLatest(
    SettingsActions.UPDATE_STATUS_USER_ORGANISATION_SETTINGS_REQUEST,
    updateStatusUserOrganisationSettings
  );
  yield takeLatest(SettingsActions.ADD_USER_ORGANISATION_SETTINGS_REQUEST, addUserOrganisationSettings);
  yield takeLatest(
    SettingsActions.DELETE_USER_PEDING_ORGANISATION_SETTINGS_REQUEST,
    deleteUserPendingOranisationSettings
  );
  yield takeLatest(SettingsActions.UPDATE_USER_ORGANISATION_SETTINGS_REQUEST, updateUserOrganisationSettings);
  yield takeLatest(SettingsActions.UPDATE_AVATAR_ORGANISATION_SETTINGS_REQUEST, updateAvatarOrganisationSettings);
  yield takeLatest(
    SettingsActions.UPDATE_USER_AVATAR_ORGANISATION_SETTINGS_REQUEST,
    updateUserAvatarOrganisationSettings
  );

  yield takeLatest(SettingsActions.UPDATE_SETTINGS_TARGETS_LISTBYYEAR_REQUEST, updateSettingsTargetsListByYear);
  yield takeLatest(SettingsActions.UPDATE_SETTINGS_TARGETS_ACTIVITY_REQUEST, updateSettingsTargetsActivity);
  yield takeLatest(SettingsActions.FETCH_SETTINGS_RIGHTS_REQUEST, fetchSettingsRight);
  yield takeLatest(SettingsActions.UPDATE_SETTINGS_RIGHTS_REQUEST, updateSettingsRights);
  yield takeLatest(SettingsActions.REQUEST_UPDATE_DISPLAY_SETTING, updateDisplaySetting);
  yield takeEvery(SettingsActions.UPDATE_DISPLAY_COLUMN_ORDER_ROW, updateDisplayColumnOrderRow);
  yield takeLatest(SettingsActions.UPDATE_REMEMBER_LANGUAGE, updateRememberLanguage);
  yield takeLatest(SettingsActions.CHANGE_PASSWORD, changePassword);
  yield takeLatest(SettingsActions.FETCH_COMPANY_INFO_REQUEST, fetchCompanyInfoRequest);
  yield takeLatest(SettingsActions.REQUEST_UPDATE_COMPANY_INFO, requestUpdateCompanyInfo);
  yield takeLatest(SettingsActions.REQUEST_UPDATE_MAIN_CONTACT, requestUpdateMainContact);
  yield takeLatest(SettingsActions.FETCH_SETTINGS_PRODUCTS_REQUEST, fetchSettingsProducts);
  yield takeLatest(SettingsActions.DELETE_SETTINGS_PRODUCT_GROUP, deleteProductGroup);
  yield takeLatest(SettingsActions.DELETE_SETTINGS_PRODUCT_TYPE, deleteProductType);
  yield takeLatest(SettingsActions.DELETE_SETTINGS_PRODUCT_ITEM, deleteProductItem);
}

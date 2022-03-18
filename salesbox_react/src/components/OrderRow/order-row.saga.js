//@flow
import { all, takeLatest, call, put, select, fork } from 'redux-saga/effects';
import { Endpoints, OverviewTypes } from 'Constants';
import _l from 'lib/i18n';
import * as NotificationActions from 'components/Notification/notification.actions';
import * as OverviewActions from 'components/Overview/overview.actions';
import api from 'lib/apiClient';
import ActionTypes, { editEntity, update, create, clear, remove } from './order-row.actions';
import { fetchQualifiedDetail } from '../PipeLineQualifiedDeals/qualifiedDeal.actions';
import { getSaleProcessActive } from '../PipeLineQualifiedDeals/qualifiedDeal.selector';
import {
  fetchProducts,
  refreshQualifiedDealView,
  fetchQualifiedDeal,
  fetListBySale,
} from '../PipeLineQualifiedDeals/qualifiedDeal.saga';
import {refreshOrganisation} from "../Organisation/organisation.actions";
import {refreshContact} from '../Contact/contact.actions';

addTranslations({
  'en-US': {
    Added: 'Added',
  },
});

function* listByProspect({ uuid }): Generator<*, *, *> {
  try {
    const data = yield call(api.get, {
      resource: `${Endpoints.Prospect}/orderRow/listByProspect/${uuid}`,
      query: {
        pageIndex: 0,
        pageSize: 1000,
      },
    });
    if (data) {
      const prospectId = uuid;
      yield put(editEntity(data.orderRowDTOList, prospectId));
    }
  } catch (error) {
    yield put(NotificationActions.error(error.message));
  }
}

function* fetchAddOrderRow({ data: obj, overviewType }): Generator<*, *, *> {
  const state = yield select();
  const highlighted = state.overview[overviewType].highlighted;
  const prospectId = Object.keys(highlighted).find((item) => {
    if (highlighted[item] === true) return item;
  });
  try {
    const {
      costUnit,
      deliveryEndDate,
      deliveryStartDate,
      description,
      discountPercent,
      discountedPrice,
      lineOfBusinessId,
      margin,
      measurementTypeId,
      price,
      productDTO,
      lineOfBusinessName,
      measurementTypeName,
      occupied,
      type,
      periodType,
      periodNumber
    } = obj;
    const orderRowDTO = {
      uuid: null,
      type:  type ? type : 'NORMAL',
      productList: null,
      periodType: periodType ? periodType: null,
      periodNumber: periodNumber ? periodNumber : 0,
      costUnit,
      deliveryEndDate,
      deliveryStartDate,
      description,
      discountPercent,
      discountedPrice,
      lineOfBusinessId,
      margin,
      measurementTypeId,
      price,
      productDTO,
      numberOfUnit: obj.quantity,
      lineOfBusinessName,
      measurementTypeName,
      prospectId,
      occupied
    };
    const data = yield call(api.post, {
      resource: `${Endpoints.Prospect}/orderRow/addOrderRowCustomField`,
      data: {
        listCustomFieldDTOs: [],
        orderRowDTO,
      },
    });
    if (data) {
      yield put(create());
      yield put(update(obj.id, data.orderRowDTO));
      if (overviewType == OverviewTypes.Account_Qualified) {
        yield put(refreshOrganisation('qualified'));
      } else if (overviewType == OverviewTypes.Account_Order) {
        yield put(refreshOrganisation('order'));
      }
    }
  } catch (error) {
    yield put(NotificationActions.error(error.message));
  }
}

function* updateListOrder({ data: obj, overviewType }): Generator<*, *, *> {
  const state = yield select();
  const listShow = state.entities.qualifiedDeal.__COMMON_DATA
    ? state.entities.qualifiedDeal.__COMMON_DATA.listShow
    : false;
  const highlighted = state.overview[overviewType].highlighted;
  const panelAction = state.overview[overviewType].panelAction;
  const prospectId = Object.keys(highlighted).find((item) => {
    if (highlighted[item] === true) return item;
  });

  try {
    const data = yield call(api.post, {
      resource: `${Endpoints.Prospect}/orderRow/updateListOrderRowCustomField`,
      data: obj,
    });
    if (data) {
      // yield put(OverviewActions.clearHighlight(overviewType));
      yield put(clear());
      yield put(create());
      yield put(NotificationActions.success(_l`Added`, '', 2000));
      if (overviewType === 'PIPELINE_QUALIFIED' && listShow === false) {
        yield refreshQualifiedDealView(overviewType);
      }
      if (overviewType === 'PIPELINE_QUALIFIED' && listShow === true) {
        // yield put(OverviewActions.requestFetch(overviewType, true));
        const saleProcess = getSaleProcessActive(state);
        const salesProcessIds = saleProcess ? saleProcess : null;
        yield fetListBySale({ saleId: salesProcessIds, objectTypes: overviewType });
      }
      if (overviewType === 'PIPELINE_ORDER') {
        // yield put(OverviewActions.requestFetch(overviewType, true));
        const orderSale = state.entities.qualifiedDeal.__ORDER_SALE ? state.entities.qualifiedDeal.__ORDER_SALE : {};
        yield fetListBySale({ saleId: orderSale.saleId, objectTypes: overviewType });
      }
      yield put(fetchQualifiedDetail(prospectId));
      yield fetchProducts({ qualifiedDealId: prospectId });

      if (overviewType == OverviewTypes.Account_Qualified) {
        yield put(refreshOrganisation('qualified'));
      } else if (overviewType == OverviewTypes.Account_Order) {
        yield put(refreshOrganisation('order'));
      }

      if (overviewType === OverviewTypes.Contact_Qualified_Product) {
        yield put(refreshContact('qualified'));
      }
      if (overviewType === OverviewTypes.Contact_Order_Product) {
        yield put(refreshContact('order'));
      }
    }
  } catch (error) {
    yield put(NotificationActions.error(error.message));
  }
}

function* deleteOrderRow({ overviewType }): Generator<*, *, *> {
  const state = yield select();
  const highlighted = state.overview[overviewType].highlighted;
  const orderRowId = Object.keys(highlighted).find((item) => {
    if (highlighted[item] === true) return item;
  });
  try {
    const data = yield call(api.get, {
      resource: `${Endpoints.Prospect}/orderRow/delete/${orderRowId}`,
    });
    if (data) {
      yield put(OverviewActions.clearHighlight(overviewType));
      yield put(remove(orderRowId));
      if (overviewType == OverviewTypes.Account_Qualified) {
        yield put(refreshOrganisation('qualified'));
      } else if (overviewType == OverviewTypes.Account_Order) {
        yield put(refreshOrganisation('order'));
      }
    }
  } catch (error) {
    yield put(NotificationActions.error(error.message));
  }
}
export default function* saga(): Generator<*, *, *> {
  yield takeLatest(ActionTypes.FETCH_LIST_BY_PROSPECT, listByProspect);
  yield takeLatest(ActionTypes.FETCH_ADD_ORDER_ROW, fetchAddOrderRow);
  yield takeLatest(ActionTypes.UPDATE_LIST_ORDER_ROW, updateListOrder);
  yield takeLatest(ActionTypes.FETCH_DELETE_ORDER_ROW, deleteOrderRow);
}

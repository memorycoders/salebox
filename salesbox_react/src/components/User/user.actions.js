// @flow
import type { SetFieldActionT } from './user.types';

const ActionTypes = {
  FETCH_LIST_REQUEST: 'user/fetchList/request',
  FETCH_LIST_REQUEST_ACTIVE: 'user/fetchList/requestActive',
  FETCH_LIST_FAIL: 'user/fetchList/fail',
  FETCH_LIST: 'user/fetchList',
  SET_FIELD: 'user/setField',
};

export const requestFetchList = () => ({ type: ActionTypes.FETCH_LIST_REQUEST });
export const requestFetchListActive = () => ({ type: ActionTypes.FETCH_LIST_REQUEST_ACTIVE });
export const setField = ({ userId, field, value }: SetFieldActionT) => ({
  type: ActionTypes.SET_FIELD,
  userId,
  field,
  value,
});

export default ActionTypes;

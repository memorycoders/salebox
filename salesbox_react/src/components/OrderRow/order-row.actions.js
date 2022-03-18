// @flow
import uuid from 'uuid/v4';

const ActionTypes = {
  CREATE: 'orderRow/create',
  REMOVE: 'orderRow/remove',
  UPDATE: 'orderRow/update',
  UPDATE_DONE: 'orderRow/updateDone',
  CLEAR: 'orderRow/clearCreate',
  COPY_ENTITY: 'orderRow/copyEntity',
  FETCH_LIST_BY_PROSPECT: 'orderRow/fetchListByProspect',
  EDIT_ENTITY: 'orderRow/editEntity',
  FETCH_ADD_ORDER_ROW: 'orderRow/addOrderRow',
  UPDATE_LIST_ORDER_ROW: 'orderRow/updateList',
  FETCH_DELETE_ORDER_ROW: 'orderRow/fetchDelete',
  CREATE_AND_UPDATE_DATA: 'orderRow/createAndUpdate'
};

export const create = (defaults: {}) => ({
  type: ActionTypes.CREATE,
  uuid: uuid(),
  defaults,
});

export const remove = (orderRowId: number) => ({
  type: ActionTypes.REMOVE,
  orderRowId,
});
export const update = (orderRowId: number, data: {}, keyChange) => ({
  type: ActionTypes.UPDATE,
  orderRowId,
  data,
  keyChange
});
export const updateDone = (overviewType, rows, formKey) => ({
  type: ActionTypes.UPDATE_DONE,
  overviewType,
  rows,
  formKey,
});
export const clear = () => ({
  type: ActionTypes.CLEAR,
});
export const copyEntity = (data) => {
  return {
    type: ActionTypes.COPY_ENTITY,
    data,
  };
};
export const fetchListByProspect = (uuid) => {
  return {
    type: ActionTypes.FETCH_LIST_BY_PROSPECT,
    uuid,
  };
};
export const editEntity = (data, prospectId) => {
  return {
    type: ActionTypes.EDIT_ENTITY,
    data,
    prospectId,
  };
};
export const addOrderRow = (data, overviewType) => {

  return {
    type: ActionTypes.FETCH_ADD_ORDER_ROW,
    data,
    overviewType,
  };
};
export const updateList = (data, overviewType) => {
  return {
    type: ActionTypes.UPDATE_LIST_ORDER_ROW,
    data,
    overviewType,
  };
};
export const fetchDelete = (overviewType) => {
  return {
    type: ActionTypes.FETCH_DELETE_ORDER_ROW,
    overviewType,
  };
};
export const createAndUpdateOrderRow = (data) => {
  return {
    type: ActionTypes.CREATE_AND_UPDATE_DATA,
    data
  }
}
export default ActionTypes;

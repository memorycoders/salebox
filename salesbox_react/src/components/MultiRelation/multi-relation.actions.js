// @flow
const ActionTypes = {
  FETCH_REQUEST: 'multiRelation/requestFetch',
  FETCH_START: 'multiRelation/startFetch',
  FETCH_SUCCESS: 'multiRelation/succeedFetch',
  FETCH_FAIL: 'multiRelation/failFetch',
  FEED_ENTITIES: 'multiRelation/feedEntities',

  //DELETE RELATION
  DELETE_RELATION: 'multiRelation/deleteRelation',
  DELETE_RELATION_SUCCESS: 'multiRelation/deleteRelationSuccess',
  //REQUEST RELATION TYPE
  FETCH_RELATION_TYPE: 'multiRelation/fetchRelationType',
  FETCH_RELATION_TYPE_SUCCESS: 'multiRelation/fetchRelationTypeSuccess',

};

export const fetchRelationType = (objectType) => ({
  type: ActionTypes.FETCH_RELATION_TYPE,
  objectType
});

export const fetchRelationTypeSuccess = (objectType, data) => ({
  type: ActionTypes.FETCH_RELATION_TYPE_SUCCESS,
  objectType, 
  data
});

export const deleteRelation = (uuid, objectType, objectId) => ({
  type: ActionTypes.DELETE_RELATION,
  uuid,
  objectType, 
  objectId
});

export const deleteRelationSuccess = (uuid) => ({
  type: ActionTypes.DELETE_RELATION_SUCCESS,
  uuid,
});

export const requestFetch = (objectType: string, objectId: string) => ({
  type: ActionTypes.FETCH_REQUEST,
  objectType,
  objectId,
});

export const startFetch = (objectType: string, objectId: string) => ({
  type: ActionTypes.FETCH_START,
  objectType,
  objectId,
});

export const succeedFetch = (objectType: string, objectId: string, data: {}) => ({
  type: ActionTypes.FETCH_SUCCESS,
  ...data,
  objectType,
  objectId,
});

export const feedEntities = (objectType: string, objectId: string, data: {}) => ({
  type: ActionTypes.FEED_ENTITIES,
  ...data,
  objectType,
  objectId,
});

export const failFetch = (objectType: string, objectId: string, error: string) => ({
  type: ActionTypes.FETCH_FAIL,
  error,
  objectType,
  objectId,
});

export default ActionTypes;

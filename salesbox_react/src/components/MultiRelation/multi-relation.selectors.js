//@flow
import { forEach } from 'lodash';
import { createSelector } from 'reselect';

export const makeGetMultiRelations = () =>
  createSelector(
    (state) => state.entities.multiRelation,
    (state, multiRelations) => multiRelations,
    (entities, multiRelations) => {
    let _data = []
    forEach(multiRelations, (multiRelationId) => {
      if(multiRelationId && entities[multiRelationId]) {
        _data.push(entities[multiRelationId])
      }
    })
      return _data;
    }
  );

export const isFetching = createSelector(
  (state, objectType) => state.ui.multiRelation.fetching[objectType],
  (state, objectType, objectId) => objectId,
  (fetching, objectId) => {
    if (!fetching) {
      return false;
    }
    return fetching[objectId] || false;
  }
);

export const getLastFetch = createSelector(
  (state, objectType) => state.ui.multiRelation.lastFetch[objectType],
  (state, objectType, objectId) => objectId,
  (lastFetch, objectId) => {
    if (!lastFetch) {
      return 0;
    }
    return lastFetch[objectId] || 0;
  }
);

export const getRelationType = createSelector(
  (state, objectType) => state.entities.multiRelation,
  (state, objectType) => objectType,
  (multiRelation, objectType) => {

    return multiRelation['__RELATION_TYPE'] && multiRelation['__RELATION_TYPE'][objectType] ? multiRelation['__RELATION_TYPE'][objectType] : [];
  }
);

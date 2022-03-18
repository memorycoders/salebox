import { createSelector } from 'reselect';

export const getColumns = createSelector(
  (state) => state.trello,
  (state, parentId) => parentId,
  (trello, parentId) => {
    if (!parentId) {
      return [];
    }
    const trelloParent = trello[parentId];
    if (!trelloParent) {
      return [];
    }

    const keys = Object.keys(trelloParent);

    return keys.map((key) => {
      return trelloParent[key];
    });
  }
);

export const getDealInTrelloById = createSelector(
  (state) => state.trello,
  (state, qualifiedId) => qualifiedId,
  (trello, qualifiedId) => {
    let dealInList = null;
    if (trello) {
      Object.keys(trello).map((saleMethodId) => {
        Object.keys(trello[saleMethodId]).map((stepId) => {
          trello[saleMethodId][stepId]?.prospectDTOList?.map((deal) => {
            if (deal.uuid === qualifiedId) dealInList = deal;
          });
        });
      });
      if (dealInList) {
        return dealInList;
      }
    }
  }
);

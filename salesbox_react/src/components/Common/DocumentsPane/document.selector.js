/* eslint-disable import/prefer-default-export */
import { createSelector } from 'reselect';

export const getUserIdentifier = createSelector(
  (state) => state.common.__DOCUMENTS.storageDTOList,
  (state, type) => type,
  (storageDTOList, type) => {
    const list = storageDTOList ? storageDTOList : [];
    const storage = list.find((x) => x.type === type);
    return storage ? storage.value : null;
  }
);

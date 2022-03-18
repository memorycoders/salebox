import { createSelector } from 'reselect';
import { recruitment } from './recruitment.schema';

export const getListRCForDropdown = createSelector(
  (state) => state.entities.recruitment,
  (recruitment) => {
    return recruitment.__COMMON_DATA?.listRecruitmentCase?.map((e) => {
      return {
        key: e.uuid,
        text: e.name,
        value: e.uuid,
      };
    });
  }
);

export const getCurrentRC = createSelector(
  (state) => state.entities.recruitment,
  (recruitment) => {
    return recruitment.__COMMON_DATA?.currentRecruitmentCase;
  }
);

export const getColumnForRecruitmentBoard = createSelector(
  (state) => state.entities.recruitment,
  (recruitment) => {
    if(!recruitment.__TRELLO_BOARD?.steps) return [];
    return Object.keys(recruitment.__TRELLO_BOARD?.steps).map(e => {
      return recruitment.__TRELLO_BOARD?.steps[e];
    });
  }
);

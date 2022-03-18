// @flow
import { createSelector } from 'reselect';
import { addNone } from 'lib';

export const getFocusActivities = createSelector(
  (state) => state.entities.focusActivity,
  (focusActivities) => {
    const choices = Object.keys(focusActivities).map((catId) => {
      const focus = focusActivities[catId];
      return {
        key: focus.uuid,
        value: focus.uuid,
        text: focus.name,
      };
    });
    return addNone(choices);
  }
);

export const getFoci = createSelector(
  (state) => state.entities.focus,
  (foci) => {
    const choices = Object.keys(foci).map((catId) => {
      const focus = foci[catId];
      return {
        key: focus.uuid,
        value: focus.uuid,
        text: focus.name,
      };
    });
    return addNone(choices);
  }
);

export const getFocus = createSelector((state, focusId) => state.entities.focus[focusId], (focus) => focus);

export default getFocusActivities;

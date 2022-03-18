// @flow
import { createSelector } from 'reselect';
import { createTemplate } from './dropdown.reducer';

const emptyDropdown = createTemplate();

export const getDropdown = createSelector(
  (state, objectType) => state.dropdown[objectType],
  (dropdown) => {
    return dropdown || emptyDropdown;
  }
);

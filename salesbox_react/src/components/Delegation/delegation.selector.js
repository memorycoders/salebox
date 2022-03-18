// @flow
import { createSelector } from 'reselect';

export const isTaskSelected = createSelector(
  (state, taskId) => state.ui.delegation.selectedTasks[taskId],
  (selected) => selected
);

export const isTaskHighlighted = createSelector(
  (state, taskId) => taskId,
  (state) => state.ui.delegation.highlightedTaskId,
  (taskId, highlightedTaskId) => taskId === highlightedTaskId
);

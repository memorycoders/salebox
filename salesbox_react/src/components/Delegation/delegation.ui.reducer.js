// @flow
/* eslint-disable no-param-reassign */
import createReducer from 'store/createReducer';
import DelegationActions from './delegation.actions';

const initialState = {
  taskSearchTerm: '',
  tasks: [],
  leads: [],
  taskCount: 0,
  lastFetch: {},
  fetching: {},
  taskLeadMap: {},
  selectedTasks: {},
  addNoteFormShown: false,
  highlightedTaskId: null,
  taskAction: null,
};

export default createReducer(initialState, {
  [DelegationActions.FETCH_TASKS]: (draft, action) => {
    draft.lastFetch.tasks = Date.now();
    draft.fetching.tasks = false;
    if (action.entities.task) {
      const newTasks = Object.keys(action.entities.task);
      if (action.next) {
        draft.tasks = [...draft.tasks, ...newTasks];
      } else {
        draft.tasks = newTasks;
      }
      if ('count' in action) {
        draft.taskCount = action.count;
      }
    } else {
      draft.taskCount = 0;
      draft.tasks = [];
    }
  },
  [DelegationActions.FETCH_TASKS_FAIL]: (draft) => {
    draft.fetching.tasks = false;
  },
  [DelegationActions.FETCH_TASKS_REQUEST]: (draft) => {
    draft.fetching.tasks = true;
  },
  [DelegationActions.FETCH_TASK]: (draft, { taskId, result }) => {
    draft.lastFetch[taskId] = Date.now();
    draft.fetching[taskId] = false;
    draft.taskLeadMap[taskId] = result;
  },
  [DelegationActions.FETCH_TASK_FAIL]: (draft, { taskId }) => {
    draft.fetching[taskId] = false;
  },
  [DelegationActions.FETCH_TASK_REQUEST]: (draft, { taskId }) => {
    draft.fetching[taskId] = true;
  },
  [DelegationActions.FETCH_LEADS]: (draft) => {
    draft.lastFetch.leads = Date.now();
    draft.fetching.leads = false;
  },
  [DelegationActions.FETCH_LEADS_FAIL]: (draft) => {
    draft.fetching.leads = false;
  },
  [DelegationActions.FETCH_LEADS_REQUEST]: (draft) => {
    draft.fetching.leads = true;
  },
  [DelegationActions.SHOW_ADDNOTE_FORM]: (draft) => {
    draft.addNoteFormShown = true;
  },
  [DelegationActions.HIDE_ADDNOTE_FORM]: (draft) => {
    draft.addNoteFormShown = false;
  },
  [DelegationActions.HIGHLIGHT_TASK]: (draft, { action, taskId }) => {
    draft.highlightedTaskId = taskId;
    draft.taskAction = action;
  },
  [DelegationActions.UNHIGHLIGHT_TASK]: (draft) => {
    draft.highlightedTaskId = null;
    draft.taskAction = null;
  },
  [DelegationActions.SELECT_TASK]: (draft, { taskId }) => {
    draft.selectedTasks[taskId] = true;
  },
  [DelegationActions.UNSELECT_TASK]: (draft, { taskId }) => {
    draft.selectedTasks[taskId] = false;
  },
  [DelegationActions.DELETE_TASK]: (draft, { taskId }) => {
    draft.taskIdToDelete = taskId;
  },
  [DelegationActions.SEARCH_TASK]: (draft, { taskSearchTerm }) => {
    draft.taskSearchTerm = taskSearchTerm;
  },
});

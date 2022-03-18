// @flow
import type { FetchTasksActionT, FetchLeadsActionT } from './delegation.types';

const ActionTypes = {
  FETCH_TASKS_REQUEST: 'delegation/fetchTasks/request',
  FETCH_TASKS_FAIL: 'delegation/fetchTasks/fail',
  FETCH_TASKS: 'delegation/fetchTasks',
  FETCH_TASK_REQUEST: 'delegation/fetchTask/request',
  FETCH_TASK_FAIL: 'delegation/fetchTask/fail',
  FETCH_TASK: 'delegation/fetchTask',
  FETCH_LEADS_REQUEST: 'delegation/fetchLeads/request',
  FETCH_LEADS_FAIL: 'delegation/fetchLeads/fail',
  FETCH_LEADS: 'delegation/fetchLeads',
  SHOW_ADDNOTE_FORM: 'delegation/showAddNoteForm',
  HIDE_ADDNOTE_FORM: 'delegation/hideAddNoteForm',
  HIGHLIGHT_TASK: 'delegation/highlightTask',
  UNHIGHLIGHT_TASK: 'delegation/unhighlightTask',
  DELETE_TASK: 'delegation/deleteTask',
  SEARCH_TASK: 'delegation/searchTask',
  SELECT_TASK: 'delegation/selectTask',
  UNSELECT_TASK: 'delegation/unselectTask',
  ASSIGN_TASK: 'ASSIGN_TASK',
};

export const requestFetchTasks = ({ next }: FetchTasksActionT = { next: false }) => ({
  type: ActionTypes.FETCH_TASKS_REQUEST,
  next,
});

export const requestFetchTask = (taskId: string) => ({
  type: ActionTypes.FETCH_TASK_REQUEST,
  taskId,
});

export const searchTask = (taskSearchTerm: string) => ({
  type: ActionTypes.SEARCH_TASK,
  taskSearchTerm,
});

export const requestFetchLeads = ({ next }: FetchLeadsActionT = { next: false }) => ({
  type: ActionTypes.FETCH_LEADS_REQUEST,
  next,
});

export const showAddNoteForm = () => ({ type: ActionTypes.SHOW_ADDNOTE_FORM });
export const hideAddNoteForm = () => ({ type: ActionTypes.HIDE_ADDNOTE_FORM });

export const selectTask = (taskId: string) => ({ type: ActionTypes.SELECT_TASK, taskId });
export const unselectTask = (taskId: string) => ({ type: ActionTypes.UNSELECT_TASK, taskId });

export const highlightTask = (taskId: string, action: string) => ({ type: ActionTypes.HIGHLIGHT_TASK, taskId, action });
export const unhighlightTask = () => ({ type: ActionTypes.UNHIGHLIGHT_TASK });
export const deleteTask = (taskId: string) => ({ type: ActionTypes.DELETE_TASK, taskId });
export const assignTask = (overviewType, data, taskId) => ({
  type: ActionTypes.ASSIGN_TASK,
  overviewType,
  data,
  taskId,
});
export default ActionTypes;

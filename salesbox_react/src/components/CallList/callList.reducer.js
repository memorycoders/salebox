import { CALL_LIST_TYPE } from "../../Constants";
import createReducer, { createConsumeEntities } from 'store/createReducer';
import ActionTypes from './callList.actions'
export const initialState = {
  suggestForm: {
      status: false,
      type: CALL_LIST_TYPE.CONTACT
    },
    isImportStatus: false,
    __CALL_LIST_ACCOUNT_DROPDOWN: {
      list: [],
      pageIndex: -1
    },
  __CALL_LIST_CONTACT_DROPDOWN: {
    list: [],
    pageIndex: -1
  }
  };
const consumeEntities = createConsumeEntities('callList');
  export default createReducer(initialState, {
    default: consumeEntities,
    [ActionTypes.UPDATE_SUGGEST_CALLLIST]: (draft, {suggestForm}) => {
      draft.suggestForm = suggestForm
      draft.isImportStatus = false
    },
    [ActionTypes.UPDATE_IMPORT_STATUS_IN_CALLLIST]: (draft, { status }) => {
      draft.isImportStatus = status
    },

    [ActionTypes.UPDATE_CALL_LIST_DROPDOWN]: (draft, { callListType, list, pageIndex }) => {
      if (callListType === 'ACCOUNT'){
        draft.__CALL_LIST_ACCOUNT_DROPDOWN = draft.__CALL_LIST_ACCOUNT_DROPDOWN || {};
        if (draft.__CALL_LIST_ACCOUNT_DROPDOWN.pageIndex < pageIndex){
          draft.__CALL_LIST_ACCOUNT_DROPDOWN.list = list
        }
        draft.__CALL_LIST_ACCOUNT_DROPDOWN.pageIndex = pageIndex;
      } else {
        draft.__CALL_LIST_CONTACT_DROPDOWN = draft.__CALL_LIST_CONTACT_DROPDOWN || {};
        if (draft.__CALL_LIST_CONTACT_DROPDOWN.pageIndex < pageIndex) {
          draft.__CALL_LIST_CONTACT_DROPDOWN.list = list
        }
       
        draft.__CALL_LIST_CONTACT_DROPDOWN.pageIndex = pageIndex;
      }
    }
})
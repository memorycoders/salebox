const ActionTypes = {
    UPDATE_SUGGEST_CALLLIST: 'callList/updateSuggestCallList',
    UPDATE_IMPORT_STATUS_IN_CALLLIST: 'callList/updateImportStatusInCallList',
    ADD_EDIT_CALLLIST: 'callList/addEditCallList',
    UPDATE_CALL_LIST_DROPDOWN: 'callList/updateCallListDropdown'
}

export const updateSuggestCallList = (suggestForm) => ({
    type: ActionTypes.UPDATE_SUGGEST_CALLLIST,
    suggestForm
})

export const updateImportStatusInCallList = (status) => ({
    type: ActionTypes.UPDATE_IMPORT_STATUS_IN_CALLLIST,
    status
});

export const updateCallListDropdown = (callListType, list, pageIndex) => ({
    type: ActionTypes.UPDATE_CALL_LIST_DROPDOWN,
    callListType, 
    list, 
    pageIndex
})

export default ActionTypes;
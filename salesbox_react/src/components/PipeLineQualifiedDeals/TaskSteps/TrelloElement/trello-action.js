export const ActionTypes = {
    UPDATE_CARD_LANES: 'UPDATE_CARD_LANES',
    UPDATE_LANES_PARENT: 'UPDATE_LANES_PARENT',
    LOAD_MORE_STEPS: 'LOAD_MORE_STEPS',
    LOAD_MORE_STEPS_SUCCESS: 'LOAD_MORE_STEPS_SUCCESS',

    //SET WON, LOST
    SET_WON_LOST_DONE: 'SET_WON_LOST_DONE',

    SET_TRELLO_SELECTED_TRACK: 'SET_TRELLO_SELECTED_TRACK',
    UPDATE_CARD_MANUALY: 'UPDATE_CARD_MANUALY' //update a card instantly on UI
}

export const setTrelloSelectedTrack = (columnId, dragableId, parentId) => {
    return {
        type: ActionTypes.SET_TRELLO_SELECTED_TRACK,
        columnId,
        dragableId,
        parentId
    }
}

export const setWonLostDone = (dragableId) => {
    return {
        type: ActionTypes.SET_WON_LOST_DONE,
        dragableId
    }
}

export const loadMoreSteps = (columnId, pageIndex, lastStep, parentId) => {
    return {
        type: ActionTypes.LOAD_MORE_STEPS,
        columnId,
        pageIndex,
        lastStep,
        salesProcessId: parentId
    }
}

export const loadMoreStepsSuccess = (prospectDTOList, salesProcessId, columnId) => {
    return {
        type: ActionTypes.LOAD_MORE_STEPS_SUCCESS,
        prospectDTOList, salesProcessId, columnId
    }
}

export const updateLanesParent = (parentId, data)=> {
    return {
        type: ActionTypes.UPDATE_LANES_PARENT,
        parentId, data
    }
}

export const updateCardLanes = (source, destination, parentId) => {
    return {
        type: ActionTypes.UPDATE_CARD_LANES,
        source, destination, parentId
    }
}

export const updateCardManualyAfterUpdate = (prospect) => ({
  type: ActionTypes.UPDATE_CARD_MANUALY,
  prospect
})

// @flow
import createReducer from 'store/createReducer';
import { ActionTypes } from './trello-action'
import _ from 'lodash';

export const initialState = {
    __TRACK: {}
};

export default createReducer(initialState, {
    [ActionTypes.UPDATE_LANES_PARENT]: (draft, { parentId, data }) => {
        draft = draft || {};
        draft[parentId] = data
    },

    [ActionTypes.SET_TRELLO_SELECTED_TRACK]: (draft, { columnId, dragableId, parentId }) => {
        draft.__TRACK = draft.__TRACK || {};
        draft.__TRACK[dragableId] = {
            columnId,
            dragableId,
            parentId
        }
    },
    [ActionTypes.SET_WON_LOST_DONE]: (draft, { dragableId }) => {
        draft.__TRACK = draft.__TRACK || {};
        const itemSelected = draft.__TRACK[dragableId];
        if (itemSelected){
            const columnId = draft.__TRACK[dragableId].columnId;
            const parentId = draft.__TRACK[dragableId].parentId;

            draft[parentId] = draft[parentId] || {};
            draft[parentId][columnId] = draft[parentId][columnId] || { prospectDTOList: [], count: 0, grossValue: 0 };
            _.remove(draft[parentId][columnId].prospectDTOList, (value, idx) => {
                if (value.uuid === dragableId){
                    draft[parentId][columnId].grossValue = draft[parentId][columnId].grossValue - value.grossValue;
                    return true;
                }
                return false;
            });
            draft[parentId][columnId].count = draft[parentId][columnId].count - 1;

        }

    },
    [ActionTypes.UPDATE_CARD_LANES]: (draft, { source, destination, parentId }) => {
        draft[parentId] = draft[parentId] || {};
        //source.droppableId
        let current = draft[parentId][source.droppableId];
        let next = draft[parentId][destination.droppableId];
        const target = current.prospectDTOList[source.index];


        current = {
            ...current,
            count: current.count - 1 > 0 ? current.count - 1 : 0,
            grossValue: current.grossValue - target.grossValue,
        }
        _.remove(current.prospectDTOList, (v, idx) => idx === source.index)
        next = {
            ...next,
            count: next.count + 1,
            grossValue: next.grossValue + target.grossValue,
        }
        next.prospectDTOList.splice(destination.index, 0, target);
        draft[parentId][source.droppableId] = current;
        draft[parentId][destination.droppableId] = next;
    },

    [ActionTypes.LOAD_MORE_STEPS_SUCCESS]: (draft, { prospectDTOList, salesProcessId, columnId }) => {
        draft = draft || {};
        draft[salesProcessId] = draft[salesProcessId] || {};
        draft[salesProcessId][columnId] = draft[salesProcessId][columnId] || { prospectDTOList: []};
        draft[salesProcessId][columnId].prospectDTOList = draft[salesProcessId][columnId].prospectDTOList.concat(prospectDTOList)
    },
    [ActionTypes.UPDATE_CARD_MANUALY] : (draft, {prospect}) => {
      const {currentStepId, salesMethod, uuid } = prospect;

      let currentListProspectDTO = [];
      if(salesMethod) {
        Object.keys(draft[salesMethod.uuid]).map(stepId => {
          currentListProspectDTO = draft[salesMethod.uuid][stepId] ? draft[salesMethod.uuid][stepId].prospectDTOList : [];
          let index = currentListProspectDTO.findIndex(e => e.uuid === prospect.uuid);
          if( index > -1){
            draft[salesMethod.uuid][stepId].prospectDTOList[index] = prospect;
          }
        })

      }
    }

});

// @flow
import createReducer, { createConsumeEntities } from 'store/createReducer';
import { OverviewTypes } from '../../Constants';
import ActionTypes from './recruitment.actions';
import AuthActionType from '../Auth/auth.actions';

export const initState = {
  __CREATE: { contact: null, uuid: null, currentRecruitmentCase: null, userList: [] },
  __DETAIL: {},
  __COMMON_DATA: {
    listRecruitmentCase: [],
    currentRecruitmentCase: null,
  },
  __TRELLO_BOARD: {
    steps: {},
  },
};

export default createReducer(initState, {
  [ActionTypes.CLEAR_DATA_RECRUITMENT_BOARD]: (draft) => {
    draft.__TRELLO_BOARD = {
      steps: {},
    };
  },
  [AuthActionType.LOGOUT]: (draft) => {
    Object.keys(draft).forEach((id) => delete draft[id]);
    draft = { ...initState };
  },
  [ActionTypes.SELECT_RECRUITMENT_CASE]: (draft, { recruitmentCaseId }) => {
    if (!draft.__COMMON_DATA) {
      draft.__COMMON_DATA = {
        listRecruitmentCase: [],
        currentRecruitmentCase: null,
      };
    }
    draft.__COMMON_DATA.currentRecruitmentCase = recruitmentCaseId;
  },
  [ActionTypes.FETCH_LIST_RECRUITMENT_CASE_SUCCESS]: (draft, { data }) => {
    if (!draft.__COMMON_DATA) {
      draft.__COMMON_DATA = {
        listRecruitmentCase: [],
        currentRecruitmentCase: null,
      };
    }
    draft.__COMMON_DATA.listRecruitmentCase = data;
  },
  [ActionTypes.FETCH_RECRUITMENT_ACTIVE_DATA_SUCCESS]: (draft, { data }) => {
    if (!draft.__TRELLO_BOARD) {
      draft.__TRELLO_BOARD = {
        steps: {},
      };
    }
    draft.__TRELLO_BOARD.steps = {};
    data?.activityDTOList
      ?.sort(function(a, b) {
        return a.index - b.index;
      })
      .map((e) => {
        draft.__TRELLO_BOARD.steps[e.uuid] = { ...e, listCandidates: [], total: 0 };
      });
  },
  [ActionTypes.FETCH_DATA_CANDIDATE_TO_BOARD_SUCCESS]: (draft, { data }) => {
    data
      .filter((e) => e.stepId)
      .forEach((e) => {
        if (e.stepId && !draft.__TRELLO_BOARD.steps[e.stepId]) {
          draft.__TRELLO_BOARD.steps[e.stepId] = {
            listCandidates: [],
          };
        }
        draft.__TRELLO_BOARD.steps[e.stepId].listCandidates = e.recruitmentDTOList;
        draft.__TRELLO_BOARD.steps[e.stepId].total = e.total || 0;
      });
  },
  [ActionTypes.MOVE_STEP_CANDIDATE_MANUALLY]: (draft, { sourceId, candidateId, targetId }) => {
    if (sourceId && candidateId && targetId) {
      let candidate = draft.__TRELLO_BOARD.steps[sourceId].listCandidates.filter((e) => e.uuid === candidateId);
      draft.__TRELLO_BOARD.steps[sourceId].listCandidates = draft.__TRELLO_BOARD.steps[sourceId].listCandidates.filter(
        (e) => e.uuid !== candidateId
      );
      if (candidate) {
        draft.__TRELLO_BOARD.steps[targetId].listCandidates.push(candidate[0]);
        draft.__TRELLO_BOARD.steps[sourceId].total = draft.__TRELLO_BOARD.steps[sourceId].total - 1;
        draft.__TRELLO_BOARD.steps[targetId].total = draft.__TRELLO_BOARD.steps[targetId].total + 1;
      }
    }
  },
  [ActionTypes.DELETE_CANDIDATE_LOCAL]: (draft, { candidateId }) => {
    let steps = draft.__TRELLO_BOARD.steps;
    if (steps) {
      Object.keys(steps).map((e) => {
        draft.__TRELLO_BOARD.steps[e].listCandidates = draft.__TRELLO_BOARD.steps[e].listCandidates.filter(
          (e) => e.uuid !== candidateId
        );
      });
    }
  },
  [ActionTypes.UPDATE_CANDIDATE_LOCAL]: (draft, { data }) => {
    // console.log('DATA UPDATE:', data);
    // let steps = draft.__TRELLO_BOARD.steps;
    // if (steps) {
    //   Object.keys(steps).map((e) => {
    //     let index = draft.__TRELLO_BOARD.steps[e].listCandidates.findIndex((e) => e.contactId === data.contactId);
    //     console.log('INDEX:', index);
    //     if (index !== -1) {
    //       draft.__TRELLO_BOARD.steps[e].listCandidates = [
    //         ...draft.__TRELLO_BOARD.steps[e].listCandidates.slice(0, index),
    //         { ...draft.__TRELLO_BOARD.steps[e].listCandidates[index], ...data },
    //         ...draft.__TRELLO_BOARD.steps[e].listCandidates.slice(
    //           index + 1,
    //           ...draft.__TRELLO_BOARD.steps[e].listCandidates.length
    //         ),
    //       ];
    //     }
    //   });
    // }
  },
  [ActionTypes.CREATE_CANDIDATE_ENTITY]: (draft, { data }) => {
    draft.__CREATE = data;
  },
  [ActionTypes.LOAD_MORE_CANDIDATE_SUCCESS]: (draft, { data }) => {
    if (data?.stepId && draft.__TRELLO_BOARD.steps[data.stepId]) {
      draft.__TRELLO_BOARD.steps[data.stepId].listCandidates.push(...data?.recruitmentDTOList);
    }
  },
});

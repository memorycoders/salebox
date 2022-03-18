const ActionTypes = {
  FETCH_LIST_RECRUITMENT_CASE: 'recruitment/fetchListRC',
  FETCH_LIST_RECRUITMENT_CASE_SUCCESS: 'recruitment/fetchListRCSuccess',
  FETCH_RECRUITMENT_ACTIVE_DATA: 'recruitment/fetchRCActiveData',
  FETCH_RECRUITMENT_CLOSED_DATA: 'recruitment/fetchClosedData',
  FETCH_RECRUITMENT_ACTIVE_DATA_SUCCESS: 'recruitment/fetchRCActiveDataSuccess',
  UPDATE_STEPS: 'recruitment/updateStep',
  SELECT_RECRUITMENT_CASE: 'recruitment/selectRecruitmentCase',
  ADD_CANDIDATE_TO_DATA: 'recruitment/addCandidateToData',
  FETCH_LIST_CANDIDATE_BY_SETP: 'reccruitment/fetchListCandidateByStep',
  FETCH_LIST_CANDIDATE_BY_STEP_SUCCESS: 'recruitment/fetchListCandidateByStepSuccess',
  FETCH_DATA_CANDIDATE_TO_BOARD_SUCCESS: 'recruitment/fetchDataCandidateToTrelloBoardSuccess',
  MOVE_STEP_CANDIDATE_MANUALLY: 'recruitment/moveStepCandidateManually',
  DELETE_CANDIDATE_LOCAL: 'recruitment/deleteCandidateLocal',
  UPDATE_CANDIDATE_LOCAL: 'recruitment/updateCandidateLocal',
  FETCH_LIST_CANDIDATE_CLOSED_BY_CASEID: 'recruitment/fetchListRecruitmentClosedByCaseId',
  CHANGE_ON_MULTI_MENU: 'recruitment/changeOnMultiMenu',
  CLEAR_DATA_RECRUITMENT_BOARD: 'recruitment/clearDataRecruitmentBoard',
  CREATE_CANDIDATE_ENTITY: 'recruitment/createCandidateEntity',
  LOAD_MORE_CANDIADATE_BY_STEP: 'recruiment/loadMoreCandidateByStep',
  LOAD_MORE_CANDIDATE_SUCCESS: 'recruitment/loadMoreCandidateSuccess'
};

export const loadMoreCandidateSuccess = (data) => {
  return {
    type: ActionTypes.LOAD_MORE_CANDIDATE_SUCCESS,
    data
  }
}
export const loadMoreCandidateByStep = (pageIndex, stepId, lastStep, recruitmentCaseId) => {
  return {
    type: ActionTypes.LOAD_MORE_CANDIADATE_BY_STEP,
    pageIndex,
    stepId,
    lastStep,
    recruitmentCaseId
  }
}
export const createCandidateEntity = (data) => {
  return {
    type: ActionTypes.CREATE_CANDIDATE_ENTITY,
    data
  }
}
export const clearDataRecruitmentBoard = () => {
  return {
    type: ActionTypes.CLEAR_DATA_RECRUITMENT_BOARD
  }
}
export const changeOnMultiMenu = (option, optionValue, overviewType) => {
  return {
    type: ActionTypes.CHANGE_ON_MULTI_MENU,
    option,
    optionValue,
    overviewType,
  };
};
export const fetchListRecruitmentClosedByCaseId = (recruitmentCaseId) => {
  return {
    type: ActionTypes.FETCH_LIST_CANDIDATE_CLOSED_BY_CASEID,
    recruitmentCaseId,
  };
};
export const updateCandidateLocal = (data) => {
  return {
    type: ActionTypes.UPDATE_CANDIDATE_LOCAL,
    data,
  };
};
export const deleteCandidateLocal = (candidateId) => {
  return {
    type: ActionTypes.DELETE_CANDIDATE_LOCAL,
    candidateId,
  };
};
export const moveStepCandidateManually = (sourceId, candidateId, targetId) => {
  return {
    type: ActionTypes.MOVE_STEP_CANDIDATE_MANUALLY,
    sourceId,
    candidateId,
    targetId,
  };
};
export const fetchListRC = (isDropdownInForm) => {
  return {
    type: ActionTypes.FETCH_LIST_RECRUITMENT_CASE,
    isDropdownInForm,
  };
};
export const fetchListRCSuccess = (data) => {
  return {
    type: ActionTypes.FETCH_LIST_RECRUITMENT_CASE_SUCCESS,
    data,
  };
};
export const selectRecruitmentCase = (recruitmentCaseId) => {
  return {
    type: ActionTypes.SELECT_RECRUITMENT_CASE,
    recruitmentCaseId,
  };
};
export const fetchRCActiveDataByCaseId = (recruitmentCaseId) => {
  return {
    type: ActionTypes.FETCH_RECRUITMENT_ACTIVE_DATA,
    recruitmentCaseId,
  };
};
export const fetchCloseDataByCaseId = (recruitmentCaseId) => {
  return {
    type: ActionTypes.FETCH_RECRUITMENT_CLOSED_DATA,
    recruitmentCaseId,
  };
};
export const fetchRCActiveDataSuccess = (data) => {
  return {
    type: ActionTypes.FETCH_RECRUITMENT_ACTIVE_DATA_SUCCESS,
    data,
  };
};
export const fetchListCandidateByStep = (stepId, lastStep) => {
  return {
    type: ActionTypes.FETCH_LIST_CANDIDATE_BY_SETP,
    stepId,
    lastStep,
  };
};
export const fetchListCandidateByStepSuccess = (stepId, data) => {
  return {
    type: ActionTypes.FETCH_LIST_CANDIDATE_BY_STEP_SUCCESS,
    stepId,
    data,
  };
};
export const fetchDataCandidateToTrelloBoardSuccess = (data) => {
  return {
    type: ActionTypes.FETCH_DATA_CANDIDATE_TO_BOARD_SUCCESS,
    data,
  };
};
export default ActionTypes;

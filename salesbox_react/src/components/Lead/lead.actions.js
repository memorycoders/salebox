const ActionTypes = {
  DELEGATION_LEAD_DELETE: 'DELEGATION_LEAD_DELETE',
  DELEGATION_LEAD_ASSIGN: 'DELEGATION_LEAD_ASSIGN',
  ASSIGN_TO_ME: 'lead/assignToMe',
  FETCH_LEAD_DETAIL: 'FETCH_LEAD_DETAIL',
  REFESH_LEAD_DETAIL: 'REFESH_LEAD_DETAIL',
  FETCH_LEAD_DETAIL_SUCCESS: 'FETCH_LEAD_DETAIL_SUCCESS',
  START_FETCH_DETAIL: 'lead/startFetchDetail',
  FETCH_SUCCESS: 'lead/fetSuccess',
};

export const deleteLead = (overviewType, leadId) => ({
  type: ActionTypes.DELEGATION_LEAD_DELETE,
  overviewType,
  leadId,
});

export const assignLead = (overviewType, data, leadId) => ({
  type: ActionTypes.DELEGATION_LEAD_ASSIGN,
  overviewType,
  data,
  leadId,
});

export const assignToMe = ( leadId : sting, overviewType: string) => ({
  type: ActionTypes.ASSIGN_TO_ME,
  leadId ,
  overviewType,
});

export const fetchLeadDetail = (unqualifiedDealId, isRefesh = true) => ({
  type: ActionTypes.FETCH_LEAD_DETAIL,
  unqualifiedDealId,
  isRefesh,
});

export const refeshLeadDetail = (actionType) => ({
  type: ActionTypes.REFESH_LEAD_DETAIL,
  actionType,
});

export default ActionTypes;

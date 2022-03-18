// @flow
const ActionTypes = {
  UPDATE: 'appointment/update',
  FETCH_APPOINTMENT_REQUEST: 'appointment/fetchAppointment/request',
  FETCH_APPOINTMENT_START: 'appointment/fetchAppointment/start',
  FETCH_APPOINTMENT_FAIL: 'appointment/fetchAppointment/fail',
  FETCH_APPOINTMENT_SUCCESS: 'appointment/fetchAppointment/success',
  EDIT_APPOINTMENT: 'appointment/editAppointment',
  CHANGE_NOTE: 'appointment/changeNote',
  CHANGE_NOTE_SAGA: 'appointment/updateNoteSaga',
  CHANGE_ON_MULTI_APPOINTIMENT_MENU: 'appointment/changeOnMultiMenu',
  DELETE_APPOINTMENT: 'appointment/deleteAppointment',
  CREATE_REQUEST: 'appointment/createRequest',
  CREATE_REQUEST_SUCCESS: 'appointment/createRequestSuccess',
  EDIT_ENTITY: 'appointment/editEntity',
  UPDATE_REQUEST: 'appointment/updateRequest',
  SET_REMAINDER: 'appointment/setRemainder',
  CHECK_APPOINTMENT_FINISH: 'appointment/checkAppointmentFinish',
  SET_MODAL_APPOINTMENT: 'appointment/setModalAppointmentSuggest',
  SET_CURRENT_SUGGEST_ACTION: 'appointment/setCurrentSuggestAction',
  SET_LIST_APPOINTMENT_NOT_HANDLE : 'appointment/setListAppointmentNotHandleToday',
  UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_DEAL: 'appointment/UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_DEAL',
  INIT_APPOINTMENT_REMINDER_NOTIFICATION: 'appointment/initAppointmentAndTaskRemiderNotification'

};

export const setRemainder = (remainders)=> {
  return {
    remainders,
    type: ActionTypes.SET_REMAINDER
  }
}

export const updateNoteSaga = (appointmentId: string, note: string) => ({
  type: ActionTypes.CHANGE_NOTE_SAGA,
  appointmentId,
  note,
});

export const update = (appointmentId: string, updateData: {}) => ({
  type: ActionTypes.UPDATE,
  appointmentId,
  updateData,
});

export const requestFetchAppointment = (appointmentId: string) => ({
  type: ActionTypes.FETCH_APPOINTMENT_REQUEST,
  appointmentId,
});

export const startFetchAppointment = (appointmentId: string) => ({
  type: ActionTypes.FETCH_APPOINTMENT_START,
  appointmentId,
});

export const failFetchAppointment = (appointmentId: string, error: string) => ({
  type: ActionTypes.FETCH_APPOINTMENT_FAIL,
  appointmentId,
  error,
});

export const succeedFetchAppointment = (appointmentId: string, data: {}, originalData) => ({
  type: ActionTypes.FETCH_APPOINTMENT_SUCCESS,
  appointmentId,
  ...data,
  originalData,
});

export const editAppointment = (appointmentId: string) => ({
  type: ActionTypes.EDIT_APPOINTMENT,
  appointmentId,
});

export const changeOnMultiMenu = (option, optionValue, overviewType) => ({
  type: ActionTypes.CHANGE_ON_MULTI_APPOINTIMENT_MENU,
  option,
  optionValue,
  overviewType,
});

export const deleteAppointment = (appointmentId, overviewType) => ({
  type: ActionTypes.DELETE_APPOINTMENT,
  appointmentId,
  overviewType,
});
export const createRequest = (overviewType) => ({
  type: ActionTypes.CREATE_REQUEST,
  overviewType,
});

export const createRequestSuccess = () => ({
  type: ActionTypes.CREATE_REQUEST_SUCCESS,
});

export const editEntity = (data) => ({
  type: ActionTypes.EDIT_ENTITY,
  data,
});

export const updateRequest = (overviewType) => ({
  type: ActionTypes.UPDATE_REQUEST,
  overviewType,
});

export const checkAppointmentFinish = () => ({
  type: ActionTypes.CHECK_APPOINTMENT_FINISH
})

export const setModalAppointmentSuggest = (status, appointment, openFrom) => ({
  type: ActionTypes.SET_MODAL_APPOINTMENT,
  status,
  appointment,
  openFrom
})
export const setCurrentSuggestAction = (actionName, appointment) => ({
  type: ActionTypes.SET_CURRENT_SUGGEST_ACTION,
  actionName,
  appointment
}) 

export const setListAppointmentNotHandleToday = (status, listAppointment, isEndOfDay) => ({
  type: ActionTypes.SET_LIST_APPOINTMENT_NOT_HANDLE,
  status,
  listAppointment,
  isEndOfDay
})
export const updateCreateEditEntityAfterAddDeal = (qualifiedId,unqualifiedId,companyId,contactIds) =>({
  type: ActionTypes.UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_DEAL,
  qualifiedId,unqualifiedId,companyId,contactIds
})

export const initAppointmentAndTaskRemiderNotification= () => ({
  type: ActionTypes.INIT_APPOINTMENT_REMINDER_NOTIFICATION
})

export default ActionTypes;

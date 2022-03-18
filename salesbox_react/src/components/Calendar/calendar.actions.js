// @flow
const ActionTypes = {
    UPDATE: 'calendar/update',
    FETCH_APPOINTMENT_REQUEST: 'calendar/fetchAppointment/request',
    FETCH_APPOINTMENT_START: 'calendar/fetchAppointment/start',
    FETCH_APPOINTMENT_FAIL: 'calendar/fetchAppointment/fail',
    FETCH_APPOINTMENT_SUCCESS: 'calendar/fetchAppointment/success',
    EDIT_APPOINTMENT: 'calendar/editAppointment',
};

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

export const succeedFetchAppointment = (appointmentId: string) => ({
    type: ActionTypes.FETCH_APPOINTMENT_SUCCESS,
    appointmentId,
});

export const editAppointment = (appointmentId: string) => ({
    type: ActionTypes.EDIT_APPOINTMENT,
    appointmentId,
});

export default ActionTypes;

// @flow
import createReducer, { createConsumeEntities } from 'store/createReducer';
import AuthActionTypes from 'components/Auth/auth.actions';
import { OverviewTypes } from 'Constants';
import OverviewActionTypes from 'components/Overview/overview.actions';
import AppointmentActionTypes from 'components/Appointment/appointment.actions';
import { createAppointment } from './appointment.schema';

export const initialState = {};

const consumeEntities = createConsumeEntities('appointment');

export default createReducer(initialState, {
    [AuthActionTypes.LOGOUT]: (draft) => {
        Object.keys(draft).forEach((id) => delete draft[id]);
    },
    [OverviewActionTypes.EDIT_ENTITY]: (draft, { overviewType, itemId }) => {
        if (overviewType === OverviewTypes.Activity.Appointment) {
            draft.__EDIT = {
                ...draft[itemId],
            };
        }
    },
    [OverviewActionTypes.CREATE_ENTITY]: (draft, { overviewType, defaults }) => {
        if (overviewType === OverviewTypes.Activity.Appointment) {
            draft.__CREATE = createAppointment(defaults);
        }
    },
    [AppointmentActionTypes.UPDATE]: (draft, { appointmentId, updateData }) => {
        draft[appointmentId] = draft[appointmentId] || {};
        Object.keys(updateData).forEach((key) => {
            draft[appointmentId][key] = updateData[key];
        });
    },
    default: consumeEntities,
});

// @flow
import { createSelector } from 'reselect';
import { createAppointment } from './appointment.schema';
import { OverviewTypes } from 'Constants';
import { getOverview } from 'components/Overview/overview.selectors';

export const getAppointment = (state: {}, appointmentId: string) => state.entities.appointment[appointmentId];

const emptyFocus = {};
const emptyOwner = {};

const makeGetFocusForAppointment = () => {
    return createSelector((state, appointmentId) => {
        const appointment = state.entities.appointment[appointmentId];
        if (appointment && appointment.focus) {
            return state.entities.focus[appointment.focus] || emptyFocus;
        }
        return emptyFocus;
    }, (focus) => focus);
};

const makeGetOwnerForAppointment = () => {
    return createSelector((state, appointmentId) => {
        const appointment = state.entities.appointment[appointmentId];
        if (appointment && appointment.owner) {
            return state.entities.user[appointment.owner];
        }
        return emptyOwner;
    }, (user) => user);
};

const makeGetProspectForAppointment = () => {
    return createSelector((state, appointmentId) => {
        const appointment = state.entities.appointment[appointmentId];
        if (appointment && appointment.prospect) {
            return state.entities.prospect[appointment.prospect];
        }
        return emptyOwner;
    }, (prospect) => prospect);
};

const makeGetOrganisationForAppointment = () => {
    return createSelector((state, appointmentId) => {
        const appointment = state.entities.appointment[appointmentId];
        if (appointment && appointment.organisation) {
            return state.entities.organisation[appointment.organisation];
        }
        return emptyOwner;
    }, (organisation) => organisation);
};

const makeGetContactForAppointment = () => {
    return createSelector((state, appointmentId) => {
        const appointment = state.entities.appointment[appointmentId];
        if (appointment && appointment.firstContact) {
            return state.entities.contact[appointment.firstContact];
        }
        return emptyOwner;
    }, (contact) => contact);
};

export const getEvents = createSelector(
    (state) => getOverview(state, OverviewTypes.Activity.Appointment).items,
    (state) => state.entities.appointment,
    (items, entities) => {
        return items.map((appointmentId) => {
            const appointment = entities[appointmentId] || {};
            return {
                id: appointment.uuid,
                title: appointment.title,
                start: appointment.startDate,
                end: appointment.endDate,
            };
        });
    }
);

export const makeGetAppointment = () => {
    const getOwner = makeGetOwnerForAppointment();
    const getContact = makeGetContactForAppointment();
    const getFocus = makeGetFocusForAppointment();
    const getProspect = makeGetProspectForAppointment();
    const getOrganisation = makeGetOrganisationForAppointment();
    return createSelector(
        getAppointment,
        getOwner,
        getFocus,
        getProspect,
        getOrganisation,
        getContact,
        (appointment, owner, focus, prospect, organisation, firstContact) => {
            if (!appointment) {
                return createAppointment();
            }
            return {
                ...createAppointment(),
                ...appointment,
                prospect,
                focus,
                owner,
                organisation,
                firstContact,
            };
        }
    );
};

export default makeGetAppointment;

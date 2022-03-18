// @flow
import { schema } from 'normalizr';
import { userSchema } from '../User/user.schema';
import { contactSchema } from '../Contact/contact.schema';
import { focusSchema } from '../Focus/focus.schema';
import { prospectSchema } from '../Prospect/prospect.schema';
import { organisationSchema } from '../Organisation/organisation.schema';
import type { AppointmentType, ApiAppointmentType } from './appointment.types';

const empty = {};

export const createAppointment = (appointment: ApiAppointmentType = empty): AppointmentType => {
  return {
    ...appointment,
    uuid: appointment.uuid,
    title: appointment.title,
    note: appointment.note,
    ownerId: appointment.ownerId,
    owner: appointment.owner || empty,
    ownerName: appointment.ownerName,
    focus: appointment.focusActivity || appointment.focusWorkData || empty,
    startDate: appointment.startDate ? new Date(appointment.startDate) : new Date(),
    endDate: appointment.endDate ? new Date(appointment.endDate) : new Date(),
    contacts: appointment.contactList || [],
    prospect: appointment.prospect || empty,
    organisation: appointment.organisation || empty,
    firstContact: (appointment.contactList && appointment.contactList[0]) || {},
    invitees: {
      emails: (appointment.inviteeList && appointment.inviteeList.communicationInviteeDTOList) || [],
      contacts: (appointment.inviteeList && appointment.inviteeList.contactInviteeDTOList) || [],
    },
  };
};

export const appointmentSchema = new schema.Entity(
  'appointment',
  {
    owner: userSchema,
    contacts: [contactSchema],
    focus: focusSchema,
    prospect: prospectSchema,
    organisation: organisationSchema,
    firstContact: contactSchema,
    invitees: {
      contacts: [contactSchema],
    },
  },
  {
    idAttribute: 'uuid',
    processStrategy: createAppointment,
  }
);

const appointmentArray = new schema.Array(appointmentSchema);

export const appointmentList = new schema.Object({
  appointmentDTOList: appointmentArray,
});

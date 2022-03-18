//@flow

export type ApiAppointmentType = {
  uuid?: string,
  title?: appointment.title,
  owner?: {},
  focusActivity?: {},
  focusWorkData?: {},
  startDate?: Date,
  endDate?: Date,
  contacts?: Array<{}>,
  prospect?: {},
  organisation?: {},
  inviteeList?: {
    communicationInviteeDTOList?: Array<{}>,
    contactInviteeDTOList?: Array<{}>,
  },
};

export type AppointmentType = {
  uuid?: string,
  title: appointment.title,
  owner: {},
  focus: {},
  startDate: Date,
  endDate: Date,
  contacts: Array<{}>,
  prospect: {},
  organisation: {},
  invitees: {
    emails: Array<{}>,
    contacts: Array<{}>,
  },
};


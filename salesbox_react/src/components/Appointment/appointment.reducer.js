// @flow
import createReducer, { createConsumeEntities } from 'store/createReducer';
import AuthActionTypes from 'components/Auth/auth.actions';
import { OverviewTypes } from 'Constants';
import OverviewActionTypes from 'components/Overview/overview.actions';
import AppointmentActionTypes from 'components/Appointment/appointment.actions';
import { APPOINTMENT_SUGGEST_ACTION_NAME } from '../../Constants';

export const initialState = {
  __DETAIL: {},
  __CREATE: {},
  __ERRORS: {},
  __EDIT: {},
  __REMAINDER: [],
  modalSuggestAppointmentFinish: {
    status: false,
    appointment: {},
    openFrom: null
  },
  currentSuggestAction: '',
  listAppointmentNotHandleToday: {
    status: false,
    listAppointment: [],
    isEndOfDay: false
  }
};

const consumeEntities = createConsumeEntities('appointment');

export default createReducer(initialState, {
  [AuthActionTypes.LOGOUT]: (draft) => {
    Object.keys(draft).forEach((id) => {
      if (id === 'modalSuggestAppointmentFinish' || id === 'listAppointmentNotHandleToday' || id === 'currentSuggestAction') {
        return false;
      }
      delete draft[id]
    });
  },
  [AppointmentActionTypes.EDIT_ENTITY]: (draft, { data }) => {
    const invitees = data.inviteeList || {};
    const emailList = [];
    (invitees.communicationInviteeDTOList ? invitees.communicationInviteeDTOList : []).map((e) => {
      if (e.value) emailList.push(e.value);
    });
    const contacts = [];
    (invitees.contactInviteeDTOList ? invitees.contactInviteeDTOList : []).map((e) => {
      if (e.uuid) contacts.push(e.uuid);
    });

    const contactList = [];
    (data.contactList ? data.contactList : []).map((c) => {
      contactList.push(c.uuid);
    });

    draft.__EDIT = {
      title: data.title,
      organisation: data.organisation ? data.organisation.uuid : null,
      contacts: contactList,
      prospect: {
        leadId: data.leadId,
        prospectId: data.prospect ? data.prospect.uuid : null,
      },
      focus: data.focusWorkData ? data.focusWorkData.uuid: null,
      location: data.location,
      startDate: data.startDate,
      endDate: data.endDate,
      owner: data.owner ? data.owner.uuid : null,
      note: data.note,
      invitees: [...contacts, ...emailList],
      emailList: emailList,
      uuid: data.uuid,
      externalKey: data.externalKey,
      externalKeyTempList: data.externalKeyTempList,
      googleEventId: data.googleEventId,
      office365EventId: data.office365EventId,
      outlookEventId: data.outlookEventId,
      teams: data.onlineMeeting ? 'teams' : null,
    };
  },
  [OverviewActionTypes.CREATE_ENTITY]: (draft, { overviewType, defaults }) => {
    if (overviewType === OverviewTypes.Activity.Appointment
    || overviewType === OverviewTypes.Account_Appointment
    || overviewType === OverviewTypes.Pipeline.Qualified_Appointment
    || overviewType === OverviewTypes.Contact_Appointment
    || overviewType === OverviewTypes.Pipeline.Lead_Appointment
          ) {
      draft.__CREATE = {
        ...defaults
      }
    }
  },
  [AppointmentActionTypes.FETCH_APPOINTMENT_SUCCESS]: (draft, { appointmentId, originalData }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL = originalData;
  },
  //FETCH_APPOINTMENT_SUCCESS
  [AppointmentActionTypes.UPDATE]: (draft, { appointmentId, updateData }) => {
    draft[appointmentId] = draft[appointmentId] || {};
    Object.keys(updateData).forEach((key) => {
      draft[appointmentId][key] = updateData[key];
    });
  },

  [AppointmentActionTypes.CHANGE_NOTE]: (draft, { appointmentId, note }) => {
    draft[appointmentId].note = note;
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL.note = note;
  },
  [AppointmentActionTypes.CREATE_REQUEST_SUCCESS]: (draft) => {
    draft.__CREATE = {};
  },
  [AppointmentActionTypes.SET_REMAINDER]: (draft, { remainders }) => {
    draft.__REMAINDER = remainders;
  },
  [AppointmentActionTypes.SET_MODAL_APPOINTMENT]: (draft, { status, appointment, openFrom }) => {
    draft.modalSuggestAppointmentFinish.status = status;
    draft.modalSuggestAppointmentFinish.openFrom = openFrom
    if(appointment) {
      draft.modalSuggestAppointmentFinish.appointment = appointment;
      draft.__DETAIL = appointment;
    }
  },
  [AppointmentActionTypes.SET_LIST_APPOINTMENT_NOT_HANDLE]: (draft, { status, listAppointment, isEndOfDay }) => {
    draft.listAppointmentNotHandleToday.status = status;
    draft.listAppointmentNotHandleToday.isEndOfDay = isEndOfDay
    if(listAppointment) {
      draft.listAppointmentNotHandleToday.listAppointment = listAppointment;
    }
  },
  [AppointmentActionTypes.SET_CURRENT_SUGGEST_ACTION] : (draft, { actionName, appointment }) => {
    draft.currentSuggestAction = actionName
    if(actionName === APPOINTMENT_SUGGEST_ACTION_NAME.ADD_MEETING) {
      if(appointment.contactList && appointment.contactList.length > 0) {
        let _contacts = []
        for(let i = 0; i < appointment.contactList.length; i++) {
          _contacts.push(appointment.contactList[i].uuid)
        }
        draft['__CREATE'].contacts = _contacts;
      }
      if(appointment.organisation && appointment.organisation.uuid) {
        draft['__CREATE'].organisation = appointment.organisation.uuid;
      }
      if(appointment.leadId) {
        draft['__CREATE'].leadId = appointment.leadId
      }
      if(appointment.prospect) {
        draft['__CREATE'].prospect = appointment.prospect
      }
      if(appointment.focusWorkData && appointment.focusWorkData.uuid) {
        draft['__CREATE']['focus']  = {
         uuid: appointment.focusWorkData.uuid
        }
      }
      if(appointment.note) {
        draft['__CREATE'].note = appointment.note
      }
      if(appointment.location) {
        draft['__CREATE'].location = appointment.location
      }
      //deal : prospect
      //focus : focusWorkData
      //location
    }
  },
  // [AppointmentActionTypes.EDIT_APPOINTMENT]: (draft, { appointmentId }) => {
  //   const invitees = draft[appointmentId].invitees || {};
  //   const emailList = [];
  //   (invitees.emails ? invitees.emails : []).map((e) => {
  //     if (e.value) emailList.push(e.value);
  //   });
  //   const contacts = invitees.contacts || [];
  //   draft.__EDIT = {
  //     ...draft[appointmentId],
  //     invitees: [...contacts, ...emailList],
  //     emailList: emailList,
  //   };
  // },
  [AppointmentActionTypes.UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_DEAL]: (draft, {qualifiedId,unqualifiedId,companyId,contactIds}) => {
    let prospect = {
      leadId: null,
        prospectId: null
    };
    if(qualifiedId!=null){
      prospect = {
        prospectId: qualifiedId
      };
    }else{
      prospect = {
        leadId: unqualifiedId
      };
    }
    if (draft.__CREATE && draft.__CREATE.organisation != null && draft.__CREATE.contacts != null
      && companyId == draft.__CREATE.organisation && contactIds != null) {
      let existContact = (draft.__CREATE.contacts || []).filter((v) => {
       return (contactIds).includes(v);
      });

      if (existContact.length > 0) {
        draft.__CREATE = {
          ...draft.__CREATE,
          prospect: prospect
        }
      }
    }
    if (draft.__EDIT.organisation != null && draft.__EDIT.contacts != null
      && companyId == draft.__EDIT.organisation && contactIds != null  ) {

      let existContact = draft.__EDIT.contacts.filter((v) => {
        return (contactIds).includes(v);
      });

      if (existContact.length > 0) {

        draft.__EDIT = {
          ...draft.__EDIT,
          prospect: prospect
        }
      }
    }
  },
  default: consumeEntities,
});

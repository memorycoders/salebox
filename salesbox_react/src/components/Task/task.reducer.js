// @flow
import createReducer, { createConsumeEntities } from 'store/createReducer';
import TaskActions from './task.actions';
import AuthActionTypes from 'components/Auth/auth.actions';
import { OverviewTypes, APPOINTMENT_SUGGEST_ACTION_NAME } from '../../Constants';
import OverviewActionTypes from 'components/Overview/overview.actions';
import ActionTypes from '../Appointment/appointment.actions'
export const initialState = {
  __CREATE: { type: 'MANUAL', uuid: null },
  __EDIT: {},
  __ERRORS: {},
  __DETAIL: {},
  currentSpecialTask: {
    status: false,
    type: '',
    title: '',
    options: [],
    taskId: ''
  }
};

const consumeEntities = createConsumeEntities('task');

export default createReducer(initialState, {
  [AuthActionTypes.LOGOUT]: (draft) => {
    Object.keys(draft).forEach((id) => {
      if (id === '__CREATE' || id === '__ERRORS' || id === '__EDIT') {
        return false;
      }
      delete draft[id];
    });
  },
  [TaskActions.CREATE_ENTITY]: (draft, { formKey, data }) => {
    draft[formKey] = {
      ...draft[formKey],
      ...data,
    };
  },
  [OverviewActionTypes.CREATE_ENTITY]: (draft, { overviewType, defaults }) => {
    if (overviewType === OverviewTypes.Activity.Task) {
      draft.__CREATE = {
        ...defaults,
        type: 'MANUAL',
        uuid: null
      };
    }
  },
  [TaskActions.CHANGE_NOTE]: (draft, { taskId, note }) => {
    draft[taskId].note = note;
  },

  [TaskActions.UPDATE_TASK_DETAIL]: (draft, { task }) => {
    draft.__DETAIL = task;
  },

  [TaskActions.AD_DQUANLIFI]: (draft, { taskId, prospect }) => {
    draft[taskId].prospect = prospect;
  },

  //AD_DQUANLIFI
  [TaskActions.UPDATE_TASK]: (draft, { taskId, updateData }) => {
    Object.keys(updateData).forEach((key) => {
      draft[taskId][key] = updateData[key];
    });
  },
  [TaskActions.CLEAR_CREATE_ENTITY]: (draft) => {
    draft.__CREATE = { ...initialState.__CREATE };
  },
  [TaskActions.UPDATE_EDIT_TASK]: (draft, { data }) => {
    const {
      categoryId,
      contactId,
      dateAndTime,
      focusActivity,
      focusWorkData,
      leadId,
      note,
      organisationId,
      ownerId,
      prospectId,
      tagDTO,
      type,
      uuid,
      organisationDTO,
      contactDTO,
    } = data || {};
    draft.__EDIT = {
      categoryId,
      contactId,
      dateAndTime,
      focusActivity,
      focusWorkData,
      leadId,
      note,
      organisationId,
      ownerId,
      prospectId,
      tagDTO,
      type,
      uuid,
      organisationDTO,
      contactDTO,
    };
  },
  [TaskActions.UPDATE_CREATE_TASK]: (draft, { data }) => {
    const {
      categoryId,
      contactId,
      dateAndTime,
      focusActivity,
      focusWorkData,
      leadId,
      note,
      organisationId,
      ownerId,
      prospectId,
      tagDTO,
      type,
      organisationDTO,
      contactDTO,
    } = data || {};
    draft.__CREATE = {
      categoryId,
      contactId,
      dateAndTime,
      focusActivity,
      focusWorkData,
      leadId,
      note,
      organisationId,
      ownerId,
      prospectId,
      tagDTO,
      type,
      organisationDTO,
      contactDTO,
    };
  },
  [TaskActions.CREATE_ERRORS_TASK]: (draft, { data }) => {
    draft.__ERRORS = {
      ...draft.__ERRORS,
      ...data,
    };
  },
  [TaskActions.CLEAR_TASK_ERRORS]: (draft) => {
    draft.__ERRORS = {};
  },
  [TaskActions.UPDATE_TASK_LEAD]: (draft, { leadId }) => {
    draft.__EDIT = { ...draft.__EDIT, leadId };
  },
  [TaskActions.UPDATE_CREATE_ENTITY]: (draft, { data, overviewType }) => {
    const { contactDTO, organisationId, organisationDTO, uuid, organisationName, sponsorList,organisation, contact, contactId, contactName} = data || {};
    let contactIdValue=contact!=null && contact.uuid!=null ? contact.uuid: contactId;
    contactIdValue = contactIdValue || (contactDTO != null ? contactDTO.uuid : (contact != null ? contact.uuid : null));
    const contactObject = contactDTO!=null ? contactDTO : contact;

    draft.__CREATE = {
      ...draft.__CREATE,
      // organisationId,
      organisationId: organisation!=null && organisation.uuid!=null ? organisation.uuid: organisationId,
      leadId: null,
      contactId: contactIdValue ,
      contactDTO: contactObject,
      organisationDTO: organisationDTO!=null? organisationDTO: organisation,
      prospectId: null,
      organisationName,
      contactName
    };
    if (overviewType === OverviewTypes.Pipeline.Qualified_Task || overviewType === OverviewTypes.Pipeline.Order_Task ||
      overviewType == OverviewTypes.Account_Qualified_Task ||
      overviewType == OverviewTypes.Account_Order_Task ||
      overviewType == OverviewTypes.Contact_Qualified_Task ||
      overviewType == OverviewTypes.Contact_Order_Task
    ){
      if (sponsorList && sponsorList.length > 0){
        draft.__CREATE.contactId = sponsorList[0].uuid;
        draft.__CREATE.contactDTO = sponsorList[0];
      }
      draft.__CREATE.prospectId = uuid;
    } else if (overviewType === OverviewTypes.Pipeline.Lead_Task){
      draft.__CREATE.leadId = uuid;
      if(contactDTO!=null){
        draft.__CREATE.contactDTO = contactObject;
        draft.__CREATE.contactId = contactObject.uuid;
        draft.__CREATE.contactName = contactObject.firstName +' ' + contactObject.lastName;
      }

    } else if (overviewType === OverviewTypes.Account_Task && organisation!=null) {
      draft.__CREATE.organisationDTO = organisation;
      draft.__CREATE.organisationId = organisation.uuid;
      draft.__CREATE.organisationName = organisation.name;
    } else if (overviewType === OverviewTypes.CallList.SubAccount && organisation!=null) {
      draft.__CREATE.organisationDTO = organisation;
      draft.__CREATE.organisationId = organisation.organisationId;
      draft.__CREATE.organisationName = organisation.name;
    } else if ( overviewType == OverviewTypes.CallList.SubContact && contact!=null) {
      draft.__CREATE.contactDTO = contact;
      draft.__CREATE.contactId = contact.contactId;
      draft.__CREATE.contactName = contact.name;
    }
  },
  [ActionTypes.SET_CURRENT_SUGGEST_ACTION] : (draft, { actionName, appointment }) => {
  if(actionName === APPOINTMENT_SUGGEST_ACTION_NAME.ADD_REMINDER) {
    if(appointment.firstContactId)
      draft['__CREATE'].contactId = appointment.firstContactId;
    if(appointment.organisation && appointment.organisation.uuid) {
      draft['__CREATE'].organisationId = appointment.organisation.uuid;
    }
    if(appointment.leadId) {
      draft['__CREATE'].leadId = appointment.leadId
    }
    if(appointment.prospect) {
      draft['__CREATE'].prospect = appointment.prospect
    }
    if(appointment.focusWorkData && appointment.focusWorkData.uuid) {
      draft['__CREATE']['focusWorkData']  = {
        uuid: appointment.focusWorkData.uuid
      } 
    }
    if(appointment.note) {
      draft['__CREATE'].note = appointment.note
    }
    //deal : prospect
    //focus : focusWorkData
    //location
  }    
  },
  [TaskActions.SET_CURRENT_SPECIAL_TASK]: (draft, {status, typeTask, title, taskId ,options}) => {
    draft.currentSpecialTask.status = status
    draft.currentSpecialTask.taskId = taskId
    if(typeTask)
      draft.currentSpecialTask.type = typeTask;
    if(title)
      draft.currentSpecialTask.title = title;
    if(options) 
      draft.currentSpecialTask.options = options
  },
  [TaskActions.FILL_FORM_CREATE_TASK]: (draft, {data}) => {
    draft.__CREATE = {
      ...draft.__CREATE,
      ...data
    }
  },
  [TaskActions.UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_DEAL]: (draft, {qualifiedId,unqualifiedId,companyId,contactIds}) => {
    if (draft.__CREATE.organisationId != null && draft.__CREATE.contactId != null
      && companyId == draft.__CREATE.organisationId && contactIds != null && contactIds.includes(draft.__CREATE.contactId)) {
      draft.__CREATE = {
        ...draft.__CREATE,
        leadId: unqualifiedId,
        prospectId: qualifiedId
      }
    }
    if (draft.__EDIT.organisationId != null && draft.__EDIT.contactId != null
      && companyId == draft.__EDIT.organisationId && contactIds != null && contactIds.includes(draft.__EDIT.contactId)) {
      draft.__EDIT = {
        ...draft.__EDIT,
        leadId: unqualifiedId,
        prospectId: qualifiedId
      }
    }
  },
  [TaskActions.UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_CONTACT]:(draft, {companyId,contactId})=>{
    if(draft.__CREATE.organisationId == null && companyId!=null ){
      draft.__CREATE = {
        ...draft.__CREATE,
        organisationId: companyId
      }
    }
    if(draft.__EDIT.organisationId == null && companyId!=null ){
      draft.__EDIT = {
        ...draft.__EDIT,
        organisationId: companyId
      }
    }

    if (draft.__CREATE.organisationId != null
      && companyId == draft.__CREATE.organisationId && contactId != null) {
      draft.__CREATE = {
        ...draft.__CREATE,
        contactId: contactId,
        leadId: contactId != draft.__CREATE.contactId ? null: draft.__CREATE.leadId,
        prospectId: contactId != draft.__CREATE.contactId ? null: draft.__CREATE.prospectId,
      }
    }
    if (draft.__EDIT.organisationId != null
      && companyId == draft.__EDIT.organisationId &&  contactId != null) {
      draft.__EDIT = {
        ...draft.__EDIT,
        contactId: contactId,
        leadId: contactId != draft.__EDIT.contactId ? null: draft.__EDIT.leadId,
        prospectId: contactId != draft.__EDIT.contactId ? null: draft.__EDIT.prospectId,
      }
    }
  },
  [TaskActions.UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_COMPANY]:(draft, {companyId})=> {
    if (companyId != null) {
      draft.__CREATE = {
        ...draft.__CREATE,
        organisationId: companyId,
        contactId:null,
        leadId:null,
        prospectId:null,

      }
    }
    if (companyId != null) {
      draft.__EDIT = {
        ...draft.__EDIT,
        organisationId: companyId,
        contactId:null,
        leadId:null,
        prospectId:null,
      }
    }
  },
  default: consumeEntities,
});

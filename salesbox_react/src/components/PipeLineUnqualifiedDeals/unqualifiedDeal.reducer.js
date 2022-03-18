// @flow
import createReducer, { createConsumeEntities } from 'store/createReducer';
import CustomFieldActionTypes from 'components/CustomField/custom-field.actions';
import MultiRelationActionTypes from 'components/MultiRelation/multi-relation.actions';
import OverviewActionTypes from 'components/Overview/overview.actions';
import { OverviewTypes, ObjectTypes } from 'Constants';
import AuthActionTypes from 'components/Auth/auth.actions';
import UnqualifiedActionTypes from './unqualifiedDeal.actions';
import {default as AppointmentType} from './../Appointment/appointment.actions'
import { APPOINTMENT_SUGGEST_ACTION_NAME } from '../../Constants';
import ActionTypes from "../PipeLineQualifiedDeals/qualifiedDeal.actions";

export const initialState = {
  __CREATE: { type: 'MANUAL', status: 'unqualified' },
  __EDIT: { status: 'unqualified' },
  __ERRORS: {},
  __DETAIL: {}
};

const consumeEntities = createConsumeEntities('unqualifiedDeal');

export default createReducer(initialState, {
  default: consumeEntities,

  [AuthActionTypes.LOGOUT]: (draft) => {
    Object.keys(draft).forEach((id) => delete draft[id]);
  },
  [OverviewActionTypes.EDIT_ENTITY]: (draft, { overviewType, itemId }) => {
    if (overviewType === OverviewTypes.Pipeline.Lead) {
      draft.__EDIT = {
        ...draft[itemId],
      };
    }
  },

  [OverviewActionTypes.FETCH_UNQUALIFIED_DETAIL_SUCCESS]: (draft, { unqualifiedDealId, data }) => {
    if (!draft){
      draft = initialState;
    }
    draft[unqualifiedDealId] = data;
  },

  [OverviewActionTypes.CREATE_ENTITY]: (draft, { overviewType, defaults }) => {
    if (overviewType === OverviewTypes.Pipeline.Lead) {
      draft.__CREATE = {
        ...defaults,
      };
    }
  },
  [UnqualifiedActionTypes.FETCH_ORGANISATION_DROPDOWN]: (draft, { organisationId, entities }) => {
    const unqualifiedDeals = entities.unqualifiedDeal;
    if (unqualifiedDeals) {
      Object.keys(unqualifiedDeals).forEach((unqualifiedDealId) => {
        unqualifiedDeals[unqualifiedDealId]._organisationId = organisationId;
      });
      consumeEntities(draft, { entities: { unqualifiedDeal: unqualifiedDeals } });
    }
  },
  [CustomFieldActionTypes.FETCH_SUCCESS]: (draft, { entities, objectId, objectType }) => {
    if (objectType === ObjectTypes.PipelineLead && entities.customField) {
      draft[objectId] = draft[objectId] || {};
      draft[objectId].customFields = Object.keys(entities.customField);
    }
  },
  [UnqualifiedActionTypes.FETCH_COLLEAGUE_SUCCESS]: (draft, { unqualifiedDealId, entities }) => {
    draft[unqualifiedDealId] = draft[unqualifiedDealId] || {};
    draft[unqualifiedDealId].colleagues = Object.keys(entities.unqualifiedDeal).filter((colleagueId) => colleagueId !== unqualifiedDealId);
  },
  [MultiRelationActionTypes.FETCH_SUCCESS]: (draft, { entities, objectId, objectType }) => {
    if (objectType === ObjectTypes.PipelineLead && entities.multiRelation) {
      draft[objectId] = draft[objectId] || {};
      draft[objectId].multiRelations = Object.keys(entities.multiRelation);
    }
  },
  [UnqualifiedActionTypes.CREATE_ENTITY_UNQUALIFIED]: (draft, { formKey, data }) => {
    draft[formKey] = {
      ...draft[formKey],
      ...data,
    };
  },
  [UnqualifiedActionTypes.CREATE_ERRORS_UNQUALIFIED]: (draft, { data }) => {
    draft.__ERRORS = {
      ...draft.__ERRORS,
      ...data,
    };
  },
  [UnqualifiedActionTypes.CLEAR_CREATE_ENTITY]: (draft) => {
    draft.__CREATE = { ...initialState.__CREATE };
  },
  [UnqualifiedActionTypes.UPDATE_UNQUALIFIED]: (draft, { uuid, updateData }) => {
    Object.keys(updateData).forEach((key) => {
      draft[uuid][key] = updateData[key];
    });
  },
  [UnqualifiedActionTypes.CLEAR_ERRORS_UNQUALIFIED]: (draft) => {
    draft.__ERRORS = {};
  },
  [UnqualifiedActionTypes.UPDATE_EDIT_UNQUALIFIED]: (draft, { data }) => {
    const {
      organisationId,
      contactId,
      lineOfBusiness,
      productList,
      priority,
      deadlineDate,
      note,
      status,
      ownerId,
      uuid,
      organisation,
      contact,
    } = data || {};
    draft.__EDIT = {
      organisationId,
      contactId,
      lineOfBusiness: lineOfBusiness && lineOfBusiness.uuid ? lineOfBusiness : null,
      productList: productList && productList.length > 0 ? productList : null,
      priority,
      deadlineDate,
      note,
      status,
      ownerId,
      uuid,
      organisation,
      contact,
    };
  },

  [UnqualifiedActionTypes.FETCH_TASKS_SUCCESS]: (draft, { unqualifiedDealId, entities }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft[unqualifiedDealId] = draft[unqualifiedDealId] || {};
    draft[unqualifiedDealId].tasks = entities.task ? Object.keys(entities.task) : null
    draft.__DETAIL.tasks = entities.task ? Object.keys(entities.task) : null
  },

  [UnqualifiedActionTypes.FETCH_NOTES_SUCCESS]: (draft, { unqualifiedDealId, notes }) => {
    draft[unqualifiedDealId] = draft[unqualifiedDealId] || {};
    draft[unqualifiedDealId].notes = notes;
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL = {
      ...draft.__DETAIL,
      notes: notes
    }
  },
  //FETCH_APPOINTMENTS_SUCCESS
  [UnqualifiedActionTypes.FETCH_APPOINTMENTS_SUCCESS]: (draft, { unqualifiedDealId, appointments }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft[unqualifiedDealId] = draft[unqualifiedDealId] || {};
    draft[unqualifiedDealId].appointments = appointments;
    draft.__DETAIL = {
      ...draft.__DETAIL,
      appointments: appointments
    }
  },

  [UnqualifiedActionTypes.FETCH_SUCCESS]: (draft, { unqualifiedDealId, unqualified }) => {
    // if (!draft[unqualifiedDealId]){
    //   draft[unqualifiedDealId] = unqualified;
    // }
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL = {
      ...unqualified,
      // tasks: null
    };
  },

  [UnqualifiedActionTypes.START_FETCH_DETAIL]: (draft) => {
    draft.__DETAIL = {};
  },
  [UnqualifiedActionTypes.SUCCESS_FETCH_DETAIL]: (draft) => {

  },
  [UnqualifiedActionTypes.CLEAR_UPDATE_ENTITY]: (draft) => {
    draft.__EDIT = { status: 'unqualified' };
  },
  [AppointmentType.SET_CURRENT_SUGGEST_ACTION] : (draft, { actionName, appointment }) => {
    if(actionName === APPOINTMENT_SUGGEST_ACTION_NAME.ADD_PROSPECT) {
      if(appointment.firstContactId)
        draft['__CREATE'].contactId = appointment.firstContactId;
      if(appointment.organisation && appointment.organisation.uuid) {
        draft['__CREATE'].organisationId = appointment.organisation.uuid;
      }
      // if(appointment.focusWorkData && appointment.focusWorkData.uuid) {
      //   draft['__CREATE']['focusWorkData']  = {
      //     uuid: appointment.focusWorkData.uuid
      //   }
      // }
      if(appointment.note) {
        draft['__CREATE'].note = appointment.note
      }
      //deal : prospect
      //focus : focusWorkData
      //location
    }
  },
  [UnqualifiedActionTypes.UPDATE_CREATE_ENTITY]: (draft, { data, overviewType }) => {
    const { contactId, organisationId, organisationDTO, uuid, organisationName, sponsorList,organisation } = data || {};

    draft.__CREATE = {
      ...draft.__CREATE,
      // organisationId,
      organisationId: organisation!=null && organisation.uuid!=null ? organisation.uuid: organisationId,
      // leadId: null,
      contactId,
      // contactDTO,
      // organisationDTO: organisationDTO!=null? organisationDTO: organisation,
      // prospectId: null,
      // organisationName
    };
  },
  [ActionTypes.UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_CONTACT]:(draft, {companyId,contactId})=>{
    if(draft.__CREATE?.organisationId == null && companyId!=null ){
      draft.__CREATE = {
        ...draft.__CREATE,
        organisationId:companyId
      }
    }
    if(draft.__EDIT?.organisationId == null && companyId!=null ){
      draft.__EDIT = {
        ...draft.__EDIT,
        organisationId:companyId
      }
    }

    if (draft.__CREATE?.organisationId != null
      && companyId == draft.__CREATE.organisationId && contactId != null) {
      draft.__CREATE = {
        ...draft.__CREATE,
        contactId: contactId,
      }
    }
    if (draft.__EDIT?.organisationId != null
      && companyId == draft.__EDIT.organisationId &&  contactId != null) {
      draft.__EDIT = {
        ...draft.__EDIT,
        contactId: contactId,
      }
    }
  },
  [ActionTypes.UPDATE_CREATE_EDIT_ENTITY_AFTER_ADD_COMPANY]:(draft, {companyId})=> {
    if( companyId!=null ){
      draft.__CREATE = {
        ...draft.__CREATE,
        organisationId:companyId,
        contactId:null
      }
    }
    if(companyId!=null ){
      draft.__EDIT = {
        ...draft.__EDIT,
        organisationId:companyId,
        contactId:null
      }
    }

  },
});

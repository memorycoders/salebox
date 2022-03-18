// @flow
import createReducer, { createConsumeEntities } from 'store/createReducer';
import CustomFieldActionTypes from 'components/CustomField/custom-field.actions';
import MultiRelationActionTypes from 'components/MultiRelation/multi-relation.actions';
import OverviewActionTypes from 'components/Overview/overview.actions';
import uuid from 'uuid/v4';
import { OverviewTypes, PhoneTypes, EmailTypes, ObjectTypes } from 'Constants';
import AuthActionTypes from 'components/Auth/auth.actions';
import ContactActionTypes from './contact.actions';

export const initialState = {
  __CREATE: {},
  __EDIT: {},
  __DETAIL: {},
  __DETAIL_TO_EDIT: {},
  __UPLOAD: {
    imageCropScale: 1.2,
    cropEnabled: false,
    fileFakePath: '',
    fileData: null,
    dataURL: null,
  },
  __ERRORS: {},
  statusMsTeams: {
    status: null,
    msTeamsId: '',
  },
  showListChannelMsTeams: false,
  showInviteToTeam: false,
};

const consumeEntities = createConsumeEntities('contact');

export default createReducer(initialState, {
  default: consumeEntities,
  [AuthActionTypes.LOGOUT]: (draft) => {
    Object.keys(draft).forEach((id) => {
      if (
        id === '__CREATE' ||
        id === '__ERRORS' ||
        id === '__UPLOAD' ||
        id === '__EDIT' ||
        id === 'statusMsTeams' ||
        id === 'showListChannelMsTeams'
      ) {
        return false;
      }
      delete draft[id];
    });
  },
  [ContactActionTypes.EDIT_ENTITY]: (draft, { overviewType, contact }) => {
    const participants = [];
    (contact.participantList ? contact.participantList : []).map((v) => {
      participants.push(v.uuid);
    });
    draft.__EDIT = {
      ...contact,
      industry: (contact.industry && contact.industry.uuid) || null,
      size: (contact.size && contact.size.uuid) || null,
      type: (contact.type && contact.type.uuid) || null,
      relation: contact.relation && contact.relation.uuid,
      participants,
    };
  },
  [OverviewActionTypes.CREATE_ENTITY]: (draft, { overviewType, defaults }) => {
    if (overviewType === OverviewTypes.Contact) {
      draft.__CREATE = {
        ...defaults,
      };
    }
  },
  [ContactActionTypes.FETCH_ORGANISATION_DROPDOWN]: (draft, { organisationId, entities }) => {
    const contacts = entities.contact;
    if (contacts) {
      Object.keys(contacts).forEach((contactId) => {
        contacts[contactId]._organisationId = organisationId;
      });
      consumeEntities(draft, { entities: { contact: contacts } });
    }
  },

  // Card: Custom Fields
  [CustomFieldActionTypes.FETCH_SUCCESS]: (draft, { entities, objectId, objectType }) => {
    if (objectType === ObjectTypes.Contact && entities && entities.customField) {
      draft[objectId] = draft[objectId] || {};
      draft[objectId].customFields = Object.keys(entities.customField);
    }
  },

  // Card: Tasks
  [ContactActionTypes.FETCH_TASKS_SUCCESS]: (draft, { contactId, entities }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL.tasks = entities.task ? Object.keys(entities.task) : null;
    draft[contactId] = draft[contactId] || {};
    draft[contactId].tasks = entities.task ? Object.keys(entities.task) : null;
  },

  [ContactActionTypes.FETCH_APPOINTMENT_SUCCESS]: (draft, { contactId, data }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL.appointments = data;
    draft[contactId] = draft[contactId] || {};
    draft[contactId].appointments = data;
  },
  [ContactActionTypes.FETCH_NOTES_SUCCESS]: (draft, { contactId, data }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL.notes = data;
    draft[contactId] = draft[contactId] || {};
    draft[contactId].notes = data;
  },
  //FETCH_NOTES_SUCCESS

  //FETCH_PHOTOS_SUCCESS
  [ContactActionTypes.FETCH_PHOTOS_SUCCESS]: (draft, { contactId, data }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL.photos = data;
    draft[contactId] = draft[contactId] || {};
    draft[contactId].photos = data;
  },
  [ContactActionTypes.REFESH_DESCRIPTION_PHOTO]: (draft, { description, photoId }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    if (draft.__DETAIL.uuid) {
      const uuid = draft.__DETAIL.uuid;
      draft[uuid] = draft[uuid] || {
        photos: [],
      };
      draft[uuid].photos = draft[uuid].photos.map((photo) => {
        if (photo.uuid === photoId) {
          return {
            ...photo,
            description,
          };
        }
        return photo;
      });
      draft.__DETAIL.photos = draft.__DETAIL.photos.map((photo) => {
        if (photo.uuid === photoId) {
          return {
            ...photo,
            description,
          };
        }
        return photo;
      });
    }
  },
  //FETCH_UNQUALIFIED_SUCCESS
  [ContactActionTypes.FETCH_UNQUALIFIED_SUCCESS]: (draft, { contactId, data }) => {
    const dataShow = data.filter((value) => !value.finished);
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL.unQualifieds = dataShow;
    draft[contactId] = draft[contactId] || {};
    draft[contactId].unQualifieds = dataShow;
  },

  //FETCH_QUALIFIED_SUCCESS
  [ContactActionTypes.FETCH_QUALIFIED_SUCCESS]: (draft, { contactId, data }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL.qualifieds = data;
    draft[contactId] = draft[contactId] || {};
    draft[contactId].qualifieds = data;
  },

  [ContactActionTypes.FETCH_CONTACT_FAIL]: (draft, { contactId }) => {
    draft.__DETAIL = {};
    // draft[contactId] && delete draft[contactId]
    if (draft[contactId]) {
      draft[contactId].displayName = null;
      draft[contactId].email = null;
      draft[contactId].firstName = null;
      draft[contactId].lastName = null;
      draft[contactId].phone = null;
    }
  },

  //FETCH_ORDER_SUCCESS
  [ContactActionTypes.FETCH_ORDER_SUCCESS]: (draft, { contactId, data, orderRows, totalOrderRow }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL.orders = data;
    draft.__DETAIL.orderRows = orderRows;
    draft.__DETAIL.totalOrderRow = totalOrderRow;
    draft[contactId] = draft[contactId] || {};
    draft[contactId].orders = data;
    draft[contactId].orderRows = orderRows;
    draft[contactId].totalOrderRow = totalOrderRow;
  },
  [ContactActionTypes.LOAD_MORE_ORDER_ROWS_SUCCESS]: (draft, { contactId, orderRows }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL.orderRows = draft.__DETAIL.orderRows.concat(orderRows);
    draft[contactId] = draft[contactId] || {};
    draft[contactId].orderRows = draft.__DETAIL.orderRows.concat(orderRows);
  },

  // Card: Colleagues
  [ContactActionTypes.FETCH_COLLEAGUE_SUCCESS]: (draft, { contactId, entities, pageIndex }) => {
    draft[contactId] = draft[contactId] || {};
    if (pageIndex === 0 || pageIndex == null) {
      draft[contactId].colleagues = Object.keys(entities.contact).filter((colleagueId) => colleagueId !== contactId);

      draft.__DETAIL = draft.__DETAIL || {};
      draft.__DETAIL.colleagues = entities.contact
        ? Object.keys(entities.contact).filter((colleagueId) => colleagueId !== contactId)
        : null;
    } else if (entities.contact != null) {
      draft[contactId].colleagues = draft[contactId].colleagues.concat(Object.keys(entities.contact));
      draft.__DETAIL.colleagues = draft.__DETAIL.colleagues.concat(
        Object.keys(entities.contact).filter((colleagueId) => colleagueId !== contactId)
      );
    }
  },

  // Card: Others
  [ContactActionTypes.FETCH_CONTACT_SUCCESS]: (draft, { contactId, entities, originalData }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL = originalData;
  },
  [ContactActionTypes.FETCH_CONTACT_TO_EDIT_SUCCESS]: (draft, { contactId, entities, originalData }) => {
    draft.__DETAIL_TO_EDIT = draft.__DETAIL_TO_EDIT || {};
    draft.__DETAIL_TO_EDIT = originalData;
  },
  [ContactActionTypes.CLEAR_CONTACT_DETAIL_TO_EDIT]: (draft) => {
    draft.__DETAIL_TO_EDIT = {};
  },
  // Card: Relation
  [MultiRelationActionTypes.FETCH_SUCCESS]: (draft, { entities, objectId, objectType }) => {
    if (objectType === ObjectTypes.Contact && entities && entities.multiRelation) {
      draft[objectId] = draft[objectId] || {};
      draft[objectId].multiRelations = Object.keys(entities.multiRelation);
    }
  },

  // Edit
  [ContactActionTypes.UPDATE]: (draft, { contactId, updateData }) => {
    draft[contactId] = draft[contactId] || {};
    Object.keys(updateData).forEach((key) => {
      draft[contactId][key] = updateData[key];

      // Auto filling on detailed address.
      // TODO: Get detailed organisation here by selector
      // if (updateData == 'organisation') {

      // }
    });
  },
  [ContactActionTypes.ADD_PHONE]: (draft, { contactId, dial }) => {
    draft[contactId] = draft[contactId] || {};
    draft[contactId].additionalPhoneList = draft[contactId].additionalPhoneList || [];
    draft[contactId].additionalPhoneList.push({
      main: draft[contactId].additionalPhoneList.length === 0,
      value: dial ? `+${dial}` : '',
      uuid: draft[contactId].additionalPhoneList.length,
      type: PhoneTypes.Work,
    });
  },
  [ContactActionTypes.REMOVE_PHONE]: (draft, { contactId, phoneId }) => {
    let wasMain;
    draft[contactId].additionalPhoneList = draft[contactId].additionalPhoneList.filter((phone) => {
      if (phone.main) wasMain = true;
      return phone.uuid !== phoneId;
    });
    if (wasMain && draft[contactId].additionalPhoneList[0]) {
      draft[contactId].additionalPhoneList[0].main = true;
    }
  },
  [ContactActionTypes.MAKE_PHONE_MAIN]: (draft, { contactId, phoneId }) => {
    draft[contactId].additionalPhoneList = draft[contactId].additionalPhoneList.map((phone) => {
      if (phone.uuid === phoneId) {
        return {
          ...phone,
          main: true,
        };
      } else if (phone.main) {
        return {
          ...phone,
          main: false,
        };
      }
      return phone;
    });
  },
  [ContactActionTypes.UPDATE_PHONE]: (draft, { contactId, phoneId, values }) => {
    draft[contactId].additionalPhoneList = draft[contactId].additionalPhoneList.map((phone) => {
      if (phone.uuid === phoneId) {
        return {
          ...phone,
          ...values,
        };
      }
      return phone;
    });
  },
  [ContactActionTypes.ADD_EMAIL]: (draft, { contactId }) => {
    draft[contactId] = draft[contactId] || {};
    draft[contactId].additionalEmailList = draft[contactId].additionalEmailList || [];
    draft[contactId].additionalEmailList.push({
      main: draft[contactId].additionalEmailList.length === 0,
      value: '',
      uuid: draft[contactId].additionalEmailList.length,
      type: EmailTypes.Work,
    });
  },
  [ContactActionTypes.REMOVE_EMAIL]: (draft, { contactId, emailId }) => {
    let wasMain;
    draft[contactId].additionalEmailList = draft[contactId].additionalEmailList.filter((email) => {
      if (email.main) wasMain = true;
      return email.uuid !== emailId;
    });
    if (wasMain && draft[contactId].additionalEmailList[0]) {
      draft[contactId].additionalEmailList[0].main = true;
    }
  },
  [ContactActionTypes.MAKE_EMAIL_MAIN]: (draft, { contactId, emailId }) => {
    draft[contactId].additionalEmailList = draft[contactId].additionalEmailList.map((email) => {
      if (email.uuid === emailId) {
        return {
          ...email,
          main: true,
        };
      } else if (email.main) {
        return {
          ...email,
          main: false,
        };
      }
      return email;
    });
  },
  [ContactActionTypes.UPDATE_EMAIL]: (draft, { contactId, emailId, values }) => {
    draft[contactId].additionalEmailList = draft[contactId].additionalEmailList.map((email) => {
      if (email.uuid === emailId) {
        return {
          ...email,
          ...values,
        };
      }
      return email;
    });
  },

  //REMOVE_CALL_LIST_IN_ACCOUNT_SUCCESS
  [ContactActionTypes.REMOVE_CALL_LIST_IN_CONTACT_SUCCESS]: (draft, { contactId, callListContactId }) => {
    draft[contactId] = draft[contactId] || {};
    draft.__DETAIL = draft.__DETAIL || {};

    draft.__DETAIL.callListContactDTOs = (draft.__DETAIL.callListContactDTOs
      ? draft.__DETAIL.callListContactDTOs
      : []
    ).filter((value) => value.uuid !== callListContactId);
  },
  [ContactActionTypes.UPDATE_CALL_LIST_IN_CONTACT]: (draft, { callListContact }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL.callListContactDTOs = draft.__DETAIL.callListContactDTOs ? draft.__DETAIL.callListContactDTOs : [];
    if (!draft.__DETAIL.callListContactDTOs.find((e) => e.uuid === callListContact.uuid)) {
      draft.__DETAIL.callListContactDTOs.push({ name: callListContact.name, uuid: callListContact.uuid });
    }
  },
  //FETCH_UNQUALIFIED_SUCCESS
  [ContactActionTypes.FETCH_UNQUALIFIED_SUCCESS]: (draft, { contactId, data }) => {
    const dataShow = data.filter((value) => !value.finished);
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL.unQualifieds = dataShow;
    draft[contactId] = draft[contactId] || {};
    draft[contactId].unQualifieds = dataShow;
  },

  //FETCH_QUALIFIED_SUCCESS
  [ContactActionTypes.FETCH_QUALIFIED_SUCCESS]: (draft, { contactId, data }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL.qualifieds = data;
    draft[contactId] = draft[contactId] || {};
    draft[contactId].qualifieds = data;
  },
  //Avatar upload
  [ContactActionTypes.IMAGE_ON_CROP_ENABLED]: (draft, action) => {
    draft.__UPLOAD.cropEnabled = true;
    draft.__UPLOAD.fileFakePath = action.fakePath;
    draft.__UPLOAD.fileData = action.fileData;
  },
  [ContactActionTypes.IMAGE_CANCEL_UPLOAD_CROP]: (draft) => {
    draft.__UPLOAD.cropEnabled = false;
    draft.__UPLOAD.fileFakePath = '';
    draft.__UPLOAD.fileData = null;
    draft.__UPLOAD.imageData = null;
    draft.__UPLOAD.dataURL = null;
  },
  [ContactActionTypes.IMAGE_ON_CROP_CHANGE]: (draft, action) => {
    draft.__UPLOAD.dataURL = action.imageData;
  },
  [ContactActionTypes.IMAGE_SAVE_UPLOAD_CROP]: (draft, action) => {
    draft.__UPLOAD.dataURL = action.imageData;
    draft.__UPLOAD.cropEnabled = false;
  },
  [ContactActionTypes.UPDATE_ERRORS]: (draft, { updateData }) => {
    Object.keys(updateData).forEach((key) => {
      draft.__ERRORS[key] = updateData[key];
    });
  },
  [ContactActionTypes.CREATE_SUCCESS]: (draft, {}) => {
    // draft["__CREATE"] = emptyOrganisation;
    draft.__CREATE = {};
    draft.__UPLOAD = {
      imageCropScale: 1.2,
      cropEnabled: false,
      fileFakePath: '',
      fileData: null,
      dataURL: null,
    };
    draft.__ERRORS = {};
  },
  [ContactActionTypes.CREATE_ENTITY]: (draft, { contact }) => {
    draft.__CREATE = { ...contact };
  },

  //FILTER_LASTEST_COMMUNICATION_SUCCESS
  [ContactActionTypes.FILTER_LASTEST_COMMUNICATION_SUCCESS]: (draft, { data, pageIndex }) => {
    const { latestCommunicationHistoryDTOList, total } = data;
    draft.__DETAIL = draft.__DETAIL || { latestCommunicationHistoryDTOList: [] };
    draft.__DETAIL.totalCommunicationHistory = total;
    if (pageIndex === 0) {
      draft.__DETAIL.latestCommunicationHistoryDTOList = latestCommunicationHistoryDTOList;
    } else {
      draft.__DETAIL.latestCommunicationHistoryDTOList = draft.__DETAIL.latestCommunicationHistoryDTOList.concat(
        latestCommunicationHistoryDTOList
      );
    }
  },
  //REFESH_LASTEST_COMMUNICATION
  [ContactActionTypes.REFESH_LASTEST_COMMUNICATION]: (draft, { communicationId }) => {
    draft.__DETAIL = draft.__DETAIL || { latestCommunicationHistoryDTOList: [], totalCommunicationHistory: 0 };
    draft.__DETAIL.totalCommunicationHistory = draft.__DETAIL.totalCommunicationHistory - 1;
    draft.__DETAIL.latestCommunicationHistoryDTOList = draft.__DETAIL.latestCommunicationHistoryDTOList.filter(
      (value) => value.uuid !== communicationId
    );
  },
  [ContactActionTypes.SORT_UNQUALIFIED_DEAL_SUBLIST]: (draft, { orderBy }) => {
    if (draft.__DETAIL && draft.__DETAIL.unQualifieds)
      draft.__DETAIL.unQualifieds.sort(function(a, b) {
        if (orderBy === 'dateAndTime') {
          return b.deadlineDate - a.deadlineDate;
        }
        if (orderBy === 'accountContact') {
          let nameA = a.contactFirstName.toUpperCase();
          let nameB = b.contactFirstName.toUpperCase();
          if (nameA < nameB) {
            return 1;
          }
          if (nameA > nameB) {
            return -1;
          }
          return 0;
        }
        if (orderBy === 'owner') {
          let nameA = a.ownerFirstName && a.ownerFirstName.toUpperCase();
          let nameB = b.ownerFirstName && b.ownerFirstName.toUpperCase();
          if (nameA < nameB) {
            return 1;
          }
          if (nameA > nameB) {
            return -1;
          }
          return 0;
        }
        if (orderBy === 'description') {
          let nameA = a.lineOfBusiness ? a.lineOfBusiness.name.toUpperCase() : '';
          let nameB = b.lineOfBusiness ? b.lineOfBusiness.name.toUpperCase() : '';
          if (nameA < nameB) {
            return 1;
          }
          if (nameA > nameB) {
            return -1;
          }
          return 0;
        }
      });
  },
  [ContactActionTypes.SORT_QUALIFIED_DEAL_SUBLIST]: (draft, { orderBy }) => {
    if (draft.__DETAIL && draft.__DETAIL.qualifieds)
      draft.__DETAIL.qualifieds.sort(function(a, b) {
        if (orderBy === 'dateAndTime') {
          return b.contractDate - a.contractDate;
        }
        if (orderBy === 'value') {
          return b.grossValue - a.grossValue;
        }
        if (orderBy === 'owner') {
          let nameA = a.ownerName ? a.ownerName.toUpperCase() : '';
          let nameB = b.ownerName ? b.ownerName.toUpperCase() : '';
          if (nameA < nameB) {
            return 1;
          }
          if (nameA > nameB) {
            return -1;
          }
          return 0;
        }
        if (orderBy === 'description') {
          let nameA = a.description ? a.description.toUpperCase() : '';
          let nameB = b.description ? b.description.toUpperCase() : '';
          if (nameA < nameB) {
            return 1;
          }
          if (nameA > nameB) {
            return -1;
          }
          return 0;
        }
      });
  },
  [ContactActionTypes.SORT_ORDER_SUBLIST]: (draft, { uuid, orderBy }) => {
    if (draft[uuid] && draft[uuid].orders)
      draft[uuid].orders.sort(function(a, b) {
        if (orderBy === 'dateAndTime') {
          return b.wonLostDate - a.wonLostDate;
        }
        if (orderBy === 'value') {
          return b.grossValue - a.grossValue;
        }
        if (orderBy === 'owner') {
          let nameA = a.ownerName ? a.ownerName.toUpperCase() : '';
          let nameB = b.ownerName ? b.ownerName.toUpperCase() : '';
          if (nameA < nameB) {
            return 1;
          }
          if (nameA > nameB) {
            return -1;
          }
          return 0;
        }
        if (orderBy === 'description') {
          let nameA = a.description ? a.description.toUpperCase() : '';
          let nameB = b.description ? b.description.toUpperCase() : '';
          if (nameA < nameB) {
            return 1;
          }
          if (nameA > nameB) {
            return -1;
          }
          return 0;
        }
      });
  },
  [ContactActionTypes.FILTER_SUBLIST_ORDER_IN_CONTACT]: (draft, { uuid, filterValue }) => {
    if (filterValue === 'WON') {
      draft[uuid].orders = draft.__DETAIL.orders.filter((e) => e.won === true);
    } else if (filterValue === 'LOSS') {
      draft[uuid].orders = draft.__DETAIL.orders.filter((e) => e.won === false);
    } else {
      draft[uuid].orders = draft.__DETAIL.orders;
    }
  },
  [ContactActionTypes.SET_STATUS_MS_TEAMS_OF_CONTACT]: (draft, { status, msTeamsId }) => {
    if (draft.statusMsTeams) {
      draft.statusMsTeams.status = status;
      draft.statusMsTeams.msTeamsId = msTeamsId;
    }
  },
  [ContactActionTypes.SHOW_LIST_CHANNEL_MS_TEAM]: (draft, { status }) => {
    draft.showListChannelMsTeams = !draft.showListChannelMsTeams;
  },
  [ContactActionTypes.SHOW_INVITE_TO_TEAM]: (draft) => {
    draft.showInviteToTeam = !draft.showInviteToTeam;
  },
  [ContactActionTypes.NOT_ALLOW_SHOW_INVITE_TO_TEAM]: (draft) => {
    draft.showInviteToTeam = false;
  },
  [ContactActionTypes.ADD_LATEST_COMMUNICATION_LOG]: (draft, { contactId, data }) => {
    if (draft[contactId]) {
      draft[contactId] = {
        ...draft[contactId],
        communicationHistoryLatest: {
          chStartDate: data.startDate,
          chType: 8,
          chTypeName: 'OTHER',
          chUuid: data.uuid,
        },
      };
    }
    if (draft.__DETAIL && draft.__DETAIL.uuid === contactId) {
      draft.__DETAIL = {
        ...draft.__DETAIL,
        latestCommunicationHistoryDTOList: [data, ...draft.__DETAIL.latestCommunicationHistoryDTOList],
      };
    }
  },
  [ContactActionTypes.UPDATE_NUMBER_DOCUMENT_IN_DETAIL]: (draft, { count }) => {
    if (draft.__DETAIL) {
      draft.__DETAIL.numberDocument = count;
    }
  },
  [ContactActionTypes.TOGGLE_FAVORITE_SUCCESS]: (draft, { contactId, flag }) => {
    if (!contactId) return;
    if (draft[contactId]) draft[contactId].favorite = flag;
  },
  [ContactActionTypes.UPDATE_CONTACT_LOCAL_FOR_CASE_CHANGE_COMPANY]: (draft, {oldContactId, newData}) => {
    if(newData?.uuid) {
      draft[newData?.uuid] = draft[oldContactId];
      draft[newData?.uuid] = {...newData}
    }
    delete draft[oldContactId];
  }
});

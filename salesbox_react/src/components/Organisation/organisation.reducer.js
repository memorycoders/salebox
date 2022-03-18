// @flow
import createReducer, { createConsumeEntities } from 'store/createReducer';
import uuid from 'uuid/v4';
import _ from 'lodash';
import CustomFieldActionTypes from 'components/CustomField/custom-field.actions';
import MultiRelationActionTypes from 'components/MultiRelation/multi-relation.actions';
import OverviewActionTypes from 'components/Overview/overview.actions';
import OrganisationActionTypes from './organisation.actions';

import { OverviewTypes, PhoneTypes, EmailTypes, ObjectTypes, EmailContactTypes, PhoneContactTypes } from 'Constants';
import AuthActionTypes from 'components/Auth/auth.actions';
import { emptyOrganisation } from 'components/Organisation/organisation.selector';

export let initialState = {
  __CREATE: {
    additionalEmailList: [],
  },
  __EDIT: {},
  __EDIT_APPOINTMENT_TARGET: {},
  __EDIT_SALE_TARGET: {},
  __DETAIL: {},
  __DETAIL_TO_EDIT: {},
  __COMMON_DATA: {
    taskRefesh: 0,
  },
  __UPLOAD: {
    imageCropScale: 1.2,
    cropEnabled: false,
    fileFakePath: '',
    fileData: null,
    dataURL: null,
  },
  __ERRORS: {},
  __CREATE_CONTACT: {},
};

const consumeEntities = createConsumeEntities('organisation');

export default createReducer(initialState, {
  default: consumeEntities,
  [AuthActionTypes.LOGOUT]: (draft) => {
    Object.keys(draft).forEach((id) => {
      if (id === '__CREATE' || id === '__ERRORS' || id === '__UPLOAD' || id === '__EDIT' || id === '__CREATE_CONTACT') {
        return false;
      }
      delete draft[id];
    });
  },

  // Account: Detail Panel
  [CustomFieldActionTypes.FETCH_SUCCESS]: (draft, { entities, objectId, objectType }) => {
    if (objectType === ObjectTypes.Account && entities && entities.customField) {
      draft[objectId] = draft[objectId] || {};
      draft[objectId].customFields = Object.keys(entities.customField);
    }
  },
  [MultiRelationActionTypes.FETCH_SUCCESS]: (draft, { entities, objectId, objectType }) => {
    if (objectType === ObjectTypes.Account && entities.multiRelation) {
      draft[objectId] = draft[objectId] || {};
      draft[objectId].multiRelations = Object.keys(entities.multiRelation);
    }
  },

  //FETCH_ORGANISATION_SUCCESS
  [OrganisationActionTypes.FETCH_ORGANISATION_SUCCESS]: (draft, { organisationId, data }) => {
    // draft[organisationId] ={
    //   ...draft[organisationId],
    //   ...data
    // };
    draft.__DETAIL = {
      ...draft.__DETAIL,
      ...data,
    };
  },

  [OrganisationActionTypes.FETCH_ORGANISATION_FAIL]: (draft, { organisationId }) => {
    // draft[organisationId] ={
    //   ...draft[organisationId],
    //   ...data
    // };
    draft.__DETAIL = {};
    // draft[organisationId] && delete draft[organisationId];
    if (draft[organisationId]) {
      draft[organisationId].displayName = null;
      draft[organisationId].email = null;
      draft[organisationId].name = null;
      draft[organisationId].phone = null;
    }
  },
  // [Cards]
  // Card: Tasks
  [OrganisationActionTypes.FETCH_TASKS_SUCCESS]: (draft, { accountId, entities }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL.tasks = entities.task ? Object.keys(entities.task) : null;
    draft[accountId] = draft[accountId] || {};
    draft[accountId].tasks = entities.task ? Object.keys(entities.task) : null;
  },
  [OrganisationActionTypes.FETCH_APPOINTMENT_SUCCESS]: (draft, { accountId, data }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL.appointments = data;
    draft[accountId] = draft[accountId] || {};
    draft[accountId].appointments = data;
  },
  [OrganisationActionTypes.FETCH_NOTES_SUCCESS]: (draft, { accountId, data }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL.notes = data;
    draft[accountId] = draft[accountId] || {};
    draft[accountId].notes = data;
  },
  //FETCH_NOTES_SUCCESS

  //FETCH_PHOTOS_SUCCESS
  [OrganisationActionTypes.FETCH_PHOTOS_SUCCESS]: (draft, { accountId, data }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL.photos = data;
    draft[accountId] = draft[accountId] || {};
    draft[accountId].photos = data;
  },
  //FETCH_UNQUALIFIED_SUCCESS
  [OrganisationActionTypes.FETCH_UNQUALIFIED_SUCCESS]: (draft, { accountId, data }) => {
    const dataShow = data.filter((value) => !value.finished);
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL.unQualifieds = dataShow;
    draft[accountId] = draft[accountId] || {};
    draft[accountId].unQualifieds = dataShow;
  },

  //FETCH_QUALIFIED_SUCCESS
  [OrganisationActionTypes.FETCH_QUALIFIED_SUCCESS]: (draft, { accountId, data }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL.qualifieds = data;
    draft[accountId] = draft[accountId] || {};
    draft[accountId].qualifieds = data;
  },
  //FETCH_ORDER_SUCCESS
  [OrganisationActionTypes.FETCH_ORDER_SUCCESS]: (draft, { accountId, data, orderRows, totalOrderRow }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL.orders = data;
    draft.__DETAIL.orderRows = orderRows;
    draft.__DETAIL.totalOrderRow = totalOrderRow;
    draft[accountId] = draft[accountId] || {};
    draft[accountId].orders = data;
    draft[accountId].orderRows = orderRows;
    draft[accountId].totalOrderRow = totalOrderRow;
  },
  [OrganisationActionTypes.LOAD_MORE_ORDER_ROWS_SUCCESS]: (draft, { accountId, orderRows }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL.orderRows = draft.__DETAIL.orderRows.concat(orderRows);
    draft[accountId] = draft[accountId] || {};
    draft[accountId].orderRows = draft.__DETAIL.orderRows.concat(orderRows);
  },

  [OrganisationActionTypes.REFESH_DESCRIPTION_PHOTO]: (draft, { description, photoId }) => {
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

  [OrganisationActionTypes.REFESH_TASK]: (draft) => {
    draft.__COMMON_DATA = draft.__COMMON_DATA || {};
    draft.__COMMON_DATA = {
      ...draft.__COMMON_DATA,
      taskRefesh: draft.__COMMON_DATA.taskRefesh + 1,
    };
  },

  // Card: Contacts
  [OrganisationActionTypes.FETCH_CONTACTS_SUCCESS]: (draft, { accountId, entities, pageIndex }) => {
    draft[accountId] = draft[accountId] || {};
    if (pageIndex === 0 || pageIndex == null) {
      draft[accountId].contacts = entities.contact ? Object.keys(entities.contact) : null;
      draft.__DETAIL.contacts = entities.contact ? entities.contact : null;
      //draft.__DETAIL.contacts = entities.contact ? Object.keys(entities.contact) : null;
    } else if (entities.contact != null) {
      draft[accountId].contacts = draft[accountId].contacts.concat(Object.keys(entities.contact));
      draft.__DETAIL.contacts = { ...draft.__DETAIL.contacts, ...entities.contact };
    }
  },

  // Account: Create
  [OrganisationActionTypes.CREATE_SUCCESS]: (draft, {}) => {
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

  //FILTER_LASTEST_COMMUNICATION_SUCCESS
  [OrganisationActionTypes.FILTER_LASTEST_COMMUNICATION_SUCCESS]: (draft, { accountId, data, pageIndex }) => {
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
  [OrganisationActionTypes.REFESH_LASTEST_COMMUNICATION]: (draft, { communicationId }) => {
    draft.__DETAIL = draft.__DETAIL || { latestCommunicationHistoryDTOList: [], totalCommunicationHistory: 0 };
    draft.__DETAIL.totalCommunicationHistory = draft.__DETAIL.totalCommunicationHistory - 1;
    draft.__DETAIL.latestCommunicationHistoryDTOList = draft.__DETAIL.latestCommunicationHistoryDTOList.filter(
      (value) => value.uuid !== communicationId
    );
  },

  // Account: Update
  [OrganisationActionTypes.UPDATE]: (draft, { organisationId, updateData }) => {
    draft[organisationId] = draft[organisationId] || {};
    Object.keys(updateData).forEach((key) => {
      draft[organisationId][key] = updateData[key];
    });
  },
  [OrganisationActionTypes.EDIT_ENTITY]: (draft, { overviewType, account }) => {
    const participants = [];
    (account.participantList ? account.participantList : []).map((v) => {
      participants.push(v.uuid);
    });
    draft.__EDIT = {
      ...account,
      industry: (account.industry && account.industry.uuid) || null,
      size: (account.size && account.size.uuid) || null,
      type: (account.type && account.type.uuid) || null,
      participants: participants,
    };
  },

  // Account: Form Edit
  [OrganisationActionTypes.ADD_PHONE]: (draft, { organisationId, dial }) => {
    draft[organisationId] = draft[organisationId] || {};
    draft[organisationId].additionalPhoneList = draft[organisationId].additionalPhoneList || [];
    draft[organisationId].additionalPhoneList.push({
      main: draft[organisationId].additionalPhoneList.length === 0,
      value: dial ? `+${dial}` : '',
      uuid: draft[organisationId].additionalPhoneList.length,
      type: PhoneContactTypes.Subsidiary,
    });
  },
  [OrganisationActionTypes.REMOVE_PHONE]: (draft, { organisationId, phoneId }) => {
    let wasMain;
    draft[organisationId].additionalPhoneList = draft[organisationId].additionalPhoneList.filter((phone) => {
      if (phone.main) wasMain = true;
      return phone.uuid !== phoneId;
    });
    if (wasMain && draft[organisationId].additionalPhoneList[0]) {
      draft[organisationId].additionalPhoneList[0].main = true;
    }
  },
  [OrganisationActionTypes.MAKE_PHONE_MAIN]: (draft, { organisationId, phoneId }) => {
    draft[organisationId].additionalPhoneList = draft[organisationId].additionalPhoneList.map((phone) => {
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
  [OrganisationActionTypes.UPDATE_PHONE]: (draft, { organisationId, phoneId, values }) => {
    draft[organisationId].additionalPhoneList = draft[organisationId].additionalPhoneList.map((phone) => {
      if (phone.uuid === phoneId) {
        return {
          ...phone,
          ...values,
        };
      }
      return phone;
    });
  },
  [OrganisationActionTypes.ADD_EMAIL]: (draft, { organisationId }) => {
    draft[organisationId] = draft[organisationId] || {};
    draft[organisationId].additionalEmailList = draft[organisationId].additionalEmailList || [];
    draft[organisationId].additionalEmailList.push({
      main: draft[organisationId].additionalEmailList.length === 0,
      value: '',
      uuid: draft[organisationId].additionalEmailList.length,
      type: EmailContactTypes.Subsidiary,
    });
  },
  [OrganisationActionTypes.REMOVE_EMAIL]: (draft, { organisationId, emailId }) => {
    let wasMain;
    draft[organisationId].additionalEmailList = draft[organisationId].additionalEmailList.filter((email) => {
      if (email.main) wasMain = true;
      return email.uuid !== emailId;
    });
    if (wasMain && draft[organisationId].additionalEmailList[0]) {
      draft[organisationId].additionalEmailList[0].main = true;
    }
  },
  [OrganisationActionTypes.UPDATE_RESPONSIBLE_ONE_DEAL_SUCCESS]: (draft, { organisationId, ownerAvatar }) => {
    draft[organisationId] = draft[organisationId] || {};
    draft[organisationId].owner = {
      ...draft[organisationId].owner,
      avatar: ownerAvatar,
    };
  },
  [OrganisationActionTypes.MAKE_EMAIL_MAIN]: (draft, { organisationId, emailId }) => {
    draft[organisationId].additionalEmailList = draft[organisationId].additionalEmailList.map((email) => {
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
  [OrganisationActionTypes.UPDATE_EMAIL]: (draft, { organisationId, emailId, values }) => {
    // const findIndex = draft[organisationId].additionalEmailList.findIndex(value => value.uuid === emailId);
    // const oldObject =  {
    //   ...draft[organisationId].additionalEmailList[findIndex]
    // }

    // draft[organisationId].additionalEmailList[findIndex] = {
    //   main: oldObject.main,
    //   uuid: uuid(),
    //   type: oldObject.type,
    //   ...values
    // }

    // _.remove(draft[organisationId].additionalEmailList, value =>)
    const oldObject = draft[organisationId].additionalEmailList.find((value) => value.uuid === emailId);
    draft[organisationId].additionalEmailList = draft[organisationId].additionalEmailList.map((email) => {
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
  [OrganisationActionTypes.REMOVE_CALL_LIST_IN_ACCOUNT_SUCCESS]: (draft, { accountId, callListAccountId }) => {
    draft[accountId] = draft[accountId] || {};
    draft.__DETAIL = draft.__DETAIL || {};

    draft.__DETAIL.callListAccountDTOs = (draft.__DETAIL.callListAccountDTOs
      ? draft.__DETAIL.callListAccountDTOs
      : []
    ).filter((value) => value.uuid !== callListAccountId);
  },

  [OrganisationActionTypes.UPDATE_CALL_LIST_IN_ACCOUNT]: (draft, { callListAccount }) => {
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL.callListAccountDTOs = draft.__DETAIL.callListAccountDTOs ? draft.__DETAIL.callListAccountDTOs : [];
    if (!draft.__DETAIL.callListAccountDTOs.find((e) => e.uuid === callListAccount.uuid)) {
      draft.__DETAIL.callListAccountDTOs.push({ name: callListAccount.name, uuid: callListAccount.uuid });
    }
  },
  //UPDATE_APPOINTMENT_TARGET_SUCCESS
  [OrganisationActionTypes.UPDATE_APPOINTMENT_TARGET_SUCCESS]: (draft, { accountId, value }) => {
    draft[accountId] = draft[accountId] || {};
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL.numberGoalsMeeting = value;
    draft[accountId].numberGoalsMeeting = value;
  },

  //UPDATE_SALE_TARGET_SUCCESS
  [OrganisationActionTypes.UPDATE_SALE_TARGET_SUCCESS]: (draft, { accountId, value }) => {
    draft[accountId] = draft[accountId] || {};
    draft.__DETAIL = draft.__DETAIL || {};
    draft.__DETAIL.budget = value;
    draft[accountId].budget = value;
  },

  [OrganisationActionTypes.UPDATE_QUALIFIED_DEAL]: (draft, { data }) => {
    // Object.keys(draft).map((key) => {
    //   if (key === data.prospectId) {
    //     draft[key].favorite = data.favorite;
    //     return;
    //   }
    // });
    if (data) {
      if (data.organisationId === draft.__DETAIL.uuid) {
        draft.__DETAIL.favorite = data.favorite;
      }
      if (draft[data.organisationId]) draft[data.organisationId].favorite = data.favorite;
    }
  },

  // Account: Favourites Toggle
  [OrganisationActionTypes.TOGGLE_FAVORITE_SUCCESS]: (draft, { organisationId, flag }) => {
    // FIXME: Put me into right place please.
  },

  //Avatar upload
  [OrganisationActionTypes.IMAGE_ON_CROP_ENABLED]: (draft, action) => {
    draft.__UPLOAD.cropEnabled = true;
    draft.__UPLOAD.fileFakePath = action.fakePath;
    draft.__UPLOAD.fileData = action.fileData;
  },
  [OrganisationActionTypes.IMAGE_CANCEL_UPLOAD_CROP]: (draft) => {
    draft.__UPLOAD.cropEnabled = false;
    draft.__UPLOAD.fileFakePath = '';
    draft.__UPLOAD.fileData = null;
    draft.__UPLOAD.imageData = null;
    draft.__UPLOAD.dataURL = null;
  },
  [OrganisationActionTypes.IMAGE_ON_CROP_CHANGE]: (draft, action) => {
    draft.__UPLOAD.dataURL = action.imageData;
  },
  [OrganisationActionTypes.IMAGE_SAVE_UPLOAD_CROP]: (draft, action) => {
    draft.__UPLOAD.dataURL = action.imageData;
    draft.__UPLOAD.cropEnabled = false;
  },
  [OrganisationActionTypes.UPDATE_ERRORS]: (draft, { updateData }) => {
    Object.keys(updateData).forEach((key) => {
      draft.__ERRORS[key] = updateData[key];
    });
  },
  [OrganisationActionTypes.FILTER_SUBLIST_ORDER]: (draft, { uuid, filterValue }) => {
    if (filterValue === 'WON') {
      draft[uuid].orders = draft.__DETAIL.orders.filter((e) => e.won === true);
    } else if (filterValue === 'LOSS') {
      draft[uuid].orders = draft.__DETAIL.orders.filter((e) => e.won === false);
    } else {
      draft[uuid].orders = draft.__DETAIL.orders;
    }
  },
  [OrganisationActionTypes.SORT_UNQUALIFIED_DEAL_SUBLIST]: (draft, { orderBy }) => {
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
  [OrganisationActionTypes.SORT_QUALIFIED_DEAL_SUBLIST]: (draft, { orderBy }) => {
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
  [OrganisationActionTypes.SORT_ORDER_SUBLIST]: (draft, { uuid, orderBy }) => {
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
  [OrganisationActionTypes.REQUEST_FETCH_DETAIL_TO_EDIT_SUCCESS]: (draft, { organisationId, data }) => {
    draft.__DETAIL_TO_EDIT = {
      ...draft.__DETAIL_TO_EDIT,
      ...data,
    };
  },
  [OrganisationActionTypes.CLEAR_ACCOUNT_DETAIL_TO_EDIT]: (draft) => {
    draft.__DETAIL_TO_EDIT = {};
  },
  // [OrganisationActionTypes.SORT_CONTACT_SUBLIST]: (draft, { orderBy }) => {
  //   Object.keys(draft.__DETAIL.contacts).sort(function(a, b) {
  //     if (orderBy === 'owner') {
  //       let nameA = a.ownerName ? a.ownerName.toUpperCase() : '';
  //       let nameB = b.ownerName ? b.ownerName.toUpperCase() : '';
  //       if (nameA < nameB) {
  //         return -1;
  //       }
  //       if (nameA > nameB) {
  //         return 1;
  //       }
  //       return 0;
  //     }
  //     if (orderBy === 'name') {
  //       let nameA = a.firstName ? a.firstName.toUpperCase() : '';
  //       let nameB = b.firstName ? b.firstName.toUpperCase() : '';
  //       if (nameA < nameB) {
  //         return -1;
  //       }
  //       if (nameA > nameB) {
  //         return 1;
  //       }
  //       return 0;
  //     }
  //   });
  // },
  [OrganisationActionTypes.FILTER_CONTACT_SUCCESS]: (draft, { accountId, data, pageIndex }) => {
    const { contactDTOList } = data;
    draft.__DETAIL = draft.__DETAIL || { contacts: [] };
    // draft.__DETAIL.totalCommunicationHistory = total;
    console.log('draft.__DETAIL.contacts ', draft.__DETAIL.contacts);
    console.log('contactDTOList ', contactDTOList);
    if (pageIndex === 0 || pageIndex == null) {
      draft.__DETAIL.contacts = contactDTOList;
    } else {
      draft.__DETAIL.contacts = [...draft.__DETAIL.contacts.concat, ...contactDTOList];
    }
    console.log('draft.__DETAIL.contacts ', draft.__DETAIL.contacts);
  },
  [OrganisationActionTypes.UPDATE_NUMBER_DOCUMENT_IN_DETAIL]:(draft, {count}) => {
    if(draft.__DETAIL){
      draft.__DETAIL.numberDocument = count;
    }
  }
});

//@flow
import { call, put, take, cancel, fork, all, select, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import uuid from 'uuid/v4';
import createOverviewSagas from 'components/Overview/overview.saga';
import { normalize, schema } from 'normalizr';

import { contactList, contactSchema } from './contact.schema';
import { taskList, taskSchema } from 'components/Task/task.schema';
import { contactDropdownList } from '../ContactDropdown/contactDropdown.schema';
import DropdownActionTypes, * as DropdownActions from 'components/Dropdown/dropdown.actions';
import OverviewActionsTypes, * as OverviewActions from '../Overview/overview.actions';
import ContactActionTypes, * as ContactActions from './contact.actions';
import { refeshTasks } from './contact.actions';
import * as NotificationActions from 'components/Notification/notification.actions';
import { getOverview } from '../Overview/overview.selectors';
import { getCurrentTimeZone } from '../../lib/dateTimeService';
import { getSearch, getSearchForSave } from 'components/AdvancedSearch/advanced-search.selectors';
import { getContact } from 'components/Contact/contact.selector';
import { getUserProfile } from 'components/Profile/profile.selector';
import { makeGetUser } from 'components/User/user.selector';
import { debounceTime } from 'config';
import { ObjectTypes, OverviewTypes, Endpoints } from 'Constants';
import { getCustomFieldsObject, getCustomFieldValues } from '../CustomField/custom-field.selectors';
import generateUuid from 'uuid/v4';
import api from 'lib/apiClient';
import { refreshOrganisation } from '../Organisation/organisation.actions';
import _l from 'lib/i18n';
import OrganisationActionTypes from '../Organisation/organisation.actions';
import * as OrganisationActions from '../Organisation/organisation.actions';
import { getCreateUnqualifiedDeal } from '../PipeLineUnqualifiedDeals/unqualifiedDeal.selector';
import * as UnqualifiedDealActions from '../PipeLineUnqualifiedDeals/unqualifiedDeal.actions';
import { clearCreateEntity } from '../PipeLineUnqualifiedDeals/unqualifiedDeal.actions';
import { clearCreateEntity as clearQualified } from '../PipeLineQualifiedDeals/qualifiedDeal.actions';
import { clear, create } from '../OrderRow/order-row.actions';
import { requestFetchAppointment } from '../Appointment/appointment.actions';
import * as CallListContactActions from '../CallListContact/callListContact.actions';
import { getHighlighted } from 'components/Overview/overview.selectors';
import { updateDocumentObjectId, fetchGetRootFolder } from '../Common/common.actions';
import { PAGE_SIZE_SUBLIST, STATUS_MSTEAMS_OF_CONTACT } from '../../Constants';
import * as TaskActions from '../Task/task.actions';
import * as AppointmentActions from '../Appointment/appointment.actions';
import * as QualifiedDealActions from '../PipeLineQualifiedDeals/qualifiedDeal.actions';
import {
  updateCandidateLocal,
  fetchRCActiveDataByCaseId,
  createCandidateEntity,
} from '../Recruitment/recruitment.actions';
import { data } from 'autoprefixer';
import { forIn } from 'lodash';

const documentEndPoints = 'document-v3.0';
const contactEndPoints = 'contact-v3.0';

// DropDown
function* fetchDropdownForOrganisation(filter, searchField): Generator<*, *, *> {
  // yield delay(debounceTime);
  try {
    if (filter && filter.organisationId) {
      yield put(DropdownActions.startFetch(ObjectTypes.ContactDropdown, searchField));
      const data = yield call(api.get, {
        resource: `${Endpoints.Contact}/syncByOrganisation`,
        query: {
          updatedDate: 0,
          pageIndex: filter && filter.pageIndex ? filter.pageIndex : 0,
          pageSize: 10,
          searchField,
          organisationId: filter.organisationId,
        },
        schema: contactDropdownList,
      });
      let contactDropdown = data.entities.contactDropdown;
      forIn(contactDropdown, (_, key) => {
        contactDropdown[key]["relationId"] = filter.organisationId;
      })
      yield put(DropdownActions.succeedFetch(ObjectTypes.ContactDropdown, {
        ...data.entities,
        contactDropdown: contactDropdown
      }));
    } else {
      yield put(DropdownActions.startFetch(ObjectTypes.ContactDropdown, searchField));
      const data = yield call(api.post, {
        resource: `${Endpoints.Contact}/ftsES`,
        query: {
          // updatedDate: 0,
          pageIndex: filter && filter.pageIndex ? filter.pageIndex : 0,
          pageSize: 10,
          sessionKey: uuid(),
          timeZone: getCurrentTimeZone(),
        },
        data: {
          customFilter: 'active',
          orderBy: 'Alphabetical',
          roleFilterType: 'Company',
          roleFilterValue: '',
          searchText: searchField ? searchField : '',
        },
        schema: contactDropdownList,
      });
      yield put(DropdownActions.succeedFetch(ObjectTypes.ContactDropdown, data.entities));
    }
  } catch (e) {
    yield put(DropdownActions.failFetch(ObjectTypes.ContactDropdown, e.message));
    // yield put({ type: ContactActionTypes.FETCH_ORGANISATION_DROPDOWN_FAIL, message: e.message });
  }
}

// DropDown
function* queueFetchDropdownForOrganisation() {
  let task;
  while (true) {
    const { searchTerm, filter, objectType } = yield take(DropdownActionTypes.FETCH_REQUEST);
    if (objectType === ObjectTypes.ContactDropdown) {
      if (task) {
        // yield cancel(task);
      }
      task = yield fork(fetchDropdownForOrganisation, filter, searchTerm);
    }
  }
}

// Favourites
function* toggleFavoriteRequest(values: any): Generator<*, *, *> {
  const { contactId, flag } = values;

  try {
    const data = yield call(api.post, {
      resource: `${contactEndPoints}/updateFavorite`,
      data: {
        contactId,
        favorite: flag,
      },
    });

    if (data.contactId) {
      // yield put({
      //   type: ContactActionTypes.FETCH_CONTACT_REQUEST,
      //   contactId: data.contactId,
      // });

      yield put(ContactActions.toggleFavoriteSuccess(contactId, flag));
      yield put(ContactActions.requestFetchColleague(contactId));
    }
  } catch (e) {
    console.log(e);
  }
}

function* updateCustomField(overviewType, contactId) {
  const state = yield select();
  let overviewT = overviewType == OverviewTypes.Contact_Unqualified_Multi ? OverviewTypes.Contact : overviewType;
  let objectT = ObjectTypes.Contact;
  let customFilterDeault = 'active';

  const overview = getOverview(state, overviewT);
  const search = getSearch(state, objectT);
  // const period = getPeriod(state, objectT);
  const { searchFieldDTOList } = getSearchForSave(state, objectT);
  // const isFilterAll = period.period === 'all';
  const { roleType } = state.ui.app;
  let ownerId = state.ui.app.activeRole;
  let roleValue = state.ui.app.activeRole;
  if (roleType === 'Person' && !ownerId) {
    ownerId = state.auth.userId;
  } else if (roleType === 'Company') {
    ownerId = undefined;
  }
  if (roleType === 'Person' && !roleValue) {
    roleValue = state.auth.userId;
  } else if (roleType === 'Company') {
    roleValue = undefined;
  }
  const filterDTO = {
    roleFilterType: roleType,
    roleFilterValue: roleValue,
    customFilter: search.filter ? search.filter : customFilterDeault,
    orderBy: search.orderBy ? search.orderBy : 'closedSales',
    searchFieldDTOList: search.shown ? searchFieldDTOList : [],
    searchText: search.term,
  };
  let payload = {
    filterDTO,
    isSelectedAll: false,
    contactIds: [contactId],
    unSelectedIds: [],
    // isProspectActive: isProspectActive,
  };

  try {
    let updatedCustomFieldDTOList = [];
    const customFields = getCustomFieldsObject(state);
    customFields.forEach((customField) => {
      const { customFieldValueDTOList } = customField;
      if (customFieldValueDTOList.length > 0) {
        if (customField.fieldType === 'DROPDOWN') {
          const checkForValueSelected = customFieldValueDTOList.filter((value) => {
            return value.isChecked === true;
          });
          if (checkForValueSelected.length > 0) {
            updatedCustomFieldDTOList.push(customField);
          }
        } else {
          updatedCustomFieldDTOList.push(customField);
        }
      }
    });

    const timezone = new Date().getTimezoneOffset() / -60;

    yield call(api.post, {
      resource: `${Endpoints.Contact}/updateDataField`,
      query: {
        timeZone: timezone,
      },
      data: {
        ...payload,
        updatedCustomFieldDTOList: updatedCustomFieldDTOList,
        updatedStandardFieldDTO: {},
      },
    });
  } catch (error) {}
}

// Create - Manual
function* requestCreate({ overviewType, avatar }): Generator<*, *, *> {
  const state = yield select();
  const __CREATE = getContact(state, '__CREATE');
  const types = state.entities.type;
  const industry = state.entities.industry;
  try {
    let payload = {
      // [Personal]
      title: __CREATE.title,
      firstName: __CREATE.firstName ? __CREATE.firstName : '',
      lastName: __CREATE.lastName ? __CREATE.lastName : '',

      // [General]
      discProfile: __CREATE.discProfile ? __CREATE.discProfile : 'NONE',
      type: __CREATE.type ? types[__CREATE.type] : null,
      industry: __CREATE.industry ? industry[__CREATE.industry] : null,
      // "type": null,
      // "industry": null,
      relation: __CREATE.relation ? types[__CREATE.relation] : null,
      relationship: __CREATE.relationship ? __CREATE.relationship : '',

      // [Email]
      email: null,
      mainEmailType: null,
      additionalEmailList: (__CREATE.additionalEmailList ? __CREATE.additionalEmailList : []).map((value) => {
        return {
          ...value,
          uuid: uuid(),
          isPrivate: false,
        };
      }),

      // [Phone]
      phone: null,
      mainPhoneType: null,
      additionalPhoneList: (__CREATE.additionalPhoneList ? __CREATE.additionalPhoneList : []).map((value) => {
        return {
          ...value,
          uuid: uuid(),
          isPrivate: false,
        };
      }),

      // [Others]
      mediaType: 'MANUAL',
      participantList: __CREATE.participants ? __CREATE.participants : [],
      msTeamId: __CREATE.msTeamId,
      teamId: __CREATE.teamId,
    };

    payload.organisationId = __CREATE.organisationId ? __CREATE.organisationId : null;
    payload.street = __CREATE.street ? __CREATE.street : null;
    payload.zipCode = __CREATE.zipCode ? __CREATE.zipCode : null;
    payload.city = __CREATE.city ? __CREATE.city : null;
    payload.region = __CREATE.region ? __CREATE.region : null;
    payload.country = __CREATE.country ? __CREATE.country : null;
    // [Address]
    // TODO: Referenced from Account
    // if (organisationId) {
    //   payload.organisationId = __CREATE.organisation ? __CREATE.organisation : null,
    //   payload.street = __CREATE.street ? __CREATE.street : null,
    //   payload.zipCode = __CREATE.zipcode ? __CREATE.zipcode : null,
    //   payload.city = __CREATE.city ? __CREATE.city : null,
    //   payload.state = __CREATE.state ? __CREATE.state : null,
    //   payload.country = __CREATE.country ? __CREATE.country : null,
    // }

    if (__CREATE.additionalEmailList && __CREATE.additionalEmailList.length > 0) {
      const mainEmail = __CREATE.additionalEmailList.find((x) => x.main === true);
      if (mainEmail) {
        payload.email = mainEmail.value;
        payload.mainEmailType = mainEmail.type;
      }
    }

    if (__CREATE.additionalPhoneList && __CREATE.additionalPhoneList.length > 0) {
      const mainPhone = __CREATE.additionalPhoneList.find((x) => x.main === true);
      if (mainPhone) {
        payload.phone = mainPhone.value;
        payload.mainPhoneType = mainPhone.type;
      }
    }

    if (avatar) {
      payload.avatar = avatar;
    }

    const contact = yield call(api.post, {
      resource: `${contactEndPoints}/add`,
      query: {
        languageCode: 'en', // TODO: Hard code, fix later.
      },
      schema: contactSchema,
      data: payload,
    });

    if (contact) {
      yield updateCustomField(overviewType, contact.result);
      yield put(OverviewActions.clearHighlightAction(overviewType));
      // yield put(ContactActions.succeedFetchContact(contact.contactId, {
      //   entities: contact.entities
      // }));
      yield put(NotificationActions.success(_l`Added`, '', 2000));
      yield put(OverviewActions.requestFetch(OverviewTypes.Contact, true));
      if (overviewType === OverviewTypes.Contact_Add_Colleague) {
        yield put(ContactActions.refreshContact('contact'));
        yield put(refreshOrganisation('contact'));
      }
      if (overviewType === OverviewTypes.Account_Contact) {
        yield put(refreshOrganisation('contact'));
      }
      if (overviewType === OverviewTypes.Activity.Appointment_Add_Contact) {
        const appointment = state.entities.appointment.__DETAIL;
        if (appointment.uuid) {
          yield put(requestFetchAppointment(appointment.uuid));
        }
      }
      console.log('contact', contact);
      console.log('__CREATE', __CREATE);
      // auto fill for add form reminder
      yield put(DropdownActions.setSearchTerm('CONTACT_DROPDOWN', ''));
      yield put(DropdownActions.setSearchTerm('ORGANISATION_DROPDOWN', ''));

      if (overviewType == OverviewTypes.Contact) {
        // let contactIds = __CREATE.contactId != null ? [__CREATE.contactId] : [];
        yield put(TaskActions.updateCreateEditEntityAfterAddContact(__CREATE.organisationId, contact.result));
        yield put(
          QualifiedDealActions.updateCreateEditEntityAfterAddContact(__CREATE.organisationId || null, contact.result)
        );
        // yield put(AppointmentActions.updateCreateEditEntityAfterAddDeal(null, data.uuid, __CREATE.organisationId, contactIds));
        yield put(
          UnqualifiedDealActions.updateCreateEditEntityAfterAddContact(__CREATE.organisationId, contact.result)
        );
      }

      yield put(createCandidateEntity({ contactId: contact.result }));
      yield put(ContactActions.succeedCreate());
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}

// TODO: Create - By Search

// TODO: Update
function* requestUpdate({ avatar }) {
  const state = yield select();
  const __CREATE = getContact(state, '__EDIT');
  const types = state.entities.type;
  const industry = state.entities.industry;
  try {
    const participantList = [];
    (__CREATE.participantList ? __CREATE.participantList : []).map((p) => {
      participantList.push(p.uuid);
    });
    let payload = {
      uuid: __CREATE.uuid,
      // [Personal]
      title: __CREATE.title,
      firstName: __CREATE.firstName ? __CREATE.firstName : '',
      lastName: __CREATE.lastName ? __CREATE.lastName : '',

      // [General]
      discProfile: __CREATE.discProfile ? __CREATE.discProfile : 'NONE',
      type: __CREATE.type ? types[__CREATE.type] : null,
      industry: __CREATE.industry ? industry[__CREATE.industry] : null,
      // "type": null,
      // "industry": null,
      relation: __CREATE.relation ? types[__CREATE.relation] : null,
      relationship: __CREATE.relationship ? __CREATE.relationship : '',

      // [Email]
      email: null,
      mainEmailType: null,
      additionalEmailList: (__CREATE.additionalEmailList ? __CREATE.additionalEmailList : []).map((value) => {
        return {
          ...value,
          uuid: uuid(),
          isPrivate: false,
        };
      }),

      // [Phone]
      phone: null,
      mainPhoneType: null,
      additionalPhoneList: (__CREATE.additionalPhoneList ? __CREATE.additionalPhoneList : []).map((value) => {
        return {
          ...value,
          uuid: uuid(),
          isPrivate: false,
        };
      }),

      // [Others]
      mediaType: 'MANUAL',
      participantList: __CREATE.participants ? __CREATE.participants : [],
    };

    payload.organisationId = __CREATE.organisationId ? __CREATE.organisationId : null;
    payload.street = __CREATE.street ? __CREATE.street : null;
    payload.zipCode = __CREATE.zipCode ? __CREATE.zipCode : null;
    payload.city = __CREATE.city ? __CREATE.city : null;
    payload.region = __CREATE.region ? __CREATE.region : null;
    payload.country = __CREATE.country ? __CREATE.country : null;
    // [Address]
    // TODO: Referenced from Account
    // if (organisationId) {
    //   payload.organisationId = __CREATE.organisation ? __CREATE.organisation : null,
    //   payload.street = __CREATE.street ? __CREATE.street : null,
    //   payload.zipCode = __CREATE.zipcode ? __CREATE.zipcode : null,
    //   payload.city = __CREATE.city ? __CREATE.city : null,
    //   payload.state = __CREATE.state ? __CREATE.state : null,
    //   payload.country = __CREATE.country ? __CREATE.country : null,
    // }

    if (__CREATE.additionalEmailList && __CREATE.additionalEmailList.length > 0) {
      const mainEmail = __CREATE.additionalEmailList.find((x) => x.main === true);
      if (mainEmail) {
        payload.email = mainEmail.value;
        payload.mainEmailType = mainEmail.type;
      }
    }

    if (__CREATE.additionalPhoneList && __CREATE.additionalPhoneList.length > 0) {
      const mainPhone = __CREATE.additionalPhoneList.find((x) => x.main === true);
      if (mainPhone) {
        payload.phone = mainPhone.value;
        payload.mainPhoneType = mainPhone.type;
      }
    }

    if (avatar) {
      payload.avatar = avatar;
    }
    let query = {
      languageCode: 'en', // TODO: Hard code, fix later.
    };
    if (__CREATE.keepOldData) query.keepOldData = __CREATE.keepOldData;

    const contact = yield call(api.post, {
      resource: `${contactEndPoints}/update`,
      query,
      schema: contactSchema,
      data: payload,
    });

    if (contact) {
      console.log('res contact:', contact);
      yield put(OverviewActions.clearHighlightAction(OverviewTypes.Contact));
      yield put(OverviewActions.clearHighlightAction(OverviewTypes.CallList.SubContact));
      yield put(ContactActions.succeedCreate());
      yield put(NotificationActions.success(_l`Added`, '', 2000));
      const __DETAIL = state.entities.contact.__DETAIL;

      if (__DETAIL && __DETAIL.uuid === __CREATE.uuid) {
        if (contact.result == __CREATE.uuid) yield fetchContact({ contactId: __CREATE.uuid });
        else {
          yield put(ContactActions.updateContactLocalForCaseChangeCompany(__CREATE.uuid, contact?.entities?.contact?.[contact?.result]));
          yield put(OverviewActions.addNewItemToList(contact?.result, __CREATE.uuid));
          yield put(OverviewActions.requestFetch(OverviewTypes.Contact, true));
          yield fetchContact({ contactId: contact.result });
        }
      } else {
        if (contact.result != __CREATE.uuid) {
          yield put(OverviewActions.requestFetch(OverviewTypes.Contact, true));
        }
      }

      // yield put(
      //   updateCandidateLocal({
      //     contactId: __CREATE.uuid,
      //     contactName: `${contact.entities?.contact?.[__CREATE.uuid]?.firstName} ${
      //       contact.entities?.contact?.[__CREATE.uuid]?.lastName
      //     }`,
      //     email: contact.entities?.contact?.[__CREATE.uuid]?.additionalEmailList?.[0]?.value,
      //     phone: contact.entities?.contact?.[__CREATE.uuid]?.additionalPhoneList?.[0]?.value,
      //     firstName: contact.entities?.contact?.[__CREATE.uuid]?.firstName,
      //     lastName: contact.entities?.contact?.[__CREATE.uuid]?.lastName,
      //     ownerAvatar: contact.entities?.contact?.[__CREATE.uuid]?.avatar,
      //     ownerDiscProfile: contact.entities?.contact?.[__CREATE.uuid]?.discProfile,
      //   })
      // );
    }
    yield delay(1000);
    const customFieldValues = getCustomFieldValues(state, __CREATE.uuid);
    yield call(api.post, {
      resource: `enterprise-v3.0/customFieldValue/editList`,
      query: {
        objectId: __CREATE.uuid,
      },
      data: {
        customFieldDTOList: customFieldValues,
      },
    });
    if (
      state.entities?.recruitment?.__COMMON_DATA?.currentRecruitmentCase &&
      (state.common?.currentOverviewType === OverviewTypes.RecruitmentActive ||
        state.common?.currentOverviewType === OverviewTypes.RecruitmentClosed)
    ) {
      yield put(fetchRCActiveDataByCaseId(state.entities?.recruitment?.__COMMON_DATA?.currentRecruitmentCase));
    }
  } catch (e) {
    console.log(e);
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}
// Deactivate
function* requestDeactivate({ contactId, name }): Generator<*, *, *> {
  try {
    const response = yield call(api.post, {
      resource: `${contactEndPoints}/deactivate/${contactId}`,
      schema: contactSchema,
      data: null,
      options: {
        headers: {
          'content-type': 'application/json',
        },
      },
    });

    if (response) {
      yield put(ContactActions.succeedDeactivate());
      yield put(OverviewActions.clearHighlightAction(OverviewTypes.Contact));
      yield put(OverviewActions.requestFetch(OverviewTypes.Contact, true));
      yield put(NotificationActions.success('Contact: ' + name + ' was deactivated successfully'));
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}

function* getStatusMsTeamOfContact({ data }) {
  console.log('function*getStatusMsTeamOfContact -> data', data);
  try {
    const { contactId, disableOpenList } = data;
    const statusOfContact = yield call(api.get, {
      resource: `${Endpoints.Contact}/msTeam/checkIfContactExistedInTeams`,
      query: {
        contactId: contactId,
      },
    });

    yield put(ContactActions.setStatusMsTeamsOfContact(statusOfContact.status, statusOfContact.msTeamId));
    if (statusOfContact.msTeamId && !disableOpenList) {
      yield put(ContactActions.showListChannelMsTeam(true));
    }
    // if (statusOfContact.status === STATUS_MSTEAMS_OF_CONTACT.CONTACT_NOT_CONNECTED_TO_USER_IN_TEAMS) {
    //   yield put(OverviewActions.highlight(OverviewTypes.Contact, contactId,  'showInviteToTeam', null));
    // }
  } catch (ex) {}
}

// Get Detail
function* fetchContact({ contactId }: FetchTaskT): Generator<*, *, *> {
  const state = yield select();
  try {
    const lastFetch = state.ui.delegation.lastFetch[contactId] || 0;
    const languageCode = state.ui.app.locale;
    if (lastFetch < Date.now() - 1000) {
      yield put(ContactActions.startFetchContact(contactId));
      const data = yield call(api.get, {
        resource: `${Endpoints.Contact}/getDetails/${contactId}`,
        query: {
          languageCode,
        },
      });

      const dataEntities = normalize(data, contactSchema);

      yield put(
        ContactActions.succeedFetchContact(
          contactId,
          {
            entities: dataEntities.entities,
          },
          data
        )
      );
      // fetch number document of Deal
      const res = yield call(api.get, {
        resource: `${Endpoints.Document}/document/countByObject`,
        query: {
          objectType: 'CONTACT',
          objectId: contactId,
        },
      });
      yield put(ContactActions.updateNumberDocumentDetail(res));
      yield put(updateDocumentObjectId(contactId));
      if (state.common.isConnectMsTeams && data.msTeamId) {
        let _data = {
          data: { contactId: contactId, msTeamId: data.msTeamId, disableOpenList: true },
        };
        yield call(getStatusMsTeamOfContact, _data);
      } else {
        yield put(ContactActions.setStatusMsTeamsOfContact(null, null));
      }
    }
  } catch (e) {
    if (e.message == 'CONTACT_MOVED_TO_OTHER_ACCOUNT') {
      yield put(NotificationActions.error(e.message));
    }
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    } else if (e && e.message === 'CONTACT_DELETED') {
      yield put(OverviewActions.deleteRowSuccess(OverviewTypes.Contact, contactId));
      //DELETE_ROW_SUCCESS
      yield put(ContactActions.failFetchContact(contactId, e.message));
    }
  }
}

function* fetchContactDetailToEdit({ contactId }: FetchTaskT): Generator<*, *, *> {
  const state = yield select();
  try {
    const lastFetch = state.ui.delegation.lastFetch[contactId] || 0;
    const languageCode = state.ui.app.locale;
    if (lastFetch < Date.now() - 1000) {
      yield put(ContactActions.startFetchContact(contactId));
      const data = yield call(api.get, {
        resource: `${Endpoints.Contact}/getDetails/${contactId}`,
        // schema: contactSchema,
        query: {
          languageCode,
        },
      });
      const dataEntities = normalize(data, contactSchema);
      yield put(
        ContactActions.succeedFetchContactToEdit(
          contactId,
          {
            entities: dataEntities.entities,
          },
          data
        )
      );
      yield put(updateDocumentObjectId(contactId));
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    } else if (e && e.message === 'CONTACT_DELETED') {
      yield put(OverviewActions.deleteRowSuccess(OverviewTypes.Contact, contactId));
      //DELETE_ROW_SUCCESS
      yield put(ContactActions.failFetchContact(contactId, e.message));
    }
  }
}
function* createColleague({ contactId }: FetchTaskT): Generator<*, *, *> {
  // yield fetchContact({
  //   contactId
  // });
  const state = yield select();
  // const contact = getContact(state, contactId);
  // const user = getUserProfile(state);
  // yield put(
  //   OverviewActions.createEntity(OverviewTypes.Contact, {
  //     organisation: contact.organisation,
  //     industry: contact.industry,
  //     contact: contact.uuid,
  //     owner: user.uuid,
  //     street: contact.street,
  //     type: contact.type,
  //     zipCode: contact.zipCode,
  //     city: contact.city,
  //     region: contact.region,
  //     country: contact.country,
  //   })
  // );
  const languageCode = state.ui.app.locale;
  const data = yield call(api.get, {
    resource: `organisation-v3.0/${contactId}`,
    query: {
      languageCode,
    },
  });
  if (data) {
    yield put(
      ContactActions.createEntity({
        organisationId: contactId,
        industry: data.industry ? data.industry.uuid : null,
        street: data.street,
        type: data.type ? data.type.uuid : null,
        zipCode: data.zipCode,
        city: data.city,
        region: data.region,
        country: data.country,
      })
    );
  }
}

function* editContact({ contactId }: FetchTaskT): Generator<*, *, *> {
  yield fetchContact({
    contactId,
  });
  yield put(OverviewActions.editEntity(OverviewTypes.Contact, contactId));
}

// Card: Colleagues
function* fetchColleague({ contactId, orderBy, pageIndex }): Generator<*, *, *> {
  try {
    // yield put(OverviewActions.startFetch(OverviewTypes.Contact));
    const state = yield select();
    const contact = getContact(state, contactId);
    const search = getSearch(state, ObjectTypes.Contact);
    if (contact.organisation) {

      // TODO: Implement API Later (2 EndPoints).
      // FIXME: Wrong API
      yield put(ContactActions.startFetchColleague(contactId));
      console.log('fetchColleague pageIndex: ', pageIndex);
      let query = {
        organisationId: contact.organisation,
        // customFilter: search.filter ? search.filter : 'active',
        customFilter: 'active',
        orderBy,
      };
      if (pageIndex != null) {
        query = {
          ...query,
          pageIndex,
          pageSize: PAGE_SIZE_SUBLIST,
        };
      }
      const data = yield call(api.get, {
        resource: `${Endpoints.Contact}/listByOrganisation`,
        schema: contactList,
        query,
      });
      yield put(
        ContactActions.succeedFetchColleague(contactId, {
          entities: data.entities,
          pageIndex,
        })
      );
    }

    // yield put(OverviewActions.succeedFetch(OverviewTypes.Contact, [], false, 0));
  } catch (e) {
    yield put(ContactActions.failFetchColleague(contactId, e.message));
  }
}

// Card: Tasks
function* fetchTasks({ contactId, history, tag, orderBy }): Generator<*, *, *> {
  try {
    // yield put(OverviewActions.startFetch(OverviewTypes.Contact));

    let query = {
      contactId: contactId,
      orderBy: orderBy, // FIXME: Impl - dateAndTime
      pageIndex: 0,
      pageSize: 45,
      showHistory: history,
    };
    if (tag) {
      query.selectedMark = tag;
    }
    const data = yield call(api.get, {
      resource: `${Endpoints.Task}/listByContact`,
      schema: taskList,
      query,
    });
    yield put(
      ContactActions.succeedFetchTasks(contactId, {
        entities: data.entities,
      })
    );
    // yield put(OverviewActions.succeedFetch(OverviewTypes.Contact, [], false, 0));
  } catch (e) {
    console.log(e);
  }
}

const overviewSagas = createOverviewSagas(
  {
    list: `${Endpoints.Contact}/ftsES`,
    count: `${Endpoints.Contact}/countRecordsES`,
  },
  OverviewTypes.Contact,
  ObjectTypes.Contact,
  'contact',
  contactList,
  (requestData) => {
    const { customFilter, orderBy, roleFilterType, roleFilterValue, searchFieldDTOList, ftsTerms } = requestData;
    return {
      customFilter,
      orderBy,
      roleFilterType,
      roleFilterValue,
      searchFieldDTOList,
      searchText: ftsTerms,
    };
  },
  (query) => ({
    ...query,
    excludeLeadType: true,
  })
);
function* updateResponsible({ contactId, userDTOList, overviewType }): Generator<*, *, *> {
  let userIds = userDTOList.map((userDTOList) => {
    return userDTOList.uuid;
  });
  try {
    const state = yield select();
    const data = yield call(api.post, {
      resource: `${Endpoints.Contact}/${contactId}/participant/update`,
      query: {
        userIds: userIds.toString(),
      },
    });
    const user = makeGetUser()(state, userDTOList[0].uuid);
    if (user) {
      yield put(ContactActions.updateResponsibleOneDealSuccess(contactId, user.avatar));
    }
    if (data) {
      yield put(ContactActions.requestFetchColleague(contactId));
      if (overviewType == OverviewTypes.Account_Contact) {
        yield put(refreshOrganisation('contact'));
      }
    }
    const __DETAIL = state.entities.contact.__DETAIL;
    if (__DETAIL && __DETAIL.uuid === contactId) {
      yield fetchContact({ contactId: contactId });
    }
    yield put(NotificationActions.success(_l`Updated`, '', 2000));
    yield put(OverviewActions.clearHighlightAction(overviewType));
  } catch (error) {
    yield put(NotificationActions.error(error.message));
  }
}

export function* deactivateContact({ itemId, overviewType }): Generator<*, *, *> {
  try {
    // if (OverviewTypes.Pipeline.Lead === overviewType) {
    /*   const data = yield call(api.get, {
      resource: `${Endpoints.Contact}/deactivate/${itemId}`,
    });*/
    const data = yield call(api.post, {
      resource: `${Endpoints.Contact}/deactivate/${itemId}`,
      // schema: contactSchema,
      data: null,
      options: {
        headers: {
          'content-type': 'application/json',
        },
      },
    });
    // const {data} = response;
    if (data.objectId != null) {
      let highlightedId = null;
      if (overviewType == OverviewTypes.CallList.SubContact) {
        const state = yield select();
        highlightedId = getHighlighted(state, OverviewTypes.CallList.Contact);
      }

      yield put(OverviewActions.clearHighlight(overviewType, itemId));
      yield put(NotificationActions.success(_l`Deleted`, '', 2000));
      yield put(OverviewActions.deleteRowSuccess(overviewType, itemId));
      if (overviewType == OverviewTypes.Account_Contact) {
        yield put(refreshOrganisation('contact'));
      } else if (overviewType == OverviewTypes.Contact_Contact) {
        yield put(ContactActions.refreshContact('contact'));
      } else if (overviewType == OverviewTypes.CallList.SubContact) {
        // const state = yield select();
        // const highlightedId = getHighlighted(state, OverviewTypes.CallList.Contact);
        yield put(CallListContactActions.deleteRowSuccessContactOnSubList(highlightedId, itemId));
        yield put(OverviewActions.clearHighlight(OverviewTypes.Contact, itemId));
      }

      if (data.haveActiveObject && data.moreUserConnected) {
        yield put(OverviewActions.highlight(overviewType, itemId, 'deactivate_all'));
      }
    }
    // }
  } catch (e) {
    yield put(NotificationActions.error(e.message, '', 2000));
  }
}

export function* deactivateAll({ itemId, overviewType }): Generator<*, *, *> {
  try {
    // if (OverviewTypes.Pipeline.Lead === overviewType) {
    const data = yield call(api.get, {
      resource: `${Endpoints.Contact}/confirmDeactivateAll/${itemId}`,
    });

    if (data === 'SUCCESS') {
      yield put(OverviewActions.clearHighlight(overviewType, itemId));
      yield put(NotificationActions.success(_l`Deleted`, '', 2000));
    }
    // }
  } catch (e) {
    yield put(NotificationActions.error(e.message, '', 2000));
  }
}

export function* refreshContact({ actionType, overviewType }): Generator<*, *, *> {
  const state = yield select();
  try {
    if (actionType === 'note') {
      yield put(OverviewActions.clearHighlightAction(OverviewTypes.Contact_Note));
      yield put(OverviewActions.clearHighlightAction(OverviewTypes.Contact_Order));
      yield put(OverviewActions.clearHighlightAction(OverviewTypes.CallList.SubContact));
      yield put(NotificationActions.success(_l`Updated`, '', 2000));
    } else if (actionType === 'task') {
      yield put(refeshTasks());
    } else if (actionType === 'photo') {
      yield put(OverviewActions.clearHighlightAction(OverviewTypes.Contact_Photo));
      yield put(NotificationActions.success(_l`Updated`, '', 2000));
    } else if (actionType === 'qualified') {
      yield put(OverviewActions.clearHighlightAction(OverviewTypes.Contact_Qualified));
      // yield put(NotificationActions.success(_l`Updated`, '', 2000));
    }
    try {
      const languageCode = state.ui.app.locale;
      const contact = state.entities.contact.__DETAIL;

      const contactRequest = yield call(api.get, {
        resource: `${Endpoints.Contact}/getDetails/${contact.uuid}`,
        query: {
          languageCode,
        },
      });

      const dataEntities = normalize(contactRequest, contactSchema);
      yield put(
        ContactActions.succeedFetchContact(
          contact.uuid,
          {
            entities: dataEntities.entities,
          },
          contactRequest
        )
      );
      if (actionType === 'note') {
        yield put(ContactActions.requestFetchNotes(contact.uuid));
      } else if (actionType === 'photo') {
        yield put(ContactActions.requestFetchContactPhotos(contact.uuid));
      }
      if (actionType === 'unqualified') {
        yield put({ type: ContactActionTypes.FETCH_UNQUALIFIED_REQUEST, contactId: contact.uuid });
      } else if (actionType === 'qualified') {
        yield put({ type: ContactActionTypes.FETCH_QUALIFIED_REQUEST, contactId: contact.uuid });
      } else if (actionType === 'contact') {
        yield put({ type: ContactActionTypes.FETCH_CONTACTS_REQUEST, contactId: contact.uuid });
      } else if (actionType === 'order') {
        yield put({ type: ContactActionTypes.FETCH_ORDER_REQUEST, contactId: contact.uuid });
      } else if (actionType === 'appointment') {
        yield put({ type: ContactActionTypes.FETCH_APPOINTMENT, contactId: contact.uuid, history: false });
      }
    } catch (e) {
      yield put(OrganisationActions.failFetchOrganisation(account.uuid, e.message));
    }
  } catch (e) {
    console.log(e);
  }
}

//fetchNotes
function* fetchNotes({ contactId }): Generator<*, *, *> {
  try {
    // yield put(OverviewActions.startFetch(OverviewTypes.Contact));

    let query = {
      pageIndex: 0,
      pageSize: 45,
    };

    const data = yield call(api.get, {
      resource: `document-v3.0/note/listByContactFull/${contactId}`,
      query,
    });
    const { noteDTOList } = data;
    yield put(ContactActions.successFetchNotes(contactId, noteDTOList));
    // yield put(OverviewActions.succeedFetch(OverviewTypes.Contact, [], false, 0));
  } catch (e) {
    console.log(e);
  }
}

//fetchPhotos
function* fetchPhotosSaga({ contactId }) {
  try {
    // yield put(OverviewActions.startFetch(OverviewTypes.Contact));
    if (contactId == undefined) {
      console.log('contactId', contactId);
      return;
    }
    const data = yield call(api.get, {
      resource: `${documentEndPoints}/photo/listByContact/${contactId}`,
    });
    if (data) {
      const { uploadDTOList } = data;
      yield put(ContactActions.successFetchPhotos(contactId, uploadDTOList));
    }
    // yield put(OverviewActions.succeedFetch(OverviewTypes.Contact, [], false, 0));
  } catch (error) {
    yield put(NotificationActions.error(error.message));
    console.log(e);
  }
}
//fetchAppointment
function* fetchAppointment({ contactId, history, orderBy }): Generator<*, *, *> {
  try {
    // yield put(OverviewActions.startFetch(OverviewTypes.Contact));

    let query = {
      contactId: contactId, // FIXME: Impl - dateAndTime
      pageIndex: 0,
      pageSize: 45,
      showHistory: history,
      updatedDate: 0,
      orderBy: orderBy,
    };

    const data = yield call(api.get, {
      resource: `appointment-v3.0/syncByContact`,
      query,
    });
    const { appointmentDTOList } = data;
    yield put(ContactActions.succeedFetchAppointments(contactId, appointmentDTOList));
    // yield put(OverviewActions.succeedFetch(OverviewTypes.Contact, [], false, 0));
  } catch (e) {
    console.log(e);
  }
}

//fetchOrder
function* fetchOrder({ contactId }): Generator<*, *, *> {
  try {
    // yield put(OverviewActions.startFetch(OverviewTypes.Contact));

    const data = yield call(api.get, {
      resource: `prospect-v3.0/listClosedByContactFull/${contactId}`,
    });
    const orderRowDataCount = yield call(api.get, {
      resource: `prospect-v3.0/orderRow/countListByContact/${contactId}`,
      query: {
        won: true,
      },
    });

    const orderRowData = yield call(api.get, {
      resource: `prospect-v3.0/orderRow/listByContact/${contactId}`,
      query: {
        won: true,
        pageIndex: 0,
        pageSize: 10,
      },
    });
    const { prospectDTOList } = data;
    const { orderRowDTOList } = orderRowData;
    yield put(ContactActions.successFetchContactOrder(contactId, prospectDTOList, orderRowDTOList, orderRowDataCount));
    // yield put(OverviewActions.succeedFetch(OverviewTypes.Contact, [], false, 0));
  } catch (e) {
    console.log(e);
  }
}

//loadmoreOrderRows
function* loadmoreOrderRows({ contactId, pageIndex }): Generator<*, *, *> {
  try {
    const orderRowData = yield call(api.get, {
      resource: `prospect-v3.0/orderRow/listByContact/${contactId}`,
      query: {
        won: true,
        pageIndex,
        pageSize: 10,
      },
    });

    const { orderRowDTOList } = orderRowData;
    yield put(ContactActions.loadMoreOrderRowsSuccess(contactId, orderRowDTOList));
  } catch (e) {
    console.log(e);
  }
}

function* changeOnMultiMenu({ option, optionValue, overviewType }) {
  const state = yield select();
  let overviewT = overviewType == OverviewTypes.Contact_Unqualified_Multi ? OverviewTypes.Contact : overviewType;
  let objectT = ObjectTypes.Contact;
  let customFilterDeault = 'active';
  // let isProspectActive = true;
  // if (overviewType === OverviewTypes.Pipeline.Qualified) {
  //   overviewT = OverviewTypes.Pipeline.Qualified;
  //   objectT = ObjectTypes.PipelineQualified;
  // } else if (overviewType === OverviewTypes.Pipeline.Order) {
  //   overviewT = OverviewTypes.Pipeline.Order;
  //   objectT = ObjectTypes.PipelineOrder;
  //   customFilterDeault = 'history';
  //   isProspectActive = false;
  // }
  // if (overviewType === OverviewTypes.Delegation.Lead) {
  //   overviewT = OverviewTypes.Delegation.Lead;
  //   objectT = ObjectTypes.DelegationLead;
  // }

  try {
    const overview = getOverview(state, overviewT);
    const search = getSearch(state, objectT);
    // const period = getPeriod(state, objectT);
    const { searchFieldDTOList } = getSearchForSave(state, objectT);
    // const isFilterAll = period.period === 'all';
    const { roleType } = state.ui.app;
    let ownerId = state.ui.app.activeRole;
    let roleValue = state.ui.app.activeRole;
    if (roleType === 'Person' && !ownerId) {
      ownerId = state.auth.userId;
    } else if (roleType === 'Company') {
      ownerId = undefined;
    }
    if (roleType === 'Person' && !roleValue) {
      roleValue = state.auth.userId;
    } else if (roleType === 'Company') {
      roleValue = undefined;
    }
    const filterDTO = {
      // startDate: isFilterAll ? null : new Date(period.startDate).getTime(),
      // endDate: isFilterAll ? null : new Date(period.endDate).getTime(),
      // isFilterAll,
      roleFilterType: roleType,
      roleFilterValue: roleValue,
      customFilter: search.filter ? search.filter : customFilterDeault,
      orderBy: search.orderBy ? search.orderBy : 'closedSales',
      // isRequiredOwner: true,
      // ftsTerms: search.term,
      searchFieldDTOList: search.shown ? searchFieldDTOList : [],
      searchText: search.term,
      // salesProcessIds: [],
      // selectedMark: search.tag,
    };

    const { selectAll, selected, itemCount } = overview;
    const isSelectedAll = selectAll;
    let contactIds = [];
    let unSelectedIds = [];
    const keys = Object.keys(selected);
    let numItemSelect = 0;

    if (isSelectedAll) {
      contactIds = [];
      unSelectedIds = keys.filter((key) => selected[key] === false);
      numItemSelect = itemCount && itemCount - unSelectedIds.length;
    } else {
      contactIds = keys.filter((key) => selected[key] === true);
      numItemSelect = contactIds.length;
    }
    let request = null;
    let payload = {
      filterDTO,
      isSelectedAll,
      contactIds,
      unSelectedIds,
      // isProspectActive: isProspectActive,
    };
    if (option === 'change_reponsible') {
      let userIDS = optionValue.map((optionValue) => {
        return optionValue.uuid;
      });
      request = call(api.post, {
        resource: `${Endpoints.Contact}/changeTeamInBatch`,
        data: {
          ...payload,
          userIds: userIDS,
        },
        query: {
          timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'add_to_mailchimp_list') {
      request = call(api.post, {
        resource: `${Endpoints.Contact}/sendMailChimpInBatch`,
        data: {
          ...payload,
          mailChimp: {
            apikey: optionValue.apikey,
            listId: optionValue.value,
          },
        },
        query: {
          sessionKey: generateUuid(),
          timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'delete_multi') {
      request = call(api.post, {
        resource: `${Endpoints.Contact}/deleteInBatch`,
        data: {
          ...payload,
        },
        query: {
          sessionKey: generateUuid(),
          timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'export_to_excel') {
      let filterDTOCus0 = { ...filterDTO, listIds: contactIds };
      let filterDTOCus = { ...payload, filterDTO: filterDTOCus0 };
      filterDTOCus.isRequiredOwner = false;
      filterDTOCus.isShowHistory = filterDTO.customFilter == 'history';
      request = call(api.get, {
        resource: `${Endpoints.Contact}/exportAdvancedSearchBySelected`,
        query: {
          filterDTO: JSON.stringify(filterDTOCus),
          // leadFrom: overviewType === OverviewTypes.Pipeline.Qualified ? 'lead_delegation' : 'lead',
          // timeZone: new Date().getTimezoneOffset() / -60,
          timeZone: getCurrentTimeZone(),

        },
      });
    } else if (option === 'set_done_multi') {
      request = call(api.post, {
        resource: `${Endpoints.Contact}/setDoneInBatch`,
        data: {
          ...payload,
        },
        query: {
          sessionKey: generateUuid(),
          timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'update_data_fields') {
      let updatedCustomFieldDTOList = [];
      const customFields = getCustomFieldsObject(state);
      customFields.forEach((customField) => {
        const { customFieldValueDTOList } = customField;
        if (customFieldValueDTOList.length > 0) {
          if (customField.fieldType === 'DROPDOWN') {
            const checkForValueSelected = customFieldValueDTOList.filter((value) => {
              return value.isChecked === true;
            });
            if (checkForValueSelected.length > 0) {
              updatedCustomFieldDTOList.push(customField);
            }
          } else {
            updatedCustomFieldDTOList.push(customField);
          }
        }
      });

      const timezone = new Date().getTimezoneOffset() / -60;
      request = call(api.post, {
        resource: `${Endpoints.Contact}/updateDataField`,
        query: {
          timeZone: getCurrentTimeZone(),
        },
        data: {
          ...payload,
          updatedCustomFieldDTOList: updatedCustomFieldDTOList,
          updatedStandardFieldDTO: {
            ...optionValue,
          },
        },
      });
    } else if (option === 'add_to_call_list') {
      request = call(api.post, {
        resource: `${Endpoints.Contact}/sendCallListInBatch`,
        query: {
          sessionKey: generateUuid(),
          timeZone: getCurrentTimeZone(),
        },
        data: {
          filterDTO,
          isSelectedAll,
          contactIds,
          sendCallList: {
            ...optionValue,
          },
        },
      });
    } else if (option === 'assign_multi_unqualified_to_me') {
      request = call(api.post, {
        resource: `${Endpoints.Contact}/assignToMeInBatch`,
        query: {
          sessionKey: uuid(),
          timeZone: getCurrentTimeZone(),
        },
        data: {
          ...payload,
        },
      });
    } else if (option === 'assign_multi_unqualified') {
      request = call(api.post, {
        resource: `${Endpoints.Contact}/assignInBatch`,
        query: {
          sessionKey: uuid(),
          timeZone: getCurrentTimeZone(),
        },
        data: {
          ...payload,
        },
      });
    } else if (option === 'contact_qualified_multi') {
      request = call(api.post, {
        resource: `${Endpoints.Contact}/addOppInBatch`,
        query: {
          // timeZone: '+0700',
          timeZone: getCurrentTimeZone(),
        },
        data: {
          filterDTO,
          isSelectedAll,
          contactIds,
          addedProspectDTO: {
            ...state.entities.qualifiedDeal.__CREATE,
          },
        },
      });
    } else if (option === 'add_multi_unqualified') {
      const _CREATE = getCreateUnqualifiedDeal(state);
      if (_CREATE.productList === null) delete _CREATE.productList;
      request = call(api.post, {
        resource: `${Endpoints.Contact}/addLeadInBatch`,
        data: {
          ...payload,
          addedLeadDTO: {
            ..._CREATE,
            ownerId: _CREATE.ownerId ? _CREATE.ownerId : state.auth.userId,
          },
        },
        query: {
          timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'contact_order_multi') {
      const { orderRowCustomFieldDTOList } = state.entities.qualifiedDeal.__ORDER_CREATE;
      if (orderRowCustomFieldDTOList && orderRowCustomFieldDTOList.length > 0) {
        request = call(api.post, {
          resource: `${Endpoints.Contact}/addOrderInBatch`,
          query: {
            // timeZone: '+0700',
            timeZone: getCurrentTimeZone(),
          },
          data: {
            filterDTO,
            isSelectedAll,
            contactIds,
            addedProspectDTO: {
              ...state.entities.qualifiedDeal.__ORDER_CREATE,
            },
          },
        });
      } else {
        yield put(NotificationActions.error(_l`Cannot add order without products`));
        return;
      }
    }
    const data = yield request;
    let message = '';
    if (option === 'export_to_excel') {
      if (data) {
        const { fileUrl, sendEmail } = data;
        if (sendEmail) {
          message = `${_l`You will receive an email when the export file is ready for download`}`;
          return yield put(NotificationActions.success(_l`${message}`));
        } else {
          return yield put({ type: 'DOWNLOAD', downloadUrl: fileUrl });
        }
      }
    }

    // let message = '';
    switch (option) {
      case 'change_reponsible':
        message = `${_l`Updated`}`;
        break;
      case 'add_to_mailchimp_list':
        message = `${_l`Total contacts added to the Mailchimp list:`} ${data.result ? data.result.countSuccess : 0}`;
        break;
      case 'delete_multi':
        // if (data.indexOf('TASK_EXECUTION_IN_BACKGROUND') > -1) {
        message = `${_l`Updated`}`;
        // }else {
        //   message = _l`Mass updates may take time to be available for search and in lists.`;
        //
        // }
        break;
      case 'set_done_multi':
        message = `${_l`Updated`}`;
        break;
      case 'update_data_fields':
        message = `${_l`Updated`}`;
        break;
      case 'add_to_call_list':
        message = `${_l`Updated`}`;
        break;
      case 'add_multi_unqualified':
        // message = `${_l`Updated`}`;
        if (numItemSelect > 30) {
          message = 'You will get an email when your deals are added.';
        } else {
          message = 'You will receive an email after the update is done';
        }
        break;
      case 'contact_qualified_multi':
        message = `${_l`Updated`}`;
        break;
      case 'contact_order_multi':
        message = `${_l`Updated`}`;
        break;
      default:
        break;
    }

    if (data.message === 'SUCCESS' || data.isSuccess || data === 'SUCCESS' || data.code == 200) {
      yield put(OverviewActions.requestFetch(overviewT, true));
      yield put(OverviewActions.clearHighlightAction(overviewT));
      switch (option) {
        case 'delete_multi':
        case 'set_done_multi':
          yield put(OverviewActions.setSelectAll(overviewT, false));
          break;
        case 'assign_multi_unqualified':
          yield put(OverviewActions.setSelectAll(overviewT, false));
          break;
        case 'add_multi_unqualified':
          yield put(OverviewActions.clearHighlightAction(overviewType));
          yield put(ContactActions.refreshContact('unqualified'));
          yield put(UnqualifiedDealActions.clearCreateEntity());
          break;
        default:
          break;
      }
      if (
        option === 'assign_multi_unqualified_to_me' ||
        option == 'assign_multi_unqualified' ||
        option == 'change_reponsible' ||
        option == 'add_to_call_list' ||
        option == 'update_data_fields' ||
        option == 'set_done_multi' ||
        option == 'delete_multi'
      ) {
        return yield put(NotificationActions.success(_l`Updated`, '', 2000));
      }

      if (option === 'contact_qualified_multi') {
        yield put(OverviewActions.clearHighlightAction('CONTACT_QUALIFIED_MULTI'));
        yield put(clearQualified());
        yield put(clear());
        yield put(create());
      }

      if (option === 'contact_order_multi') {
        yield put(OverviewActions.clearHighlightAction('CONTACT_ORDER_MULTI'));
        yield put(clearQualified('__ORDER_CREATE'));
        yield put(clear());
        yield put(create());
        // return yield put(NotificationActions.success(_l`Updated`, '', 2000));
      }
      if (option === 'add_to_mailchimp_list') {
        return yield put(NotificationActions.success(message, null, null, true));
      }
      // return yield put(NotificationActions.success(_l`${message}`));
      return yield put(NotificationActions.success(_l`Updated`, '', 2000));
    } else {
      if (option === 'add_to_mailchimp_list') {
        yield put(OverviewActions.clearHighlightAction(overviewT));
        return yield put(NotificationActions.success(message, null, null, true));
      }
    }
  } catch (e) {
    if (option === 'add_to_mailchimp_list') {
      // return yield put(NotificationActions.success(message, null, null, true));
      yield put(OverviewActions.clearHighlightAction(overviewT));
    }
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}

function* addContactToCalllist({ callListContactId, overviewType, contactIds }): Generator<*, *, *> {
  const dataDTO = {
    contactIds: contactIds,
    callListContactId: callListContactId,
    removeContactIds: [],
  };
  const data = yield call(api.post, {
    resource: `${Endpoints.CallList}/callListContact/addContatcsToCallList`,
    data: dataDTO,
  });
  if (data.isSuccess) {
    let highlightedId = null;
    if (overviewType == OverviewTypes.CallList.SubContact) {
      const state = yield select();
      highlightedId = getHighlighted(state, OverviewTypes.CallList.Contact);
    }

    yield put(ContactActions.updateCalllistInContact(data.result.callList));
    yield put(OverviewActions.clearHighlight(overviewType));
    yield put(NotificationActions.success(_l`Added`, '', 2000));
    if (overviewType == OverviewTypes.CallList.SubContact) {
      yield put(OverviewActions.requestFetch(OverviewTypes.CallList.Contact, true));
      yield delay(1000);
      yield put(CallListContactActions.getContactOnCallList(highlightedId, 0, 'firstName'));
    }
    if (overviewType === OverviewTypes.CallList.Contact && data.result.addedCallListContacts) {
      // FIX BUG HEREEE
      // yield put(CallListContactActions.addContactToCallListContact(callListContactId, data.result.addedCallListContacts));

      // Uncomment here to rolback
      yield put(OverviewActions.requestFetch(OverviewTypes.CallList.Contact, true));
      yield delay(1000);
      yield put(CallListContactActions.getContactOnCallList(callListContactId, 0, 'firstName'));
    }
  }
}
function* fetchUnqualified({ contactId }): Generator<*, *, *> {
  try {
    // yield put(OverviewActions.startFetch(OverviewTypes.Contact));

    let query = {
      contactId: contactId,
    };

    const data = yield call(api.get, {
      resource: `lead-v3.0/listByContactAndYear`,
      query,
    });
    const { leadDTOList } = data;
    yield put(ContactActions.successFetchContactUnqualified(contactId, leadDTOList));
    // yield put(OverviewActions.succeedFetch(OverviewTypes.Contact, [], false, 0));
  } catch (e) {
    console.log(e);
  }
}
//fetchQualified
function* fetchQualified({ contactId }): Generator<*, *, *> {
  try {
    // yield put(OverviewActions.startFetch(OverviewTypes.Contact));

    if (contactId) {
      const data = yield call(api.get, {
        resource: `prospect-v3.0/listByContact/${contactId}`,
      });
      const { prospectDTOList } = data;
      yield put(ContactActions.successFetchContactQualified(contactId, prospectDTOList));
      // yield put(OverviewActions.succeedFetch(OverviewTypes.Contact, [], false, 0));
    }
  } catch (e) {
    console.log(e);
  }
}

//removeCallListInAccount
export function* removeCallListInContact({ contactId, callListContactId }): Generator<*, *, *> {
  try {
    const callListEndPoints = 'call-lists-v3.0';
    const result = yield call(api.get, {
      resource: `${callListEndPoints}/callListContact/removeFromList`,
      query: {
        contactId,
        callListContactId,
      },
    });
    yield put(OverviewActions.clearHighlightAction(OverviewTypes.Contact));
    yield put(ContactActions.removeCallListInSuccess(contactId, callListContactId));
  } catch (e) {}
}

let __timeCheckMissingEmail = 0;
function* checkMissingEmailByUser() {
  try {
    if (__timeCheckMissingEmail < Date.now() - 60 * 60 * 1000) {
      __timeCheckMissingEmail = Date.now();
      yield call(api.get, {
        resource: `${Endpoints.Contact}/checkMissingEmailByUser`,
      });
    }
  } catch (ex) {
    console.log('function*checkMissingEmailByUser -> ex', ex);
  }
}
export default function* saga(): Generator<*, *, *> {
  // DropDown
  yield fork(queueFetchDropdownForOrganisation);

  // Actions
  yield takeLatest(ContactActionTypes.TOGGLE_FAVORITE_REQUEST, toggleFavoriteRequest);
  yield takeLatest(ContactActionTypes.CREATE_REQUEST, requestCreate);
  yield takeLatest(ContactActionTypes.UPDATE_REQUEST, requestUpdate);
  yield takeLatest(ContactActionTypes.DEACTIVATE_REQUEST, requestDeactivate);

  // Get Detail
  yield takeLatest(ContactActionTypes.FETCH_CONTACT_REQUEST, fetchContact);
  yield takeLatest(ContactActionTypes.FETCH_CONTACT_DETAIL_TO_EDIT, fetchContactDetailToEdit);

  // Cards
  yield takeLatest(ContactActionTypes.FETCH_COLLEAGUE_REQUEST, fetchColleague);
  yield takeLatest(ContactActionTypes.FETCH_TASKS_REQUEST, fetchTasks);

  // Edit?
  // TODO: Where to be used?
  yield takeLatest(ContactActionTypes.EDIT_CONTACT, editContact);
  yield takeLatest(ContactActionTypes.UPDATE_RESPONSIBLE_ONE_DEAL, updateResponsible);
  yield takeLatest(ContactActionTypes.CHANGE_ON_MULTI_ORGANISATION_MENU, changeOnMultiMenu);

  // Action:
  yield takeLatest(ContactActionTypes.CREATE_COLLEAGUE, createColleague);

  //REFESH_CONTACT
  yield takeLatest(ContactActionTypes.REFESH_CONTACT, refreshContact);
  yield takeLatest(ContactActionTypes.DELETE_ROW, deactivateContact);
  yield takeLatest(ContactActionTypes.DEACTIVATE_ALL, deactivateAll);

  yield takeLatest(ContactActionTypes.FETCH_NOTES_REQUEST, fetchNotes);
  yield takeLatest(ContactActionTypes.FETCH_PHOTOS_REQUEST, fetchPhotosSaga);
  yield takeLatest(ContactActionTypes.FETCH_APPOINTMENT, fetchAppointment);
  yield takeLatest(ContactActionTypes.FETCH_ORDER_REQUEST, fetchOrder);
  yield takeLatest(ContactActionTypes.LOAD_MORE_ORDER_ROWS, loadmoreOrderRows);
  yield takeLatest(ContactActionTypes.FETCH_UNQUALIFIED_REQUEST, fetchUnqualified);
  yield takeLatest(ContactActionTypes.FETCH_QUALIFIED_REQUEST, fetchQualified);
  yield takeLatest(ContactActionTypes.ADD_CONTACT_TO_CALLLIST, addContactToCalllist);
  //REMOVE_CALL_LIST_IN_ACCOUNT
  yield takeLatest(ContactActionTypes.REMOVE_CALL_LIST_IN_CONTACT, removeCallListInContact);
  yield takeLatest(ContactActionTypes.CHECK_CONTACT_EXISTED_TEAMS, getStatusMsTeamOfContact);
  yield takeLatest(ContactActionTypes.CHECK_MISSING_EMAIL_BY_USER, checkMissingEmailByUser);
  yield all(overviewSagas);
}

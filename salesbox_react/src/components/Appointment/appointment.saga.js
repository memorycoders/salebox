//@flow
import { all, call, put, takeLatest, select, cancel, take, fork } from 'redux-saga/effects';
import api from 'lib/apiClient';
import createOverviewSagas from 'components/Overview/overview.saga';
import { ObjectTypes, OverviewTypes, Endpoints } from 'Constants';
import AppointmentActionTypes, * as AppointmentActions from './appointment.actions';
import { appointmentList, appointmentSchema } from './appointment.schema';
import * as OverviewActions from 'components/Overview/overview.actions';
import ActionTypesNote, { requestFetchTask } from '../Delegation/delegation.actions';
import { normalize, schema } from 'normalizr';
import { getOverview } from '../../components/Overview/overview.selectors';
import { getSearch, getSearchForSave } from 'components/AdvancedSearch/advanced-search.selectors';
import { getPeriod } from 'components/PeriodSelector/period-selector.selectors';
import * as NotificationActions from '../../components/Notification/notification.actions';
import _l from 'lib/i18n';
import { getCurrentTimeZone } from 'lib/common';
import uuid from 'uuid/v4';
import { organisationItem, refreshOrganisation } from '../Organisation/organisation.actions';
import { contactItem, refreshContact } from '../Contact/contact.actions';
import { getCustomFieldsObject, getCustomFieldValues } from '../CustomField/custom-field.selectors';
import { leadSchema } from '../Lead/lead.schema';
import ActionUnqualifiedDealTypes from '../PipeLineUnqualifiedDeals/unqualifiedDeal.actions';
import { refeshQualifiedDeal } from '../PipeLineQualifiedDeals/qualifiedDeal.actions';
import * as OrganisationActions from '../../components/Organisation/organisation.actions';
import { delay } from 'redux-saga';
import { isTimeBefore, isEndOfDayPopup } from '../../lib/common';
import { refeshUnqualifiedDetail } from '../PipeLineUnqualifiedDeals/unqualifiedDeal.actions';
import moment from 'moment';
import { addInfoFlashMessage } from '../FlashMessages/flashMessage.action';
import { fetchTaskNotification } from '../Task/task.saga';

function* fetchAppointment({ appointmentId }: FetchTaskT): Generator<*, *, *> {
  try {
    yield put(AppointmentActions.startFetchAppointment(appointmentId));
    const data = yield call(api.get, {
      resource: `${Endpoints.Appointment}/${appointmentId}`,
    });
    const dataEntities = normalize(data, appointmentSchema);
    yield put(
      AppointmentActions.succeedFetchAppointment(
        appointmentId,
        {
          entities: dataEntities.entities,
        },
        data
      )
    );
    if (data.leadId != null) {
      const unqualified = yield call(api.get, {
        resource: `${Endpoints.Lead}/getDetails/${data.leadId}`,
      });

      yield put({
        type: ActionUnqualifiedDealTypes.FETCH_SUCCESS,
        unqualifiedDealId: data.leadId,
        unqualified,
      });
    }
  } catch (e) {
    yield put(AppointmentActions.failFetchAppointment(appointmentId, e.message));
  }
}

const overviewSagas = createOverviewSagas(
  {
    list: `${Endpoints.Appointment}/countAppointmentByTimePeriod`,
    count: `${Endpoints.Appointment}/countRecords`,
  },
  OverviewTypes.Activity.Appointment,
  ObjectTypes.Appointment,
  'appointment',
  appointmentList,
  (requestData) => {
    // eslint-disable-next-line no-unused-vars
    const { isRequiredOwner, selectedMark, ftsTerms, showHistory, ...other } = requestData;
    return {
      ...other,
      searchText: ftsTerms,
      isShowHistory: showHistory,
    };
  }
);

export function* updateNote({ appointmentId, note }): Generator<*, *, *> {
  try {
    const state = yield select();
    const __DETAIL = state.entities.appointment.__DETAIL;
    const timezone = new Date().getTimezoneOffset() / -60;

    yield call(api.post, {
      resource: `appointment-v3.0/update`,
      query: {
        timezone: getCurrentTimeZone(),
      },
      data: {
        ...__DETAIL,
        note,
      },
    });
    yield put({ type: AppointmentActionTypes.CHANGE_NOTE, appointmentId, note });
    yield put({ type: ActionTypesNote.HIDE_ADDNOTE_FORM });
  } catch (e) {
    console.log(e);
  }
}

function* changeOnMultiAppointmentMenu({ option, optionValue, overviewType }) {
  const state = yield select();
  let overviewT = OverviewTypes.Activity.Appointment;
  let objectT = ObjectTypes.Appointment;

  try {
    const overview = getOverview(state, overviewT);
    const search = getSearch(state, objectT);
    const period = getPeriod(state, objectT);
    const { searchFieldDTOList } = getSearchForSave(state, objectT);
    const isFilterAll = period.period === 'all';
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
      startDate: isFilterAll ? null : new Date(period.startDate).getTime(),
      endDate: isFilterAll ? null : new Date(period.endDate).getTime(),
      isFilterAll,
      roleFilterType: roleType,
      roleFilterValue: roleValue,
      customFilter: 'listView',
      orderBy: search.orderBy ? search.orderBy : 'dateAndTime',
      searchFieldDTOList: search.shown ? searchFieldDTOList : [],
      isShowHistory: search.filter === 'history',
      searchText: '',
    };
    const assignTaskDTO = {
      note: optionValue ? optionValue.note : '',
      userId: state.auth.userId,
    };

    const { selectAll, selected } = overview;
    const isSelectedAll = selectAll;
    let appointmentIds = [];
    let unSelectedIds = [];
    const keys = Object.keys(selected);
    if (isSelectedAll) {
      appointmentIds = [];
      unSelectedIds = keys.filter((key) => selected[key] === false);
    } else {
      appointmentIds = keys.filter((key) => selected[key] === true);
    }
    let request = null;
    let payload = {
      filterDTO,
      isSelectedAll,
      appointmentIds,
      unSelectedIds,
      // assignTaskDTO,
    };
    if (option === 'change_reponsible') {
      request = call(api.post, {
        resource: `${Endpoints.Appointment}/changeOwnerInBatch`,
        data: {
          ownerId: optionValue,
          ...payload,
        },
        query: {
          timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'add_to_mailchimp_list') {
      request = call(api.post, {
        resource: `${Endpoints.Appointment}/sendMailChimpInBatch`,
        data: {
          ...payload,
          sendMailChimpDTO: {
            apikey: optionValue.apikey,
            listId: optionValue.value,
          },
        },
        query: {
          timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'delete_multi') {
      request = call(api.post, {
        resource: `${Endpoints.Appointment}/deleteInBatch`,
        data: {
          ...payload,
        },
        query: {
          timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'export_to_excel') {
      let filterDTOCus0 = { ...filterDTO,  listIds: appointmentIds};
      let filterDTOCus = {...payload, filterDTO: filterDTOCus0};
      filterDTOCus.isRequiredOwner = false;
      filterDTOCus.isShowHistory = search.filter === 'history';
      request = call(api.get, {
        resource: `${Endpoints.Appointment}/exportAdvancedSearchBySelected`,
        query: {
          filterDTO: JSON.stringify(filterDTOCus),
          timeZone: new Date().getTimezoneOffset() / -60,
          // timeZone: getCurrentTimeZone(),

        },
      });
    } else if (option === 'set_done_tasks') {
      request = call(api.post, {
        resource: `${Endpoints.Appointment}/setDoneInBatch`,
        data: {
          ...payload,
        },
        query: {
          timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'update_data_fields') {
      const contacts = state.entities.contactDropdown || {};
      let customFieldDTOList = [];
      const customFields = getCustomFieldsObject(state);

      customFields.forEach((customField) => {
        const { customFieldValueDTOList } = customField;
        if (customFieldValueDTOList.length > 0) {
          if (customField.fieldType === 'DROPDOWN') {
            const checkForValueSelected = customFieldValueDTOList.filter((value) => {
              return value.isChecked === true;
            });
            if (checkForValueSelected.length > 0) {
              customFieldDTOList.push(customField);
            }
          } else {
            customFieldDTOList.push(customField);
          }
        }
      });

      let standardFieldDTO = {
        inviteeList: {
          communicationInviteeDTOList: (optionValue.emailList ? optionValue.emailList : []).map((e) => {
            return {
              value: e,
            };
          }),
          contactInviteeDTOList: (optionValue.inviteeList ? optionValue.inviteeList : [])
            .filter((i) => {
              const right = contacts[i];
              if (!right) return false;
              return i;
            })
            .map((i) => {
              const right = contacts[i];
              if (!right) return false;
              return {
                email: right.email,
                firstName: right.firstName,
                lastName: right.lastName,
                phone: right.phone,
                uuid: right.uuid,
              };
            }),
        },
      };
      if (optionValue.focusWorkDataId) {
        standardFieldDTO.focusWorkDataId = optionValue.focusWorkDataId;
      }
      if (optionValue.note) {
        standardFieldDTO.note = optionValue.note;
      }
      if (optionValue.location) {
        standardFieldDTO.location = optionValue.location;
      }

      request = call(api.post, {
        resource: `${Endpoints.Appointment}/updateDataFieldInBatch`,
        data: {
          ...payload,
          customFieldDTOList,
          standardFieldDTO,
        },
        query: {
          timeZone: getCurrentTimeZone(),
        },
      });
    } else if (option === 'add_to_call_list') {
      request = call(api.post, {
        resource: `${Endpoints.Appointment}/sendCallListInBatch`,
        query: {
          timeZone: getCurrentTimeZone(),
          sessionKey: uuid(),
        },
        data: {
          ...payload,
          sendCallListDTO: {
            ...optionValue,
          },
        },
      });
    } else if (option === 'assign_multi_task_to_me') {
      request = call(api.post, {
        resource: `${Endpoints.Appointment}/assignToMeInBatch`,
        query: {
          sessionKey: uuid(),
          timeZone: getCurrentTimeZone(),
        },
        data: {
          ...payload,
        },
      });
    } else if (option === 'assign_multi_task') {
      request = call(api.post, {
        resource: `${Endpoints.Appointment}/assignInBatch`,
        query: {
          sessionKey: uuid(),
          timeZone: getCurrentTimeZone(),
        },
        data: {
          ...payload,
        },
      });
    }
    const data = yield request;
    let message = '';
    if (option === 'export_to_excel') {
      if(data) {
        const { fileUrl, sendEmail } = data;
        if (sendEmail) {
          message = `${_l`You will receive an email when the export file is ready for download`}`;
          return yield put(NotificationActions.success(_l`${message}`));
        } else {
          return yield put({ type: 'DOWNLOAD', downloadUrl: fileUrl });
        }
      }

    }


    switch (option) {
      case 'change_reponsible':
        message = `${_l`Updated`}`;
        break;
      case 'add_to_mailchimp_list':
        message = `${_l`Total contacts added to the Mailchimp list:`} ${data.result ? data.result.countSuccess : 0}`;
        break;
      case 'delete_tasks':
        message = `${_l`Updated`}`;
        break;
      case 'set_done_tasks':
        message = `${_l`Updated`}`;
        break;
      case 'update_data_fields':
        message = `${_l`Updated`}`;
        break;
      case 'add_to_call_list':
        message = `${_l`Updated`}`;
        break;
      default:
        break;
    }

    if (data.message === 'SUCCESS' || data.isSuccess) {
      yield put(OverviewActions.requestFetch(overviewT, true));
      yield put(OverviewActions.clearHighlightAction(overviewT));

      switch (option) {
        case 'assign_multi_task':
          yield put(OverviewActions.setSelectAll(overviewT, false));
          break;
        default:
          break;
      }
      if (option) {
        return yield put(NotificationActions.success(`${_l`Updated`}`, '', 2000));
      }
      //  else if (option === 'assign_multi_task_to_me' || option === 'assign_multi_task') {
      //   return yield put(NotificationActions.success(`${_l`Updated`}`, '', 2000));
      // }
      // return yield put(NotificationActions.success(_l`${message}`));
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}

function* editAppointment({ appointmentId }: FetchTaskT): Generator<*, *, *> {
  try {
    yield put(AppointmentActions.startFetchAppointment(appointmentId));
    const data = yield call(api.get, {
      resource: `${Endpoints.Appointment}/${appointmentId}`,
    });
    if (data) {
      yield put(organisationItem(data.organisation));
      yield put(contactItem(data.contactList));
      yield put(AppointmentActions.editEntity(data));
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}

function* deleteAppointment({ appointmentId, overviewType }): Generator<*, *, *> {
  try {
    const data = yield call(api.get, {
      resource: `${Endpoints.Appointment}/delete/${appointmentId}`,
    });
    if (data === 'SUCCESS') {
      yield put(OverviewActions.clearHighlight(overviewType, appointmentId));
      yield put(NotificationActions.success(_l`Deleted`, '', 2000));
      if (overviewType === OverviewTypes.Activity.Appointment)
        yield put(OverviewActions.deleteRowSuccess(overviewType, appointmentId));
      else if (overviewType === OverviewTypes.Account_Appointment) {
        yield put(refreshOrganisation('appointment'));
      } else if (overviewType === OverviewTypes.Contact_Appointment) {
        yield put(refreshContact('appointment'));
      } else if (overviewType === OverviewTypes.Pipeline.Qualified_Appointment) {
        yield put(refeshQualifiedDeal('appointment'));
      } else if (overviewType === OverviewTypes.Pipeline.Lead_Appointment) {
        yield put(refeshUnqualifiedDetail('appointment'));
      }
    }
  } catch (e) {
    yield put(NotificationActions.error(e.message));
    if (e && e.message === 'UNSPECIFIED_ERROR') {
      yield put(NotificationActions.error(_l`Oh, something went wrong`));
    }
  }
}

function* updateCustomField(overviewType, appointmentId) {
  const state = yield select();
  let overviewT = OverviewTypes.Activity.Appointment;
  let objectT = ObjectTypes.Appointment;

  const overview = getOverview(state, overviewT);
  const search = getSearch(state, objectT);
  const period = getPeriod(state, objectT);
  const { searchFieldDTOList } = getSearchForSave(state, objectT);
  const isFilterAll = period.period === 'all';
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
    startDate: isFilterAll ? null : new Date(period.startDate).getTime(),
    endDate: isFilterAll ? null : new Date(period.endDate).getTime(),
    isFilterAll,
    roleFilterType: roleType,
    roleFilterValue: roleValue,
    customFilter: 'listView',
    orderBy: search.orderBy ? search.orderBy : 'dateAndTime',
    searchFieldDTOList: search.shown ? searchFieldDTOList : [],
    isShowHistory: search.filter === 'history',
    searchText: '',
  };

  let payload = {
    filterDTO,
    isSelectedAll: false,
    appointmentIds: [appointmentId],
    unSelectedIds: [],
    // assignTaskDTO,
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

    yield call(api.post, {
      resource: `${Endpoints.Appointment}/updateDataFieldInBatch`,
      query: {
        timeZone: getCurrentTimeZone(),
      },
      data: {
        ...payload,
        customFieldDTOList: updatedCustomFieldDTOList,
        standardFieldDTO: {},
      },
    });
  } catch (error) {}
}

function* createRequest({ overviewType }) {
  const state = yield select();
  const __CREATE = state.entities.appointment.__CREATE;
  const contacts = state.entities.contactDropdown || {};
  const invitees = __CREATE.invitees;
  try {
    const payload = {
      title: __CREATE.title,
      endDate: __CREATE.endDate ? __CREATE.endDate : new Date(Date.now() + 30 * 60 * 1000).getTime(),
      startDate: __CREATE.startDate ? __CREATE.startDate : new Date().getTime(),
      owner: __CREATE.responsible ? { uuid: __CREATE.responsible } : { uuid: state.auth.userId },
      note: __CREATE.note || null,
      location: __CREATE.location || '',
      contactList: (__CREATE.contacts ? __CREATE.contacts : []).map((c) => {
        const right = contacts[c];
        if (right) {
          return {
            email: right.email,
            firstName: right.firstName,
            lastName: right.lastName,
            phone: right.phone,
            uuid: right.uuid,
          };
        }
      }),
      focusWorkData: __CREATE.focus ? { uuid: __CREATE.focus } : null,
      organisation: __CREATE.organisation ? { uuid: __CREATE.organisation } : null,
      inviteeList: {
        communicationInviteeDTOList: (__CREATE.emailList ? __CREATE.emailList : []).map((e) => {
          return {
            value: e,
          };
        }),
        contactInviteeDTOList: (invitees ? invitees : [])
          .filter((i) => {
            const right = contacts[i];
            if (!right) return false;
            return i;
          })
          .map((i) => {
            const right = contacts[i];
            if (!right) return false;
            return {
              email: right.email,
              firstName: right.firstName,
              lastName: right.lastName,
              phone: right.phone,
              uuid: right.uuid,
            };
          }),
      },
    };

    if (__CREATE.contacts && __CREATE.contacts.length > 0) {
      const firstId = __CREATE.contacts[0];
      const right = contacts[firstId] || {};
      payload.firstContactId = right.uuid;
    }

    if (__CREATE.prospect && __CREATE.prospect.leadId) {
      payload.leadId = __CREATE.prospect.leadId;
    }

    if (__CREATE.prospect && __CREATE.prospect.prospectId) {
      payload.prospect = { uuid: __CREATE.prospect.prospectId };
    }

    if (__CREATE.teams === 'teams') {
      payload.onlineMeeting = true;
      payload.location = null;
    }
    const res = yield call(api.post, {
      resource: `${Endpoints.Appointment}/add`,
      data: payload,
      query: {
        timezone: getCurrentTimeZone(),
      },
    });
    if (res) {
      yield updateCustomField(overviewType, res.uuid);
      yield put(OverviewActions.clearHighlight(overviewType));
      yield put(NotificationActions.success(_l`Added`, '', 2000));
      yield put(AppointmentActions.createRequestSuccess());

      if (overviewType === OverviewTypes.Activity.Appointment) {
        yield put(OverviewActions.requestFetch(overviewType, true));
      } else if (overviewType == OverviewTypes.Account_Appointment) {
        yield put(refreshOrganisation('appointment'));
      } else if (overviewType === OverviewTypes.Contact_Appointment) {
        yield put(refreshContact('appointment'));
        yield put(refreshOrganisation('appointment'));
      } else if (overviewType === OverviewTypes.Pipeline.Qualified_Appointment) {
        yield put(refeshQualifiedDeal('appointment'));
      } else if (overviewType === OverviewTypes.Pipeline.Lead_Appointment) {
        yield put(refeshUnqualifiedDetail('appointment'));
      }
      yield call(fetchAppointmentNotification)
    }
  } catch (error) {
    yield put(NotificationActions.error(error.message));
  }
}

function* updateRequest({ overviewType }) {
  const state = yield select();
  const __CREATE = state.entities.appointment.__EDIT;
  const contacts = state.entities.contactDropdown || {};
  const invitees = __CREATE.invitees;
  try {
    const payload = {
      uuid: __CREATE.uuid,
      title: __CREATE.title,
      endDate: __CREATE.endDate ? __CREATE.endDate : new Date(Date.now() + 30 * 60 * 1000),
      startDate: __CREATE.startDate ? __CREATE.startDate : new Date(),
      owner: __CREATE.responsible ? { uuid: __CREATE.responsible } : { uuid: state.auth.userId },
      note: __CREATE.note || null,
      location: __CREATE.location || '',
      contactList: (__CREATE.contacts ? __CREATE.contacts : []).map((c) => {
        const right = contacts[c];
        if (right) {
          return {
            email: right.email,
            firstName: right.firstName,
            lastName: right.lastName,
            phone: right.phone,
            uuid: right.uuid,
          };
        }
      }),
      focusWorkData: __CREATE.focus ? { uuid: __CREATE.focus } : null,
      organisation: __CREATE.organisation ? { uuid: __CREATE.organisation } : null,
      inviteeList: {
        communicationInviteeDTOList: (__CREATE.emailList ? __CREATE.emailList : []).map((e) => {
          return {
            value: e,
          };
        }),
        contactInviteeDTOList: (invitees ? invitees : [])
          .filter((i) => {
            const right = contacts[i];
            if (!right) return false;
            return i;
          })
          .map((i) => {
            const right = contacts[i];
            if (!right) return false;
            return {
              email: right.email,
              firstName: right.firstName,
              lastName: right.lastName,
              phone: right.phone,
              uuid: right.uuid,
            };
          }),
      },
      externalKey: __CREATE.externalKey,
      externalKeyTempList: __CREATE.externalKeyTempList,
      googleEventId: __CREATE.googleEventId,
      office365EventId: __CREATE.office365EventId,
      outlookEventId: __CREATE.outlookEventId,
    };

    if (__CREATE.contacts && __CREATE.contacts.length > 0) {
      const firstId = __CREATE.contacts[0];
      const right = contacts[firstId] || {};
      payload.firstContactId = right.uuid;
    }

    if (__CREATE.prospect && __CREATE.prospect.leadId) {
      payload.leadId = __CREATE.prospect.leadId;
    }

    if (__CREATE.prospect && __CREATE.prospect.prospectId) {
      payload.prospect = { uuid: __CREATE.prospect.prospectId };
    }

    if (__CREATE.teams === 'teams') {
      payload.onlineMeeting = true;
      payload.location = null;
    }

    const res = yield call(api.post, {
      resource: `${Endpoints.Appointment}/update`,
      data: payload,
      query: {
        timezone: getCurrentTimeZone(),
      },
    });

    if (res) {
      yield put(OverviewActions.clearHighlight(overviewType));
      yield put(AppointmentActions.requestFetchAppointment(res.uuid));
      yield put(NotificationActions.success(`${_l`Updated`}`, '', 2000));
      yield call(fetchAppointmentNotification)
      if (overviewType === OverviewTypes.Activity.Appointment) {
        yield put(OverviewActions.requestFetch(overviewType, true));
      }
      if (overviewType === OverviewTypes.Account_Appointment) {
        yield put(OrganisationActions.requestFetchAppointments(__CREATE.organisation, false, 'dateAndTime'));
      } else if (overviewType === OverviewTypes.Contact_Appointment) {
        yield put(refreshContact('appointment'));
      } else if (overviewType === OverviewTypes.Pipeline.Qualified_Appointment) {
        yield put(refeshQualifiedDeal('appointment'));
      } else if (overviewType === OverviewTypes.Pipeline.Lead_Appointment) {
        yield put(refeshUnqualifiedDetail('appointment'));
      }
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
  } catch (error) {
    yield put(NotificationActions.error(error.message));
  }
}

function* createPopup(_timeDelay, _appointment) {
  yield call(delay, _timeDelay);
  yield put(AppointmentActions.setModalAppointmentSuggest(true, _appointment));
}

function* asyncListAppointmentAfterPeriod() {
  try {
    let res = yield call(api.get, {
      resource: `${Endpoints.Appointment}/listAfterAppointment`,
    });
    if (res) {
      let _listAfterAppointment = res.appointmentDTOList;
      for (let i = 0; i < _listAfterAppointment.length; i++) {
        let _appointment = _listAfterAppointment[i];
        let _timeoutOpenPopup = _appointment.popupDate - new Date().getTime();
        yield call(createPopup, _timeoutOpenPopup, _appointment);
      }
    }
  } catch (error) {

  }

}

function* asyncListAppointmentPopupEndOfDay() {
  try {
    let res = yield call(api.get, {
      resource: `${Endpoints.Appointment}/listAppointmentNotHandleToday`,
      query: {
        timezone: new Date().getTimezoneOffset() / -60,
      },
    });

    if (res && res.appointmentDTOList) {
      let _appointments = res.appointmentDTOList;
      if (_appointments.length > 0)
        yield put(AppointmentActions.setListAppointmentNotHandleToday(true, _appointments, true));
    }
  } catch(e) {

  }

}

function* showPopupAfterAppointmentFinish() {
  yield call(asyncListAppointmentAfterPeriod);
}

function* showEndOfDayPopup() {
  yield call(asyncListAppointmentPopupEndOfDay);
}

function* showAppointmentPopupNow() {

  try {
    if (isTimeBefore(new Date(), 24, 20, 0)) {
      let res = yield call(api.get, {
        resource: `${Endpoints.Appointment}/listFinishedAppointmentPopupNow`,
        query: {
          timezone: new Date().getTimezoneOffset() / -60,
        },
      });

      if (res && res.appointmentDTOList) {
        let _appointments = res.appointmentDTOList;
        if (_appointments.length > 0)
          yield put(AppointmentActions.setListAppointmentNotHandleToday(true, _appointments, false));
      }
    }
  } catch(e) {

  }

}

function* loopCheckAppointment() {
  let date = new Date();
  if (isTimeBefore(date, 24, 20, 0)) {
    yield call(showPopupAfterAppointmentFinish);
  }
  if (isEndOfDayPopup(date)) {
    let timeCountDown = 29 - date.getMinutes();
    if (timeCountDown < 10 && timeCountDown >= 0) {
      yield delay(timeCountDown * 60000);
      yield call(showEndOfDayPopup);
    }
  }
  yield call(delay, 600000);
  yield call(loopCheckAppointment);
}

function* checkAppointmentFinish() {
  yield call(showAppointmentPopupNow);
  yield call(loopCheckAppointment);
}

export function* timeoutNotification(noti) {
  yield call(delay, noti.timeOut);
  yield put(addInfoFlashMessage(noti))
}

function* fetchAppointmentNotification() {
  try {
    const auth = yield select((state) => state.auth)
    let res = yield call(api.get, {
      resource: `${Endpoints.Appointment}/getListActiveAppointmentWithOwnerInNextOneWeek`,
      query: {
        ownerId: auth.userId,
      },
    });
    let _lengthAppointmentTask = listAppointmentNoti.length;
    if(_lengthAppointmentTask > 0) {
      for(let j = 0; j< _lengthAppointmentTask; j ++) {
        yield cancel(listAppointmentNoti[j])
      }
    }
    if(res && res.appointmentDTOList.length > 0) {
      for(let i = 0; i < res.appointmentDTOList.length; i++) {
        let appointment = res.appointmentDTOList[i];
        var timeBefore15Mins = appointment.startDate - 15 * 60 * 1000;
        if (timeBefore15Mins > new Date().getTime()) {
          let noti = {
            timeOut: timeBefore15Mins - new Date().getTime(),
            content: '',
            notificationDate: timeBefore15Mins
          }
          let displayText = 'Your meeting';
          if ((appointment.focusWorkData && appointment.focusWorkData.name) || (appointment.focusActivity && appointment.focusActivity.name)) {
            let focusName = appointment.focusWorkData ? appointment.focusWorkData.name : appointment.focusActivity.name;
            displayText += ` with focus to <span class="text-bold">${focusName}</span>`;
          }

          if (appointment.organisation && appointment.organisation.name) {
            displayText += ` on <span class="text-bold">${appointment.organisation.name}</span>`;
          }
          else {
            if (appointment.firstContactName) {
              displayText += ` on <span class="text-bold">${appointment.firstContactName}</span>`;
            }
          }
          displayText += ' is up in 15 min!';
          noti.content = displayText;
          const _noti = yield fork(timeoutNotification, noti)
          listAppointmentNoti.push(_noti);
        }
      }
    }
  }catch(e){
    // console.log("function*fetchAppointmentNotification -> e", e)
    if(e.message=='YOUR_CARD_CANNOT_PAYMENT_CONTINUE'){
      yield put(OverviewActions.failFetch(OverviewTypes.Activity.Appointment, e.message));
    }

  }
}


let listAppointmentNoti = []
function* initAppointmentAndTaskRemiderNotification() {
  yield all([
    call(fetchAppointmentNotification),
    call(fetchTaskNotification)
  ])
}

export default function* saga(): Generator<*, *, *> {
  yield all(overviewSagas);
  yield takeLatest(AppointmentActionTypes.EDIT_APPOINTMENT, editAppointment);
  yield takeLatest(AppointmentActionTypes.FETCH_APPOINTMENT_REQUEST, fetchAppointment);
  yield takeLatest(AppointmentActionTypes.CHANGE_NOTE_SAGA, updateNote);
  yield takeLatest(AppointmentActionTypes.CHANGE_ON_MULTI_APPOINTIMENT_MENU, changeOnMultiAppointmentMenu);
  yield takeLatest(AppointmentActionTypes.DELETE_APPOINTMENT, deleteAppointment);
  yield takeLatest(AppointmentActionTypes.CREATE_REQUEST, createRequest);
  yield takeLatest(AppointmentActionTypes.UPDATE_REQUEST, updateRequest);
  yield takeLatest(AppointmentActionTypes.CHECK_APPOINTMENT_FINISH, checkAppointmentFinish);
  yield takeLatest(AppointmentActionTypes.INIT_APPOINTMENT_REMINDER_NOTIFICATION, initAppointmentAndTaskRemiderNotification)

}

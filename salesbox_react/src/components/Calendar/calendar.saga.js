//@flow
import { all, call, put, takeLatest } from 'redux-saga/effects';
import api from 'lib/apiClient';
import createOverviewSagas from 'components/Overview/overview.saga';
import { ObjectTypes, OverviewTypes, Endpoints } from 'Constants';
import AppointmentActionTypes, * as AppointmentActions from './calendar.actions';
import { appointmentList, appointmentSchema } from '../Appointment/appointment.schema';
import * as OverviewActions from 'components/Overview/overview.actions';

function* fetchAppointment({ appointmentId }: FetchTaskT): Generator<*, *, *> {
  try {
    yield put(AppointmentActions.startFetchAppointment(appointmentId));
    const data = yield call(api.get, {
      resource: `${Endpoints.Appointment}/${appointmentId}`,
      schema: appointmentSchema,
    });
    yield put(AppointmentActions.succeedFetchAppointment(appointmentId, data.entities));
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
    const { isRequiredOwner, selectedMark, ftsTerms, ...other } = requestData;
    return {
      ...other,
      searchText: ftsTerms,
      isShowHistory: false,
    };
  }
);

function* editAppointment({ appointmentId }: FetchTaskT): Generator<*, *, *> {
  yield fetchAppointment({ appointmentId });
  yield put(OverviewActions.editEntity(OverviewTypes.Activity.Appointment, appointmentId));
}

export default function* saga(): Generator<*, *, *> {
  yield all(overviewSagas);
  yield takeLatest(AppointmentActionTypes.EDIT_APPOINTMENT, editAppointment);
  yield takeLatest(AppointmentActionTypes.FETCH_APPOINTMENT_REQUEST, fetchAppointment);
}

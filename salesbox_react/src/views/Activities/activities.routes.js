// @flow
import makeAsyncComponent from 'lib/makeAsyncComponent';

const Appointments = makeAsyncComponent(() => import('./Appointments'));
const CalendarView = makeAsyncComponent(() => import('./CalendarView'));
const Tasks = makeAsyncComponent(() => import('./Tasks'));
const AppointmentDetail = makeAsyncComponent(() => import('./AppointmentDetail'));

export { CalendarView, Appointments, Tasks, AppointmentDetail };

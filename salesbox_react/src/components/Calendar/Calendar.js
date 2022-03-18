// @flow
import * as React from 'react';
import { compose, withHandlers, lifecycle, withState } from 'recompose';
import BigCalendar, { Views, Navigate, Calendar as RBCalendar  } from 'react-big-calendar';
import TimeGrid from 'react-big-calendar/lib/TimeGrid'
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Popup } from 'semantic-ui-react';
import moment from 'moment';
import _l from 'lib/i18n';
import * as PeriodActionTypes from '../PeriodSelector/period-selector.actions';
import { getEvents } from 'components/Appointment/appointment.selector';
import * as OverviewActions from 'components/Overview/overview.actions';
import * as AdvancedSearchActions from 'components/AdvancedSearch/advanced-search.actions';
import EditAppointmentModal from 'components/Appointment/EditAppointmentModal/EditAppointmentModal';
import DeleteAppointmentModal from 'components/Appointment/DeleteAppointmentModal/DeleteAppointmentModal';
import { OverviewTypes, ObjectTypes } from 'Constants';
import { getPeriod } from '../PeriodSelector/period-selector.selectors';
import DatePicker from '../DatePicker/DatePicker';
import Toolbar from './Toolbar/Toolbar';
import css from './Calendar.css';
import ConnectQualifiedDealModal from '../Appointment/ConnectQualifiedDealModal/ConnectQualifiedDealModal';
import CreateContactModal from '../Contact/CreateContactModal/index';
import CreateAppointmentModal from '../Appointment/CreateAppointmentModal/CreateAppointmentModal';
import SuggestedActions from './SuggestedActions/index';

import { RoutingObjectFeature } from '../RoutingObjectModal/RoutingObjectFeature';
import 'moment/locale/vi';
import 'moment/locale/de';
import 'moment/locale/sv';
import 'moment/locale/es';
import 'moment/locale/en-ie';

const objectType = ObjectTypes.Appointment;
// moment.updateLocale('vi', {
//   week: {
//     dow: 1,
//     doy: 7,
//   },
// });


addTranslations({
  'en-US': {
    Appointment: 'Appointment',
    Reminder: 'Reminder',
    'Owner': 'Owner',
  },
});


moment.locale('en');
BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));


type PropsT = {
  events: Array<{}>,
  gotoEvent: ({}) => void,
  selectSlot: ({}) => void,
  onView: (string) => void,
  onNavigate: (string) => void,
};

function padZero(str, len) {
  len = len || 2;
  var zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}

// const invertColor = (hex) => {
//   if (hex.indexOf('#') === 0) {
//     hex = hex.slice(1);
//   }
//   // convert 3-digit hex to 6-digits.
//   if (hex.length === 3) {
//     hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
//   }
//   if (hex.length !== 6) {
//     throw new Error('Invalid HEX color.');
//   }
//   // invert color components
//   var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
//     g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
//     b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
//   // pad each with zeros and return
//   return '#' + padZero(r) + padZero(g) + padZero(b);
// }

const appointmentStyle = {
  width: '100%',
  padding: '0px 2px',
  borderRadius: '3px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  whiteSpace: 'nowrap',
  overflow: 'hidden!important',
  textOverflow: 'ellipsis',
  // height: '100%'
};

const shortenValue = (value) => {
  if (value && value.length > 20) {
    return value.slice(0, 20);
  }
  return value;
};

const Event = ({ event }) => {
  return (
    <Popup
      position="top center"
      style={{ fontSize: 11 }}
      trigger={
        <div style={{ backgroundColor: event.owner && event.owner.colorCode, ...appointmentStyle, color: '#000', height: event.type === 'APPOINTMENT' ? "100%": "auto" }}>
          {/* {event.title} */}
          {event.title && event.title.length > 0 ? (
            event.title.length > 20 ? (
              <Popup
                trigger={<div>{`${shortenValue(event.title)}...`}</div>}
                style={{ fontSize: 11 }}
                content={event.title}
              />
            ) : (
              event.title
            )
          ) : (
            ''
          )}
        </div>
      }
    >
      <div style={{ fontWeight: '600' }}>{event.type === 'APPOINTMENT' ? _l`Meeting` : _l`Reminder`}</div>
      <div style={{ fontWeight: '300' }}>
        {_l`Responsible`}: {event.ownerName}
      </div>
      <div style={{ fontWeight: '300' }}>{event.contactName}</div>
      <div style={{ fontWeight: '300' }}>{event.note}</div>
    </Popup>
  );
};

const Slot = ({ event }) => {
  return <div>1dsdsds1</div>;
};

const components = {
  toolbar: Toolbar,
  week: {
    event: Event,
  },
  event: Event,
  timeGutterWrapper: <div>dsds</div>,
};

const getMonths = (endDate, startDate) => {
  let result = [];
  let timesEnd = moment(endDate).valueOf();
  let timesStart = moment(startDate).valueOf();
  while (timesStart <= timesEnd) {
    result.push(moment(timesStart).toDate());
    timesStart = moment(timesStart)
      .add(1, 'month')
      .valueOf();
  }
  return result;
};

const CalenderForDate = ({ endDate, startDate, events, onSelect }) => {
  const months = getMonths(endDate, startDate);
  return (
    <div className={css.datesContainer}>
      {months.map((month) => {
        const startMonth = moment(month)
          .startOf('month')
          .valueOf();
        const endMonth = moment(month)
          .endOf('month')
          .valueOf();
        const listTime = events.filter(
          (value) => moment(value.start).valueOf() >= startMonth && moment(value.start).valueOf() <= endMonth
        );

        return (
          <div style={{ width: '32%' }}>
            <DatePicker onSelect={onSelect} appointmentsTime={listTime} value={month} isCalendar />
          </div>
        );
      })}
    </div>
  );
};

let formats = {
  timeGutterFormat: (date, culture, localizer) => localizer.format(date, 'HH:mm', culture),
  agendaTimeFormat: (date, culture, localizer) => localizer.format(date, 'HH:mm', culture),
  eventTimeRangeFormat: (date, culture, localizer) => {
    return `${localizer.format(date.start, 'HH:mm', culture)} - ${localizer.format(date.end, 'HH:mm', culture)}`
  }

};

const re = /[0-9]{1,2}:[0-9]{2}/


const Calendar = ({
  createTask,
  setSuggestVisible,
  createAppointment,
  suggestVisible,
  onRangeChange,
  onSelectDay,
  onView,
  onNavigate,
  events,
  selectSlot,
  gotoEvent,
  objectPeriod: { period, endDate, startDate, weekType },
}: PropsT) => {
  return (
    <div className={css.wrapper}>
      <RoutingObjectFeature />

      {/* <CreateAppointmentModal overviewType={OverviewTypes.Activity.Appointment} /> */}
      {/* <EditAppointmentModal overviewType={OverviewTypes.Activity.Appointment} /> */}
      <DeleteAppointmentModal overviewType={OverviewTypes.Activity.Appointment} />
      <ConnectQualifiedDealModal overviewType={OverviewTypes.Activity.Appointment} />
      <CreateContactModal overviewType={OverviewTypes.Activity.Appointment_Add_Contact} />
      <SuggestedActions
        createTask={createTask}
        onClose={() => setSuggestVisible(false)}
        createAppointment={createAppointment}
        visible={suggestVisible}
      />
      {period === 'day' || period === 'month' || period === 'week' ? (
        <BigCalendar
          // onView={onView}
          onNavigate={onNavigate}
          selectable
          defaultView={period}
          showMultiDayTimes
          date={moment(startDate).toDate()}
          onSelectSlot={selectSlot}
          onSelectEvent={gotoEvent}
          events={events}
          popup
          views={{ month: true, week: weekType === '5_DAYS' ? MyWeek : MyWeek1, day: true }}
          scrollToTime={moment(startDate)
            .startOf('day')
            .add(7, 'hour')
            .toDate()}
          formats={formats}
          slotPropGetter={(date) => ({
            color: 'red',
          })}
          onRangeChange={onRangeChange}
          components={components}
          step={30}
        />
      ) : (
        <>
          <Toolbar />
          <CalenderForDate onSelect={onSelectDay} events={events} endDate={endDate} startDate={startDate} />
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    events: getEvents(state),
    objectPeriod: getPeriod(state, objectType),
    locale: state.ui && state.ui.app && state.ui.app.locale 
  };
};

const mapDispatchToProps = {
  createEntity: OverviewActions.createEntity,
  setActionForHighlight: OverviewActions.setActionForHighlight,
  setFilter: AdvancedSearchActions.setFilter,
  selectPeriod: PeriodActionTypes.selectPeriod,
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withState('suggestVisible', 'setSuggestVisible', false),
  withState('slot', 'setSlot', null),
  lifecycle({
    componentWillMount() {

      
      const { setFilter, selectPeriod, objectPeriod } = this.props;
      if(objectPeriod && (objectPeriod.period === 'week' || objectPeriod.period === 'month' ) ) {
        moment.locale(this.props.locale);
        BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
      }
      if(!objectPeriod || (objectPeriod && objectPeriod.period === 'all' || objectPeriod.period === 'custom')) {
        selectPeriod(ObjectTypes.Appointment, 'day');
      }
      if (!objectPeriod || (objectPeriod && objectPeriod.period !== 'all' && objectPeriod.period !== 'custom')) {
        selectPeriod(ObjectTypes.Appointment, objectPeriod.period);
      }
      setFilter(ObjectTypes.Appointment, 'calendar');
    },
    componentWillUnmount() {
      moment.locale('en')
    },
    componentDidMount() {
      const { objectPeriod, selectPeriod } = this.props;
      if (!objectPeriod || (objectPeriod && objectPeriod.period === 'all' || objectPeriod.period === 'custom')) {
        selectPeriod(ObjectTypes.Appointment, 'day');
      }
      if (!objectPeriod || (objectPeriod && objectPeriod.period !== 'all' && objectPeriod.period !== 'custom')) {
        selectPeriod(ObjectTypes.Appointment, objectPeriod.period);
      }
    },
    componentDidUpdate(prevProps) {
      const { objectPeriod, locale } = this.props;
      if(objectPeriod && (objectPeriod.period === 'week' || objectPeriod.period === 'month' )) {
        let _lang = this.props.locale;
        if(_lang === "se") _lang = "sv";
        moment.locale(_lang);
        BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
      } else {
        moment.locale('en');
        BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
      }
      if (
        prevProps.objectPeriod.period !== objectPeriod.period ||
        prevProps.objectPeriod.startDate !== objectPeriod.startDate
      ) {
        const element = document.getElementsByClassName('rbc-time-header-gutter');
        const weekNumber = moment(objectPeriod.startDate).week();
        if (element.length > 0) {
          element[0].innerHTML = `W${weekNumber}`;
        }
      }
    },
  }),
  withHandlers({
    onSelectDay: ({ setSuggestVisible, selectPeriod, setSlot }) => (date, countAppointment) => {
      if (countAppointment > 0) {
        selectPeriod(objectType, 'day', moment(date).toDate());
      } else {
        setSlot({ start: date });
        setSuggestVisible(true);
      }
    },
    gotoEvent: ({ history }) => (event) => {
      if (event.type === 'REMAINDER') {
        return history.push(`/activities/calendar/tasks/${event.id}`);
      }
      history.push(`/activities/calendar/${event.id}`);
    },
    onView: () => (view) => console.log(view),
    onNavigate: ({ selectPeriod }) => (date, event, newEvent) => {
      if (newEvent !== 'NEXT' && newEvent !== 'PREV') {
        selectPeriod(objectType, 'day', moment(date).toDate());
      }
    },
    handleRangeChange: () => (date) => console.log(date),
    createAppointment: ({ createEntity, slot }) => () => {
      if (slot) {
        createEntity(OverviewTypes.Activity.Appointment, {
          startDate: slot.start,
          endDate: new Date(slot.start.getTime() + 15 * 60 * 1000),
        });
      }
    },
    createTask: ({ createEntity, slot }) => () => {
      if (slot) {
        createEntity(OverviewTypes.Activity.Task, {
          dateAndTime: moment(slot.start).valueOf(),
        });
      }
    },
    selectSlot: ({ createEntity, setSuggestVisible, setSlot }) => (event) => {
      setSlot(event);
      setSuggestVisible(true);
      // setActionForHighlight(OverviewTypes.Activity.Appointment, 'create')
    },
  })
)(Calendar);

class MyWeek1 extends React.Component {
  render() {
    let { date } = this.props
    let range = MyWeek1.range(date)

    return <TimeGrid {...this.props} range={range} eventOffset={15} />
  }
}
MyWeek1.range = date => {
  let start = moment(date).startOf('day')
  let end = moment(start).add(6, "day").endOf('day')
  let current = start
  let range = []
  while (current.valueOf() <= end.valueOf()) {
    range.push(current.toDate())
    current = moment(current).add(1, "day")
  }

  return range
}

MyWeek1.navigate = (date, action) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return moment(date).add(-6, 'day').toDate()

    case Navigate.NEXT:
      return moment(date).add(6, 'day').toDate()

    default:
      return date
  }
}

MyWeek1.title = date => {
  return `My awesome week`
}


class MyWeek extends React.Component {
  render() {
    let { date } = this.props
    let range = MyWeek.range(date)

    return <TimeGrid {...this.props} range={range} eventOffset={15} />
  }
}

MyWeek.range = date => {
  let start = moment(date).startOf('day')
  let end = moment(start).add(4, "day").endOf('day')

  let current = start
  let range = []
  while (current.valueOf() <= end.valueOf()) {
    range.push(current.toDate())
    current = moment(current).add(1, "day")
  }
  return range
}

MyWeek.navigate = (date, action) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return moment(date).add( -4, 'day').toDate()

    case Navigate.NEXT:
      return moment(date).add(4, 'day').toDate()

    default:
      return date
  }
}

MyWeek.title = date => {
  return `My awesome week`
}

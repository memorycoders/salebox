// @flow
import * as React from 'react';
import { Menu } from 'semantic-ui-react';
import { withRouter, Route, Switch, Router } from 'react-router';
import { Link } from 'react-router-dom';
import { withProps, compose } from 'recompose';
import _l from 'lib/i18n';
import PaneledList from '../../components/PaneledList/PaneledList';
import { CssNames, OverviewTypes } from 'Constants';
import ContactDetail from 'components/Contact/ContactDetail';
import AccountDetail from '../Accounts/AccountDetail';
import TaskDetail from 'views/Task/TaskDetail';
import { Appointments, CalendarView, Tasks, AppointmentDetail } from './activities.routes';
import QualifiedDetail from '../../components/PipeLineQualifiedDeals/QualifiedDetail';
import UnqualifiedDealDetail from 'components/PipeLineUnqualifiedDeals/UnqualifiedDealDetail';

addTranslations({
  'en-US': {
    'Calendar': 'Calendar',
    Reminders: 'Reminders',
  },
});

type PropsT = {
  hasDetail: boolean,
  location: {
    pathname: string,
  },
};

const ActivitiesTaskDetail = ({ route }) => <TaskDetail route={route} overviewType={OverviewTypes.Activity.Task} color={CssNames.Activity} />;
const CalendarAppointmentDetail = ({ route }) => <AppointmentDetail route={route} overviewType={OverviewTypes.Activity.Appointment} overviewUrl="/activities/calendar" />;

const AppointmentDetailList = ({ route }) => <AppointmentDetail route={route} overviewType={OverviewTypes.Activity.Appointment} overviewUrl="/activities/appointments" />;

const Activities = ({ location, hasDetail }: PropsT) => {
  const list = (
    <React.Fragment>
      <Switch>
        <Route path="/activities/calendar" component={CalendarView} />
        {/* <Route path="/activities/calendar-task" component={CalendarView} /> */}
        <Route exact path="/activities/tasks" component={Tasks} />
        <Route path="/activities/appointments" component={Appointments} />
        <Route path="/activities" component={Tasks} />
        <Route exact path="/activities/contacts" component={Tasks} />
      </Switch>
    </React.Fragment>
  );

  const qualifiedPath = [
    {
      uri: '/activities/appointments/qualified',
      origin: '/activities/appointments'
    },
    {
      uri: '/activities/tasks/qualified',
      origin: '/activities/tasks'
    }
    ,
    {
      uri: '/activities/calendar/qualified',
      origin: '/activities/calendar'
    }
  ];

  const unQualifiedPath = [
    {
      uri: '/activities/appointments/unqualified',
      origin: '/activities/appointments'
    },
    {
      uri: '/activities/tasks/unqualified',
      origin: '/activities/tasks'
    },
    {
      uri: '/activities/calendar/unqualified',
      origin: '/activities/calendar'
    }
  ];

  const contactPath = [
    {
      uri: '/activities/appointments/contact',
      origin: '/activities/appointments'
    },
    {
      uri: '/activities/tasks/contact',
      origin: '/activities/tasks'
    },
    {
      uri: '/activities/calendar/contact',
      origin: '/activities/calendar'
    }
  ];


  const orderPath = [
    {
      uri: '/activities/appointments/order',
      origin: '/activities/appointments'
    },
    {
      uri: '/activities/tasks/order',
      origin: '/activities/tasks'
    },
    {
      uri: '/activities/calendar/order',
      origin: '/activities/calendar'
    }
  ];

  const accountPath = [
    {
      uri: '/activities/appointments/account',
      origin: '/activities/appointments'
    },
    {
      uri: '/activities/tasks/account',
      origin: '/activities/tasks'
    },
    {
      uri: '/activities/calendar/account',
      origin: '/activities/calendar'
    }
  ];

  const taskPath = [
    {
      uri: '/activities/calendar/tasks',
      origin: '/activities/calendar'
    },
    // '/activities/tasks/contact/task',
    {
      uri: '/activities/tasks',
      origin: '/activities/tasks'
    },
    {
      uri: '/activities/tasks/tasks',
      origin: '/activities/tasks'
    },
    {
      uri: '/activities/appointments/tasks',
      origin: '/activities/appointments'
    },
  ];

  const appointmentPath = [
    {
      uri: '/activities/appointments',
      origin: '/activities/appointments'
    },
    {
      uri: '/activities/appointments/appointments',
      origin: '/activities/appointments'
    },
    {
      uri: '/activities/calendar',
      origin: '/activities/calendar'
    },
    {
      uri: '/activities/calendar/appointments',
      origin: '/activities/calendar'
    },
    {
      uri: '/activities/tasks/appointments',
      origin: '/activities/tasks'
    }
  ]

  const detail = (
    <React.Fragment>
      <Switch>

        {qualifiedPath.concat(orderPath).map(path => {
          return <Route exact key={path.uri} path={`${path.uri}/:qualifiedDealId`} component={() => <QualifiedDetail route={path.origin} />} />
        })}
        {unQualifiedPath.map(path => {
          return <Route exact key={path.uri} path={`${path.uri}/:unqualifiedDealId`} component={() => <UnqualifiedDealDetail overviewType={OverviewTypes.Pipeline.Lead} route={path.origin} />} />
        })}

        {contactPath.map(path => {
          return <Route exact key={path.uri} path={`${path.uri}/:contactId`} component={() => <ContactDetail route={path.origin} />} />
        })}

        {accountPath.map(path => {
          return <Route exact key={path.uri} path={`${path.uri}/:organisationId`} component={() => <AccountDetail route={path.origin} />} />
        })}

        {appointmentPath.map(path => {
          return <Route exact key={path.uri} path={`${path.uri}/:appointmentId`} component={() => <AppointmentDetailList route={path.origin} />} />
        })}

        {taskPath.map(path => {
          return <Route exact key={path.uri} path={`${path.uri}/:taskId`} component={() => <ActivitiesTaskDetail route={path.origin} />} />
        })}

        <Route exact key={location.pathname} path="/activities/calendar/:appointmentId" component={CalendarAppointmentDetail} />
        {/* <Route key={location.pathname} path="/activities/calendar-task/:taskId" component={ActivitiesTaskDetail} /> */}

      </Switch>
    </React.Fragment>
  );
  return <PaneledList list={list} detail={detail} hasDetail={hasDetail} />;
};

export default compose(
  withRouter,
  withProps(({ location }) => ({
    hasDetail: (location.pathname.match(/\//g) || []).length > 2,
  }))
)(Activities);

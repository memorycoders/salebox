//@flow
import * as React from 'react';
import { withRouter, Route, Switch } from 'react-router';
import { withProps, compose } from 'recompose';
import { PaneledList } from 'components';
import { CssNames, OverviewTypes } from 'Constants';
import { AccountDetail, AccountList } from './account.routes';
import QualifiedDetail from '../../components/PipeLineQualifiedDeals/QualifiedDetail';
import UnqualifiedDealDetail from 'components/PipeLineUnqualifiedDeals/UnqualifiedDealDetail';
import { AppointmentDetail } from '../Activities/activities.routes';
import { TaskDetail } from 'views/Task';
import ContactDetail from 'components/Contact/ContactDetail';


const ActivitiesTaskDetail = ({ route }) => <TaskDetail
  route={route}
  overviewType={OverviewTypes.Activity.Task} color={ CssNames.Activity} />;

const AppointmentDetailList = ({ route }) => <AppointmentDetail route={route} overviewType={OverviewTypes.Activity.Appointment} overviewUrl="/activities/appointments" />;

type PropsT = {
  hasDetail: boolean,
  location: {
    pathname: string,
  },
};



const taskPath = [
  {
    uri: '/accounts/tasks',
    origin: '/accounts'
  },
];



const appointmentPath = [

  {
    uri: '/accounts/appointments',
    origin: '/accounts'
  }
]

const accountPath = [
  {
    uri: '/accounts/account',
    origin: '/accounts'
  },
  {
    uri: '/accounts',
    origin: '/accounts'
  }
];

const orderPath = [
  {
    uri: '/accounts/order',
    origin: '/accounts'
  }
];
const contactPath = [
  {
    uri: '/accounts/contact',
    origin: '/accounts'
  }
];

const unQualifiedPath = [
  {
    uri: '/accounts/unqualified',
    origin: '/accounts'
  }
];

const qualifiedPath = [
  {
    uri: '/accounts/qualified',
    origin: '/accounts'
  }
];

const Delegation = ({ location, hasDetail }: PropsT) => {
  const list = <AccountList />;
  const detail = (
    <Switch>
      {qualifiedPath.concat(orderPath).map(path => {
        return <Route exact key={path.uri} path={`${path.uri}/:qualifiedDealId`} component={() => <QualifiedDetail route={path.origin} />} />
      })}
      {unQualifiedPath.map(path => {
        return <Route exact key={path.uri} path={`${path.uri}/:unqualifiedDealId`} component={() => <UnqualifiedDealDetail route={path.origin} />} />
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
        return <Route exact exact key={path.uri} path={`${path.uri}/:taskId`} component={() => <ActivitiesTaskDetail route={path.origin} />} />
      })}
    </Switch>
  );
  return <PaneledList list={list} detail={detail} hasDetail={hasDetail} />;
};

export default compose(
  withRouter,
  withProps(({ location }) => ({
    hasDetail: (location.pathname.match(/\//g) || []).length > 1,
  }))
)(Delegation);

//@flow
import * as React from 'react';
import { withRouter, Route, Switch } from 'react-router';
import { withProps, compose } from 'recompose';
import ContactDetail from 'components/Contact/ContactDetail';
import InfiniteContactList from 'components/Contact/InfiniteContactList';
import { PaneledList } from 'components';
import { CssNames, OverviewTypes } from 'Constants';
import { AccountDetail } from '../Accounts/account.routes';
import QualifiedDetail from '../../components/PipeLineQualifiedDeals/QualifiedDetail';
import UnqualifiedDealDetail from 'components/PipeLineUnqualifiedDeals/UnqualifiedDealDetail';
import { AppointmentDetail } from '../Activities/activities.routes';
import { TaskDetail } from 'views/Task';

type PropsT = {
  hasDetail: boolean,
  location: {
    pathname: string,
  },
};

const ActivitiesTaskDetail = ({ route }) => <TaskDetail
  route={route}
  overviewType={OverviewTypes.Activity.Task} color={CssNames.Activity} />;

const AppointmentDetailList = ({ route }) => <AppointmentDetail route={route} overviewType={OverviewTypes.Activity.Appointment} overviewUrl="/activities/appointments" />;

const taskPath = [
  {
    uri: '/contacts/tasks',
    origin: '/contacts'
  },
];



const appointmentPath = [

  {
    uri: '/contacts/appointments',
    origin: '/contacts'
  }
]

const accountPath = [
  {
    uri: '/contacts/account',
    origin: '/contacts'
  },
  
];

const orderPath = [
  {
    uri: '/contacts/order',
    origin: '/contacts'
  }
];
const contactPath = [
  {
    uri: '/contacts/contact',
    origin: '/contacts'
  },
  {
    uri: '/contacts',
    origin: '/contacts'
  }
];

const unQualifiedPath = [
  {
    uri: '/contacts/unqualified',
    origin: '/contacts'
  }
];

const qualifiedPath = [
  {
    uri: '/contacts/qualified',
    origin: '/contacts'
  }
];


const Contacts = ({ location, hasDetail }: PropsT) => {
  const list = (
    <Switch>
      <Route path="/contacts" component={InfiniteContactList} />
    </Switch>
  );
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
)(Contacts);

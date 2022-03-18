// @flow
import * as React from 'react';
import { withRouter, Route, Switch } from 'react-router';
import { withProps, compose, lifecycle } from 'recompose';
import _l from 'lib/i18n';
import { PaneledList } from 'components';
import { CssNames, OverviewTypes } from 'Constants';
import { TaskDetail } from 'views/Task';
import ContactDetail from 'components/Contact/ContactDetail';
import AccountDetail from '../Accounts/AccountDetail';
import QualifiedDetail from '../../components/PipeLineQualifiedDeals/QualifiedDetail';
import UnqualifiedDealDetail from 'components/PipeLineUnqualifiedDeals/UnqualifiedDealDetail';
import { Leads, Tasks } from './delegation.routes';
import { createBrowserHistory } from 'history';
import {  AppointmentDetail } from '../Activities/activities.routes';

const history = window.browserHistory || createBrowserHistory();

addTranslations({
  'en-US': {
    Leads: 'Unqualified',
    Reminders: 'Reminders',
  },
});

type PropsT = {
  hasDetail: boolean,
  location: {
    pathname: string,
  },
};


const DelegationLeadDetail = ({ route }) => (
  <UnqualifiedDealDetail
    route={route}
    overviewType={OverviewTypes.Delegation.Lead}
    color={CssNames.Delegation} />
);

const ActivitiesTaskDetail = ({ route, isDelegation }) => <TaskDetail
route={route}
  overviewType={isDelegation ? OverviewTypes.Delegation.Task : OverviewTypes.Activity.Task} color={isDelegation ? CssNames.Delegation : CssNames.Activity} />;

const AppointmentDetailList = ({ route }) => <AppointmentDetail route={route} overviewType={OverviewTypes.Activity.Appointment} overviewUrl="/activities/appointments" />;

const Delegation = ({ location, hasDetail }: PropsT) => {
  const list = (
    <React.Fragment>
      <Switch>
        <Route  path="/delegation/leads" component={Leads} />
        <Route path="/delegation/tasks" component={Tasks} />
        {/* <Route path="/delegation" exact component={Tasks} /> */}
      </Switch>
    </React.Fragment>
  );

  const taskPath = [
    {
      uri: '/delegation/tasks/tasks',
      origin: '/delegation/tasks'
    },
    // '/activities/tasks/contact/task',
    {
      uri: '/delegation/tasks',
      origin: '/delegation/tasks',
      isDelegation: true
    },
    {
      uri: '/delegation/leads/tasks',
      origin: '/delegation/leads'
    }
  ];



  const appointmentPath = [

    {
      uri: '/delegation/leads/appointments',
      origin: '/delegation/leads'
    },
    {
      uri: '/delegation/tasks/appointments',
      origin: '/delegation/tasks'
    }
  ]

  const accountPath = [
    {
      uri: '/delegation/tasks/account',
      origin: '/delegation/tasks'
    },
    {
      uri: '/delegation/leads/account',
      origin: '/delegation/leads'
    }
  ];

  const orderPath = [
    {
      uri: '/delegation/leads/order',
      origin: '/delegation/leads'
    },
    {
      uri: '/delegation/tasks/order',
      origin: '/delegation/tasks'
    }
  ];
  const contactPath = [
    {
      uri: '/delegation/leads/contact',
      origin: '/delegation/leads'
    },
    {
      uri: '/delegation/tasks/contact',
      origin: '/delegation/tasks'
    }
  ];

  const unQualifiedPath = [
    {
      uri: '/delegation/leads/unqualified',
      origin: '/delegation/leads'
    },
    {
      uri: '/delegation/leads',
      origin: '/delegation/leads',
      isDelegation: true
    },
    {
      uri: '/delegation/tasks/unqualified',
      origin: '/delegation/tasks'
    }
  ];

  const qualifiedPath = [
    {
      uri: '/delegation/leads/qualified',
      origin: '/delegation/leads'
    },
    {
      uri: '/delegation/tasks/qualified',
      origin: '/delegation/tasks'
    }
  ];


  const detail = (
    <React.Fragment>
      <Switch>
        {qualifiedPath.concat(orderPath).map(path => {
          return <Route exact key={path.uri} path={`${path.uri}/:qualifiedDealId`} component={() => <QualifiedDetail route={path.origin} />} />
        })}
        {unQualifiedPath.map(path => {
          return <Route exact key={path.uri} path={`${path.uri}/:unqualifiedDealId`} component={() => path.isDelegation ? <DelegationLeadDetail route={path.origin}/> : <UnqualifiedDealDetail route={path.origin} />} />
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
          return <Route exact exact key={path.uri} path={`${path.uri}/:taskId`} component={() => <ActivitiesTaskDetail isDelegation={path.isDelegation} route={path.origin} />} />
        })}
        {/* <Route key={location.pathname} path="/delegation/tasks/:taskId" component={DelegationTaskDetail} />
        <Route key={location.pathname} path="/delegation/leads/:unqualifiedDealId" component={DelegationLeadDetail} /> */}
      </Switch>
    </React.Fragment>
  );
  return <PaneledList list={list} detail={detail} hasDetail={hasDetail} />;
};

export default compose(
  withRouter,
  lifecycle({
    componentDidMount() {
      if (this.props.location.pathname === '/delegation') history.push('delegation/tasks');
    },
  }),
  withProps(({ location }) => ({
    hasDetail: (location.pathname.match(/\//g) || []).length > 2,
  }))
)(Delegation);

// @flow
import * as React from 'react';
import { createBrowserHistory } from 'history';
import { compose, withHandlers, withProps, lifecycle } from 'recompose';
import { CssNames, OverviewTypes } from 'Constants';
import _l from 'lib/i18n';
import { withRouter, Route, Switch } from 'react-router';

import UnqualifiedDealDetail from 'components/PipeLineUnqualifiedDeals/UnqualifiedDealDetail';
import InfiniteUnqualifiedDealList from '../../components/PipeLineUnqualifiedDeals/InfiniteUnqualifiedDealList';
import PaneledList from '../../components/PaneledList/PaneledList';
import { Link } from 'react-router-dom';
import InfiniteQualifiedList from '../../components/PipeLineQualifiedDeals/InfiniteQualifiedDealList';
import QualifiedDetail from '../../components/PipeLineQualifiedDeals/QualifiedDetail';
import infiniteOrderList from '../../components/PipeLineQualifiedDeals/infiniteOrderList';
import ContactDetail from 'components/Contact/ContactDetail';
import AccountDetail from '../Accounts/AccountDetail';
import TaskDetail from 'views/Task/TaskDetail';
import { AppointmentDetail } from '../Activities/activities.routes';

const history = window.browserHistory || createBrowserHistory();

const ActivitiesTaskDetail = ({ route }) => <TaskDetail route={route} overviewType={OverviewTypes.Activity.Task} color={CssNames.Activity} />;

const AppointmentDetailList = ({ route }) => <AppointmentDetail route={route} overviewType={OverviewTypes.Activity.Appointment} overviewUrl="/activities/appointments" />;

type PropsT = {
  hasDetail: boolean,
  location: {
    pathname: string,
  },
};
addTranslations({
  'en-US': {
    Pipeline: 'Pipeline',
    'Unqualified': 'Unqualified',
    'Qualified': 'Qualified',
    Orders: 'Orders',
  },
});
const Pipeline = ({ location, hasDetail }: PropsT) => {
  const list = (
    <React.Fragment>
      <Switch>
        <Route path="/pipeline/leads" component={InfiniteUnqualifiedDealList} />
        <Route path="/pipeline/overview" component={InfiniteQualifiedList} />
        <Route path="/pipeline/orders" component={infiniteOrderList} />
      </Switch>
    </React.Fragment>
  );

  const accountPath = [
    {
      uri: '/pipeline/leads/account',
      origin: '/pipeline/leads'
    },
    {
      uri: '/pipeline/overview/account',
      origin: '/pipeline/overview'
    },
    {
      uri: '/pipeline/orders/account',
      origin: '/pipeline/orders'
    }
  ];


  const contactPath = [
    {
      uri: '/pipeline/leads/contact',
      origin: '/pipeline/leads'
    },
    {
      uri: '/pipeline/overview/contact',
      origin: '/pipeline/overview'
    },
    {
      uri: '/pipeline/orders/contact',
      origin: '/pipeline/orders'
    }
  ];

  const qualifiedPath = [
    {
      uri: '/pipeline/leads/qualified',
      origin: '/pipeline/leads'
    },
    {
      uri: '/pipeline/overview/qualified',
      origin: '/pipeline/overview'
    },
    {
      uri: '/pipeline/overview',
      origin: '/pipeline/overview'
    },
    {
      uri: '/pipeline/orders/qualified',
      origin: '/pipeline/orders'
    }
  ];

  const orderPath = [
    {
      uri: '/pipeline/leads/order',
      origin: '/pipeline/leads'
    },
    {
      uri: '/pipeline/orders/order',
      origin: '/pipeline/orders'
    },
    {
      uri: '/pipeline/orders',
      origin: '/pipeline/orders'
    },
    {
      uri: '/pipeline/overview/order',
      origin: '/pipeline/overview'
    }
  ];

  const unQualifiedPath = [
    {
      uri: '/pipeline/overview/unqualified',
      origin: '/pipeline/overview'
    },
    {
      uri: '/pipeline/orders/unqualified',
      origin: '/pipeline/orders'
    },
    {
      uri: '/pipeline/leads/unqualified',
      origin: '/pipeline/leads'
    },
    {
      uri: '/pipeline/leads',
      origin: '/pipeline/leads'
    }
  ];

  const taskPath = [
    {
      uri: '/pipeline/leads/tasks',
      origin: '/pipeline/leads'
    },
    // '/activities/tasks/contact/task',
    {
      uri: '/pipeline/orders/tasks',
      origin: '/pipeline/orders'
    },
    {
      uri: '/pipeline/overview/tasks',
      origin: '/pipeline/overview'
    },
  ];

  const appointmentPath = [
 
    {
      uri: '/pipeline/overview/appointments',
      origin: '/pipeline/overview'
    },
    {
      uri: '/pipeline/orders/appointments',
      origin: '/pipeline/orders'
    },
    {
      uri: '/pipeline/leads/appointments',
      origin: '/pipeline/leads'
    }
  ]

  const detail = (
    <React.Fragment>
      <Switch>
        {contactPath.map(path => {
          return <Route exact key={path.uri} path={`${path.uri}/:contactId`} component={() => <ContactDetail route={path.origin} />} />
        })}

        {accountPath.map(path => {
          return <Route exact key={path.uri} path={`${path.uri}/:organisationId`} component={() => <AccountDetail route={path.origin} />} />
        })}

        {qualifiedPath.concat(orderPath).map(path => {
          return <Route exact key={path.uri} path={`${path.uri}/:qualifiedDealId`} component={() => <QualifiedDetail route={path.origin} />} />
        })}
        {unQualifiedPath.map(path => {
          return <Route exact key={path.uri} path={`${path.uri}/:unqualifiedDealId`} component={() => <UnqualifiedDealDetail route={path.origin} />} />
        })}
        {appointmentPath.map(path => {
          return <Route exact key={path.uri} path={`${path.uri}/:appointmentId`} component={() => <AppointmentDetailList route={path.origin} />} />
        })}

        {taskPath.map(path => {
          return <Route exact exact key={path.uri} path={`${path.uri}/:taskId`} component={() => <ActivitiesTaskDetail route={path.origin} />} />
        })}
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
)(Pipeline);

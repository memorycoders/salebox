import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router';
import InfiniteQualifiedList from '../../components/PipeLineQualifiedDeals/InfiniteQualifiedDealList';
import QualifiedDetail from '../../components/PipeLineQualifiedDeals/QualifiedDetail';
import infiniteOrderList from '../../components/PipeLineQualifiedDeals/infiniteOrderList';
import ContactDetail from 'components/Contact/ContactDetail';
import AccountDetail from '../Accounts/AccountDetail';
import TaskDetail from 'views/Task/TaskDetail';
import _l from 'lib/i18n';
import { CssNames, OverviewTypes } from 'Constants';
import PaneledList from '../../components/PaneledList/PaneledList';
import RecruitmentStepOverview from '../../components/Recruitment/RecruitmentActive/RecruitmentStepOverview';
import InfiniteRecruitmentClosedList from '../../components/Recruitment/RecruitmentClosed/InfiniteRecruitmentClosedList';

const ActivitiesTaskDetail = ({ route }) => (
  <TaskDetail route={route} overviewType={OverviewTypes.Activity.Task} color={CssNames.Activity} />
);

const AppointmentDetailList = ({ route }) => (
  <AppointmentDetail
    route={route}
    overviewType={OverviewTypes.Activity.Appointment}
    overviewUrl="/activities/appointments"
  />
);

const Recruitment = ({ location }) => {
  const [hasDetail, setHasDetail] = useState(false);

  useEffect(() => {
    setHasDetail((location.pathname.match(/\//g) || []).length > 2);
  }, [location]);
  const list = (
    <>
      <Switch>
        <Route path="/recruitment/active" component={RecruitmentStepOverview} />
        <Route path="/recruitment/closed" component={InfiniteRecruitmentClosedList} />
      </Switch>
    </>
  );
  const accountPath = [
    {
      uri: '/pipeline/leads/account',
      origin: '/pipeline/leads',
    },
    {
      uri: '/pipeline/overview/account',
      origin: '/pipeline/overview',
    },
    {
      uri: '/pipeline/orders/account',
      origin: '/pipeline/orders',
    },
    {
      uri: '/recruitment/active/account',
      origin: '/recruitment/active',
    },
    {
      uri: '/recruitment/closed/account',
      origin: '/recruitment/closed',
    },
  ];

  const contactPath = [
    {
      uri: '/pipeline/leads/contact',
      origin: '/pipeline/leads',
    },
    {
      uri: '/pipeline/overview/contact',
      origin: '/pipeline/overview',
    },
    {
      uri: '/pipeline/orders/contact',
      origin: '/pipeline/orders',
    },
    {
      uri: '/recruitment/active',
      origin: '/recruitment/active',
    },
    {
      uri: '/recruitment/closed',
      origin: '/recruitment/closed',
    },
    {
      uri: '/recruitment/active/contact',
      origin: '/recruitment/active',
    },
    {
      uri: '/recruitment/closed/contact',
      origin: '/recruitment/closed',
    },
  ];

  const qualifiedPath = [
    {
      uri: '/pipeline/leads/qualified',
      origin: '/pipeline/leads',
    },
    {
      uri: '/pipeline/overview/qualified',
      origin: '/pipeline/overview',
    },
    {
      uri: '/pipeline/overview',
      origin: '/pipeline/overview',
    },
    {
      uri: '/pipeline/orders/qualified',
      origin: '/pipeline/orders',
    },
    {
      uri: '/recruitment/active/qualified',
      origin: '/recruitment/active',
    },
    {
      uri: '/recruitment/closed/qualified',
      origin: '/recruitment/closed',
    },
  ];

  const orderPath = [
    {
      uri: '/pipeline/leads/order',
      origin: '/pipeline/leads',
    },
    {
      uri: '/pipeline/orders/order',
      origin: '/pipeline/orders',
    },
    {
      uri: '/pipeline/orders',
      origin: '/pipeline/orders',
    },
    {
      uri: '/pipeline/overview/order',
      origin: '/pipeline/overview',
    },
    {
      uri: '/recruitment/active/order',
      origin: '/recruitment/active',
    },
    {
      uri: '/recruitment/closed/order',
      origin: '/recruitment/closed',
    },
  ];

  const unQualifiedPath = [
    {
      uri: '/pipeline/overview/unqualified',
      origin: '/pipeline/overview',
    },
    {
      uri: '/pipeline/orders/unqualified',
      origin: '/pipeline/orders',
    },
    {
      uri: '/pipeline/leads/unqualified',
      origin: '/pipeline/leads',
    },
    {
      uri: '/pipeline/leads',
      origin: '/pipeline/leads',
    },
    {
      uri: '/recruitment/active/leads',
      origin: '/recruitment/active',
    },
    {
      uri: '/recruitment/closed/leads',
      origin: '/recruitment/closed',
    },
    {
      uri: '/recruitment/active/unqualified',
      origin: '/recruitment/active',
    },
    {
      uri: '/recruitment/closed/unqualified',
      origin: '/recruitment/closed',
    },
  ];

  const taskPath = [
    {
      uri: '/pipeline/leads/tasks',
      origin: '/pipeline/leads',
    },
    // '/activities/tasks/contact/task',
    {
      uri: '/pipeline/orders/tasks',
      origin: '/pipeline/orders',
    },
    {
      uri: '/pipeline/overview/tasks',
      origin: '/pipeline/overview',
    },
    {
      uri: '/recruitment/active/tasks',
      origin: '/recruitment/active',
    },
    {
      uri: '/recruitment/closed/tasks',
      origin: '/recruitment/closed',
    },
  ];

  const appointmentPath = [
    {
      uri: '/pipeline/overview/appointments',
      origin: '/pipeline/overview',
    },
    {
      uri: '/pipeline/orders/appointments',
      origin: '/pipeline/orders',
    },
    {
      uri: '/pipeline/leads/appointments',
      origin: '/pipeline/leads',
    },
    {
      uri: '/recruitment/active/appointments',
      origin: '/recruitment/active',
    },
    {
      uri: '/recruitment/closed/appointments',
      origin: '/recruitment/closed',
    },
  ];

  const detail = (
    <React.Fragment>
      <Switch>
        {contactPath.map((path) => {
          return (
            <Route
              exact
              key={path.uri}
              path={`${path.uri}/:contactId`}
              component={() => <ContactDetail route={path.origin} />}
            />
          );
        })}

        {accountPath.map((path) => {
          return (
            <Route
              exact
              key={path.uri}
              path={`${path.uri}/:organisationId`}
              component={() => <AccountDetail route={path.origin} />}
            />
          );
        })}

        {qualifiedPath.concat(orderPath).map((path) => {
          return (
            <Route
              exact
              key={path.uri}
              path={`${path.uri}/:qualifiedDealId`}
              component={() => <QualifiedDetail route={path.origin} />}
            />
          );
        })}
        {unQualifiedPath.map((path) => {
          return (
            <Route
              exact
              key={path.uri}
              path={`${path.uri}/:unqualifiedDealId`}
              component={() => <UnqualifiedDealDetail route={path.origin} />}
            />
          );
        })}
        {appointmentPath.map((path) => {
          return (
            <Route
              exact
              key={path.uri}
              path={`${path.uri}/:appointmentId`}
              component={() => <AppointmentDetailList route={path.origin} />}
            />
          );
        })}

        {taskPath.map((path) => {
          return (
            <Route
              exact
              exact
              key={path.uri}
              path={`${path.uri}/:taskId`}
              component={() => <ActivitiesTaskDetail route={path.origin} />}
            />
          );
        })}
      </Switch>
    </React.Fragment>
  );
  return <PaneledList list={list} detail={detail} hasDetail={hasDetail} />;
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Recruitment);

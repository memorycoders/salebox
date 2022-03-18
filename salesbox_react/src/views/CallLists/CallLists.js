// @flow
import * as React from 'react';
import _l from 'lib/i18n';
import { withRouter, Route, Switch } from 'react-router';
import { withProps, compose, withHandlers } from 'recompose';
import * as OverviewActions from 'components/Overview/overview.actions';
import { CssNames, OverviewTypes } from 'Constants';
import AccountDetail from '../Accounts/AccountDetail';
import ContactDetail from 'components/Contact/ContactDetail';
import InfiniteCallListContact from 'components/CallListContact/InfiniteCallListContactList';
import InfiniteCallListAccount from 'components/CallListAccount/InfiniteCallListAccountList';
import InfiniteSubCallListContactList from 'components/CallListContact/InfiniteSubCallListContactList';
import InfiniteSubCallListAccountList from 'components/CallListAccount/InfiniteSubCallListAccountList';
import { connect } from 'react-redux';
import QualifiedDetail from '../../components/PipeLineQualifiedDeals/QualifiedDetail';
import UnqualifiedDealDetail from 'components/PipeLineUnqualifiedDeals/UnqualifiedDealDetail';
import { AppointmentDetail } from '../Activities/activities.routes';
import { TaskDetail } from 'views/Task';
import getSearch from '../../components/AdvancedSearch/advanced-search.selectors';


const ActivitiesTaskDetail = ({ route }) => <TaskDetail
  route={route}
  overviewType={OverviewTypes.Activity.Task} color={CssNames.Activity} />;

const AppointmentDetailList = ({ route }) => <AppointmentDetail route={route} overviewType={OverviewTypes.Activity.Appointment} overviewUrl="/activities/appointments" />;


const taskPath = [
  {
    uri: '/call-lists/account/:callListAccountId/:organisationId/tasks',
    origin: '/call-lists/account'
  },
  {
    uri: '/call-lists/contact/:callListContactId/:contactId/tasks',
    origin: '/call-lists/contact'
  },
];



const appointmentPath = [

  {
    uri: '/call-lists/contact/:callListContactId/:contactId/appointments',
    origin: '/call-lists/contact'
  },
  {
    uri: '/call-lists/account/:callListAccountId/:organisationId/appointments',
    origin: '/call-lists/account'
  },
]

const accountPath = [
  {
    uri: '/call-lists/contact/:callListContactId/:contactId/account',
    origin: '/call-lists/contact'
  },
  {
    uri: '/call-lists/account/:callListAccountId/:organisationId/account',
    origin: '/call-lists/account'
  },
];

const orderPath = [
  {
    uri: '/call-lists/contact/:callListContactId/:contactId/order',
    origin: '/call-lists/contact',
  },
  {
    uri: '/call-lists/account/:callListAccountId/:organisationId/order',
    origin: '/call-lists/account'
  },
];
const contactPath = [
  {
    uri: '/call-lists/contact/:callListContactId/:contactId/contact',
    origin: '/call-lists/contact'
  },
  {
    uri: '/call-lists/account/:callListAccountId/:organisationId/contact',
    origin: '/call-lists/account'
  },
];

const unQualifiedPath = [
  {
    uri: '/call-lists/contact/:callListContactId/:contactId/unqualified',
    origin: '/call-lists/contact'
  },
  {
    uri: '/call-lists/account/:callListAccountId/:organisationId/unqualified',
    origin: '/call-lists/account'
  }
];

const qualifiedPath = [
  {
    uri: '/call-lists/contact/:callListContactId/:contactId/qualified',
    origin: '/call-lists/contact'
  },
  {
    uri: '/call-lists/account/:callListAccountId/:organisationId/qualified',
    origin: '/call-lists/account'
  }
];


const CallListAccountDetail = ({ location }) => {
  let linkTo = location.pathname;
  if ((location.pathname.match(/\//g) || []).length > 3) {
    var splitted = location.pathname.split('/');
    linkTo = splitted[0] + '/' + splitted[1] + '/' + splitted[2] + '/' + splitted[3];
  }
  let originId = '';
  if ((location.pathname.match(/\//g) || []).length > 3) {
    const splitted = location.pathname.split('/');
    originId = splitted.length >= 5 ? (splitted[3] + '/' + splitted[4]) : '';
  }

  return <AccountDetail overviewTypeHightlight={'SUB_CALL_LIST_ACCOUNT'} isOrigin route={`/call-lists/account/${originId}`} linkTo={linkTo} />;
}
const callListDelegation = ({
  location,
  hasSubList,
  hasDetail,
  infoSearch
}) => {

  let originId = '';
  if ((location.pathname.match(/\//g) || []).length > 3) {
    const splitted = location.pathname.split('/');
    originId = splitted.length >= 5 ? (splitted[3] + '/' + splitted[4]) : '';
  }
  return (
    <>
      <div className={`container-cl ${hasSubList ? 'sublist' : ''} ${hasDetail && !infoSearch.shown ? 'detail' : ''} `}>
        <div className="list-content" >
          <React.Fragment>
            <Switch>
              {/* <Route  path="/call-lists" component={InfiniteCallListAccount} /> */}
              <Route  path="/call-lists/account" component={InfiniteCallListAccount} />
              <Route  path="/call-lists/contact" component={InfiniteCallListContact} />
            </Switch>
          </React.Fragment>
        </div>
        <div className="sub-list">
          <React.Fragment>
            <Switch>
              <Route  path="/call-lists/account/:callListAccountId" component={InfiniteSubCallListAccountList} />
              <Route  path="/call-lists/contact/:callListContactId" component={InfiniteSubCallListContactList} />
            </Switch>
          </React.Fragment>
        </div>
        <div className="detail">
          <React.Fragment>
            <Switch>

              {qualifiedPath.concat(orderPath).map(path => {

                return <Route exact key={path.uri} path={`${path.uri}/:qualifiedDealId`} component={() => <QualifiedDetail route={path.origin + `/${originId}`} />} />
              })}
              {unQualifiedPath.map(path => {
                return <Route exact key={path.uri} path={`${path.uri}/:unqualifiedDealId`} component={() => <UnqualifiedDealDetail route={path.origin + `/${originId}`} />} />
              })}

              {contactPath.map(path => {
                return <Route exact key={path.uri} path={`${path.uri}/:contactId`} component={() => <ContactDetail route={path.origin + `/${originId}`} />} />
              })}

              {accountPath.map(path => {
                return <Route exact key={path.uri} path={`${path.uri}/:organisationId`} component={() => <AccountDetail route={path.origin + `/${originId}`} />} />
              })}

              {appointmentPath.map(path => {
                return <Route exact key={path.uri} path={`${path.uri}/:appointmentId`} component={() => <AppointmentDetailList route={path.origin + `/${originId}`} />} />
              })}

              {taskPath.map(path => {
                return <Route exact exact key={path.uri} path={`${path.uri}/:taskId`} component={() => <ActivitiesTaskDetail route={path.origin + `/${originId}`} />} />
              })}

              <Route exact key={location.pathname} path="/call-lists/account/:callListAccountId/:organisationId" component={CallListAccountDetail} />
              <Route exact key={location.pathname} path="/call-lists/contact/:callListContactId/:contactId" component={() => {

                let linkTo = location.pathname;
                if ((location.pathname.match(/\//g) || []).length > 3) {
                  var splitted = location.pathname.split('/');
                  linkTo = splitted[0] + '/' + splitted[1] + '/' + splitted[2] + '/' + splitted[3];
                }
                return <ContactDetail overviewTypeHightlight={'SUB_CALL_LIST_CONTACT'} linkTo={linkTo} isOrigin route={`/call-lists/contact/${originId}`} />
              }} />
            </Switch>
          </React.Fragment>
        </div>
      </div>
    </>
  )
};

export default compose(
  connect(
    (state) => ({
      activeTab: state.ui.app.roleTab,
      infoSearch: getSearch(state, state.common.currentObjectType)
    }),
    {
      setActionForHighlight: OverviewActions.setActionForHighlight,
    }
  ),
  withHandlers({
    showCallListContactForm: ({ setActionForHighlight }) => () => {
      setActionForHighlight(OverviewTypes.CallList.Contact, 'subListCreate');
    },
    showCallListAccountForm: ({ setActionForHighlight }) => () => {
      setActionForHighlight(OverviewTypes.CallList.Account, 'subListCreate');
    },
  }),
  withRouter,
  withProps(({ location }) => ({
    hasSubList: (location.pathname.match(/\//g) || []).length > 2,
    hasDetail: (location.pathname.match(/\//g) || []).length > 3,
  }))
)(callListDelegation);

// @flow
import React, { Component, useEffect } from 'react';
import { Route, Switch } from 'react-router';
import { ROUTERS } from 'Constants';
import {
  SettingsView,
  MySettingsView,
  ProfileView,
  SignInView,
  Accounts,
  Contacts,
  Activities,
  Pipeline,
  Delegation,
  CallLists,
  Campaigns,
  Insights,
  TermsOfUseView,
  BillingInfoView,
  MyIntegrations,
  getStartedView,
  ImportCsv,
  Resources,
  SalesAcademy,
  Recruitment,
  RedirectFoxnort,
  StartWithFortnoxView
} from 'views/App/app.routes';
let timeoutRedirect;

function NotFound(props) {
  useEffect(() => {
    clearTimeout(timeoutRedirect);
    timeoutRedirect = setTimeout(() => {
      if (props.isSignedIn) {
        props.history.push(props.handleStartScreen(props.setting));
      }
    }, 1000);
  });
  return null;
}

export default class AppBody extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.isHoverMenu !== this.props.isHoverMenu || nextProps.isShowMenu !== this.props.isShowMenu) {
      return false;
    }
    return true;
  }

  render() {
    return (
      <Switch>
        <Route path={`/startWithFortnox`} component={StartWithFortnoxView}/>
        <Route path={`/redirectFortnox`} component={RedirectFoxnort} />
        <Route path={`/${ROUTERS.SIGN_IN}`} component={SignInView} />
        <Route path={`/${ROUTERS.ACTIVITIES}`} component={Activities} />
        <Route path={`/${ROUTERS.PIPELINE}`} component={Pipeline} />
        <Route path={`/${ROUTERS.ACCOUNTS}`} component={Accounts} />
        <Route path={`/${ROUTERS.CONTACTS}`} component={Contacts} />
        <Route path={`/${ROUTERS.DELEGATION}`} component={Delegation} />
        <Route path={`/${ROUTERS.CALL_LIST}`} component={CallLists} />
        <Route path={`/${ROUTERS.CAMPAIGNS}`} component={Campaigns} />
        <Route path={`/${ROUTERS.INSIGHTS}`} component={Insights} />
        <Route path={`/${ROUTERS.SETTINGS}`} component={SettingsView} />
        <Route path={`/${ROUTERS.MY_SETTINGS}`} component={MySettingsView} />
        <Route path={`/${ROUTERS.PROFILE}`} component={ProfileView} />
        <Route path={`/${ROUTERS.TERMS_OF_USE}`} component={TermsOfUseView} />
        <Route path={`/${ROUTERS.BILLING_INFO}`} component={BillingInfoView} />
        <Route path={`/my-integrations`} component={MyIntegrations} />
        <Route path={`/importCsv`} component={ImportCsv} />
        <Route path={`/${ROUTERS.GET_STARTED}`} component={getStartedView} />
        <Route path={`/${ROUTERS.RESOURCES}`} component={Resources} />
        <Route path={`/${ROUTERS.SALES_ACADEMY}`} component={SalesAcademy} />
        <Route path={`/${ROUTERS.RECRUITMENT}`} component={Recruitment} />
        <Route>
          <NotFound
            history={this.props.history}
            isSignedIn={this.props.isSignedIn}
            handleStartScreen={this.props.handleStartScreen}
            setting={this.props.setting}
          />
        </Route>
      </Switch>
    );
  }
}

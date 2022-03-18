// @flow
import * as React from 'react';
import { i18n } from 'lib/i18n';
import { Helmet } from 'components';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router';
import AppBar from 'components/AppBar/AppBar';
import WizardWelcome from 'components/Wizard/WizardWelcome';
import NotificationCenter from 'components/Notification/NotificationCenter';
import cx from 'classnames';
// Modals
// import CreateContactModal from 'components/Contact/Modals/CreateContactModal';
// import CreateAccountModal from 'components/Organisation/Modals/CreateAccountModal';
import CreateCallListModal from 'components/CallList/CreateCallListModal';
import CreateQualifiedDealModal from 'components/Prospect/CreateQualifiedDealModal/CreateQualifiedDealModal';
import CreateTaskModal from 'components/Task/CreateTaskModal/CreateTaskModal';
import CreateAppointmentModal from 'components/Appointment/CreateAppointmentModal/CreateAppointmentModal';
import CreatePipelineModal from 'components/PipeLineUnqualifiedDeals/CreatePipelineModal/CreatePipelineModal';
import 'semantic-ui-css/semantic.min.css';
import 'style/theme.less';
import 'style/Common.css';

import css from 'components/App/App.css';
import { isSignedIn } from 'components/Auth/auth.selector';
import * as appActions from 'components/App/app.actions';
import AppLoader from 'components/App/AppLoader';
import AppBody from 'components/App/AppBody';
import LeftMenu from 'components/LeftMenu/LeftMenu';
import { withState, withHandlers, lifecycle } from 'recompose';
import { handleLogin, stopSubmitForm } from '../../components/Auth/auth.actions';
import { welcomeStart } from 'components/Wizard/wizard.actions';
import { clearDownload } from '../../store/local-download.reducer';
import { changeLeftMenuStatus } from '../../components/LeftMenu/left-menu.action';

import { OverviewTypes } from 'Constants';
import CreateQualifiedModal from '../../components/PipeLineQualifiedDeals/CreateQualifiedModal';
import OrderRowModal from '../../components/OrderRow/OrderRowModal';
import CreateOrderModal from '../../components/PipeLineQualifiedDeals/CreateOrderModal';
import CreateAccountModal from '../../components/Organisation/CreateAccountModal';
import SuggestForm from '../../components/LeadSuggestForm/SuggestForm';
import CreateContactModal from '../../components/Contact/CreateContactModal';
import CampaignModal from '../../components/Campaigns/CampaignsModal';
import SuggestImportCallList from '../../components/CallList/SuggestImportCallList';
import {
  checkAppointmentFinish,
  initAppointmentAndTaskRemiderNotification,
} from '../../components/Appointment/appointment.actions';
import SuggestAfterFinishAppointment from '../../components/Appointment/Modal/SuggestAfterFinishAppointment';
import ListAppointmentNotHandleToday from '../../components/Appointment/Modal/ListAppointmentNotHandleToday';
import { checkTokenIntegration } from '../../components/Common/common.actions';
import { setIE } from '../../components/Common/common.actions';
import LostTokenModal from '../../components/Common/Modal/LostTokenModal';
//
// import { initLoadFreshdeskFAQ } from '../../components/FreshdeskFAQ/FreshdeskFAQ';
import FlashMessages from '../../components/FlashMessages';
import * as authActions from 'components/Auth/auth.actions';
import ModalCommon from '../../components/ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import { PHONE_TYPES } from '../../Constants';
import RedirectControl from '../../views/MyIntegrations/RedirectControl';
//cfg
import config from '../../../config/index';
import FormAddCategory from '../../components/Category/FormAddCategory';
import FormAddFocus from '../../components/Focus/FormAddFocus';
import CandidateModal from '../../components/Recruitment/CandidateModal';
import ModalAddFortnoxAddonFirst from '../../components/App/ModalAddFortnoxAddonFirst';
import ConfirmAddDupicateModal from '../../components/Organisation/CreateAccountModal/ConfirmAddDupicateModal';

type PropsT = {
  isSignedIn: boolean,
  location: {
    pathname: string,
  },
  seed: number,
  loading: boolean,
  classSbBody: string,
  finishLoading: () => void,
  redraw: () => void,
};

addTranslations({
  se: {
    '{0}': '{0}',
  },
});

class App extends React.Component<PropsT> {
  componentDidMount() {
    const {
      fetchDetailSectionsDisplay,
      finishLoading,
      redraw,
      remember,
      setHelpModeRequest,
      setLocale,
      handleLogin,
      handleWizardActions,
    } = this.props;
    let rememberMe = localStorage.getItem('rememberMe');
    let rememberSession = sessionStorage.getItem('remember');
    finishLoading();

    if (rememberSession) {
      if (remember && remember.remember) {
        const { entities, result } = remember.remember;
        handleLogin(remember.remember);
        handleWizardActions(entities.user[result].isMainContact);
        if (entities.auth && result && entities.auth[result]) {
          setLocale(entities.auth[result].languageCode);
          setHelpModeRequest(entities.auth[result].helpMode);
          stopSubmitForm();
          //fetchDetailSectionsDisplay();
        }
      }
    } else {
      if (remember && remember.remember && rememberMe == 'true') {
        const { entities, result } = remember.remember;
        handleLogin(remember.remember);
        handleWizardActions(entities.user[result].isMainContact);
        if (entities.auth && result && entities.auth[result]) {
          setLocale(entities.auth[result].languageCode);
          setHelpModeRequest(entities.auth[result].helpMode);
          stopSubmitForm();
          //fetchDetailSectionsDisplay();
        }
      } else {
        if (location && location.pathname != '/sign-in' && location.pathname !== '/redirectFortnox'
            && location.pathname !== '/startWithFortnox') {
          this.props.history.push('/sign-in');
        } else if(location && location.pathname != '/sign-in' && location.pathname === '/redirectFortnox'
            && location.pathname !== '/startWithFortnox') {
          this.props.history.push('/redirectFortnox' + location.search);
        } else if(location && location.pathname != '/sign-in' && location.pathname !== '/redirectFortnox'
            && location.pathname === '/startWithFortnox') {
          this.props.history.push('/startWithFortnox' + location.search);
        }
      }
    }
    this.checkAccessFromMobile();
    this.checkBrowserFromUser();
    i18n.setOptions('onChange', () => {
      redraw();
    });
    // initLoadFreshdeskFAQ();

    //check last time login when open browser
    setTimeout(this.props.checkLastLogin, 200);
    setTimeout(this.props.idleTimer, 500);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isSignedIn !== this.props.isSignedIn && nextProps.isSignedIn) {
      this.props.fetchDetailSectionsDisplay();
      this.props.handleAppointmentFinish();
      this.props.checkTokenIntegration();
      this.props.initAppointmentAndTaskRemiderNotification();
    }
    if (nextProps.download !== this.props.download && nextProps.download && nextProps.download.downloadUrl) {
      const { downloadUrl } = nextProps.download;
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = downloadUrl;
      iframe.onload = function() {
        this.parentNode.removeChild(this);
      };
      document.body.appendChild(iframe);
      this.props.clearDownload();
    }
    if (
      nextProps.setting !== this.props.setting &&
      (this.props.location.pathname === '/' || this.props.location.pathname === '/sign-in')
    ) {
      this.props.history.push(this.handleStartScreen(nextProps.setting));
    }
    if (this.props.errorFetch != nextProps.errorFetch && nextProps.errorFetch == 'YOUR_CARD_CANNOT_PAYMENT_CONTINUE') {
      this.props.checkPayment();
    }
  }
  handleStartScreen = (setting) => {
    // const { setting } = this.props;
    if (setting && setting.display) {
      let startScreen = setting.display.startScreen ? setting.display.startScreen.defaultView : 'Task';
      let direction = '';
      switch (startScreen) {
        case 'Task':
          direction = '/activities';
          break;
        case 'Pipeline':
          if (setting.display.pipeline.defaultView === 'Qualified deals') direction = '/pipeline/overview';
          else if (setting.display.pipeline.defaultView === 'Unqualified deals') direction = '/pipeline/leads';
          else if (setting.display.pipeline.defaultView === 'Orders') direction = '/pipeline/orders';
          break;
        case 'Delegation':
          if (setting.display.delegation.defaultView === 'Unqualified deals') direction = '/delegation/leads';
          else {
            direction = '/delegation/tasks';
          }
          break;
        case 'Accounts':
          direction = '/accounts';
          break;
        case 'Contacts':
          direction = '/contacts';
          break;
        case 'Appointments':
          direction = '/activities/appointments';
          break;
        case 'Call Lists':
          if (setting.display.callLists.defaultView === 'Account') direction = '/call-lists/account';
          else {
            direction = '/call-lists/contact';
          }
          break;
        case 'Insights':
          direction = '/insights';
          break;
        case 'Resources':
          direction = '/resources';
          break;
        case 'Recruitments':
          if (setting.display.recruitment.defaultView === 'CandidateActive') direction = '/recruitment/active';
          else if (setting.display.recruitment.defaultView === 'CandidateClosed') direction = '/recruitment/closed';
          break;
        default:
          direction = '/activities';
          break;
      }
      return direction;
    }
  };
  componentWillUnmount() {
    i18n.setOptions('onChange', null);
  }

  getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) {
      return PHONE_TYPES.ANDROID;
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return PHONE_TYPES.IOS;
    }
    return 'unknown';
  }

  checkAccessFromMobile = () => {
    let device = this.getMobileOperatingSystem();
    switch (device) {
      case PHONE_TYPES.ANDROID:
        location.replace('https://play.google.com/store/apps/details?id=com.salesbox.android&hl=en', '_blank');
        break;
      case PHONE_TYPES.IOS:
        location.replace('https://itunes.apple.com/us/app/salesbox-crm-the-sales-gps/id899959535?mt=8', '_blank');
        break;
    }
  };

  checkBrowserFromUser = () => {
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

    var isFirefox = typeof InstallTrigger !== 'undefined';

    var isSafari =
      /constructor/i.test(window.HTMLElement) ||
      (function(p) {
        return p.toString() === '[object SafariRemoteNotification]';
      })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

    var isIE = /*@cc_on!@*/ false || !!document.documentMode;

    var isEdge = !isIE && !!window.StyleMedia;

    var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

    var isBlink = (isChrome || isOpera) && !!window.CSS;

    //With another Browser, just change if()
    if (isIE) {
      this.props.setIE(true);
      // // this.props.history.push('/sign-in?mode=register');
      alert(_l`Salesbox CRM supports the following browsers: Chrome, Safari and Edge`);
    }
  };

  render() {
    const {
      isSignedIn,
      loading,
      seed,
      isShowMenu,
      isHoverMenu,
      location: { pathname },
      handleShowHideMenu,
      handleMouseEnter,
      handleMouseLeave,
      remember,
      onlyShowContent,
      setting,
      history,
    } = this.props;

    if (!isSignedIn && pathname !== '/sign-in' && !remember.remember && !pathname?.includes('/redirectFortnox') && !pathname?.includes("startWithFortnox")) {
      return <Redirect to="/sign-in" />;
    }


    return (
      <div className={css.root} key={seed}>
        {onlyShowContent ? (
          <RedirectControl></RedirectControl>
        ) : (
          <>
            <AppLoader loading={loading} />
            <div className={css.header}>
              <AppBar isSignedIn={isSignedIn} handleShowHideMenu={handleShowHideMenu} />
            </div>
            <div className={css.body}>
              <Helmet>
                <title>Salesbox</title>
                <meta name="description" content="site desc here" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1, maximum-scale=2, user-scalable=yes"
                />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="mobile-web-app-capable" content="yes" />
              </Helmet>
              {isSignedIn && !pathname?.includes('/redirectFortnox') && <WizardWelcome />}
              <div
                className={`${isShowMenu ? css.sbBody : cx(css.sbBody, css.collapseMenu)} ${
                  isSignedIn ? '' : css.hideMenu
                } ${isHoverMenu ? css.hoverMenu : ''}`}
              >
                <div className={css.sbLeftMenu} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  {this.props.errorFetch != 'YOUR_CARD_CANNOT_PAYMENT_CONTINUE' && (
                    <LeftMenu isShowMenu={isShowMenu} isHoverMenu={isHoverMenu} />
                  )}
                </div>
                <div className={css.sbContent}>
                  <AppBody
                    isSignedIn={isSignedIn}
                    history={history}
                    handleStartScreen={this.handleStartScreen}
                    setting={setting}
                    isShowMenu={isShowMenu}
                    isHoverMenu={isHoverMenu}
                  />
                </div>
              </div>
            </div>
            <NotificationCenter />
            <FlashMessages />
            {isSignedIn && (
              <React.Fragment>
                <CreateQualifiedDealModal />
                <CreateTaskModal overviewType={OverviewTypes.Activity.Task} isGlobal />
                <CreateAppointmentModal overviewType={OverviewTypes.Activity.Appointment} />
                <CreateContactModal overviewType={OverviewTypes.Contact} />
                <CreateAccountModal overviewType={OverviewTypes.Account} />
                <CreatePipelineModal />
                <CreateCallListModal />
                <CreateQualifiedModal overviewType={OverviewTypes.Pipeline.Qualified} />
                <OrderRowModal overviewType={OverviewTypes.OrderRow} />
                <CreateOrderModal overviewType={OverviewTypes.Order} />
                <CampaignModal overviewType={OverviewTypes.Campaigns} />
                <CandidateModal overviewType={OverviewTypes.RecruitmentClosed} />
                <SuggestForm></SuggestForm>
                <SuggestImportCallList></SuggestImportCallList>
                <SuggestAfterFinishAppointment></SuggestAfterFinishAppointment>
                <ListAppointmentNotHandleToday></ListAppointmentNotHandleToday>
                <LostTokenModal></LostTokenModal>
                <FormAddCategory />
                <FormAddFocus />
                <ConfirmAddDupicateModal overviewType='ACCOUNTS_TEMP'/>
                <ModalCommon
                  closeOnDimmerClick={false}
                  okHidden
                  cancelLabel={_l`Close`}
                  visible={this.props.visibleModalBilling}
                  onClose={this.props.closeCheckPayment}
                  title={_l`Error`}
                >
                  {_l`Your account has expired. Please ask your Salesbox Administrator to renew your account in Billing info.`}
                </ModalCommon>
                <ModalAddFortnoxAddonFirst/>
              </React.Fragment>
            )}
          </>
        )}
      </div>
    );
  }
}

//check for login
const idleTimer = () => ({ checkToLogout, updateLastTimeUsedRequest }) => {
  let t;
  if (window != undefined) {
    window.onmousemove = resetTimer; // catches mouse movements
    window.onmousedown = resetTimer; // catches mouse movements
    window.onclick = resetTimer; // catches mouse clicks
    window.onscroll = resetTimer; // catches scrolling
    window.onkeypress = resetTimer; // catches keyboard actions
    window.onload = resetTimer; //catches reload actions
  }

  function reload() {
    console.log('auto logout');
    // if (isSignedIn) {
    checkToLogout();
    // }
  }
  let lastTimeUpdate = null;
  function resetTimer() {
    // console.log('resetTimer');
    //reduce the number of updates
    if (lastTimeUpdate == null || new Date().getTime() - lastTimeUpdate > 60000) {
      updateLastTimeUsedRequest();
      lastTimeUpdate = new Date().getTime();
    }
    clearTimeout(t);
    t = setTimeout(reload, config.timeLive); // (1000 is 1 second)
  }
};

export default compose(
  withRouter,
  connect(
    (state) => ({
      loading: state.ui.app.loading,
      isSignedIn: isSignedIn(state),
      seed: state.ui.app.seed,
      remember: state.remember,
      download: state.download,
      leftMenu: state.leftMenu,
      setting: state.settings,
      errorFetch: state.overview.errorFetch,
      auth: state.auth,
    }),
    {
      finishLoading: appActions.finishLoading,
      redraw: appActions.redraw,
      setLocale: appActions.setLocale,
      setHelpModeRequest: appActions.setHelpModeRequest,
      handleLogin: handleLogin,
      stopSubmitForm: stopSubmitForm,
      handleWizardActions: welcomeStart,
      clearDownload: clearDownload,
      changeLeftMenuStatus,
      fetchDetailSectionsDisplay: appActions.fetchDetailSections,
      checkAppointmentFinish: checkAppointmentFinish,
      checkTokenIntegration: checkTokenIntegration,
      setIE: setIE,
      requestLogout: authActions.requestLogout,
      checkToLogout: authActions.checkToLogout,
      checkLastLogin: authActions.checkLastLogin,
      updateLastTimeUsedRequest: appActions.updateLastTimeUsedRequest,
      initAppointmentAndTaskRemiderNotification: initAppointmentAndTaskRemiderNotification,
    }
  ),
  withState('isShowMenu', 'showHideMenu', false),
  withState('onlyShowContent', 'showOnlyContent', false),
  withState('isHoverMenu', 'hoverMenu', false),
  withState('visibleModalBilling', 'setVisibleModalBilling', false),
  lifecycle({
    componentDidMount() {
      const { leftMenuStatus } = this.props.leftMenu;
      this.props.showHideMenu(leftMenuStatus);
      if (this.props.location && this.props.location.pathname === '/redirect') {
        this.props.showOnlyContent(true);
      }
    },
  }),
  withHandlers({
    handleShowHideMenu: (props) => (event) => {
      event.preventDefault();
      props.showHideMenu(!props.isShowMenu);
      props.changeLeftMenuStatus(!props.isShowMenu);
    },
    handleMouseEnter: (props) => (event) => {
      event.preventDefault();
      if (!props.isShowMenu) props.hoverMenu(true);
    },
    handleMouseLeave: (props) => (event) => {
      event.preventDefault();
      if (!props.isShowMenu) props.hoverMenu(false);
    },
    handleAppointmentFinish: ({ checkAppointmentFinish }) => () => {
      checkAppointmentFinish();
    },
    idleTimer: idleTimer(),
    checkPayment: (props) => () => {
      if (props.isSignedIn && props.errorFetch == 'YOUR_CARD_CANNOT_PAYMENT_CONTINUE') {
        props.setVisibleModalBilling(true);
        props.history.push('/billing-info');
      }
    },
    closeCheckPayment: (props) => (event) => {
      props.setVisibleModalBilling(false);
      if (props.auth.admin != 'ALL_COMPANY') {
        props.requestLogout();
      }
    },
  })
)(App);

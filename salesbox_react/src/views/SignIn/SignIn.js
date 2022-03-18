// @flow
import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { isSignedIn, isSignedSuccess } from 'components/Auth/auth.selector';
import { withRouter } from 'react-router';
import * as authActions from 'components/Auth/auth.actions';
import { Image } from 'semantic-ui-react';
import { SignInForm, SignUpForm, ForgotPasswordForm, SetPasswordForm } from 'components';
import { getForgotPassMode } from 'components/Auth/auth.selector';
import css from './SignIn.css';
import _l from 'lib/i18n';
import * as appActions from 'components/App/app.actions';
import { countries } from '../../components/Country/CountryPhoneNumberDropdown';
import {requestLogout} from '../../components/Auth/auth.actions';

addTranslations({
  'en-US': {
    Login: 'Login',
    'Sign up': 'Sign up',
  },
});

type PropsT = {
  isSignedIn: boolean,
  signedSuccess: Boolean,
  forgotPassMode: number,
  history: {
    push: (string) => void,
  },
};
const MODES = {
  login: 'login',
  register: 'register',
  forgotPassword: 'forgotPassword',
  resetPassword: 'resetPassword',
};
const MODE_VALUES = {
  loginSignup: 0,
  forgotPassword: 1,
  resetPassword: 2,
};
const PARAMS = {
  mode: 'mode',
  la: 'la',
};
class SignInView extends React.Component<PropsT> {
  constructor(props) {
    super(props);
    /*
    let urlParams = new URLSearchParams(window.location.search);
    this.mode = urlParams.get(PARAMS.mode);
    this.la = urlParams.get(PARAMS.la);
    if (this.la != null) this.la = this.la.toLowerCase();
    this.isLoginForm = this.mode != MODES.register;

    if(this.mode!=MODES.login && this.mode!=MODES.register && this.mode != MODES.forgotPassword){
      this._changeUrl(MODE_VALUES.loginSignup,this.isLoginForm);
    }else{
      switch (this.mode) {
        case MODES.forgotPassword:
          this.props.switchModeForgotPassword();
          break;
        // case MODES.resetPassword:
        //   this.props.switchModeSetPassword();
        //   break;

      }
    }*/
    this.state = {
      isLoginForm: true,
      mode: MODES.login,
      la: 'en',
    };
  }

  handleStartScreen = () => {
    const { setting } = this.props;
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

  // componentDidUpdate() {
  //   if (this.props.isSignedIn) {
  //     // this.props.history.push('/activities');
  //     if (this.props.setting.display) {
  //       this.props.history.push(this.handleStartScreen());
  //     }
  //   }
  // }

  componentDidMount() {
    //   if (this.props.isSignedIn) {
    //     // this.props.history.push('/activities');
    //     if (this.props.setting.display) {
    //       this.props.history.push(this.handleStartScreen());
    //     }
    //   }

    const { search, hash } = window.location;
    const params = (search ? search : hash).match(/[^&#?]*?=[^&?]*/g);
    const queryObj = {};
    (params || []).map((param) => {
      const paramArr = param.split('=');
      queryObj[paramArr[0]] = paramArr[1];
    });
    // if (queryObj['authorization-code']) {
    //   this.props.requestLogout(false);
    //   this.props.history.push(`/sign-in?mode=login&authorization-code=${queryObj['authorization-code']}`)
    // }

    if (window != 'undefined') {
      let urlParams = new URLSearchParams(window.location.search);
      this.mode = urlParams.get(PARAMS.mode);
      this.la = urlParams.get(PARAMS.la);
      if (this.la != null) this.la = this.la.toLowerCase();
      this.isLoginForm = this.mode != MODES.register;

      if (this.mode != MODES.login && this.mode != MODES.register && this.mode != MODES.forgotPassword) {
        this._changeUrl(MODE_VALUES.loginSignup, this.isLoginForm);
      } else {
        switch (this.mode) {
          case MODES.forgotPassword:
            this.props.switchModeForgotPassword();
            break;
          // case MODES.resetPassword:
          //   this.props.switchModeSetPassword();
          //   break;
        }
      }
      this.setState({
        isLoginForm: this.isLoginForm,
        mode: this.mode,
        la: this.la,
      });
    try {
      if(gtag) {
        gtag('event', 'screen_view', {
          'app_name': 'salesbox',
          'app_version': '0.0.1',
          'screen_name' : this.isLoginForm ? 'Login' : this.mode === MODES.register ? 'Sign Up' : ''
        });
      }
      if(fbq) {
        fbq('track', 'ViewContent', {
          'content_name': this.isLoginForm ? 'Login' : this.mode === MODES.register ? 'Sign Up' : '',
        });
      }
    }catch(ex){}
      // console.log('la: ',this.la);
      let country = countries.filter((c) => c.flag == this.la || (c.value == 'England' && this.la == 'en'));
      if (country != null && country.length > 0) {
        if (this.props.lang != this.la) {
          // console.log('signIn componentDidMount app/setLocale ',window.location.pathname)
          this.props.setLocale(this.la);
        }
      }
    }

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.signedSuccess) {
      this.setState({ isLoginForm: true });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('prevProps.forgotPassMode',prevProps.forgotPassMode);
    // console.log('this.props.forgotPassMode',this.props.forgotPassMode);
    if (this.props.forgotPassMode != prevProps.forgotPassMode) {
      this._changeUrl(this.props.forgotPassMode, true);
    }
  }
  changeForm = (check) => {
    const { changeForm } = this.props;
    if (check) {
      this.setState({
        isLoginForm: false,
      });
    } else {
      this.setState({
        isLoginForm: true,
      });
    }
    try {
    if(gtag) {
      gtag('event', 'screen_view', {
        'app_name': 'salesbox',
        'app_version': '0.0.1',
        'screen_name' : !check ? 'Login' : 'Sign Up'
        });
    }
    if(fbq) {
      fbq('track', 'ViewContent', {
        'content_name': !check ? 'Login' : 'Sign Up'
      });
    }
    }catch(ex){}
    changeForm();

    this._changeUrl(this.props.forgotPassMode, !check);
  };

  _changeUrl(forgotPassMode, isLoginForm) {
    // console.log('forgotPassMode',forgotPassMode);
    let url = null;
    switch (forgotPassMode) {
      case MODE_VALUES.loginSignup:
        if (isLoginForm) {
          url = '?mode=' + MODES.login;
          // window.history.replaceState(null, null, "?mode=" + MODES.login);
        } else {
          url = '?mode=' + MODES.register;
          // window.history.replaceState(null, null, "?mode=" + MODES.register);
        }
        break;
      case MODE_VALUES.forgotPassword:
        url = '?mode=' + MODES.forgotPassword;
        // window.history.replaceState(null, null, "?mode=" + MODES.forgotPassword);
        break;
      // case MODE_VALUES.resetPassword:
      //   window.history.replaceState(null, null, "?mode=" + MODES.resetPassword);
      //   break;
    }
    if (url != null) {
      let urlParams = new URLSearchParams(window.location.search);
      this.la = urlParams.get(PARAMS.la);
      if (this.la != null) this.la = this.la.toLowerCase();
      if (this.la != null && this.la != '') {
        url += '&la=' + this.la;
      }
      window.history.replaceState(null, null, url);
    }
  }
  render() {
    const { isLoginForm } = this.state;
    const year = new Date().getFullYear();
    const { isIE } = this.props;
    return isIE ? (
      <div>{_l`Salesbox CRM supports the following browsers: Chrome, Safari and Edge`}</div>
    ) : (
      <div className={css.root} style={{ display: this.props.isSignedIn ? 'none' : 'block' }}>
        <div className={css.container}>
          <div className={css.centerForm}>
            <Image src="/salesbox-logo-menu.svg" className={css.logo} />
            <div className={css.formWrapper}>
              {/* { this.props.forgotPassMode ==  0 && isLoginForm ?
            // <Tab menu={{ attached: true, tabular: false }} panes={panes} />
            <SignInForm changeForm={this.changeForm} isLoginForm={isLoginForm} /> : <SignUpForm  changeForm={this.changeForm} isLoginForm={isLoginForm}/>
          } */}
              {this.props.forgotPassMode == 0 &&
                (isLoginForm ? (
                  <SignInForm changeForm={this.changeForm} isLoginForm={isLoginForm} />
                ) : (
                  <SignUpForm changeForm={this.changeForm} isLoginForm={isLoginForm} la={this.state.la} />
                ))}
              {this.props.forgotPassMode == 1 && <ForgotPasswordForm />}
              {this.props.forgotPassMode == 2 && <SetPasswordForm />}
            </div>
          </div>
          {/* <div className={css.footer}>Copyright Ⓒ {year} Salesbox &reg; </div> */}
            <div className={css.footer}>Copyright &copy; {year} Salesbox &reg; </div>
        </div>
      </div>
    );
  }
}
const mapDispacthToProps = {
  changeForm: authActions.changeForm,
  switchModeForgotPassword: authActions.switchModeForgotPassword,
  // switchModeSetPassword: authActions.switchModeSetPassword,
  setLocale: appActions.setLocale,
  requestLogout
};
export default compose(
  withRouter,
  connect(
    (state) => ({
      isSignedIn: isSignedIn(state),
      forgotPassMode: getForgotPassMode(state),
      signedSuccess: isSignedSuccess(state),
      setting: state.settings,
      lang: state.ui.app.locale,
      isIE: state.common.isIE,
    }),
    mapDispacthToProps
  )
)(SignInView);

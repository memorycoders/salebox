//@flow
import * as React from 'react';

import { Form, Divider, Segment, Header, Button, Message, Checkbox } from 'semantic-ui-react';
import FormInput from 'components/Form/FormInput';

import { connect } from 'react-redux';
import { compose, withHandlers, lifecycle, withState } from 'recompose';
import { reduxForm, Field, SubmissionError, submit, formValueSelector } from 'redux-form';

import * as authActions from 'components/Auth/auth.actions';

import { isSignedIn, isSignedSuccess } from 'components/Auth/auth.selector';

import css from './SignInForm.css';

import isEmail from 'lib/isEmail';

import _l from 'lib/i18n';
import { getMessageError, isSubmittingForm, getMessageAfterResetPass } from '../Auth/auth.selector';
import { ErrorMessage } from './../../Constants';
import { countries } from '../Country/CountryPhoneNumberDropdown';
import { setIsLoginFromStartPageFortnox } from '../Common/common.actions';

addTranslations({
  'en-US': {
    Email: 'Email',
    Password: 'Password',
    Login: 'Login',
    'You are already signed in': 'You are already signed in',
    'There were some errors with your submission': 'There were some errors with your submission',
    'Remember me': 'Remember me',
    'Forgot password?': 'Forgot password?',
    '{0} is required': '{0} is required',
    'Email is invalid': 'Email is invalid',
    'Username does not exist': 'Username does not exist',
    'Password is incorrect': 'Password is incorrect',
  },
});

type PropsT = {
  anyTouched: boolean,
  submitting: boolean,
  error: string,
  signedIn: boolean,
  signedSuccess: boolean,
  handleSwitchModeForgotPassword: (event: Event, {}) => void,
  handleRemoteLogin: () => void,
};

class SignInForm extends React.Component<PropsT> {
  constructor(props) {
    super(props);

    this.state = {
      rememberMe: true,
    };
  }

  handleCheckRememberMe = () => {
    this.setState({ rememberMe: !this.state.rememberMe });
  };
  onChangeForm = () => {
    if (this.props.isLoginForm) {
      this.props.changeForm(true);
    }
  };

  componentDidMount() {
    //process for confirm account
    if (window != 'undefined') {
      let urlParams = new URLSearchParams(window.location.search);
      this.confirm = urlParams.get('confirm');
      this.email = urlParams.get('email');
      if (this.confirm == 'true' || this.confirm == 'false') {
        this.setState({
          isConfirm: true,
          confirmSuccess: this.confirm == 'true',
          email: this.email,
        });
        if (this.email != null) this.props.setMailDefault(this.email);
      } else {
        this.setState({
          isConfirm: false,
          confirmSuccess: null,
          email: null,
        });
      }
    }
  }

  render() {
    const {
      signedIn,
      messageError,
      error,
      submitting,
      anyTouched,
      handleSubmit,
      handleSwitchModeForgotPassword,
      handleRemoteLogin,
      messageAfterResetPass,
    } = this.props;

    if (signedIn) {
      return (
        <div>
          <Header as="h2" attached="top">{_l`Sign in`}</Header>
          <Segment attached="bottom">
            <Message warning>{_l`You are already signed in`}</Message>
          </Segment>
        </div>
      );
    }

    let { signedSuccess } = this.props;
    if (signedSuccess === null) {
      signedSuccess = false;
    }
    let errMessageDisplay = _l`System is under maintenance. Please try again later.`;
    return (
      <div>
        <div className={css.title}>
          <h2>{_l`Login`}</h2>
          <Button className={css.signUpBtn} onClick={this.onChangeForm}>{_l`Sign up`}</Button>
        </div>

        {messageError &&
          (messageError === ErrorMessage.USERNAME_NOT_FOUND ? (
            <div>
              <p className={css.errorLogin}>{_l`Username does not exist`}</p>
            </div>
          ) : messageError === ErrorMessage.INCORRECT_PASSWORD ? (
            <div>
              <p className={css.errorLogin}>{_l`Password is not correct`}</p>
            </div>
          ) : messageError === ErrorMessage.NETWORK_ERROR ? (
            <div>
              <p className={css.errorLogin}>{errMessageDisplay}</p>
            </div>
          ) : (
            messageError === ErrorMessage.YOUR_ACCOUNT_HAS_BEEN_CANCELLED && (
              <div>
                <p
                  className={css.errorLogin}
                >{_l`Your account has been cancelled. Please contact Salesbox Administrator to reopen your account`}</p>
              </div>
            )
          ))}
        {signedSuccess && (
          <div>
            <p
              className={css.successLogin}
            >{_l`You have received an email. Please follow the instruction to activate your account`}</p>
          </div>
        )}
        {!messageError && messageAfterResetPass && (
          <div>
            <p className={css.successLogin}>{_l`${messageAfterResetPass}`}</p>
          </div>
        )}
        {!messageError &&
          !messageAfterResetPass &&
          !signedSuccess &&
          this.state.isConfirm &&
          (this.state.confirmSuccess ? (
            <div>
              <p className={css.successLogin}>{_l`Confirmation successful`}</p>
            </div>
          ) : (
            <div>
              <p className={css.errorLogin}>{_l`Confirmation failed`}</p>
            </div>
          ))}
        <Form onSubmit={handleRemoteLogin} className={css.formSignIn}>
          <Field
            autoFocus
            autoComplete="email"
            name="email"
            component={FormInput}
            required
            // label={_l`Email`}
            placeholder={_l`Email`}
          />
          <Field
            autoComplete="password"
            name="password"
            type="password"
            component={FormInput}
            // label={_l`Password`}
            placeholder={_l`Password`}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
            {/* <Form.Checkbox label={_l`Remember me`} className={css.remember} /> */}
            <div className={css.rememberMeDiv}>
              <Field name="rememberMe" type="checkbox" component={Checkbox} className={css.rememberMe} />
              <span>{_l`Remember me`}</span>
            </div>
            <div className={css.forgotPass} onClick={handleSwitchModeForgotPassword}>
              {_l`Forgot password?`}
            </div>
          </div>
          <Divider hidden />
          <Form.Field>
            <Button type="submit" fluid disabled={submitting} loading={submitting} className={css.loginBtn}>
              {_l`Login`}
            </Button>
          </Form.Field>
        </Form>

        {/* {error && (
          <Message error>
            <Message.Header>{_l`There were some errors with your submission`}</Message.Header>
            {error}
          </Message>
        )} */}
      </div>
    );
  }
}

const mapStateToProps = (state, { email }) => {
  //             console.log('email',email);
  //   const currForm = selector(state, 'rememberMe','email');
  // console.log('currForm',currForm)

  return {
    signedIn: isSignedIn(state),
    messageError: getMessageError(state),
    submitting: isSubmittingForm(state),
    signedSuccess: isSignedSuccess(state),
    messageAfterResetPass: getMessageAfterResetPass(state),
    initialValues: {
      rememberMe: true,
      email: email,
    },
    enableReinitialize: true,
  };
};
const mapDispatchToProps = {
  switchModeForgotPassword: authActions.switchModeForgotPassword,
  setIsLoginFromStartPageFortnox,
};
// const selector = formValueSelector('login') // <-- same as form name

const handleRequestLoginRemote = (values, dispatch) => {
  const { search, hash } = window.location;
  const params = (search ? search : hash).match(/[^&#?]*?=[^&?]*/g);
  const queryObj = {};
  (params || []).map((param) => {
    const paramArr = param.split('=');
    queryObj[paramArr[0]] = paramArr[1];
  });
  if (queryObj['authorization-code']) {
    dispatch(setIsLoginFromStartPageFortnox(true, queryObj['authorization-code']));
  } else {
    dispatch(setIsLoginFromStartPageFortnox(false, null));
  }
  const { email, password, rememberMe } = values;

  if (!email) {
    throw new SubmissionError({
      email: _l`${_l`Email`} is required`,
      _error: _l`${_l`Email`} is required`,
    });
  } else if (!isEmail(values.email)) {
    throw new SubmissionError({
      email: _l`Email is invalid`,
      _error: _l`Email is invalid`,
    });
  }
  if (!values.password) {
    throw new SubmissionError({
      password: _l`${_l`Password`} is required`,
      _error: _l`${_l`Password`} is required`,
    });
  }
  if (rememberMe) {
    localStorage.setItem('rememberMe', true);
    sessionStorage.setItem('remember', true);
  } else {
    sessionStorage.setItem('remember', true);
    localStorage.setItem('rememberMe', false);
  }
  dispatch(authActions.requestLogin(email, password, rememberMe, 'login'));
  // localStorage.setItem('rememberMe', rememberMe.values);
  // if(values.rememberMe) {
  //   localStorage.setItem('rememberMe', true);
  // } else {
  //   localStorage.setItem('rememberMe', false);
  // }
};

export default compose(
  withState('email', 'setEmail', null),
  reduxForm({
    form: 'login',
    initialValues: {
      rememberMe: true,
    },
    onSubmit: handleRequestLoginRemote,
  }),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    handleSwitchModeForgotPassword: ({ switchModeForgotPassword }) => () => {
      switchModeForgotPassword();
    },
    handleRemoteLogin: ({ submit }) => () => {
      submit('login');
    },
    setMailDefault: ({ setEmail }) => (email) => {
      setEmail(email);
    },
  })
)(SignInForm);

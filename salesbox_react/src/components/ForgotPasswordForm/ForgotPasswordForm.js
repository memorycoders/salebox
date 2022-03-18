//@flow
import * as React from 'react';

// UI
import { Form, Divider, Segment, Header, Button, Message, Icon } from 'semantic-ui-react';
import FormInput from 'components/Form/FormInput';

import _l from 'lib/i18n';

// Redux
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import * as authActions from 'components/Auth/auth.actions';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import css from './ForgotPasswordForm.css';

// Selectors
import isEmail from 'lib/isEmail';
import { getMessageErrorForgotPasword } from '../Auth/auth.selector';
import { ErrorMessage } from '../../Constants';

addTranslations({
  'en-US': {
    Next: 'Next',
    Back: 'Back',
  },
});

type ValuesT = {
  email: string,
};

type PropsT = {
  anyTouched: boolean,
  submitting: boolean,
  error: string,
  signedIn: boolean,
  checkExistedEmail: (email: string, form: string) => void,
  handleSubmit: ((ValuesT) => {}) => {},
  handleSwitchModeSignIn: (event: Event, {}) => void,
  handleSwitchModeSetPassword: (event: Event, {}) => void,
};

class ForgotPasswordForm extends React.Component<PropsT> {
  checkExistedEmail = (values: ValuesT) => {
    const { checkExistedEmail } = this.props;
    const { email } = values;

    if (!email) {
      throw new SubmissionError({
        email: _l`${_l`Email`} is required`,
        _error: _l`${_l`Email`} is required`,
      });
    } else if (!isEmail(values.email)) {
      throw new SubmissionError({
        email: _l`You must type a valid email addresss`,
        _error: _l`You must type a valid email address`,
      });
    } else {
      checkExistedEmail(email, 'forgotPass');
    }
  };

  render() {
    const {
      error,
      submitting,
      anyTouched,
      signedIn,
      handleSubmit,
      handleSwitchModeSignIn,
      handleSwitchModeSetPassword,
      errorMessage,
    } = this.props;

    if (signedIn) {
      return (
        <div>
          <Header as="h2" attached="top">{_l`Forgot password`}</Header>
          <Segment attached="bottom">
            <Message warning>{_l`You are already signed in`}</Message>
          </Segment>
        </div>
      );
    }

    return (
      <div>
        <div className={css.title}>
          <h2>{_l`Forgot password`}</h2>
          <Button className={css.backToSignInBtn} animated onClick={handleSwitchModeSignIn}>
            <Button.Content visible>{_l`Back`}</Button.Content>
            <Button.Content hidden>
              <Icon name="arrow left" />
            </Button.Content>
          </Button>
        </div>
        {errorMessage &&
          errorMessage == ErrorMessage.USER_EMAIL_NOT_FOUND && (
            <div>
              <p className={css.errorText}>{_l`Cannot find a user associated with this email`}</p>
            </div>
          )}
        <Form onSubmit={handleSubmit(this.checkExistedEmail)} className={css.formForgot}>
          <Field
            autoFocus
            autoComplete="email"
            name="email"
            component={FormInput}
            // label={_l`Email`}
            placeholder={_l`Email`}
          />
          <Divider hidden />
          <Form.Field>
            <Button className={css.nextBtn} type="submit" fluid loading={submitting} primary>
              {_l`Next`}
            </Button>
          </Form.Field>
          {/* {error && (
            <Message error>
              <Message.Header>{_l`There were some errors with your submission`}</Message.Header>
              {error}
            </Message>
          )} */}
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    errorMessage: getMessageErrorForgotPasword(state),
  };
};
const mapDispatchToProps = {
  switchModeSignIn: authActions.switchModeSignIn,
  checkExistedEmail: authActions.checkExistedEmail,
  switchModeSetPassword: authActions.switchModeSetPassword,
};

export default compose(
  reduxForm({ form: 'forgotPass' }),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    handleSwitchModeSignIn: ({ switchModeSignIn }) => (event, {}) => {
      switchModeSignIn();
    },
    handleSwitchModeSetPassword: ({ switchModeSetPassword }) => () => {
      switchModeSetPassword();
    },
  })
)(ForgotPasswordForm);

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

// Selectors
import { getForgotPassEmail } from 'components/Auth/auth.selector';

import css from './SetPasswordForm.css';

addTranslations({
  'en-US': {
    'Add a new password': 'Add a new password',
    Done: 'Done',
    Back: 'Back',
    'New password': 'New password',
    'Confirm your password': 'Confirm your password',
    'New password and confirmed password must be the same': 'New password and confirmed password must be the same',
  },
});

type ValuesT = {
  newPass: string,
  confirmNewPass: string,
};

type PropsT = {
  anyTouched: boolean,
  submitting: boolean,
  error: string,
  requestForgotPass: (pass: string, form: string) => void,
  handleSubmit: ((ValuesT) => {}) => {},
  handleSwitchModeSignIn: (event: Event, {}) => void,
};

class SetPasswordForm extends React.Component<PropsT> {
  requestForgotPass = (values: ValuesT) => {
    const {
      requestForgotPass, // Method
      forgotPassEmail, // Data
    } = this.props;

    const { newPass, confirmNewPass } = values;

    if (!newPass) {
      throw new SubmissionError({
        newPass: `Password is required`,
        _error: _l`${_l`New password`} is required`,
      });
    }

    if (!confirmNewPass) {
      throw new SubmissionError({
        confirmNewPass: `Confirm password is required`,
        _error: _l`${_l`Confirm your password`} is required`,
      });
    }

    if (!(newPass === confirmNewPass)) {
      throw new SubmissionError({
        confirmNewPass: `Passwords do not match`,
        _error: _l`${_l`New password and confirmed password must be the same`} is required`,
      });
    }

    requestForgotPass(forgotPassEmail, newPass, 'setPass');
  };

  render() {
    const { error, submitting, anyTouched, handleSubmit, handleSwitchModeSignIn } = this.props;

    return (
      <div>
        <div className={css.title}>
          <h2>{_l`Add a new password`}</h2>
          <Button className={css.backToSignInBtn} animated onClick={handleSwitchModeSignIn}>
            <Button.Content visible>{_l`Back`}</Button.Content>
            <Button.Content hidden>
              <Icon name="arrow left" />
            </Button.Content>
          </Button>
        </div>
        <Form onSubmit={handleSubmit(this.requestForgotPass)} className={css.formSet}>
          <Field
            autoFocus
            autoComplete="newPass"
            name="newPass"
            type="password"
            component={FormInput}
            // label={_l`New Password`}
            placeholder={_l`New password`}
          />
          <Field
            type="password"
            autoComplete="confirmNewPass"
            name="confirmNewPass"
            component={FormInput}
            // label={_l`Confirm your password`}
            placeholder={_l`Confirm your password`}
          />
          <Divider hidden />
          <Form.Field>
            <Button className={css.nextBtn} type="submit" fluid loading={submitting} primary>
              {_l`Done`}
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

const mapStateToProps = (state) => {
  return {
    forgotPassEmail: getForgotPassEmail(state),
  };
};
const mapDispatchToProps = {
  requestForgotPass: authActions.requestForgotPass,
  switchModeSignIn: authActions.switchModeSignIn,
};

export default compose(
  reduxForm({ form: 'setPass' }),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    handleSwitchModeSignIn: ({ switchModeSignIn }) => (event, {}) => {
      switchModeSignIn();
    },
  })
)(SetPasswordForm);

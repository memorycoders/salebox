// @flow
import * as React from 'react';
import { Form, Button, Divider, Message, Image } from 'semantic-ui-react';

import FormInput from 'components/Form/FormInput';
import FormInputFile from 'components/Form/FormInputFile';

import { reduxForm, Field, SubmissionError } from 'redux-form';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import * as wizardActions from 'components/Wizard/wizard.actions';

import css from './PersonalInfo.css';

import _l from 'lib/i18n';
addTranslations({
  'en-US': {
    Next: 'Next',
    'New password': 'New password',
    'Confirm new password': 'Confirm new password',
    'New password and confirmed password must be the same': 'New password and confirmed password must be the same',
  },
});

class PersonalPassForm extends React.Component {
  render() {
    // FIXME: Find the way to reset form when cancel crop photo model.
    const { error, handleSubmit, imageData } = this.props;

    return (
      <Form onSubmit={handleSubmit} className={css.form}>
        <Field
          hiddenInput
          id="uploadImageId"
          name="uploadImage"
          component={FormInputFile}
          label={_l`Do you want to upload your personal photo?`}
          accept="image/*"
        />
        <label htmlFor="uploadImageId">
          <Image src={imageData ? imageData : '/square-image.png'} size="tiny" circular />
        </label>
        <Divider hidden />
        <Field
          autoFocus
          autoComplete="passwordNew"
          name="passwordNew"
          type="password"
          component={FormInput}
          label={_l`New password`}
        />
        <Field
          autoFocus
          autoComplete="passwordConfirm"
          name="passwordConfirm"
          type="password"
          component={FormInput}
          label={_l`Confirm password`}
        />
        <Divider />
        {error && (
          <Message error>
            <Message.Header>{_l`There were some errors with your submission`}</Message.Header>
            {error}
          </Message>
        )}
        {/* <Form.Field className={css.formActionField}>
          <Button type="submit" disabled={submitting || !anyTouched} loading={submitting} primary>
            {_l`Next`}
          </Button>
        </Form.Field> */}
      </Form>
    );
  }
}

const handleUpdateRequestPersonalPassRemote = (values, dispatch) => {
  const { passwordNew, passwordConfirm, uploadImage } = values;

  if (!passwordNew && passwordConfirm) {
    throw new SubmissionError({
      passwordNew: _l`${_l`New Password`} is required`,
      _error: _l`${_l`New Password`} is required`,
    });
  }

  if (passwordNew && !passwordConfirm) {
    throw new SubmissionError({
      passwordConfirm: _l`${_l`Confirm password`} is required`,
      _error: _l`${_l`Confirm password`} is required`,
    });
  }

  if (!(passwordNew === passwordConfirm)) {
    throw new SubmissionError({
      passwordConfirm: _l`${_l`New password and confirmed password must be the same`} is required`,
      _error: _l`${_l`New password and confirmed password must be the same`} is required`,
    });
  }

  if (!uploadImage) {
    dispatch(wizardActions.changePasswordNewRequest(passwordNew, 'wizardPersonalPass'));
  } else {
    dispatch(wizardActions.personalImageUpdatePhotoAvatarRequest(passwordNew, 'wizardPersonalPass'));
  }
};

const mapStateToProps = (state) => {
  return {
    imageData: state.wizard.__UPLOAD.dataURL ? state.wizard.__UPLOAD.dataURL : null,
    initialValues: {
      uploadImage: state.wizard.__UPLOAD.fileFakePath ? state.wizard.__UPLOAD.fileFakePath : '',
    },
  };
};
const mapDispatchToProps = {
  changePasswordNewRequest: wizardActions.changePasswordNewRequest,
  personalImageUpdatePhotoAvatarRequest: wizardActions.personalImageUpdatePhotoAvatarRequest,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'wizardPersonalPass',
    onSubmit: handleUpdateRequestPersonalPassRemote,
  })
)(PersonalPassForm);

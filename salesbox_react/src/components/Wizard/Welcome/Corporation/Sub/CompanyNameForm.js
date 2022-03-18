// @flow
import * as React from 'react';

import { reduxForm, Field } from 'redux-form';
import { compose, withHandlers } from 'recompose';

import { Form, Divider, Image } from 'semantic-ui-react';

import FormInput from 'components/Form/FormInput';
import FormInputFile from 'components/Form/FormInputFile';
import SizeDropdown2 from 'components/Size/SizeDropdown2';

import { connect } from 'react-redux';

import * as wizardActions from 'components/Wizard/wizard.actions';

import { getCompany } from 'components/Wizard/wizard.selector';

import _l from 'lib/i18n';
addTranslations({
  'en-US': {
    'What is the name of your company?': 'What is the name of your company?',
    'Your company name': 'Your company name',
    'What is the size of your company?': 'What is the size of your company?',
    '--': '--',
    'Do you want to upload your company logo?': 'Do you want to upload your company logo?',
    'Next': 'Next',
  },
});

import css from './CompanyInfo.css';

class CompanyNameForm extends React.Component {

  render() {

    // FIXME: Find the way to reset form when cancel crop photo model.
    const {
      handleSubmit,
      imageData,
    } = this.props;

    return (
      <Form onSubmit={handleSubmit} className={css.form}>
        <Field
          autoFocus
          autoComplete="companyName"
          name="companyName"
          component={FormInput}
          label={_l`What is the name of your company?`}
          placeholder={_l`Your company name`}
        />
        <Field
          autoFocus
          autoComplete="companySize"
          name="companySize"
          component={SizeDropdown2}
          label={_l`What is the size of your company?`}
          placeholder={_l`--`}
        />
        <Divider hidden />
        <Field
          hiddenInput
          name="uploadImage"
          id="uploadImageId"
          component={FormInputFile}
          label={_l`Do you want to upload your company logo?`}
          accept="image/*"
        />
        <Divider hidden />

        <label htmlFor="uploadImageId">
        <Image src={imageData ? imageData: '/square-image.png'} size='tiny' circular />
        </label>
        {/* FIXME: Preload Avatar Data */}

        <Divider />
      </Form>
    )
  }
};

const handleUpdateRequestCompanyNameRemote = (values, dispatch) => {
  const { companyName, companySize, uploadImage } = values;

  // FIXME: Form validation here!

  if (!uploadImage) {
    dispatch(wizardActions.companyUpdateRequest(companyName, companySize, 'wizardCompanyName'));   // companySize is passing as [uuid].
  } else {
    dispatch(wizardActions.corpImageUpdatePhotoAvatarRequest(companyName, companySize, 'wizardCompanyName'));
  }
};

const mapStateToProps = (state) => {
  const company = getCompany(state);
  return {
    imageData: state.wizard.__UPLOAD.dataURL ? state.wizard.__UPLOAD.dataURL : null,
    avatarId: state.wizard.corporation.company.avatar ? state.wizard.corporation.company.avatar : null,
    initialValues: {
      companyName: company.name ? company.name : null,
      companySize: company.size ? company.size.uuid : null,
      uploadImage: state.wizard.__UPLOAD.fileFakePath ? state.wizard.__UPLOAD.fileFakePath : "",
    }
  }
};
const mapDispatchToProps = {
  companyUpdateRequest: wizardActions.companyUpdateRequest,
  corpImageUpdatePhotoAvatarRequest: wizardActions.corpImageUpdatePhotoAvatarRequest,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  reduxForm({
    form: 'wizardCompanyName',
    onSubmit: handleUpdateRequestCompanyNameRemote,
  }),
  withHandlers({
  }),
)(CompanyNameForm);

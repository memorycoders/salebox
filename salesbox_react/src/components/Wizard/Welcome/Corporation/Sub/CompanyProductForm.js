// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import { Form, Divider, Image } from 'semantic-ui-react';
import FormInput from 'components/Form/FormInput';
import FormInputFile from 'components/Form/FormInputFile';

import { reduxForm, Field } from 'redux-form';

import * as wizardActions from 'components/Wizard/wizard.actions';

import { getProduct } from 'components/Wizard/wizard.selector';

import _l from 'lib/i18n';
addTranslations({
  'en-US': {
    'Do you want to upload your company logo?': 'Do you want to upload your company logo?',
    "What is your product's/service's name?": "What is your product's/service's name?",
    Product: 'Product',
    'Do you want to upload your personal photo?': 'Do you want to upload your personal photo?',
  },
});

import css from './CompanyInfo.css';

class CompanyProductForm extends React.Component {
  render() {
    // FIXME: Find the way to reset form when cancel crop photo model.
    const { handleSubmit, imageData } = this.props;

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
        {/* FIXME: Preload Avatar Data */}
        <Divider hidden />
        <Field
          autoFocus
          autoComplete="productName"
          name="productName"
          component={FormInput}
          label={_l`Add one of your products/services?`}
          placeholder={_l`Product`}
        />
      </Form>
    );
  }
}

const handleUpdateRequestCompanyProductRemote = (values, dispatch) => {
  const { productName, uploadImage } = values;
  if (!uploadImage) {
    dispatch(wizardActions.lineOfBusinessUpdateRequest(productName, 'wizardCompanyProduct'));
  } else {
    dispatch(wizardActions.corp2ImageUpdatePhotoAvatarRequest(productName, 'wizardCompanyProduct'));
  }
};

const mapStateToProps = (state) => {
  return {
    imageData: state.wizard.__UPLOAD.dataURL ? state.wizard.__UPLOAD.dataURL : null,
    fakePath: state.wizard.__UPLOAD.fileFakePath ? state.wizard.__UPLOAD.fileFakePath : '',
    initialValues: {
      productName: getProduct(state).name,
      uploadImage: state.wizard.__UPLOAD.fileFakePath ? state.wizard.__UPLOAD.fileFakePath : '',
    },
  };
};
const mapDispatchToProps = {
  lineOfBusinessUpdateRequest: wizardActions.lineOfBusinessUpdateRequest,
  imageOnCropEnabled: wizardActions.imageOnCropEnabled,
  corp2ImageUpdatePhotoAvatarRequest: wizardActions.corp2ImageUpdatePhotoAvatarRequest,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'wizardCompanyProduct',
    onSubmit: handleUpdateRequestCompanyProductRemote,
  }),
  withHandlers({})
)(CompanyProductForm);

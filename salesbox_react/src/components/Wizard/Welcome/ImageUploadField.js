
// @flow
import * as React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { Image, Label } from 'semantic-ui-react';

// Language
import _l from 'lib/i18n';

type PropsT = {
};

addTranslations({
  'en-US': {
    'What is the name of your company?': 'What is the name of your company?',
    'Your company name': 'Your company name',
    'What is the size of your company?': 'What is the size of your company?',
    '--': '--',
    'Do you want to upload your company logo?': 'Do you want to upload your company logo?',
  },
});

// FIXME: Unimplemented.
const ImageUploadField = ({
}: PropsT) => {

  return (
    <div>
      <Image src='/square-image.png' size='tiny' circular />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {

  }
};
const mapDispatchToProps = {

};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
)(ImageUploadField);

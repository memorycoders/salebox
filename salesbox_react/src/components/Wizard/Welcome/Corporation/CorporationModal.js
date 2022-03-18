// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import StartPageModal from './Sub/StartPageModal';
import CompanyInfoModal from './Sub/CompanyInfoModal';
import FinishPageModal from './Sub/FinishPageModal';

import _l from 'lib/i18n';
addTranslations({
  'en-US': {
  },
});

const CorporationModal = ({
}: PropsT) => {

  return (
    <div>
      <StartPageModal />
      <CompanyInfoModal />
      <FinishPageModal />
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
)(CorporationModal);

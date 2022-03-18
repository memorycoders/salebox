// @flow
import * as React from 'react';

import CorporationModal from './Welcome/Corporation/CorporationModal';
import PersonalModal from './Welcome/Personal/PersonalModal';

import CropPhotoModal from './Welcome/CropPhotoModal';

class WizardWelcome extends React.Component {

  render() {
    return (
      <div>
        <CorporationModal />
        <PersonalModal />

        <CropPhotoModal />
      </div>
    );
  }
}

export default WizardWelcome;

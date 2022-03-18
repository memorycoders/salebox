import React, { useEffect, memo } from 'react';
import RightsComponent from 'components/Settings/Rights/Rights';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import * as SetingsActions from 'components/Settings/settings.actions';
import { withGetData } from 'lib/hocHelpers';

const Rights = () => {
  return <RightsComponent />;
};

export default compose(
  memo,
  connect(null, {
    requestFetchRightsSettings: SetingsActions.requestFetchRightsSettings,
  }),
  withGetData(({ requestFetchRightsSettings }) => () => requestFetchRightsSettings())
)(Rights);

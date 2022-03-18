// @flow
import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withGetData } from 'lib/hocHelpers';
import * as ProfileActions from 'components/Profile/profile.actions';
import { getUserProfile } from 'components/Profile/profile.selector';
import LanguagePane from './LanguagePane';
import PersonalPane from './PersonalPane';
import ChangePasswordPane from './ChangePasswordPane';
import DisplaySettingsPane from './DisplaySettingsPane/DisplaySettingsPane';
import css from './Settings.css';
import common from 'style/Common.css';
import CropPhotoModal from './UploadAvatar/CropPhotoModal';
import AutomaticReminder from '../Settings/AutomaticReminder';

type PropsT = {
  profile: {},
};

const Settings = ({ profile }: PropsT) => {
  return (
    <div
      style={{ padding: 10, background: 'rgb(240,240,240)' }}
      className={`${common.container} ${common.positionAbsolute} ${css.container}`}
    >
      <Grid columns={2} stackable>
        <Grid.Column>
          <PersonalPane />
          <LanguagePane />
          <ChangePasswordPane />
        </Grid.Column>
        <Grid.Column>
          <DisplaySettingsPane />
          {/* <AutomaticReminder /> */}
        </Grid.Column>
        {/* <Grid.Column>
          <PhonePane phones={profile.additionalPhoneList} />
          <EmailPane emails={profile.additionalEmailList} />
        </Grid.Column> */}
      </Grid>
      <CropPhotoModal type="USER" />
    </div>
  );
};

export default compose(
  connect(
    (state) => ({
      profile: getUserProfile(state),
    }),
    {
      requestFetch: ProfileActions.requestFetch,
    }
  ),
  withGetData(({ requestFetch }) => () => requestFetch())
)(Settings);

//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { FormPair } from 'components';
import { Segment, Menu, Icon, Input, Grid, Image } from 'semantic-ui-react';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import * as authActions from 'components/Auth/auth.actions';
import DiscProfileDropdown from 'components/DiscProfile/DiscProfileDropdown';
import css from './Settings.css';
import { imageOnCropEnabled } from './settings.actions';

type PropsT = {
  firstName: string,
  lastName: string,
  title: string,
  street: string,
  zipCode: string,
  city: string,
  region: string,
  country: string,
  discProfile: string,
  industry: string,
  handleFirstNameChange: (event: Event, { value: string }) => void,
  handleLastNameChange: (event: Event, { value: string }) => void,
  handleTitleChange: (event: Event, { value: string }) => void,
  handleCountryChange: (event: Event, { value: string }) => void,
  handleStreetChange: (event: Event, { value: string }) => void,
  handleCityChange: (event: Event, { value: string }) => void,
  handleRegionChange: (event: Event, { value: string }) => void,
  handleZipCodeChange: (event: Event, { value: string }) => void,
  handleDiscProfileChange: (event: Event, { value: string }) => void,
  handleIndustryChange: (event: Event, { value: string }) => void,
};

addTranslations({
  'en-US': {
    'Last name': 'Last name',
    Title: 'Title',
    Industry: 'Industry',
    Street: 'Street',
    City: 'City',
    Country: 'Country',
    'Select country': 'Select country',
    'Behavior profile': 'Behavior profile',
    'Select behavior profile': 'Select behavior profile',
  },
});

const PersonalPane = ({
  firstName,
  lastName,
  discProfile,
  avatar,
  imageData,
  handleFirstNameChange,
  handleLastNameChange,
  handleDiscProfileChange,
  handleClickAvatar,
  requestUpdateInfo,
}: PropsT) => {
  const avatarUrl = imageData
    ? imageData
    : avatar
    ? `https://d3si3omi71glok.cloudfront.net/salesboxfiles/${avatar.slice(-3)}/${avatar}`
    : null;
  return (
    <div>
      <Menu icon attached="top" borderless style={{ border: 'none', borderBottom: '1px solid rgb(212, 212, 213)' }}>
        <Menu.Item icon>
          <Icon name="user" color="grey" />
        </Menu.Item>
        <Menu.Item header>{_l`Personal information`}</Menu.Item>
      </Menu>
      <Segment attached="bottom" style={{ border: 'none' }}>
        <Grid columns={2}>
          <Grid.Column width={4}>
            <Image
              src={avatarUrl ? avatarUrl : '/square-image.png'}
              // src={'/square-image.png'}
              // size="tiny"
              circular
              onClick={handleClickAvatar}
            />
            <input type="file" id="contact-field-photo" style={{ display: 'none' }} />
          </Grid.Column>
          <Grid.Column width={12}>
            <FormPair mini label={_l`First name`} labelStyle={css.inputLabel} left>
              <Input
                className={css.inputForm}
                fluid
                value={firstName || ''}
                onChange={handleFirstNameChange}
                onBlur={requestUpdateInfo}
              />
            </FormPair>
            <FormPair mini label={_l`Last name`} labelStyle={css.inputLabel} left style={{ margin: '8px 0' }}>
              <Input
                className={css.inputForm}
                id="personalLastName"
                fluid
                value={lastName || ''}
                onChange={handleLastNameChange}
                onBlur={requestUpdateInfo}
              />
            </FormPair>
            <FormPair mini label={_l`Behavior profile`} labelStyle={css.inputLabel} left>
              <DiscProfileDropdown onChange={handleDiscProfileChange} value={discProfile} />
            </FormPair>
          </Grid.Column>
        </Grid>
      </Segment>
    </div>
  );
};

export default compose(
  connect(
    (state) => ({
      firstName: state.auth.user.firstName,
      lastName: state.auth.user.lastName,
      // country: state.auth.user.country,
      // title: state.auth.user.title,
      // street: state.auth.user.street,
      // zipCode: state.auth.user.zipCode,
      // region: state.auth.user.region,
      // industry: state.auth.user.industry,
      discProfile: state.auth.user.discProfile,
      currentUserAvatar: state.auth.user.avatar,
      imageData: state.settings.__UPLOAD ? state.settings.__UPLOAD.dataURL : null,
    }),
    {
      updateProfile: authActions.updateProfile,
      requestUpdatePersonalInfo: authActions.requestUpdatePersonalInfo,
      imageOnCropEnabled,
    }
  ),
  withState('avatar', 'setAvatar', (props) => {
    return props.currentUserAvatar;
  }),
  withHandlers({
    handleFirstNameChange: ({ updateProfile }) => (event, { value: firstName }) => {
      updateProfile({ firstName });
    },
    handleLastNameChange: ({ updateProfile }) => (event, { value: lastName }) => {
      updateProfile({ lastName });
    },
    // handleTitleChange: ({ updateProfile }) => (event, { value: title }) => {
    //   updateProfile({ title });
    // },
    // handleStreetChange: ({ updateProfile }) => (event, { value: street }) => {
    //   updateProfile({ street });
    // },
    // handleZipCodeChange: ({ updateProfile }) => (event, { value: zipCode }) => {
    //   updateProfile({ zipCode });
    // },
    // handleCityChange: ({ updateProfile }) => (event, { value: city }) => {
    //   updateProfile({ city });
    // },
    // handleRegionChange: ({ updateProfile }) => (event, { value: region }) => {
    //   updateProfile({ region });
    // },
    // handleCountryChange: ({ updateProfile, country }) => (event, { value }) => {
    //   if (country !== value) {
    //     updateProfile({ country: value });
    //   }
    // },
    // handleIndustryChange: ({ updateProfile, industry }) => (event, { value }) => {
    //   if (industry !== value) {
    //     updateProfile({ industry: value });
    //   }
    // },
    handleDiscProfileChange: ({ updateProfile, discProfile, requestUpdatePersonalInfo }) => (event, { value }) => {
      if (discProfile !== value) {
        updateProfile({ discProfile: value });
        requestUpdatePersonalInfo();
      }
    },

    handleClickAvatar: ({ imageOnCropEnabled }) => () => {
      document.getElementById('contact-field-photo').click();
      document.getElementById('contact-field-photo').onchange = function() {
        if (this.files && this.files.length) {
          imageOnCropEnabled(this.value, this.files[0]);
        }
      };
    },
    requestUpdateInfo: ({ requestUpdatePersonalInfo }) => () => {
      requestUpdatePersonalInfo();
    },
  })
)(PersonalPane);

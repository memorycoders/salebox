// @flow
import * as React from 'react';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { Menu, Popup, Icon, Button } from 'semantic-ui-react';
import _l from 'lib/i18n';
import * as authActions from 'components/Auth/auth.actions';
import { Link } from 'react-router-dom';
import setting from './Settings.svg';
import { IconButton } from '../Common/IconButton';
import css from './AppBar.css';
import { getAuth, getUser } from '../Auth/auth.selector';
import exportIcon from '../../../public/export.svg';
import config from '../../../config/index';
import api from 'lib/apiClient';
import { Endpoints } from '../../Constants';

type PropsT = {
  requestLogout: () => void,
  open: boolean,
  onOpen: () => void,
  onClose: () => void,
};

addTranslations({
  'en-US': {
    Profile: 'Profile',
    'My settings': 'My settings',
    'Sign out': 'Sign out',
    'Billing info': 'Billing info',
    'Terms of use': 'Terms of use',
  },
});

const popupStyle = {
  padding: 0,
};

const ProfileMenu = ({
  open,
  onOpen,
  onClose,
  requestLogout,
  signUpToUOpen,
  openWidget,
  redirectToAngularPage,
  auth,
  user,
  isCannotPayment,
}: PropsT) => {
  const profileMenuItem = <IconButton imageClass={css.settingIcon} name="profile" size={36} src={setting} />;

  return (
    <Popup
      hoverable
      trigger={profileMenuItem}
      onOpen={onOpen}
      onClose={onClose}
      open={open}
      flowing
      position="bottom center"
      size="huge"
      style={popupStyle}
      on="click"
    >
      <Menu vertical fluid>
        {!isCannotPayment && (
          <>
            {user?.isAdmin && (
              <Menu.Item as={Link} to="/settings/company-info" onClick={onClose}>
                <Icon name="setting" color="grey" />
                {_l`Company settings`}
              </Menu.Item>
            )}

            <Menu.Item as={Link} to="/my-settings" onClick={onClose}>
              <Icon name="setting" color="grey" />
              {_l`My settings`}
            </Menu.Item>
            <Menu.Item as={Link} to="/my-integrations" onClick={onClose}>
              <Icon name="settings" color="grey" />
              {_l`My integrations`}
            </Menu.Item>
            {user?.isAdmin && (
              <Menu.Item onClick={onClose} as={Link} to="/importCsv">
                <Icon name="file excel" color="grey" />
                {_l`.CSV file import`}
              </Menu.Item>
            )}

            <Menu.Item onClick={openWidget}>
              <Icon name="question" color="grey" />
              {_l`FAQ`}
            </Menu.Item>
            <Menu.Item onClick={onClose} as={Link} to="/get-started">
              <Icon name="power" color="grey" />
              {_l`Get started`}
            </Menu.Item>
          </>
        )}
        {/* {canAccessVideo && ( */}
          <Menu.Item as={Link} to="/sales-academy" onClick={onClose}>
            <Icon name="video" color="grey" />
            {_l`Sales academy`}
          </Menu.Item>
        {/* )} */}

        {auth.admin == 'ALL_COMPANY' && (
          <Menu.Item as={Link} to="/billing-info" onClick={onClose}>
            <Icon name="money" color="grey" />
            {_l`Billing`}
          </Menu.Item>
        )}
        <Menu.Item as={Link} to="/terms-of-use" onClick={onClose}>
          <Icon name="list ol" />
          {_l`Terms of use`}
        </Menu.Item>
        <Menu.Item onClick={requestLogout}>
          <Icon name="sign out" color="grey" />
          {_l`Sign out`}
        </Menu.Item>
      </Menu>
    </Popup>
  );
};

const mapStateToProps = (state) => ({
  auth: getAuth(state),
  locale: state.ui.app.locale,
  user: getUser(state),
  isCannotPayment: state.overview.errorFetch == 'YOUR_CARD_CANNOT_PAYMENT_CONTINUE',
  isAllCompany: state.auth.admin == 'ALL_COMPANY',
});
export default compose(
  connect(mapStateToProps, {
    requestLogout: authActions.requestLogout,
    signUpToUOpen: authActions.signUpToUOpen,
    callApiLogout: authActions.callApiLogout
  }),
  withState('open', 'setOpen', false),
  withHandlers({
    onOpen: ({ setOpen }) => () => {
      setOpen(true);
    },
    requestLogout: ({ requestLogout, setOpen, callApiLogout }) => () => {
      callApiLogout();
      requestLogout(false);
      setOpen(false);
      // storage.clear();
    },
    onClose: ({ setOpen }) => () => {
      setOpen(false);
    },
    openWidget: ({ setOpen }) => () => {
      setOpen(false);
      // FreshworksWidget('open');
      window.open(`https://salesbox.com/next-generation-crm-salesbox-explained-in-videos/`, '_blank');
    },
    redirectToAngularPage: ({ auth, locale }) => () => {
      // window.open(`https://old-go.salesbox.com/desktop/#/goToCompanySetting?key=${auth.token}&enterpriseID=${auth.enterpriseID}&la=${locale}`, '_blank'); //production
      // window.open(`https://qa.salesbox.com/desktop/#/goToCompanySetting?key=${auth.token}&enterpriseID=${auth.enterpriseID}&la=${locale}`, '_blank'); //qa
      window.open(
        `${config.envVal.oldWebVersion}/desktop/#/goToCompanySetting?key=${auth.token}&enterpriseID=${auth.enterpriseID}&la=${locale}`,
        '_blank'
      ); //qa
    },
  })
)(ProfileMenu);

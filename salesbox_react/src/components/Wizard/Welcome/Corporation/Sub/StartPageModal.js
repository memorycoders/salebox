// @flow
import * as React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';

import { Modal, Button, Image } from 'semantic-ui-react';

import * as wizardActions from 'components/Wizard/wizard.actions';
import { isFirstLogin } from 'components/Auth/auth.selector';

import _l from 'lib/i18n';

type PropsT = {
  username: string,
  isFirstLogin: boolean,
  currentStep: number,
  isMainContact: boolean,
  handleWelcomeCorpInfo: (event: Event, {}) => void,
  submitting: boolean,
};

addTranslations({
  'en-US': {
    'Welcome to Salesbox': 'Welcome to Salesbox',
    Hello: 'Hello',
    'Ok, I am ready to get started': 'Ok, I am ready to get started',
  },
});

import css from './StartPage.css';
import cssModal from '../../../../ModalCommon/ModalCommon.css';
import cx from 'classnames';

const logo = '/logo-sb.png';

const StartPageModal = ({
  username,
  isFirstLogin,
  currentStep,
  isMainContact,
  handleWelcomeCorpInfo,
  submitting,
}: PropsT) => {
  let isOpened = false;
  if (isFirstLogin && currentStep === 1 && isMainContact) {
    isOpened = true;
  }

  return (
    <div className={css.root}>
      <Modal className={css.welcome} open={isOpened} size="small" centered={true}>
        <Modal.Header className={css.header}></Modal.Header>
        <Modal.Content className={css.content} style={{ textAlign: 'center' }}>
          <Image size="small" src={logo} centered />
          <h1>{_l`Welcome to Salesbox`}</h1>
          <br></br>
{/*
          <p>
            {_l`Hello`} {username}
          </p>
*/}
          <br></br>
{/*
          <p
            className={css.letget}
          >{_l`Let's get to know each other. How about starting with you and your company?`}</p>
*/}
          <br></br>
          <br></br>
          <div style={{ textAlign: 'center' }}>
            <Button
              primary
              onClick={handleWelcomeCorpInfo}
              className={cx(css.button, cssModal.commonButton)}
              disabled={submitting}
              loading={submitting}
            >{_l`Ok, I am ready to get started`}</Button>
          </div>
        </Modal.Content>
        <Modal.Actions className={css.action} style={{ textAlign: 'center' }}>
          {/*<Button primary onClick={handleWelcomeCorpInfo}>{_l`Ok, I am ready to get started`}</Button>*/}
        </Modal.Actions>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    username: state.auth.user.name,
    isFirstLogin: isFirstLogin(state),
    currentStep: state.wizard.corporation.step,
    isMainContact: state.auth.user.isMainContact,
  };
};
const mapDispatchToProps = {
  companyGetRequest: wizardActions.companyGetRequest,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('submitting', 'processSubmitting', false),
  withHandlers({
    handleWelcomeCorpInfo: (props) => (event, {}) => {
      props.processSubmitting(true);
      props.companyGetRequest();
      // props.processSubmitting(false);
    },
  })
)(StartPageModal);

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
  isMainContact: string,
  handleWelcomePersonalInfoPass: (event: Event, {}) => void,
  submitting: boolean,
};

addTranslations({
  'en-US': {
    'Welcome to Salesbox': 'Welcome to Salesbox',
    "Let's get to know each other. How about starting with you?":
      "Let's get to know each other. How about starting with you?",
    Hello: 'Hello',
    'Ok, I am ready to get started': 'Ok, I am ready to get started',
  },
});

import css from '../../Corporation/Sub/StartPage.css';
const logo = '/logo-sb.png';
import cssModal from '../../../../ModalCommon/ModalCommon.css';
import cx from 'classnames';

const StartPageModal = ({
  username,
  isFirstLogin,
  currentStep,
  isMainContact,
  handleWelcomePersonalInfoPass,
  submitting,
}: PropsT) => {
  let isOpened = false;
  if (isFirstLogin && currentStep === 1 && !isMainContact) {
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
          <p className={css.letget}>{_l`Let's get to know each other. How about starting with you?`}</p>
*/}
          <br></br>
          <br></br>
          <div style={{ textAlign: 'center' }}>
            {/*<Button primary onClick={handleWelcomeCorpInfo} className={css.button} disabled={submitting} loading={submitting} >{_l`Ok, I am ready to get started`}</Button>*/}
            <Button
              primary
              onClick={handleWelcomePersonalInfoPass}
              className={cx(css.button, cssModal.commonButton)}
              disabled={submitting}
              loading={submitting}
            >{_l`Ok, I am ready to get started`}</Button>
          </div>
        </Modal.Content>
        <Modal.Actions className={css.action} style={{ textAlign: 'center' }}>
          {/*<Button primary onClick={handleWelcomePersonalInfoPass} disabled={submitting} loading={submitting}>{_l`Ok, I am ready to get started`}</Button>*/}
        </Modal.Actions>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    username: state.auth.user.name,
    isFirstLogin: isFirstLogin(state),
    currentStep: state.wizard.personal.step,
    isMainContact: state.auth.user.isMainContact,
    // submitting: isSubmitting(state),
  };
};
const mapDispatchToProps = {
  welcomePersonalInfo: wizardActions.welcomePersonalInfo,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('submitting', 'processSubmitting', false),
  withHandlers({
    handleWelcomePersonalInfoPass: (props) => (event, {}) => {
      props.processSubmitting(true);
      props.welcomePersonalInfo();
      // props.processSubmitting(false);
    },
  })
)(StartPageModal);

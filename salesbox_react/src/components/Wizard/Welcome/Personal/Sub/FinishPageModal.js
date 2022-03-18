// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';

// UI
import { Modal, Button, Image } from 'semantic-ui-react';

import * as wizardActions from 'components/Wizard/wizard.actions';

// Language
import _l from 'lib/i18n';

type PropsT = {
  isFirstLogin: boolean,
  currentStep: number,
  isMainContact: boolean,
  handleWelcomePersonalUpdateFinished: (event: Event, {}) => void,
};

addTranslations({
  'en-US': {
    'Great job!': 'Great job!',
    "Pretty easy, right? Let's get you started with Salesbox":
      "Pretty easy, right? Let's get you started with Salesbox",
    Done: 'Done',
  },
});

// Styles
import css from './FinishPage.css';
import { isSubmitting } from '../../../../Auth/auth.selector';
import cssModal from '../../../../ModalCommon/ModalCommon.css';
import cx from 'classnames';

const FinishPageModal = ({
  isFirstLogin,
  currentStep,
  isMainContact,
  handleWelcomePersonalUpdateFinished,
  submitting,
}: PropsT) => {
  let isOpened = false;
  if (isFirstLogin && currentStep === 3 && !isMainContact) {
    isOpened = true;
  }

  return (
    <div className={css.root}>
      <Modal className={css.finish} open={isOpened} size="small" centered={true}>
        <Modal.Header className={css.header}></Modal.Header>
        <Modal.Content className={css.content} style={{ textAlign: 'center' }}>
          <div>
            <h1>{_l`Great job!`}</h1>
            <br></br>
            <p className={css.pretty}>{_l`Pretty easy, right? Let's get you started with Salesbox`}</p>
          </div>
        </Modal.Content>
        <Modal.Actions className={css.action} style={{ textAlign: 'center' }}>
          <Button
            primary
            onClick={handleWelcomePersonalUpdateFinished}
            className={cx(css.button, cssModal.commonButton)}
            disabled={submitting}
            loading={submitting}
          >{_l`Done`}</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isFirstLogin: state.auth.user.firstLogin,
    currentStep: state.wizard.personal.step,
    isMainContact: state.auth.user.isMainContact,
    submitting: isSubmitting(state),
  };
};
const mapDispatchToProps = {
  personalUpdateFinishedRequest: wizardActions.personalUpdateFinishedRequest,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    handleWelcomePersonalUpdateFinished: ({ personalUpdateFinishedRequest }) => (event, {}) => {
      personalUpdateFinishedRequest();
    },
  })
)(FinishPageModal);

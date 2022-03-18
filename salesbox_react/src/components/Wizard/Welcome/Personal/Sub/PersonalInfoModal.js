// @flow
import * as React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { submit } from 'redux-form';

import { Tab, Modal, Button, Image } from 'semantic-ui-react';
import PersonalPassForm from './PersonalPassForm';
import InstallLeadClipperInstruction from './InstallLeadClipperInstruction';

import * as authActions from 'components/Auth/auth.actions';
import * as wizardActions from 'components/Wizard/wizard.actions';

import { isFirstLogin } from 'components/Auth/auth.selector';

import _l from 'lib/i18n';
addTranslations({
  'en-US': {
    Next: 'Next',
  },
});

// import css from './PersonalInfo.css';
import css from '../../Corporation/Sub/CompanyInfo.css';
import { isSubmitting } from '../../../../Auth/auth.selector';
import ActionTypes from '../../../wizard.actions';
const logo = '/salesbox-logo-menu.svg';
import cssModal from '../../../../ModalCommon/ModalCommon.css';
import cx from 'classnames';

class PersonalInfoModal extends React.Component {
  render() {
    const {
      isFirstLogin,
      currentStep,
      activeIndex,
      isMainContact,
      handleSaveAndExit,
      dispatch,
      submitting,
      handleWelcomePersonalFinish,
      isSaveAndExit,
    } = this.props;

    // FIXME: Convert to Selector.
    let isOpened = false;
    if (isFirstLogin && currentStep === 2 && !isMainContact) {
      isOpened = true;
    }

    const panes = [
      {
        menuItem: '1. ' + _l`Your Info`,
        render: () => (
          <Tab.Pane attached={false}>
            <PersonalPassForm />
          </Tab.Pane>
        ),
      },
      {
        menuItem: '2. ' + _l`Install LeadClipper`,
        render: () => (
          <Tab.Pane attached={false}>
            <InstallLeadClipperInstruction />
          </Tab.Pane>
        ),
      },
    ];

    return (
      <div className={css.root}>
        <Modal className={css.welcome} open={isOpened}>
          <Modal.Header className={css.header}>
            <Image size="small" src={logo} style={{ display: 'inline-block', paddingLeft: '13px' }} />
            <Button
              primary
              onClick={handleSaveAndExit}
              className={cx(css.button, cssModal.commonButton)}
              disabled={submitting}
              loading={submitting && isSaveAndExit}
            >{_l`Exit`}</Button>
          </Modal.Header>
          <Modal.Content className={css.content}>
            <Tab
              activeIndex={activeIndex}
              menu={{ inverted: false, borderless: true, fluid: true, vertical: true, tabular: false, pointing: false }}
              panes={panes}
            />
          </Modal.Content>
          <Modal.Actions hidden={activeIndex == 1} className={css.action}>
            <Button
              type="button"
              onClick={() => dispatch(submit('wizardPersonalPass'))}
              primary
              className={cx(css.button, cssModal.commonButton)}
              disabled={submitting}
              loading={submitting && !isSaveAndExit}
            >{_l`Next`}</Button>
          </Modal.Actions>
          <Modal.Actions hidden={activeIndex != 1} className={css.action}>
            <Button
              primary
              onClick={handleWelcomePersonalFinish}
              className={cx(css.button, cssModal.commonButton)}
              disabled={submitting}
              loading={submitting && !isSaveAndExit}
            >{_l`Next`}</Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isFirstLogin: isFirstLogin(state),
    currentStep: state.wizard.personal.step,
    activeIndex: state.wizard.personal.tab,
    isMainContact: state.auth.user.isMainContact,
    submitting: isSubmitting(state),
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('isSaveAndExit', 'processIsSaveAndExit', false),
  withHandlers({
    handleSaveAndExit: ({ dispatch, activeIndex, processIsSaveAndExit }) => (event, {}) => {
      processIsSaveAndExit(true);
      dispatch(wizardActions.enableForceLogout());
      if (activeIndex == 0) {
        dispatch(submit('wizardPersonalPass'));
      } else {
        dispatch(authActions.requestLogout());
      }
    },
    handleWelcomePersonalFinish: ({ dispatch }) => (event, {}) => {
      dispatch({ type: ActionTypes.PERSONAL_FINISH });
    },
    // handleWelcomePersonalFinish: ({ welcomePersonalFinish }) => (event, {}) => {
    //   welcomePersonalFinish();
    // },
  })
)(PersonalInfoModal);

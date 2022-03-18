// @flow
import * as React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { submit } from 'redux-form';

import { Tab, Modal, Button, Image } from 'semantic-ui-react';
import CompanyNameForm from './CompanyNameForm';
import CompanyProductForm from './CompanyProductForm';
import InstallLeadClipperInstruction from './InstallLeadClipperInstruction';

import * as authActions from 'components/Auth/auth.actions';
import * as wizardActions from 'components/Wizard/wizard.actions';

import { isFirstLogin } from 'components/Auth/auth.selector';
import {withRouter} from 'react-router';

import _l from 'lib/i18n';
addTranslations({
  'en-US': {
    Next: 'Next',
  },
});

import css from './CompanyInfo.css';
import ActionTypes from '../../../wizard.actions';
import { isSubmitting } from '../../../../Auth/auth.selector';
const logo = '/salesbox-logo-menu.svg';
import cssModal from '../../../../ModalCommon/ModalCommon.css';
import cx from 'classnames';

class CompanyInfoModal extends React.Component {
  render() {
    const {
      isFirstLogin,
      currentStep,
      activeIndex,
      infoStep,
      isMainContact,
      handleSaveAndExit,
      dispatch,
      handleWelcomeCorpFinish,
      submitting,
      isSaveAndExit,
    } = this.props;



    // FIXME: Convert to Selector.
    let isOpened = false;
    if (isFirstLogin && currentStep === 2 && isMainContact) {
      isOpened = true;
    }

    const panes = [
      {
        menuItem: '1. ' + _l`Your Info`,
        render: () => (
          <Tab.Pane attached={false}>
            {infoStep == 1 && <CompanyNameForm />}
            {infoStep == 2 && <CompanyProductForm />}
          </Tab.Pane>
        ),
      },
      {
        menuItem: '2. '+_l`Install LeadClipper`,
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

            {/* type="submit" by default */}
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
          <Modal.Actions hidden={activeIndex == 1} className={`${css.action} ${css.contentBorderBottom}`}>
            {infoStep == 1 && (
              <Button
                type="button"
                onClick={() => dispatch(submit('wizardCompanyName'))}
                primary
                className={cx(css.button, cssModal.commonButton)}
                disabled={submitting}
                loading={submitting && !isSaveAndExit}
              >{_l`Next`}</Button>
            )}
            {infoStep == 2 && (
              <Button
                type="button"
                onClick={() => dispatch(submit('wizardCompanyProduct'))}
                primary
                className={cx(css.button, cssModal.commonButton)}
                disabled={submitting}
                loading={submitting && !isSaveAndExit}
              >{_l`Next`}</Button>
            )}
          </Modal.Actions>
          <Modal.Actions hidden={activeIndex != 1} className={css.action}>
            <Button
              primary
              onClick={handleWelcomeCorpFinish}
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
    currentStep: state.wizard.corporation.step,
    infoStep: state.wizard.corporation.info,
    activeIndex: state.wizard.corporation.tab,
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
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withState('isSaveAndExit', 'processIsSaveAndExit', false),
  withHandlers({
    handleSaveAndExit: ({ dispatch, infoStep, processIsSaveAndExit, history }) => (event, {}) => {
      history.push('/sign-in');
      processIsSaveAndExit(true);
      dispatch(wizardActions.enableForceLogout());
      if (infoStep == 1) {
        dispatch(submit('wizardCompanyName'));
      } else if (infoStep == 2) {
        dispatch(submit('wizardCompanyProduct'));
      } else {
        dispatch(authActions.requestLogout());
      }
    },
    handleWelcomeCorpFinish: ({ dispatch }) => (event, {}) => {
      dispatch({ type: ActionTypes.CORP_FINISH });
    },
  })
)(CompanyInfoModal);

//@flow
import * as React from 'react';
import { Container } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import ConfirmationDialog from 'components/ConfirmationDialog/ConfirmationDialog';
import ModalCommon from '../../ModalCommon/ModalCommon';
// import { makeGetTask } from '../task.selector';
import { withRouter } from 'react-router';
import { makeGetCallListAccount } from '../callListAccount.selector';
import * as CallListAccountActions from '../../CallListAccount/callListAccount.actions';

type PropsT = {
  visible: boolean,
  onClose: () => void,
  onSave: () => void,
};

addTranslations({
  'en-US': {
    Confirm: 'Confirm',
    No: 'No',
    Yes: 'Yes',
  },
});

const SetAccountModal = ({ visible, onClose, onSave }: PropsT) => {
  return (
    <ModalCommon
      title={_l`Confirm`}
      visible={visible}
      onDone={onSave}
      onClose={onClose}
      size="tiny"
      paddingAsHeader={true}
    >
      <p>{_l`Do you really want to set this as done ?`}</p>
    </ModalCommon>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType, itemId }) => {
    const visible = isHighlightAction(state, overviewType, 'set');
    const highlightedId = getHighlighted(state, overviewType);
    return {
      visible,
      callListAccount: highlightedId,
    };
  };
  return mapStateToProps;
};
export default compose(
  withRouter,
  connect(makeMapStateToProps, {
    clearHighlight: OverviewActions.clearHighlightAction,
    setAccount: CallListAccountActions.setAccount,
  }),
  withHandlers({
    onClose: ({ clearHighlight, overviewType, account }) => () => {
      clearHighlight(overviewType);
    },
    onSave: ({ callListAccount, overviewType, setAccount, history }) => () => {
      let path = window.location.pathname;
      let uuid = path.slice('/call-lists/account'.length + 1);
      setAccount(overviewType, callListAccount);
      if (uuid === callListAccount) {
        history.push(`/call-lists/account`);
      }
    },
  })
)(SetAccountModal);

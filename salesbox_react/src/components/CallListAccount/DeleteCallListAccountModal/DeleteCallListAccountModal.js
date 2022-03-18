import React, { Component } from 'react';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { compose, withHandlers } from 'recompose';
import { withRouter } from 'react-router';
import * as OverviewActions from '../../Overview/overview.actions';
import * as CallListAccountActions from '../../CallListAccount/callListAccount.actions';
import _l from 'lib/i18n';
import { isHighlightAction, getHighlighted } from '../../Overview/overview.selectors';

export const DeleteCallListAccountModal = ({ callListAccountId, visible, onClose, onSave }) => {
  return (
    <ModalCommon
      title={_l`Confirm`}
      visible={visible}
      onDone={onSave}
      onClose={onClose}
      size="tiny"
      paddingAsHeader={true}
    >
      <p>{_l`Do you really want to delete?`}</p>
    </ModalCommon>
  );
};
const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'deleteAccountCallList');
    const highlightedId = getHighlighted(state, overviewType);
    return {
      visible,
      callListAccountId: highlightedId,
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = {
  clearHighlight: OverviewActions.clearHighlight,
  deleteAccountCallList: CallListAccountActions.deleteAccountCallList,
};

export default compose(
  withRouter,
  connect(makeMapStateToProps, mapDispatchToProps),
  withHandlers({
    onClose: ({ clearHighlight, callListAccountId, overviewType }) => () => {
      clearHighlight(overviewType, callListAccountId);
    },
    onSave: ({ deleteAccountCallList, overviewType, callListAccountId, history }) => () => {
      let path = window.location.pathname;
      let uuid = path.slice('/call-lists/account'.length + 1);
      deleteAccountCallList(callListAccountId, overviewType);
      if (uuid === callListAccountId) {
        history.push(`/call-lists/account`);
      }
    },
  })
)(DeleteCallListAccountModal);

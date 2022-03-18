import React, { Component } from 'react';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { compose, withHandlers } from 'recompose';
import { withRouter } from 'react-router';
import * as OverviewActions from '../../Overview/overview.actions';
import * as CallListAccountActions from '../../CallListAccount/callListAccount.actions';
import _l from 'lib/i18n';
import { isHighlightAction, getHighlighted } from '../../Overview/overview.selectors';
import { OverviewTypes } from '../../../Constants';

addTranslations({
  'en-US': {
    'Are you sure you want to remove ?': 'Are you sure you want to remove ?',
  },
});

export const RemoveAccountFromCallList = ({ callListAccountId, visible, onClose, onSave }) => {
  return (
    <ModalCommon
      title={_l`Confirm`}
      visible={visible}
      onDone={onSave}
      onClose={onClose}
      size="tiny"
      paddingAsHeader={true}
    >
      <p>{_l`Are you sure you want to remove ?`}</p>
    </ModalCommon>
  );
};
const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'removeAccountFromCallList');
    const highlightedId = getHighlighted(state, overviewType);
    const callListAccountId = getHighlighted(state, OverviewTypes.CallList.Account);
    return {
      visible,
      accountId: highlightedId,
      callListAccountId,
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = {
  clearHighlight: OverviewActions.clearHighlight,
  removeAccountFromCallListAccount: CallListAccountActions.removeAccountFromCallListAccount,
};

export default compose(
  withRouter,
  connect(makeMapStateToProps, mapDispatchToProps),
  withHandlers({
    onClose: ({ clearHighlight, callListAccountId, overviewType }) => () => {
      clearHighlight(overviewType, callListAccountId);
    },
    onSave: ({ removeAccountFromCallListAccount, overviewType, accountId, history, callListAccountId }) => () => {
      // let path = window.location.pathname;
      // let uuid = path.slice('/call-lists/account'.length + 1);
      // deleteAccountCallList(callListAccountId, overviewType);
      // if (uuid === callListAccountId) {
      //   history.push(`/call-lists/account`);
      // }
      removeAccountFromCallListAccount(accountId, callListAccountId, overviewType);
    },
  })
)(RemoveAccountFromCallList);

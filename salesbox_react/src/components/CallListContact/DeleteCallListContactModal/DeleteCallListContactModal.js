import React, { Component } from 'react';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { compose, withHandlers } from 'recompose';
import { withRouter } from 'react-router';
import * as OverviewActions from '../../Overview/overview.actions';
import * as CallListContactActions from '../../CallListContact/callListContact.actions';
import _l from 'lib/i18n';
import { isHighlightAction, getHighlighted } from '../../Overview/overview.selectors';

export const DeleteCallListContactModal = ({ callListContactId, visible, onClose, onSave }) => {
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
    const visible = isHighlightAction(state, overviewType, 'deleteContactCallList');
    const highlightedId = getHighlighted(state, overviewType);
    return {
      visible,
      callListContactId: highlightedId,
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = {
  clearHighlight: OverviewActions.clearHighlight,
  deleteContactCallList: CallListContactActions.deleteContactCallList,
};

export default compose(
  withRouter,
  connect(makeMapStateToProps, mapDispatchToProps),
  withHandlers({
    onClose: ({ clearHighlight, callListContactId, overviewType }) => () => {
      clearHighlight(overviewType, callListContactId);
    },
    onSave: ({ deleteContactCallList, overviewType, callListContactId, history }) => () => {
      let path = window.location.pathname;
      let uuid = path.slice('/call-lists/contact'.length + 1);
      deleteContactCallList(callListContactId, overviewType);
      if (uuid === callListContactId) {
        history.push(`/call-lists/contact`);
      }
    },
  })
)(DeleteCallListContactModal);

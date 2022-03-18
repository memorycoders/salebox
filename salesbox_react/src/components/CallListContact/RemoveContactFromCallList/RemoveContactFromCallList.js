import React, { Component } from 'react';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { compose, withHandlers } from 'recompose';
import { withRouter } from 'react-router';
import * as OverviewActions from '../../Overview/overview.actions';
import * as CallListContactActions from '../../CallListContact/callListContact.actions';
import _l from 'lib/i18n';
import { isHighlightAction, getHighlighted } from '../../Overview/overview.selectors';
import { OverviewTypes } from '../../../Constants';

addTranslations({
  'en-US': {
    'Are you sure you want to remove ?': 'Are you sure you want to remove ?',
  },
});

export const removeContactFromCallList = ({ callListContactId, visible, onClose, onSave }) => {
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
    const visible = isHighlightAction(state, overviewType, 'removeContactFromCallList');
    const highlightedId = getHighlighted(state, overviewType);
    const callListContactId = getHighlighted(state, OverviewTypes.CallList.Contact);
    return {
      visible,
      contactId: highlightedId,
      callListContactId,
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = {
  clearHighlight: OverviewActions.clearHighlight,
  removeContactFromCallListContact: CallListContactActions.removeContactFromCallListContact,
};

export default compose(
  withRouter,
  connect(makeMapStateToProps, mapDispatchToProps),
  withHandlers({
    onClose: ({ clearHighlight, callListContactId, overviewType }) => () => {
      clearHighlight(overviewType, callListContactId);
    },
    onSave: ({ removeContactFromCallListContact, overviewType, contactId, history, callListContactId }) => () => {
      // let path = window.location.pathname;
      // let uuid = path.slice('/call-lists/account'.length + 1);
      // deleteAccountCallList(callListContactId, overviewType);
      // if (uuid === callListContactId) {
      //   history.push(`/call-lists/account`);
      // }
      removeContactFromCallListContact(contactId, callListContactId, overviewType);
    },
  })
)(removeContactFromCallList);

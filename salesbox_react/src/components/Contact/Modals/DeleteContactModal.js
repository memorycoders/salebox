//@flow
import * as React from 'react';
import { Container } from 'semantic-ui-react';

import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import * as OverviewActions from 'components/Overview/overview.actions';
import * as ContactActions from 'components/Contact/contact.actions';

import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import { makeGetContact } from 'components/Contact/contact.selector';

import ConfirmationDialog from 'components/ConfirmationDialog/ConfirmationDialog';

import { OverviewTypes, Colors } from 'Constants';

type PropsT = {
  visible: boolean,
  hideForm: () => void,
  onSave: () => void,
};

import _l from 'lib/i18n';
addTranslations({
  'en-US': {
    'No, keep the contact': 'No, keep the contact',
    'Yes, delete contact': 'Yes, delete contact',
  },
});

const overviewType = OverviewTypes.Contact;

const DeleteContactModal = ({ visible, hideForm, onSave }: PropsT) => {
  return (
    <ConfirmationDialog
      title={_l`Are you sure you want to delete?`}
      yesLabel={_l`Yes, delete contact`}
      noLabel={_l`No, keep the contact`}
      visible={visible}
      onClose={hideForm}
      onSave={onSave}
      color={Colors.Contact}
    >
      <Container
        text
      >{_l`The contact and connected active reminders, prospects, meetings and deals will be removed from all lists.`}</Container>
    </ConfirmationDialog>
  );
};

const makeMapStateToProps = () => {
  const getContact = makeGetContact();
  const mapStateToProps = (state) => {
    const visible = isHighlightAction(state, overviewType, 'delete');
    const highlightedId = getHighlighted(state, overviewType);
    return {
      visible,
      contact: getContact(state, highlightedId),
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = {
  clearHighlight: OverviewActions.clearHighlight,
  requestDeactivate: ContactActions.requestDeactivate,
};
export default compose(
  withRouter,
  connect(makeMapStateToProps, mapDispatchToProps),
  withHandlers({
    hideForm: ({ contact, clearHighlight }) => () => {
      clearHighlight(overviewType, contact.uuid);
    },
    onSave: ({ contact, requestDeactivate, history }) => () => {
      requestDeactivate(contact.uuid, contact.name);
      history.push(`/contacts`);
    },
  })
)(DeleteContactModal);

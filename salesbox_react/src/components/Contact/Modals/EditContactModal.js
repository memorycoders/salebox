//@flow
import * as React from 'react';
import { Transition, Modal, Button } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import { makeGetContact } from 'components/Contact/contact.selector';

import CreateForm from 'components/Contact/Forms/CreateForm';

import { OverviewTypes, UIDefaults, Colors } from 'Constants';

import css from 'Common.css';

type PropsT = {
  visible: boolean,
  hideEditForm: () => void,
  onSave?: () => void,
};

addTranslations({
  'en-US': {
    Cancel: 'Cancel',
    Save: 'Save',
    'Edit contact': 'Edit contact',
  },
});

const overviewType = OverviewTypes.Contact;

const CreateContactModal = ({ visible, hideEditForm, onSave }: PropsT) => {
  return (
    <Transition unmountOnHide visible={visible} animation="fade down" duration={UIDefaults.AnimationDuration}>
      <Modal open onClose={hideEditForm} size="small" closeIcon centered={false}>
        <Modal.Header className={css[Colors.Contact]}>{_l`Update contact`}</Modal.Header>
        <Modal.Content scrolling>
          <CreateForm formKey="__EDIT" />
        </Modal.Content>
        <Modal.Actions>
          <Button basic onClick={hideEditForm}>{_l`Cancel`}</Button>
          <Button primary onClick={onSave}>{_l`Save`}</Button>
        </Modal.Actions>
      </Modal>
    </Transition>
  );
};

const makeMapStateToProps = () => {
  const getContact = makeGetContact();
  const mapStateToProps = (state) => {
    const visible = isHighlightAction(state, overviewType, 'edit');
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
};

export default compose(
  connect(makeMapStateToProps, mapDispatchToProps),
  withHandlers({
    hideEditForm: ({ contact, clearHighlight }) => () => {
      clearHighlight(overviewType, contact.uuid);
    },
  })
)(CreateContactModal);

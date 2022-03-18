//@flow
import * as React from 'react';
import { Transition, Modal, Button } from 'semantic-ui-react';

import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import * as OverviewActions from 'components/Overview/overview.actions';
import * as ContactActions from 'components/Contact/contact.actions';

import { isHighlightAction } from 'components/Overview/overview.selectors';

import CreateForm from 'components/Contact/Forms/CreateForm';

import { OverviewTypes, UIDefaults, Colors } from 'Constants';

import css from 'Common.css';

type PropsT = {
  visible: boolean,
  hideEditForm: () => void,
  onSave: () => void,
};

import _l from 'lib/i18n';
addTranslations({
  'en-US': {
    Cancel: 'Cancel',
    Save: 'Save',
    'Create contact': 'Create contact',
  },
});

const overviewType = OverviewTypes.Contact;

const CreateContactModal = ({ visible, hideEditForm, onSave }: PropsT) => {
  return (
    <Transition unmountOnHide visible={visible} animation="fade down" duration={UIDefaults.AnimationDuration}>
      <Modal open onClose={hideEditForm} size="small" closeIcon centered={false}>
        <Modal.Header className={css[Colors.Contact]}>{_l`Add contact`}</Modal.Header>
        <Modal.Content scrolling>
          <CreateForm formKey="__CREATE" />
        </Modal.Content>
        <Modal.Actions>
          <Button basic onClick={hideEditForm}>{_l`Cancel`}</Button>
          <Button primary onClick={onSave}>{_l`Save`}</Button>
        </Modal.Actions>
      </Modal>
    </Transition>
  );
};

const mapStateToProps = (state) => {
  const visible = isHighlightAction(state, overviewType, 'create');
  return {
    visible,
  };
};

const mapDispatchToProps = {
  clearHighlight: OverviewActions.clearHighlight,
  requestCreate: ContactActions.requestCreate,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withHandlers({
    hideEditForm: ({ clearHighlight }) => () => {
      clearHighlight(overviewType);
    },
    onSave: ({ requestCreate }) => () => {
      // FIXME: form contact validation here.
      requestCreate();
    },
  })
)(CreateContactModal);

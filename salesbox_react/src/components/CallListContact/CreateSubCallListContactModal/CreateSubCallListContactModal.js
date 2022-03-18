//@flow
import * as React from 'react';
import { Transition, Modal, Button } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction } from 'components/Overview/overview.selectors';
import CreateAccountForm from 'components/CallListAccount/CreateSubCallListAccountForm/CreateSubCallListAccountForm';
import { OverviewTypes, Colors, UIDefaults } from 'Constants';
import css from 'Common.css';

type PropsT = {
  visible: boolean,
  hideEditForm: () => void,
  onSave?: () => void,
  form: {},
};

addTranslations({
  'en-US': {
    Cancel: 'Cancel',
    Save: 'Save',
  },
});

const overviewType = OverviewTypes.CallList.Contact;

const CreateSubCallListContactModal = ({ form, visible, hideEditForm, onSave }: PropsT) => {
  return (
    <Transition unmountOnHide visible={visible} animation="fade down" duration={UIDefaults.AnimationDuration}>
      <Modal open onClose={hideEditForm} size="small" closeIcon centered={false}>
        <Modal.Header className={css[Colors.Contact]}>{_l`Search for a contact`}</Modal.Header>
        <Modal.Content scrolling>
          <CreateAccountForm formKey="__CREATE" />
        </Modal.Content>
        <Modal.Actions>
          <Button basic onClick={hideEditForm}>{_l`Cancel`}</Button>
          <Button primary disabled={form.name === ''} onClick={onSave}>{_l`Save`}</Button>
        </Modal.Actions>
      </Modal>
    </Transition>
  );
};

const mapStateToProps = (state) => {
  const visible = isHighlightAction(state, overviewType, 'subListCreate');
  return {
    form: state.entities.organisation.__CREATE || {},
    visible,
  };
};

const mapDispatchToProps = {
  clearHighlight: OverviewActions.clearHighlight,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    hideEditForm: ({ clearHighlight }) => () => {
      clearHighlight(overviewType);
    },
  })
)(CreateSubCallListContactModal);

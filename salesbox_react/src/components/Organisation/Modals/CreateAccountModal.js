//@flow
import * as React from 'react';
import { Transition, Modal, Button } from 'semantic-ui-react';

import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import * as OverviewActions from 'components/Overview/overview.actions';
import * as OrganisationActions from 'components/Organisation/organisation.actions';

import { isHighlightAction } from 'components/Overview/overview.selectors';

import CreateForm from 'components/Organisation/Forms/CreateForm';

import { OverviewTypes, Colors, UIDefaults } from 'Constants';

import css from 'Common.css';

type PropsT = {
  visible: boolean,
  hideEditForm: () => void,
  onSave: () => void,
  form: {},
};

import _l from 'lib/i18n';
addTranslations({
  'en-US': {
    Cancel: 'Cancel',
    Save: 'Save',
    'Create account': 'Create account',
  },
});

const overviewType = OverviewTypes.Account;

const CreateAccountModal = ({ form, visible, hideEditForm, onSave }: PropsT) => {
  return (
    <Transition unmountOnHide visible={visible} animation="fade down" duration={UIDefaults.AnimationDuration}>
      <Modal open onClose={hideEditForm} size="small" closeIcon centered={false}>
        <Modal.Header className={css[Colors.Account]}>{_l`Add company`}</Modal.Header>
        <Modal.Content scrolling>
          <CreateForm formKey="__CREATE" />
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
  const visible = isHighlightAction(state, overviewType, 'create');
  return {
    form: state.entities.organisation.__CREATE || {},
    visible,
  };
};

const mapDispatchToProps = {
  clearHighlight: OverviewActions.clearHighlight,
  requestCreate: OrganisationActions.requestCreate,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    hideEditForm: ({ clearHighlight }) => () => {
      clearHighlight(overviewType);
    },
    onSave: ({ requestCreate }) => () => {
      // FIXME: form account validation here.
      requestCreate();
    },
  })
)(CreateAccountModal);

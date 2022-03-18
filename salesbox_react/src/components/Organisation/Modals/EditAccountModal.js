//@flow
import * as React from 'react';
import { Transition, Modal, Button } from 'semantic-ui-react';

import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import * as OverviewActions from 'components/Overview/overview.actions';
import * as OrganisationActions from 'components/Organisation/organisation.actions';

import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import { makeGetOrganisation } from 'components/Organisation/organisation.selector';

import CreateForm from 'components/Organisation/Forms/CreateForm';

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
    'Edit account': 'Edit account',
  },
});

const overviewType = OverviewTypes.Account;

const EditAccountModal = ({ visible, hideEditForm, onSave }: PropsT) => {
  return (
    <Transition unmountOnHide visible={visible} animation="fade down" duration={UIDefaults.AnimationDuration}>
      <Modal open onClose={hideEditForm} size="small" closeIcon centered={false}>
        <Modal.Header className={css[Colors.Account]}>{_l`Update company`}</Modal.Header>
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
  const getAccount = makeGetOrganisation();
  const mapStateToProps = (state) => {
    const visible = isHighlightAction(state, overviewType, 'edit');
    const highlightedId = getHighlighted(state, overviewType);
    return {
      visible,
      account: getAccount(state, highlightedId),
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = {
  clearHighlight: OverviewActions.clearHighlight,
  requestUpdate: OrganisationActions.requestUpdate,
};

export default compose(
  connect(makeMapStateToProps, mapDispatchToProps),
  withHandlers({
    hideEditForm: ({ account, clearHighlight }) => () => {
      clearHighlight(overviewType, account.uuid);
    },
    onSave: ({ account, requestUpdate }) => () => {
      // FIXME: form validation here.
      requestUpdate(account.uuid);
    },
  })
)(EditAccountModal);

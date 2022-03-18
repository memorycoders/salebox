//@flow
import * as React from 'react';
import { Container } from 'semantic-ui-react';

import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import * as OverviewActions from 'components/Overview/overview.actions';
import * as OrganisationActions from 'components/Organisation/organisation.actions';

import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import { makeGetOrganisation } from 'components/Organisation/organisation.selector';

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
    'No, keep the company': 'No, keep the company',
  },
});

const overviewType = OverviewTypes.Account;

const DeleteAccountModal = ({ visible, hideForm, onSave }: PropsT) => {
  return (
    <ConfirmationDialog
      yesLabel={_l`Yes, delete company`}
      noLabel={_l`No, keep the company`}
      title={_l`Are you sure you want to delete?`}
      visible={visible}
      onClose={hideForm}
      onSave={onSave}
      color={Colors.Contact}
    >
      <Container
        text
      >{_l`The company and connected active reminders, prospects, meetings and deals will be removed from all lists.`}</Container>
    </ConfirmationDialog>
  );
};

const makeMapStateToProps = () => {
  const getAccount = makeGetOrganisation();
  const mapStateToProps = (state) => {
    const visible = isHighlightAction(state, overviewType, 'delete');
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
  requestDeactivate: OrganisationActions.requestDeactivate,
};

export default compose(
  withRouter,
  connect(makeMapStateToProps, mapDispatchToProps),
  withHandlers({
    hideForm: ({ account, clearHighlight }) => () => {
      clearHighlight(overviewType, account.uuid);
    },
    onSave: ({ account, requestDeactivate, history }) => () => {
      requestDeactivate(account.uuid, account.name);
      history.push(`/accounts`);
    },
  })
)(DeleteAccountModal);

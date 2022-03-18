// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Container } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { isAction } from './advanced-search.selectors';
import { ConfirmationDialog } from 'components';
import * as AdvancedSearchActions from './advanced-search.actions';
import ModalCommon from "../ModalCommon/ModalCommon";

type PropsType = {
  visible: boolean,
  hide: () => void,
  name: string,
  removeRequest: () => void,
};

addTranslations({
  'en-US': {
    'Confirm': 'Confirm',
    'Yes': 'Yes',
    "No": "No",
    Name: 'Name',
  },
});

const DeleteAdvancedSearchModal = ({ visible, removeRequest, name, hide }: PropsType) => {
  return (
<>
{/*
    <ConfirmationDialog
      visible={visible}
      onClose={hide}
      yesLabel={_l`Yes, delete this search`}
      noLabel={_l`No, don't delete`}
      yesEnabled={name !== ''}
      onSave={removeRequest}
    >
      <Container text>{_l`Are you sure you want to delete this search?`}</Container>
    </ConfirmationDialog>
*/}
  <ModalCommon title={_l`Confirm`} visible={visible} onDone={removeRequest} onClose={hide} size="tiny" paddingAsHeader={true}
               yesLabel={_l`Yes`} noLabel={_l`No`} >
    <p>{_l`Are you sure you want to delete?`}</p>
  </ModalCommon>
</>

  );
};

export default compose(
  connect(
    (state, { objectType }) => ({
      visible: isAction(state, objectType, 'delete'),
    }),
    {
      setAction: AdvancedSearchActions.setAction,
      setName: AdvancedSearchActions.setName,
      removeRequest: AdvancedSearchActions.removeRequest,
    }
  ),
  withHandlers({
    hide: ({ setAction, objectType }) => () => {
      setAction(objectType, null);
    },
    removeRequest: ({ objectType, removeRequest }) => () => {
      removeRequest(objectType);
    },
  })
)(DeleteAdvancedSearchModal);

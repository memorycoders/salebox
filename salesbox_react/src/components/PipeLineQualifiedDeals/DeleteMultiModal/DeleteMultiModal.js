//@flow
import * as React from 'react';
import { Container } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { changeOnMultiMenu } from '../qualifiedDeal.actions';
import * as ContactActions from '../../Contact/contact.actions';
import { OverviewTypes } from '../../../Constants';
type PropsT = {
  visible: boolean,
  onClose: () => void,
  onSave?: () => void,
};

addTranslations({
  'en-US': {
    Confirm: 'Confirm',
    No: 'No',
    Yes: 'Yes',
    'Are you sure you want to delete all ?': 'Are you sure you want to delete all ?',
  },
});

const DeleteMultiModal = ({ visible, hide, onSave, modalType, overviewType }: PropsT) => {
  return (
    <ModalCommon
      title={_l`Confirm`}
      cancelLabel={_l`No`}
      okLabel={_l`Yes`}
      visible={visible}
      onDone={onSave}
      onClose={hide}
      size="tiny"
      paddingAsHeader={true}
    >
      {overviewType === OverviewTypes.Pipeline.Order && (
        <p>{_l`The deal, active reminders and meetings will be removed.?`}</p>
      )}
      {overviewType === OverviewTypes.Pipeline.Qualified && (
        <p>{_l`The deal, active reminders and meetings will be removed.?`}</p>
      )}
      {overviewType === OverviewTypes.Contact && <p>{_l`Are you sure you want to delete?`}</p>}
    </ModalCommon>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType, modalType = 'delete_multi' }) => {
    const visible = isHighlightAction(state, overviewType, modalType);
    return {
      visible,
    };
  };
  return mapStateToProps;
};
export default compose(
  connect(makeMapStateToProps, {
    clearHighlightAction: OverviewActions.clearHighlightAction,
    changeOnMultiMenu: changeOnMultiMenu,
    changeOnMultiMenuContact: ContactActions.changeOnMultiMenu,
  }),
  withHandlers({
    hide: ({ clearHighlightAction, overviewType }) => () => {
      clearHighlightAction(overviewType);
    },
    onSave: ({ changeOnMultiMenu, modalType = 'delete_multi', overviewType, changeOnMultiMenuContact }) => () => {
      if (overviewType === OverviewTypes.Contact) {
        changeOnMultiMenuContact(modalType, {}, overviewType);
      } else if (overviewType === OverviewTypes.Pipeline.Order || overviewType === OverviewTypes.Pipeline.Qualified) {
        changeOnMultiMenu(modalType, {}, overviewType);
      }
    },
  })
)(DeleteMultiModal);

//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { changeOnMultiMenu } from '../appointment.actions';

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
  },
});

const DeleteMultiAppoinmentModal = ({ visible, hide, onSave, modalType }: PropsT) => {

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
      <p>{_l`Are you sure you want to delete all ?`}</p>
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
  }),
  withHandlers({
    hide: ({ clearHighlightAction, overviewType }) => () => {
      clearHighlightAction(overviewType);
    },
    onSave: ({ changeOnMultiMenu, modalType = 'delete_multi', overviewType }) => () => {
      changeOnMultiMenu(modalType, {}, overviewType);
    },
  })
)(DeleteMultiAppoinmentModal);

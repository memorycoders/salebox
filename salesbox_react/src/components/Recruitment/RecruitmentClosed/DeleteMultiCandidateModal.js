import React from 'react';
import { connect } from 'react-redux';
import _l from 'lib/i18n';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { changeOnMultiMenu } from '../recruitment.actions';
import { isHighlightAction } from '../../Overview/overview.selectors';
import { clearHighlight } from '../../Overview/overview.actions';

export const DeleteMultiCandidateModal = ({ visible, changeOnMultiMenu, overviewType, clearHighlight }) => {
  const onDone = () => {
    changeOnMultiMenu('delete_multi', {}, overviewType);
  };
  const onClose = () => {
    clearHighlight(overviewType);
  };
  return (
    <ModalCommon title={_l`Confirm`} visible={visible} onClose={onClose} onDone={onDone} size="tiny">
      <p>{_l`Are you sure you want to delete?`}</p>
    </ModalCommon>
  );
};

const mapStateToProps = (state, { overviewType }) => ({
  visible: isHighlightAction(state, overviewType, 'delete_multi_candidate'),
});

const mapDispatchToProps = {
  changeOnMultiMenu,
  clearHighlight,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteMultiCandidateModal);

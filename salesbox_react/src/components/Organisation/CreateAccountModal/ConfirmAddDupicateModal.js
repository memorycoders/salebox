import React from 'react';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import { clearHighlight } from '../../Overview/overview.actions';
import { isHighlightAction, getHighlighted } from '../../Overview/overview.selectors';
import { uploadErrors, requestCreate, succeedCreate } from '../organisation.actions';

export const ConfirmAddDupicateModal = (props) => {
  const { visible, clearHighlight, overviewType, __CREATE, name } = props;

  const onDone = () => {
    props.requestCreate(null, true)
    clearHighlight(overviewType);
  };

  const onClose = () => {
    clearHighlight(overviewType);
  };
  return (
    <ModalCommon size="tiny" title={_l`Confirm`} visible={visible} onDone={onDone} onClose={onClose}>
      <p>{`This email already exist on ${name != null ? name : ''}, do you want to update this account?`}</p>
    </ModalCommon>
  );
};

const mapStateToProps = (state, { overviewType }) => {
  const visible = isHighlightAction(state, overviewType, 'confirmAddDuplicateAccount');
  const name = getHighlighted(state, overviewType)
  return {
    visible,
    __CREATE: state.entities?.organisation?.__CREATE,
    name: name
  };
};

const mapDispatchToProps = {
  clearHighlight,
  requestCreate
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmAddDupicateModal);

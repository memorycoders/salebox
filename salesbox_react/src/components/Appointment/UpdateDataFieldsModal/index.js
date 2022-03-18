/* eslint-disable react/prop-types */
//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction } from 'components/Overview/overview.selectors';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { changeOnMultiMenu } from '../appointment.actions';
import DataFieldsForm from './form';
import css from '../../Task/EditTaskModal/EditTaskModal.css';

type PropsT = {
  visible: boolean,
  // hideAssignForm: () => void,
  // onSave?: () => void,
  // handleTagChange: EventHandlerType,
};

addTranslations({
  'en-US': {
    Cancel: 'Cancel',
    Save: 'Save',
    'Update data fields': 'Update data fields',
  },
});

const UpdateDataFieldsModal = ({ visible, hide, onSave, onChange, objectType, overviewType, closeOnDimmerClick,
  changeCloseOnDimmerClick, }: PropsT) => {
  return (
    <ModalCommon
      closeOnDimmerClick={closeOnDimmerClick}
      title={_l`Update data fields`}
      visible={visible}
      cancelLabel={_l`Cancel`}
      okLabel={_l`Save`}
      onDone={onSave}
      onClose={hide}
      size="small"
      scrolling={true}
      className={`${css.editTaskModal} ${css.modalW650}`}
    >
      <DataFieldsForm changeCloseOnDimmerClickParent={changeCloseOnDimmerClick} objectType={objectType} onChange={onChange} overviewType={overviewType} />
    </ModalCommon>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'update_data_fields');
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
  withState('fields', 'setFields', {}),
  withState('closeOnDimmerClick', 'setCloseOnDimmerClick', true),
  withHandlers({
    changeCloseOnDimmerClick: ({ setCloseOnDimmerClick }) => (closeOnDimmerClick) => {
      setCloseOnDimmerClick(closeOnDimmerClick);
    },
    hide: ({ clearHighlightAction, overviewType }) => () => {
      clearHighlightAction(overviewType);
    },
    onSave: ({ changeOnMultiMenu, fields, overviewType }) => () => {

      changeOnMultiMenu('update_data_fields', fields, overviewType);
    },
    onChange: (props) => (data) => {
      props.setFields(data);

    },
  })
)(UpdateDataFieldsModal);

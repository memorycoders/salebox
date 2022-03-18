//@flow
import * as React from 'react';
import { Transition, Modal, Icon, Button } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction } from 'components/Overview/overview.selectors';
import { OverviewTypes, UIDefaults, OverviewColors } from 'Constants';
import AppointmentForm from '../AppointmentForm/AppointmentForm';
import css from '../../Organisation/CreateAccountModal/CreateAccountModal.css';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { updateRequest } from '../appointment.actions';

type PropsT = {
  visible: boolean,
  hideForm: () => void,
  onSave?: () => void,
  color: string,
  form: {},
};

addTranslations({
  'en-US': {
    Cancel: 'Cancel',
    Save: 'Save',
    'Edit appointment': 'Edit appointment',
  },
});

// const overviewType = OverviewTypes.Activity.Appointment;

const EditAppointmentModal = ({
  form,
  color,
  visible,
  hideForm,
  onSave,
  closeOnDimmerClick,
  changeCloseOnDimmerClick,
  overviewType,
}: PropsT) => {
  return (
    <ModalCommon
      closeOnDimmerClick={closeOnDimmerClick}
      title={_l`Update meeting`}
      visible={visible}
      className={css.modal}
      onDone={onSave}
      onClose={hideForm}
      okLabel={_l`Save`}
      scrolling={true}
    >
      <AppointmentForm formKey="__EDIT" changeCloseOnDimmerClickParent={changeCloseOnDimmerClick} />
    </ModalCommon>
  );
};

const mapStateToProps = (state, { overviewType }) => {
  const visible = isHighlightAction(state, overviewType, 'edit');
  return {
    color: OverviewColors[state.ui.app.activeOverview],
    form: state.entities.appointment.__EDIT || {},
    visible,
  };
};

const mapDispatchToProps = {
  clearHighlight: OverviewActions.clearHighlight,
  updateRequest,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('closeOnDimmerClick', 'setCloseOnDimmerClick', true),
  withHandlers({
    hideForm: ({ clearHighlight, overviewType }) => () => {
      clearHighlight(overviewType);
    },
    changeCloseOnDimmerClick: ({ setCloseOnDimmerClick }) => (closeOnDimmerClick) => {
      setCloseOnDimmerClick(closeOnDimmerClick);
    },
    onSave: ({ overviewType, updateRequest, form, update }) => () => {
      const { title } = form;
      if (!title) {
        update('__ERRORS', { title: _l`Title is required` });
      } else {
        updateRequest(overviewType);
      }
    },
  })
)(EditAppointmentModal);

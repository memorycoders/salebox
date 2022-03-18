/* eslint-disable react/prop-types */
//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction } from 'components/Overview/overview.selectors';
import { OverviewColors } from 'Constants';
import AppointmentForm from 'components/Appointment/AppointmentForm/AppointmentForm';
import css from '../../Organisation/CreateAccountModal/CreateAccountModal.css';
import { createRequest, update, createRequestSuccess } from '../appointment.actions';
import { getCustomFieldsObject } from '../../CustomField/custom-field.selectors';

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
    'Title is required': 'Title is required',
  },
});

// const overviewType = OverviewTypes.Activity.Appointment;

const CreateAppointmentModal = ({
  form,
  color,
  visible,
  customField,
  hideForm,
  onSave,
  closeOnDimmerClick,
  changeCloseOnDimmerClick,
  overviewType,
}: PropsT) => {
  return (
    <ModalCommon
      closeOnDimmerClick={closeOnDimmerClick}
      title={_l`Add meeting`}
      visible={visible}
      onDone={onSave}
      onClose={hideForm}
      okLabel={_l`save`}
      scrolling={true}
      className={customField.length > 0 ? css.modalCustomField : css.appointmentModal}
    >
      <AppointmentForm
        formKey="__CREATE"
        changeCloseOnDimmerClickParent={changeCloseOnDimmerClick}
        overviewType={overviewType}
      />
    </ModalCommon>
  );
};

const mapStateToProps = (state, { overviewType }) => {
  const visible = isHighlightAction(state, overviewType, 'create');
  const customField = getCustomFieldsObject(state);
  return {
    customField,
    color: OverviewColors[state.ui.app.activeOverview],
    form: state.entities.appointment.__CREATE || {},
    visible,
  };
};

const mapDispatchToProps = {
  clearHighlight: OverviewActions.clearHighlight,
  createRequest,
  update,
  createRequestSuccess,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('closeOnDimmerClick', 'setCloseOnDimmerClick', true),
  withHandlers({
    hideForm: ({ clearHighlight, overviewType, createRequestSuccess, update }) => () => {
      clearHighlight(overviewType);
      createRequestSuccess();
      update('__ERRORS', { title: null, contact: null });
    },
    onSave: ({ overviewType, createRequest, form, update }) => () => {
      const { title } = form;
      if (!title) {
        update('__ERRORS', { title: _l`Title is required` });
      } else {
        createRequest(overviewType);
      }
    },
    changeCloseOnDimmerClick: ({ setCloseOnDimmerClick }) => (closeOnDimmerClick) => {
      setCloseOnDimmerClick(closeOnDimmerClick);
    },
  })
)(CreateAppointmentModal);

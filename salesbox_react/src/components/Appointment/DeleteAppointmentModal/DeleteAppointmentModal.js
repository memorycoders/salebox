//@flow
import * as React from 'react';
import { Container } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import ConfirmationDialog from 'components/ConfirmationDialog/ConfirmationDialog';
import { makeGetAppointment } from 'components/Appointment/appointment.selector';
import { OverviewTypes, Colors } from 'Constants';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { deleteAppointment } from '../../Appointment/appointment.actions';
import { withRouter } from 'react-router';

type PropsT = {
  visible: boolean,
  hideForm: () => void,
  onSave?: () => void,
};

addTranslations({
  'en-US': {},
});

const overviewType = OverviewTypes.Activity.Appointment;

const DeleteAppointmentModal = ({ visible, hideForm, onSave }: PropsT) => {
  return (
    // <ConfirmationDialog
    //   title={_l`Delete appointment?`}
    //   yesLabel={_l`Yes, delete appointment`}
    //   noLabel={_l`No, keep the meeting`}
    //   visible={visible}
    //   onClose={hideForm}
    //   onSave={onSave}
    //   color={Colors.Activity}
    // >
    //   <Container text>{_l`Are you sure you want to delete this appointment?`}</Container>
    // </ConfirmationDialog>

    <ModalCommon
      title={_l`Confirm`}
      visible={visible}
      onDone={onSave}
      onClose={hideForm}
      size="tiny"
      paddingAsHeader={true}
    >
      <p>{_l`Do you really want to delete?`}</p>
    </ModalCommon>
  );
};

const makeMapStateToProps = () => {
  const getAppointment = makeGetAppointment();
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'delete');
    const highlightedId = getHighlighted(state, overviewType);
    return {
      visible,
      // appointment: getAppointment(state, highlightedId),
      // form: state.entities.appointment.__EDIT || {},
      appointment: { uuid: highlightedId },
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = {
  clearHighlight: OverviewActions.clearHighlight,
  deleteAppointment,
};
export default compose(
  withRouter,
  connect(makeMapStateToProps, mapDispatchToProps),
  withHandlers({
    hideForm: ({ appointment, clearHighlight, overviewType }) => () => {
      if (overviewType === OverviewTypes.Activity.Appointment) {
        clearHighlight(overviewType, appointment.uuid);
      } else {
        clearHighlight(overviewType, appointment.uuid);
      }
    },
    onSave: ({ appointment, deleteAppointment, overviewType, history }) => () => {
      if (overviewType === OverviewTypes.Activity.Appointment) {
        let path = window.location.pathname;
        let uuid = path.slice('/activities/appointments'.length + 1);
        deleteAppointment(appointment.uuid, overviewType);
        if (uuid === appointment.uuid) {
          history.push(`/activities/appointments`);
        }

        uuid = path.slice('/activities/calendar'.length + 1);
        if (uuid === appointment.uuid) {
          history.push(`/activities/calendar`);
        }
      }
      // if (overviewType === OverviewTypes.Account_Appointment)
      else {
        deleteAppointment(appointment.uuid, overviewType);
      }
    },
  })
)(DeleteAppointmentModal);

//@flow

import React from 'react';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import { Table, TableRow, TableCell, TableBody } from 'semantic-ui-react';
import { connect } from 'react-redux';
import {
  setModalAppointmentSuggest,
  setCurrentSuggestAction,
  updateNoteSaga,
  setListAppointmentNotHandleToday,
} from '../appointment.actions';
import AddNoteModal from '../../Note/AddNoteModal';
import { OverviewTypes, APPOINTMENT_SUGGEST_ACTION_NAME, OPEN_APPOINTMENT_SUGGEST_FROM } from '../../../Constants';
import { setActionForHighlight } from '../../Overview/overview.actions';
const listSuugestActions = [
  {
    name: `Add a note`,
    action: APPOINTMENT_SUGGEST_ACTION_NAME.ADD_NOTE,
  },
  {
    name: `Add a reminder`,
    action: APPOINTMENT_SUGGEST_ACTION_NAME.ADD_REMINDER,
  },
  {
    name: `Add a meeting`,
    action: APPOINTMENT_SUGGEST_ACTION_NAME.ADD_MEETING,
  },
  {
    name: `Add a prospect`,
    action: APPOINTMENT_SUGGEST_ACTION_NAME.ADD_PROSPECT,
  },
  {
    name: `Add a deal`,
    action: APPOINTMENT_SUGGEST_ACTION_NAME.ADD_DEAL,
  },
];

class SuggestAfterFinishAppointment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
    };
  }

  onDone = () => {};

  handleOnClickActions = (action) => {
    this.props.setCurrentSuggestAction(action, this.props.appointment);
    switch (action) {
      case APPOINTMENT_SUGGEST_ACTION_NAME.ADD_REMINDER:
        this.props.setActionForHighlight(OverviewTypes.Activity.Task, 'create');
        break;
      case APPOINTMENT_SUGGEST_ACTION_NAME.ADD_MEETING:
        this.props.setActionForHighlight(OverviewTypes.Activity.Appointment, 'create');
        break;
      case APPOINTMENT_SUGGEST_ACTION_NAME.ADD_PROSPECT:
        this.props.setActionForHighlight(OverviewTypes.Pipeline.Lead, 'create');
        break;
      case APPOINTMENT_SUGGEST_ACTION_NAME.ADD_DEAL:
        this.props.setActionForHighlight(OverviewTypes.Pipeline.Qualified, 'create');
        break;
      default:
        this.props.setModalAppointmentSuggest(false);
    }
  };

  onCloseSuggestModal = () => {
    this.props.setModalAppointmentSuggest(false);
    if (this.props.openFrom) {
      switch (this.props.openFrom) {
        case OPEN_APPOINTMENT_SUGGEST_FROM.LIST_APPOINTMENT_NOT_HANDLE_TODAY:
          this.props.setListAppointmentNotHandleToday(true);
          break;
      }
    }
  };
  closeSuggestAction = () => {
    this.props.setModalAppointmentSuggest(true);
    this.props.setCurrentSuggestAction(null);
  };

  handleNoteChange = (value) => {
    this.props.updateNoteSaga(this.props.appointment.uuid, value);
    this.closeSuggestAction();
  };

  render() {
    return (
      <>
        <ModalCommon
          title={_l`Suggested actions`}
          visible={this.props.statusModal}
          onDone={this.onCloseSuggestModal}
          onClose={this.onCloseSuggestModal}
          scrolling={false}
          size="tiny"
          cancelLabel={_l`Back`}
          paddingAsHeader={true}
        >
          <Table compact className="table-suggest">
            <TableBody>
              - {_l`Your meeting ${this.props.title ? `with ${this.props.title}` : ''} just finished now it's time to take the next action`}
              {listSuugestActions.map((e) => (
                <TableRow>
                  <TableCell onClick={() => this.handleOnClickActions(e.action)}>{_l.call(this, [e.name])}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ModalCommon>
        <AddNoteModal
          size="tiny"
          onChange={this.handleNoteChange}
          onClose={this.closeSuggestAction}
          visible={this.props.currentSuggestAction === APPOINTMENT_SUGGEST_ACTION_NAME.ADD_NOTE}
        ></AddNoteModal>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  let __appointment = state.entities.appointment.modalSuggestAppointmentFinish;
  return {
    statusModal: __appointment ? __appointment.status : false,
    appointment: __appointment ? __appointment.appointment : null,
    openFrom: __appointment ? __appointment.openFrom : false,
    currentSuggestAction: state.entities.appointment.currentSuggestAction,
    title:
      __appointment && (__appointment.appointment.firstContactName
        ? __appointment.appointment.firstContactName
        : __appointment.appointment.organisation && __appointment.appointment.organisation.name
        ? __appointment.appointment.organisation.name
        : null),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setModalAppointmentSuggest: (status, appointment) => dispatch(setModalAppointmentSuggest(status, appointment)),
    setCurrentSuggestAction: (actionName, appointment) => dispatch(setCurrentSuggestAction(actionName, appointment)),
    updateNoteSaga: (id, note) => dispatch(updateNoteSaga(id, note)),
    setActionForHighlight: (id, type) => dispatch(setActionForHighlight(id, type)),
    setListAppointmentNotHandleToday: (status, listAppointment) =>
      dispatch(setListAppointmentNotHandleToday(status, listAppointment)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SuggestAfterFinishAppointment);

//@flow

import React from 'react';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import { Table, TableRow, TableCell, TableBody, ModalContent } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { setModalAppointmentSuggest, setListAppointmentNotHandleToday } from '../appointment.actions';
import { OPEN_APPOINTMENT_SUGGEST_FROM } from '../../../Constants';
import moment from 'moment';
addTranslations({
  'en-US': {
    "Today's not handled appointments": "Today's not handled appointments",
    Later: 'Later',
    'Take action on..': 'Take action on..',
  },
});

class ListAppointmentNotHandleToday extends React.Component {
  constructor(props) {
    super(props);
  }

  handleOnClickActions = (appointment) => {
    this.props.setModalAppointmentSuggest(
      true,
      appointment,
      OPEN_APPOINTMENT_SUGGEST_FROM.LIST_APPOINTMENT_NOT_HANDLE_TODAY
    );
    this.onCloseModal();
  };

  onCloseModal = () => {
    this.props.setListAppointmentNotHandleToday(false);
  };

  render() {
    return (
      <>
        {this.props.listAppointmentNotHandleToday && (
          <ModalCommon
            title={
              this.props.listAppointmentNotHandleToday.isEndOfDay
                ? _l`Today's not handled appointments`
                : _l`Take action on..`
            }
            visible={this.props.listAppointmentNotHandleToday.status}
            onDone={this.onCloseModal}
            onClose={this.onCloseModal}
            scrolling={false}
            size="tiny"
            cancelHidden={true}
            okLabel={_l`Later`}
            paddingAsHeader={true}
          >
            <ModalContent scrolling>
            <Table compact className="table-suggest">
              <TableBody>
                {this.props.listAppointmentNotHandleToday.listAppointment &&
                  this.props.listAppointmentNotHandleToday.listAppointment.map((e) => (
                    <TableRow>
                      <TableCell onClick={() => this.handleOnClickActions(e)}>
                        <p>
                          <b>{e.title}</b>
                        </p>
                        <div>
                          {e.startDate && moment(e.startDate).format('DD MMM, YYYY, HH:mm')} -{' '}
                          {e.endDate && moment(e.endDate).format('DD MMM, YYYY, HH:mm')}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            </ModalContent>
          </ModalCommon>
        )}
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    listAppointmentNotHandleToday: state.entities.appointment.listAppointmentNotHandleToday
      ? state.entities.appointment.listAppointmentNotHandleToday
      : null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setModalAppointmentSuggest: (status, appointment, openFrom) =>
      dispatch(setModalAppointmentSuggest(status, appointment, openFrom)),
    setListAppointmentNotHandleToday: (status, listAppointment) =>
      dispatch(setListAppointmentNotHandleToday(status, listAppointment)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ListAppointmentNotHandleToday);

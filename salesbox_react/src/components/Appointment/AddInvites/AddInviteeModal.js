import React, { Component } from 'react';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { Form } from 'semantic-ui-react';
import { isHighlightAction, getHighlighted } from 'components/Overview/overview.selectors';
import _l from 'lib/i18n';
import InviteesDropDown from '../../Appointment/AppointmentForm/ContactDropdown/index';
import { clearHighlight } from '../../Overview/overview.actions';
import { calculatingPositionMenuDropdown } from '../../../Constants';
import '../AppointmentForm/appointmentForm.less';
import { updateRequest, update } from '../appointment.actions';
import makeGetAppointment from '../appointment.selector';

addTranslations({
  'en-US': {},
});
export class AddInviteeModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      invitees: [],
      closeOnDimmerClick: true,
    };
  }

  onSave = () => {
    const { updateRequest, overviewType } = this.props;
    updateRequest(overviewType);
    this.setState({ invitees: [] });
  };

  onClose = () => {
    this.props.clearHighlight(this.props.overviewType);
    this.setState({ invitees: [] });
  };

  handleInviteesChange = (event, { value }) => {
    // console.log('AAAAAAAAA', value);
    this.props.update('__EDIT', { invitees: [...this.props.form.invitees, ...value] });
    this.setState({ invitees: value });
  };

  changeCloseOnDimmerClick = (closeOnDimmerClick) => {
    this.setState({ closeOnDimmerClick });
  };

  handleAddEmail = (value) => {
    this.props.update('__EDIT', {
      emailList: Array.from(new Set([...this.props.form.emailList, value])),
    });
    this.setState((state, props) => ({ invitees: Array.from(new Set([...state.invitees, value])) }));
  };
  render() {
    const { visible, form } = this.props;
    const { invitees, closeOnDimmerClick } = this.state;
    return (
      <>
        <ModalCommon
          closeOnDimmerClick={closeOnDimmerClick}
          title={_l`Add invitee`}
          visible={visible}
          onDone={this.onSave}
          onClose={this.onClose}
          okLabel={_l`save`}
          scrolling={false}
          size="small"
        >
          <div className="appointment-add-form">
            <Form className="position-unset">
              <Form.Group className="unqualified-fields">
                <div className="unqualified-label">{_l`Invitees`}</div>
                <div className="dropdown-wrapper dropdown-multi">
                  <InviteesDropDown
                    className={'position-clear dropdown-multi-invitess'}
                    multiple
                    search
                    addLabel={_l`Add email`}
                    value={invitees || []}
                    onChange={this.handleInviteesChange}
                    onAddItem={this.handleAddEmail}
                    extra={form.emailList || []}
                    changeCloseOnDimmerClickParent={this.changeCloseOnDimmerClick}
                    calculatingPositionMenuDropdown={calculatingPositionMenuDropdown}
                    colId="InviteesFormAppointmnet"
                  />
                </div>
              </Form.Group>
            </Form>
          </div>
        </ModalCommon>
      </>
    );
  }
}

const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType, modalType = 'add_invitee_appointment' }) => {
    const visible = isHighlightAction(state, overviewType, modalType);
    return {
      visible,
      form: state.entities.appointment.__EDIT || {},
      userId: state.auth.userId,
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = {
  clearHighlight,
  updateRequest,
  update,
};

export default connect(makeMapStateToProps, mapDispatchToProps)(AddInviteeModal);

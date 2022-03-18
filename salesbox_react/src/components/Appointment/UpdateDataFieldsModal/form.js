/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import _l from 'lib/i18n';
import { Form, TextArea, Input } from 'semantic-ui-react';
import CategoryDropdown from 'components/Category/CategoryDropdown';
import FocusDropdown from 'components/Focus/FocusDropdown';
import DatePickerInput from 'components/DatePicker/DatePickerInput';
import TagDropdown from 'components/Tag/TagDropdown';
import css from 'Common.css';
import cssForm from './../../Task/TaskForm/TaskForm.css';
import CustomFieldPane from '../../CustomField/CustomFieldsPane';
import { ObjectTypes } from '../../../Constants';
import { calculatingPositionMenuDropdown } from '../../../Constants';
import InviteesDropDown from '../AppointmentForm/ContactDropdown/index';
import '../AppointmentForm/appointmentForm.less';
addTranslations({
  'en-US': {
    '{0}': '{0}',
    'Profile behavior': 'Profile behavior',
    Industry: 'Industry',
    Relationship: 'Relationship',
    Type: 'Type',
    Relation: 'Relation',
    Address: 'Address',
    Personal: 'Personal',
    General: 'General',
    Responsible: 'Responsible',
    Title: 'Title',
    'Last name': 'Last name',
    'Date and time': 'Date and time',
    Category: 'Category',
    Deal: 'Deal',
    'Add new contact': 'Add new contact',
    'Add new category': 'Add new category',
    'Add new focus': 'Add new focus',
    Unqualified: 'Unqualified',
    Qualified: 'Qualified',
  },
});

// let charLeft = 2000;
// const maxChar = 2000;

export default class DataFieldsForm extends Component {
  constructor(props) {
    super(props);
    this.charLeft = 2000;
    this.maxChar = 2000;
    this.state = {
      location: '',
      focusWorkDataId: null,
      note: null,
      inviteeList: [],
      emailList: [],
      charLeft: 2000,
      maxChar: 2000,
    };
  }

  _handleChange = (key) => (event, { value }) => {
    if (key === 'note') {
      this.charLeft = this.maxChar - value.length;
      if (this.charLeft < 0) return false;
    }
    this.setState({ [key]: value }, () => {
      this.handleData();
    });
  };

  handleInviteesChange = (e, { value }) => {
    this.setState({ inviteeList: value }, () => {
      this.handleData();
    });
  };

  handleData = () => {
    let values = {};

    if (this.state.inviteeList) {
      values.inviteeList = this.state.inviteeList;
    }
    if (this.state.emailList) {
      values.emailList = this.state.emailList;
    }
    if (this.state.focusWorkDataId) {
      values.focusWorkDataId = this.state.focusWorkDataId;
    }
    if (this.state.location) {
      values.location = this.state.location;
    }
    if (this.state.note) {
      values.note = this.state.note;
    }
    this.props.onChange(values);
  };

  handleFocusChange = (e, { value }) => {
    this.setState({ focusWorkDataId: value }, () => {
      this.handleData();
    });
  };

  handleAddEmail = (value) => {
    this.setState(
      {
        emailList: Array.from(new Set([...this.state.emailList, value])),
        inviteeList: Array.from(new Set([...this.state.inviteeList, value])),
      },
      () => {
        this.handleData();
      }
    );
  };

  render() {
    const { location, focusWorkDataId, note, inviteeList, emailList } = this.state;
    const { changeCloseOnDimmerClickParent } = this.props;
    // {
    //   communicationInviteeDTOList: [],
    //     contactInviteeDTOList: []
    // }

    return (
      <div className="appointment-add-form">
        <Form style={{ position: 'unset' }} className={css.padded}>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Focus`}</div>
            <div className="dropdown-wrapper">
              <FocusDropdown
                focusType="PROSPECT"
                size="small"
                value={focusWorkDataId}
                onChange={this.handleFocusChange}
              />
            </div>
          </Form.Group>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Location`}</div>
            <div className="dropdown-wrapper">
              <Input fluid value={location || ''} onChange={this._handleChange('location')} />
            </div>
          </Form.Group>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Invitees`}</div>
            <div className="dropdown-wrapper dropdown-multi">
              <InviteesDropDown
                className={'position-clear dropdown-multi-invitess'}
                multiple
                search
                addLabel={_l`Add email`}
                value={inviteeList}
                onChange={this.handleInviteesChange}
                onAddItem={this.handleAddEmail}
                changeCloseOnDimmerClickParent={changeCloseOnDimmerClickParent}
                extra={emailList}
                calculatingPositionMenuDropdown={calculatingPositionMenuDropdown}
                colId="InviteesFormAppointmnet"
              />
            </div>
          </Form.Group>
          <Form.Group style={{ position: 'relative' }} className={cssForm.formField}>
            <div className={cssForm.label} width={6}>{_l`Note`}</div>
            <TextArea
              className={cssForm.dropdownForm}
              size="small"
              rows={5}
              style={{ fontSize: 11 }}
              maxLength={this.maxChar}
              onChange={this._handleChange('note')}
              value={note}
            />
            <span className={cssForm.span}>{this.charLeft}</span>
          </Form.Group>
          <CustomFieldPane objectType={ObjectTypes.Appointment} />
        </Form>
      </div>
    );
  }
}

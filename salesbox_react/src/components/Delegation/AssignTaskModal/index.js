/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import { Form, TextArea } from 'semantic-ui-react';
import UnitDropdown from 'components/Unit/UnitDropdown';
import UserDropdown from 'components/User/UserDropdown';
import { clearHighlight } from '../../Overview/overview.actions';
import { isHighlightAction, getHighlighted } from '../../Overview/overview.selectors';
import { assignTask } from '../delegation.actions';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { makeGetTask } from '../../Task/task.selector';
import DatePickerInput from '../../DatePicker/DatePickerInput';
import css from '../../Task/EditTaskModal/EditTaskModal.css';
import './assign.less';
import { changeOnMutilTaskMenu } from '../../Task/task.actions';
addTranslations({
  'en-US': {
    Save: 'Save',
    Assign: 'Assign',
    Unit: 'Unit',
    User: 'User',
    'Unit is required': 'Unit is required',
    'User is required': 'User is required',
  },
});

let charLeft = 200;
const maxChar = 200;

class AssignTaskModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      unit: undefined,
      ownerId: '',
      dateAndTime: '',
    };
  }

  hideEditForm = () => {
    const { overviewType } = this.props;
    this.props.clearHighlight(overviewType);
    this.setState({
      message: '',
      unit: undefined,
      ownerId: '',
      dateAndTime: '',
      note: '',
    });
  };

  _handleClick = () => {
    const { unit } = this.state;
    if (!unit || unit === null) {
      this.setState({ message: { unit: _l`You must select unit first` } });
    } else {
      this.setState({ open: true });
    }
  };

  _handeUnitChange = (e, { value }) => {
    const { message } = this.setState;
    this.setState({ unit: value, message: { ...message, unit: null } });
  };

  _handleChangeUser = (e, { value }) => {
    const { message } = this.setState;
    this.setState({ ownerId: value, message: { ...message, ownerId: null } });
  };

  _handleNoteChange = (e, { value }) => {
    charLeft = maxChar - value.length;
    if (charLeft < 0) return false;
    this.setState({ note: value });
  };

  _handleDateChange = (value) => {
    const { message } = this.setState;
    this.setState({ dateAndTime: value, message: { ...message, dateAndTime: null } });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      this.setState({
        message: '',
        unit: undefined,
        ownerId: '',
        dateAndTime: '',
        note: '',
      });
    }
  }
  onSave = async () => {
    const { unit, message, ownerId, note, dateAndTime } = this.state;
    const { overviewType, task } = this.props;
    let mes = { ...message };
    if (!unit) mes = { ...mes, unit: _l`Unit is required` };
    if (!ownerId) mes = { ...mes, ownerId: _l`User is required` };
    if (!dateAndTime) mes = { ...mes, dateAndTime: _l`Date and Time is required` };
    this.setState({ message: mes });
    if (task.uuid) {
      if (unit && ownerId && dateAndTime) {
        this.props.assignTask(overviewType, { ownerId, note, dateAndTime }, task.uuid);
      }
    } else {
      let optionValue = {
        note: note,
      };
      if (unit && ownerId) {
        this.props.changeOnMutilTaskMenu('assign_multi_task', optionValue, overviewType);
      }
    }
  };

  render() {
    const { visible, task } = this.props;
    const { message, unit, note } = this.state;
    const dateAndTime = this.state.dateAndTime ? new Date(this.state.dateAndTime) : '';

    return (
      <ModalCommon
        title={_l`Assign`}
        visible={visible}
        onDone={this.onSave}
        onClose={this.hideEditForm}
        className={css.editTaskModal}
        okLabel={_l`Save`}
        scrolling={true}
      >
        <div className="delegation-lead-assign">
          <Form>
            <Form.Group className="unqualified-fields">
              <div className="unqualified-label">
                {_l`Unit`}
                <span className="required">*</span>
              </div>
              <div className="dropdown-wrapper" width={8}>
                <UnitDropdown
                  placeholder=""
                  error={message && message.unit ? true : false}
                  onChange={this._handeUnitChange}
                  value={unit}
                />
                <span className="form-errors">{message && message.unit}</span>
              </div>
            </Form.Group>
            <Form.Group className="unqualified-fields">
              <div className="unqualified-label">
                {_l`User`}
                <span className="required">*</span>
              </div>
              <div className="dropdown-wrapper" width={8}>
                <UserDropdown
                  unitId={unit}
                  onClick={this._handleClick}
                  onChange={this._handleChangeUser}
                  error={message && message.ownerId ? true : false}
                />
                <span className="form-errors">{message && message.ownerId}</span>
              </div>
            </Form.Group>
            {task.uuid && (
              <Form.Group className="unqualified-fields">
                <div className="unqualified-label">
                  {_l`Deadline`}
                  <span className="required">*</span>
                </div>
                <div className="dropdown-wrapper">
                  <div
                    style={{ width: '100%', height: '28px' }}
                    className={message && message.dateAndTime ? 'errors' : null}
                  >
                    <DatePickerInput
                      timePicker
                      value={dateAndTime}
                      width={8}
                      isValidate
                      onChange={this._handleDateChange}
                    />
                  </div>
                  <span className="form-errors">{message && message.dateAndTime}</span>
                </div>
              </Form.Group>
            )}

            <Form.Group className="unqualified-fields">
              <div className="unqualified-label">{_l`Note`}</div>
              <div className="dropdown-wrapper">
                <TextArea
                  size="small"
                  rows={5}
                  maxLength={maxChar + 1}
                  className="unqualified-area"
                  onChange={this._handleNoteChange}
                  value={note}
                />
                <span className="span-charLeft">{charLeft}</span>
              </div>
            </Form.Group>
          </Form>
        </div>
      </ModalCommon>
    );
  }
}

const makeMapStateToProps = () => {
  const getTask = makeGetTask();
  const mapStateToProps = (state, { overviewType }) => {
    const visible = isHighlightAction(state, overviewType, 'assignDelegation');
    const highlightedId = getHighlighted(state, overviewType);
    return {
      visible,
      task: getTask(state, highlightedId),
    };
  };
  return mapStateToProps;
};

export default connect(makeMapStateToProps, {
  clearHighlight,
  assignTask,
  changeOnMutilTaskMenu: changeOnMutilTaskMenu,
})(AssignTaskModal);

//@flow
import * as React from 'react';
import { Form, Input, Dropdown } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, withHandlers, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import UnitDropdown from 'components/Unit/UnitDropdown';
import DatePickerInput from 'components/DatePicker/DatePickerInput';
import UserDropdown from 'components/User/UserDropdown';
import css from 'Common.css';
import { calculatingPositionMenuDropdown } from 'Constants';
import { isString } from 'lodash';
type PropsT = {
  handleNameChange: (Event, { value: string }) => void,
  handleUnitChange: (Event, { value: string }) => void,
  handleResponsibleChange: (Event, { value: string }) => void,
  handleDeadlineChange: (Event, { value: string }) => void,
  handleChangeCallListType: () => void,
  formKey: string,
  contactForm: {},
  accountForm: {},
  callListType: string,
  __error: Object,
  userId: string,
  setError: () => void,
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    Unit: 'Unit',
    Responsible: 'Responsible',
    Deadline: 'Deadline',
    Name: 'Name',
    Type: 'Type',
  },
});

let form = {};
const deadline = null;

const CreateCallListForm = ({
  handleNameChange,
  handleResponsibleChange,
  handleUnitChange,
  handleDeadlineChange,
  form,
  __error,
}: PropsT) => {
  if (form.deadlineDate && isString(form.deadlineDate)) {
    form.deadlineDate = new Date(form.deadlineDate);
  }

  return (
    <div className="appointment-add-form">
      <Form className="position-unset">
        <Form.Group className="unqualified-fields">
          <div className="unqualified-label">
            {_l`Name`}
            <span className="required">*</span>
          </div>
          <div className="dropdown-wrapper">
            <Input required fluid value={form.name || ''} onChange={handleNameChange} error={__error.status} />
            <span className="form-errors">{__error.status ? __error.title : null}</span>
          </div>
        </Form.Group>
        <Form.Group className="unqualified-fields">
          <div className="unqualified-label">{_l`Unit`}</div>
          <div className="dropdown-wrapper">
            <UnitDropdown
              upward={false}
              className="position-clear"
              id="CreateCallListContactUnitDropdơwn"
              onClick={() => calculatingPositionMenuDropdown('CreateCallListContactUnitDropdơwn')}
              fluid
              value={form.unitId}
              onChange={handleUnitChange}
            />
          </div>
        </Form.Group>
        <Form.Group className="unqualified-fields">
          <div className="unqualified-label">{_l`Responsible`}</div>
          <div className="dropdown-wrapper">
            <UserDropdown
              upward={false}
              className="position-clear"
              id="CreateCallListContactUserDropdơwn"
              onClick={() => calculatingPositionMenuDropdown('CreateCallListContactUserDropdơwn')}
              value={form.ownerId}
              onChange={handleResponsibleChange}
            />
          </div>
        </Form.Group>
        <Form.Group className="unqualified-fields">
          <div className="unqualified-label">{_l`Deadline`}</div>
          <div className="dropdown-wrapper">
            <DatePickerInput onChange={handleDeadlineChange} value={form.deadlineDate} timePicker />
          </div>
        </Form.Group>
      </Form>
    </div>
  );
};

const createUpdateHandler = (key) => ({ setError, __error, setData, form }) => (event, data) => {
  let value;
  if (data) {
    value = data.value;
  }
  if (key === 'deadlineDate') {
    value = event;
  }
  if (key === 'name') {
    setError({ ...__error, status: false });
  }
  if (key === 'ownerId') {
    console.log('data', data);
    setData({ ...form, ownerName: data.text, [key]: value });
  } else {
    setData({ ...form, [key]: value });
  }
};

export default compose(
  connect(null, {}),
  lifecycle({
    componentDidMount() {},
  }),
  withHandlers({
    handleNameChange: createUpdateHandler('name'),
    handleResponsibleChange: createUpdateHandler('ownerId'),
    handleUnitChange: createUpdateHandler('unitId'),
    handleDeadlineChange: createUpdateHandler('deadlineDate'),
  })
)(CreateCallListForm);

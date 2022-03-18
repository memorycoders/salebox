//@flow
import * as React from 'react';
import { Form, Input, Dropdown } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { update as updateCallListAccount } from '../CallListAccount/callListAccount.actions';
import { update as updateCallListContact } from '../CallListContact/callListContact.actions';
import { compose, withHandlers, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import UnitDropdown from 'components/Unit/UnitDropdown';
import DatePickerInput from 'components/DatePicker/DatePickerInput';
import UserDropdown from 'components/User/UserDropdown';
import { Types } from 'Constants';
import css from 'Common.css';
import { calculatingPositionMenuDropdown } from 'Constants';
import { CALL_LIST_TYPE, FORM_KEY } from '../../Constants';
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
  setError: () => void
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    Unit: 'Unit',
    Responsible: 'Responsible',
    Deadline: 'Deadline',
    Name: 'Name',
    Type: 'Type'
  },
});



let form = {};
let deadline = null;

const CreateCallListForm = ({
  handleNameChange,
  handleResponsibleChange,
  handleUnitChange,
  handleDeadlineChange,
  handleChangeCallListType,
  contactForm,
  accountForm,
  callListType,
  isCreate,
  editType,
  __error,
}: PropsT) => {
  if(isCreate) {
    form = callListType === CALL_LIST_TYPE.CONTACT || editType === CALL_LIST_TYPE.CONTACT ? contactForm : accountForm
  } else {
    form = editType === CALL_LIST_TYPE.CONTACT ? contactForm : accountForm
    if(form.deadlineDate && isString(form.deadlineDate)) {
      form.deadlineDate =  new Date(form.deadlineDate)
    }
  }
  let typeOptions = [
    { key: 'account', value: 'account', text: _l`Company` },
    { key: 'contact', value: 'contact', text: _l`Contact` }
  ]

  return (
  <div className="appointment-add-form">
    <Form className="position-unset">
      <Form.Group className=" unqualified-fields" style={{ display: isCreate ? 'flex' : 'none' }}>
        <div className="unqualified-label">{_l`Type`}</div>
        <div className="dropdown-wrapper">
        <Dropdown
          placeholder='Select Type'
          defaultValue={callListType}
          value={callListType}
          fluid
          search
          selection
          options={typeOptions}
          onChange={handleChangeCallListType}
        ></Dropdown>
        </div>
      </Form.Group>
      <Form.Group className="unqualified-fields" >
        <div className="unqualified-label">{_l`Name`}
        <span className="required">*</span>
        </div>
        <div className="dropdown-wrapper">
          <Input required fluid value={form.name || ''} onChange={handleNameChange} error={__error.status}/>
          <span className="form-errors">{__error.status ? __error.title: null}</span>
        </div>
      </Form.Group>
      <Form.Group className="unqualified-fields">
        <div className="unqualified-label">{_l`Unit`}</div>
        <div className="dropdown-wrapper">
        <UnitDropdown upward={false} className='position-clear' id='CreateCallListContactUnitDropdơwn' onClick={() => calculatingPositionMenuDropdown('CreateCallListContactUnitDropdơwn')} fluid value={form.unitId} onChange={handleUnitChange} />
        </div>
      </Form.Group>
      <Form.Group className="unqualified-fields">
        <div className="unqualified-label">{_l`Responsible`}</div>
        <div className="dropdown-wrapper">
        <UserDropdown  upward={false} className='position-clear' id='CreateCallListContactUserDropdơwn' onClick={() => calculatingPositionMenuDropdown('CreateCallListContactUserDropdơwn')} unitId={form.unitId} value={form.ownerId} onChange={handleResponsibleChange} />
        </div>
      </Form.Group>
      <Form.Group className="unqualified-fields">
        <div className="unqualified-label">{_l`Deadline`}</div>
        <div className="dropdown-wrapper">
        <DatePickerInput onChange={handleDeadlineChange} value={form.deadlineDate} timePicker isValidate={false}/>
        </div>
      </Form.Group>
    </Form>
    </div>
  );
};

const updateForm = (type, formKey, value, updateCallListContact, updateCallListAccount) => {
  if(type === CALL_LIST_TYPE.ACCOUNT) {
    updateCallListAccount(formKey, value)
  } else {
    updateCallListContact(formKey, value)
  }
}

const createUpdateHandler = (key) => ({callListType, updateCallListContact, updateCallListAccount, formKey, setError, __error, editType, isCreate }) => (event, data) => {

  let value;
  if(data) {
    value = data.value
  }
  if(key === 'deadlineDate') {
    value = event;
  }
  if(key === 'name') {
    setError({...__error, status: false})
  }
  if(isCreate) {
    updateForm(callListType, formKey, { [key]: value }, updateCallListContact, updateCallListAccount)
  } else {
    updateForm(editType, formKey, { [key]: value }, updateCallListContact, updateCallListAccount)
  }
};


export default compose(
  connect(
    null,
    {
      updateCallListAccount: updateCallListAccount,
      updateCallListContact: updateCallListContact
    }
  ),
  lifecycle({
    componentDidMount(){
      this.props.updateCallListContact(FORM_KEY.CREATE, {callListAccountId: this.props.callListAccountId});
    },
  }),
  withHandlers({
    handleNameChange: createUpdateHandler('name'),
    handleResponsibleChange: createUpdateHandler('ownerId'),
    handleUnitChange: createUpdateHandler('unitId'),
    handleDeadlineChange: createUpdateHandler('deadlineDate'),
    handleChangeCallListType: ({setCallListType}) => (e, {value}) => {
      setCallListType(value);
    }
  })
)(CreateCallListForm);

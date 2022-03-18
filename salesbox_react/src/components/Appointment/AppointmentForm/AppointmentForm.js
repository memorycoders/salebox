/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
//@flow
import * as React from 'react';
import { Form, Input, TextArea } from 'semantic-ui-react';
import _l from 'lib/i18n';
import * as AppointmentActions from 'components/Appointment/appointment.actions';
import { compose, withHandlers, pure, defaultProps } from 'recompose';
import { connect } from 'react-redux';
import * as DropdownActions from 'components/Dropdown/dropdown.actions';

import ContactDropdown from 'components/Contact/ContactDropdown';
import UserDropdown from 'components/User/UserDropdown';
import FocusDropdown from 'components/Focus/FocusDropdown';
import ProspectDropdown from './ProspectDropdown/ProspectDropdown';
import DatePickerInput from 'components/DatePicker/DatePickerInput';
import OrganisationDropdown from '../../Organisation/OrganisationDropdown';

import InviteesDropDown from './ContactDropdown/index';
import TeamDropDown from './TeamDropdown';
import { calculatingPositionMenuDropdown } from '../../../Constants';

import { ObjectTypes } from 'Constants';
import { FormPair } from 'components';
import cssForm from '../../Task/TaskForm/TaskForm.css';
import CustomFieldPane from '../../CustomField/CustomFieldsPane';
import cx from 'classnames';
import css from 'Common.css';
import './appointmentForm.less';

type PropsT = {
  handleContactChange: (event: Event, { value: string }) => void,
  handleResponsibleChange: (event: Event, { value: string }) => void,
  handleTitleChange: (event: Event, { value: string }) => void,
  handleLocationChange: (event: Event, { value: string }) => void,
  handleStartChange: (event: Event, { value: string }) => void,
  handleEndChange: (event: Event, { value: string }) => void,
  handleFocusChange: (event: Event, { value: string }) => void,
  handleNoteChange: (event: Event, { value: string }) => void,
  handleInviteesChange: (event: Event, { value: string }) => void,
  handleAddEmail: (event: Event, { value: string }) => void,
  handleProspectChange: (event: Event, { value: string }) => void,
  handleAccountChange: (event: Event, { value: string }) => void,
  form: {},
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    Contact: 'Contact',
    Title: 'Title',
    Focus: 'Focus',
    Location: 'Location',
    Responsible: 'Responsible',
    Qualified: 'Qualified',
    Ends: 'Ends',
    Note: 'Note',
    Invitees: 'Invitees',
    Company: 'Company',
  },
});

const AppointmentForm = ({
  handleTitleChange,
  handleResponsibleChange,
  handleContactChange,
  handleStartChange,
  handleEndChange,
  handleFocusChange,
  handleNoteChange,
  handleLocationChange,
  handleInviteesChange,
  handleAddEmail,
  handleProspectChange,
  handleAccountChange,
  handleTeam,
  changeCloseOnDimmerClickParent,
  form,
  userId,
  errors,
  formKey,
  overviewType,
  storageIntegration,
}: PropsT) => {
  const startDate = form.startDate ? new Date(form.startDate) : new Date();
  const endDate = form.endDate ? new Date(form.endDate) : new Date(Date.now() + 30 * 60 * 1000);
  const invitees = form.invitees || [];
  const _renderDealLabel = () => {
    if (formKey === '__CREATE') {
      return _l`Deals`;
    }
    return form.prospect && form.prospect.leadId
      ? _l`Prospect`
      : form.prospect && form.prospect.prospectId
      ? _l`Deals`
      : _l`Deals`;
  };
  const { isLinkedOffice365, isLinkedTeam, isOnCalendarOffice } = storageIntegration;
  return (
    <div className={cssForm.containerTaskForm}>
      <div className={`position-unset appointment-add-form ${cssForm.normalForm}`} >
      <Form className="position-unset">
        <Form.Group className="unqualified-fields">
          <div className="unqualified-label">
            {_l`Title`}
            <span className="required">*</span>
          </div>
          <div className="dropdown-wrapper" width={8}>
            <Input fluid value={form.title || ''} onChange={handleTitleChange} error={!!errors.title || false} />
            <span className="form-errors">{errors.title || null}</span>
          </div>
        </Form.Group>
        <Form.Group className="unqualified-fields">
          <div className="unqualified-label">{_l`Company`}</div>
          <div className="dropdown-wrapper" width={8}>
            <OrganisationDropdown
              colId="appointment-form-organisation"
              width={8}
              addLabel='Add company'
              onChange={handleAccountChange}
              value={form.organisation}
            />
            <span className="form-errors" />
            <span className="form-errors" />
          </div>
        </Form.Group>
        <Form.Group className="unqualified-fields">
          <div className="unqualified-label">{_l`Contact`}</div>
          <div className="dropdown-wrapper dropdown-multi">
            <ContactDropdown
              colId="appointment-form-contact"
              width={8}
              multiple={true}
              addLabel={_l`Add new contact`}
              organisationId={form.organisation || null}
              onChange={handleContactChange}
              error={errors.contact || false}
              value={form.contacts || []}
            />
            <span className="form-errors">{errors && errors.contact ? errors.contact : null}</span>
          </div>
        </Form.Group>
        <Form.Group className="unqualified-fields">
          <div className="unqualified-label">{_renderDealLabel()}</div>
          <div className="dropdown-wrapper">
            <ProspectDropdown
              overviewType={overviewType}
              contactId={form.contacts}
              value={form.prospect}
              organisationId={form.organisation}
              onChange={handleProspectChange}
              unqualifiedId={form.prospect && form.prospect.leadId}
              prospectId={form.prospect && form.prospect.prospectId}
              organisationId={form.organisation}

            />
            <span className="form-errors">{null}</span>
          </div>
        </Form.Group>
        <Form.Group className="unqualified-fields">
          <div className="unqualified-label">{_l`Focus`}</div>
          <div className="dropdown-wrapper">
            <FocusDropdown focusType="PROSPECT" size="small" value={form.focus} onChange={handleFocusChange} />
          </div>
        </Form.Group>
        <Form.Group className="unqualified-fields">
          <div className="unqualified-label">{_l`Location`}</div>
          <div className="dropdown-wrapper">
            {isLinkedOffice365 && isLinkedTeam && isOnCalendarOffice ? (
              <div style={{display: 'flex', flex: 1, width: '100%', justifyContent: 'space-between'}}>
                <Input fluid value={form.location || ''} onChange={handleLocationChange} style={{ width: '58%' }} disabled={!!form.teams}/>
                <TeamDropDown style={{ width: '40%' }} onChange={handleTeam} value={form.teams}/>
              </div>
            ) : (
              <Input fluid value={form.location || ''} onChange={handleLocationChange} />
            )}
          </div>
        </Form.Group>
        <Form.Group className="unqualified-fields">
          <div className="unqualified-label">{_l`Starts`}</div>
          <div className="dropdown-wrapper">
            <DatePickerInput timePicker onChange={handleStartChange} value={startDate} />
          </div>
        </Form.Group>
        <Form.Group className="unqualified-fields">
          <div className="unqualified-label">{_l`Ends`}</div>
          <div className="dropdown-wrapper">
            <DatePickerInput timePicker onChange={handleEndChange} value={endDate} />
          </div>
        </Form.Group>
        <Form.Group className="unqualified-fields">
          <div className="unqualified-label">{_l`Responsible`}</div>
          <div className="dropdown-wrapper">
            <UserDropdown value={form.owner || userId} onChange={handleResponsibleChange} />
          </div>
        </Form.Group>
        <Form.Group className="unqualified-fields">
          <div className="unqualified-label">{_l`Invitees`}</div>
          <div className="dropdown-wrapper dropdown-multi">
            <InviteesDropDown
              className={'position-clear dropdown-multi-invitess'}
              multiple
              search
              description={false}
              addLabel={_l`Add email`}
              value={invitees || []}
              onChange={handleInviteesChange}
              onAddItem={handleAddEmail}
              extra={form.emailList || []}
              changeCloseOnDimmerClickParent={changeCloseOnDimmerClickParent}
              calculatingPositionMenuDropdown={calculatingPositionMenuDropdown}
              colId="InviteesFormAppointmnet"
            />
          </div>
        </Form.Group>
        <Form.Group className="unqualified-fields">
          <div className="unqualified-label">{_l`Note`}</div>
          <div className="dropdown-wrapper area-wrapper">
            <TextArea size="small" rows={10} value={form.note || ''} onChange={handleNoteChange} maxLength={2000} />
            <span className="span-charLeft">{form.note ? 2000 - form.note.length : 2000}</span>
            <span className="form-errors">{null}</span>
          </div>
        </Form.Group>
      </Form>
    </div>
      <div className={cssForm.customFieldForm}>
        <div className={cssForm.customFieldContent}>
          <CustomFieldPane
            type0="task"
            noHeader
            object={form.uuid ? form : null}
            objectId={form.uuid}
            objectType={ObjectTypes.Appointment}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateProps = (state, { formKey }) => ({
  form: state.entities.appointment[formKey] || {},
  userId: state.auth.userId,
  errors: state.entities.appointment.__ERRORS || {},
  storageIntegration: state.common.storageIntegration || {},
});

const createUpdateHandler = (key) => ({ update, formKey }) => (event, { value }) => {
  if (key === 'title') {
    update('__ERRORS', { title: null });
  }
  update(formKey, { [key]: value });
};

export default compose(
  defaultProps({
    formKey: '__CREATE',
  }),
  connect(mapStateProps, {
    update: AppointmentActions.update,
    setSearchTerm: DropdownActions.setSearchTerm,
  }),
  withHandlers({
    handleContactChange: ({ update, formKey }) => (event: Event, { value: contacts }) => {
      update('__ERRORS', { contact: null });
      if (contacts)
        update(formKey, {
          contacts: contacts.filter((e) => e !== null),
        });
    },
    handleResponsibleChange: createUpdateHandler('responsible'),
    handleNoteChange: createUpdateHandler('note'),
    handleTitleChange: createUpdateHandler('title'),
    handleLocationChange: createUpdateHandler('location'),
    handleFocusChange: createUpdateHandler('focus'),
    handleProspectChange: createUpdateHandler('prospect'),
    handleInviteesChange: createUpdateHandler('invitees'),
    handleAddEmail: ({ update, formKey, form }) => (value) => {
      const list = form.emailList || [];
      const invitees = form.invitees || [];
      update(formKey, {
        emailList: Array.from(new Set([...list, value])),
        invitees: Array.from(new Set([...invitees, value])),
      });
      // setSearchTerm(ObjectTypes.Contact, '');
    },
    handleStartChange: ({ update, formKey }) => (startDate) => {
      update(formKey, { startDate, endDate: new Date(new Date(startDate).getTime() + 30 * 60 * 1000).getTime() });
    },
    handleEndChange: ({ update, formKey }) => (endDate) => update(formKey, { endDate }),
    handleAccountChange: createUpdateHandler('organisation'),
    handleTeam: ({ update, formKey }) => (e, { value }) => {
      if (value === 'teams') {
        update(formKey, { teams: value });
        update(formKey, { location: null });
      } else {
        update(formKey, { teams: null });
      }
    },
  }),
  pure
)(AppointmentForm);

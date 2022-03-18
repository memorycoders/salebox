//@flow
import * as React from 'react';
import { TextArea, Form } from 'semantic-ui-react';
import _l from 'lib/i18n';
import * as TaskActions from 'components/Task/task.actions';
import { compose, branch, withHandlers, renderNothing } from 'recompose';
import { connect } from 'react-redux';
import OrganisationDropdown from 'components/Organisation/OrganisationDropdown';
import CategoryDropdown from 'components/Category/CategoryDropdown';
import ContactDropdown from 'components/Contact/ContactDropdown';
import ProspectDropdown from '../../Prospect/ProspectDropdown/ProspectDropdown';
import FocusDropdown from 'components/Focus/FocusDropdown';
import TagDropdown from 'components/Tag/TagDropdown';
import UserDropdown from 'components/User/UserDropdown';
import DatePickerInput from 'components/DatePicker/DatePickerInput';
import { FormPair } from 'components';
import CustomFieldPane from '../../CustomField/CustomFieldsPane';
import cssForm from '../TaskForm/TaskForm.css';

const PERCENT = '74%';

type PropsT = {
  task: {},
  handleNoteChange: (event: Event, { value: string }) => void,
  hanleTagChange: (event: Event, { value: string }) => void,
  handleContactChange: (event: Event, { value: string }) => void,
  handleOrganisationChange: (event: Event, { value: string }) => void,
  handleProspectChange: (event: Event, { value: string }) => void,
  handleCategoryChange: (event: Event, { value: string }) => void,
  handleOwnerChange: (event: Event, { value: string }) => void,
  handleDateChange: (date: Date) => void,
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    Account: 'Account',
    Contact: 'Contact',
    Prospect: 'Prospect',
    Category: 'Category',
    Qualified: 'Qualified',
    Unqualified: 'Unqualified',
    Focus: 'Focus',
    'Date and time': 'Date and time',
    Note: 'Note',
    Tag: 'Tag',
  },
});

const EditTaskForm = ({
  handleNoteChange,
  hanleTagChange,
  handleOrganisationChange,
  handleContactChange,
  task,
  handleCategoryChange,
  handleProspectChange,
  handleDateChange,
  handleOwnerChange,
}: PropsT) => {
  return (
    <div style={{ display: 'flex' }}>
      <Form>
        <Form.Group>
          <div className={cssForm.label} width={6}>{_l`Company`}</div>
          <OrganisationDropdown style={{ width: PERCENT }} value={task.organisation.uuid} onChange={handleOrganisationChange} />
        </Form.Group>
        <Form.Group>
          <div className={cssForm.label} width={6}>{_l`Contact`}</div>
          <ContactDropdown
            style={{ width: PERCENT }}
            organisationId={task.organisation.uuid}
            value={task.contact.uuid}
            onChange={handleContactChange}
          />
        </Form.Group>
        <Form.Group>
          <div className={cssForm.label} width={6}>{task.leadId ? _l`Prospect` : _l`Deal`}</div>
          <ProspectDropdown
            style={{ width: PERCENT }}
            contactId={task.contact.uuid}
            unqualifiedId={task.leadId}
            value={task.prospect.uuid}
            onChange={handleProspectChange}
            organisationId={task.organisationId}
          />
        </Form.Group>
        <Form.Group>
          <div className={cssForm.label} width={6}>{_l`Category`}</div>
          <CategoryDropdown style={{ width: PERCENT }} value={task.category} onChange={handleCategoryChange} />
        </Form.Group>

        <Form.Group>
          <div className={cssForm.label} width={6}>{_l`Focus`}</div>
          <FocusDropdown style={{ width: PERCENT }} taskId={task.uuid} focusType="PROSPECT" size="small" value={task.focus.uuid} />
        </Form.Group>

        <Form.Group>
          <div className={cssForm.label} width={6}>{_l`Date and time`}</div>
          <DatePickerInput style={{ width: PERCENT }} timePicker onChange={handleDateChange} value={new Date(task.dateAndTime)} />
        </Form.Group>

        <Form.Group>
          <div className={cssForm.label} width={6}>{_l`Responsible`}</div>
          <UserDropdown style={{ width: PERCENT }} value={task.owner} onChange={handleOwnerChange} />
        </Form.Group>

        <Form.Group>
          <div className={cssForm.label} width={6}>{_l`Tag`}</div>
          <TagDropdown style={{ width: PERCENT }} value={task.tag.uuid} onChange={hanleTagChange} />
        </Form.Group>

        <Form.Group>
          <div className={cssForm.label} width={6}>{_l`Note`}</div>
          <TextArea style={{ width: PERCENT }} size="small" value={task.note || ''} onChange={handleNoteChange} rows={10} />
        </Form.Group>
      </Form>
      <CustomFieldPane type0='task' objectType={ObjectTypes.Task} />
    </div>
  );
};

export default compose(
  connect(
    null,
    {
      updateTask: TaskActions.updateTask,
    }
  ),
  branch(({ task }) => !task.uuid, renderNothing),
  withHandlers({
    handleNoteChange: ({ task, updateTask }) => (event, { value: note }) => {
      updateTask(task.uuid, { note });
    },
    hanleTagChange: ({ task, updateTask }) => (event, { value: tag }) => {
      updateTask(task.uuid, { tag });
    },
    handleOrganisationChange: ({ task, updateTask }) => (event, { value: organisation }) => {
      updateTask(task.uuid, {
        organisation,
        contact: null,
      });
    },
    handleContactChange: ({ task, updateTask }) => (event, { value: contact }) => {
      updateTask(task.uuid, {
        contact,
        prospect: null,
      });
    },
    handleDateChange: ({ task, updateTask }) => (dateAndTime) => {
      updateTask(task.uuid, {
        dateAndTime,
      });
    },
    handleOwnerChange: ({ task, updateTask }) => (event, { value: owner }) => {
      updateTask(task.uuid, {
        owner,
      });
    },
    handleProspectChange: ({ task, updateTask }) => (event, { value: prospect }) => {
      updateTask(task.uuid, { prospect });
    },
    handleCategoryChange: ({ task, updateTask }) => (event, { value: category }) => {
      updateTask(task.uuid, { category });
    },
  })
)(EditTaskForm);

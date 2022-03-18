/* eslint-disable react/self-closing-comp */
/* eslint-disable react/prop-types */
//@flow
import * as React from 'react';
import { Form, TextArea } from 'semantic-ui-react';
import _l from 'lib/i18n';
import * as ContactActions from 'components/Contact/contact.actions';
import { compose, withHandlers, pure, defaultProps, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import OrganisationDropdown from '../../Organisation/OrganisationDropdown';
import CategoryDropdown from 'components/Category/CategoryDropdown';
import ContactDropdown from 'components/Contact/ContactDropdown';
import FocusDropdown from 'components/Focus/FocusDropdown';
import TagDropdown from 'components/Tag/TagDropdown';
import UserDropdown from 'components/User/UserDropdown';
import DatePickerInput from 'components/DatePicker/DatePickerInput';
import ProspectDropdown from '../../Prospect/ProspectDropdown/ProspectDropdown';
import { createEntity, createError } from 'components/Task/task.actions';
import { getTaskErros } from '../task.selector';
import css from 'Common.css';
import cx from 'classnames';
import cssForm from './TaskForm.css';
import { OverviewTypes, ObjectTypes } from 'Constants';
import { calculatingPositionMenuDropdown } from '../../../Constants';
import CustomFieldPane from '../../CustomField/CustomFieldsPane';
type PropsT = {
  handleOrganisationChange: (event: Event, { value: string }) => void,
  handleContactChange: (Event, { value: string }) => void,
  handleProspectChange: (Event, { value: string }) => void,
  handleCategoryChange: (Event, { value: string }) => void,
  handleFocusChange: (Event, { value: string }) => void,
  handleDateChange: (Event, { value: string }) => void,
  handleOwnerChange: (Event, { value: string }) => void,
  hanleTagChange: (Event, { value: string }) => void,
  handleNoteChange: (Event, { value: string }) => void,
  form: {},
};

let charLeft = 2000;
const maxChar = 2000;
const backspace = 0;

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

const TaskForm = ({
  handleOrganisationChange,
  handleContactChange,
  handleCategoryChange,
  handleFocusChange,
  handleDateChange,
  handleOwnerChange,
  hanleTagChange,
  handleNoteChange,
  task,
  formKey,
  errors,
  userId,
  overviewType,
  isGlobal,
}: PropsT) => {
  const dateAndTime = task.dateAndTime ? new Date(task.dateAndTime) : '';
  const _renderDealLabel = () => {
    if (formKey === '__CREATE') {
      return _l`Deal`;
    }
    return task.leadId ? _l`Prospect` : task.prospectId ? _l`Deal` : _l`Deal`;
  };
  charLeft = task.note ? maxChar - task.note.length : 2000;
  const { contactDTO, organisationDTO, organisationName } = task;
  // khác màn task thì không show Account
  const checkShowAccount = overviewType !== OverviewTypes.Activity.Task && formKey !== '__CREATE';
  return (
    <div className={cssForm.containerTaskForm}>
      <Form className={`position-unset ${cssForm.normalForm}`}>
      <Form.Group className={cssForm.formField}>
        <div className={cssForm.label} width={6}>{_l`Company`}</div>
        <OrganisationDropdown
          colId="task-form-organisation"
          className={cssForm.dropdownForm}
          value={task.organisationId}
          onChange={handleOrganisationChange}
          width={8}
          addLabel='Add company'
          text={
            organisationName ? organisationName :
            organisationDTO &&
            (organisationDTO.displayName ||
              organisationDTO.name ||
              `${organisationDTO.firstName} ${organisationDTO.lastName}`)
          }
        />
      </Form.Group>
        <Form.Group className={cssForm.formField}>
          <div className={cssForm.label} width={6}>{_l`Contact`}</div>
          <div className={cssForm.dropdownWrapper}>
            <ContactDropdown
              colId="task-form-contact"
              className={cssForm.focusDropdown}
              organisationId={task.organisationId}
              value={task.contactId}
              onChange={handleContactChange}
              width={8}
              placeholder={' '}
              error={errors && errors.contact ? true : false}
              addLabel='Add contact'
              text={
                contactDTO &&
                (contactDTO.displayName || contactDTO.name || `${contactDTO.firstName} ${contactDTO.lastName}`)
              }
            />
            <span className="form-errors">{errors && errors.contact ? errors.contact : null}</span>
          </div>
        </Form.Group>
        <Form.Group className={cssForm.formField}>
          <div className={cssForm.label} width={6}>
            {_renderDealLabel()}
          </div>
          <ProspectDropdown
            colId="task-form-prospect"
            className={cssForm.dropdownForm}
            contactId={task.contactId}
            value={task.prospect}
            placeholder=""
            unqualifiedId={task.leadId}
            prospectId={task.prospectId}
            formKey={formKey}
            organisationId={task.organisationId}
          />
        </Form.Group>
        <Form.Group className={cssForm.formField}>
          <div className={cssForm.label} width={6}>{_l`Category`}</div>
          <CategoryDropdown
            colId="task-form-category"
            className={cssForm.dropdownForm}
            value={task.categoryId}
            onChange={handleCategoryChange}
            addLabel={_l`Add category`}
          />
        </Form.Group>
        <Form.Group className={cssForm.formField}>
          <div className={cssForm.label} width={6}>
            {_l`Focus`}
            <span className={cssForm.required}>*</span>
          </div>
          <div className={cssForm.dropdownWrapper}>
            <FocusDropdown
              colId="task-form-focus"
              className={cssForm.focusDropdown}
              focusType="PROSPECT"
              size="small"
              value={task.focusWorkData && task.focusWorkData.uuid}
              onChange={handleFocusChange}
              errors={errors}
              addLabel={`Add focus`}
            />
            <span className="form-errors">{errors && errors.focusWorkData ? errors.focusWorkData : null}</span>
          </div>
        </Form.Group>
        <Form.Group className={cssForm.formField}>
          <div className={cssForm.label} width={6}>{_l`Date and time`}</div>
          <div style={{ width: '100%', height: '28px' }}>
            <DatePickerInput timePicker onChange={handleDateChange} value={dateAndTime} width={8} isValidate={false} />
          </div>
        </Form.Group>
        <Form.Group className={cssForm.formField}>
          <div className={cssForm.label} width={6}>{_l`Responsible`}</div>
        <UserDropdown
            className={cx(cssForm.dropdownForm, 'user-dropdown-task', 'position-clear')}
            value={isGlobal ? task.ownerId || userId : OverviewTypes.Delegation.Task ? task.ownerId : userId}
            handleOnClick={calculatingPositionMenuDropdown}
            onChange={handleOwnerChange}
            id={'addTaskUserDropdown'}
          />
        </Form.Group>
        <Form.Group className={cssForm.formField}>
          <div className={cssForm.label} width={6}>{_l`Tag`}</div>
          <TagDropdown
            className={cx(cssForm.dropdownForm, 'tag-dropdown', 'position-clear')}
            value={task.tagDTO && task.tagDTO.uuid}
            onChange={hanleTagChange}
            onClick={() => calculatingPositionMenuDropdown('addTaskTagDropdown')}
            id="addTaskTagDropdown"
            upward={false}
          />
        </Form.Group>
        <Form.Group className={`${cssForm.formField} position-relative`}>
          <div className={cssForm.label} width={6}>{_l`Note`}</div>
          <TextArea
            className={cx(cssForm.dropdownForm, cssForm.noteForm)}
            size="small"
            value={task.note}
            onChange={handleNoteChange}
            rows={5}
            maxLength={maxChar + 1}
          />
          <span className={cssForm.spanNote}>{charLeft}</span>
        </Form.Group>
      </Form>
      <div className={cssForm.customFieldForm}>
        <div className={cssForm.customFieldContent}>
          <CustomFieldPane type0='task' noHeader object={task} objectId={task.uuid} objectType={ObjectTypes.Task} />
        </div>
      </div>
    </div>
  );
};

const mapStateProps = (state, { formKey }) => {
  return {
    form: state.entities.task[formKey] || {},
    errors: getTaskErros(state),
    userId: state.auth.userId,
  };
};

const createUpdateHandler = (key) => (props) => (event, { value }) => {
  const newTask = { ...props.task, [key]: value };
  props.setTask(newTask, () => {
    props.createEntity(props.formKey, newTask);
  });
};

export default compose(
  defaultProps({
    formKey: '__CREATE',
  }),
  connect(mapStateProps, {
    update: ContactActions.update,
    createEntity,
    createError,
  }),
  withState('task', 'setTask', (props) => {
    return props.form;
  }),
  lifecycle({
    componentDidUpdate(prevProps) {
      const _this = this;
      if (prevProps.form !== this.props.form) {
        setTimeout(() => {
          _this.props.setTask(_this.props.form);
        }, 1000);
      }
    },
  }),
  withHandlers({
    handleOrganisationChange: createUpdateHandler('organisationId'),
    handleContactChange: (props) => (event, { value }) => {
      let isChangeContactId = props.task.contactId!=value;
      const newTask = {
        ...props.task, contactId: value,
        leadId: isChangeContactId ? null : props.task.leadId,
        prospectId: isChangeContactId ? null : props.task.prospectId,

      };
      props.createError({ contact: null });
      props.setTask(newTask, () => {
        props.createEntity(props.formKey, newTask);
      });
    },
    handleCategoryChange: createUpdateHandler('categoryId'),
    handleFocusChange: (props) => (event, { value }) => {
      const newTask = { ...props.task, focusWorkData: { uuid: value } };
      props.createError({ focusWorkData: null });
      props.setTask(newTask, () => {
        props.createEntity(props.formKey, newTask);
      });
    },
    handleDateChange: (props) => (value) => {
      const newTask = { ...props.task, dateAndTime: value };
      props.setTask(newTask, () => {
        props.createEntity(props.formKey, newTask);
      });
    },
    handleOwnerChange: createUpdateHandler('ownerId'),
    hanleTagChange: (props) => (event, { value }) => {
      const newTask = { ...props.task, tagDTO: { uuid: value } };
      props.setTask(newTask, () => {
        props.createEntity(props.formKey, newTask);
      });
    },
    handleNoteChange: (props) => (event, { value }) => {
      const newTask = { ...props.task, note: value };
      charLeft = maxChar - value.length;
      if (charLeft < 0) return false;
      props.setTask(newTask, () => {
        props.createEntity(props.formKey, newTask);
      });
    },
  }),
  pure
)(TaskForm);

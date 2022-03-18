//@flow
import * as React from 'react';
import UnitDropdown from 'components/Unit/UnitDropdown';
import UserDropdown from 'components/User/UserDropdown';
import * as TaskActions from 'components/Task/task.actions';
import { Form } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { compose, branch, withHandlers, renderNothing } from 'recompose';
import { connect } from 'react-redux';
import { FormPair } from 'components';
import css from '../Delegation.css';

type PropsT = {
  task: {},
  handleOwnerChange: (event: Event, { value: string }) => void,
  handleDateChange: (date: Date) => void,
  handleUnitChange: (event: Event, { value: string }) => void,
};

addTranslations({
  'en-US': {
    Unit: 'Unit',
    User: 'User',
  },
});

const AssignTaskForm = ({ task, handleOwnerChange, handleUnitChange }: PropsT) => {
  return (
    <Form>
      <FormPair label={_l`Unit`} labelStyle={css.delegateFormLabel} left>
        <UnitDropdown placeholder='' onChange={handleUnitChange} placeholder='' />
      </FormPair>
      <FormPair label={_l`User`} left labelStyle={css.delegateFormLabel}>
        <UserDropdown placeholder='' unitId={task.unit} onChange={handleOwnerChange} />
      </FormPair>
    </Form>
  );
};

export default compose(
  connect(null, {
    updateTask: TaskActions.updateTask,
  }),
  branch(({ task }) => !task.uuid, renderNothing),
  withHandlers({
    handleNoteChange: ({ task, updateTask }) => (event, { value: note }) => {
      updateTask(task.uuid, { note });
    },
    handleDateChange: ({ task, updateTask }) => (dateAndTime) => {
      updateTask(task.uuid, {
        dateAndTime,
      });
    },
    handleOwnerChange: ({ task, updateTask, onChange }) => (event, { value: owner }) => {
      onChange(owner);
      // updateTask(task.uuid, {
      //   owner,
      // });
    },
    handleUnitChange: ({ task, updateTask }) => (event, { value: unit }) => {
      updateTask(task.uuid, {
        unit,
        owner: null,
      });
    },
  })
)(AssignTaskForm);

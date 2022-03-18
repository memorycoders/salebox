//@flow
import * as React from 'react';
import { Button, Form, Grid, Icon, Input, Segment } from 'semantic-ui-react';
import _l from 'lib/i18n';
import * as OrganisationActions from 'components/Organisation/organisation.actions';
import { compose, withHandlers, pure } from 'recompose';
import { connect } from 'react-redux';
import UnitDropdown from 'components/Unit/UnitDropdown';
import IndustryDropdown from 'components/Industry/IndustryDropdown';
import DatePickerInput from 'components/DatePicker/DatePickerInput';

import { FormPair } from 'components';
import { Types } from 'Constants';
import css from 'Common.css';
import { Link } from 'react-router-dom';

type PropsT = {
  handleNameChange: (Event, { value: string }) => void,
  handleUnitChange: (Event, { value: string }) => void,
  handleResponsibleChange: (Event, { value: string }) => void,
  handleDeadlineChange: (Event, { value: string }) => void,
  formKey: string,
  form: {},
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    Unit: 'Unit',
    Responsible: 'Responsible',
    Deadline: 'Deadline',
    Name: 'Name',
  },
});

const CreateAccountForm = ({
  handleNameChange,
  handleResponsibleChange,
  handleUnitChange,
  handleDeadlineChange,
  form,
}: PropsT) => {

  return (
    <Form className={css.padded}>
      <Input
        // action={<Button icon="remove" onClick={clearSearch} loading={loading} />}
        iconPosition="left"
        value={form.searchTerm}
        fluid
        // placeholder={placeholder}
        icon="search"
        onChange={handleNameChange}
      />

      <Grid>
        <Grid.Column width={14}>
          <div>Add Filter</div>
        </Grid.Column>
        <Grid.Column width={1}>
          <Button icon={'plus circle'} />
        </Grid.Column>
      </Grid>
    </Form>
  );
};

const mapStateProps = (state, { formKey }) => ({
  form: state.entities.organisation[formKey] || {},
});

const createUpdateHandler = (key) => ({ update, formKey }) => (event, { value }) => update(formKey, { [key]: value });

export default compose(
  connect(
    mapStateProps,
    {
      update: OrganisationActions.update,
    }
  ),
  withHandlers({
    handleNameChange: createUpdateHandler('name'),
    handleResponsibleChange: createUpdateHandler('responsible'),
    handleUnitChange: createUpdateHandler('unit'),
    handleDeadlineChange: createUpdateHandler('deadline'),
  }),
  pure
)(CreateAccountForm);

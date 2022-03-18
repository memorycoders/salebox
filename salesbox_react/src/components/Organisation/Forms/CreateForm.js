//@flow
import * as React from 'react';
import { Form, Input, Grid, Segment, Popup } from 'semantic-ui-react';
import { FormPair, FormHeader, Avatar } from 'components';

import * as OrganisationActions from 'components/Organisation/organisation.actions';

import { compose, withHandlers, pure } from 'recompose';
import { connect } from 'react-redux';

import CountryDropdown from 'components/Country/CountryDropdown';
import UserResponsibleDD from 'components/User/DropDown/UserResponsibleDD';
import IndustryDropdown from 'components/Industry/IndustryDropdown';
import SizeDropdown from 'components/Size/SizeDropdown';
import TypeDropdown from 'components/Type/TypeDropdown';
import EmailPane from 'components/Organisation/EmailPane/EmailPane';
import PhonePane from 'components/Organisation/PhonePane/PhonePane';

import { Types } from 'Constants';

import css from 'Common.css';

type PropsT = {
  handleResponsibleChange: (event: Event, { value: string }) => void,
  handleFormalNameChange: (Event, { value: string }) => void,
  handleVatChange: (Event, { value: string }) => void,
  handleStreetChange: (Event, { value: string }) => void,
  handleZipCodeChange: (Event, { value: string }) => void,
  handleCityChange: (Event, { value: string }) => void,
  handleRegionChange: (Event, { value: string }) => void,
  handleCountryChange: (Event, { value: string }) => void,
  handleNameChange: (Event, { value: string }) => void,
  handleIndustryChange: (Event, { value: string }) => void,
  handleTypeChange: (Event, { value: string }) => void,
  handleSizeChange: (Event, { value: string }) => void,
  handleWebChange: (Event, { value: string }) => void,
  handleBudgetChange: (Event, { value: string }) => void,
  handleNumberGoalsMeetingChange: (Event, { value: string }) => void,
  formKey: string,
  form: {},
};

import _l from 'lib/i18n';
addTranslations({
  'en-US': {
    '{0}': '{0}',
    'Profile behavior': 'Profile behavior',
    Industry: 'Industry',
    Relationship: 'Relationship',
    Type: 'Type',
    Relation: 'Relation',
    Address: 'Address',
    Company: 'Company',
    General: 'General',
    'Formal name': 'Formal name',
    'VAT nr.': 'VAT nr.',
    Size: 'Size',
    Web: 'Web',
    Budget: 'Budget',
    'Only used by ERP integrations': 'Only used by ERP integrations',
    Target: 'Target',
    Contact: 'Contact',
  },
});

const CreateAccountForm = ({
  handleFormalNameChange,
  handleVatChange,
  handleStreetChange,
  handleZipCodeChange,
  handleCityChange,
  handleRegionChange,
  handleCountryChange,
  handleNameChange,
  handleIndustryChange,
  handleTypeChange,
  handleSizeChange,
  handleWebChange,
  handleNumberGoalsMeetingChange,
  handleBudgetChange,
  handleResponsibleChange,
  formKey,
  form,
}: PropsT) => {
  return (
    <Form className={css.padded}>
      <FormHeader label={_l`Company`} mini />
      <Grid>
        <Grid.Column width={12}>
          {formKey == '__EDIT' && (
            <React.Fragment>
              <FormPair mini label={_l`Responsible`}>
                <UserResponsibleDD value={form.participants} _onChange={handleResponsibleChange} />
              </FormPair>
            </React.Fragment>
          )}

          <FormPair mini required label={_l`Name`}>
            <Input required fluid value={form.name || ''} onChange={handleNameChange} />
          </FormPair>
          <FormPair mini label={_l`ERP name`}>
            <Popup
              trigger={<Input fluid value={form.formalName || ''} onChange={handleFormalNameChange} />}
              content={_l`Only used by ERP integrations`}
            />
          </FormPair>
          <FormPair mini label={_l`VAT No.`}>
            <Input fluid value={form.vatNumber || ''} onChange={handleVatChange} />
          </FormPair>
          <FormPair mini label={_l`Web`}>
            <Input fluid value={form.web || ''} onChange={handleWebChange} />
          </FormPair>
        </Grid.Column>
        <Grid.Column width={4}>
          <Segment style={{ height: '100' }} textAlign="center">
            <Avatar
              size={72}
              src={form.avatar}
              border={form.relationship || 'YELLOW'}
              fallbackIcon="building outline"
            />
          </Segment>
        </Grid.Column>
      </Grid>

      <FormHeader label={_l`General`} mini />
      <FormPair mini label={_l`Type`}>
        <TypeDropdown type={Types.Default} fluid value={form.type} onChange={handleTypeChange} />
      </FormPair>
      <FormPair mini label={_l`Industry`}>
        <IndustryDropdown onChange={handleIndustryChange} value={form.industry} />
      </FormPair>
      <FormPair mini label={_l`Size`}>
        <SizeDropdown onChange={handleSizeChange} value={form.size} />
      </FormPair>

      {/* FIXME: 3 types of category - Visiting, Billing, Shipping */}
      <FormHeader label={_l`Address`} mini />
      <FormPair mini label={_l`Street`}>
        <Input fluid value={form.street || ''} onChange={handleStreetChange} />
      </FormPair>
      <FormPair mini label={_l`Postal code`}>
        <Input fluid value={form.zipCode || ''} onChange={handleZipCodeChange} />
      </FormPair>
      <FormPair mini label={_l`City`}>
        <Input fluid value={form.city || ''} onChange={handleCityChange} />
      </FormPair>
      <FormPair mini label={_l`Region`}>
        <Input fluid value={form.state || ''} onChange={handleRegionChange} />
      </FormPair>
      <FormPair mini label={_l`Country`}>
        <CountryDropdown fluid value={form.country} onChange={handleCountryChange} />
      </FormPair>

      <FormHeader label={_l`Contact`} mini />
      <EmailPane organisationId={formKey} emails={form.additionalEmailList || []} />
      <PhonePane organisationId={formKey} phones={form.additionalPhoneList || []} />

      {formKey == '__EDIT' && (
        <React.Fragment>
          <FormHeader label={_l`Target`} mini />
          <FormPair mini label={_l`Budget`}>
            <Input fluid type="number" value={form.budget} onChange={handleBudgetChange} />
          </FormPair>
          <FormPair mini label={_l`Meeting goal per week`}>
            <Input
              fluid
              type="number"
              value={form.numberGoalsMeeting || ''}
              onChange={handleNumberGoalsMeetingChange}
            />
          </FormPair>
        </React.Fragment>
      )}
    </Form>
  );
};

const mapStateProps = (state, { formKey }) => ({
  form: state.entities.organisation[formKey] || {},
});

const createUpdateHandler = (key) => ({ update, formKey }) => (event, { value }) => update(formKey, { [key]: value });

export default compose(
  connect(mapStateProps, {
    update: OrganisationActions.update,
  }),
  withHandlers({
    handleResponsibleChange: createUpdateHandler('responsible'),
    handleFormalNameChange: createUpdateHandler('formalName'),
    handleVatChange: createUpdateHandler('vatNumber'),
    handleWebChange: createUpdateHandler('web'),
    handleBudgetChange: createUpdateHandler('budget'),
    handleNumberGoalsMeetingChange: createUpdateHandler('numberGoalsMeeting'),
    handleStreetChange: createUpdateHandler('street'),
    handleZipCodeChange: createUpdateHandler('zipcode'),
    handleCityChange: createUpdateHandler('city'),
    handleRegionChange: createUpdateHandler('state'),
    handleCountryChange: createUpdateHandler('country'),
    handleNameChange: createUpdateHandler('name'),
    handleIndustryChange: createUpdateHandler('industry'),
    handleTypeChange: createUpdateHandler('type'),
    handleSizeChange: createUpdateHandler('size'),
  }),
  pure
)(CreateAccountForm);

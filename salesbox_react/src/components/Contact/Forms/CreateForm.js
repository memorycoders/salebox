//@flow
import * as React from 'react';
import { Form, Input, Grid, Segment } from 'semantic-ui-react';

import * as ContactActions from 'components/Contact/contact.actions';

import { compose, withHandlers, pure, defaultProps } from 'recompose';
import { connect } from 'react-redux';

import OrganisationDropdown from 'components/Organisation/OrganisationDropdown';
import CountryDropdown from 'components/Country/CountryDropdown';
import IndustryDropdown from 'components/Industry/IndustryDropdown';
import RelationshipDropdown from 'components/Relationship/RelationshipDropdown';
import DiscProfileDropdown from 'components/DiscProfile/DiscProfileDropdown';
import TypeDropdown from 'components/Type/TypeDropdown';
import EmailPane from 'components/Contact/EmailPane/EmailPane';
import PhonePane from 'components/Contact/PhonePane/PhonePane';

import { Avatar, FormPair, FormHeader } from 'components';

import { Types } from 'Constants';

import css from 'Common.css';

type PropsT = {
  formKey: string,
  handleOrganisationChange: (event: Event, { value: string }) => void,
  handleFirstNameChange: (Event, { value: string }) => void,
  handleLastNameChange: (Event, { value: string }) => void,
  handleStreetChange: (Event, { value: string }) => void,
  handleZipCodeChange: (Event, { value: string }) => void,
  handleCityChange: (Event, { value: string }) => void,
  handleRegionChange: (Event, { value: string }) => void,
  handleCountryChange: (Event, { value: string }) => void,
  handleTitleChange: (Event, { value: string }) => void,
  handleIndustryChange: (Event, { value: string }) => void,
  handleDiscProfileChange: (Event, { value: string }) => void,
  handleTypeChange: (Event, { value: string }) => void,
  handleRelationChange: (Event, { value: string }) => void,
  handleRelationShipChange: (Event, { value: string }) => void,
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
    Personal: 'Personal',
    General: 'General',
    Title: 'Title',
    'Last name': 'Last name',
  },
});

const CreateContactForm = ({
  handleOrganisationChange,
  handleFirstNameChange,
  handleLastNameChange,
  handleStreetChange,
  handleZipCodeChange,
  handleCityChange,
  handleRegionChange,
  handleCountryChange,
  handleTitleChange,
  handleIndustryChange,
  handleDiscProfileChange,
  handleTypeChange,
  handleRelationChange,
  handleRelationShipChange,
  formKey,
  form,
}: PropsT) => {
  return (
    <Form className={css.padded}>
      <FormHeader label={_l`Personal`} mini />
      <Grid>
        <Grid.Column width={12}>
          <FormPair mini label={_l`Title`}>
            <Input fluid value={form.title || ''} onChange={handleTitleChange} />
          </FormPair>
          <FormPair mini required label={_l`First name`}>
            <Input required fluid value={form.firstName || ''} onChange={handleFirstNameChange} />
          </FormPair>
          <FormPair mini required label={_l`Last name`}>
            <Input required fluid value={form.lastName || ''} onChange={handleLastNameChange} />
          </FormPair>
        </Grid.Column>
        <Grid.Column width={4}>
          <Segment style={{ height: '100' }} textAlign="center">
            <Avatar size={72} src={form.avatar} border={form.relationship} />
          </Segment>
        </Grid.Column>
      </Grid>
      <FormHeader label={_l`General`} mini />
      <FormPair mini label={_l`Company`}>
        <OrganisationDropdown value={form.organisation} onChange={handleOrganisationChange} />
      </FormPair>
      <FormPair mini label={_l`Profile behaviour`}>
        <DiscProfileDropdown fluid value={form.discProfile} onChange={handleDiscProfileChange} />
      </FormPair>
      <FormPair mini label={_l`Type`}>
        <TypeDropdown type={Types.Default} fluid value={form.type} onChange={handleTypeChange} />
      </FormPair>
      <FormPair mini label={_l`Industry`}>
        <IndustryDropdown onChange={handleIndustryChange} type="TYPE" value={form.industry} />
      </FormPair>
      <FormPair mini label={_l`Position`}>
        <TypeDropdown type={Types.Contact} fluid value={form.relation} onChange={handleRelationChange} />
      </FormPair>
      <FormPair mini label={_l`Relationship`}>
        <RelationshipDropdown onChange={handleRelationShipChange} value={form.relationship} />
      </FormPair>
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
        <Input fluid value={form.region || ''} onChange={handleRegionChange} />
      </FormPair>
      <FormPair mini label={_l`Country`}>
        <CountryDropdown fluid value={form.country} onChange={handleCountryChange} />
      </FormPair>
      <EmailPane contactId={formKey} emails={form.additionalEmailList || []} />
      <PhonePane contactId={formKey} phones={form.additionalPhoneList || []} />
    </Form>
  );
};

const mapStateProps = (state, { formKey }) => ({
  form: state.entities.contact[formKey] || {},
});

const createUpdateHandler = (key) => ({ update, formKey }) => (event, { value }) => update(formKey, { [key]: value });

export default compose(
  defaultProps({
    formKey: '__CREATE',
  }),
  connect(mapStateProps, {
    update: ContactActions.update,
  }),
  withHandlers({
    handleOrganisationChange: createUpdateHandler('organisation'),
    handleFirstNameChange: createUpdateHandler('firstName'),
    handleLastNameChange: createUpdateHandler('lastName'),
    handleStreetChange: createUpdateHandler('street'),
    handleZipCodeChange: createUpdateHandler('zipCode'),
    handleCityChange: createUpdateHandler('city'),
    handleRegionChange: createUpdateHandler('region'),
    handleCountryChange: createUpdateHandler('country'),
    handleTitleChange: createUpdateHandler('title'),
    handleIndustryChange: createUpdateHandler('industry'),
    handleTypeChange: createUpdateHandler('type'),
    handleRelationShipChange: createUpdateHandler('relationship'),
    handleRelationChange: createUpdateHandler('relation'),
    handleDiscProfileChange: createUpdateHandler('discProfile'),
  }),
  pure
)(CreateContactForm);

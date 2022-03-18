//@flow
import * as React from 'react';
import { Form, Input } from 'semantic-ui-react';
import _l from 'lib/i18n';
import * as ContactActions from 'components/Contact/contact.actions';
import { compose, withHandlers, pure, defaultProps } from 'recompose';
import { connect } from 'react-redux';
import OrganisationDropdown from 'components/Organisation/OrganisationDropdown';
import ContactDropdown from 'components/Contact/ContactDropdown';
import UserDropdown from 'components/User/UserDropdown';
import { SalesMethodDropdown } from 'components/SalesMethod';
import DatePickerInput from 'components/DatePicker/DatePickerInput';
import { FormPair } from 'components';
import cx from 'classnames';
import css from 'Common.css';
import { calculatingPositionMenuDropdown } from '../../../Constants';
type PropsT = {
  handleOrganisationChange: (event: Event, { value: string }) => void,
  handleContactChange: (event: Event, { value: string }) => void,
  handleUserChange: (event: Event, { value: string }) => void,
  handleDescriptionChange: (event: Event, { value: string }) => void,
  handleContractDateChange: (event: Event, { value: string }) => void,
  handleSalesProcessChange: (event: Event, { value: string }) => void,
  form: {},
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    Account: 'Account',
    Contact: 'Contact',
    Description: 'Description',
    'Next action': 'Next action',
  },
});

const CreateContactForm = ({
  handleDescriptionChange,
  handleUserChange,
  handleOrganisationChange,
  handleContactChange,
  handleContractDateChange,
  handleSalesProcessChange,
  form,
}: PropsT) => {
  const contractDate = form.contractDate ? new Date(form.contractDate) : new Date();
  return (
    <Form className={(cx(css.padded, css.padBottom), 'position-unset')}>
      <FormPair mini label={_l`Company`}>
        <OrganisationDropdown value={form.organisation} onChange={handleOrganisationChange} />
      </FormPair>
      <FormPair mini label={_l`Contact`}>
        <ContactDropdown organisationId={form.organisation} value={form.contact} onChange={handleContactChange} />
      </FormPair>
      <FormPair mini label={_l`Responsible`}>
        <UserDropdown value={form.user} onChange={handleUserChange} />
      </FormPair>
      <FormPair mini label={_l`Description`}>
        <Input fluid value={form.description || ''} onChange={handleDescriptionChange} />
      </FormPair>
      <FormPair mini label={_l`Pipeline`}>
        <SalesMethodDropdown
          className="position-clear"
          upward={false}
          value={form.salesProcess}
          onChange={handleSalesProcessChange}
          id="SaleProcessDropdownCreateQualifiedDeal"
          onClick={() => calculatingPositionMenuDropdown('SaleProcessDropdownCreateQualifiedDeal')}
        />
      </FormPair>
      <FormPair mini label={_l`Next action`}>
        <DatePickerInput onChange={handleContractDateChange} value={contractDate} />
      </FormPair>
    </Form>
  );
};

const mapStateProps = (state, { formKey }) => ({
  form: state.entities.prospect[formKey] || {},
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
    handleContactChange: createUpdateHandler('contact'),
    handleUserChange: createUpdateHandler('user'),
    handleDescriptionChange: createUpdateHandler('description'),
    handleSalesProcessChange: createUpdateHandler('salesProcess'),
    handleContractDateChange: ({ update, formKey }) => (contractDate) => update(formKey, { contractDate }),
  }),
  pure
)(CreateContactForm);

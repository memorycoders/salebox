//@flow
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as DropdownActions from 'components/Dropdown/dropdown.actions';
import { getContactsForOrganisation } from 'components/CallListAccount/callListAccount.selector';
import { compose, withHandlers, mapProps, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { ObjectTypes } from 'Constants';
import _l from 'lib/i18n';
import type { ContactT } from 'components/CallListAccount/callListAccount.types';
import { getDropdown } from 'components/Dropdown/dropdown.selector';

type PropsT = {
  contacts: Array<ContactT>,
  handleSearch: (event: Event, { value: string }) => void,
  isFetching: (event: Event, { searchQuery: string }) => void,
  isFetching: boolean,
};

addTranslations({
  'en-US': {
    'Select contact': 'Select contact',
  },
});

const objectType = ObjectTypes.Contact;

const ContactDropdown = ({ handleSearch, contacts, isFetching, ...other }: PropsT) => {
  return (
    <Dropdown
      loading={isFetching}
      onSearchChange={handleSearch}
      fluid
      search
      selection
      size="small"
      placeholder={_l`Select contact`}
      options={contacts}
      {...other}
    />
  );
};

export default compose(
  connect(
    (state, { extra = [], value, organisationId }) => {
      const dropdown = getDropdown(state, objectType);
      const extraContacts = extra.map((email) => ({
        text: email,
        value: email,
      }));
      const contacts = [...getContactsForOrganisation(state, organisationId, value), ...extraContacts];
      return {
        contacts,
        searchTerm: dropdown.searchTerm,
        isFetching: dropdown.isFetching,
      };
    },
    {
      requestFetchDropdown: DropdownActions.requestFetch,
    }
  ),
  withHandlers({
    handleSearch: ({ organisationId, requestFetchDropdown }) => (event, { searchQuery }) => {
      requestFetchDropdown(objectType, searchQuery, organisationId);
    },
  }),
  lifecycle({
    componentWillMount() {
      const { organisationId, requestFetchDropdown } = this.props;
      requestFetchDropdown(objectType, null, organisationId);
    },
    componentDidUpdate: function(prevProps) {
      const { organisationId, requestFetchDropdown, searchTerm } = this.props;
      if (organisationId !== prevProps.organisationId && organisationId) {
        requestFetchDropdown(objectType, searchTerm, organisationId);
      }
    },
  }),
  // eslint-disable-next-line no-unused-vars
  mapProps(({ requestFetchDropdown, searchTerm, organisationId, ...other }) => ({
    ...other,
  }))
)(ContactDropdown);

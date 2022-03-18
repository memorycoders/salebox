/* eslint-disable react/prop-types */
//@flow
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as DropdownActions from 'components/Dropdown/dropdown.actions';
import { getContactsForOrganisation } from 'components/ContactDropdown/contactDropdown.selector';
import { compose, withHandlers, mapProps, lifecycle, withState } from 'recompose';
import { connect } from 'react-redux';
import { ObjectTypes } from 'Constants';
import _l from 'lib/i18n';
import type { ContactT } from 'components/Contact/contact.types';
import { getDropdown } from 'components/Dropdown/dropdown.selector';
import './ContractDropdown.less';

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

const objectType = ObjectTypes.ContactDropdown;

const ContactDropdown = ({ colId,handleSearch, contacts, contactList ,isFetching, onChange, addLabel, error, value, text, ...other }: PropsT) => {
  return (
    <div className="contract-dropdown-container">
      <Dropdown
        loading={isFetching}
        onSearchChange={handleSearch}
        fluid
        search
        selection
        clearable
        size="small"
        multiple
        placeholder={_l`Select contact`}
        options={contacts}
        error={error && error.contact ? true : false}
        {...other}
      />
      <div className="bot-button">dsdssd</div>
    </div>
    // <AddDropdown
    //   loading={isFetching}
    //   fluid
    //   colId={colId}
    //   selection
    //   search
    //   size="small"
    //   options={contactList}
    //   error={error}
    //   handleSearch={handleSearch}
    //   onChange={onChange}
    //   value={value}
    //   addLabel={addLabel}
    //   isLoadMore={true}
    //   text={text ? text : null}
    //   // {...other}
    // />
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
        contacts: getContactsForOrganisation(state, organisationId, value),
        searchTerm: dropdown.searchTerm,
        isFetching: dropdown.isFetching,
      };
    },
    {
      requestFetchDropdown: DropdownActions.requestFetch,
    }
  ),
  withState('contactList', 'setContacts', (props) => {
    return props.contacts;
  }),
  withHandlers({
    handleSearch: ({ organisationId, requestFetchDropdown }) => (txt, page) => {
      requestFetchDropdown(objectType, txt, { organisationId, pageIndex: page });
    },
  }),
  lifecycle({
    componentWillMount() {
      const { organisationId, requestFetchDropdown } = this.props;
      requestFetchDropdown(objectType, null, { organisationId });
    },
    componentDidUpdate: function (prevProps) {
      const { organisationId, requestFetchDropdown, searchTerm } = this.props;
      if (organisationId !== prevProps.organisationId && organisationId) {
        requestFetchDropdown(objectType, searchTerm, { organisationId });
      }
      if (prevProps.contacts !== this.props.contacts) {
        this.props.setContacts(this.props.contacts);
      }
    },
  }),
  // eslint-disable-next-line no-unused-vars
  mapProps(({ requestFetchDropdown, searchTerm, organisationId, ...other }) => ({
    ...other,
  }))
)(ContactDropdown);

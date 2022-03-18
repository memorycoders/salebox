/* eslint-disable react/prop-types */
//@flow
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as DropdownActions from 'components/Dropdown/dropdown.actions';
import { getContactsForOrganisation } from 'components/ContactDropdown/contactDropdown.selector';
import { compose, withHandlers, mapProps, lifecycle, withState } from 'recompose';
import AddDropdown from '../AddDropdown/AddDropdown';
import { connect } from 'react-redux';
import { ObjectTypes } from 'Constants';
import _l from 'lib/i18n';
import type { ContactT } from 'components/Contact/contact.types';
import { getDropdown } from 'components/Dropdown/dropdown.selector';
import * as OverviewActions from './../Overview/overview.actions.js';
import { OverviewTypes } from 'Constants';
import { createEntity } from './contact.actions';
import { isHighlightAction } from 'components/Overview/overview.selectors';
import { setSearchTerm } from '../Dropdown/dropdown.actions';

type PropsT = {
  contacts: Array<ContactT>,
  handleSearch: (event: Event, { value: string }) => void,
  isFetching: (event: Event, { searchQuery: string }) => void,
  isFetching: boolean,
  addContact: () => void,
};

addTranslations({
  'en-US': {
    'Select contact': 'Select contact',
  },
});

const objectType = ObjectTypes.ContactDropdown;

const ContactDropdown = ({
  colId,
  handleSearch,
  contacts,
  contactList,
  isFetching,
  onChange,
  addLabel,
  error,
  value,
  text,
  multiple,
  addContact,
  ...other
}: PropsT) => {
  return (
    <AddDropdown
      id="ContactDropdownAdd"
      loading={isFetching}
      fluid
      colId={colId}
      selection
      search
      size="small"
      options={contactList}
      error={error}
      handleSearch={handleSearch}
      onChange={onChange}
      onClickAdd={addContact}
      value={value}
      addLabel={addLabel}
      multiple={multiple}
      isLoadMore={true}
      text={text ? text : null}
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
      // const contacts = [...getContactsForOrganisation(state, organisationId, value), ...extraContacts];
      const visibleAddContact = isHighlightAction(state, OverviewTypes.Contact, 'create');

      return {
        contacts: getContactsForOrganisation(state, organisationId, value),
        searchTerm: dropdown.searchTerm,
        isFetching: dropdown.isFetching,
        organisation: state.entities.organisationDropdown[organisationId] || { uuid: organisationId },
        visibleAddContact,
        __CREATE: state.entities.contact.__CREATE,
      };
    },
    {
      requestFetchDropdown: DropdownActions.requestFetch,
      highlight: OverviewActions.highlight,
      setActionForHighlight: OverviewActions.setActionForHighlight,
      createEntity,
      setSearchTerm,
    }
  ),
  withState('contactList', 'setContacts', (props) => {
    return props.contacts;
  }),
  withState('isAddContact', 'setIsAddContact', false),
  withHandlers({
    handleSearch: ({ organisationId, requestFetchDropdown }) => (txt, page) => {
      requestFetchDropdown(objectType, txt, { organisationId, pageIndex: page });
    },
    addContact: ({ setActionForHighlight, organisation, createEntity, setIsAddContact, setSearchTerm }) => () => {
      setSearchTerm('CONTACT_DROPDOWN', '');
      setActionForHighlight(OverviewTypes.Contact, 'create');
      //
      const contact = {
        industry: (organisation.industry && organisation.industry.uuid) || null,
        size: (organisation.size && organisation.size.uuid) || null,
        type: (organisation.type && organisation.type.uuid) || null,
        relation: organisation.relation && organisation.relation.uuid,
        street: organisation.street,
        zipCode: organisation.zipCode,
        city: organisation.city,
        region: organisation.state,
        country: organisation.country,
        organisationId: organisation.uuid,
      };
      createEntity(contact);
      //is add new contact
      setTimeout(() => {
        setIsAddContact(true);
      }, 100);
    },
  }),
  // withState("displayName", 'setDisplayName', props => {
  //   return props.__CREATE && `${props.__CREATE.firstName} ${props.__CREATE.lastName}`
  // }),
  withState('displayName', 'setDisplayName', ''),
  lifecycle({
    componentWillMount() {
      const { organisationId, requestFetchDropdown } = this.props;
      requestFetchDropdown(objectType, null, { organisationId });
    },
    componentDidUpdate: function(prevProps) {
      const { organisationId, requestFetchDropdown, searchTerm } = this.props;
      // console.log('this.props.isAddContact',this.props.isAddContact);
      // console.log('this.props.visibleAddContact',this.props.visibleAddContact);

      if (
        (organisationId !== prevProps.organisationId && organisationId) ||
        (this.props.isAddContact && this.props.visibleAddContact != true && prevProps.visibleAddContact == true)
      ) {
        this.props.setIsAddContact(false);

        requestFetchDropdown(objectType, searchTerm, { organisationId });
      }
      if (prevProps.contacts !== this.props.contacts) {
        this.props.setContacts(this.props.contacts);
      }
    },
    componentWillReceiveProps(nextProps) {
      if (nextProps.__CREATE !== this.props.__CREATE) {
        if (nextProps.__CREATE.firstName && nextProps.__CREATE.lastName) {
          this.props.setDisplayName(`${nextProps.__CREATE.firstName} ${nextProps.__CREATE.lastName}`);
        }
      }
      if (nextProps.contacts !== this.props.contacts) {
        console.log("🚀 ~ file: ContactDropdown.js ~ line 167 ~ componentWillReceiveProps ~ nextProps.contacts", nextProps.contacts)
        this.props.setContacts(nextProps.contacts);
      }
      if (
        !nextProps.multiple &&
        nextProps.displayName &&
        nextProps.value &&
        !nextProps.contacts?.find((e) => e.key === nextProps.value[nextProps.value.length - 1])
      ) {
        // console.log('------------------------:', nextProps.value[nextProps.value.length - 1]);
        let newValue = nextProps.value[nextProps.value.length - 1];
        // console.log('huhuhuhu: ko  tim thay vlaue nao');
        nextProps.contacts.push({
          key: nextProps.value,
          value: nextProps.value,
          text: nextProps.displayName,
        });
      }
    },
  }),
  // eslint-disable-next-line no-unused-vars
  mapProps(({ requestFetchDropdown, searchTerm, organisationId, ...other }) => ({
    ...other,
  }))
)(ContactDropdown);

/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
//@flow
import * as React from 'react';
import { Modal } from 'semantic-ui-react';
import * as DropdownActions from 'components/Dropdown/dropdown.actions';
import { getContactsForOrganisationWithEmail, getContacts } from 'components/ContactDropdown/contactDropdown.selector';
import { compose, withHandlers, mapProps, lifecycle, withState } from 'recompose';
import AddDropdown from '../../../AddDropdown/AddDropdown';
import { connect } from 'react-redux';
import { ObjectTypes } from 'Constants';
import _l from 'lib/i18n';
import type { ContactT } from 'components/Contact/contact.types';
import { getDropdown } from 'components/Dropdown/dropdown.selector';
import AddEmailModal from './AddEmailModal';

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

const ContactDropdown = ({
  colId,
  handleSearch,
  contactList,
  isFetching,
  onChange,
  addLabel,
  error,
  value,
  multiple,
  visiableAddModal,
  addEmail,
  setVisiableAddModal,
  changeCloseOnDimmerClickParent,
  onHandleAddNew,
  className,
  calculatingPositionMenuDropdown,
  type
}: PropsT) => {



  return (
    <>
      <AddDropdown
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
        type={type}
        value={value}
        addLabel={addLabel}
        multiple={multiple}
        isLoadMore={true}
        onClickAdd={addEmail}
        className={`${className} dropdown_input`}
        onClick={() => {
          calculatingPositionMenuDropdown && calculatingPositionMenuDropdown(colId);
        }}
      />
      <Modal.Actions>
        <AddEmailModal
          visible={visiableAddModal}
          hideAssignForm={() => {
            changeCloseOnDimmerClickParent(true);
            setVisiableAddModal(false);
          }}
          onHandleAddNew={onHandleAddNew}
        />
      </Modal.Actions>
    </>
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

      const list = getContactsForOrganisationWithEmail(state, organisationId, value) || [];
      //list.shift();
      const contacts = [...list, ...extraContacts];

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
  withState('contactList', 'setContacts', (props) => {
    return props.contacts;
  }),
  withState('visiableAddModal', 'setVisiableAddModal', false),
  withHandlers({
    handleSearch: ({ organisationId, requestFetchDropdown }) => (txt, page) => {

      requestFetchDropdown(objectType, txt, { organisationId, pageIndex: page });
    },
    addEmail: ({ setVisiableAddModal, changeCloseOnDimmerClickParent }) => () => {
      changeCloseOnDimmerClickParent(false);
      setVisiableAddModal(true);
    },
    onHandleAddNew: ({ onAddItem }) => (email) => {
      onAddItem(email);
    },
  }),
  lifecycle({
    // shouldComponentUpdate(nextProps){
    //   const { extra, value } = this.props;
    //   if (extra !== nextProps.extra || value !== nextProps.value){
    //     return true;
    //   }
    //   return false;
    // },
    componentWillMount() {
      const { organisationId, requestFetchDropdown } = this.props;
      requestFetchDropdown(objectType, null, { organisationId });
    },
    // componentDidMount() {
    //   const { organisationId, requestFetchDropdown } = this.props;
    //   requestFetchDropdown(objectType, null, { organisationId });
    // },
    componentDidUpdate: function(prevProps) {
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

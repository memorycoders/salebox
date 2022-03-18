//@flow
import * as React from 'react';
import { compose, lifecycle, withHandlers, mapProps, withState } from 'recompose';
import { ObjectTypes } from 'Constants';
import { connect } from 'react-redux';
import generateUuid from 'uuid/v4';
import AddDropdown from '../../AddDropdown/AddDropdown';
import api from 'lib/apiClient';

type PropsT = {
  organisations: Array<OrganisationT>,
  handleSearch: (event: Event, { value: string }) => void,
  isFetching: boolean,
};

const ContactDropdown = ({
  colId,
  handleSearch,
  contacts,
  isFetching,
  value,
  onChange,
  addLabel,
  organisationList,
  error,
  text,
  ...other
}: PropsT) => {
  const contactsShow = contacts.map((value) => {
    return {
      key: value.uuid,
      value: value.uuid,
      text: value.fullName,
    };
  });

  return (
    <AddDropdown
      colId={`contact-dropdown-relation`}
      loading={isFetching}
      lazyLoad
      search
      fluid
      selection
      placeholder={' '}
      size="small"
      options={contactsShow}
      value={value}
      onChange={onChange}
      addLabel={addLabel}
      handleSearch={handleSearch}
      isLoadMore={true}
      error={error}
      text={text ? text : null}
      // {...other}
    />
  );
};

export default compose(
  connect((state, { value }) => {}, {}),
  withState('contacts', 'setContacts', []),
  withHandlers({
    handleSearch: ({ setContacts, contacts }) => async (txt, page) => {
      const timezone = new Date().getTimezoneOffset() / -60;

      try {
        const data = await api.post({
          resource: `contact-v3.0/ftsES`,
          query: {
            sessionKey: generateUuid(),
            timeZone: timezone,
            pageIndex: page,
            pageSize: 10,
            updatedDate: 0,
          },
          data: {
            customFilter: 'active',
            orderBy: 'orderIntake',
            roleFilterType: 'Company',
            roleFilterValue: '',
            searchText: txt,
          },
        });
        if (data) {
          const { contactDTOList } = data;
          if (page === 0) {
            setContacts(contactDTOList);
          } else {
            setContacts(contacts.concat(contactDTOList));
          }
        }
      } catch (error) {}
    },

    onChange: ({ setContactForForm }) => (item, { value }) => {
      setContactForForm(value);
    },
  }),
  lifecycle({
    async componentDidMount() {
      const { setContacts } = this.props;
      const timezone = new Date().getTimezoneOffset() / -60;

      const data = await api.post({
        resource: `contact-v3.0/ftsES`,
        query: {
          sessionKey: generateUuid(),
          timeZone: timezone,
          pageIndex: 0,
          pageSize: 10,
          updatedDate: 0,
        },
        data: {
          customFilter: 'active',
          orderBy: 'orderIntake',
          roleFilterType: 'Company',
          roleFilterValue: '',
          searchText: '',
        },
      });
      const { contactDTOList } = data;
      setContacts(contactDTOList);
    },
  }),
  // eslint-disable-next-line no-unused-vars
  mapProps(({ requestFetchDropdown, searchTerm, dispatch, ...other }) => ({
    ...other,
  }))
)(ContactDropdown);

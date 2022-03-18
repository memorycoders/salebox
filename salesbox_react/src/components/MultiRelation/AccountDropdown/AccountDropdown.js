//@flow
import * as React from 'react';
import { compose, lifecycle, withHandlers, mapProps, withState } from 'recompose';
import { ObjectTypes } from 'Constants';
import { connect } from 'react-redux';
import AddDropdown from '../../AddDropdown/AddDropdown';
import api from 'lib/apiClient';

type PropsT = {
  organisations: Array<OrganisationT>,
  handleSearch: (event: Event, { value: string }) => void,
  isFetching: boolean,
};

const AccountDropdown = ({
  colId,
  handleSearch,
  accounts,
  isFetching,
  value,
  onChange,
  addLabel,
  organisationList,
  error,
  text,
  ...other
}: PropsT) => {
  const accountsShow = accounts.map((value) => {
    return {
      key: value.uuid,
      value: value.uuid,
      text: value.name,
    };
  });

  return (
    <AddDropdown
      colId={colId}
      loading={isFetching}
      lazyLoad
      search
      fluid
      selection
      placeholder={' '}
      size="small"
      options={accountsShow}
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
  withState('accounts', 'setAccounts', []),
  withState('isFetching, setIsFetching', false),
  withHandlers({
    handleSearch: ({ setAccounts, accounts, setIsFetching }) => async (txt, page) => {
      try {
        const data = await api.post({
          resource: `organisation-v3.0/searchLocal`,
          query: { pageIndex: page, pageSize: 10, updatedDate: 0 },
          data: { name: txt },
        });
        if (data) {
          const { organisationDTOList } = data;
          if (page === 0) {
            setAccounts(organisationDTOList);
          } else {
            setAccounts(accounts.concat(organisationDTOList));
          }
        }
      } catch (error) {}
    },

    onChange: ({ setAccountForForm }) => (item, { value }) => {
      setAccountForForm(value);
    },
  }),
  lifecycle({
    async componentDidMount() {
      const { setAccounts } = this.props;
      const data = await api.post({
        resource: `organisation-v3.0/searchLocal`,
        query: { pageIndex: 0, pageSize: 10, updatedDate: 0 },
        data: { name: '' },
      });
      const { organisationDTOList } = data;
      setAccounts(organisationDTOList);
    },
  }),
  // eslint-disable-next-line no-unused-vars
  mapProps(({ requestFetchDropdown, searchTerm, dispatch, ...other }) => ({
    ...other,
  }))
)(AccountDropdown);

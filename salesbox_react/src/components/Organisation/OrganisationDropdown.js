//@flow
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as DropdownActions from 'components/Dropdown/dropdown.actions';
import { getOrganisationForDropdown } from 'components/OrganisationDropdown/organisationDropdown.selector';
import { compose, lifecycle, withHandlers, mapProps, withState } from 'recompose';
import { ObjectTypes } from 'Constants';
import { connect } from 'react-redux';
import { getDropdown } from 'components/Dropdown/dropdown.selector';
import AddDropdown from '../AddDropdown/AddDropdown';
import type { OrganisationT } from 'components/Organisation/organisation.types';
import * as OverviewActions from './../Overview/overview.actions.js';
import { OverviewTypes } from 'Constants';
import { isHighlightAction } from 'components/Overview/overview.selectors';
import {setSearchTerm} from '../Dropdown/dropdown.actions';

type PropsT = {
  organisations: Array<OrganisationT>,
  handleSearch: (event: Event, { value: string }) => void,
  isFetching: boolean,
  addAccount:() => void

};

const objectType = ObjectTypes.OrganisationDropdown;

const OrganisationDropdown = ({
  colId,
  handleSearch,
  organisations,
  isFetching,
  value,
  onChange,
  addLabel,
  organisationList,
  error,
  text,
  addAccount,
  multiple,
  ...other
}: PropsT) => {

  return (
    // <Dropdown
    //   loading={isFetching}
    //   lazyLoad
    //   onSearchChange={handleSearch}
    //   fluid
    //   search
    //   selection
    //   clearable
    //   size="small"
    //   options={organisations}
    //   {...other}
    // />
    <AddDropdown
      colId={colId}
      loading={isFetching}
      lazyLoad
      search
      fluid
      selection
      placeholder={' '}
      size="small"
      options={organisationList}
      value={value}
      onChange={onChange}
      addLabel={addLabel}
      onClickAdd={addAccount}
      handleSearch={handleSearch}
      isLoadMore={true}
      error={error}
      text={text ? text : null}
      multiple={multiple}
      // {...other}
    />
  );
};

export default compose(
  connect(
    (state, { value }) => {
      const dropdown = getDropdown(state, objectType);
      const visibleAddCompany = isHighlightAction(state, OverviewTypes.Account, 'create');

      return {
        organisations: getOrganisationForDropdown(state, value),
        isFetching: dropdown.isFetching,
        visibleAddCompany,
      };
    },
    {
      requestFetchDropdown: DropdownActions.requestFetch,
      highlight: OverviewActions.highlight,
      setActionForHighlight: OverviewActions.setActionForHighlight,
      setSearchTerm
    }
  ),
  withState('organisationList', 'setOrganisations', (props) => {
    return props.organisations;
  }),
  withState('isAddCompany','setIsAddCompany',false),
  withHandlers({
    handleSearch: ({ requestFetchDropdown }) => (txt, page) => {
      requestFetchDropdown(objectType, txt, { pageIndex: page });
    },
    addAccount: ({ setActionForHighlight ,setIsAddCompany, setSearchTerm}) => () => {
      setSearchTerm('ORGANISATION_DROPDOWN', '');

      setActionForHighlight(OverviewTypes.Account, 'create');

      setTimeout(()=>{
        setIsAddCompany(true);
      },100)
    },
  //   onChange: ({ setAccountForForm }) => (item, { value }) => {
  //     setAccountForForm(value);
  // }
  }),
  lifecycle({
    componentDidMount() {
      const { requestFetchDropdown } = this.props;
      requestFetchDropdown(objectType);
    },
    componentDidUpdate(prevProps) {
      if (prevProps.organisations !== this.props.organisations) {
        this.props.setOrganisations(this.props.organisations);
      }
      if(this.props.isAddCompany && this.props.visibleAddCompany != true &&  prevProps.visibleAddCompany == true){
        this.props.setIsAddCompany(false);
        this.props.requestFetchDropdown(objectType);

      }
    },
  }),
  // eslint-disable-next-line no-unused-vars
  mapProps(({ requestFetchDropdown, searchTerm, dispatch, ...other }) => ({
    ...other,
  }))
)(OrganisationDropdown);

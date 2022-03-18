//@flow
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as customFieldAction from '../../custom-field.actions';
import { compose, withHandlers, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import _l from 'lib/i18n';


const CustomFieldDropdownAS = ({ isFetching, customFieldOptionList, onChange, value, calculatingPositionMenuDropdown, colId, _class }) => {
    const options = customFieldOptionList ? customFieldOptionList.map((option) => ({
      value: option.uuid,
      text: option.value,
    })) : [];

  return (
    <Dropdown
      id={colId}
      className={_class}
      loading={isFetching}
      lazyLoad
      onClick={() => {calculatingPositionMenuDropdown(colId)}}
      onChange={onChange}
      fluid
      search
      value={value}
      selection
      placeholder={_l`Select`}
      options={options}
    />
  );
};

export default compose(
  connect(
    (state, {customFieldId}) => ({
      isFetching: state.ui.customField.dropdownFetchingById && state.ui.customField.dropdownFetchingById[customFieldId],
      customFieldOptionList: state.ui.customField.customFieldOptionList[customFieldId]
    }),
    {
      fetchDataDropdownAs: customFieldAction.fetchDataDropdownAs,
    }
  ),
  withHandlers({
    fetchData: ({ fetchDataDropdownAs, customFieldId, typeCustomField }) => () => {
      if(typeCustomField === 'OBJECT')
        fetchDataDropdownAs(customFieldId)
    }
  }),
  lifecycle({
    componentWillMount() {
      this.props.fetchData()
    }
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const {customFieldId, fetchData, isCustomField} = this.props;
      if(customFieldId !== nextProps.customFieldId || (isCustomField !== nextProps.isCustomField && nextProps.isCustomField))
        fetchData()
    }
})
)(CustomFieldDropdownAS);
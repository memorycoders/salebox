//@flow
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { getDropdownValue, getStatusFetchingDropdownValue } from './advanced-search.selectors';

const AdvancedValuesDropdown = ({ hanndleChangeDropdown, datas, isFetching, _class, colId, calculatingPositionMenuDropdown, rowId, ...other }: PropsT) => {
  return (
    <Dropdown
      id={colId}
      className={_class}
      onClick={() => { calculatingPositionMenuDropdown && calculatingPositionMenuDropdown(colId)}}
      fluid
      search
      selection
      loading={isFetching}
      options={datas}
      {...other}
      // onChange={hanndleChangeDropdown}
      clearable
    />
  );
};

export default compose(
  connect(
    (state, {rowId}) => ({
      datas: getDropdownValue(state, rowId),
      isFetching: getStatusFetchingDropdownValue(state, rowId),
    })
  ),
  withHandlers({
    hanndleChangeDropdown: ({onChange}) => (e, data) => {
      if(data.options && data.options.length > 0) {
        for (let index = 0; index < data.options.length; index++) {
          if(data.options[index].value === data.value) {
            data['valueText'] = data.options[index].text
          }
        }
      }
      onChange(e, data)
    }
  })
)(AdvancedValuesDropdown);

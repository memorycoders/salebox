import React from 'react';
import { Dropdown } from 'semantic-ui-react';

function YearDropdown(props) {
  const { calculatingPositionMenuDropdown, colId, _class, ...other } = props;
  let currentYear = new Date().getFullYear();
  let options = [];
  for (let i = 0; i <= 50; i++) {
    options.push({ key: currentYear - i, text: currentYear - i, value: currentYear - i });
  }
  return (
    <Dropdown
      id={colId}
      className={_class}
      options={options}
      onClick={() => {
        calculatingPositionMenuDropdown && calculatingPositionMenuDropdown(colId);
      }}
      fluid
      selection
      search
      {...other}
    />
  );
}

export default YearDropdown;

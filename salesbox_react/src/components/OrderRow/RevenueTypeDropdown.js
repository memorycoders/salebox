import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import _l from 'lib/i18n';

function RevenueTypeDropdown({ value, className, ...other }) {
  let dropdownOption = [
    {
      key: 'FIXED',
      text: _l`Fixed`,
      value: 'FIXED',
    },
    {
      key: 'RECURRING',
      text: _l`Recurring`,
      value: 'RECURRING',
    },
  ];
  return <Dropdown options={dropdownOption} selection value={value} fluid className={className} {...other} />;
}

export default RevenueTypeDropdown;

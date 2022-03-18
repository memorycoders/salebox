import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import _l from 'lib/i18n';

function PeriodTypeDropdown({ value, className, ...other }) {
  let dropdownOption = [
    {
      key: 'DAY',
      text: _l`Day`,
      value: 'DAY',
    },
    {
      key: 'WEEK',
      text: _l`Week`,
      value: 'WEEK',
    },
    {
      key: 'MONTH',
      text: _l`Month`,
      value: 'MONTH',
    },

    {
      key: 'QUARTER',
      text: _l`Quarter`,
      value: 'QUARTER',
    },
    {
      key: 'YEAR',
      text: _l`Year`,
      value: 'YEAR',
    },
  ];
  return <Dropdown options={dropdownOption} selection value={value} fluid className={className} {...other} />;
}

export default PeriodTypeDropdown;

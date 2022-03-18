import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { compose, withHandlers, withState } from 'recompose';
import _l from 'lib/i18n';


const StatusDropdown = ({ ...other }) => {
  let statusOptions = [
    { key: 'None', text: _l`Not contacted`, value: 'None', label: { color: 'white', empty: true, circular: true } },
    {
      key: 'Unqualified',
      text: _l`Nothing booked`,
      value: 'unqualified',
      label: { color: 'yellowUnqualified', empty: true, circular: true },
    },
    {
      key: 'Qualified',
      text: _l`Agreed action`,
      value: 'qualified',
      label: { color: 'greenQualified', empty: true, circular: true },
    },
  ];
  return (
    <Dropdown
      // id={colId}
      onClick={() => {
        // calculatingPositionMenuDropdown && calculatingPositionMenuDropdown(colId);
      }}
      fluid
      search
      selection
      options={statusOptions}
      {...other}
      clearable
    />
  );
};

export default compose()(StatusDropdown);

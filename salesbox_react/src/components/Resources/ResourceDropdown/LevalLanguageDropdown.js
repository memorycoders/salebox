import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import _l from 'lib/i18n';

function LevelLanguageDropdown(props) {
  const { ...other } = props;
  let currentYear = new Date().getFullYear();
  let levels = [
    { key: 'Native', text: _l`Native`, value: 'NATIVE' },
    { key: 'Fluent', text: _l`Fluent`, value: 'FLUENT' },
    { key: 'Good', text: _l`Good`, value: 'GOOD' },
    { key: 'Basic', text: _l`Basic`, value: 'BASIC' },
  ];
  return <Dropdown options={levels} selection search {...other} />;
}

export default LevelLanguageDropdown;

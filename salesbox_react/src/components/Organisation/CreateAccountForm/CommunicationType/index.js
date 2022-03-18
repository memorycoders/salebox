/* eslint-disable react/prop-types */
import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import _l from 'lib/i18n';
addTranslations({
  'en-US': {
    None: 'None',
    Headquarter: 'Headquarter',
    Subsidiary: 'Subsidiary',
    department: 'department',
    unit: 'unit',
    general: 'general',
    other: 'other',
    support: 'support',
  },
});

const CommunicationType = (props) => {
  let type = [
    { name: null, text: _l`None` },
    { name: 'EMAIL_HEAD_QUARTER', text: _l`Headquarter` },
    { name: 'EMAIL_SUBSIDIARY', text: _l`Subsidiary` },
    { name: 'EMAIL_DEPARTMENT', text: _l`department` },
    { name: 'EMAIL_UNIT', text: _l`Unit` },
    { name: 'EMAIL_GENERAL', text: _l`General` },
    { name: 'EMAIL_SUPPORT', text: _l`Support` },
    { name: 'EMAIL_OTHER', text: _l`other` },
  ];
  let options = type.map((item) => {
    return {
      key: item.name,
      value: item.name,
      text: _l`${item.text}`,
    };
  });
  return <Dropdown className="type-dropdown" fluid selection options={options} {...props} />;
};

export default CommunicationType;

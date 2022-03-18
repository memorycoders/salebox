/* eslint-disable react/prop-types */
import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import _l from 'lib/i18n';
addTranslations({
  'en-US': {
  },
});

const CommunicationType = (props) => {
  let type = [
    { name: null, text: _l`None` },
    { name: 'EMAIL_HOME', text: _l`Home` },
    { name: 'EMAIL_WORK', text: _l`Work`},
    { name: 'EMAIL_OTHER', text: _l`other` },
  ];
  let options = type.map((item) => {
    return {
      key: item.name,
      value: item.name,
      text: _l`${item.text}`,
    };
  });
  return <Dropdown fluid selection options={options} {...props} />;
};

export default CommunicationType;

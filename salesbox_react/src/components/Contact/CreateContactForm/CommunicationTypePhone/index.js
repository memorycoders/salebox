/* eslint-disable react/prop-types */
import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import _l from 'lib/i18n';
addTranslations({
  'en-US': {
    None: 'None',
    home: 'home',
    'home fax': 'home fax',
    iPhone: 'iPhone',
    main: 'main',
    mobile: 'mobile',
  },
});


const CommunicationType = (props) => {
  let type = [
    { name: null, text: _l`None` },
    { name: 'PHONE_HOME', text:  _l`Home` },
    { name: 'PHONE_WORK', text: _l`Work`},
    { name: 'PHONE_MOBILE', text: _l`Mobile`},
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

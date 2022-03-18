/* eslint-disable react/prop-types */
import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { addNone } from 'lib';
import _l from 'lib/i18n';
import { toLength } from 'lodash';
addTranslations({
  'en-US': {},
});

const UnQualifiedStatus = (props) => {
  let status = [
    { name: 'none', text: _l`Not contacted`, color: 'WHITE', colorCode: 'FFFFFF' },
    { name: 'unqualified', text: _l`Nothing booked`, color: 'yellowUnqualified', colorCode: 'E6D55F' },
    { name: 'qualified', text: _l`Agreed action`, color: 'greenQualified', colorCode: '8CC18F' },
  ];
  let options = status.map((item) => {
    return {
      key: item.name,
      value: item.name,
      text: _l`${item.text}`,
      label: { color: item.color.toLowerCase(), empty: true, circular: true, colorCode: item.colorCode },
    };
  });
  return <Dropdown search fluid selection options={options} onChange={props.onChange} value={props.value} />;
};

export default UnQualifiedStatus;

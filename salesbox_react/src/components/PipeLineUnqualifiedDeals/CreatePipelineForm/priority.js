/* eslint-disable react/prop-types */
import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { addNone } from 'lib';
import _l from 'lib/i18n';
addTranslations({
  'en-US': {},
});

const UnQualifiedPriority = (props) => {
  let priority = [
    { key: null, text: _l`None` },
    { key: 100, text: _l`Highest` },
    { key: 80, text: _l`High` },
    { key: 60, text: _l`Medium` },
    { key: 40, text: _l`Low` },
    { key: 20, text: _l`Lowest` },
  ];
  let options = priority.map((item) => {
    return {
      key: item.key,
      value: item.key,
      text: item.text,
    };
  });
  return (
    <Dropdown
      fluid
      search
      selection
      options={options}
      error={props.error}
      onChange={props.onChange}
      value={props.value || (options && options[0].value)}
      className={props.className}
    />
  );
};

export default UnQualifiedPriority;

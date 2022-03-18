/* eslint-disable react/prop-types */
import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { addNone } from 'lib';
import _l from 'lib/i18n';

import icon from '../../../../../public/icon_ms_teams.png';

const TeamDropDown = (props) => {
  let options = [
    {
      key: null,
      value: null,
      text: _l`None`,
    },
    {
      text: _l`Teams`,
      value: 'teams',
      content: (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{_l`Teams`}</span>
          <img src={icon} width={20} height={20} />
        </div>
      ),
    },
  ];
  return (
    <Dropdown fluid selection options={options} onChange={props.onChange} value={props.value} style={props.style} />
  );
};
export default TeamDropDown;

/* eslint-disable react/jsx-no-bind */
/* eslint-disable babel/no-invalid-this */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Dropdown } from 'semantic-ui-react';
import FuzzySearch from 'fuzzy-search';
import _l from 'lib/i18n';

const UserDropDown = (props) => {
  let dropdown = null;
  const [options, setOptions] = useState(props.options || []);
  const [searchInput, setSearchInput] = useState('');

  const onSearchChange = (event) => {
    const { options } = props;
    const searcher = new FuzzySearch(options, ['text'], {
      caseSensitive: false,
    });
    let result = options;
    console.log('event.target.value', event.target.value);
    if (event.target.value !== 'None' && event.target.value !== 'All') {
      result = searcher.search(event.target.value);
      setOptions(result);
      setSearchInput(event.target.value);
    }
  };

  useEffect(() => {
    setOptions(props.options);
  }, [props.options]);

  const onClick = (event, data) => {
    dropdown.setState({ open: false });
    props.selectUser(event, data);
  };

  return (
    <Dropdown
      selection
      fluid
      search
      ref={(ref) => (dropdown = ref)}
      closeOnChange
      value={props.value}
      text={props.value === 'All' || props.value === 'None' ? props.value : searchInput}
      onSearchChange={onSearchChange}
    >
      <Dropdown.Menu>
        {props.value !== 'None' && (
          <Dropdown.Item
            key={'None'}
            value={'None'}
            onClick={onClick}
            active={props.value === 'None' ? true : false}
          >{_l`None`}</Dropdown.Item>
        )}
        {props.value !== 'All' && (
          <Dropdown.Item key={'All'} value={'All'} onClick={onClick}>
            All
          </Dropdown.Item>
        )}
        {props.value !== 'All'}
        {options.map((user) => {
          if (!user.selected && user.active) {
            return (
              <Dropdown.Item key={user.uuid} value={user.uuid} onClick={onClick}>
                {user.firstName + ' ' + user.lastName}
              </Dropdown.Item>
            );
          }
        })}
        {/* {props.value !== 'All' && <Dropdown.Item disabled>{_l`Deactivated user`}</Dropdown.Item>}
        {options.map((user) => {
          if (!user.selected && !user.active) {
            return (
              <Dropdown.Item key={user.uuid} value={user.uuid} onClick={onClick}>
                {user.firstName + ' ' + user.lastName}
              </Dropdown.Item>
            );
          }
        })} */}
      </Dropdown.Menu>
    </Dropdown>
  );
};
export default UserDropDown;

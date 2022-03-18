import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'semantic-ui-react';
import AddDropdown from '../../AddDropdown/AddDropdown';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import AddNewOptionDropdownModal from '../ResourceModal/AddNewOptionDropdownModal';
import api from 'lib/apiClient';
import { Endpoints } from '../../../Constants';

function LanguageDropdown(props) {
  const { ...other } = props;
  const [list, setList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const refDropdown = useRef(null);
  useEffect(() => {
    fetchList();
  }, []);
  const fetchList = async () => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Resource}/language/listAll`,
        query: {
          languageVersion: localStorage.getItem('language') || 'en'
        }
      });
      if (res) {
        let a = res.data.map((e) => {
          return { key: e.uuid, value: e.uuid, text: e.name };
        });
        setList(a);
      }
    } catch (error) {}
  };
  const [visibleAddNew, setVisibleAddNew] = useState(false);
  const addNew = () => {
    setSearchText(refDropdown?.current?.state.searchInput);
    setVisibleAddNew(true);
  };
  const onClose = () => {
    setVisibleAddNew(false);
    setSearchText('');
  };
  const onDone = async () => {};

  const onAddNewOptionSuccess = (newOption) => {
    setList([...list, { key: newOption.uuid, value: newOption.uuid, text: newOption.name }]);
    props.receiveNewValueFromDropdown(newOption.uuid);
    setVisibleAddNew(false);
  };
  return (
    <>
      <AddDropdown
        onChange={props.onChange}
        value={props.value}
        options={list}
        selection
        search
        addLabel="Add new"
        onClickAdd={addNew}
        {...other}
        ref={refDropdown}
      />
      <AddNewOptionDropdownModal
        onAddNewOptionSuccess={onAddNewOptionSuccess}
        options={list}
        visible={visibleAddNew}
        onClose={onClose}
        type="Language"
        searchText={searchText}
      />
    </>
  );
}

export default LanguageDropdown;

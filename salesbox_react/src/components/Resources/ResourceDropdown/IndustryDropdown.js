import React, { Component, useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import AddDropdown from '../../AddDropdown/AddDropdown';
import AddNewOptionDropdownModal from '../ResourceModal/AddNewOptionDropdownModal';
import api from 'lib/apiClient';
import { Endpoints } from '../../../Constants';

const IndustryDropdown = ({ value, onChange, receiveNewValueFromDropdown, languageVersion = 'en' }) => {
  const [visibleAddNew, setVisibleAddNew] = useState(false);
  const [list, setList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const refDropdown = useRef(null);
  useEffect(() => {
    fetchList();
  }, []);
  const fetchList = async () => {
    try {
      const res = await api.get({
        resource: `${Endpoints.Resource}/industry/listAll`,
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
  const addNew = () => {
    setSearchText(refDropdown?.current?.state.searchInput);
    setVisibleAddNew(true);
  };
  const onClose = () => {
    setVisibleAddNew(false);
    setSearchText('');
  };

  const onAddNewOptionSuccess = (newOption) => {
    setList([...list, { key: newOption.uuid, value: newOption.uuid, text: newOption.name }]);
    receiveNewValueFromDropdown(newOption.uuid);
    setVisibleAddNew(false);
  };
  return (
    <>
      <AddDropdown
        options={list}
        selection
        lazyLoad
        search
        fluid
        addLabel="Add new"
        onClickAdd={addNew}
        onChange={onChange}
        value={value}
        ref={refDropdown}
      />
      <AddNewOptionDropdownModal
        onAddNewOptionSuccess={onAddNewOptionSuccess}
        options={list}
        visible={visibleAddNew}
        onClose={onClose}
        type="Industry"
        searchText={searchText}
      />
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(IndustryDropdown);

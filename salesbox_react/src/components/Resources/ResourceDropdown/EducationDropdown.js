import React, { Component, useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import AddDropdown from '../../AddDropdown/AddDropdown';
import AddNewOptionDropdownModal from '../ResourceModal/AddNewOptionDropdownModal';
import api from 'lib/apiClient';
import { Endpoints } from '../../../Constants';

export const EducationDropdown = (props) => {
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
        resource: `${Endpoints.Resource}/education/listAll`,
        query: {
          languageVersion: localStorage.getItem('language') || 'en'
        }
      });
      if (res) {
        let a = res.data.map((e) => {
          return { key: e.uuid, value: e.uuid, text: e.name, school: e.school };
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
    props.receiveNewValueFromDropdown(newOption.uuid);
    setVisibleAddNew(false);
  };
  return (
    <>
      <AddDropdown
        value={props.value}
        onChange={props.onChange}
        options={list}
        selection
        lazyLoad
        search
        fluid
        addLabel="Add new"
        onClickAdd={addNew}
        ref={refDropdown}
      />
      <AddNewOptionDropdownModal
        onAddNewOptionSuccess={onAddNewOptionSuccess}
        options={list}
        visible={visibleAddNew}
        onClose={onClose}
        type="Education"
        searchText={searchText}
      />
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(EducationDropdown);

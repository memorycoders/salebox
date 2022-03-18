import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import _l from 'lib/i18n';
import css from './ResourceModal.css';
import { Form, FormField, Input } from 'semantic-ui-react';
import { Endpoints } from '../../../Constants';
import api from 'lib/apiClient';

export const AddNewOptionDropdownModal = ({
  visible,
  type,
  onClose,
  onDone,
  options,
  onAddNewOptionSuccess,
  searchText,
}) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState(null);
  const handleOnClose = () => {
    setError(false);
    setValue('');
    onClose();
  };

  useEffect(() => {
    setTimeout(() => {
      if (searchText) {
        setValue(searchText);
      }
    }, 100);
  }, [searchText]);
  const handleOnDone = async () => {
    if (!value) {
      setError(_l`Name is required`);
      return;
    }
    if (options && options.find((e) => e.text.trim() === value.trim())) {
      setError(_l`Name already exist.`);
      return;
    }
    try {
      let url = '';
      switch (type) {
        case 'Industry':
          url = 'industry/create';
          break;
        case 'Employee':
          url = 'employer/create';
          break;
        case 'Education':
          url = 'education/create';
          break;
        case 'Language':
          url = 'language/create';
          break;
        case 'Certificate':
          url = 'certificate/create';
          break;
      }
      const res = await api.post({
        resource: `${Endpoints.Resource}/${url}`,
        data: {
          name: value,
          languageVersion: localStorage.getItem('language') || 'en'
        },
      });
      if (res) {
        onAddNewOptionSuccess(res);
        setError(false);
        setValue('');
      }
    } catch (error) {}
    // onDone();
  };

  let title = '';
  switch (type) {
    case 'Industry':
      title = _l`Add industry`;
      break;
    case 'Employee':
      title = _l`Add employer`;
      break;
    case 'Education':
      title = _l`Add education`;
      break;
    case 'Language':
      title = _l`Add language`;
      break;
    case 'Certificate':
      title = _l`Add certificate / course`;
      break;
  }

  return (
    <ModalCommon
      visible={visible}
      title={title}
      onClose={handleOnClose}
      onDone={handleOnDone}
      size="mini"
      scrolling={false}
      description={false}
    >
      <Form style={{paddingLeft: '0.5em'}}>
        <FormField>
          <div className={css.rowForm}>
            <div style={{ display: 'flex', alignItems: 'center', width: 100 }}>
              <p className={css.labelMini}>{_l`Name`}</p>
              <span className={css.requiredField} style={{ left: 40 }}>
                *
              </span>
            </div>

            <div className={css.inputNewOption}>
              <Input
                className={css.inputForm}
                fluid
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError(false);
                }}
                error={error !== null}
              />
              {error !== null && <p className={css.errorMessage}>{error}</p>}
            </div>
          </div>
        </FormField>
      </Form>
    </ModalCommon>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AddNewOptionDropdownModal);

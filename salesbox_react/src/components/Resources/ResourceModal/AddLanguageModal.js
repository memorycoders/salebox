import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { clearHighlightAction } from '../../Overview/overview.actions';
import _l from 'lib/i18n';
import { Form, FormField } from 'semantic-ui-react';
import css from './ResourceModal.css';
import YearDropdown from '../ResourceDropdown/YearDropdown';
import LevelLanguageDropdown from '../ResourceDropdown/LevalLanguageDropdown';
import LanguageDropdown from '../ResourceDropdown/LanguageDropdown';

export const AddLanguageModal = ({ visible, onClose, onDone, objectUpdate }) => {
  const initData = { languageId: null, level: null };
  const [data, setData] = useState(initData);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (visible === true && objectUpdate !== null) {
      setTimeout(() => {
        console.log('-------------------Vao day');
        setData({
          languageId: objectUpdate.languageId,
          level: objectUpdate.level,
        });
      }, 100);
    }
  }, [objectUpdate, visible]);
  const handleOnDone = () => {
    if (!data.languageId) {
      setError(true);
      return;
    }
    // if(startYear > endYear) {
    //   setError("Start year cannot be ")
    // }
    setError(false);
    onDone(data, objectUpdate ? objectUpdate.resourceLanguageId : null);
    setTimeout(() => {
      setData(initData);
    }, 500);
  };

  const receiveNewValueFromDropdown = (uuid) => {
    console.log('New value:', uuid);
    setData({ ...data, languageId: uuid });
  };
  return (
    <ModalCommon
      visible={visible}
      title={objectUpdate?.resourceLanguageId ? _l`Update language` : _l`Add language`}
      onClose={() => {
        onClose();
        setError(false);
        setData(initData);
      }}
      onDone={handleOnDone}
      size="tiny"
      scrolling={false}
      description={false}
    >
      <Form style={{ paddingLeft: '0.5em' }}>
        <FormField style={{ marginBottom: 20 }}>
          <div className={css.rowForm}>
            <div style={{ display: 'flex', alignItems: 'center', width: 125 }}>
              <p className={css.label}>{_l`Language`}</p>
              <span className={css.requiredField}>*</span>
            </div>

            <div style={{ width: '103%' }}>
              <LanguageDropdown
                fluid
                receiveNewValueFromDropdown={receiveNewValueFromDropdown}
                value={data.languageId}
                onChange={(e, { value }) => {
                  setData({ ...data, languageId: value });
                  setError(false);
                }}
              />
              {error && <p className={css.errorMessage}>{_l`Language is required`}</p>}
            </div>
          </div>
        </FormField>
        <FormField>
          <div className={css.rowForm}>
            <div style={{ display: 'flex', alignItems: 'center', width: 125 }}>
              <p className={css.label}>{_l`Level`}</p>
            </div>
            <LevelLanguageDropdown
              fluid
              value={data.level}
              onChange={(e, { value }) => setData({ ...data, level: value })}
            />
          </div>
        </FormField>
      </Form>
    </ModalCommon>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = { clearHighlightAction };

export default connect(mapStateToProps, mapDispatchToProps)(AddLanguageModal);

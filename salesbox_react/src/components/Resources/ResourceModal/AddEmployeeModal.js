import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { clearHighlightAction } from '../../Overview/overview.actions';
import _l from 'lib/i18n';
import { Form, FormField } from 'semantic-ui-react';
import EmployeeDropdown from '../ResourceDropdown/EmployeeDropdown';
import css from './ResourceModal.css';
import YearDropdown from '../ResourceDropdown/YearDropdown';

export const AddEmployeeModal = ({ visible, onClose, onDone, objectUpdate }) => {
  const initData = {
    employerId: null,
    startYear: new Date().getFullYear(),
    endYear: new Date().getFullYear(),
  };
  const [data, setData] = useState(initData);
  const [error, setError] = useState(false);
  const [errorDate, setErrorDate] = useState(false);
  useEffect(() => {
    if (visible === true && objectUpdate !== null) {
      setTimeout(() => {
        console.log('-------------------Vao day');
        setData({
          employerId: objectUpdate.employerId,
          startYear: objectUpdate?.startYear || new Date().getFullYear(),
          endYear: objectUpdate?.endYear || new Date().getFullYear(),
        });
      }, 100);
    }
  }, [objectUpdate, visible]);

  const handleOnDone = () => {
    if (!data.employerId) {
      setError(true);
      return;
    }
    if (data.startYear > data.endYear) {
      setErrorDate(true);
      return;
    }
    setError(false);
    setErrorDate(false);
    onDone(data, objectUpdate ? objectUpdate.resourceEmployerId : null);
    setTimeout(() => {
      setData(initData);
    }, 500);
  };

  const receiveNewValueFromDropdown = (uuid) => {
    console.log('New value:', uuid);
    setData({ ...data, employerId: uuid });
  };
  return (
    <ModalCommon
      visible={visible}
      title={objectUpdate && objectUpdate.resourceEmployerId ? _l`Update employer` : _l`Add employer`}
      // onClose={onClose}
      onClose={() => {
        onClose();
        setError(false);
        setErrorDate(false);
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
              <p className={css.label}>{_l`Employer`}</p>
              <span className={css.requiredField}>*</span>
            </div>

            <div style={{ width: '103%' }}>
              <EmployeeDropdown
                value={data.employerId}
                receiveNewValueFromDropdown={receiveNewValueFromDropdown}
                onChange={(e, { value }) => {
                  setData({ ...data, employerId: value });
                  setError(false);
                }}
              />
              {error && <p className={css.errorMessage}>{_l`Employer is required`}</p>}
            </div>
          </div>
        </FormField>
        <FormField style={{ marginBottom: 20 }}>
          <div className={css.rowForm}>
            <div style={{ display: 'flex', alignItems: 'center', width: 125 }}>
              <p className={css.label}>{_l`Start year`}</p>
            </div>
            <div style={{ width: '103%' }}>
              <YearDropdown
                fluid
                value={data.startYear}
                onChange={(e, { value }) => {
                  setData({ ...data, startYear: value });
                  setErrorDate(false);
                }}
              />
              {errorDate && <p className={css.errorMessage}>{_l`End date cannot be before start date`}</p>}
            </div>
          </div>
        </FormField>
        <FormField>
          <div className={css.rowForm}>
            <div style={{ display: 'flex', alignItems: 'center', width: 125 }}>
              <p className={css.label}>{_l`End year`}</p>
            </div>
            <YearDropdown
              fluid
              value={data.endYear}
              onChange={(e, { value }) => {
                setData({ ...data, endYear: value });
                setErrorDate(false);
              }}
            />
          </div>
        </FormField>
      </Form>
    </ModalCommon>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = { clearHighlightAction };

export default connect(mapStateToProps, mapDispatchToProps)(AddEmployeeModal);

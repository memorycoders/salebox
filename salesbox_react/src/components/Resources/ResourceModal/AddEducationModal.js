import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { clearHighlightAction } from '../../Overview/overview.actions';
import _l from 'lib/i18n';
import { Form, FormField, Input } from 'semantic-ui-react';
import EducationDropdown from '../ResourceDropdown/EducationDropdown';
import css from './ResourceModal.css';
import YearDropdown from '../ResourceDropdown/YearDropdown';

export const AddEducationModal = ({ visible, onClose, onDone, objectUpdate }) => {
  const initData = {
    school: null,
    educationId: null,
    startYear: new Date().getFullYear(),
    endYear: new Date().getFullYear(),
  };
  const [data, setData] = useState(initData);
  const [error, setError] = useState(false);
  const [errorSchool, setErrorSchool] = useState(false);
  const [errorDate, setErrorDate] = useState(false);

  useEffect(() => {
    if (visible === true && objectUpdate !== null) {
      setTimeout(() => {
        console.log('-------------------Vao day');
        setData({
          school: objectUpdate.school,
          educationId: objectUpdate.educationId,
          startYear: objectUpdate?.startYear || new Date().getFullYear(),
          endYear: objectUpdate?.endYear || new Date().getFullYear(),
        });
      }, 100);
    }
  }, [objectUpdate, visible]);

  const handleOnDone = () => {
    if (!data.school) {
      setErrorSchool(true);
      return;
    }
    if (!data.educationId) {
      setError(true);
      return;
    }
    if (data.startYear > data.endYear) {
      setErrorDate(true);
      return;
    }
    setErrorSchool(false);
    setError(false);
    setErrorDate(false);
    onDone(data, objectUpdate ? objectUpdate.resourceEducationId : null);
    setTimeout(() => {
      setData(initData);
    }, 500);
  };

  const receiveNewValueFromDropdown = (uuid) => {
    setData({ ...data, educationId: uuid });
  };
  return (
    <ModalCommon
      visible={visible}
      title={objectUpdate && objectUpdate.resourceEducationId ? _l`Update education` : _l`Add education`}
      onClose={() => {
        onClose();
        setErrorSchool(false);
        setError(false);
        setErrorDate(false);
        setData(initData);
      }}
      onDone={handleOnDone}
      size="tiny"
      scrolling={false}p
      description={false}
    >
      <Form style={{ paddingLeft: '0.5em' }}>
        <FormField style={{ marginBottom: 20 }}>
          <div className={css.rowForm}>
            <div style={{ display: 'flex', alignItems: 'center', width: 125 }}>
              <p className={css.label}>{_l`School`}</p>
              <span className={css.requiredField}>*</span>
            </div>

            <div style={{ width: '103%' }}>
              <Input
                className={css.inputForm}
                value={data.school}
                onChange={(e) => {
                  setData({ ...data, school: e.target.value });
                  setErrorSchool(false);
                }}
              />
              {errorSchool && <p className={css.errorMessage}>{_l`School is required`}</p>}
            </div>
          </div>
        </FormField>
        <FormField style={{ marginBottom: 20 }}>
          <div className={css.rowForm}>
            <div style={{ display: 'flex', alignItems: 'center', width: 125 }}>
              <p className={css.label}>{_l`Education`}</p>
              <span className={css.requiredField}>*</span>
            </div>

            <div style={{ width: '103%' }}>
              <EducationDropdown
                receiveNewValueFromDropdown={receiveNewValueFromDropdown}
                value={data.educationId}
                onChange={(e, { value }) => {
                  setData({ ...data, educationId: value });
                  setError(false);
                }}
              />
              {error && <p className={css.errorMessage}>{_l`Education is required`}</p>}
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
              onChange={(e, { value }) => setData({ ...data, endYear: value })}
            />
          </div>
        </FormField>
      </Form>
    </ModalCommon>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = { clearHighlightAction };

export default connect(mapStateToProps, mapDispatchToProps)(AddEducationModal);

import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { clearHighlightAction } from '../../Overview/overview.actions';
import _l from 'lib/i18n';
import { Form, FormField } from 'semantic-ui-react';
import IndustryDropdown from '../ResourceDropdown/IndustryDropdown';
import css from './ResourceModal.css';
import YearDropdown from '../ResourceDropdown/YearDropdown';
import api from 'lib/apiClient';
import { Endpoints } from '../../../Constants';

export const AddIndustryModal = ({ visible, onClose, listTag, onDone, objectUpdate }) => {
  const initData = {
    industryId: null,
    year: null,
  };
  const [data, setData] = useState(initData);

  const [error, setError] = useState(false);

  useEffect(() => {
    if (objectUpdate && visible === true) {
      setTimeout(() => {
        console.log('COME HÊRERERER:', objectUpdate);
        setData({ industryId: objectUpdate.industryId, year: objectUpdate?.year });
      }, 100);
    }
  }, [objectUpdate]);

  const handleOnDone = () => {
    if (!data.industryId) {
      setError(true);
      return;
    }
    setError(false);
    onDone(data, objectUpdate ? objectUpdate.resourceIndustryId : null);
    setTimeout(() => {
      setData(initData);
    }, 500);
  };

  const receiveNewValueFromDropdown = (uuid) => {
    console.log('New value:', uuid);
    setData({ ...data, industryId: uuid });
  };
  return (
    <ModalCommon
      visible={visible}
      title={objectUpdate && objectUpdate.resourceIndustryId ? _l`Update industry` : _l`Add industry`}
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
              <p className={css.label}>{_l`Industry`}</p>
              <span className={css.requiredField}>*</span>
            </div>

            <div style={{ width: '103%' }}>
              <IndustryDropdown
                value={data.industryId}
                receiveNewValueFromDropdown={receiveNewValueFromDropdown}
                onChange={(e, { value }) => {
                  setData({ ...data, industryId: value });
                  setError(false);
                }}
              />
              {error && <p className={css.errorMessage}>Industry is required</p>}
            </div>
          </div>
        </FormField>
        <FormField>
          <div className={css.rowForm}>
            <div style={{ display: 'flex', alignItems: 'center', width: 125 }}>
              <p className={css.label}>{_l`Year`}</p>
            </div>
            <YearDropdown fluid value={data.year} onChange={(e, { value }) => setData({ ...data, year: value })} />
          </div>
        </FormField>
      </Form>
    </ModalCommon>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = { clearHighlightAction };

export default connect(mapStateToProps, mapDispatchToProps)(AddIndustryModal);

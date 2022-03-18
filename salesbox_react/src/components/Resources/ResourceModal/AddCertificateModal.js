import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import { clearHighlightAction } from '../../Overview/overview.actions';
import _l from 'lib/i18n';
import { Form, FormField } from 'semantic-ui-react';
import css from './ResourceModal.css';
import YearDropdown from '../ResourceDropdown/YearDropdown';
import CertificateDropdown from '../ResourceDropdown/CertificateDropdown';

export const AddCertificateModal = ({ visible, onClose, onDone, objectUpdate }) => {
  const initData = {
    certificateId: null,
    year: new Date().getFullYear(),
  };
  const [data, setData] = useState(initData);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (visible === true && objectUpdate !== null) {
      setTimeout(() => {
        console.log('-------------------Vao day');
        setData({
          certificateId: objectUpdate.certificateId,
          year: objectUpdate.year || new Date().getFullYear(),
        });
      }, 100);
    }
  }, [objectUpdate, visible]);

  const handleOnDone = () => {
    if (!data.certificateId) {
      setError(true);
      return;
    }
    // if(startYear > endYear) {
    //   setError("Start year cannot be ")
    // }
    setError(false);
    onDone(data, objectUpdate ? objectUpdate.resourceCertificateId : null);
    setTimeout(() => {
      setData(initData);
    }, 500);
  };

  const receiveNewValueFromDropdown = (uuid) => {
    console.log('New value:', uuid);
    setData({ ...data, certificateId: uuid });
  };
  return (
    <ModalCommon
      visible={visible}
      title={objectUpdate?.resourceCertificateId ? _l`Update certificate / course` : _l`Add certificate / course`}
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
              <p className={css.label}>{_l`Certificates / courses`}</p>
              <span className={css.requiredField} style={{ left: 118 }}>
                *
              </span>
            </div>

            <div style={{ width: '103%' }}>
              <CertificateDropdown
                receiveNewValueFromDropdown={receiveNewValueFromDropdown}
                value={data.certificateId}
                onChange={(e, { value }) => setData({ ...data, certificateId: value })}
              />
              {error && <p className={css.errorMessage}>{_l`Certificate / course is required`}</p>}
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

export default connect(mapStateToProps, mapDispatchToProps)(AddCertificateModal);

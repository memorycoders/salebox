//@flow
import React, { useState, useEffect } from 'react';
import _l from 'lib/i18n';
import { compose } from 'recompose';
import { Input, Form } from 'semantic-ui-react';
import ModalCommon from '../../ModalCommon/ModalCommon';
import css from './CreateChart.css';

const AddNameChart = ({ visible, setVisiableAddName, setCreateDone, oldName, setFilters }) => {

  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setName(oldName)
  }, [oldName])

  return (
    <ModalCommon
      title={_l`Add name`}
      cancelLabel={_l`No`}
      okLabel={_l`Yes`}
      size="small"
      visible={visible}
      onDone={() => {
        if (!name) {
          let newErrors = { ...errors };
          newErrors.name = _l`Name is required`;
          setErrors(newErrors)
          return;
        }
        setCreateDone(name);
        setName('');
        setVisiableAddName(false);
        setFilters([])
      }}
      onClose={() => {
        setVisiableAddName(false)
      }}
      paddingAsHeader={true}
    >
      <div style={{ display: 'flex' }} className="qualified-add-form">
        <Form className="position-unset" style={{ width: '100%' }}>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label">{_l`Name`} <span className={css.required}>*</span></div>
            <div className="dropdown-wrapper" width={8}>
              <Input  style={{ width: '100%', height: 28}} value={name} onChange={event => setName(event.target.value)}/>
              <span className="form-errors">{errors.name}</span>
            </div>
          </Form.Group>
        </Form>

      </div>
    </ModalCommon>
  );
};

export default compose()(AddNameChart);

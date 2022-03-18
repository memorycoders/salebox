/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import _l from 'lib/i18n';
import { Form, Input } from 'semantic-ui-react';
import cssForm from '../../../../Task/TaskForm/TaskForm.css';

addTranslations({
  'en-US': {
    'Hours/quote': 'Hours/quote',
    'Hours/contract': 'Hours/contract',
  },
});

const AddSaleForm = (props) => {
  const { errors, data } = props;
  return (
    <div style={{ display: 'flex' }} className="qualified-add-form">
      <Form className={cssForm.normalForm}>
        <Form.Group className="unqualified-fields">
          <div className="unqualified-label">
            {_l`Name`}
            <span className="required">*</span>
          </div>
          <div className="dropdown-wrapper">
            <Input value={data.name || ''} onChange={(e, data) => props.onChange('name', data.value)} />
            <span className="form-errors">{errors.name || null}</span>
          </div>
        </Form.Group>
        {/* <Form.Group className="unqualified-fields">
          <div className="unqualified-label">
            {_l`Hours/quote`}
            <span className="required">*</span>
          </div>
          <div className="dropdown-wrapper">
            <Input
              type={'number'}
              value={data.hoursPerQuote || ''}
              onChange={(e, data) => props.onChange('hoursPerQuote', data.value)}
            />
            <span className="form-errors">{errors.hoursPerQuote || null}</span>
          </div>
        </Form.Group>
        <Form.Group className="unqualified-fields">
          <div className="unqualified-label">
            {_l`Hours/contract`}
            <span className="required">*</span>
          </div>
          <div className="dropdown-wrapper">
            <Input
              type={'number'}
              value={data.hoursPerContract || ''}
              onChange={(e, data) => props.onChange('hoursPerContract', data.value)}
            />
            <span className="form-errors">{errors.hoursPerContract || null}</span>
          </div>
        </Form.Group> */}
      </Form>
    </div>
  );
};
export default AddSaleForm;

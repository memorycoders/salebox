/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React, {useState} from 'react';
import _l from 'lib/i18n';
import {Form, Input, TextArea} from 'semantic-ui-react';
import cssForm from '../../../../Task/TaskForm/TaskForm.css';
import DiscProfileDropdown from "../../../../Contact/CreateContactForm/DiscProfileDropdown";

const AddForm = (props) => {
  const { errors, data } = props;

  const maxChar = props.maxChar || 140;
  const [charLeft, setCharLeft] = useState(maxChar);

  const _handleNoteChange = (e, {value}) => {
    const charLeftValue = maxChar - value.length;
    setCharLeft(charLeftValue);
    if (charLeft < 0) return false;
    props.onChange('description', value)
  };

  return (
    <div style={{ display: 'flex' }} className="qualified-add-form custom-width-label">
      <Form className={cssForm.normalForm}>
        <Form.Group className="unqualified-fields">
          <div className="unqualified-label" style={{width:'120px !important'}}>
            {_l`Name`}
            <span className="required">*</span>
          </div>
          <div className="dropdown-wrapper">
            <Input value={data.name || ''} onChange={(e, dataVal) => props.onChange('name', dataVal.value)} />
            <span className="form-errors">{errors.name || null}</span>
          </div>
        </Form.Group>
        {props.isFocus &&<>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label" style={{width:'120px !important'}}>
              {_l`DISC Recommended`}
              {/*<span className="required">*</span>*/}
            </div>
            <div className="dropdown-wrapper">
              <DiscProfileDropdown value={data.discProfile} onChange={(event, { value }) => {
                props.onChange('discProfile', value);
              }} />
              <span className="form-errors">{null}</span>
              <span className="form-errors">{errors.discProfile || null}</span>
            </div>
          </Form.Group>
          <Form.Group className="unqualified-fields">
            <div className="unqualified-label" style={{width:'120px !important'}}>
              {_l`Description`}
              {/*<span className="required">*</span>*/}
            </div>
            <div className="dropdown-wrapper">
              <TextArea
                size="small"
                rows={5}
                maxLength={maxChar}
                onChange={_handleNoteChange}
                value={data.description}
                className={errors && errors.description ? 'unqualified-area error' : 'unqualified-area'}
              />
              <span className={errors && errors.description ? 'span-charLeft-error' : 'span-charLeft'} style={{bottom: 20}}>
                {charLeft}
              </span>
              <span className="form-errors">{errors.description || null}</span>
            </div>
          </Form.Group>
        </>
        }
      </Form>
    </div>
  );
};
export default AddForm;

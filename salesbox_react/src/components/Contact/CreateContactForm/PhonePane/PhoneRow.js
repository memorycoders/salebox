/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import { Form, Input, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { isValidPhone } from 'lib';
import _l from 'lib/i18n';
import CommunicationTypeDropdown from '../CommunicationTypePhone';
import { removePhone, makePhoneMain, updatePhone } from '../../contact.actions';
import './styles.less';
import { calculatingPositionMenuDropdown } from '../../../../Constants';
import css from '../PhonePane/PhonePane.css';
import cx from 'classnames';
const PhoneRow = ({ phone, removePhone, formKey, makePhoneMain, updatePhone }) => {
  const handleTypeChange = (e, { value: type }) => {
    updatePhone(formKey, phone.uuid, {
      type,
    });
  };

  const handleEmailChange = (e, { value }) => {
    updatePhone(formKey, phone.uuid, {
      value,
    });
  };

  const isModifierKey = (event) => {
    const key = event.keyCode;
    return (
      event.shiftKey === true ||
      key === 35 ||
      key === 36 || // Allow Shift, Home, End
      key === 8 ||
      key === 9 ||
      key === 13 ||
      key === 46 || // Allow Backspace, Tab, Enter, Delete
      (key > 36 && key < 41) || // Allow left, up, right, down
      // Allow Ctrl/Command + A,C,V,X,Z
      ((event.ctrlKey === true || event.metaKey === true) &&
        (key === 65 || key === 67 || key === 86 || key === 88 || key === 90))
    );
  };

  const isNumericInput = (event) => {
    const key = event.keyCode;
    return (
      (key >= 48 && key <= 57) || // Allow number line
      (key >= 96 && key <= 105) // Allow number pad
    );
  };
  const onKeyDown = (e) => {
    if (!isNumericInput(e) && !isModifierKey(event)) {
      event.preventDefault();
    }
  };
  let _dropdownId = `CreateContactPhoneCommunicationType-${phone.uuid}`;
  return (
    <Form className="email-row position-unset" key={phone.uuid}>
      <Form.Group className="account-fields">
        <div className="account-field-label">
          {_l`Default`}
          <div
            className={phone.main ? 'default-done' : 'default-notDone'}
            onClick={() => makePhoneMain(formKey, phone.uuid)}
          >
            <div />
          </div>
        </div>
        <div className="email-field-type">
          <CommunicationTypeDropdown
            className={cx('position-clear', 'type-dropdown')}
            id={_dropdownId}
            onClick={() => calculatingPositionMenuDropdown(_dropdownId)}
            value={phone.type}
            onChange={handleTypeChange}
          />
        </div>
        <div className="email-field-input">
          <Input value={phone.value} onChange={handleEmailChange} onKeyDown={onKeyDown} />
        </div>
        {/* <div className="email-delete"> */}
        {/* <div className="default-done" onClick={() => removePhone(formKey, phone.uuid)}> */}
        <div className={css.type}>
          <Button
            onClick={() => removePhone(formKey, phone.uuid)}
            className={css.deleteButton}
            icon="delete"
            size="mini"
          />
        </div>
        <div />
        {/* </div> */}
        {/* </div> */}
      </Form.Group>
    </Form>
  );
};

export default connect(null, { removePhone, makePhoneMain, updatePhone })(PhoneRow);

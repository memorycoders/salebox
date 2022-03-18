/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import { Form, Input, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { isValidPhone } from 'lib';
import _l from 'lib/i18n';
import CommunicationTypeDropdown from '../../../Organisation/CreateAccountForm/CommunicationTypePhone';
import './styles.css';
import { calculatingPositionMenuDropdown } from '../../../../Constants';
import cx from 'classnames';
import css from '../../../Contact/CreateContactForm/PhonePane/PhonePane.css';
import { removePhone, makePhoneMain, updatePhone } from '../../settings.actions';
import { Grid } from 'semantic-ui-react';
import localCss from '../CompanyInfoPane/CompanyInfoPane.css';

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
  let _dropdownId = `PhoneCommunicationTypeDropdown-${phone.uuid}`;
  return (
    <Grid verticalAlign="middle" style={{ marginTop: 0 }}>
      <Grid.Row style={{ padding: '2px 0 15px 0' }}>
        <Grid.Column width={16} verticalAlign="middle">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* <CommunicationTypeDropdown
              style={{ marginRight: '5px' }}
              className={cx('position-clear', 'type-dropdown')}
              id={_dropdownId}
              onClick={() => calculatingPositionMenuDropdown(_dropdownId)}
              value={phone.type}
              onChange={handleTypeChange}
            /> */}
            <Input
              fluid
              style={{ minWidth: '100%' }}
              value={phone.value}
              onChange={handleEmailChange}
              onKeyDown={onKeyDown}
            />
            {/* <Button
              onClick={() => removePhone(formKey, phone.uuid)}
              className={css.deleteButton}
              icon="delete"
              size="mini"
            /> */}
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default connect(null, { removePhone, makePhoneMain, updatePhone })(PhoneRow);

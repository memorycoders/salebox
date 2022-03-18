/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import { Form, Input, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { isEmail } from 'lib';
import _l from 'lib/i18n';
import CommunicationTypeDropdown from '../CommunicationType';
import { removeEmail, makeEmailMain, updateEmail } from '../../organisation.actions';
import './styles.less';
import { calculatingPositionMenuDropdown } from '../../../../Constants';
import cx from 'classnames';
import css from '../../../Contact/CreateContactForm/PhonePane/PhonePane.css';

addTranslations({
  'en-US': {
    'Email is invalid': 'Email is invalid',
  },
});

const EmailRow = ({ email, removeEmail, formKey, makeEmailMain, updateEmail, errors }) => {
  const handleTypeChange = (e, { value: type }) => {
    updateEmail(formKey, email.uuid, {
      type,
    });
  };

  const handleEmailChange = (e, { value }) => {
    updateEmail(formKey, email.uuid, {
      value,
    });
  };

  const isError = () => {
    const { emails = [] } = errors;
    const current = emails.find((e) => e.uuid === email.uuid);
    return current ? true : false;
  };
  let _dropdownId =  `CommunicationTypeDropdown-${email.uuid}`
  return (
    <Form className="email-row position-unset" key={email.uuid}>
      <Form.Group className="account-fields">
        <div className="account-field-label">
          {_l`Default`}
          <div
            className={email.main ? 'default-done' : 'default-notDone'}
            onClick={() => makeEmailMain(formKey, email.uuid)}
          >
            <div />
          </div>
        </div>
        <div className="email-field-type">
          <CommunicationTypeDropdown id={_dropdownId} className={cx("position-clear", 'type-dropdown')} onClick={() => calculatingPositionMenuDropdown(_dropdownId)} value={email.type} onChange={handleTypeChange} />
        </div>
        <div className="email-field-input">
          <Input value={email.value} error={isError()} onChange={handleEmailChange} />
          {isError() && <span className="form-errors">{_l`Email is invalid`}</span>}
        </div>
         {/* <div className="email-delete"> */}
          {/* <div className="default-done" onClick={() => removePhone(formKey, phone.uuid)}> */}
          <div className={css.type}>
            <Button onClick={() => removeEmail(formKey, email.uuid)} className={css.deleteButton} icon="delete" size="mini" />
          </div>
            <div />
          {/* </div> */}
        {/* </div> */}
      </Form.Group>
    </Form>
  );
};

export default connect(
  (state) => ({
    errors: state.entities.organisation.__ERRORS,
  }),
  { removeEmail, makeEmailMain, updateEmail }
)(EmailRow);

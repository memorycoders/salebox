/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React from 'react';
import { Form, Input, Button, Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { isEmail } from 'lib';
import _l from 'lib/i18n';
import CommunicationTypeDropdown from '../../../Organisation/CreateAccountForm/CommunicationType';
import './styles.less';
import { calculatingPositionMenuDropdown } from '../../../../Constants';
import cx from 'classnames';
import css from '../../../Contact/CreateContactForm/PhonePane/PhonePane.css';
import { removeEmail, makeEmailMain, updateEmail } from '../../settings.actions';
import localCss from '../CompanyInfoPane/CompanyInfoPane.css';

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
  let _dropdownId = `CommunicationTypeDropdown-${email.uuid}`;
  return (
    <Grid verticalAlign="middle" style={{ marginTop: 0 }}>
      <Grid.Row style={{ padding: '2px 0 15px 0' }}>
        <Grid.Column width={16}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* <CommunicationTypeDropdown
              disabled
              style={{ marginRight: '5px' }}
              id={_dropdownId}
              className={cx('position-clear', 'type-dropdown')}
              onClick={() => calculatingPositionMenuDropdown(_dropdownId)}
              value={email.type}
              onChange={handleTypeChange}
            /> */}
            <Input
              disabled
              fluid
              style={{ minWidth: '100%' }}
              value={email.value}
              error={isError()}
              onChange={handleEmailChange}
            />
            {isError() && <span className="form-errors">{_l`Email is invalid`}</span>}
            {/* <Button
              onClick={() => removeEmail(formKey, email.uuid)}
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

export default connect(
  (state) => ({
    errors: state.entities.organisation.__ERRORS,
  }),
  { removeEmail, makeEmailMain, updateEmail }
)(EmailRow);

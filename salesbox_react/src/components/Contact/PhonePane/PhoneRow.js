// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { Input, Dropdown, Button, Popup } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import * as ContactActions from 'components/Contact/contact.actions';
import { isValidPhone } from 'lib';
import { getPhoneOptions } from 'lib/common';
import css from '../Row.css';

type PropsT = {
  phone: {
    uuid: string,
    type: string,
    value: string,
    main: boolean,
  },
  phoneOptions: Array<{}>,
  removePhone: () => void,
  makePhoneMain: () => void,
  handlePhoneChange: (event, { value: string }) => void,
  handleTypeChange: (event, { value: string }) => void,
};

addTranslations({
  'en-US': {
    'Make default': 'Make default',
    'Select type': 'Select type',
  },
});

const PhoneRow = ({
  handlePhoneChange,
  handleTypeChange,
  removePhone,
  makePhoneMain,
  phoneOptions,
  phone: { uuid, type, value, main },
}: PropsT) => {
  return (
    <div key={uuid} className={css.row}>
      <div className={css.iconButton}>
        {main && <Button icon="check" color="green" disabled size="mini" />}
        {!main && (
          <Popup
            size="tiny"
            inverted
            trigger={<Button icon="check" basic onClick={makePhoneMain} size="mini" />}
            content={_l`Make default`}
          />
        )}
      </div>
      <div className={css.type}>
        <Dropdown
          size="mini"
          value={type}
          placeholder={_l`Select type`}
          search
          selection
          options={phoneOptions}
          fluid
          onChange={handleTypeChange}
          className='type-dropdown'

        />
      </div>
      <div className={css.input}>
        <Input value={value} error={!isValidPhone(value)} fluid onChange={handlePhoneChange} />
      </div>
      <div className={css.deleteButton}>
        <Button icon="remove" onClick={removePhone} size="mini" />
      </div>
    </div>
  );
};

export default compose(
  connect(
    (state) => ({
      phoneOptions: getPhoneOptions(state),
    }),
    {
      removePhone: ContactActions.removePhone,
      makePhoneMain: ContactActions.makePhoneMain,
      updatePhone: ContactActions.updatePhone,
    }
  ),
  withHandlers({
    removePhone: ({ removePhone, phone, contactId }) => () => {
      removePhone(contactId, phone.uuid);
    },
    makePhoneMain: ({ makePhoneMain, phone, contactId }) => () => {
      makePhoneMain(contactId, phone.uuid);
    },
    handlePhoneChange: ({ updatePhone, phone, contactId }) => (event, { value }) => {
      updatePhone(contactId, phone.uuid, {
        value,
      });
    },
    handleTypeChange: ({ updatePhone, phone, contactId }) => (event, { value: type }) => {
      updatePhone(contactId, phone.uuid, {
        type,
      });
    },
  })
)(PhoneRow);

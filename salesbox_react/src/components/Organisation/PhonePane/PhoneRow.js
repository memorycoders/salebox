// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { Input, Dropdown, Button, Popup } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import * as OrganisationActions from 'components/Organisation/organisation.actions';
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
      removePhone: OrganisationActions.removePhone,
      makePhoneMain: OrganisationActions.makePhoneMain,
      updatePhone: OrganisationActions.updatePhone,
    }
  ),
  withHandlers({
    removePhone: ({ removePhone, phone, organisationId }) => () => {
      removePhone(organisationId, phone.uuid);
    },
    makePhoneMain: ({ makePhoneMain, phone, organisationId }) => () => {
      makePhoneMain(organisationId, phone.uuid);
    },
    handlePhoneChange: ({ updatePhone, phone, organisationId }) => (event, { value }) => {
      updatePhone(organisationId, phone.uuid, {
        value,
      });
    },
    handleTypeChange: ({ updatePhone, phone, organisationId }) => (event, { value: type }) => {
      updatePhone(organisationId, phone.uuid, {
        type,
      });
    },
  })
)(PhoneRow);

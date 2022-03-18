// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { Input, Dropdown, Button, Popup } from 'semantic-ui-react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import * as OrganisationActions from 'components/Organisation/organisation.actions';
import { isEmail } from 'lib';
import { getEmailOptions } from 'lib/common';
import css from '../Row.css';

type PropsT = {
  email: {
    uuid: string,
    type: string,
    value: string,
    main: boolean,
  },
  emailOptions: Array<{}>,
  removeEmail: () => void,
  makeEmailMain: () => void,
  handleEmailChange: (event, { value: string }) => void,
  handleTypeChange: (event, { value: string }) => void,
};

addTranslations({
  'en-US': {
    'Make default': 'Make default',
    'Select type': 'Select type',
  },
});

const EmailRow = ({
  handleEmailChange,
  handleTypeChange,
  removeEmail,
  makeEmailMain,
  emailOptions,
  email: { uuid, type, value, main },
}: PropsT) => {
  return (
    <div key={uuid} className={css.row}>
      <div className={css.iconButton}>
        {main && <Button icon="check" color="green" disabled size="mini" />}
        {!main && (
          <Popup
            size="tiny"
            inverted
            trigger={<Button icon="check" basic onClick={makeEmailMain} size="mini" />}
            content={_l`Make default`}
          />
        )}
      </div>
      <div className={css.type}>
        <Dropdown
          value={type}
          placeholder={_l`Select type`}
          search
          selection
          options={emailOptions}
          fluid
          onChange={handleTypeChange}
          className='type-dropdown'
        />
      </div>
      <div className={css.input}>
        <Input value={value} error={!isEmail(value)} fluid onChange={handleEmailChange} />
      </div>
      <div className={css.deleteButton}>
        <Button icon="remove" onClick={removeEmail} size="mini" />
      </div>
    </div>
  );
};

export default compose(
  connect(
    (state) => ({
      emailOptions: getEmailOptions(state),
    }),
    {
      removeEmail: OrganisationActions.removeEmail,
      makeEmailMain: OrganisationActions.makeEmailMain,
      updateEmail: OrganisationActions.updateEmail,
    }
  ),
  withHandlers({
    removeEmail: ({ removeEmail, email, organisationId }) => () => {
      removeEmail(organisationId, email.uuid);
    },
    makeEmailMain: ({ makeEmailMain, email, organisationId }) => () => {
      makeEmailMain(organisationId, email.uuid);
    },
    handleEmailChange: ({ updateEmail, email, organisationId }) => (event, { value }) => {
      updateEmail(organisationId, email.uuid, {
        value,
      });
    },
    handleTypeChange: ({ updateEmail, email, organisationId }) => (event, { value: type }) => {
      updateEmail(organisationId, email.uuid, {
        type,
      });
    },
  })
)(EmailRow);

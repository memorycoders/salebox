//@flow
import * as React from 'react';
import { Button } from 'semantic-ui-react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as ContactActions from 'components/Contact/contact.actions';
import { FormPair, FormHeader } from 'components';
import _l from 'lib/i18n';
import EmailRow from './EmailRow';

type PropsT = {
  contactId: string,
  emails: Array<{}>,
  addEmail: () => void,
};

addTranslations({
  'en-US': {
    Email: 'Email',
  },
});

const EmailPane = ({ contactId, emails, addEmail }: PropsT) => {
  return (
    <React.Fragment>
      <FormHeader
        label={_l`Email`}
        action={<Button icon="envelope" content={_l`Add email`} onClick={addEmail} labelPosition="right" size="mini"/>}
        mini
      />
      <FormPair mini>
        {emails.map((email) => <EmailRow contactId={contactId} key={email.uuid} email={email} />)}
      </FormPair>
    </React.Fragment>
  );
};

export default compose(
  connect(
    null,
    {
      addEmail: ContactActions.addEmail,
    }
  ),
  withHandlers({
    addEmail: ({ addEmail, contactId }) => () => {
      addEmail(contactId);
    },
  })
)(EmailPane);

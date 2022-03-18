//@flow
import * as React from 'react';
import { Button } from 'semantic-ui-react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as OrganisationActions from 'components/Organisation/organisation.actions';
import { FormPair, FormHeader } from 'components';
import _l from 'lib/i18n';
import EmailRow from './EmailRow';

type PropsT = {
  organisationId: string,
  emails: Array<{}>,
  addEmail: () => void,
};

addTranslations({
  'en-US': {
    Email: 'Email',
  },
});

const EmailPane = ({ organisationId, emails, addEmail }: PropsT) => {
  return (
    <React.Fragment>
      <FormHeader
        label={_l`Email`}
        action={<Button icon="envelope" content={_l`Add email`} onClick={addEmail} labelPosition="right" size="mini"/>}
        mini
      />
      <FormPair mini>
        {emails.map((email) => <EmailRow organisationId={organisationId} key={email.uuid} email={email} />)}
      </FormPair>
    </React.Fragment>
  );
};

export default compose(
  connect(
    null,
    {
      addEmail: OrganisationActions.addEmail,
    }
  ),
  withHandlers({
    addEmail: ({ addEmail, organisationId }) => () => {
      addEmail(organisationId);
    },
  })
)(EmailPane);

//@flow
import * as React from 'react';

import { compose, pure, branch, renderNothing } from 'recompose';

import { ContactItem } from 'essentials';
import { Collapsible } from 'components';
import { connect } from 'react-redux';
import { Message } from 'semantic-ui-react';

import { withGetData } from 'lib/hocHelpers';

import * as OrganisationActions from 'components/Organisation/organisation.actions';

import _l from 'lib/i18n';
import {ObjectTypes, OverviewTypes} from "../../../Constants";
import QualifiedItem from "../../../essentials/List/Qualified/QualifiedItem";
addTranslations({
  'en-US': {
    '{0}': '{0}',
    Contacts: 'Contacts',
    'No contacts': 'No contacts',
  },
});

const ContactsCard = ({ account, objectType  }) => {
  const { contacts } = account;

  if (!contacts) {
    return (
      <Collapsible padded title={_l`Contacts`}>
        <Message active info>
          {_l`No contacts`}
        </Message>
      </Collapsible>
    );
  }
  let overviewType= OverviewTypes.Contact;
  switch (objectType) {
    case ObjectTypes.Account:
      overviewType = OverviewTypes.Account_Contact;
      break;
    default:
      break;
  }
  return (
    <Collapsible title={_l`Contacts`} count={contacts.length} open={true}>
      {/* <ContactItem header /> */}
      {contacts.map((contactId) => {
        return <ContactItem contactId={contactId} key={contactId}  overviewType={overviewType}/>;
      })}
    </Collapsible>
  );
};

const mapDispatchToProps = {
  requestFetchContacts: OrganisationActions.requestFetchContacts,
};

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  branch(({ account }) => !account || Object.keys(account).length < 1, renderNothing),
  withGetData(({ requestFetchContacts, account }) => () => requestFetchContacts(account.uuid)),
  pure
)(ContactsCard);

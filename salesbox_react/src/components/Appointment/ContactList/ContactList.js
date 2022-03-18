// @flow
import * as React from 'react';
import { compose } from 'recompose';
import ContactAvatar from './ContactAvatar';
import { Collapsible } from 'components';
import _l from 'lib/i18n';
type PropsT = {
  list: Array<string>,
};


addTranslations({
  'en-US': {
    Contacts: 'Contacts'
  },
});

const ContactList = ({ list }: PropsT) => {
  return (
    <Collapsible title={_l`Contacts`} width={308} open padded >
      {list.map((contact) => {
        return <ContactAvatar key={contact.uuid} contact={contact} />
      })}
    </Collapsible>
  );
};

export default compose(
)(ContactList);

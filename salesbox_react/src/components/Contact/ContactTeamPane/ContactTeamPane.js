//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { branch, renderNothing, compose, pure } from 'recompose';
import Collapsible from 'components/Collapsible/Collapsible';
import UserListItem from 'components/User/UserListItem/UserListItem';

type PropsType = {
  contact: {},
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    Responsible: 'Responsible',
  },
});

const ContactTeamPane = ({ contact }: PropsType) => {
  // const open = contact.participants.length > 0;
  return (
    <Collapsible hasDragable width={308} title={_l`Responsible`} open={true}>
      {contact.participants.map((user, idx) => {
        return <UserListItem size={30} user={user} key={user.uuid} active={idx === 0} postion={contact.participants.indexOf(user)}/>;
      })}
    </Collapsible>
  );
};

export default compose(
  branch(({ contact }) => !contact || Object.keys(contact).length < 1 || !contact.participants, renderNothing),
)(ContactTeamPane);

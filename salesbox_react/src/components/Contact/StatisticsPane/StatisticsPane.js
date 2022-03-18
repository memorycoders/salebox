//@flow
import * as React from 'react';
import _l from 'lib/i18n';
import { branch, renderNothing, compose, pure } from 'recompose';
import { FormPair, Collapsible } from 'components';

type PropsType = {
  contact: {},
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    Statistics: 'Statistics',
    Dials: 'Dials',
    Calls: 'Calls',
  },
});

const emptySales = (contact) => {
  return contact.numberPick === 0 && contact.numberCall === 0 && contact.numberActiveMeeting === 0;
};

const StatisticsPane = ({ contact }: PropsType) => {
  const open = !emptySales(contact);
  return (
    <Collapsible padded title={_l`Statistics`} open={open}>
      <FormPair left mini label={_l`Dials`}>
        {_l`${contact.numberPick}`}
      </FormPair>
      <FormPair left mini label={_l`Calls`}>
        {_l`${contact.numberCall}`}
      </FormPair>
      <FormPair left mini label={_l`Meetings`}>
        {_l`${contact.numberActiveMeeting}`}
      </FormPair>
    </Collapsible>
  );
};

export default compose(
  // branch(({ contact }) => !contact || Object.keys(contact).length < 1 || emptySales(contact), renderNothing),
  pure
)(StatisticsPane);

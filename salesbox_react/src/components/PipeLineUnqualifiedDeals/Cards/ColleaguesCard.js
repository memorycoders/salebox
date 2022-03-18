//@flow
import * as React from 'react';

import { compose, pure, branch, renderNothing } from 'recompose';

import { ColleagueItem } from 'essentials';
import { Collapsible } from 'components';
import { connect } from 'react-redux';
import { Message } from 'semantic-ui-react';

import { withGetData } from 'lib/hocHelpers';

import * as ContactActions from 'components/Contact/contact.actions';

type PropsType = {
  contact: {},
};

import _l from 'lib/i18n';
addTranslations({
  'en-US': {
    '{0}': '{0}',
    Colleagues: 'Colleagues',
    'No colleagues': 'No colleagues',
  },
});

const ColleaguesCard = ({ contact, route }: PropsType) => {
  const { colleagues } = contact;

  if (!colleagues) {
    return (
      <Collapsible padded title={_l`Colleagues`}>
        <Message active info>
          {_l`No colleagues`}
        </Message>
      </Collapsible>
    );
  }
  return (
    <Collapsible title={_l`Colleagues`} count={colleagues.length} open={true}>
      <ColleagueItem header />
      {colleagues.map((contactId) => {
        return <ColleagueItem route={route} contactId={contactId} key={contactId} />;
      })}
    </Collapsible>
  );
};

const mapDispatchToProps = {
  requestFetchColleague: ContactActions.requestFetchColleague,
};

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  branch(({ contact }) => !contact || Object.keys(contact).length < 1, renderNothing),
  withGetData(({ requestFetchColleague, contact }) => () => requestFetchColleague(contact.uuid)),
  pure
)(ColleaguesCard);

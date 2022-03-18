//@flow
import React from 'react';
import { compose, pure, branch, renderNothing, lifecycle, withHandlers, withState } from 'recompose';
import Collapsible from '../../Collapsible/Collapsible';
import { connect } from 'react-redux';
import { Message, Loader } from 'semantic-ui-react';
import cx from 'classnames';
import { withGetData } from 'lib/hocHelpers';
import * as OriganisationActions from '../organisation.actions';
import _l from 'lib/i18n';
import { ObjectTypes, OverviewTypes } from '../../../Constants';
import { NoteChatItem } from '../../NotesChat/NoteChatItem';
import css from '../Cards/TasksCard.css';

type PropsType = {
  contact: {},
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    Notes: 'Notes',
    'No notes': 'No notes',
  },
});
const NotesPane = ({ account, accountListItem, isFetching }: PropsType) => {
  let notes = accountListItem ? accountListItem.notes : [];
  if (account.notes) {
    notes = account.notes;
  }

  if (account.numberOfNote === 0 || (notes && notes.length === 0)) {
    return (
      <Collapsible count="0" width={308} padded title={_l`Notes`}>
        <div className={isFetching ? css.isFetching : ''}>
          {isFetching ? (
            <Loader active={isFetching}>Loading</Loader>
          ) : (
            <Message active info>
              {_l`No notes`}
            </Message>
          )}
        </div>
      </Collapsible>
    );
  }

  return (
    <Collapsible width={308} padded title={_l`Notes`} count={notes ? notes.length : ''}>
      <div className={isFetching ? css.isFetching : ''}>
        {isFetching ? (
          <Loader active={isFetching}>Loading</Loader>
        ) : (
          <>
            {(notes ? notes : []).map((note) => {
              return <NoteChatItem objectId={account.uuid} overviewType={OverviewTypes.Account_Note} note={note} />;
            })}
          </>
        )}
      </div>
    </Collapsible>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state, { account }) => {
    return {
      accountListItem: state.entities.organisation[account.uuid],
      // isFetching: state.overview.ACCOUNTS.isFetching
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = {
  requestFetchNotes: OriganisationActions.requestFetchNotes,
};

export default compose(
  connect(makeMapStateToProps, mapDispatchToProps),

  withGetData(({ requestFetchNotes, account }) => () => {
    requestFetchNotes(account.uuid);
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const { requestFetchNotes, account } = this.props;
      if (account.uuid !== nextProps.account.uuid || account.numberOfNote !== nextProps.account.numberOfNote) {
        requestFetchNotes(nextProps.account.uuid);
      }
    },
  })
)(NotesPane);

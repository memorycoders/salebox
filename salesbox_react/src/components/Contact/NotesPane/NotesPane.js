//@flow
import React from 'react';
import { compose, pure, branch, renderNothing, lifecycle, withHandlers, withState } from 'recompose';
import Collapsible from '../../Collapsible/Collapsible';
import { connect } from 'react-redux';
import { Message, Loader } from 'semantic-ui-react';
import cx from 'classnames';
import { withGetData } from 'lib/hocHelpers';
import * as ContactActions from '../contact.actions';
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
const NotesPane = ({ contact, contactListItem, isFetching }: PropsType) => {
  let notes = contactListItem ? contactListItem.notes : [];
  if (contact.notes) {
    notes = contact.notes;
  }

  if (contact.numberOfNote === 0 || (notes && notes.length === 0)) {
    return (
      <Collapsible count="0" width={308} padded title={_l`Notes`}>
        {isFetching ? (
          <div className={isFetching && css.isFetching}>
            <Loader active={isFetching}>Loading</Loader>
          </div>
        ) : (
          <Message active info>
            {_l`No notes`}
          </Message>
        )}
      </Collapsible>
    );
  }

  return (
    <Collapsible width={308} padded title={_l`Notes`} count={notes ? notes.length : ''}>
      {isFetching ? (
        <div className={isFetching && css.isFetching}>
          <Loader active={isFetching}>Loading</Loader>
        </div>
      ) : (
        <>
          {(notes ? notes : []).map((note) => {
            return <NoteChatItem objectId={contact.uuid} overviewType={OverviewTypes.Contact_Note} note={note} />;
          })}
        </>
      )}
    </Collapsible>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state, { contact }) => {
    return {
      contactListItem: state.entities.contact[contact.uuid],
      // isFetching: state.overview.CONTACTS.isFetching,
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = {
  requestFetchNotes: ContactActions.requestFetchNotes,
};

export default compose(
  connect(makeMapStateToProps, mapDispatchToProps),

  withGetData(({ requestFetchNotes, contact }) => () => {
    requestFetchNotes(contact.uuid);
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const { requestFetchNotes, contact } = this.props;
      if (contact.uuid !== nextProps.contact.uuid || contact.numberOfNote !== nextProps.contact.numberOfNote) {
        requestFetchNotes(nextProps.contact.uuid);
      }
    },
  })
)(NotesPane);

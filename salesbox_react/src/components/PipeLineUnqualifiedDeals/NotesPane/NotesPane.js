//@flow
import React from 'react';
import { compose, pure, branch, renderNothing, lifecycle, withHandlers, withState } from 'recompose';
import Collapsible from '../../Collapsible/Collapsible';
import { connect } from 'react-redux';
import { Message, Loader } from 'semantic-ui-react';
import cx from 'classnames';
import { withGetData } from 'lib/hocHelpers';
import { makeGetUnqualifiedDeal } from '../unqualifiedDeal.selector';
import * as UnqualifiedActions from '../unqualifiedDeal.actions';
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
const NotesPane = ({ unqualifiedDeal, unqualifiedDealListItem, isFetching }: PropsType) => {
  let notes = unqualifiedDealListItem.notes;
  if (unqualifiedDeal.notes) {
    notes = unqualifiedDeal.notes;
  }

  if (unqualifiedDeal.numberOfNote === 0 || (notes && notes.length === 0)) {
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
            {' '}
            {(notes ? notes : []).map((note) => {
              return (
                <NoteChatItem
                  objectId={unqualifiedDeal.uuid}
                  overviewType={OverviewTypes.Pipeline.Lead_Note}
                  note={note}
                />
              );
            })}
          </>
        )}
      </div>
    </Collapsible>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state, props) => {
    const getUnqualifiedDeal = makeGetUnqualifiedDeal();
    return {
      unqualifiedDealListItem: getUnqualifiedDeal(state, props.unqualifiedDeal.uuid),
      isFetching: state.overview.PIPELINE_LEADS ? state.overview.PIPELINE_LEADS.isFetching : false,
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = {
  requestFetchNotes: UnqualifiedActions.requestFetchNotes,
};

export default compose(
  connect(makeMapStateToProps, mapDispatchToProps),

  withGetData(({ requestFetchNotes, unqualifiedDeal }) => () => {
    requestFetchNotes(unqualifiedDeal.uuid);
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const { requestFetchNotes, unqualifiedDeal } = this.props;
      if (
        unqualifiedDeal.uuid !== nextProps.unqualifiedDeal.uuid ||
        unqualifiedDeal.numberOfNote !== nextProps.unqualifiedDeal.numberOfNote
      ) {
        requestFetchNotes(nextProps.unqualifiedDeal.uuid);
      }
    },
  })
)(NotesPane);

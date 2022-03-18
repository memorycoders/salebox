//@flow
import React from 'react';
import { compose, pure, branch, renderNothing, lifecycle, withHandlers, withState } from 'recompose';
import Collapsible from '../../Collapsible/Collapsible';
import { connect } from 'react-redux';
import { Message, Loader } from 'semantic-ui-react';
import cx from 'classnames';
import { withGetData } from 'lib/hocHelpers';
import { makeGetUnqualifiedDeal } from '../qualifiedDeal.selector';
import * as QualifiedActions from '../qualifiedDeal.actions';
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
const NotesPane = ({ qualifiedDeal, qualifiedDealListItem, isFetching }: PropsType) => {
  let notes = qualifiedDealListItem ? qualifiedDealListItem.notes : [];
  if (qualifiedDeal.notes) {
    notes = qualifiedDeal.notes;
  }

  if (qualifiedDeal.numberOfNote === 0 || (notes && notes.length === 0)) {
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
              return (
                <NoteChatItem
                  objectId={qualifiedDeal.uuid}
                  overviewType={OverviewTypes.Pipeline.Qualified_Note}
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
  const mapStateToProps = (state, { qualifiedDeal }) => {
    const qualifiedDealList = state.entities.qualifiedDeal;
    return {
      qualifiedDealListItem: qualifiedDealList[qualifiedDeal.uuid],
      isFetching: state.overview.PIPELINE_QUALIFIED ? state.overview.PIPELINE_QUALIFIED.isFetching : false,
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = {
  requestFetchNotes: QualifiedActions.requestFetchNotes,
};

export default compose(
  connect(makeMapStateToProps, mapDispatchToProps),

  withGetData(({ requestFetchNotes, qualifiedDeal }) => () => {
    requestFetchNotes(qualifiedDeal.uuid);
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const { requestFetchNotes, qualifiedDeal } = this.props;
      if (
        qualifiedDeal.uuid !== nextProps.qualifiedDeal.uuid ||
        qualifiedDeal.numberOfNote !== nextProps.qualifiedDeal.numberOfNote
      ) {
        requestFetchNotes(nextProps.qualifiedDeal.uuid);
      }
    },
  })
)(NotesPane);

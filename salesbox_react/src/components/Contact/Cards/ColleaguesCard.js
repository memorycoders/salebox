//@flow
import * as React from 'react';

import { compose, pure, branch, renderNothing, lifecycle, withHandlers, withState } from 'recompose';

import { ColleagueItem } from 'essentials';
import { Collapsible } from 'components';
import { connect } from 'react-redux';
import { Message, Loader } from 'semantic-ui-react';
import css from '../Cards/TasksCard.css';

import { withGetData } from 'lib/hocHelpers';

import { requestFetchColleague } from '../contact.actions';

type PropsType = {
  contact: {},
};

import _l from 'lib/i18n';
import { ObjectTypes, OverviewTypes,PAGE_SIZE_SUBLIST  } from '../../../Constants';
import {List} from "react-virtualized";
import InfiniteLoader from "react-virtualized/dist/es/InfiniteLoader";

addTranslations({
  'en-US': {
    '{0}': '{0}',
    Colleague: 'Colleague',
  },
});

const ColleaguesCard = ({
  route,
  contact,
  contactInList,
  overviewType,
  objectType,
  orderBy,
  handleOrderBy,
  isFetching,
                          handleFilter,
}: PropsType) => {
  let objectMerge = contact;
  if (contactInList) {
    objectMerge = {
      ...contact,
      ...contactInList,
    };
  }
  const { colleagues } = objectMerge;
  let overviewT = OverviewTypes.Contact_Contact;

  if (!colleagues || (colleagues && colleagues.length === 0)) {
    return (
      <Collapsible count="0" width={308} padded title={_l`Colleague`}>
        {isFetching ? (
          <div className={isFetching && css.isFetching}>
            <Loader active={isFetching}>Loading</Loader>
          </div>
        ) : (
          <Message active info>
            {_l`No colleagues`}
          </Message>
        )}
      </Collapsible>
    );
  }
  //page
  let pageIndexSection = 0;
  if (objectMerge.colleagues.length <= PAGE_SIZE_SUBLIST) {
    pageIndexSection = 0;
  }
  return (
    <Collapsible width={308} title={_l`Colleague`} count={contact.numberColleague} open={true}>
      {isFetching ? (
        <div className={isFetching && css.isFetching}>
          <Loader active={isFetching}>Loading</Loader>
        </div>
      ) : (
        <>
          <ColleagueItem header orderBy={orderBy} setOrderBy={handleOrderBy} />


          <InfiniteLoader
            autoReload={true}
            isRowLoaded={isRowRender(objectMerge.colleagues)}
            loadMoreRows={(param) => {
              const { stopIndex } = param;
              const pageIndex = Math.ceil(stopIndex / PAGE_SIZE_SUBLIST) - 1;

              if (pageIndexSection < pageIndex) {
                pageIndexSection = pageIndex;
                handleFilter(pageIndex);
              }
            }}
            threshold={1}
            rowCount={contact.numberColleague}
          >
            {({ onRowsRendered, registerChild }) => {
              return (
                <List
                  height={300}
                  className={css.list}
                  rowCount={objectMerge.colleagues.length || 0}
                  rowHeight={48}
                  width={308}
                  ref={registerChild}
                  // style={{
                  //   backgroundColor: 'rgb(227, 227, 227)',
                  //   transition: 'background-color 0.2s ease',
                  // }}
                  onRowsRendered={onRowsRendered}
                  rowRenderer={getRowRender(objectMerge.colleagues, overviewT,route)}
                  threshold={300}
                  data={objectMerge.colleagues}
                />
              );
            }}
          </InfiniteLoader>



{/*

          {colleagues.map((contactId) => {
            return <ColleagueItem route={route} contactId={contactId} key={contactId} overviewType={overviewT} />;
          })}
*/}

        </>
      )}
    </Collapsible>
  );
};
const isRowRender = (quotes) => ({ index }) => {
  return !!quotes[index];
};

const getRowRender = (quotes, overviewType,route) => ({ index, style }) => {
  const item = quotes[index];

  if (!item) {
    return null;
  }
  return (<ColleagueItem style={style} route={route} contactId={item} key={item} overviewType={overviewType} />);
};

const mapDispatchToProps = {
  requestFetchColleague,
};

export default compose(
  connect((state, { contact }) => {
    return {
      contactInList: state.entities.contact[contact.uuid],
      // isFetching: state.overview.CONTACTS.isFetching,
      isFetching: false,
    };
  }, mapDispatchToProps),
  withState('orderBy', 'setOrderBy', 'contactName'),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const { requestFetchColleague, contact } = this.props;
      if (contact.uuid !== nextProps.contact.uuid || contact.numberColleague !== nextProps.contact.numberColleague) {
        requestFetchColleague(nextProps.contact.uuid,null,0);
      }
    },
  }),
  withGetData(({ requestFetchColleague, contact }) => () => {
    requestFetchColleague(contact.uuid,null,0);
  }),
  withHandlers({
    handleOrderBy: ({ setOrderBy, contact, objectType, requestFetchColleague }) => (orderBy) => {
      setOrderBy(orderBy);
      requestFetchColleague(contact.uuid, orderBy,0);
    },
    handleFilter: ({ requestFetchColleague, contact, orderBy }) => (
      pageIndex
    ) => {
      requestFetchColleague(
        contact.uuid,
        orderBy,
        pageIndex,
      );
    },

  })
)(ColleaguesCard);

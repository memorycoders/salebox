// @flow
import React from 'react';
import { compose, withHandlers, lifecycle, withState } from 'recompose';
import { connect } from 'react-redux';
import { InfiniteLoader, List, AutoSizer } from 'react-virtualized';
import _l from 'lib/i18n';
import cx from 'classnames';
import moment from 'moment';
import PeriodSelector from '../PeriodSelector/PeriodSelector';
import { NoResults } from 'components';
import AdvancedSearch from 'components/AdvancedSearch';
import { hasSearch, getSearch } from 'components/AdvancedSearch/advanced-search.selectors';
import * as AdvancedSearchActions from 'components/AdvancedSearch/advanced-search.actions';
import * as OverviewActions from 'components/Overview/overview.actions';
import { setOverviewType, setObjectType } from 'components/Common/common.actions'
import { SearchType } from 'components/AdvancedSearch/advanced-search.types';
import { getOverview, getAllItem } from 'components/Overview/overview.selectors';
import { withErrorBoundary } from 'lib/hocHelpers';
import MassPersonalEmail from 'components/AdvancedSearch/MassPersonalEmail'
import css from './Overview.css';
import {showHideMassPersonalMail} from 'components/Common/common.actions';
import QualifiedSalesProcess from '../QualifiedSalesProcess';
import { sendEmailInBatch } from '../AdvancedSearch/advanced-search.actions';
import { OverviewTypes } from '../../Constants';

type RowrendererType = {
  index: number,
  key: string,
  style: {},
  parent: React.Node,
};

type IsRowLoadedType = {
  index: string,
};

type PropsType = {
  rowRenderer: (row: RowrendererType) => React.Node,
  items: Array<{}>,
  search: SearchType,
  isNextPageLoading: boolean,
  itemCount: number,
  clearSearch: () => void,
  loadMoreRows: () => void,
  handleSearch: (event: Event, { value: string }) => void,
  children: React.Node,
  isRowLoaded: (row: IsRowLoadedType) => void,
  hasSearch: boolean,
  hasTag: boolean,
  hasFilter: boolean,
  hasPeriodSelector: boolean,
  pristine: boolean,
  hasHistory: boolean,
  history: boolean,
  hasGenius: boolean,
  hideOnlyPeriod: boolean,
  rowHeight: Number
};

const WIDTH_DEFAULT = 550

const createOverview = (
  overviewType: string,
  objectType: string,
  color: string,
  headerEl: React.ComponentType<>,
  RowComponent: React.ComponentType<{}>,
  PlaceholderComponent: React.ComponentType<{}>,
  OverideList: React.ComponentType<>
) => {
  const Overview = ({
    rowRenderer,
    children,
    isRowLoaded,
    loadMoreRows,
    clearSearch,
    items,
    itemCount,
    handleSearch,
    isNextPageLoading,
    search,
    hasTag,
    hasFilter,
    hasPeriodSelector,
    pristine,
    hasHistory,
    history,
    hasGenius,
    heightAdvanceSearch,
    heightPeriod,
    showHideMassPersonalMail,
    isShowMassPersonalEmail,
    itemsShow,
    hideOnlyPeriod,
    hasSalesMethod,
    listShow,
    sendEmailInBatch,
    rowHeight
  }: PropsType) => {
    let pageIndexSection = 0;
    const loadmore = ({ stopIndex })=> {
      const pageIndex = Math.ceil(stopIndex / 25) - 1;
      if (pageIndexSection < pageIndex) {
        pageIndexSection = pageIndex;
        loadMoreRows();
      }
    }

    const empty =
      (!pristine && itemCount < 1 && !isNextPageLoading && items?.length === 0)
    const rowCount = itemsShow?.length > 0 ? itemCount : 25;
    const itemLength = !pristine ? itemsShow?.length : 25;
    return (
      <React.Fragment>
        <div className={css.listContainer}>
          <div className={css.wrapper}>
            <InfiniteLoader
              autoReload
              threshold={1}
              isRowLoaded={isRowLoaded}
              loadMoreRows={loadmore}
              rowCount={rowCount}>
              {({ onRowsRendered, registerChild }) => (
                <AutoSizer>
                  {({ width, height }) => (
                    <>
                      <AdvancedSearch
                        width={width > WIDTH_DEFAULT ? width : WIDTH_DEFAULT}
                        hasTag={hasTag}
                        hasFilter={hasFilter}
                        placeholder={_l`Search`}
                        objectType={objectType}
                        clearSearch={clearSearch}
                        searchTerm={search.term}
                        handleSearch={handleSearch}
                        loading={isNextPageLoading}
                        className={css.search}
                        hasHistory={hasHistory}
                        history={history}
                        color={color}
                        hasGenius={hasGenius}
                      />
                      {hasPeriodSelector && (
                        <PeriodSelector
                          hideOnlyPeriod= {hideOnlyPeriod}
                          width={width > WIDTH_DEFAULT ? width : WIDTH_DEFAULT}
                          objectType={objectType}
                          overviewType={overviewType}
                          color={color}
                        />
                      )}
                      {hasSalesMethod && (
                        <QualifiedSalesProcess objectType={objectType} overviewType={overviewType} width={width > 650 ? width : 650} />
                      )}

                      {
                        !listShow ? <OverideList
                          height={height - 55 - heightAdvanceSearch - heightPeriod}
                          width={width > WIDTH_DEFAULT ? width : WIDTH_DEFAULT}
                          onRowsRendered={onRowsRendered}
                          registerChild={registerChild}
                          overviewType={overviewType}
                          objectType={objectType} /> :
                          <>
                          {typeof headerEl === 'function' ? headerEl(width > WIDTH_DEFAULT ? width : WIDTH_DEFAULT) : headerEl}
                          {empty && <div style={{ width: width > WIDTH_DEFAULT ? width : WIDTH_DEFAULT, height: height - 76 - heightAdvanceSearch - heightPeriod }} className={css.noResultContainer}>
                            <NoResults />
                          </div>}
                          {!empty && (
                            <List
                              width={width > WIDTH_DEFAULT ? width : WIDTH_DEFAULT}
                              rowHeight={rowHeight ? rowHeight : 60}
                              rowCount={itemLength}
                              height={height - 76 - heightAdvanceSearch - heightPeriod - (hasSalesMethod ? 40 : 0)}
                              className={css.list}
                              ref={registerChild}
                              onRowsRendered={onRowsRendered}
                              rowRenderer={rowRenderer}
                              threshold={300}
                              data={itemsShow}
                            />
                          )}
                       </>
                     }
                    </>
                  )}
                </AutoSizer>
              )}
            </InfiniteLoader>
          </div>
        </div>
        <MassPersonalEmail sendEmailInBatch={sendEmailInBatch} showHideMassPersonalMail={showHideMassPersonalMail} isShowMassPersonalEmail={isShowMassPersonalEmail} overviewType={overviewType}/>
        {children}
      </React.Fragment>
    );
  };

  return compose(
    connect(
      (state) => {
        const overview = getOverview(state, overviewType);
        const search = getSearch(state, objectType);
        const allItem = getAllItem(state, overviewType, objectType);
        let listShow = true;
        if (overviewType === 'PIPELINE_QUALIFIED'){
          const { qualifiedDeal } = state.entities;
          listShow = qualifiedDeal.__COMMON_DATA ? qualifiedDeal.__COMMON_DATA.listShow : false
        }
        if(overviewType === OverviewTypes.RecruitmentActive) {
          listShow = false;
        }
        return {
          itemCount: overview.itemCount,
          items: overview.items,
          isNextPageLoading: overview.isFetching,
          period: state.period[objectType],
          pristine: overview.pristine,
          hasSearch: hasSearch(state, objectType),
          search,
          currentItemLv1: overview.currentItemLv1,
          isShowMassPersonalEmail: state.common.isShowMassPersonalEmail,
          allItem,
          listShow
        };
      },
      {
        requestFetch: OverviewActions.requestFetch,
        // searchTask: OverviewActions.searchTask,
        select: OverviewActions.select, // cái này là dispatch rút gọn
        unselect: OverviewActions.unselect,
        currentLv1: OverviewActions.currentLv1,
        setSearchTerm: AdvancedSearchActions.setTerm,
        setOverviewType: setOverviewType,
        setObjectType: setObjectType,
        hideAvancedSearch: AdvancedSearchActions.hide,
        showHideMassPersonalMail: showHideMassPersonalMail,
        succeedFetch: OverviewActions.succeedFetch,
        sendEmailInBatch: sendEmailInBatch
      }
    ),
    withState('heightAdvanceSearch', 'setHeightAdvanceSearch', 0),
    withState('heightPeriod', 'setHeightPeriod', 37),
    withState('itemsShow', 'setItemsShow', props => props.items ? props.items : []),
    lifecycle({
      componentDidMount() {
        const { requestFetch, setOverviewType, setObjectType, search, hideAvancedSearch, listShow } = this.props;

        if (listShow){
          requestFetch(overviewType, true);
        }

        setOverviewType(overviewType)
        setObjectType(objectType)
        if(search && search.shown) {
          hideAvancedSearch(objectType);
        }

      },
      componentDidUpdate(prevProps){
        if (prevProps.search !== this.props.search){
          const addvanceSearch = document.getElementById('addvanceSearch');
          if (addvanceSearch)
          this.props.setHeightAdvanceSearch(addvanceSearch.offsetHeight)
        }

        if (prevProps.period !== this.props.period) {
          const period = document.getElementById('period');
          if (period)
          this.props.setHeightPeriod(period.offsetHeight)
        }
      },

      componentWillReceiveProps(nextProps){
        const { period, items, setItemsShow, allItem, succeedFetch, search, listShow } = this.props;

        if (listShow !== nextProps.listShow && nextProps.listShow) {
          nextProps.requestFetch(overviewType);
        }
        if(items !== nextProps.items){
          setItemsShow(nextProps.items)
        }
        if (period !== nextProps.period ||
          search.history !== nextProps.search.history ||
          search.tag !== nextProps.search.tag) {

          const { endDate, startDate, period: periodData } = nextProps.period;
          const startTimes = moment(startDate).startOf('day').valueOf();
          const endTimes = moment(endDate).endOf('day').valueOf();

          let cacheItems = []
          //SEARCH FOR TASK AND DELEGATION
          if (overviewType === 'ACTIVITIES_TASKS' || overviewType === 'DELEGATION_TASKS'){
            // date search
             cacheItems = periodData === 'all' ? allItem : allItem.filter(item => {
              return (item.dateAndTime >= startTimes && item.dateAndTime <= endTimes) || item.dateAndTime === null
            });

            // history search
            cacheItems = cacheItems.filter(item => item.finished === nextProps.search.history);

            // tag filter
            if (nextProps.search.tag) {
              cacheItems = cacheItems.filter(item => item.tag === nextProps.search.tag);
            }
          } else if (overviewType === 'PIPELINE_LEADS'){

            // date search
             cacheItems = periodData === 'all' ? allItem : allItem.filter(item => {
              return (item.deadlineDate >= startTimes && item.deadlineDate <= endTimes) || item.deadlineDate === null
            });

            // history search
            cacheItems = cacheItems.filter(item => item.finished === nextProps.search.history);

            // tag filter
            if (nextProps.search.tag) {
              cacheItems = cacheItems.filter(item => item.status === nextProps.search.tag);
            }
          }

          succeedFetch(overviewType, cacheItems.map(value => value.uuid), true, 0)
          setItemsShow(cacheItems.map(value => value.uuid))
        }

        // if (allItem !== nextProps.allItem){
        //   alert('?')
        // }

      }

    }),

    withErrorBoundary(),
    withHandlers({
      handleSearch: ({ setSearchTerm, requestFetch, overviewType }) => (event, { value: term }) => {
        setSearchTerm(objectType, term);
        requestFetch(overviewType)

      },
      clearSearch: ({ setSearchTerm, requestFetch, overviewType }) => () => {
        setSearchTerm(objectType, '');
        requestFetch(overviewType)
      },
      select: ({ select, unselect }) => (itemId, selected) => {
        if (selected) {
          select(overviewType, itemId);
        } else {
          unselect(overviewType, itemId);
        }
      },
      current1: ({ currentLv1 }) => (itemId) => {
        currentLv1(overviewType, itemId);
      },
      isRowLoaded: ({ items }) => ({ index }) => {
        return !!items[index];
      },
      loadMoreRows: ({ requestFetch }) => () => {
        requestFetch(overviewType);
      }
    }),
    withHandlers({
      rowRenderer: ({ items, route, isRowLoaded, select, current1, isNextPageLoading }) => ({
        index,
        key,
        style,
        parent,
      }: RowrendererType) => {

        const cn = cx(css.listItem, {
          [css.even]: index % 2 === 0,
          // [css.current]: currentItemLv1 == items[index],
          // [css.current]: true,
        });
        const rowStyle = {
          ...style,
          width: parent.props.columnWidth,
        };
        // if (PlaceholderComponent && (!isRowLoaded({ index }))) {
        //   return (
        //     <PlaceholderComponent className={cn} style={rowStyle} key={key} select={select} itemId={items[index]} />
        //   );
        // }
        return (
          <RowComponent
            route={route}
            overviewType={overviewType}
            className={cn}
            style={rowStyle}
            key={key}
            select={select}
            current1={current1}
            itemId={items[index]}
          />
        );
      },
    })
  )(Overview);
};

export default createOverview;

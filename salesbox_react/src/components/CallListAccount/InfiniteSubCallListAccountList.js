//@flow
import React, { useRef } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { compose, withHandlers, branch, renderNothing, withState, defaultProps, lifecycle } from 'recompose';
import { withRouter } from 'react-router';
import { InfiniteLoader, List, AutoSizer } from 'react-virtualized';
import { ContentLoader } from 'components/Svg';
import _l from 'lib/i18n';
import { ObjectTypes, OverviewTypes } from 'Constants';
import { Popup } from 'semantic-ui-react';
import { isItemSelected, isItemHighlighted, getHighlighted } from 'components/Overview/overview.selectors';
import * as OverviewActions from 'components/Overview/overview.actions';
import ListActionMenu from '../CallListAccount/Menu/ListActionMenu';
import overviewCss from 'components/Overview/Overview.css';
import css from './CallListAccountListRow.css';
import { getSubCallListAccount, getCallListAccount } from './callListAccount.selector';
import { withGetData } from 'lib/hocHelpers';
import * as CallListAccountActions from './callListAccount.actions';
import { getSearch } from '../AdvancedSearch/advanced-search.selectors';
import FilterActionMenu from '../../essentials/Menu/FilterActionMenu';
import addIcon from '../../../public/Add.svg';
import { highlight } from '../Overview/overview.actions';
type PropsType = {
  callListAccount: {},
  subCallListAccount: {},
  className?: string,
  selected: boolean,
  highlighted: boolean,
  showHistory: boolean,
  style: {},
  goto: () => void,
  select: (event: Event, { checked: boolean }) => void,
};

type PlaceholderPropsType = {
  className: string,
  style: {},
};

type HeaderPropsType = {
  overviewType: string,
  callListAccount: Object,
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    Name: 'Name',
    Sales: 'Sales',
    Profit: 'Profit',
    Gross: 'Gross',
    Weighted: 'Weighted',
  },
});

const fHeaderComponent = ({
  callListAccount,
  subCallListAccount,
  orderBy,
  handleSortColumn,
  objectType,
  width,
  addAccountToCalllistAccount,
}: HeaderPropsType) => {
  const shortenValue = (value) => {
    if (value && value.length > 32) {
      return value.slice(0, 32);
    }
    return value.slice(0, 32);
  };
  return (
    <div style={{ width }} className={css.subListTitle}>
      <div style={{ width }} className={css.subTitle}>
        {callListAccount && callListAccount.name && callListAccount.name.length > 0 ? (
          callListAccount.name.length > 32 ? (
            <Popup
              trigger={
                <div>
                  {`${shortenValue(callListAccount.name)}...`}{' '}
                  <span className={css.count}> {callListAccount && callListAccount.numberContact}</span>
                </div>
              }
              style={{ fontSize: 11 }}
              content={callListAccount.name}
            />
          ) : (
            <div>
              {callListAccount.name}{' '}
              <span className={css.count}> {subCallListAccount && callListAccount.numberContact}</span>
            </div>
          )
        ) : (
          ''
        )}
        {/* <div>
          {callListAccount && callListAccount.name}
          <span className={css.count}>{subCallListAccount && callListAccount.numberAccount}</span>
        </div> */}
        <div className={css.rightMenu}>
          <img
            className={`${css.add} ${css.iconCircle}`}
            src={addIcon}
            style={{ height: 15, width: 15, borderRadius: '50%', cursor: 'pointer' }}
            onClick={addAccountToCalllistAccount}
          />
          <FilterActionMenu
            imageClass={`${css.filter} `}
            objectType={ObjectTypes.SubCallListAccount}
            data={callListAccount}
            className={`${css.rightIcon} ${css.iconCircle} ${css.iconFiterDiv}`}
          />
        </div>
      </div>

      <div style={{ width }} className={`${css.header}`}>
        <div
          className={`${css.contact} ${css.clickable} width100`}
          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
          onClick={() => handleSortColumn('name')}
        >
          {_l`Name`}
          <span className={orderBy === 'name' ? `${css.activeIcon} ${css.sortIcon}` : `${css.normalIcon}`}>
            <i class="angle down icon"></i>
          </span>
        </div>
        <div className={`${css.kpiTwo} ${css.clickable}`} onClick={() => handleSortColumn('numberCall')}>
          <div className={`${css.ic_answer_call} ${css.icon}`}>
            <span
              className={orderBy === 'numberCall' ? `${css.activeIcon} ${css.sortIcon}` : `${css.normalIcon}`}
              style={{ marginTop: '-2px' }}
            >
              <i class="angle down icon"></i>
            </span>
          </div>
        </div>
        <div className={`${css.kpiTwo} ${css.clickable}`} onClick={() => handleSortColumn('numberDial')}>
          <div className={`${css.ic_unanswer_call} ${css.icon}`}>
            <span
              className={orderBy === 'numberDial' ? `${css.activeIcon} ${css.sortIcon}` : `${css.normalIcon}`}
              style={{ marginTop: '-2px' }}
            >
              <i class="angle down icon"></i>
            </span>
          </div>
        </div>

        <div className={css.more} />
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  const itemHightlighted = getHighlighted(state, OverviewTypes.CallList.Account);
  return {
    itemHightlighted,
  };
};
export const HeaderComponent = compose(
  connect(mapStateToProps, {
    getAccountOnCallList: CallListAccountActions.fetchAccountOnCallList,
    highlight,
  }),
  withState('orderBy', 'setOrderBy', 'name'),
  withHandlers({
    handleSortColumn: ({ setOrderBy, callListAccount, getAccountOnCallList }) => (orderBy, objectType) => {
      setOrderBy(orderBy);
      if (callListAccount && callListAccount.uuid) getAccountOnCallList(callListAccount.uuid, orderBy, 0);
    },
    addAccountToCalllistAccount: ({ highlight, itemHightlighted }) => () => {
      let overviewT = OverviewTypes.CallList.Account;
      highlight(overviewT, itemHightlighted, 'add_account_to_calllist_account');
    },
  })
)(fHeaderComponent);

const checkLoader = (
  <ContentLoader width={48} height={48}>
    <rect x={12} y={12} rx={4} ry={4} width={24} height={24} />
  </ContentLoader>
);

const noteLoader = (
  <ContentLoader width={200} height={48}>
    <rect x={8} y={16} rx={4} ry={4} width={200 - 16} height={8} />
  </ContentLoader>
);

const categoryLoader = (
  <ContentLoader width={120} height={48}>
    <rect x={8} y={16} rx={4} ry={4} width={200 - 16} height={8} />
  </ContentLoader>
);

const deadlineLoader = (
  <ContentLoader width={128} height={44}>
    <rect x={8} y={8} rx={4} ry={4} width={96} height={8} />
    <rect x={8} y={24} rx={4} ry={4} width={64} height={8} />
  </ContentLoader>
);

const daysLoader = (
  <ContentLoader width={32} height={44}>
    <rect x={8} y={16} rx={4} ry={4} width={16} height={8} />
  </ContentLoader>
);

const responsibleLoader = (
  <ContentLoader width={32} height={44}>
    <rect x={8} y={16} rx={4} ry={4} width={16} height={8} />
  </ContentLoader>
);

export const PlaceholderComponent = ({ className, style }: PlaceholderPropsType) => {
  return (
    <div style={{ ...style, width: 300, display: 'flex', alignItems: 'center' }}>
      <div className={`${css.contact} width100 font-bold`}>{categoryLoader}</div>
      <div className={css.days}>{daysLoader}</div>
      <div className={css.kpiTwo}>{noteLoader}</div>
      {/* <div className={css.kpiTwo}>{daysLoader}</div> */}
      <div className={css.kpiTwo}>{responsibleLoader}</div>
    </div>
  );
};

const InfiniteSubCallListAccountList = ({
  subCallListAccount,
  goto,
  callListAccount,
  overviewType,
  loadMoreRows,
  itemHightlighted,
  isScroll,
}: PropsType) => {
  let pageIndexSection = 0;
  const hasDetail = (location.pathname.match(/\//g) || []).length > 3;
  const widthPane = hasDetail ? 316 : 300;

  return (
    <div style={{ marginRight: hasDetail ? 0 : 16 }} className={css.container}>
      <HeaderComponent width={widthPane} callListAccount={callListAccount} subCallListAccount={subCallListAccount} />

      <InfiniteLoader
        autoReload={true}
        isRowLoaded={isRowRender(subCallListAccount)}
        loadMoreRows={(param) => {
          const { stopIndex } = param;

          const pageIndex = Math.ceil(stopIndex / 25) - 1;

          if (pageIndexSection < pageIndex) {
            pageIndexSection = pageIndex;
            loadMoreRows(pageIndex);
          }
        }}
        threshold={1}
        rowCount={callListAccount.numberAccount}
      >
        {({ onRowsRendered, registerChild }) => {
          return (
            <AutoSizer>
              {({ width, height }) => (
                <List
                  height={height - 86}
                  className={css.list}
                  rowCount={
                    callListAccount.numberAccount !== 0 && subCallListAccount.length === 0
                      ? 25
                      : subCallListAccount.length
                  }
                  rowHeight={60}
                  width={widthPane}
                  ref={registerChild}
                  onRowsRendered={onRowsRendered}
                  rowRenderer={getRowRender(subCallListAccount, overviewType, goto, itemHightlighted)}
                  threshold={300}
                  data={subCallListAccount}
                />
              )}
            </AutoSizer>
          );
        }}
      </InfiniteLoader>
    </div>
  );
};

const isRowRender = (quotes) => ({ index }) => {
  return !!quotes[index];
};

const getRowRender = (quotes, overviewType, goto, itemHightlighted) => ({ index, style }) => {
  const detail = quotes[index];

  if (!detail) {
    return <PlaceholderComponent style={style} />;
  }
  const className = cx(css.listItem, {
    // [css.even]: index % 2 === 0,
  });
  const shortenValueAccount = (value) => {
    if (value && value.length > 30) {
      return value.slice(0, 30);
    }
    return value;
  };
  const listCn = cx(className, {
    [css.highlighted]: itemHightlighted === detail.organisationId,
    [overviewCss.selected]: false,
  });
  return (
    <div className={listCn} style={style} onClick={() => goto(detail.organisationId)}>
      <div className={`${css.contact} width100 font-bold`}>
        {detail.name && detail.name.length > 0 ? (
          detail.name.length > 30 ? (
            <Popup
              trigger={<div>{`${shortenValueAccount(detail.name)}...`}</div>}
              style={{ fontSize: 11 }}
              content={detail.name}
            />
          ) : (
            detail.name
          )
        ) : (
          ''
        )}
      </div>
      <div className={css.kpiTwo}>{detail.numberCall}</div>
      <div className={css.kpiTwo}>{detail.numberDial}</div>
      <div className={css.more}>
        <div className={css.bgMore}>
          <ListActionMenu className={css.bgMore} overviewType={overviewType} organisation={detail} />
        </div>
      </div>
    </div>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType, itemId, match }) => {
    const getStateSearch = getSearch(state, overviewType);
    getCallListAccount(state, match.params.callListAccountId);
    return {
      selected: isItemSelected(state, overviewType, itemId),
      itemHightlighted: getHighlighted(state, OverviewTypes.CallList.SubAccount),
      highlighted: isItemHighlighted(state, OverviewTypes.CallList.SubAccount, itemId),
      callListAccount: getCallListAccount(state, match.params.callListAccountId),
      subCallListAccount: getSubCallListAccount(state, match.params.callListAccountId),
      showHistory: getStateSearch.history,
    };
  };
  return mapStateToProps;
};
export default compose(
  withRouter,
  defaultProps({
    overviewType: OverviewTypes.CallList.SubAccount,
  }),
  connect(makeMapStateToProps, {
    getAccountOnCallList: CallListAccountActions.fetchAccountOnCallList,
    highlight: OverviewActions.highlight,
  }),
  withHandlers({
    goto: ({ match, history, highlight }) => (subCallListAccountId) => {
      highlight(OverviewTypes.CallList.SubAccount, subCallListAccountId);
      history.push(`/call-lists/account/${match.params.callListAccountId}/${subCallListAccountId}`);
    },
    select: ({ select, callListAccount }) => (event, { checked }) => {
      event.stopPropagation();
      select(callListAccount.uuid, checked);
    },

    loadMoreRows: ({
      getAccountOnCallList,
      match: {
        params: { callListAccountId },
      },
    }) => (pageIndex) => {
      getAccountOnCallList(callListAccountId, 'name', pageIndex);
    },
  }),
  lifecycle({
    componentWillMount() {
      this.props.getAccountOnCallList(this.props.match.params.callListAccountId, name, 0);
    },
    componentWillReceiveProps(nextProps) {
      if(nextProps.match.params.callListAccountId !== this.props.match.params.callListAccountId) {
        this.props.getAccountOnCallList(nextProps.match.params.callListAccountId, name, 0);
      }
    }
  }),
  branch(({ subCallListAccount, callListAccount }) => !subCallListAccount || !callListAccount, renderNothing)
)(InfiniteSubCallListAccountList);

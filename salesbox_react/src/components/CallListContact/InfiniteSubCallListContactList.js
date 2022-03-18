//@flow
import * as React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { compose, withHandlers, branch, renderNothing, withState, lifecycle } from 'recompose';
import { withRouter } from 'react-router';
import { InfiniteLoader, List, AutoSizer } from 'react-virtualized';
import { ContentLoader } from 'components/Svg';
import { ObjectTypes, OverviewTypes } from 'Constants';
import _l from 'lib/i18n';
import { Popup } from 'semantic-ui-react';
import * as OverviewActions from 'components/Overview/overview.actions';
import { isItemSelected, isItemHighlighted, getHighlighted } from 'components/Overview/overview.selectors';
import overviewCss from 'components/Overview/Overview.css';
import css from './CallListContactListRow.css';
import { getSubCallListContact, getCallListContact } from './callListContact.selector';
import { withGetData } from 'lib/hocHelpers';
import * as CallListContactActions from './callListContact.actions';
import { getSearch } from '../AdvancedSearch/advanced-search.selectors';
import addIcon from '../../../public/Add.svg';
import ListActionMenu from '../CallListContact/Menu/ListActionMenu';
import FilterActionMenu from '../../essentials/Menu/FilterActionMenu';
import { highlight } from '../Overview/overview.actions';

type PropsType = {
  callListContact: {},
  subCallListContact: {},
  selected: boolean,
  highlighted: boolean,
  showHistory: boolean,
  goto: () => void,
  select: (event: Event, { checked: boolean }) => void,
};

type PlaceholderPropsType = {
  className: string,
  style: {},
};

type HeaderPropsType = {
  overviewType: string,
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    'Resp.': 'Resp.',
    Name: 'Name',
    Sales: 'Sales',
    Profit: 'Profit',
    Gross: 'Gross',
    Weighted: 'Weighted',
  },
});


const fHeaderComponent = ({
  callListContact,
  subCallListContact,
  width,
  orderBy,
  handleSortColumn,
  addContactToCalllistContact,
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
        {/* <div>
          {callListContact && callListContact.name} */}
        {callListContact && callListContact.name && callListContact.name.length > 0 ? (
          callListContact.name.length > 32 ? (
            <Popup
              trigger={<div>{`${shortenValue(callListContact.name)}...`}{' '}<span className={css.count}> {subCallListContact && callListContact.numberContact}</span></div>}
              style={{ fontSize: 11 }}
              content={callListContact.name}
            />
          ) : (
              <div>{callListContact.name}{' '}<span className={css.count}> {subCallListContact && callListContact.numberContact}</span></div>
            )
        ) : (
            ''
          )}

        {/* </div> */}
        <div className={css.rightMenu}>
          <img
            className={`${css.add} ${css.iconCircle}`}
            src={addIcon}
            style={{ height: 15, width: 15, borderRadius: '50%' }}
            onClick={addContactToCalllistContact}
          />
          <FilterActionMenu
            imageClass={`${css.filter} `}
            objectType={ObjectTypes.SubCallListContact}
            data={callListContact}
            className={`${css.rightIcon} ${css.iconCircle} ${css.iconFiterDiv}`}
          />
        </div>
      </div>
      <div style={{ width }} className={`${css.header} ${css.marginNone}`}>
        <div
          className={`${css.contact} ${css.clickable} width76`}
          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
          onClick={() => handleSortColumn('firstName')}
        >
          {_l`Name`}
          <span className={orderBy === 'firstName' ? `${css.activeIcon} ${css.sortIcon}` : `${css.normalIcon}`}>
            <i class="angle down icon"></i>
          </span>
        </div>
        <div
          className={`${css.kpiTwo} ${css.clickable}`}
          style={{ paddingLeft: 40 }}
          onClick={() => handleSortColumn('numberCall')}
        >
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
  const itemHightlighted = getHighlighted(state, OverviewTypes.CallList.Contact);
  return {
    itemHightlighted,
  };
};
export const HeaderComponent = compose(
  connect(mapStateToProps, {
    getContactOnCallList: CallListContactActions.getContactOnCallList,
    highlight,
  }),
  withState('orderBy', 'setOrderBy', 'firstName'),
  withHandlers({
    handleSortColumn: ({ setOrderBy, callListContact, getContactOnCallList }) => (orderBy, objectType) => {
      setOrderBy(orderBy);
      if (callListContact && callListContact.uuid)
        getContactOnCallList(callListContact.uuid, 0, orderBy || 'firstName');
    },
    addContactToCalllistContact: ({ highlight, itemHightlighted }) => () => {
      let overviewT = OverviewTypes.CallList.Contact;
      highlight(overviewT, itemHightlighted, 'add_contact_to_calllist_contact');
    },
  })
)(fHeaderComponent);


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

const InfiniteSubCallListContactList = ({
  subCallListContact,
  goto,
  callListContact,
  overviewType,
  itemHightlighted,
  loadMoreRows
}: PropsType) => {
  let pageIndexSection = 0;
  const hasDetail = (location.pathname.match(/\//g) || []).length > 3;
  const widthPane = hasDetail ? 316 : 300;
  return (
    <div style={{ marginRight: hasDetail ? 0 : 16 }} className={css.container}>
      <HeaderComponent width={widthPane} callListContact={callListContact} subCallListContact={subCallListContact} />

      <InfiniteLoader
        autoReload={true}
        isRowLoaded={isRowRender(subCallListContact)}
        loadMoreRows={(param) => {
          const { stopIndex } = param;
          const pageIndex = Math.ceil(stopIndex / 25) - 1;
          if (pageIndexSection < pageIndex) {
            pageIndexSection = pageIndex;
            loadMoreRows(pageIndex);
          }
        }}
        threshold={1}
        rowCount={callListContact.numberContact}
      >
        {({ onRowsRendered, registerChild }) => {
          return (
            <AutoSizer>
              {({ width, height }) => (
                <List
                  // scrollToIndex={indexScrollTo}
                  height={height - 86}
                  className={css.list}
                  rowCount={(callListContact.numberContact !== 0 && subCallListContact.length === 0) ? 25 : subCallListContact.length}
                  rowHeight={60}
                  width={widthPane}
                  ref={registerChild}
                  onRowsRendered={onRowsRendered}
                  rowRenderer={getRowRender(subCallListContact, overviewType, goto, itemHightlighted)}
                  threshold={300}
                  data={subCallListContact}
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
    if (value && value.length > 20) {
      return value.slice(0, 20);
    }
    return value;
  };
  const shortenValueContact = (value) => {
    if (value && value.length > 30) {
      return value.slice(0, 30);
    }
    return value;
  };
  const listCn = cx(className, {
    [css.highlighted]: itemHightlighted === detail.contactId,
    [overviewCss.selected]: false,
  });
  return (
    <div className={listCn} style={style} onClick={() => goto(detail.contactId)}>
      <div className={`${css.contact} width113 font-bold`}>
        <div>
          {detail.organisationName ? (
            detail.name && detail.name.length > 0 ? (
              detail.name.length > 20 ? (
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
              )
          ) : detail.name && detail.name.length > 0 ? (
            detail.name.length > 30 ? (
              <Popup
                trigger={<div>{`${shortenValueContact(detail.name)}...`}</div>}
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
        <div style={{ fontWeight: 'normal' }}>
          {detail.organisationName && detail.organisationName.length > 0 ? (
            detail.organisationName.length > 16 ? (
              <Popup
                trigger={<div>{`${shortenValueAccount(detail.organisationName)}...`}</div>}
                style={{ fontSize: 11 }}
                content={detail.organisationName}
              />
            ) : (
                detail.organisationName
              )
          ) : (
              ''
            )}
        </div>
      </div>
      <div className={css.kpiTwo}>{detail.numberCall}</div>
      <div className={css.kpiTwo}>{detail.numberDial}</div>
      <div className={css.more}>
        <ListActionMenu className={css.bgMore} contact={detail} overviewType={OverviewTypes.CallList.SubContact} />
      </div>
    </div>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType, itemId, match }) => {
    const getStateSearch = getSearch(state, overviewType);
    return {
      selected: isItemSelected(state, overviewType, itemId),
      itemHightlighted: getHighlighted(state, OverviewTypes.CallList.SubContact),
      highlighted: isItemHighlighted(state, overviewType, itemId),
      callListContact: getCallListContact(state, match.params.callListContactId),
      subCallListContact: getSubCallListContact(state, match.params.callListContactId),
      showHistory: getStateSearch.history,
    };
  };
  return mapStateToProps;
};

export default compose(
  withRouter,
  connect(makeMapStateToProps, {
    getContactOnCallList: CallListContactActions.getContactOnCallList,
    highlight: OverviewActions.highlight,
  }),
  branch(({ subCallListContact, callListContact }) => !subCallListContact || !callListContact, renderNothing),
  withHandlers({
    goto: ({ match, history, highlight }) => (subCallListContactId) => {
      highlight(OverviewTypes.CallList.SubContact, subCallListContactId);
      history.push(`/call-lists/contact/${match.params.callListContactId}/${subCallListContactId}`);
    },
    select: ({ select, callListContact }) => (event, { checked }) => {
      event.stopPropagation();
      select(callListContact.uuid, checked);
    },
    loadMoreRows: ({
      getContactOnCallList,
      match: {
        params: { callListContactId },
      },
    }) => (pageIndex) => {
      getContactOnCallList(callListContactId, pageIndex);
    },
  }),
  lifecycle({
    componentWillMount() {
      this.props.getContactOnCallList(this.props.match.params.callListContactId, 0, 'firstName');
    },
    componentWillReceiveProps(nextProps) {
      if(nextProps.match.params.callListContactId !== this.props.match.params.callListContactId) {
        this.props.getContactOnCallList(nextProps.match.params.callListContactId, 0, 'firstName');
      }
      
    }
  })
)(InfiniteSubCallListContactList);

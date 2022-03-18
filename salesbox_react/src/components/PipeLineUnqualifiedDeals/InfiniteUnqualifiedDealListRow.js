//@flow
import * as React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { compose, withHandlers, branch, renderNothing, withState, lifecycle } from 'recompose';
import { withRouter } from 'react-router';
import { ContentLoader } from 'components/Svg';
import _l from 'lib/i18n';
import * as OverviewActions from 'components/Overview/overview.actions';
// import ContactPopup from 'components/CallListAccount/ContactAccountPopup';
import { isItemSelected, isItemHighlighted } from 'components/Overview/overview.selectors';
import { Icon, Checkbox, Progress, Popup } from 'semantic-ui-react';
import OverviewSelectAll from 'components/Overview/OverviewSelectAll';
import { Avatar, Thermometer } from 'components';
// import ContactActionMenu from 'components/Contact/ContactActionMenu/ContactActionMenu';
import { ContactActionMenu } from 'essentials';
import overviewCss from 'components/Overview/Overview.css';
import css from './UnqualifiedDealListRow.css';
import { makeGetUnqualifiedDeal } from './unqualifiedDeal.selector';
import moment from 'moment';
import { getSearch } from '../AdvancedSearch/advanced-search.selectors';
import { Colors } from 'Constants';
import ContactPopup from '../Contact/ContactPopup';
import { getOverview, isShowSpiner } from '../Overview/overview.selectors';
import { setOrderBy } from '../AdvancedSearch/advanced-search.actions';
import HistoryUnqualifiMenu from '../../essentials/Menu/HistoryUnqualifiMenu';
import CreatorPane from '../User/CreatorPane/CreatorPane';
import UnqualifiedDealActionMenu from '../../essentials/Menu/UnqualifiedDealActionMenu';
import UnqualifiedDealMutilActionMenu from '../../essentials/Menu/UnqualifiedDealMutilActionMenu';
import HistoryActionMenu from '../../essentials/Menu/HistoryActionMenu';
// import { changeOnMultiMenu } from '../PipeLineUnqualifiedDeals/unqualifiedDeal.actions';

// import { changeOnMutilTaskMenu } from '../Task/task.actions';
type PropsType = {
  unqualifiedDeal: {},
  className?: string,
  selected: boolean,
  highlighted: boolean,
  style: {},
  goto: () => void,
  setUnqualified: () => void,
  setActionInHistoryTask: () => void,
  select: (event: Event, { checked: boolean }) => void,
  declineDelegate: () => void,
  acceptedDelegate: () => void,
};

type PlaceholderPropsType = {
  className: string,
  style: {},
};
const historyTooltip = {
  fontSize: '11px',
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
    Created: 'Created',
    Closed: 'Closed',
    // Name: 'Name'
  },
});
const clockIcon = <Icon size="large" color={Colors.Pipeline} name="clock" className={css.icon} />;
const checkIcon = <Icon size="large" color={Colors.Pipeline} name="check circle" className={css.icon} />;

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

const daysLoader = (
  <ContentLoader width={32} height={44}>
    <rect x={8} y={16} rx={4} ry={4} width={16} height={8} />
  </ContentLoader>
);

export const HeaderFComponent = ({
  overviewType,
  width,
  orderBy,
  setOrderBy,
  objectType,
  showSpiner,
  changeOnMutilTaskMenu,
  historyOpen,
}) => {
  return (
    <div style={{ width }} className={css.header}>
      <div className={css.content}>
      <div className={css.check}>
        <OverviewSelectAll overviewType={overviewType} className={css.checkAll} />
      </div>
      {showSpiner && (
        <div className={css.check}>
          <UnqualifiedDealMutilActionMenu
            overviewType={overviewType}
            // changeOnMultiMenu={changeOnMultiMenu}
            className={css.bgMore}
          />
        </div>
      )}
      <div onClick={() => setOrderBy('priority', objectType)} className={cx(css.priority2)}>
        <span>
          {_l`Priority`}
          <span className={orderBy === 'priority' ? `${css.activeIcon}` : `${css.normalIcon}`}>
            <i class="angle down icon"></i>
          </span>
        </span>
      </div>
      <div onClick={() => setOrderBy('dateAndTime', objectType)} className={cx(css.deadline)}>
        <span>
          {historyOpen ? <div>{_l`Done`}</div> : <div>{_l`Next action`}</div>}
          <span className={orderBy === 'dateAndTime' ? `${css.activeIcon}` : `${css.normalIcon}`}>
            <i class="angle down icon"></i>
          </span>
        </span>
      </div>
      <div onClick={() => setOrderBy('accountContact', objectType)} className={cx(css.contact)}>
        <span>
          {_l`Name`}
          <span className={orderBy === 'accountContact' ? `${css.activeIcon}` : `${css.normalIcon}`}>
            <i class="angle down icon"></i>
          </span>
        </span>
      </div>
      <div onClick={() => setOrderBy('lineOfBusiness', objectType)} className={cx(css.interest)}>
        <span>
          {_l`Interested in`}
          <span className={orderBy === 'lineOfBusiness' ? `${css.activeIcon}` : `${css.normalIcon}`}>
            <i class="angle down icon"></i>
          </span>
        </span>
      </div>
      <div className={cx(css.days)}>{_l`Days`}</div>
      <div onClick={() => setOrderBy('owner', objectType)} className={cx(css.responsible)}>
        <span>
          {_l`Responsible`}
          <span className={orderBy === 'owner' ? `${css.activeIcon}` : `${css.normalIcon}`}>
            <i class="angle down icon"></i>
          </span>
        </span>
      </div>
      </div>
    </div>
  );
};

export const HeaderComponent = compose(
  connect(
    (state, { overviewType, objectType }) => {
      const search = getSearch(state, objectType);
      const overview = getOverview(state, overviewType);
      const showSpiner = isShowSpiner(state, overviewType);
      return {
        orderBy: search ? search.orderBy : 'priority',
        historyOpen: search.history,
        showSpiner: showSpiner,
        selectAll: overview.selectAll,
      };
    },
    {
      setOrderBy: (pram, objectType) => setOrderBy(objectType, pram),
      // changeOnMultiMenu: changeOnMultiMenu
    }
  ),
  withHandlers({
    sortByColumn: ({ sortByDate }) => (sortValue) => {
      sortByDate(sortValue);
    },
  })
)(HeaderFComponent);

export const PlaceholderComponent = ({ className, style }: PlaceholderPropsType) => {
  return (
    <div className={cx(css.loading, className)} style={style}>
      <div className={css.check}>{checkLoader}</div>
      <div className={css.source}>{daysLoader}</div>
      <div className={css.contact}>{noteLoader}</div>
      <div className={css.email}>{checkLoader}</div>
      <div className={css.days}>{checkLoader}</div>
      <div className={css.days}>{checkLoader}</div>
      <div className={css.source}>{daysLoader}</div>
      <div className={css.owner}>{daysLoader}</div>
      <div className={css.more}>{checkLoader}</div>
    </div>
  );
};

const InfiniteUnqualifiedDealListRow = ({
  overviewType,
  select,
  highlighted,
  unqualifiedDeal,
  style,
  className,
  goto,
  setUnqualified,
  setActionInHistoryTask,
  selected,
  width,
  showSpiner,
  acceptedDelegate,
  declineDelegate,
  openDetail,
  setopenDetail,
}: PropsType) => {
  const listCn = cx(css.itemRow, className, {
    [overviewCss.highlighted]: highlighted,
  });
  let email = '';
  let phone = '';
  const {
    organisationPhone,
    organisationEmail,
    finishedDate,
    deadlineDate,
    contactEmail,
    contactPhone,
    productList,
    lineOfBusiness,
    createdDate,
  } = unqualifiedDeal;
  const interestTitle = lineOfBusiness ? lineOfBusiness.name : '';
  const interestSubtitle =
    productList && productList.length > 0
      ? productList.map((p, index) => {
          return p.name;
        })
      : '';
  let subTitlte = interestSubtitle.toString();
  const closeDays = moment(finishedDate).diff(moment(createdDate), 'days');
  const days = moment().diff(moment(createdDate), 'days');

  const renderActionSpinder = () => {
    if (unqualifiedDeal.accepted === null && unqualifiedDeal.type === 'INVITED') {
      return (
        <div className={css.responsibleRow}>
          <CreatorPane
            size={30}
            creator={{ avatar: unqualifiedDeal.ownerAvatar, disc: unqualifiedDeal.ownerDiscProfile }}
            avatar={true}
          />
          <div className={css.invitedBtn}>
            <a onClick={acceptedDelegate} className={css.accpetInvited}>
              Accept
            </a>
            <a onClick={declineDelegate} className={css.declineInvited}>
              Decline
            </a>
          </div>
        </div>
      );
    }
    return (
      <div className={css.responsibleRow}>
        <CreatorPane
          size={30}
          creator={{ avatar: unqualifiedDeal.ownerAvatar, disc: unqualifiedDeal.ownerDiscProfile }}
          avatar={true}
        />
        <div className={css.rightMenu}>
          <div className={css.reponsibleIconSize}>
            <Popup
              style={historyTooltip}
              trigger={
                <div
                  className={
                    !unqualifiedDeal.finished
                      ? `${css.notSetasDone}`
                      : unqualifiedDeal.prospectId != null
                      ? `${css.hasConvert}`
                      : `${css.setDone}`
                  }
                  onClick={!unqualifiedDeal.finished ? setUnqualified : setActionInHistoryTask}
                >
                  <div></div>
                </div>
              }
              content={
                !unqualifiedDeal.finished ? _l`Close` : unqualifiedDeal.prospectId != null ? _l`Converted` : _l`Closed`
              }
              position="top center"
            />
          </div>

          <div className={css.reponsibleIconSize}>
            {!unqualifiedDeal.finished ? (
              <UnqualifiedDealActionMenu
                className={css.bgMore}
                unqualifiedDeal={unqualifiedDeal}
                overviewType={overviewType}
              />
            ) : // : <ContactActionMenu className={css.bgMore} contact={unqualifiedDeal} />
            unqualifiedDeal.prospectId != null ? (
              <div></div>
            ) : (
              <HistoryUnqualifiMenu className={css.bgMore} contact={unqualifiedDeal} overviewType={overviewType} />
            )}
          </div>
        </div>
      </div>
    );
  };
  const now = moment().valueOf();
  const pastDealLineDate = deadlineDate < now;
  const pastFinishDate = finishedDate < now;
  const onlyConnectAccount = !unqualifiedDeal.contactId && unqualifiedDeal.organisationId;

  let limit = 0;
  let url = window.location.pathname
  let screen_width = window.innerWidth;
  if (screen_width == 1920) limit = 85
  else if (screen_width > 1344) limit = 60
  else if (screen_width <= 1344){
    if(url.length > 15) limit = 35
    else limit = 55
  }
  const shortenValue = (value) => {
    if (value && value.length > limit) {
      return value.slice(0, limit);
    }
    return value;
  };

  // const countProduct = typeof interestSubtitle;
  email = contactEmail ? contactEmail : organisationEmail;
  phone = contactPhone ? contactPhone : organisationPhone;
  return (
    <React.Fragment>
      <div className={listCn} style={style} onClick={goto}>
        <div className={`${css.content} ${css[unqualifiedDeal.status]}`}>


        <div className={css.check}>
          <Checkbox onChange={select} checked={selected} />
        </div>
        {showSpiner && <div className={css.check}></div>}
        <div className={css.priority2}>
          <Thermometer unQualified={unqualifiedDeal} small degree={unqualifiedDeal.priority} />
        </div>
        <div className={css.deadline}>
          {!unqualifiedDeal.finished ? (
            <div className={pastDealLineDate ? css.oldDeadline : null}>
              {finishedDate === null ? (deadlineDate ? moment(deadlineDate).format('DD MMM YYYY') : '') : ''}
            </div>
          ) : (
            <div className={pastFinishDate ? css.oldDeadline : null}>
              <p>{moment(finishedDate).format('DD MMM YYYY HH:mm')}</p>
            </div>
          )}
        </div>
        <div className={css.contact}>
          <div className={cx(css.responsibleRow, css.nameRow)}>
            <div style={{ marginRight: 5 }}>
              <div className={css.customName}>
                {unqualifiedDeal.contactFirstName} {unqualifiedDeal.contactLastName}{' '}
              </div>
              <div className={onlyConnectAccount && css.customName}>{unqualifiedDeal.organisationName}</div>
            </div>
            <ContactPopup triggerClassName={css.infoTrigger} name={''} email={email} phone={phone} />
          </div>
        </div>

        <div className={css.interest1}>
          <div>
            {interestTitle && interestTitle.length > 0 ? (
              interestTitle.length > limit ? (
                <Popup
                  trigger={<div>{`${shortenValue(interestTitle)}...`}</div>}
                  style={{ fontSize: 11 }}
                  content={interestTitle}
                />
              ) : (
                interestTitle
              )
            ) : (
              ''
            )}
          </div>
          <div>
            {interestSubtitle && interestSubtitle.length > 0 ? (
              subTitlte.length > limit ? (
                <Popup
                  trigger={<div>{`${shortenValue(subTitlte)}...`}</div>}
                  style={{ fontSize: 11 }}
                  content={subTitlte}
                />
              ) : (
                subTitlte
              )
            ) : (
              ''
            )}
          </div>
        </div>

        <div className={css.days}>
          {/* {(unqualifiedDeal.type !== 'DISTRIBUTE' && unqualifiedDeal.finishedDate !== null) ?
            unqualifiedDeal.finishedDate : 0} */}
          {!unqualifiedDeal.finished ? (
            <div className={css.daysFont}>{days}</div>
          ) : (
            <div className={css.daysFont}>{closeDays}</div>
          )}
        </div>

        {/*        <div className={css.responsible}>
          <div className={css.responsibleRow}>
          <CreatorPane size={30} creator={{ avatar: unqualifiedDeal.ownerAvatar }} avatar={true} />
            <div className={css.rightMenu}>
              <div className={css.reponsibleIconSize}>
                <div className={!unqualifiedDeal.finished ? `${css.notSetasDone}` : `${css.setDone}`} onClick={setUnqualified}>
                  <div></div>
                </div>
              </div>

              <div className={css.reponsibleIconSize}>
              {unqualifiedDeal.finished ? <HistoryUnqualifiMenu className={css.bgMore} contact={unqualifiedDeal} />
               // : <ContactActionMenu className={css.bgMore} contact={unqualifiedDeal} />
               : <UnqualifiedDealActionMenu className={css.bgMore}  unqualifiedDeal={unqualifiedDeal} overviewType={overviewType}  />
               }

              </div>
            </div>
          </div>
        </div>*/}
        <div className={css.responsible}>{renderActionSpinder(unqualifiedDeal)}</div>
        </div>
      </div>
    </React.Fragment>
  );
};

const makeMapStateToProps = () => {
  const getUnqualifiedDeal = makeGetUnqualifiedDeal();

  const mapStateToProps = (state, { overviewType, itemId }) => {
    const showSpiner = isShowSpiner(state, overviewType);
    return {
      unqualifiedDeal: getUnqualifiedDeal(state, itemId),
      selected: isItemSelected(state, overviewType, itemId),
      highlighted: isItemHighlighted(state, overviewType, itemId),
      showSpiner: showSpiner,
    };
  };
  return mapStateToProps;
};

export default compose(
  withRouter,
  withState('openDetail', 'setopenDetail', false),
  connect(makeMapStateToProps, {
    highlight: OverviewActions.highlight,
  }),
  // lifecycle({
  //   componentDidMount(){
  //   }
  // }),
  branch(({ unqualifiedDeal }) => !unqualifiedDeal, renderNothing),
  withHandlers({
    goto: ({ unqualifiedDeal, history, route = '/pipeline/leads', highlight, overviewType, openDetail, setopenDetail }) => (e) => {
      e.stopPropagation();
      setopenDetail(true)
      highlight(overviewType, unqualifiedDeal.uuid);
      history.push(`${route}/${unqualifiedDeal.uuid}`);
    },
    setUnqualified: ({ overviewType, highlight, unqualifiedDeal }) => (e) => {
      e.stopPropagation();
      highlight(overviewType, unqualifiedDeal.uuid, 'set');
    },
    setActionInHistoryTask: () => (e) => {
      e.stopPropagation();
    },
    select: ({ select, unqualifiedDeal }) => (event, { checked }) => {
      event.stopPropagation();
      select(unqualifiedDeal.uuid, checked);
    },
    acceptedDelegate: ({ overviewType, highlight, unqualifiedDeal }) => (e) => {
      e.stopPropagation();
      highlight(overviewType, unqualifiedDeal.uuid, 'acceptedDelegate');
    },
    declineDelegate: ({ overviewType, highlight, unqualifiedDeal }) => (e) => {
      e.stopPropagation();
      highlight(overviewType, unqualifiedDeal.uuid, 'declineDelegate');
    },
  })
)(InfiniteUnqualifiedDealListRow);

/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-bind */
//@flow
import * as React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { compose, withHandlers, branch, renderNothing, withState } from 'recompose';
import { withRouter } from 'react-router';
import { ContentLoader } from 'components/Svg';
import _l from 'lib/i18n';
import * as OverviewActions from 'components/Overview/overview.actions';
import { Checkbox, Popup } from 'semantic-ui-react';
import OverviewSelectAll from 'components/Overview/OverviewSelectAll';
import overviewCss from 'components/Overview/Overview.css';
import css from './QualifiedDealListRow.css';
import moment from 'moment';
import { getSearch } from '../AdvancedSearch/advanced-search.selectors';
import { getOverview, isShowSpiner, isItemSelected, isItemHighlighted } from '../Overview/overview.selectors';
import { getQualified } from './qualifiedDeal.selector';
import { setOrderBy, setFilter } from '../AdvancedSearch/advanced-search.actions';
import CreatorPane from '../User/CreatorPane/CreatorPane';
import QualifiedDealActionMenu from '../../essentials/Menu/QualifiedDealActionMenu';
import QualifiedDealMutilActionMenu from '../../essentials/Menu/QualifiedDealMutilActionMenu';
import QualifiedCircle from '../Svg/QualifiedCircle';
import CircularProgressBar from 'components/CircularProgressBar/CircularProgressBar';
import { checkBorder } from './TaskSteps/CardStep';
import { setFavoriteDeal, fetchNumberOrderRow } from './qualifiedDeal.actions';
import starCWon from '../../../public/star_circle_won.svg';
import starWonHeader from '../../../public/star_circle_won_header.svg';
import starLost from '../../../public/star_circle_lost.svg';
import starLostHeader from '../../../public/star_circle_lost_header.svg';
import starWonActive from '../../../public/star_circle_won_active.svg';
import starLostActive from '../../../public/star_circle_lost_active.svg';
import starIcon from '../../../public/myStar.svg';
import starIconActive from '../../../public/myStar_active.png';
import { OverviewTypes } from '../../Constants';
import DescriptionPopup from './DescriptionPopup';
import { showHideMassPersonalMail } from '../Overview/overview.actions';

type PropsType = {
  unqualifiedDeal: {},
  className?: string,
  selected: boolean,
  highlighted: boolean,
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
};

addTranslations({
  'en-US': {
    '{0}': '{0}',
    'Resp.': 'Resp.',
    Name: 'Name',
    Sales: 'Sales',
    Profit: 'Profit',
    Gross: 'Gross',
    Net: 'Net',
    Created: 'Created',
    Closed: 'Closed',
    Value: 'Value',
    Progress: 'Progress',
    Won: 'Won',
    Lost: 'Lost',
    'Won/Lost': 'Won/Lost',
  },
});

const checkLoader = (
  <ContentLoader width={48} height={48}>
    <rect x={12} y={12} rx={4} ry={4} width={24} height={24} />
  </ContentLoader>
);

const scrWidth = screen.width;
if (scrWidth <= 1400) {
  var limit = 21;
} else if (scrWidth >= 1820) {
  var limit = 42;
} else if (1400 < scrWidth < 1820) {
  var limit = 23;
}

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
  onHoverWon,
  setOnHoverWon,
  onHoverLost,
  setOnHoverLost,
  setOrderBy,
  objectType,
  showSpiner,
  historyOpen,
  setFilter,
  filterBy,
  onHoverFavorite,
  setOnHoverFavorite,
  qualifiedDeal,
}) => {
  return (
    <div style={{ width }} className={css.header}>
      <div className={css.content} style={{paddingTop: '10px'}}>
        <div className={css.check}>
          <OverviewSelectAll overviewType={overviewType} className={css.checkAll} />
        </div>
        {showSpiner && (
          <div className={css.check}>
            <QualifiedDealMutilActionMenu
              showHideMassPersonalMail={showHideMassPersonalMail}
              overviewType={overviewType}
              className={css.bgMore}
            />
          </div>
        )}
        <div
          style={{ width: overviewType === OverviewTypes.Pipeline.Order ? '20%' : '15%' }}
          className={overviewType === OverviewTypes.Pipeline.Order ? css.progressSale : cx(css.progressSale)}
          onClick={() => {
            if (overviewType === OverviewTypes.Pipeline.Order) {
              setOrderBy('wonLost', objectType);
            } else {
              setOrderBy('opportunityProgress', objectType);
            }
          }}
        >
          {overviewType === OverviewTypes.Pipeline.Order && (
            <span>
              {_l`Won/Lost`}
              <span
                className={
                  (overviewType === OverviewTypes.Pipeline.Order
                  ? orderBy === 'wonLost'
                  : orderBy === 'opportunityProgress')
                    ? `${css.activeIcon}`
                    : `${css.normalIcon}`
                }
              >
                <i className="angle down icon" />
              </span>
            </span>
          )}
          {overviewType === OverviewTypes.Pipeline.Qualified && (
            <span>
              {_l`Progress`}
              <span className={orderBy === 'opportunityProgress' ? `${css.activeIcon}` : `${css.normalIcon}`}>
                <i className="angle down icon" />
              </span>
            </span>
          )}
        </div>
        <div
          style={{ width: overviewType === OverviewTypes.Pipeline.Order ? '30%' : '20%' }}
          className={cx(css.priority2)}
          onClick={() => setOrderBy('accountContactName', objectType)}
        >
          <span>
            {_l`Name`}
            <span className={orderBy === 'accountContactName' ? `${css.activeIcon}` : `${css.normalIcon}`}>
              <i className="angle down icon" />
            </span>
          </span>
        </div>
        <div
          style={{ width: overviewType === OverviewTypes.Pipeline.Order ? '15%' : '10%' }}
          className={cx(css.deadline)}
          onClick={() => setOrderBy('grossValue', objectType)}
        >
          <span>
            {_l`Value`}
            <span className={orderBy === 'grossValue' ? `${css.activeIcon}` : `${css.normalIcon}`}>
              <i className="angle down icon" />
            </span>
          </span>
        </div>
        {/* {overviewType === OverviewTypes.Pipeline.Order && (
        <div className={cx(css.contact)} onClick={() => setOrderBy('profit', objectType)}>
          <span>
            {_l`Profit`}
          <span className={orderBy === 'profit' ? `${css.activeIcon}` : `${css.normalIcon}`}>
            <i className="angle down icon" />
          </span>
          </span>
        </div>
      )} */}
        <div className={css.preload}>
          <img src={starLostActive} />
          <img src={starWonActive} />
        </div>
        <div className={cx(css.blank)} />
        <div className={cx(css.interest)} onClick={() => setOrderBy('contractDate', objectType)}>
          <span>
            {_l`When`}
            <span className={orderBy === 'contractDate' ? `${css.activeIcon}` : `${css.normalIcon}`}>
              <i className="angle down icon" />
            </span>
          </span>
        </div>
        {overviewType === OverviewTypes.Pipeline.Qualified && <div className={cx(css.suggested)}>{_l`Next step`}</div>}
        {overviewType === OverviewTypes.Pipeline.Qualified && (
          <div className={cx(css.won)}>
            {onHoverWon ? (
              <img
                onMouseEnter={() => {
                  setOnHoverWon(true);
                }}
                onMouseLeave={() => {
                  setOnHoverWon(false);
                }}
                style={{ height: '18px', width: '18px' }}
                src={starWonActive}
              />
            ) : (
              <img
                onMouseEnter={() => {
                  setOnHoverWon(true);
                }}
                onMouseLeave={() => {
                  setOnHoverWon(false);
                }}
                style={{ height: '18px', width: '18px' }}
                src={starWonHeader}
              />
            )}
          </div>
        )}
        {overviewType === OverviewTypes.Pipeline.Qualified && (
          <div className={cx(css.lost)}>
            {onHoverLost ? (
              <img
                onMouseEnter={() => {
                  setOnHoverLost(true);
                }}
                onMouseLeave={() => {
                  setOnHoverLost(false);
                }}
                style={{ height: '18px', width: '18px' }}
                src={starLostActive}
              />
            ) : (
              <img
                onMouseEnter={() => {
                  setOnHoverLost(true);
                }}
                onMouseLeave={() => {
                  setOnHoverLost(false);
                }}
                style={{ height: '18px', width: '18px' }}
                src={starLostHeader}
              />
            )}
          </div>
        )}
        <div className={cx(css.responsible)} onClick={() => setOrderBy('owner', objectType)}>
          <span>
            {_l`Responsible`}
            <span className={orderBy === 'owner' ? `${css.activeIcon}` : `${css.normalIcon}`}>
              <i className="angle down icon" />
            </span>
          </span>
        </div>
        <div
          className={cx(css.favorite)}
          onClick={() => (filterBy === 'favorite' ? setFilter('', objectType) : setFilter('favorite', objectType))}
        >
          <span>
            {onHoverFavorite || filterBy === 'favorite' ? (
              <div className={css.circleButtonActive}>
                <img
                  style={{ height: '15px', width: '15px' }}
                  src={starIconActive}
                  onMouseEnter={() => {
                    setOnHoverFavorite(true);
                  }}
                  onMouseLeave={() => {
                    setOnHoverFavorite(false);
                  }}
                />
              </div>
            ) : (
              <div className={css.circleButton}>
                <img
                  style={{ height: '15px', width: '15px' }}
                  src={starIcon}
                  onMouseEnter={() => {
                    setOnHoverFavorite(true);
                  }}
                  onMouseLeave={() => {
                    setOnHoverFavorite(false);
                  }}
                />
              </div>
            )}

            {/* <span className={filterBy === 'favorite' ? `${css.activeIcon}` : `${css.normalIcon}`}>
            <i className="angle down icon" />
          </span> */}
          </span>
        </div>
        <div className={cx(css.spiner)} />
      </div>
    </div>
  );
};

export const HeaderComponent = compose(
  connect(
    (state, { overviewType, objectType, itemId }) => {
      const search = getSearch(state, objectType);
      const overview = getOverview(state, overviewType);
      const showSpiner = isShowSpiner(state, overviewType);

      return {
        qualifiedDeal: getQualified(state, itemId),
        orderBy: search
          ? search.orderBy
          : overviewType === OverviewTypes.Pipeline.Order
          ? 'contractDate'
          : 'opportunityProgress',
        historyOpen: search.history,
        showSpiner: showSpiner,
        selectAll: overview.selectAll,
        filterBy: search ? search.filter : '',
      };
    },
    {
      setOrderBy: (pram, objectType) => setOrderBy(objectType, pram),
      setFilter: (pram, objectType) => setFilter(objectType, pram),
      showHideMassPersonalMail: (s) => showHideMassPersonalMail(s),
      // changeOnMultiMenu: changeOnMultiMenu
    }
  ),
  withState('onHoverWon', 'setOnHoverWon', false),
  withState('onHoverLost', 'setOnHoverLost', false),
  withState('onHoverFavorite', 'setOnHoverFavorite', false),

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
  style,
  className,
  goto,
  selected,
  showSpiner,
  qualifiedDeal,
  setFavoriteDeal,
  onHoverWon,
  setOnHoverWon,
  onHoverLost,
  setOnHoverLost,
  setLostDeal,
  setWonDeal,
}: PropsType) => {
  const listCn = cx(css.itemRow, className, {
    [overviewCss.highlighted]: highlighted,
  });
  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const shortenValue = (value) => {
    if (value && value.length > limit) {
      return value.slice(0, limit);
    }
    return value;
  };

  const contactName =
    qualifiedDeal.sponsorList && qualifiedDeal.sponsorList[0].firstName && qualifiedDeal.sponsorList[0].lastName
      ? qualifiedDeal.sponsorList[0].firstName + ' ' + qualifiedDeal.sponsorList[0].lastName
      : '';
  const borderColorCheck = checkBorder(qualifiedDeal);
  const progressBorberColor =
    borderColorCheck === 'GREEN' ? '#aacd40' : borderColorCheck === 'GREEN' ? '#f4b24e' : '#df5759';

  // const pastDealLineDate = deadlineDate < now;
  let contractDate = qualifiedDeal.contractDate;
  let styleNextAction =
    contractDate != null && qualifiedDeal.won !== true && qualifiedDeal.won !== false
      ? moment(new Date(contractDate)).isSameOrAfter(moment(new Date())) ||
        moment(new Date(contractDate)).isSame(moment(new Date()), 'day')
        ? null
        : css.oldDeadline
      : null;

  return (
    <React.Fragment>
      <div className={listCn} style={style} onClick={goto}>
        <div className={css.content}>
          <div className={css.check}>
            <Checkbox onChange={select} checked={selected} />
          </div>
          {/* {showSpiner && <div className={css.check} />} */}
          <div
            style={{ width: overviewType === OverviewTypes.Pipeline.Order ? '20%' : '15%' }}
            className={css.progressSale}
          >
            {overviewType === OverviewTypes.Pipeline.Qualified && (
              <div>
                <CircularProgressBar
                  // textStyle={css.font24}
                  color={progressBorberColor}
                  width={50}
                  height={50}
                  percentage={qualifiedDeal.realProspectProgress}
                />
                {/* <QualifiedCircle
                width={40}
                height={40}
                percent={qualifiedDeal.realProspectProgress}
                radius={18}
                color={'rgb(225, 86, 86)'}
              /> */}
              </div>
            )}
            {overviewType === OverviewTypes.Pipeline.Order && qualifiedDeal.won === true && (
              <div style={{ height: '40px', width: '40px' }}>
                <img style={{ height: '38px', width: '38px' }} src={starWonActive} />
              </div>
            )}
            {overviewType === OverviewTypes.Pipeline.Order && qualifiedDeal.won === false && (
              <div style={{ height: '40px', width: '40px' }}>
                <img style={{ height: '38px', width: '38px' }} src={starLostActive} />
              </div>
            )}
          </div>
          <div
            style={{ width: overviewType === OverviewTypes.Pipeline.Order ? '30%' : '20%' }}
            className={cx(css.priority2, css.Progress)}
          >
            <div className={css.organisationName}>
              <div className={cx(css.responsibleRow, css.nameRow)}>
                <div className={cx(css.customName)}>
                  {qualifiedDeal.organisation ? (
                    qualifiedDeal.organisation.name.length > limit ? (
                      <Popup
                        trigger={<div>{`${shortenValue(qualifiedDeal.organisation.name)}...`}</div>}
                        style={{ fontSize: 11 }}
                        content={qualifiedDeal.organisation.name}
                      />
                    ) : (
                      qualifiedDeal.organisation.name
                    )
                  ) : qualifiedDeal.sponsorList && qualifiedDeal.sponsorList.length > 0 ? (
                    contactName.length > limit ? (
                      <Popup
                        trigger={<div>{`${shortenValue(contactName)}...`}</div>}
                        style={{ fontSize: 11 }}
                        content={contactName}
                      />
                    ) : (
                      contactName
                    )
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div>
                {qualifiedDeal.description && qualifiedDeal.description.length < limit ? (
                  qualifiedDeal.description
                ) : (
                  <Popup
                    trigger={<div>{`${shortenValue(qualifiedDeal.description)}...`}</div>}
                    style={{ fontSize: 11 }}
                    content={qualifiedDeal.description}
                  />
                )}
              </div>
            </div>
          </div>
          <div
            style={{ width: overviewType === OverviewTypes.Pipeline.Order ? '15%' : '10%' }}
            className={cx(css.deadline, css.grossValue)}
          >
            {numberWithCommas(Math.ceil(qualifiedDeal.grossValue))}
          </div>
          {/* {overviewType === OverviewTypes.Pipeline.Order && (
            <div className={cx(css.contact, css.textYellow)}>{numberWithCommas(Math.ceil(qualifiedDeal.profit))}</div>
        )} */}
          <div className={cx(css.blank)} />
          <div className={cx(css.interest, css.when)}>
            {qualifiedDeal.won !== true && qualifiedDeal.won !== false && (
              <div className={styleNextAction != null ? cx(css.when, styleNextAction) : cx(css.when)}>
                {qualifiedDeal.contractDate ? moment(qualifiedDeal.contractDate).format('DD MMM YYYY') : ''}
              </div>
            )}
            {(qualifiedDeal.won === false || qualifiedDeal.won) === true && (
              <div className={cx(css.when)}>
                {qualifiedDeal.wonLostDate ? moment(qualifiedDeal.wonLostDate).format('DD MMM YYYY') : ''}
              </div>
            )}
          </div>

          {overviewType === OverviewTypes.Pipeline.Qualified && (
            <div className={css.suggested}>
              <DescriptionPopup
                triggerClassName={css.description}
                firstNextStep={qualifiedDeal.firstNextStep}
                descriptionFirstNextStep={qualifiedDeal.descriptionFirstNextStep}
              />
            </div>
            // <div className={cx(css.suggested, css.textYellow)}>{qualifiedDeal.firstNextStep}</div>
          )}
          {overviewType === OverviewTypes.Pipeline.Qualified && (
            <div className={cx(css.days)}>
              {qualifiedDeal.won !== true && qualifiedDeal.won !== false && (
                <a
                  className={cx(css.star)}
                  onClick={setWonDeal}
                  onMouseEnter={() => {
                    setOnHoverWon(true);
                  }}
                  onMouseLeave={() => {
                    setOnHoverWon(false);
                  }}
                >
                  {onHoverWon ? (
                    <img style={{ height: '18px', width: '18px' }} src={starWonActive} />
                  ) : (
                    <img style={{ height: '18px', width: '18px' }} src={starCWon} />
                  )}
                </a>
              )}
            </div>
          )}
          {overviewType === OverviewTypes.Pipeline.Qualified && (
            <div className={cx(css.days)}>
              {qualifiedDeal.won !== false && (
                <a
                  className={cx(css.star, css.lostHover)}
                  onClick={setLostDeal}
                  onMouseEnter={() => {
                    setOnHoverLost(true);
                  }}
                  onMouseLeave={() => {
                    setOnHoverLost(false);
                  }}
                >
                  {onHoverLost ? (
                    <img style={{ height: '18px', width: '18px' }} src={starLostActive} />
                  ) : (
                    <img style={{ height: '18px', width: '18px' }} src={starLost} />
                  )}
                </a>
              )}
            </div>
          )}
               <div className={cx(css.responsible, css.alignCenter)}>
            {
              <CreatorPane
                size={30}
                creator={{
                  firstName: qualifiedDeal.ownerName?.split(' ')?.[0],
                  lastName: qualifiedDeal.ownerName?.split(' ')?.[1],
                  avatar: qualifiedDeal.ownerAvatar,
                  disc: qualifiedDeal.ownerDiscProfile,
                }}
                firstName={qualifiedDeal.ownerName?.split(' ')?.[0]}
                lastName={qualifiedDeal.ownerName?.split(' ')?.[1]}
                avatar={true}
              />
            }
          </div>
          <div className={css.favorite}>
            {qualifiedDeal.favorite && (
              <div className={css.circleButtonActive} onClick={setFavoriteDeal}>
                <img style={{ height: '15px', width: '15px' }} src={starIconActive} />
              </div>
            )}
            {!qualifiedDeal.favorite && (
              <div className={css.circleButton} onClick={setFavoriteDeal}>
                <img style={{ height: '15px', width: '15px' }} src={starIcon} />
              </div>
            )}
          </div>
          <div className={cx(css.spiner, css.spinerRow)}>
            <QualifiedDealActionMenu
              qualifiedDeal={qualifiedDeal}
              className={css.bgMore}
              overviewType={overviewType}
              hideWonLost={true}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const makeMapStateToProps = () => {
  const mapStateToProps = (state, { overviewType, itemId }) => {
    const showSpiner = isShowSpiner(state, overviewType);
    return {
      qualifiedDeal: getQualified(state, itemId),
      selected: isItemSelected(state, overviewType, itemId),
      highlighted: isItemHighlighted(state, overviewType, itemId),
      showSpiner: showSpiner,
    };
  };
  return mapStateToProps;
};

export default compose(
  withRouter,
  connect(makeMapStateToProps, {
    highlight: OverviewActions.highlight,
    setFavoriteDeal,
    fetchNumberOrderRow,
  }),
  branch(({ qualifiedDeal }) => !qualifiedDeal, renderNothing),
  withState('onHoverWon', 'setOnHoverWon', false),
  withState('onHoverLost', 'setOnHoverLost', false),
  withHandlers({
    goto: ({ qualifiedDeal, history, route = '/pipeline/overview', highlight, overviewType }) => (e) => {
      e.stopPropagation();
      highlight(overviewType, qualifiedDeal.uuid);
      history.push(`${route}/${qualifiedDeal.uuid}`);
    },
    setActionInHistoryTask: () => (e) => {
      e.stopPropagation();
    },
    select: ({ select, qualifiedDeal }) => (event, { checked }) => {
      event.stopPropagation();
      select(qualifiedDeal.uuid, checked);
    },
    setFavoriteDeal: ({ qualifiedDeal, setFavoriteDeal }) => (e) => {
      e.stopPropagation();
      setFavoriteDeal(qualifiedDeal.uuid, !qualifiedDeal.favorite);
    },
    setLostDeal: ({ highlight, overviewType, qualifiedDeal }) => (e) => {
      e.stopPropagation();
      highlight(overviewType, qualifiedDeal.uuid, 'set_lost_qualified_deal');
    },
    setWonDeal: ({ fetchNumberOrderRow, overviewType, qualifiedDeal }) => (e) => {
      e.stopPropagation();
      fetchNumberOrderRow(qualifiedDeal.uuid, overviewType);
    },
  })
)(InfiniteUnqualifiedDealListRow);

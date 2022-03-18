/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
//@flow
import * as React from 'react';
import { Icon, Checkbox } from 'semantic-ui-react';

import { connect } from 'react-redux';
import { compose, withHandlers, branch, renderNothing } from 'recompose';
import { withRouter } from 'react-router';
import moment from 'moment';

import { ContentLoader } from 'components/Svg';
import ContactPopup from 'components/Contact/ContactPopup';
import { Thermometer } from 'components';

import { isItemSelected, isItemHighlighted, isShowSpiner, getOverview } from 'components/Overview/overview.selectors';
import { setOrderBy } from '../AdvancedSearch/advanced-search.actions';
import { getSearch } from '../AdvancedSearch/advanced-search.selectors';
import { makeGetLead } from './lead.selector';

import cx from 'classnames';
import overviewCss from 'components/Overview/Overview.css';
import * as OverviewActions from 'components/Overview/overview.actions';
import css from '../PipeLineUnqualifiedDeals/UnqualifiedDealListRow.css';

import OverviewSelectAll from 'components/Overview/OverviewSelectAll';
import UnqualifiedDealMutilActionMenu from '../../essentials/Menu/UnqualifiedDealMutilActionMenu';
import CreatorPane from '../User/CreatorPane/CreatorPane';
import DelegationLeadActionMenu from '../../essentials/Menu/DelegationLeadActionMenu';
import HistoryUnqualifiMenu from '../../essentials/Menu/HistoryUnqualifiMenu';
import { getCompanyAvgDistributionDays } from '../Task/task.selector';

import _l from 'lib/i18n';

type PropsType = {
  lead: {},
  className?: string,
  selected: boolean,
  highlighted: boolean,
  style: {},
  goto: () => void,
  overviewType: string,
  select: (event: Event, { checked: boolean }) => void,
};

type PlaceholderPropsType = {
  className: string,
  style: {},
};
addTranslations({
  'en-US': {
    Deadline: 'Deadline',
    Priority: 'Priority',
    'Interested in': 'Interested in',
    Note: 'Note',
    Days: 'Days',
    Source: 'Source',
    Name: 'Name',
  },
});

const clockIcon = <Icon size="large" color="green" name="clock" className={css.icon} />;

const priorityLoader = (
  <ContentLoader width={48} height={48}>
    <circle cx={16} cy={24} r={12} height={24} />
    <rect x={36} y={0} width={6} height={48} />
  </ContentLoader>
);

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

const deadlineLoader = (
  <ContentLoader width={128} height={44}>
    <rect x={8} y={16} rx={4} ry={4} width={96} height={8} />
  </ContentLoader>
);

const daysLoader = (
  <ContentLoader width={32} height={44}>
    <rect x={8} y={16} rx={4} ry={4} width={16} height={8} />
  </ContentLoader>
);

export const HeaderFComponent = ({ width, overviewType, orderBy, historyOpen, showSpiner, setOrderBy, objectType }) => (
  <div style={{ width }} className={css.header}>
    <div className={css.content}>
    <div className={css.check}>
      <OverviewSelectAll overviewType={overviewType} className={css.checkAll} />
    </div>
    {showSpiner && (
      <div className={css.check}>
        <UnqualifiedDealMutilActionMenu overviewType={overviewType} className={css.bgMore} />
      </div>
    )}
    <div className={cx(css.priority2)} onClick={() => setOrderBy('priority', objectType)}>
      <span>
        {_l`Priority`}
        <span className={orderBy === 'priority' ? `${css.activeIcon}` : `${css.normalIcon}`}>
          <i className="angle down icon" />
        </span>
      </span>
    </div>
    <div className={cx(css.deadline)} onClick={() => setOrderBy('dateAndTime', objectType)}>
      <span>
        {historyOpen ? <div>{_l`Created/Closed`}</div> : <div>{_l`Deadline`}</div>}
        <span className={orderBy === 'dateAndTime' ? `${css.activeIcon}` : `${css.normalIcon}`}>
          <i className="angle down icon" />
        </span>
      </span>
    </div>
    <div className={cx(css.contact)} onClick={() => setOrderBy('accountContact', objectType)}>
      <span>
        {_l`Name`}
        <span className={orderBy === 'accountContact' ? `${css.activeIcon}` : `${css.normalIcon}`}>
          <i className="angle down icon" />
        </span>
      </span>
    </div>
    <div className={cx(css.interest)} onClick={() => setOrderBy('lineOfBusiness', objectType)}>
      <span>
        {_l`Interested in`}
        <span className={orderBy === 'lineOfBusiness' ? `${css.activeIcon}` : `${css.normalIcon}`}>
          <i className="angle down icon" />
        </span>
      </span>
    </div>
    <div className={cx(css.days)}>{historyOpen ? <div /> : <div>{_l`Days`}</div>}</div>
    <div className={cx(css.responsible)} onClick={() => setOrderBy('owner', objectType)}>
      <span>
        {_l`Source`}
        <span className={orderBy === 'owner' ? `${css.activeIcon}` : `${css.normalIcon}`}>
          <i className="angle down icon" />
        </span>
      </span>
    </div>
    </div>
  </div>
);

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
      <div className={css.priority}>{priorityLoader}</div>
      <div className={css.start}>{deadlineLoader}</div>
      <div className={css.contact}>{noteLoader}</div>
      <div className={css.interestedIn}>{noteLoader}</div>
      <div className={css.days}>{checkLoader}</div>
      <div className={css.source}>{daysLoader}</div>
    </div>
  );
};

const InfiniteLeadListRow = ({
  overviewType,
  select,
  highlighted,
  lead,
  style,
  className,
  goto,
  selected,
  showSpiner,
  companyAvgDistributionDays,
}: PropsType) => {
  const color = lead.status === 'unqualified' ? 'YELLOW' : 'GREEN';

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
    acceptedDelegate,
    declineDelegate,
  } = lead;
  const interestTitle = lineOfBusiness ? lineOfBusiness.name : '';
  const interestSubtitle =
    productList && productList.length > 0
      ? productList.map((p, index) => {
          return <div key={index}>{p.name}</div>;
        })
      : '';
  const days = moment().diff(moment(createdDate), 'days');
  const onlyConnectAccount = !lead.contactId && lead.organisationId;

  email = contactEmail ? contactEmail : organisationEmail;
  phone = contactPhone ? contactPhone : organisationPhone;

  const renderActionSpinder = (lead) => {

    if (lead.accepted === null && lead.type === 'INVITED') {
      return (
        <div className={css.responsibleRow}>
          <CreatorPane
            size={30}
            creator={{ avatar: lead.creatorAvatar, disc: lead.creatorDiscProfile,
              firstName: lead.creatorFirstName|| '', lastName: lead.creatorLastName|| '' }}
            firstName={lead.creatorFirstName|| ''} lastName={lead.creatorLastName|| ''}
            avatar={true}
          />
          <div className={css.invitedBtn}>
            <a onClick={acceptedDelegate} className={css.accpetInvited}>{_l`Accept`}</a>
            <a onClick={declineDelegate} className={css.declineInvited}>{_l`Decline`}</a>
          </div>
        </div>
      );
    }
    return (
      <div className={css.responsibleRow}>
        { ( lead.source != 'LEADBOXER') &&
        <CreatorPane size={30} creator={{ avatar: lead.creatorAvatar, disc: lead.creatorDiscProfile }} avatar={true}
                     firstName={lead.creatorFirstName|| ''} lastName={lead.creatorLastName|| ''}/>
        }
        {( lead.source == 'LEADBOXER' ) &&
        <CreatorPane size={30} creator={{ avatar: null, disc: lead.creatorDiscProfile }} avatar={true} showGlobal={true}/>
        }

        <div className={css.rightMenu}>
          <div className={css.reponsibleIconSize} />

          <div className={css.reponsibleIconSize}>
            {lead.finished ? (
              <HistoryUnqualifiMenu className={css.bgMore} contact={lead} overviewType={overviewType} />
            ) : (
              <DelegationLeadActionMenu className={css.bgMore} unqualifiedDeal={lead} overviewType={overviewType} />
            )}
          </div>
        </div>
      </div>
    );
  };
  const getDelegationDays = (lead) => {
    let currentDate = new Date();
    let distributionDate = new Date(lead.distributionDate);
    let timeDiff = Math.abs(currentDate.getTime() - distributionDate.getTime());
    let date = Math.floor(timeDiff / (1000 * 3600 * 24));

    // companyAvgDistributionDays got from server
    // let companyAvgDistributionDays;
    if (companyAvgDistributionDays == null) companyAvgDistributionDays = 0;

    if (date < companyAvgDistributionDays * 0.75) {
      return css.textGreen;
    } else if (date >= companyAvgDistributionDays * 0.75 && date <= companyAvgDistributionDays) {
      return css.textYellow;
    } else {
      return css.textRed;
    }
    return '';
  };
  return (
    <div className={listCn} style={style} onClick={goto}>
      <div className={`${css.content} ${css[lead.status]}`}>


      <div className={css.check}>
        <Checkbox onChange={select} checked={selected} />
      </div>
      {/* {showSpiner && <div className={css.check} />} */}
      <div className={css.priority2}>
        <Thermometer unQualified={lead} degree={lead.priority} small />
      </div>
      <div className={css.deadline}>
        {!lead.finished ? (
          <div>{finishedDate === null ? (deadlineDate ? moment(deadlineDate).format('DD MMM YYYY') : '') : ''}</div>
        ) : (
          <div>
            <p>{moment(createdDate).format('DD MMM YYYY HH:mm')}</p>
            {moment(finishedDate).format('DD MMM YYYY HH:mm')}
          </div>
        )}
      </div>
      <div className={css.contact}>
        <div className={cx(css.responsibleRow, css.nameRow)}>
          <div style={{ marginRight: 5 }}>
            <div className={css.customName}>
              {lead.contactFirstName} {lead.contactLastName}{' '}
            </div>
            <div className={onlyConnectAccount && css.customName}>{lead.organisationName}</div>
          </div>
          <ContactPopup triggerClassName={css.infoTrigger} name={''} email={email} phone={phone} />
        </div>
      </div>
      <div className={css.interest}>
        <div>{interestTitle}</div>
        <div>{interestSubtitle}</div>
      </div>
      <div className={css.days}>
        {!lead.finished ? <div className={cx(css.daysFont, getDelegationDays(lead))}>{days}</div> : ''}
      </div>
      <div className={css.responsible}>
        {/* {lead.source === 'NONE' && <Avatar src={lead.creator.avatar} />}
        {lead.source !== 'NONE' && <img src="/global_red.png" />} */}
        {renderActionSpinder(lead)}
      </div>
      </div>
    </div>
  );
};

const makeMapStateToProps = () => {
  const getLead = makeGetLead();
  const mapStateToProps = (state, { overviewType, itemId }) => {
    const showSpiner = isShowSpiner(state, overviewType);
    const companyAvgDistributionDays = getCompanyAvgDistributionDays(state, overviewType);
    return {
      lead: getLead(state, itemId),
      selected: isItemSelected(state, overviewType, itemId),
      highlighted: isItemHighlighted(state, overviewType, itemId),
      showSpiner,
      companyAvgDistributionDays: companyAvgDistributionDays,
    };
  };
  return mapStateToProps;
};

export default compose(
  withRouter,
  connect(
    makeMapStateToProps,
    {
      highlight: OverviewActions.highlight,
    }
  ),
  branch(({ lead }) => !lead, renderNothing),
  withHandlers({
    goto: ({ lead, history, route = '/delegation/leads', highlight, overviewType }) => () => {
      highlight(overviewType, lead.uuid);
      history.push(`${route}/${lead.uuid}`);
    },
    select: ({ select, lead }) => (event, { checked }) => {
      event.stopPropagation();
      select(lead.uuid, checked);
    },
    acceptedDelegate: ({ overviewType, highlight, lead }) => (e) => {
      e.stopPropagation();
      highlight(overviewType, lead.uuid, 'acceptedDelegate');
    },
    declineDelegate: ({ overviewType, highlight, lead }) => (e) => {
      e.stopPropagation();
      highlight(overviewType, lead.uuid, 'declineDelegate');
    },
  })
)(InfiniteLeadListRow);
